import * as React from 'react';
import {Component} from 'react';
import './index.css';
import LeaderLine from "leader-line-new";
import {cloneDeep} from "lodash";


class VisualizerReport extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedCourse: "",
            showDescriptions: {},
        };

        this.stickyDescriptionIndex = null;
        this.courseList = [];
        this.divRefs = [];
    }

    /**
     * show the prerequisite and corequisite of a course by lines when click detected
     *
     * */
    handleOnClick = (courses, index, update, lineMap, reqMap) => {

        const selectedCourse = courses[index].name;

        // removes all the lines when click a course the second time
        if (lineMap.has(selectedCourse)) {
            lineMap.get(selectedCourse).map((line) => {
                line.remove();
            });
            lineMap.delete(selectedCourse);
            update(lineMap);

        } else {
            this.setState({
                selectedCourse: selectedCourse,
            });

            const selectedRef = this.divRefs[index];

            if (reqMap[courses[index].name] !== undefined && reqMap[courses[index].name].preRe != null) {
                const reqList = reqMap[courses[index].name].preRe;
                this.handleLine(reqList, lineMap, selectedCourse, update, courses, selectedRef, true, false);
            }

            if (reqMap[courses[index].name] !== undefined && reqMap[courses[index].name].coRe != null) {
                const reqList = reqMap[courses[index].name].coRe;
                this.handleLine(reqList, lineMap, selectedCourse, update, courses, selectedRef, false, false);
            }

            if (reqMap[courses[index].name] !== undefined && reqMap[courses[index].name].postReq != null) {
                const reqList = reqMap[courses[index].name].postReq;
                this.handleLine(reqList, lineMap, selectedCourse, update, courses, selectedRef, true, true);
            }

            if (reqMap[courses[index].name] !== undefined && reqMap[courses[index].name].cocoRe != null) {
                const reqList = reqMap[courses[index].name].cocoRe;
                this.handleLine(reqList, lineMap, selectedCourse, update, courses, selectedRef, false, true);
            }

        }
    }


    handleLine = (reqList, lineMap, selectedCourse, update, courses, selectedRef, preOrCo, preOrPost) => {

        reqList.map((requisite) => {

            // remove duplicate lines
            lineMap.forEach((value, key) => {
                lineMap.get(key).map((line) => {
                    let lineText;

                    if (preOrPost) {
                        lineText = line.start.textContent;
                    } else {
                        lineText = line.end.textContent;
                    }

                    if (key === requisite && lineText === selectedCourse) {
                        line.remove();
                        const updatedLines = lineMap.get(key).filter((indivLine) => indivLine !== line);
                        lineMap.set(key, updatedLines);

                        if (lineMap.get(key).length === 0) {
                            lineMap.delete(key);
                        }
                    }
                })
            })

            update(lineMap);

            const courseWithRequisite = courses.find((course, index) => {
                return requisite === course.name;
            })

            const requisiteIndex = courseWithRequisite ? courses.indexOf(courseWithRequisite) : null;

            if (requisiteIndex !== null) {
                if (preOrPost) {
                    const endRef = this.divRefs[requisiteIndex];
                    lineMap = this.handleLineDrawing(selectedRef, endRef, lineMap, selectedCourse, preOrCo);
                    update(lineMap);
                } else {
                    const startRef = this.divRefs[requisiteIndex];
                    lineMap = this.handleLineDrawing(startRef, selectedRef, lineMap, selectedCourse, preOrCo);
                    update(lineMap);
                }
            } else {
                console.log(`Requisites for ${selectedRef.textContent} not found.`);
            }
        })
    }

    handleLineDrawing = (startRef, endRef, lineMap, selectedCourse, type) => {
        let line;

        if (type) {
            line = new LeaderLine(startRef, endRef, {
                color: '#f8c006',
            });
        } else {
            line = new LeaderLine(startRef, endRef, {
                color: '#000080',
                dash: {},
            })
        }

        if (!lineMap.has(selectedCourse)) {
            lineMap.set(selectedCourse, []);
        }

        if (!lineMap.get(selectedCourse).includes(line)) {
            lineMap.get(selectedCourse).push(line);
        }

        return lineMap;
    }

    /**
     *
     * Loop through and redraw the leader lines when a scroll occurs in the termWrapper box
     *
     */
    handleScroll = (lineMap) => {
        Array.from(lineMap.entries()).map((course) => {
            course[1].map((line) => {
                line.position();
            });
        });

        console.log("render function is called");
    }


    /**
     * render the individual course div
     * */
    renderCourseDiv = (coursesList, index, courseItem, name) => {

        const className = 'resultsCourses';

        let backgroundColor;
        if (typeof courseItem.color === 'string') {
            backgroundColor = courseItem.color;
        } else if (Array.isArray(courseItem.color)) {
            if (courseItem.color.length === 0) {
                backgroundColor = "#ced4da";
            } else {
                const percentage = 100 / courseItem.color.length;
                const gradientColors = courseItem.color.map((color, i) => {
                    const start = percentage * i;
                    const end = percentage * (i + 1);
                    return `${color} ${start}%, ${color} ${end}%`;
                });
                backgroundColor = `linear-gradient(to right, ${gradientColors.join(',')})`;
            }
        }

        name = name.includes('(') ? name.replace(/\(.*?\)/g, '') : name;

        // url part
        let courseLink;

        const regex = /\d/;
        if (regex.test(name)) {
            let parts = name.match(/([a-zA-Z\s]+)(\d+)/);

            let letterPart = parts[1].trim().replace(/\s/g, '_').toLowerCase();
            let numberPart = parts[2];

            courseLink = `https://apps.ualberta.ca/catalogue/course/${letterPart}/${numberPart}`;
        } else {
            courseLink = 'https://calendar.ualberta.ca/preview_program.php?catoid=39&poid=47347';
        }


        return (
            <div>
                <div className={className}
                     id={index.toString()}
                     key={index}
                     ref={(el) => this.divRefs[index] = el}
                     onClick={() => this.handleOnClick(coursesList, index, this.props.updateLineMap, this.props.lineMap, this.props.reqMap)}
                     style={{background: backgroundColor}}
                >
                    <div className="courseName" style={{height: '50%', width: '100%'}}>
                        {name}
                    </div>
                </div>
                {this.state.showDescriptions[index] &&
                    <div className="description">
                        <div className='extendedName'>
                            <a href={courseLink} target="_blank" rel="noopener noreferrer">
                                {courseItem.extendedName}
                            </a>
                        </div>
                        <br/>
                        <div className='descriptionDetails'>
                            {courseItem.description}
                            {courseItem.accreditionUnits && (
                                <>
                                    <br/>
                                    <b>Accreditation Unit:</b>
                                    <br/>
                                    {courseItem.accreditionUnits}
                                </>
                            )}

                        </div>
                    </div>}
            </div>
        )
    }

    render() {

        const {structure, lineMap} = this.props;

        let cloneStructure = cloneDeep(structure);
        let usedCourses = [];
        let courseMap = new Map();
        var newStructure = [];

        // // Gather a list of courses that have been placed in schedules
        // Array.from(this.props.tabMap).map(([key, value]) => {
        //     value.lectureTab.map((course) => {
        //         usedCourses.push(course);

        //     })
        // })

        // Get a map of course names and their respective info
        cloneStructure.map((term) => {
            term.courses.map((course) => {
                courseMap.set(course.name, course);
            })
        });

        // Loop through the courses placed in schedules and add them to a new structure array
        Array.from(this.props.tabMap).map(([term, value]) => {

            if (term !== "") {
                var courses = [];

                value.lectureTab.map((course) => {
                    if (courseMap.get(course)) {
                        courses.push(courseMap.get(course));
                    }
                    else {
                        courses.push({
                            accreditionUnits: "Engineering Science: 50.4",
                            attribute: [],
                            category: [],
                            corequisites: undefined,
                            courseGroup: null,
                            description: "",
                            extendedName: course,
                            name: course,
                            orCase: null,
                            prerequisites: undefined,
                        })
                    }
                })

                newStructure.push({term, courses});
            }
        })



        const coursesList = [].concat(...newStructure.map(term => term.courses
            .map(course => {
                course.name = course.name.replace(/\s*\([^)]*\)/g, '');
                return course;
            })
        ));

        let courseList = [];

        const term = newStructure.map((termColumn, termIndex) => {
            const courseDivs = termColumn.courses.map((courseItem, index) => {

                let name = courseItem.name;

                const nameReplaceMap = {
                    "COMP": "Complementary Studies",
                    "ITS": "ITS Electives",
                    "PROG": "Program/Technical Electives"
                };

                Object.keys(nameReplaceMap).forEach(key => {
                    if (name.includes(key)) {
                        name = name.replace(key, nameReplaceMap[key]);
                    }
                });

                const courseIndex = index;


              

                let indexx = courseList.length;
                courseList.push(courseItem.name);

                return this.renderCourseDiv(coursesList, indexx, courseItem, name, false);
                
            })


            return (
                <div className='resultsTerm'>
                    <div className='resultsTermTitle'>
                        {termColumn.term}
                    </div>
                    <div className='resultsCourseWrapper' >
                        {courseDivs}
                    </div>
                </div>
            )
        })

        return (
            <div className='outerStructureWrapper'>
                <div className="resultsTermWrapper"
                    onScroll={() => this.handleScroll(lineMap)}
                >
                    {term}
                </div>
            </div>
        )
    }
}

export default VisualizerReport
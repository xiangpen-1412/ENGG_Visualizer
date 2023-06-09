import * as React from 'react';
import {Component} from 'react';
import './index.css';
import 'react-tooltip/dist/react-tooltip.css'
import LeaderLine from "leader-line-new";
import {cloneDeep} from "lodash";


class Structure extends Component {

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
                const reqList = this.handleOrCase(reqMap[courses[index].name].preRe);
                this.handleLine(reqList, lineMap, selectedCourse, update, courses, selectedRef, true, false);
            }

            if (reqMap[courses[index].name] !== undefined && reqMap[courses[index].name].coRe != null) {
                const reqList = this.handleOrCase(reqMap[courses[index].name].coRe);
                this.handleLine(reqList, lineMap, selectedCourse, update, courses, selectedRef, false, false);
            }

            if (reqMap[courses[index].name] !== undefined && reqMap[courses[index].name].postReq != null) {
                const reqList = this.handleOrCase(reqMap[courses[index].name].postReq);
                this.handleLine(reqList, lineMap, selectedCourse, update, courses, selectedRef, true, true);
            }

            if (reqMap[courses[index].name] !== undefined && reqMap[courses[index].name].cocoRe != null) {
                const reqList = this.handleOrCase(reqMap[courses[index].name].cocoRe);
                this.handleLine(reqList, lineMap, selectedCourse, update, courses, selectedRef, false, true);
            }

        }
    }

    /**
     *
     *  Split the requisite (if there is one or more than one "or" in the requisites to several courses)
     *
     * */
    handleOrCase = (reqList) => {

        const updatedPreReList = [];

        for (let i = 0; i < reqList.length; i++) {
            const element = reqList[i];

            if (element.includes("or")) {
                // split by or
                const splittedElements = element.split("or");

                // add to new list
                updatedPreReList.push(...splittedElements.map((item) => item.trim()));
            } else {
                updatedPreReList.push(element);
            }
        }

        return updatedPreReList;
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

    handleMouseEnter = (index) => {
        const updatedShowDescriptions = Object.keys(this.state.showDescriptions).reduce((acc, key) => {
            acc[key] = false;
            return acc;
        }, {});

        updatedShowDescriptions[index] = true;

        this.setState({
            showDescriptions: updatedShowDescriptions,
        }, () => {
            this.adjustDescriptionPosition(index);
        });

        if (this.state.showDescriptions[index] === false) {
            this.stickyDescriptionIndex = null;
        }
    }

    handleMouseLeave = (index) => {

        if (index !== this.stickyDescriptionIndex) {
            this.setState({showDescriptions: {...this.state.showDescriptions, [index]: false}});
        }
    }

    /**
     * handle right click
     * */
    handleRightClick = (index, event) => {
        event.preventDefault();

        if (index === this.stickyDescriptionIndex) {
            this.stickyDescriptionIndex = null;
            this.setState({showDescriptions: {...this.state.showDescriptions, [index]: false}});
        } else {
            this.stickyDescriptionIndex = index;
            this.setState({showDescriptions: {...this.state.showDescriptions, [index]: true}}, () => {
                this.adjustDescriptionPosition(index);
            });
        }
    }

    /**
     * relocate the out of bound description
     * */
    adjustDescriptionPosition = (index) => {

        const descriptionDiv = document.querySelector('.description');
        const headerDiV = document.querySelector('.header');
        const courseDiv = document.getElementById(index.toString());

        if (descriptionDiv !== null && headerDiV !== null) {
            const descriptionRect = descriptionDiv.getBoundingClientRect();
            const headerRect = headerDiV.getBoundingClientRect();
            const courseRect = courseDiv.getBoundingClientRect();

            if (descriptionRect.right > headerRect.right) {
                const newLeftPosition = courseRect.right - descriptionRect.width + window.scrollX;
                descriptionDiv.style.left = newLeftPosition + "px";
            }
        }
    };

    /**
     * render the individual course div
     * */
    renderCourseDiv = (coursesList, index, courseItem, name, orCase) => {

        const className = (orCase) ? 'indivOrCourse' : 'indivCourses';

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

        let courseGroupBackGroundColor;

        if (courseItem.courseGroup) {
            const group = courseItem.courseGroup.match(/\d+/)[0];
            switch (group) {
                case "2":
                    courseGroupBackGroundColor = '#FFD700';
                    break;
                case "3":
                    courseGroupBackGroundColor = '#90EE90';
                    break;
                case "4":
                    courseGroupBackGroundColor = '#EE82EE';
                    break;
                default:
                    courseGroupBackGroundColor = null;
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
                     onContextMenu={(e) => this.handleRightClick(index, e)}
                     style={{background: backgroundColor}}
                     onMouseEnter={() => this.handleMouseEnter(index)}
                     onMouseLeave={() => this.handleMouseLeave(index)}
                     onMouseDown={() => this.handleMouseLeave(index)}
                >
                    <div className="courseName" style={{height: '50%', width: '100%'}}>
                        {name}
                    </div>
                    {this.props.courseGroupOnClick && courseItem.courseGroup &&
                        <div className="courseGroup"
                             style={{backgroundColor: courseGroupBackGroundColor, height: '50%', width: '100%'}}>
                            {courseItem.courseGroup}
                        </div>
                    }
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

        const coursesList = [].concat(...cloneStructure.map(term => term.courses
            .map(course => {
                course.name = course.name.replace(/\s*\([^)]*\)/g, '');
                return course;
            })
        ));

        let orCaseList = [];
        let courseList = [];

        const term = structure.map((termColumn, termIndex) => {
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

                let contains;
                if (orCaseList) {
                    contains = orCaseList.some((orCaseCourse) => courseItem.name.includes(orCaseCourse));
                }

                if (contains) {
                    orCaseList = orCaseList.filter((orCase) => {
                        return orCase !== courseItem.name;
                    });

                    if (orCaseList.length === 1) {
                        orCaseList = [];
                    }

                    return null;
                }

                if (courseItem.orCase) {

                    /**
                     * get the or course list
                     * */
                    orCaseList.push(courseItem.name);
                    orCaseList.push(courseItem.orCase);

                    while (index < termColumn.courses.length) {

                        if (termColumn.courses[index + 1].orCase) {
                            orCaseList.push(termColumn.courses[index + 1].orCase);
                        } else {
                            break;
                        }

                        if (index + 1 < termColumn.courses.length) {
                            index++;
                        }
                    }


                    /**
                     * iterate the orCaseList to create all the or case element
                     * */
                    const orCase = orCaseList.map((orCaseCourse, index) => {

                        let orCaseIndex = courseList.length;
                        courseList.push(orCaseCourse);

                        const orCaseCourseInfo = structure[termIndex].courses[courseIndex + index];

                        const orCourseElement = this.renderCourseDiv(coursesList, orCaseIndex, orCaseCourseInfo, orCaseCourse, true);

                        const orElement = (
                            <div className='orText'>OR</div>
                        );

                        if (index !== orCaseList.length - 1) {
                            return [orCourseElement, orElement];
                        } else {
                            return orCourseElement;
                        }
                    })

                    return (
                        <div className='orCaseDiv'>
                            {orCase}
                        </div>
                    )
                } else {

                    let indexx = courseList.length;
                    courseList.push(courseItem.name);

                    return this.renderCourseDiv(coursesList, indexx, courseItem, name, false);
                }
            })


            return (
                <div className='term'>
                    <div className='termTitle'>
                        {termColumn.term}
                    </div>
                    <div className='courseWrapper'>
                        {courseDivs}
                    </div>
                </div>
            )
        })

        return (
            <div className='outerStructureWrapper'>
                <div className="termWrapper"
                    onScroll={() => this.handleScroll(lineMap)}
                >
                    {term}
                </div>
            </div>
        )
    }
}

export default Structure
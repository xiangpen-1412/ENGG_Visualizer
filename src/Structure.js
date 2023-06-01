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
            shouldAdjustPosition: false,
        };

        this.courseList = [];
        this.orCaseList = [];
        this.divRefs = [];
    }

    componentDidMount() {
        window.addEventListener('scroll', this.handleWindowScroll);
    }

    handleWindowScroll = () => {

        if (this.state.showDescriptions !== {}) {
            const updatedShowDescriptions = Object.keys(this.state.showDescriptions).reduce((acc, key) => {
                acc[key] = false;
                return acc;
            }, {});

            this.setState({showDescriptions: updatedShowDescriptions});
        }
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
                this.handleLine(reqList, lineMap, selectedCourse, update, courses, selectedRef, false,false);
            }

            if (reqMap[courses[index].name] !== undefined && reqMap[courses[index].name].postReq != null) {
                const reqList = this.handleOrCase(reqMap[courses[index].name].postReq);
                this.handleLine(reqList, lineMap, selectedCourse, update, courses, selectedRef, true,true);
            }

            if (reqMap[courses[index].name] !== undefined && reqMap[courses[index].name].cocoRe != null) {
                const reqList = this.handleOrCase(reqMap[courses[index].name].cocoRe);
                this.handleLine(reqList, lineMap, selectedCourse, update, courses, selectedRef, false,true);
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
                color: 'black',
            });
        } else {
            line = new LeaderLine(startRef, endRef, {
                color: 'black',
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
    }

    handleMouseEnter = (indexx) => {

        /**
         * only one course description can be poped up at a time
         * */
        const updatedShowDescriptions = Object.keys(this.state.showDescriptions).reduce((acc, key) => {
            acc[key] = false;
            return acc;
        }, {});

        updatedShowDescriptions[indexx] = true;

        this.setState(
            {
                showDescriptions: updatedShowDescriptions,
                shouldAdjustPosition: true,
            },
            () => {
                if (this.state.shouldAdjustPosition) {
                    this.adjustDescriptionPosition(indexx);
                    this.setState({shouldAdjustPosition: false});
                }
            }
        );
    }

    handleMouseLeave = (indexx) => {
        this.setState({showDescriptions: {...this.state.showDescriptions, [indexx]: false}});
    }

    /**
     * relocate the out of bound description
     * */
    adjustDescriptionPosition = (indexx) => {

        const descriptionDiv = document.querySelector('.description');

        if (descriptionDiv !== null) {
            const rect = descriptionDiv.getBoundingClientRect();

            const structureWrapper = document.querySelector('.structureWrapper');
            const structureWrapperRect = structureWrapper.getBoundingClientRect();

            let courseDiv = document.getElementById(indexx.toString());

            if (courseDiv !== null) {
                let courseRect;
                courseRect = courseDiv.getBoundingClientRect();

                if (rect.bottom > structureWrapperRect.bottom) {
                    descriptionDiv.style.bottom = `${structureWrapperRect.bottom - courseRect.top - 60}px`;
                }

                if (rect.right > structureWrapperRect.right) {
                    descriptionDiv.style.left = `${structureWrapperRect.right - descriptionDiv.offsetWidth - courseRect.width}px`;
                }
            }
        }
    };

    /**
     * render the individual course div
     * */
    renderCourseDiv = (coursesList, index, courseItem, name, orCase) => {

        const className = (orCase) ? 'indivOrCourse' : 'indivCourses'

        return (
            <div>
                <div className={className}
                     id={index.toString()}
                     key={index}
                     ref={(el) => this.divRefs[index] = el}
                     onClick={() => this.handleOnClick(coursesList, index, this.props.updateLineMap, this.props.lineMap, this.props.reqMap)}
                     style={{backgroundColor: courseItem.color}}
                     onMouseEnter={() => this.handleMouseEnter(index)}
                     onMouseLeave={() => this.handleMouseLeave(index)}
                     onMouseDown={() => this.handleMouseLeave(index)}
                >
                    {name}
                </div>
                {this.state.showDescriptions[index] &&
                    <div className="description">
                        <strong>{courseItem.extendedName}</strong>
                        <br/>
                        <div>
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

        this.courseList = [];

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
                if (this.orCaseList) {
                    contains = this.orCaseList.some((orCaseCourse) => courseItem.name.includes(orCaseCourse));
                }

                if (contains) {
                    this.orCaseList = this.orCaseList.map((orCase) => {
                        if (orCase !== courseItem.name) {
                            return orCase;
                        }
                    })

                    if (this.orCaseList.length === 1) {
                        this.orCaseList = null;
                    }

                    return null;
                }

                if (courseItem.orCase) {

                    /**
                     * get the or course list
                     * */
                    let orCaseList = [];
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

                    this.orCaseList = orCaseList;

                    /**
                     * iterate the orCaseList to create all the or case element
                     * */
                    const orCase = orCaseList.map((orCaseCourse, index) => {

                        let orCaseIndex = this.courseList.length;
                        this.courseList.push(orCaseCourse);

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

                    let indexx = this.courseList.length;
                    this.courseList.push(courseItem.name);

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
            <p>
                <div className="termWrapper"
                     onScroll={() => this.handleScroll(lineMap)}
                >
                    {term}
                </div>
            </p>
        )
    }
}

export default Structure
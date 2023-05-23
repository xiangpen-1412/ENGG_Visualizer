import {Component} from 'react';
import './index.css';
import 'react-tooltip/dist/react-tooltip.css'
import LeaderLine from "leader-line-new";
import {cloneDeep, map} from "lodash";


class Structure extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedCourse: "",
        };

        this.orCaseList = [];
        this.divRefs = [];
    }

    /**
     * show the prerequisite and corequisite of a course by lines when click detected
     *
     * */
    handleOnClick = (courses, index, update, lineMap, reqMap) => {

        const selectedCourseName = courses[index].name;

        // removes all the lines when click a course again
        if (lineMap.has(selectedCourseName)) {
            lineMap.get(selectedCourseName).map((line) => {
                line.remove();
            });
            lineMap.delete(selectedCourseName);
            update(lineMap);

        } else {
            this.setState({
                selectedCourse: courses[index].name,
            });

            let selectedCourse = courses[index].name;

            const selectedRef = this.divRefs[index];

            if (reqMap[courses[index].name] !== undefined && reqMap[courses[index].name].preRe != null) {

                reqMap[courses[index].name].preRe.map((prerequisite) => {

                    // use dash line to show there is a or case
                    if (prerequisite.toLowerCase().includes("or")) {

                        let catalogs = this.handleOrCase(prerequisite);

                        catalogs.map((prerequisite) => {

                            const courseWitPrerequisite = courses.find((course) => {
                                return prerequisite === course.name;
                            });

                            const prerequisiteIndex = courseWitPrerequisite ? courses.indexOf(courseWitPrerequisite) : null;

                            if (prerequisiteIndex !== null) {
                                const startRef = this.divRefs[prerequisiteIndex];
                                const line = new LeaderLine(startRef, selectedRef, {
                                    color: 'red',
                                    dash: {},
                                });

                                if (!lineMap.has(selectedCourse)) {
                                    lineMap.set(selectedCourse, []);
                                }

                                if (!lineMap.get(selectedCourse).includes(line)) {
                                    lineMap.get(selectedCourse).push(line);
                                    update(lineMap);
                                }

                            } else {
                                console.log(`Prerequisites for ${selectedRef.textContent} not found.`);
                            }
                        })

                    } else {
                        // use solid line to show general case
                        const courseWitPrerequisite = courses.find((course, index) => {
                            return prerequisite === course.name;
                        })

                        const prerequisiteIndex = courseWitPrerequisite ? courses.indexOf(courseWitPrerequisite) : null;

                        if (prerequisiteIndex !== null) {
                            const startRef = this.divRefs[prerequisiteIndex];
                            const line = new LeaderLine(startRef, selectedRef, {
                                color: 'red',
                            });

                            if (!lineMap.has(selectedCourse)) {
                                lineMap.set(selectedCourse, []);
                            }

                            if (!lineMap.get(selectedCourse).includes(line)) {
                                lineMap.get(selectedCourse).push(line);
                                update(lineMap);
                            }

                        } else {
                            console.log(`Prerequisites for ${selectedRef.textContent} not found.`);
                        }
                    }
                })
            }
            ;

            if (reqMap[courses[index].name] !== undefined && reqMap[courses[index].name].coRe != null) {
                reqMap[courses[index].name].coRe.map((corequisite) => {

                    if (corequisite.toLowerCase().includes("or")) {

                        let catalogs = this.handleOrCase(corequisite);

                        catalogs.map((corequisite) => {
                            corequisite = corequisite.trimEnd().trimStart();
                            const courseWithCorequisite = courses.find((course) => {
                                return corequisite === course.name;
                            });

                            const corequisiteIndex = courseWithCorequisite ? courses.indexOf(courseWithCorequisite) : null;

                            if (corequisiteIndex !== null) {
                                const endRef = this.divRefs[corequisiteIndex];
                                const line = new LeaderLine(selectedRef, endRef, {
                                    color: 'red',
                                    dash: {},
                                });

                                if (!lineMap.has(selectedCourse)) {
                                    lineMap.set(selectedCourse, []);
                                }

                                if (!lineMap.get(selectedCourse).includes(line)) {
                                    lineMap.get(selectedCourse).push(line);
                                    update(lineMap);
                                }

                            } else {
                                console.log(`Corequisites for ${selectedRef.textContent} not found.`);
                            }
                        })
                    } else {

                        const courseWithCorequisite = courses.find((course) => {
                            return corequisite === course.name;
                        });

                        const corequisiteIndex = courseWithCorequisite ? courses.indexOf(courseWithCorequisite) : null;

                        if (corequisiteIndex != null) {
                            const endRef = this.divRefs[corequisiteIndex];
                            const line = new LeaderLine(selectedRef, endRef, {
                                color: 'red',
                            });

                            if (!lineMap.has(selectedCourse)) {
                                lineMap.set(selectedCourse, []);
                            }

                            if (!lineMap.get(selectedCourse).includes(line)) {
                                lineMap.get(selectedCourse).push(line);
                                update(lineMap);
                            }

                        } else {
                            console.log(`Corequisites for ${selectedRef.textContent} not found.`);
                        }
                    }
                });
            }
        }
    }


    /**
     *
     *  Split the requisite (if there is one or more than one "or" in the requisites to several courses)
     *
     * */
    handleOrCase = (requisite) => {

        let reqList = requisite.split("or");

        reqList = reqList.map((requisite) => {
            return requisite.trimEnd().trimStart();
        })

        return reqList;
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


    render() {

        const {structure, updateLineMap, lineMap, reqMap} = this.props;

        let cloneStructure = cloneDeep(structure);

        const coursesList = [].concat(...cloneStructure.map(term => term.courses
            .map(course => {
                course.name = course.name.replace(/\s*\([^)]*\)/g, '');
                return course;
            })
        ));

        let globalIndex = 0;

        const term = structure.map((termColumn) => {
            const courseDivs = termColumn.courses.map((courseItem, index) => {

                if (this.orCaseList.includes(courseItem.name)) {
                    return null;
                }

                const indexx = globalIndex;
                globalIndex++;
                let name = courseItem.name;

                if (name.includes("COMP")) {
                    name = name.replace("COMP", "Complementary Studies")
                } else if (courseItem.name.includes("ITS")) {
                    name = name.replace("ITS", "ITS Electives");
                } else if (courseItem.name.includes("PROG")) {
                    name = name.replace("PROG", "Program/Technical Electives");
                }

                if (courseItem.orCase) {

                    globalIndex--;
                    let orCaseIndex = globalIndex;

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

                    const orCase = orCaseList.map((orCaseCourse, index) => {
                        if (index !== orCaseList.length - 1) {
                            globalIndex++;

                            return (
                                <div>
                                    <div className='indivOrCourseOne'
                                         key={orCaseIndex}
                                         ref={(el) => this.divRefs[orCaseIndex] = el}
                                         onClick={() => this.handleOnClick(coursesList, orCaseIndex, updateLineMap, lineMap, reqMap)}
                                         style={{backgroundColor: courseItem.color}}
                                         onMouseEnter={(event) => this.props.showToolTip(event)}
                                         onMouseDown={(event) => this.props.hideToolTip(event)}
                                         onMouseLeave={(event) => this.props.hideToolTip(event)}
                                         data-tooltip-content={courseItem.description} data-tooltip-id='toolTip1'
                                         extendedName={courseItem.extendedName}
                                         accreditionUnits={courseItem.accreditionUnits}
                                    >
                                        {orCaseCourse}
                                    </div>
                                    <div className='orCircle'>
                                        <div className='orText'>OR</div>
                                    </div>
                                </div>
                            )
                        } else {

                            const indexTwo = globalIndex;
                            globalIndex++;

                            return (
                                <div className='indivOrCourseTwo'
                                     key={indexTwo}
                                     ref={(el) => this.divRefs[indexTwo] = el}
                                     onClick={() => this.handleOnClick(coursesList, indexTwo, updateLineMap, lineMap, reqMap)}
                                     style={{backgroundColor: courseItem.color}}
                                     onMouseEnter={(event) => this.props.showToolTip(event)}
                                     onMouseDown={(event) => this.props.hideToolTip(event)}
                                     onMouseLeave={(event) => this.props.hideToolTip(event)}
                                     data-tooltip-content={courseItem.description} data-tooltip-id='toolTip1'
                                     extendedName={courseItem.extendedName}
                                     accreditionUnits={courseItem.accreditionUnits}
                                >
                                    {orCaseCourse}
                                </div>
                            )
                        }
                    })

                    return (
                        <div className='orCaseDiv'>
                            {orCase}
                        </div>
                    )
                } else {
                    return (
                        <div className='indivCourses'
                             key={indexx}
                             ref={(el) => this.divRefs[indexx] = el}
                             onClick={() => this.handleOnClick(coursesList, indexx, updateLineMap, lineMap, reqMap)}
                             style={{backgroundColor: courseItem.color}}
                             onMouseEnter={(event) => this.props.showToolTip(event)}
                             onMouseDown={(event) => this.props.hideToolTip(event)}
                             onMouseLeave={(event) => this.props.hideToolTip(event)}
                             data-tooltip-content={courseItem.description} data-tooltip-id='toolTip1'
                             extendedName={courseItem.extendedName}
                             accreditionUnits={courseItem.accreditionUnits}
                        >
                            {name}
                        </div>
                    )
                }
            })


            return (
                <div className='term'>
                    <b style={{fontFamily: 'Times New Roman', fontSize: '20px'}}>
                        {termColumn.term}
                    </b>
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
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
        };

        this.divRefs = [];
    }

    /**
     * show the prerequisite and corequisite of a course by lines when click detected
     *
     * */
    handleOnClick = (courses, index, update, lineMap) => {

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

            if (courses[index].prerequisites != null) {

                courses[index].prerequisites.map((prerequisite) => {

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
                                    color: 'gold',
                                    dash: {},
                                });

                                if (!lineMap.has(selectedCourse)) {
                                    lineMap.set(selectedCourse, []);
                                }
                                lineMap.get(selectedCourse).push(line);
                                update(lineMap);

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
                                color: 'gold',
                            });

                            if (!lineMap.has(selectedCourse)) {
                                lineMap.set(selectedCourse, []);
                            }
                            lineMap.get(selectedCourse).push(line);
                            update(lineMap);

                        } else {
                            console.log(`Prerequisites for ${selectedRef.textContent} not found.`);
                        }
                    }
                })
            }
            ;

            if (courses[index].corequisites != null) {
                courses[index].corequisites.map((corequisite) => {

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
                                lineMap.get(selectedCourse).push(line);
                                update(lineMap);
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
                            lineMap.get(selectedCourse).push(line);
                            update(lineMap);

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
        const department = reqList[0].match(/[a-zA-Z\s]+/)[0].trimEnd();

        let catalogs = reqList.map((splitRequisite) => {
            if (/^\d+$/.test(splitRequisite)) {
                return (department + " " + splitRequisite);
            } else {
                return splitRequisite;
            }
        });

        return catalogs;

    }

    render() {

        const {structure, updateLineMap, lineMap} = this.props;

        let cloneStructure = cloneDeep(structure);

        const coursesList = [].concat(...cloneStructure.map(term => term.courses
            .map(course => {
                course.name = course.name.replace(/\s*\([^)]*\)/g, '');
                return course;
            })
        ));

        let globalIndex = 0;

        const term = structure.map((termColumn) => {
            const courseDivs = termColumn.courses.map((courseItem) => {

                const index = globalIndex;
                globalIndex++;
                let name = courseItem.name;

                if (name.includes("COMP")) {
                    name = name.replace("COMP", "Complementary Studies")
                } else if (courseItem.name.includes("ITS")) {
                    name = name.replace("ITS", "ITS Electives");
                } else if (courseItem.name.includes("PROG")) {
                    name = name.replace("PROG", "Program Electives");
                }

                return (
                    <div className='indivCourses'
                         key={index}
                         ref={(el) => this.divRefs[index] = el}
                         onClick={() => this.handleOnClick(coursesList, index, updateLineMap, lineMap)}
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

            })

            return (
                <div className='term'>
                    <b>
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
                <div className="termWrapper">
                    {term}
                </div>
            </p>
        )
    }
}

export default Structure
import {Component} from 'react';
import './index.css';
import 'react-tooltip/dist/react-tooltip.css'
import LeaderLine from "leader-line-new";


class Structure extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedCourse: "",
        };

        this.divRefs = [];
        this.startIndex = [];
    }

    handleOnClick = (courses, index) => {

        console.log(courses[index].prerequisites);
        console.log(courses[index].corequisites);

        this.startIndex.map((line) => {
            line.remove();
        });

        this.startIndex = [];

        this.setState({selectedCourse: courses[index].name.replace(/\s*\(.*?\)\s*/g, '')});
        let selectedCourse = courses[index].name.replace(/\s*\(.*?\)\s*/g, '');

        const selectedRef = this.divRefs[index];

        if (courses[index].prerequisites != null) {
            courses[index].prerequisites.map((prerequisite) => {

                if (prerequisite.toLowerCase().includes("or")) {

                    let preReqList = prerequisite.split("or");

                    const department = preReqList[0].match(/[a-zA-Z\s]+/)[0];

                    let catalogs = preReqList.map((splitPrerequisite) => {
                        if (/^\d+$/.test(splitPrerequisite)) {
                            return (department + splitPrerequisite).trimStart.trimEnd;
                        } else {
                            return splitPrerequisite.trimStart().trimEnd();
                        }
                    });
                    catalogs.map((prerequisite) => {
                        prerequisite = prerequisite.trimEnd().trimStart();
                        const courseWitPrerequisite = courses.find((course) => {
                            const courseNameWithoutParentheses = course.name.replace(/\s*\(.*?\)\s*/g, '');
                            return prerequisite === courseNameWithoutParentheses && course.name !== selectedCourse;
                        });

                        const prerequisiteIndex = courseWitPrerequisite ? courses.indexOf(courseWitPrerequisite) : null;

                        if (prerequisiteIndex !== null) {
                            const startRef = this.divRefs[prerequisiteIndex];
                            const line = new LeaderLine(startRef, selectedRef, {
                                color: 'gold',
                                dash: {},
                            });
                            this.startIndex.push(line);
                        } else {
                            console.log(`Prerequisites for ${selectedRef.textContent} not found.`);
                        }
                        ;
                    })

                } else {
                    const courseWitPrerequisite = courses.find((course, index) => {
                        return prerequisite === course.name && course.name !== selectedCourse;
                    })

                    const prerequisiteIndex = courseWitPrerequisite ? courses.indexOf(courseWitPrerequisite) : null;

                    if (prerequisiteIndex !== null) {
                        const startRef = this.divRefs[prerequisiteIndex];
                        const line = new LeaderLine(startRef, selectedRef, {
                            color: 'gold',
                        });
                        this.startIndex.push(line);
                    } else {
                        console.log(`Prerequisites for ${selectedRef.textContent} not found.`);
                    }
                    ;
                }
            })
        };

        if (courses[index].corequisites != null) {
            courses[index].corequisites.map((corequisite) => {

                if (corequisite.toLowerCase().includes("or")) {

                    let coReqList = corequisite.split("or");

                    const department = coReqList[0].match(/[a-zA-Z\s]+/)[0];

                    console.log(department);

                    let catalogs = coReqList.map((splitCorequisite) => {
                        if (/^\d+$/.test(splitCorequisite)) {
                            return (department + splitCorequisite).trimStart.trimEnd;
                        } else {
                            return splitCorequisite.trimStart().trimEnd();
                        }
                    });

                    catalogs.map((corequisite) => {
                        corequisite = corequisite.trimEnd().trimStart();
                        const courseWithCorequisite = courses.find((course) => {
                            const courseNameWithoutParentheses = course.name.replace(/\s*\(.*?\)\s*/g, '');
                            return corequisite === courseNameWithoutParentheses && course.name !== selectedCourse;
                        });

                        const corequisiteIndex = courseWithCorequisite ? courses.indexOf(courseWithCorequisite) : null;

                        if (corequisiteIndex !== null) {
                            const endRef = this.divRefs[corequisiteIndex];
                            const line = new LeaderLine(selectedRef, endRef,{
                                color: 'violet',
                                dash: {},
                            });
                            this.startIndex.push(line);
                        } else {
                            console.log(`Corequisites for ${selectedRef.textContent} not found.`);
                        }
                        ;
                    })
                } else {

                    const courseWithCorequisite = courses.find((course) => {
                        return corequisite === course.name.replace(/\s*\(.*?\)\s*/g, '') && course.name.replace(/\s*\(.*?\)\s*/g, '') !== selectedCourse;
                    });

                    console.log(courseWithCorequisite);
                    const corequisiteIndex = courseWithCorequisite ? courses.indexOf(courseWithCorequisite) : null;

                    if (corequisiteIndex != null) {
                        const endRef = this.divRefs[corequisiteIndex];
                        const line = new LeaderLine(selectedRef, endRef, {
                            color: 'violet',
                        });
                        this.startIndex.push(line);
                    } else {
                        console.log(`Corequisites for ${selectedRef.textContent} not found.`);
                    }
                    ;
                }
            });
        }

    }

    render() {

        const coursesList = [].concat(...this.props.structure.map(term => term.courses));

        let globalIndex = 0;

        const term = this.props.structure.map((termColumn) => {
            const courseDivs = termColumn.courses.map((courseItem) => {

                const index = globalIndex;
                globalIndex++;

                return (
                    <div className='indivCourses'
                         key={index}
                         ref={(el) => this.divRefs[index] = el}
                         onClick={() => this.handleOnClick(coursesList, index)}
                         style={{backgroundColor: courseItem.color}}
                         onMouseEnter={(event) => this.props.showToolTip(event)}
                         onMouseDown={(event) => this.props.hideToolTip(event)}
                         onMouseLeave={(event) => this.props.hideToolTip(event)}
                         data-tooltip-content={courseItem.description} data-tooltip-id='toolTip1'
                         extendedName={courseItem.extendedName}
                         accreditionUnits={courseItem.accreditionUnits}
                    >
                        {courseItem.name}
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
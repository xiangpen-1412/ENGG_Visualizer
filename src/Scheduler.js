import React, {Component, useEffect, useState} from "react";
import './Scheduler.css'
import {useLocation} from "react-router-dom";
import RESTController from "./controller/RESTController";

const PageTitle = (props) => {

    return (
        <div className='pageTitleScheduler'>
            {props.selectedProgram} Scheduler
        </div>
    )
}

const Plan = (props) => {

    const location = useLocation();
    const {selectedProgram} = location.state;

    const plan = props.selectedPlan;

    const planName = (
        <div className="planText">
            {props.selectedPlan.replace(/\{[^)]*\}/g, "").trimEnd().trimStart()}
        </div>
    );

    let courseGroup;

    if (plan.includes("{")) {
        const start = plan.indexOf("{") + 1;
        const end = plan.indexOf("}");
        const groups = plan.substring(start, end);
        courseGroup = (
            <div className="courseGroupText">
                {groups}
            </div>
        );
    }

    let planTube;

    if (selectedProgram === "Mechanical Engineering" && !plan.includes("Co-op Plan 3")) {
        planTube = [planName, courseGroup];
    } else {
        planTube = [planName];
    }

    return (
        <div>
            <div className="SelectedPlanDescription">SELECTED PLAN</div>
            <div className="sectionDescription">Return to the visualizer to select different plans and course groups.
            </div>
            <div className="planTube">
                {planTube}
            </div>
        </div>
    )
}

const PlaceCourse = () => {

    return (
        <div>
            <div className='SelectedPlanDescription'>PLACE COURSE</div>
            <div className='sectionDescription'>Once you've selected a term, drag and drop courses from left-hand course
                palette onto the schedule
            </div>
        </div>
    )
}

const Terms = (props) => {
    const restController = new RESTController();
    const program = props.selectedProgram;
    const plan = props.selectedPlan;

    // set the term list and default selected term
    useEffect(() => {

        if (program !== "Mechanical Engineering" || plan.includes("{")) {
            restController.getTerms({programName: program, planName: props.selectedPlan}).then((terms) => {
                props.setTermList(terms);

                // set the default term
                if (props.selectedTerm === "") {
                    props.setSelectedTerm(terms[0]);
                }
            })
        }
    }, [props.selectedPlan]);

    // set the lecture, labs, and seminars information
    useEffect(() => {
        if (props.selectedProgram !== undefined && props.selectedPlan !== undefined && props.selectedTerm !== undefined) {
            const data = {
                programName: props.selectedProgram,
                planName: props.selectedPlan,
                termName: props.selectedTerm,
            }

            restController.getLecs(data).then((lecs) => {
                props.setLecInfo(lecs);
            });

            restController.getLabs(data).then((labs) => {
                props.setLabInfo(labs);
            });

            restController.getSems(data).then((sems) => {
                props.setSemInfo(sems);
            });
        }
    }, [props.selectedProgram, props.selectedPlan, props.selectedTerm]);

    const terms = props.termList.map((term) => {

        const isSelected = props.selectedTerm === term;
        const className = isSelected ? 'selectedIndivTerm' : 'indivTerm';

        return (
            <div
                className={className}
                onClick={() => props.setSelectedTerm(term)}
            >
                {term}
            </div>
        );
    })

    return (
        <div className='termTube'>
            {terms}
        </div>
    )
}

const DropDownSign = (props) => {

    const addSign = (
        <img alt="plus" src="plus.png" className="plus"/>
    )

    const minusSign = (
        <img alt="minus" src="minus-sign.png" className="minus"/>
    )

    if (props.isDropDown) {
        return addSign;
    } else {
        return minusSign;
    }
}

const Lecs = (props) => {

    const [lectureTab, setLectureTab] = useState([]);

    const isDropDown = props.dropDownClick[0];

    const onSignClick = () => {
        props.setDropDownClick(0);
    }

    useEffect(() => {
        if (props.lecInfo && props.lecInfo.length > 0) {
            const lectures = props.lecInfo.map((lecture) => {
                    return lecture.name;
                }
            )
            setLectureTab(lectures);
        }
    }, [props.lecInfo]);

    const lectures = lectureTab.map((lecture) => {
        return (
            <div className='indivLecture'>
                {lecture}
            </div>
        )
    })

    return (
        <div>
            <div className='coursePalette'>
                <div className='coursePaletteTitle'>
                    Lectures
                </div>
                <div className='coursePaletteDropDownButton' onClick={onSignClick}>
                    <DropDownSign isDropDown={isDropDown}/>
                </div>
            </div>
            {!isDropDown && (
                <div className='coursesInfo'>
                    {lectures}
                </div>
            )}
        </div>
    )
}
const Labs = (props) => {

    const [labTab, setLabTab] = useState([]);

    const isDropDown = props.dropDownClick[2];

    const onSignClick = () => {
        props.setDropDownClick(2);
    }


    useEffect(() => {
        if (props.labInfo && props.labInfo.length > 0) {
            const labs = props.labInfo.map((lab) => {
                return lab.name;
            })
            setLabTab(labs);
        } else {
            setLabTab(null);
        }
    }, [props.labInfo]);

    let labs;
    if (labTab !== null) {
        labs = labTab.map((lab) => {
            return (
                <div className='indivLab'>
                    {lab}
                </div>
            )
        })
    } else {
        labs = (
            <div className='empty'>
                No Labs
            </div>
        )
    }

    return (
        <div>
            <div className='labsPalette'>
                <div className='labsPaletteTitle'>
                    Labs
                </div>
                <div className='labsPaletteDropDownButton' onClick={onSignClick}>
                    <DropDownSign isDropDown={isDropDown}/>
                </div>
            </div>
            {!isDropDown && (
                <div className='coursesInfo'>
                    {labs}
                </div>
            )}
        </div>
    )
}
const Seminars = (props) => {

    const [seminarTab, setSeminarTab] = useState([]);

    const isDropDown = props.dropDownClick[1];

    const onSignClick = () => {
        props.setDropDownClick(1);
    }

    useEffect(() => {
        if (props.semInfo && props.semInfo.length > 0) {
            const seminars = props.semInfo.map((seminar) => {
                    return seminar.name;
                }
            )
            setSeminarTab(seminars);
        } else {
            setSeminarTab(null);
        }
    }, [props.semInfo]);

    let seminars;
    if (seminarTab !== null) {
        seminars = seminarTab.map((seminar) => {
            return (
                <div className='indivSeminar'>
                    {seminar}
                </div>
            )
        })
    } else {
        seminars = (
            <div className='empty'>
                No Seminars
            </div>
        )
    }

    return (
        <div>
            <div className={`seminarsPalette ${isDropDown ? 'dropdownOpen' : ''}`}>
                <div className='seminarsPaletteTitle'>
                    Seminars
                </div>
                <div className='seminarsPaletteDropDownButton' onClick={onSignClick}>
                    <DropDownSign isDropDown={isDropDown}/>
                </div>
            </div>
            {!isDropDown && (
                <div className='coursesInfoBottom'>
                    {seminars}
                </div>
            )}
        </div>
    )
}

// timetable component
const Timetable = () => {
    const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const timeSlots = ['8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];

    return (
        <table className='timeTable'>
            <div className='tableWrapper'>
                <thead>
                <tr>
                    <th className='headerTimeCell'></th>
                    {weekDays.map(day => (
                        <td className="headerCell" key={day}>{day}</td>
                    ))}
                </tr>
                </thead>
                <tbody>
                {timeSlots.map(timeSlot => (
                    <tr key={timeSlot}>
                        <td className="timeCell">{timeSlot}</td>
                        {weekDays.map(day => (
                            <td key={day} className="cell"></td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </div>
        </table>
    );
};

class Scheduler extends Component {

    render() {

        const {
            selectedProgram,
            selectedPlan,
            termList,
            selectedTerm,
            dropDownClick,
            lecInfo,
            labInfo,
            semInfo,
        } = this.props;

        return (
            <div>
                <PageTitle selectedProgram={selectedProgram}/>
                <Plan
                    selectedProgram={selectedProgram}
                    selectedPlan={selectedPlan}
                />
                <PlaceCourse
                    selectedProgram={selectedProgram}
                    selectedPlan={selectedPlan}
                />
                <div>
                    <Terms
                        selectedProgram={selectedProgram}
                        selectedPlan={selectedPlan}
                        termList={termList}
                        setTermList={this.props.setTermList}
                        selectedTerm={selectedTerm}
                        setSelectedTerm={this.props.setSelectedTerm}
                        setLecInfo={this.props.setLecInfo}
                        setSemInfo={this.props.setSemInfo}
                        setLabInfo={this.props.setLabInfo}

                    />
                </div>
                <div className='mainTable'>
                    <div className='timeTableOptions'>
                        <Lecs
                            dropDownClick={dropDownClick}
                            setDropDownClick={this.props.setDropDownClick}
                            selectedProgram={selectedProgram}
                            selectedPlan={selectedPlan}
                            selectedTerm={selectedTerm}
                            lecInfo={lecInfo}
                        />
                        <Labs
                            dropDownClick={dropDownClick}
                            setDropDownClick={this.props.setDropDownClick}
                            selectedProgram={selectedProgram}
                            selectedPlan={selectedPlan}
                            selectedTerm={selectedTerm}
                            labInfo={labInfo}
                        />
                        <Seminars
                            dropDownClick={dropDownClick}
                            setDropDownClick={this.props.setDropDownClick}
                            selectedProgram={selectedProgram}
                            selectedPlan={selectedPlan}
                            selectedTerm={selectedTerm}
                            semInfo={semInfo}
                        />
                        {/*<Choose for me />*/}
                    </div>
                    <div className='timeTableTable'>
                        <Timetable/>
                    </div>
                </div>
            </div>
        )

    }
}

export default Scheduler;
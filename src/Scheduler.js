import React, {Component, useEffect} from "react";
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
            <div className="sectionDescription">Return to the visualizer to select different plans and course groups.</div>
            <div className="planTube">
                {planTube}
            </div>
        </div>
    )
}

const PlaceCourse = (props) => {

    const restController = new RESTController();
    const program = props.selectedProgram;

    useEffect(() => {
        restController.getTerms({programName: program, planName: props.selectedPlan}).then((terms) => {
            console.log(terms);
        })
    }, [props.selectedPlan])

    return (
        <div>
            <div className='SelectedPlanDescription'>PLACE COURSE</div>
            <div className='sectionDescription'>Once you've selected a term, drag and drop courses from left-hand course palette onto the schedule</div>
        </div>
    )
}

const Timetable = () => {
    const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const timeSlots = ['8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];

    return (
        <table>
            <thead>
            <tr>
                <th></th>
                {weekDays.map(day => (
                    <td className="headerCell" key={day}>{day}</td>
                ))}
            </tr>
            </thead>
            <tbody>
            {timeSlots.map(timeSlot => (
                <tr key={timeSlot}>
                    <td className="cell">{timeSlot}</td>
                    {weekDays.map(day => (
                        <td key={day} className="cell">{/* Add your event data here */}</td>
                    ))}
                </tr>
            ))}
            </tbody>
        </table>
    );
};

class Scheduler extends Component{

    render() {

        const {selectedProgram, selectedPlan} = this.props;

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
                <Timetable/>
            </div>
        )
    }
}

export default Scheduler;
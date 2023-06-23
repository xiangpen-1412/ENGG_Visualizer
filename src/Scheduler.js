import React, {Component} from "react";
import './Scheduler.css'
const PageTitle = (props) => {

    return (
        <div className='pageTitleScheduler'>
            {props.selectedProgram} Scheduler
        </div>
    )
}

const Plan = (props) => {

    const planName = (
        <div className="planTubeText">
            {props.selectedPlan}
        </div>
    );

    const courseGroupString = props.group2 + " " + props.group3 + " " + props.group4;

    const courseGroup = (
        <div className="planTubeText">
            {courseGroupString}
        </div>
    );

    let planTube;

    if (props.selectedProgram === "Mechanical Engineering" && !props.selectedPlan.includes("Co-op Plan 3")) {
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

class Scheduler extends Component{

    render() {

        const {selectedProgram, selectedPlan, group2, group3, group4} = this.props;

        return (
            <div>
                <PageTitle selectedProgram={selectedProgram}/>
                <Plan
                    selectedProgram={selectedProgram}
                    selectedPlan={selectedPlan}
                    group2={group2}
                    group3={group3}
                    group4={group4}
                />
            </div>
        )
    }
}

export default Scheduler;
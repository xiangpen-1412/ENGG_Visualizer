import React, {Component, useState} from 'react';
import './App.css';
import './index.css';
import Structure from './Structure.js';
import {useLocation} from 'react-router-dom';
import RESTController from "./controller/RESTController";


const GradAttributes = (props) => {
    const cells = props.gradAttributeList.map((gradAttribute, index) => {
        return (
            <div
                key={index}
                className="indvGradAttribute"
                onClick={(event) => {
                    props.setGradAttributeColor(event, gradAttribute)
                }}
            >
                {gradAttribute}
            </div>
        )
    })

    return (
        <div className="gradAttributePalette">
            <h3>Graduate Attributes</h3>
            {cells}
        </div>
    )
}

const CourseCatagory = (props) => {
    const cells = props.CatagoryList.map((catagory, index) => {
        return (
            <div
                key={index}
                className="indvCatagory"
                onClick={(event) => {
                    props.setCatagoryColor(event, catagory)
                }}
            >
                {catagory.name}
            </div>
        )
    })

    return (
        <div className="courseCategoryPalette">
            <h3>Course Category</h3>
            {cells}
        </div>
    )
}

const GALegend = (props) => {
    const cells = props.GALegendList.map((gradLegendItem, index) => {
        return (
            <div
                key={index}
                style={{backgroundColor: gradLegendItem.color}}
            >
                {gradLegendItem.name}
            </div>

        )
    })

    return (
        <div className="gradAttributeLegend">
            <h3>Graduate Attributes Legend</h3>
            {cells}
        </div>
    )
}

//Plans has to be a simple component as it contains navigation
const Plans = (props) => {
    // Retrieve selectedProgram
    const location = useLocation()
    const {selectedProgram} = location.state

    // const planList = // Call Ji's function to get plan data using selectedprogram
    const data = {
        programName: "Mechanical Engineering"
    };

    //TODO: call the function to pass the data
    let controller = new RESTController();

    const [planList, setplanList] = useState([]);

    controller.getPlans(data).then((plans) => {
        setplanList(plans);
    })

    const cells = planList.map((plan, index) => {
        return (
            <div
                key={index}
                programInfo={plan}
                className="indvPlan"
                onClick={(event) => {
                    props.setSelectedProgramPlan(selectedProgram, plan)
                    console.log(selectedProgram, plan,)
                }}
            >
                {plan}
            </div>
        )
    })

    return (
        <div className="planPalette">
            <h3>Plans</h3>
            {cells}
        </div>
    )
}

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            termList: [
                "Fall Term 1",
                "Winter Term 2",
                "Fall Term 3",
                "Winter Term 4",
            ],

            gradAttributeList: [
                "Knowledge Base for Engineering",
                "Problem Analysis",
                "Investigation",
                "Design",
                "Engineering Tools",
                "Indiv and Teamwork",
                "Communication Skills",
                "Professionalism",
                "Impact on Society",
                "Ethics and Equity",
                "Economics and Mgt",
                "Life-long-learning"
            ],

            CatagoryList: [
                {
                    name: "Math",
                    color: "#ff5050",
                },
                {
                    name: "Natural Sciences",
                    color: "#a2fab0",
                },
                {
                    name: "Engineering Sciences",
                    color: "#66ccff",
                },
                {
                    name: "Engineering Design",
                    color: "#ff9900",
                },
                {
                    name: "Engineering Profession",
                    color: "#ff78c0",
                },
                {
                    name: "COMP",
                    color: "#9c78ff",
                },
                {
                    name: "PROG",
                    color: "#ffd978",
                },
                {
                    name: "ITS",
                    color: "#073ff3",
                },
                {
                    name: "Other",
                    color: "#5ce0c4",
                },
            ],

            GALegendList: [

                {
                    name: "Introduced",
                    color: 'white',
                },

                {
                    name: "Developed",
                    color: '#eca5a0',
                },

                {
                    name: "Applied",
                    color: '#e7574d',
                },

                {
                    name: "Collected",
                    color: '#e93427',
                },

            ],

            structure: [],
            selectedAtt: "",
            selectedGroup: "",
        };

        this.controller = new RESTController();
    }

    showToolTip = (event) => {
        this.setState({isToolTipOpen: true})
    }

    hideToolTip = (event) => {
        this.setState({isToolTipOpen: false})
    }

    setGradAttributeColor = (event, gradAttribute) => {

        let attributeIndex = 0;
        const {structure} = this.state

        if (gradAttribute == this.state.selectedAtt) {
            this.setState({selectedAtt: ""});
            structure.map((term, termIndex) => {
                term.courses.map((courseMap, courseIndex) => {
                    structure[termIndex].courses[courseIndex].color = '#8C6565';
                })
            })
        } else {
            switch (gradAttribute) {
                case "Knowledge Base for Engineering":
                    attributeIndex = 0;
                    break;
                case "Problem Analysis":
                    attributeIndex = 1;
                    break;
                case "Investigation":
                    attributeIndex = 2;
                    break;
                case "Design":
                    attributeIndex = 3;
                    break;
                case "Engineering Tools":
                    attributeIndex = 4;
                    break;
                case "Indiv and Teamwork":
                    attributeIndex = 5;
                    break;
                case "Communication Skills":
                    attributeIndex = 6;
                    break;
                case "Professionalism":
                    attributeIndex = 7;
                    break;
                case "Impact on Society":
                    attributeIndex = 8;
                    break;
                case "Ethics and Equity":
                    attributeIndex = 9;
                    break;
                case "Economics and Mgt":
                    attributeIndex = 10;
                    break;
                case "Life-long-learning":
                    attributeIndex = 11;
                    break;
                default:
                    attributeIndex = 0;
            }

            structure.map((term, termIndex) => {
                term.courses.map((courseMap, courseIndex) => {
                    let attributeLevel = courseMap.attribute[attributeIndex]

                    if (attributeLevel == 0) {
                        structure[termIndex].courses[courseIndex].color = 'white';
                    } else if (attributeLevel == 1) {
                        structure[termIndex].courses[courseIndex].color = '#eca5a0';
                    } else if (attributeLevel == 2) {
                        structure[termIndex].courses[courseIndex].color = '#e7574d';
                    } else if (attributeLevel == 3) {
                        structure[termIndex].courses[courseIndex].color = '#e93427';
                    }
                })
            })

            this.setState({
                structure: structure,
                selectedAtt: gradAttribute,
            })
        }

    }

    setCatagoryColor = (event, catagory) => {

        let catagoryIndex = 0;
        const {structure} = this.state

        if (this.state.selectedGroup == catagory) {
            this.setState({selectedGroup: ""});
            structure.map((term, termIndex) => {
                term.courses.map((courseMap, courseIndex) => {
                    structure[termIndex].courses[courseIndex].color = "#8C6565";
                })
            })
        } else {
            switch (catagory.name) {
                case "Math":
                    catagoryIndex = 0;
                    break;
                case "Natural Sciences":
                    catagoryIndex = 1;
                    break;
                case "Engineering Sciences":
                    catagoryIndex = 2;
                    break;
                case "Engineering Design":
                    catagoryIndex = 3;
                    break;
                case "Engineering Profession":
                    catagoryIndex = 4;
                    break;
                case "COMP":
                    catagoryIndex = 5;
                    break;
                case "PROG":
                    catagoryIndex = 6;
                    break;
                case "ITS":
                    catagoryIndex = 7;
                    break;
                case "Other":
                    catagoryIndex = 8;
                    break;
                default:
                    catagoryIndex = 0;
            }

            structure.map((term, termIndex) => {
                term.courses.map((courseMap, courseIndex) => {
                    let catagoryLevel = courseMap.catagory[catagoryIndex]

                    if (catagoryLevel === 0) {
                        structure[termIndex].courses[courseIndex].color = "white";
                    } else if (catagoryLevel === 1) {
                        structure[termIndex].courses[courseIndex].color = catagory.color;
                    }

                })
            })

            this.setState({
                structure: structure,
                selectedGroup: catagory,
            })
        }
    }

    setSelectedProgramPlan = (oselectedProgram, selectedPlan) => {
        //     this.setState({selectedProgram: selectedProgram, selectedPlan: selectedPlan})
        //     // Call xiangpeng's function with selectedPrgram and selectedPlan to get structure

        const data = {
            programName: "Mechanical Engineering",
            planName: selectedPlan
        };

        this.controller.getCourseInfo(data).then((courses) => {
            this.setState({structure: courses});
        });
    }

    render() {
        const {structure} = this.state;
        return (
            <div className='all'>
                <div className='planWrapper'>
                    <Plans setSelectedProgramPlan={this.setSelectedProgramPlan}/>
                </div>

                <div className='idk'>
                    <GALegend GALegendList={this.state.GALegendList}/>
                </div>

                <div className="lowerStuff">
                    <div className='GAWrapper'>
                        <GradAttributes gradAttributeList={this.state.gradAttributeList}
                                        setGradAttributeColor={this.setGradAttributeColor}/>
                        {/* <GALegend GALegendList={this.state.GALegendList}/> */}
                    </div>

                    <div className='catagoryWrapper'>
                        <CourseCatagory CatagoryList={this.state.CatagoryList}
                                        setCatagoryColor={this.setCatagoryColor}/>

                    </div>
                </div>

                <div className='structureWrapper'>
                    <Structure structure={structure}
                               isToolTipOpen={this.state.isToolTipOpen}
                               showToolTip={this.showToolTip}
                               hideToolTip={this.hideToolTip}
                    />
                </div>
            </div>
        )
    }

}


export default App;

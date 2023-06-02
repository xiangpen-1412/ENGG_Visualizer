import React, {Component, useEffect, useState} from 'react';
import './App.css';
import './index.css';
import Structure from './Structure.js';
import {useLocation, useNavigate} from 'react-router-dom';
import RESTController from "./controller/RESTController";

const Header = (props) => {

    const location = useLocation();
    const {selectedProgram} = location.state;
    const navigate = useNavigate();
    const [showGuide, setShowGuide] = useState(false);

    const handleBackButtonClick = () => {
        props.deletelinemap();
        navigate("/");
    };

    const handleHelpButtonClick = () => {
        setShowGuide(!showGuide);
    }

    return (
        <header className="header">
            <div className="header-content">
                <button className="backButton" onClick={handleBackButtonClick}>
                    <a>← Back</a>
                </button>
                <div>
                    <a>
                        <img alt="University of Alberta logo" src="uofalogo.png" className="image"/>
                    </a>
                </div>
                <div className="site-title">
                    {selectedProgram} Program Plan Visualizer
                </div>
                <img alt="question mark" src="questionMark.png" className="questionMark"
                     onClick={handleHelpButtonClick}/>
            </div>

            {showGuide && (
                <div className="guideWrapper">
                    <Instructions/>
                </div>
            )}
        </header>
    );
};

const Instructions = () => {

    return (
        <div>
            <h3>Visualizer Instruction</h3>
            <p>Welcome to the University of Alberta's Engineering Program Plan Visualizer.</p>
            <p>This tool is designed to help you navigate the structure of your chosen program plan. </p>
            <p>Here is a guide to using the tool:</p>
            <ul>
                <li><strong>Select plans:</strong>
                    To see all the courses in a program, choose a plan from the Plan menu at the top. All
                    courses in 8 or more terms will be displayed below. For Mechanical Engineering, you will
                    need to select a group after selecting a plan.
                </li>
                <li><strong>Course Description:</strong> By hovering over a course in the terms below, you
                    can view its course description. This provides details about the course content, hours
                    and credits.
                </li>
                <li><strong>Prerequisites and Corequisites:</strong> Left-clicking on a course will display
                    any prerequisites with yellow arrows and corequisites with red arrows.
                </li>
                <li><strong>Course Group:</strong> Click on a course in the Course Group Palette to see all
                    the courses that belong to the course group. This is useful for getting an overview of
                    courses with similar content or learning objectives.
                </li>
                <li><strong>Graduation Attributes:</strong> Clicking on a graduate attribute in the Graduate
                    Attributes palette highlights each course in that category. The more red a course, the
                    more it embodies that attribute. Please refer to the Graduate Attributes legends for
                    more details. This displays where each learning outcome is met throughout a degree
                    program.
                </li>
            </ul>
            <p>We hope this tool aids your understanding of your chosen engineering program and supports
                your academic planning process. If you have any questions or encounter any difficulties,
                please do not hesitate to contact us at dnobes@ualberta.ca. </p>
        </div>
    );
}


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
        <div>
            <div className="gradAttTitle">GRADUATE ATTRIBUTES</div>
            <div className="gradAttributePalette">
                <div className="attributeDescription">Learn more about which courses satisfy your degree requirements.
                </div>
                {cells}
            </div>
        </div>
    )
}

const CourseCatagory = (props) => {

    const location = useLocation();
    const {selectedProgram} = location.state;

    const cells = props.categoryList.map((catagory, index) => {

        if (selectedProgram === "Computer Engineering") {
            if (index > 9) {
                return null;
            }

        } else if (selectedProgram === "Mechatronics Engineering") {
            if (index === 9) {
                return null;
            }

        } else {
            if (index > 8) {
                return null;
            }

        }
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
        <div>
            <div className="courseCategoryTitle">COURSE CATEGORIES</div>
            <div className="courseCategoryPalette">
                <div className="categoryDescription">Learn more about what categories your courses belong to.</div>
                {cells}
            </div>
        </div>

    )
}

// Legend for graduate attributes
const GALegend = (props) => {

    // Get the rows and colors of the legend
    const cells = props.gaLegendList.map((gradLegendItem, index) => {
        const className = "indivGALegend" + index;
        return (
            <div
                className={className}
                key={index}
                style={{backgroundColor: gradLegendItem.color}}
            >
                <b>{gradLegendItem.name}</b>
            </div>

        )
    })

    // Return full table component
    return (
        <div>
            <div className="gaLegend">LEGEND</div>
            <div className="gradAttributeLegend">
                <div className="attributeDescription">Learn more about graduate attributes levels.
                </div>
                {cells}
            </div>
        </div>
    )
}

const RequisiteLegend = () => {
    return (
        <div className='requisiteLegend'>
            <div className='requisiteLegendDescription'>Learn more about requisites symbols.</div>
            <div className='requisiteLegendBorder'>
                <div className='prerequisite'>
                    Prerequisites:
                    <img src="prerequisite.png" className='prerequisiteImage'/>
                </div>
                <div className='corequisite'>
                    Corequisties:
                    <img src="corequisite.png" className='corequisiteImage'/>
                </div>
            </div>
        </div>
    )
}


//Plans has to be a simple component as it contains navigation
const Plans = (props) => {

    const location = useLocation();
    const {selectedProgram} = location.state;
    const [planList, setPlanList] = useState([]);
    const [selectedPlan, setSelectedPlan] = useState(null);

    useEffect(() => {
        const controller = new RESTController();
        controller.getPlans({programName: selectedProgram}).then((plans) => {
            setPlanList(plans);
        });
    }, [selectedProgram]);

    let planSet = new Set();
    const cells = planList.map((plan, index) => {

        // Remove unwanted characters from start and end of MecE plans
        if (selectedProgram === "Mechanical Engineering") {
            plan = plan.replace(/\{[^)]*\}/g, "").trimEnd().trimStart();

            if (planSet.has(plan)) {
                return null;
            }

            planSet.add(plan);
        }

        const isSelected = plan === selectedPlan;

        // Return component with individual plan
        return (
            <div
                key={index}
                programinfo={plan}
                className="indvPlan"
                onClick={(event) => {
                    setSelectedPlan(plan);
                    props.setSelectedProgramPlan(selectedProgram, plan);
                }}
                style={{backgroundColor: isSelected ? "rgb(39, 93, 56)" : "rgb(255, 255, 255)"}}
            >
                {plan}
            </div>
        )
    })

    // Return component with all the discipline's plans
    return (
        <div className="allPlans">
            <h3>SELECT A PLAN</h3>
            <div className="planPalette">
                {cells}
            </div>
        </div>
    )
}


const CourseGroup = (props) => {
    const courseGroupKeys = [...props.courseGroup.keys()];

    const [selectedButtons, setSelectedButtons] = useState(
        new Map(
            courseGroupKeys
                .filter((key) => ["group2", "group3", "group4"].includes(key))
                .map((key) => [key, null])
        )
    );

    useEffect(() => {
        if (props.planChanged) {
            const newSelectedButtons = new Map(selectedButtons);
            courseGroupKeys.forEach((key) => {
                newSelectedButtons.set(key, null);
            });
            setSelectedButtons(newSelectedButtons);
        }
    }, [props.planChanged]);

    const keyComponent = courseGroupKeys.map((key) => {
        const groupComponent = props.courseGroup.get(key).map((group) => {
            const isSelected = selectedButtons.get(key) === group;
            const color = isSelected ? "rgb(39, 93, 56)" : "rgb(255, 255, 255)";
            return (
                <div
                    className="indivCourseGroup"
                    key={group}
                    onClick={() => {
                        const newSelectedButtons = new Map(selectedButtons);
                        newSelectedButtons.set(key, group);
                        setSelectedButtons(newSelectedButtons);
                        props.setSelectedCourseGroup(group, props.deleteLineMap);
                    }}
                    style={{
                        backgroundColor: color
                    }}
                >
                    {group}
                </div>
            );
        });
        return (
            <div key={key}>
                <h3>{key}</h3>
                <div className="courseGroupPalatte">{groupComponent}</div>
            </div>
        );
    });

    if (props.planChanged) {
        props.setPlanChanged();
    }

    return <div className="allGroups">{keyComponent}</div>;
};


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

            categoryList: [
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
                {
                    name: "Computing Science",
                    color: "#ff9696",
                },
                {
                    name: "Mechatronics",
                    color: "#ff9966"
                },
                {
                    name: "SEMINARS",
                    color: "#00db25",
                },
                {
                    name: "LABS",
                    color: "#00d8db",
                },
                {
                    name: "CODING",
                    color: "#f5f500",
                },
                {
                    name: "CAD",
                    color: "#669999",
                },
                {
                    name: "Group Work",
                    color: "#f500e0",
                },
                {
                    name: "Solid Mechanics",
                    color: "#66ffb5",
                },
                {
                    name: "Thermo Fluids",
                    color: "#f500e0",
                },
                {
                    name: "Electrical",
                    color: "#74cc00",
                },
                {
                    name: "Control",
                    color: "#cc0000",
                },
                {
                    name: "Management",
                    color: "#666699",
                },
            ],

            gaLegendList: [
                {
                    name: "Introduced",
                    color: '#2697FF',
                },
                {
                    name: "Developed",
                    color: '#32D0F2',
                },
                {
                    name: "Applied",
                    color: '#80E4C6',
                },
                {
                    name: "Collected",
                    color: '#FFFFFF',
                },
            ],

            structure: [],
            reqMap: new Map(),
            courseGroup: new Map(),
            selectedAtt: "",
            selectedGroup: "",
            selectedProgram: "",
            selectedPlan: "",
            containCourseGroup: false,
            planChanged: false,
            group2: "",
            group3: "",
            group4: "",
            lineMap: new Map(),
        };

        this.controller = new RESTController();
    }


    componentDidMount() {
        window.addEventListener("popstate", this.deleteWhenPopstate);
    }

    deleteWhenPopstate = () => {
        this.deleteLineMap();
    }

    setGradAttributeColor = (event, gradAttribute) => {

        let attributeIndex = 0;
        const {structure} = this.state

        if (gradAttribute === this.state.selectedAtt) {
            this.setState({selectedAtt: ""});
            structure.map((term, termIndex) => {
                term.courses.map((courseMap, courseIndex) => {
                    structure[termIndex].courses[courseIndex].color = '#ced4da';
                    if (structure[termIndex].courses[courseIndex].border) {
                        delete structure[termIndex].courses[courseIndex].border;
                    }
                })
            })
        } else {
            // Get index of Grad Attribute from state array gradAttributeList
            attributeIndex = this.state.gradAttributeList.indexOf(gradAttribute);

            structure.map((term, termIndex) => {
                term.courses.map((courseMap, courseIndex) => {
                    let attributeLevel = courseMap.attribute[attributeIndex]

                    if (attributeLevel === 3) {
                        structure[termIndex].courses[courseIndex].border = '4px solid gold';
                    } else {
                        // Set red hue of each course based on grad attribute level
                        structure[termIndex].courses[courseIndex].color = this.state.gaLegendList[attributeLevel].color;
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

        if (this.state.selectedGroup === catagory) {
            this.setState({selectedGroup: ""});
            structure.map((term, termIndex) => {
                term.courses.map((courseMap, courseIndex) => {
                    structure[termIndex].courses[courseIndex].color = "#ced4da";
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
                case "Computing Science":
                    catagoryIndex = 9;
                    break;
                case "Mechatronics":
                    catagoryIndex = 10;
                    break;
                case "SEMINARS":
                    catagoryIndex = 11;
                    break;
                case "LABS":
                    catagoryIndex = 12;
                    break;
                case "CODING":
                    catagoryIndex = 13;
                    break;
                case "CAD":
                    catagoryIndex = 14;
                    break;
                case "Group Work":
                    catagoryIndex = 15;
                    break;
                case "Solid Mechanics":
                    catagoryIndex = 16;
                    break;
                case "Thermo Fluids":
                    catagoryIndex = 17;
                    break;
                case "Electrical":
                    catagoryIndex = 18;
                    break;
                case "Control":
                    catagoryIndex = 19;
                    break;
                case "Management":
                    catagoryIndex = 20;
                    break;
                default:
                    catagoryIndex = 0;
            }

            structure.map((term, termIndex) => {
                term.courses.map((courseMap, courseIndex) => {

                    let catagoryLevel = courseMap.category[catagoryIndex];

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

    setSelectedProgramPlan = (selectedProgram, selectedPlan) => {

        this.deleteLineMap();

        this.setState({selectedProgram: selectedProgram, selectedPlan: selectedPlan, structure: [], planChanged: true});
        this.setState({group2: "", group3: "", group4: ""});

        const haveCourseGroupOption = selectedProgram === "Mechanical Engineering" && !selectedPlan.includes("Co-op Plan 3");
        this.setState({containCourseGroup: haveCourseGroupOption}, () => {
            if (this.state.containCourseGroup) {
                this.setCourseGroup(selectedPlan);
            } else {
                this.setStructure(selectedProgram, selectedPlan);
            }
        });
    }

    setCourseGroup = (selectedPlan) => {

        switch (selectedPlan) {
            case "Traditional Plan":
                this.setState({
                    courseGroup: new Map([
                        ['Group 2', ["2A", "2B"]],
                        ['Group 3', ["3A", "3B"]],
                        ['Group 4', ["4A", "4B"]]
                    ])
                });
                break;
            case "Alternate Plan":
                this.setState({
                    courseGroup: new Map([
                        ['Group 3', ["3A", "3B"]],
                        ['Group 4', ["4A", "4B"]]
                    ])
                });
                break;
            case "Co-op Plan 1":
            case "Co-op Plan 2":
            case "Co-op Plan 4":
                this.setState({
                    courseGroup: new Map([
                        ['Group 3', ["3A", "3B"]]
                    ])
                });
                break;
            default:
                this.setState({courseGroup: []});
                break;
        }

    }

    setSelectedCourseGroup = (group, deleteLineMap) => {
        const groupNumber = group.toString().charAt(0);

        let group2, group3, group4 = "";

        switch (groupNumber) {
            case "2":
                this.setState({group2: group});
                group2 = group;
                group3 = this.state.group3;
                group4 = this.state.group4;
                break;
            case "3":
                this.setState({group3: group});
                group3 = group;
                group2 = this.state.group2;
                group4 = this.state.group4;
                break;
            case "4":
                this.setState({group4: group});
                group4 = group;
                group2 = this.state.group2;
                group3 = this.state.group3;
                break;
        }

        const plan = this.state.selectedPlan;

        switch (plan) {
            case "Traditional Plan":
                if (group2 && group3 && group4) {
                    const completePlan = plan + " {" + group2 + " " + group3 + " " + group4 + "}";
                    this.setStructure(this.state.selectedProgram, completePlan);
                    deleteLineMap();
                }
                break;
            case "Alternate Plan":
                if (group3 && group4) {
                    const completePlan = plan + " {" + group3 + " " + group4 + "}";
                    this.setStructure(this.state.selectedProgram, completePlan);
                    deleteLineMap();
                }
                break;
            case "Co-op Plan 1":
            case "Co-op Plan 2":
            case "Co-op Plan 4":
                if (group3) {
                    const completePlan = plan + " {" + group3 + "}";
                    this.setStructure(this.state.selectedProgram, completePlan);
                    deleteLineMap();
                }
                break;
        }

        this.setState({previousSelectedPlan: this.state.selectedPlan});
    }

    setStructure = (selectedProgram, selectedPlan) => {
        const data = {
            programName: selectedProgram,
            planName: selectedPlan
        };

        this.controller.getCourseInfo(data).then((courses) => {
            this.setState({structure: courses});
        });

        this.controller.getReqMap(data).then((reqMap) => {
            this.setState({reqMap: reqMap});
        })
    }

    updateLineMap = (update) => {
        this.setState({lineMap: update})
    }

    deleteLineMap = () => {
        for (let [key] of this.state.lineMap) {
            this.state.lineMap.get(key).map((line) => {
                if (line !== undefined) {
                    line.remove();
                }
            });
        }

        this.setState({lineMap: new Map()});
    }

    setPlanChanged = () => {
        this.setState({planChanged: false});
    }

    render() {
        const {structure, courseGroup, selectedProgram, selectedPlan, lineMap, planChanged, reqMap} = this.state;
        return (
            <div className='all'>

                <div className='header'>
                    <Header deletelinemap={this.deleteLineMap}/>
                </div>

                <div className='part'>
                    <div className='pageTitle'>
                        Engineering Plan Visualizer
                    </div>
                    <div className='planWrapper'>
                        <Plans setSelectedProgramPlan={this.setSelectedProgramPlan}
                        />
                    </div>

                    {this.state.containCourseGroup && (
                        <div>
                            <CourseGroup courseGroup={courseGroup}
                                         setSelectedCourseGroup={this.setSelectedCourseGroup}
                                         selectedProgram={selectedProgram}
                                         deleteLineMap={this.deleteLineMap}
                                         planChanged={planChanged}
                                         setPlanChanged={this.setPlanChanged}
                            />
                        </div>)}

                    <div className='additionOptions'>
                        ADDITIONAL OPTIONS
                    </div>

                    <div className="lowerStuff">
                        <div className='catagoryWrapper'>
                            <CourseCatagory categoryList={this.state.categoryList}
                                            setCatagoryColor={this.setCatagoryColor}
                            />

                        </div>

                        <div className='GAWrapper'>
                            <GradAttributes gradAttributeList={this.state.gradAttributeList}
                                            setGradAttributeColor={this.setGradAttributeColor}/>
                            {/* <GALegend gaLegendList={this.state.gaLegendList}/> */}
                        </div>

                        <div className='gradLegendWrapper'>
                            <GALegend gaLegendList={this.state.gaLegendList}/>
                            <RequisiteLegend/>
                        </div>
                    </div>

                    <div className='structureTitle'>COURSES</div>
                    <div className='structureDescription'>  Below are each of the courses in each semester in your selected plan. Hover over a course to
                        see it's course description. Click on a course to see it's prerequisites and coreqisites.
                    </div>
                    <div className='structureWrapper'>
                        <Structure structure={structure}
                                   isToolTipOpen={this.state.isToolTipOpen}
                                   showToolTip={this.showToolTip}
                                   hideToolTip={this.hideToolTip}
                                   selectedPlan={selectedPlan}
                                   updateLineMap={this.updateLineMap}
                                   lineMap={lineMap}
                                   reqMap={reqMap}
                        />
                    </div>
                </div>


            </div>
        )
    }
}


export default App;

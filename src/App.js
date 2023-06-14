import React, {Component, useEffect, useState} from 'react';
import './App.css';
import './index.css';
import Dropdown from './Dropdown.js';
import Structure from './Structure.js';
import {useLocation, useNavigate} from 'react-router-dom';
import RESTController from "./controller/RESTController";


const PageTitle = () => {
    const location = useLocation();
    const {selectedProgram} = location.state;

    return (
        <div className='pageTitle'>
            {selectedProgram}
        </div>
    )
}

const HomeButtonIcon = () => {
    return (
        <svg className='homeButtonIcon' height="20" width="20" viewBox="0 0 20 20">
            <path
                d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"
                style={{transform: "rotate(270deg)", transformOrigin: "center", fill: "#7B7B7B"}}
            ></path>
        </svg>
    );
};

const Icon = () => {
    return (
        <svg height="20" width="20" viewBox="0 0 20 20">
            <path
                d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path>
        </svg>
    );
};

const Header = () => {

    const [showDropDown, setShowDropDown] = useState(false);
    const [showDescription, setShowDescription] = useState(false);

    const handleThreeDotsClick = () => {
        setShowDropDown(!showDropDown);
    }

    const handleHelpButtonClick = () => {
        setShowDescription(!showDescription);
        setShowDropDown(false);
    }

    const handleExportClick = () => {
        setShowDropDown(!showDropDown);
    }


    return (
        <header className="header">
            <div className="header-content">
                <img alt="University of Alberta logo" src="uofalogo.png" className="image"/>
                <div className="site-title">
                    Engineering Plan Visualizer
                </div>
                <img alt="three dots" src="three-dots.png" className="threeDots"
                     onClick={handleThreeDotsClick}/>
            </div>

            {showDropDown && (
                <div className='headerDropDown'>
                    <div
                        className='headerDropDownItem'
                        onClick={handleHelpButtonClick}
                    >
                        Help
                    </div>
                    <div
                        className='headerDropDownItem'
                        onClick={handleExportClick}
                    >
                        Export
                    </div>
                </div>
            )}

            {showDescription && (
                <div className="guideWrapper">
                    <Instructions onInstructionClick={handleHelpButtonClick}/>
                </div>
            )}

        </header>
    );
};

const Instructions = (props) => {

    return (
        <div>
            <img alt="delete button" src="x-mark.png" className="deleteButton"
                 onClick={props.onInstructionClick}/>
            <h3>Visualizer Instruction</h3>
            <p>Welcome to the University of Alberta's Engineering Program Plan Visualizer.</p>
            <p>This tool is designed to help you navigate the structure of your chosen program plan. </p>
            <p>Here is a guide to using the tool:</p>
            <ul>
                <li><strong>Select a plan:</strong>
                    To see all the courses in a program, choose a plan from the Plan dropdown at the top. All
                    courses in 8 or more terms will be displayed below. For Mechanical Engineering, you will
                    need to select a group after selecting a plan.
                </li>
                <li><strong>Course Description:</strong> By hovering over a course in the terms below, you
                    can view its course description. This provides details about the course content, hours
                    and credits.
                </li>
                <li><strong>Prerequisites and Corequisites:</strong> Left-clicking on a course will display
                    any prerequisites with solid arrows and corequisites with dotted arrows.
                </li>
                <li><strong>Course Group:</strong> Select a group in the Course Group palette to see all
                    the courses that belong to the course group. This is useful for getting an overview of
                    courses with similar content or learning objectives.
                </li>
                <li><strong>Graduation Attributes:</strong> Clicking on a graduate attribute in the Graduate
                    Attributes palette highlights each course in that category. Please refer to the legend
                    for details on the color meanings. The coloration displays where each learning outcome is 
                    met throughout the degree program.
                </li>
            </ul>
            <p>We hope this tool aids your understanding of your chosen engineering program and supports
                your academic planning process. If you have any questions or encounter any difficulties,
                please do not hesitate to contact us at dnobes@ualberta.ca. </p>
        </div>
    );
}

const About = (props) => {

    return (
        <div className='about'>
            <h1>About</h1>
            <h2>Develepoment</h2>
            <p>
                The University of Alberta's Engineering Program Plan Visualizer was created under 
                the direction of university professors Dr. David Nobes and Dr. Steven Knudsen. 
                The code was written by Co-op students Xiangpeng 
            </p>
            <p>This tool is designed to help you navigate the structure of your chosen program plan. </p>

            <p>We hope this tool aids your understanding of your chosen engineering program and supports
                your academic planning process. If you have any questions or encounter any difficulties,
                please do not hesitate to contact us at dnobes@ualberta.ca. </p>
            <h2>Contact</h2>
            <p>
                If you have any questions, inquiries or feature requests to do with the Visualizer,
                please do not hesitate to contact us at dnobes@ualberta.ca. 
            </p>
        </div>
    );
}

const TabHeader = (props) => {

    const tabButtons = props.tabs.map( (tab, index) => {

        return (
            <div 
                className='tabButton' onClick={() => props.setTab(index)}
                style={{
                    borderBottom: index == props.getTab() ? '2px solid' : 'none',
                }}
                
            >
                {tab}
            </div>
        )
    });

    return (
        <div className='tabWrapper'>
            {tabButtons}
        </div>
    )
}

const SubHeader = (props) => {

    const location = useLocation();
    const {selectedProgram} = location.state;
    const navigate = useNavigate();
    const handleBackButtonClick = () => {
        props.deletelinemap();
        navigate("/");
    };
    return (
        <div className='subHeader'>
            <img alt="Home Button" src="home_button.png" className="homeButton" onClick={handleBackButtonClick}/>
            <HomeButtonIcon/>
            <div className='path'>
                {selectedProgram} Engineering Plan Visualizer
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
    const [isFirst, setIsFirst] = useState(true);

    const controller = new RESTController();

    useEffect(() => {
        controller.getPlans({programName: selectedProgram}).then((plans) => {
            setPlanList(plans);
            if (isFirst) {
                setIsFirst(false);

                if (selectedProgram === "Mechanical Engineering") {
                    props.setStructure(selectedProgram, plans[0].replace(/\{[^)]*\}/g, "").trimEnd().trimStart());
                    props.setContainCourseGroup();
                    setSelectedPlan(plans[0].replace(/\{[^)]*\}/g, "").trimEnd().trimStart());
                } else {
                    props.setStructure(selectedProgram, plans[0]);
                    setSelectedPlan(plans[0]);
                }
            }
        });
    }, [selectedProgram]);

    const plans = planList.map((plan, index) => {

        // Remove unwanted characters from start and end of MecE plans
        if (selectedProgram === "Mechanical Engineering") {
            plan = plan.replace(/\{[^)]*\}/g, "").trimEnd().trimStart();
        }

        return plan;
    })

    // Remove duplicate plan names
    const uniquePlans = [...new Set(plans)];

    // Return component with all the discipline's plans
    return (
        <div className="allPlans">
            <div className="SelectedPlanDescription">SELECT A PLAN</div>
            <div className="sectionDescription">Select a plan for your discipline below.</div>
            {/* <div className="planPalette"> */}
            <div>
                <Dropdown
                    placeHolder={'Traditional Plan'}
                    options={uniquePlans}
                    onChange={(plan) => {
                        setSelectedPlan(plan);
                        props.setSelectedProgramPlan(selectedProgram, plan);
                    }}
                    width={250}
                />
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
        courseGroupKeys.forEach((key) => {
            const group = selectedButtons.get(key);
            if (group) {
                props.setSelectedCourseGroup(group, props.deleteLineMap);
            }
        });
    }, [selectedButtons]);


    // Default selection of course groups
    useEffect(() => {
        const newSelectedButtons = new Map(selectedButtons);
        courseGroupKeys.forEach((key) => {
            const groups = props.courseGroup.get(key);
            const defaultGroup = groups.find(group => group.toLowerCase().endsWith('a'));
            if (defaultGroup) {
                newSelectedButtons.set(key, defaultGroup);
                props.setSelectedCourseGroup(defaultGroup, props.deleteLineMap);
            }
        });
        setSelectedButtons(newSelectedButtons);
    }, [props.courseGroup]);

    // Reset all selectedGroups when selected plan changed
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
        const defaultGroup = selectedButtons.get(key);
        return (
            <div key={key}>
                <div>
                    <Dropdown
                        placeHolder={defaultGroup}
                        options={props.courseGroup.get(key)}
                        onChange={(group) => {
                            const newSelectedButtons = new Map(selectedButtons);
                            newSelectedButtons.set(key, group);
                            setSelectedButtons(newSelectedButtons);
                            props.setSelectedCourseGroup(group, props.deleteLineMap);
                        }}
                    />
                </div>
            </div>
        );
    });

    if (props.planChanged) {
        props.setPlanChanged();
    }

    return (
        <div className="allGroups">
            <div className="SelectedPlanDescription">SELECT COURSE GROUPS</div>
            <div>Select the sub-categories for your plan here. Each numerical group has an option A or B.</div>
            <div className="groupDropdownWrapper">{keyComponent}</div>
        </div>
    );
};

const GradAttributes = (props) => {
    const [selectedGradAtt, setSelectedGradAtt] = useState(null);

    const cells = props.gradAttributeList.map((gradAttribute, index) => {
        let isSelected = gradAttribute === selectedGradAtt;

        return (
            <div
                key={index}
                className="indvGradAttribute"
                onClick={(event) => {
                    if (gradAttribute === selectedGradAtt) {
                        setSelectedGradAtt(null);
                    } else {
                        setSelectedGradAtt(gradAttribute);
                    }
                    props.setGradAttributeColor(event, gradAttribute);
                }}
                style={{backgroundColor: isSelected ? "gold" : "#ced4da"}}
            >
                {gradAttribute}
            </div>
        );
    });

    return (
        <div>
            <div className="gradAttTitle">GRADUATE ATTRIBUTES</div>
            <div className="gradAttributePalette">
                <div className="attributeDescription">
                    Learn more about which courses satisfy your degree requirements.
                </div>
                {cells}
            </div>
        </div>
    );
};

const CourseCatagory = (props) => {
    const location = useLocation();
    const {selectedProgram} = location.state;

    const [selectedCategory, setSelectedCategory] = useState([]);

    const cells = props.categoryList.map((category, index) => {
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

        const isSelected = selectedCategory.includes(category);

        return (
            <div
                key={index}
                className="indvCatagory"
                onClick={(event) => {
                    if (selectedCategory.includes(category)) {
                        const newSelectedCategory = selectedCategory.filter(item => item !== category);
                        setSelectedCategory(newSelectedCategory);
                    } else {
                        const newSelectedCategory = selectedCategory.concat(category);
                        setSelectedCategory(newSelectedCategory);
                    }
                    props.setCatagoryColor(event, category);
                }}

                style={{backgroundColor: isSelected ? category.color : "#ced4da"}}
            >
                {category.name}
            </div>
        );
    });

    return (
        <div>
            <div className="courseCategoryTitle">COURSE CATEGORIES</div>
            <div className="courseCategoryPalette">
                <div className="categoryDescription">
                    Learn more about what categories your courses belong to.
                </div>
                {cells}
            </div>
        </div>
    );
};


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
                    Corequisites:
                    <img src="corequisite.png" className='corequisiteImage'/>
                </div>
            </div>
        </div>
    )
}

const Footer = () => {

    return (
        <footer className="footer">
            <div className='topBorder'>
                <div className='imageDiv'>
                    <a>
                        <img alt="University of Alberta logo" src="uofalogo.png" className="footerImage"/>
                    </a>
                </div>
                <div className='footerTag'>
                    @ 2023 University of Alberta
                </div>
            </div>
        </footer>
    );
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
                    color: '#FFD700',
                },
                {
                    name: "Developing",
                    color: '#32D0F2',
                },
                {
                    name: "Mastered",
                    color: '#80E4C6',
                },
                {
                    name: "Collected",
                    color: 'red',
                },
            ],

            structure: [],
            reqMap: new Map(),
            courseGroup: new Map([
                ['Group 2', ["2A", "2B"]],
                ['Group 3', ["3A", "3B"]],
                ['Group 4', ["4A", "4B"]]
            ]),
            tabs: ['Visualizer', 'About'],
            selectedAtt: "",
            groupColorSet: new Map(),
            selectedProgram: "",
            selectedPlan: "",
            containCourseGroup: false,
            showOptions: false,
            planChanged: false,
            group2: "",
            group3: "",
            group4: "",
            lineMap: new Map(),
            isDefault: true,
            containOptions: true,
            tabIndex: 0,
        };

        this.controller = new RESTController();
    }

    // componentDidMount() {
    //     window.addEventListener("popstate", this.deleteWhenPopstate);
    // }
    //
    // deleteWhenPopstate = () => {
    //     this.deleteLineMap();
    // }

    setIsDefault = () => {
        this.setState({isDefault: false});
    }

    setContainCourseGroup = () => {
        this.setState({containCourseGroup: true});
    }

    toggleOptionsHidden = () => {
        this.setState(prevState => ({
            showOptions: !prevState.showOptions
        }));
    }


    setTab = (index) => {
        this.setState({tabIndex: index});
        console.log("index" + index);
    }

    getTab = () => {
        return this.state.tabIndex;
    }


    setCatagoryColor = (event, catagory) => {
        let catagoryIndex = 0;
        let duplicateCategory = false;
        const {structure} = this.state;

        // Create a copy of selectedGroup map
        let groupColorSet = new Map(this.state.groupColorSet);

        // remove the highlight if click a category twice
        groupColorSet.forEach((key, value) => {
            if (groupColorSet.get(value).includes(catagory.color)) {
                duplicateCategory = true;
                const newValue = groupColorSet.get(value).filter(color => color !== catagory.color);
                groupColorSet.set(value, newValue);
            }
        })

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

                // get the old color set
                let colorSet = groupColorSet.get(structure[termIndex].courses[courseIndex].name);
                if (colorSet === undefined) {
                    colorSet = [];
                }
                let catagoryLevel = courseMap.category[catagoryIndex];

                if (catagoryLevel === 1 && !duplicateCategory) {
                    colorSet.push(catagory.color);
                }

                structure[termIndex].courses[courseIndex].color = colorSet;

                groupColorSet.set(structure[termIndex].courses[courseIndex].name, colorSet);
            })
        });

        this.setState({
            structure: structure,
            groupColorSet: groupColorSet,
        });
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
                    // Set red hue of each course based on grad attribute level
                    structure[termIndex].courses[courseIndex].color = this.state.gaLegendList[attributeLevel].color;
                })
            })

            this.setState({
                structure: structure,
                selectedAtt: gradAttribute,
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

    setStructure = (selectedProgram, selectedPlan) => {

        this.setState({
            selectedProgram: selectedProgram,
            selectedPlan: selectedProgram === "Mechanical Engineering" ? selectedPlan.replace(/\{[^)]*\}/g, "").trimEnd().trimStart() : selectedPlan
        });

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

        let group2, group3, group4;

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
        const {
            structure,
            courseGroup,
            selectedProgram,
            selectedPlan,
            lineMap,
            planChanged,
            reqMap,
            isDefault
        } = this.state;

        console.log(this.state.showOptions);
        console.log(this.state.tabIndex);

        return (
            <div className='all'>

                <div className='header'>
                    <Header/>
                </div>

                <div className='tabHeader'>
                    <TabHeader tabs={this.state.tabs} setTab={this.setTab} getTab={this.getTab}/>
                </div>

                <div className='subheader'>
                    <SubHeader deletelinemap={this.deleteLineMap}/>
                </div>

                {this.state.tabIndex == 0 && (
                    <div className='part'>
                        <PageTitle/>

                        <div className='dropdownsWrapper'>
                            <div className='planWrapper'>
                                <Plans
                                    setSelectedProgramPlan={this.setSelectedProgramPlan}
                                    isDefault={isDefault}
                                    setIsDefault={this.setIsDefault}
                                    setStructure={this.setStructure}
                                    setContainCourseGroup={this.setContainCourseGroup}
                                />
                            </div>

                            {this.state.containCourseGroup && (
                                <div className='groupWrapper'>
                                    <CourseGroup courseGroup={courseGroup}
                                                setSelectedCourseGroup={this.setSelectedCourseGroup}
                                                selectedProgram={selectedProgram}
                                                deleteLineMap={this.deleteLineMap}
                                                planChanged={planChanged}
                                                setPlanChanged={this.setPlanChanged}
                                    />
                                </div>)}
                        </div>

                        <div 
                            className='collapsibleOptions'
                            onClick={ () => {this.toggleOptionsHidden();} }
                        >
                            <div className='additionOptions'>
                                ADDITIONAL OPTIONS
                            </div>
                            <Icon/>

                        </div>

                        {this.state.showOptions && (
                            <div className="lowerStuff">
                                <div className='catagoryWrapper'>
                                    <CourseCatagory categoryList={this.state.categoryList}
                                                    setCatagoryColor={this.setCatagoryColor}
                                    />

                                </div>

                                <div className='GAWrapper'>
                                    <GradAttributes gradAttributeList={this.state.gradAttributeList}
                                                    setGradAttributeColor={this.setGradAttributeColor}/>
                                </div>

                                <div className='gradLegendWrapper'>
                                    <GALegend gaLegendList={this.state.gaLegendList}/>
                                    <RequisiteLegend/>
                                </div>
                            </div>
                        )}

                        <div className='structureTitle'>COURSES</div>
                        <div className='structureDescription'> Below are each of the courses in each semester in your
                            selected plan. Hover over a course to
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
                )}

                {this.state.tabIndex == 1 && (
                    <About/>
                )}


                <div className='footer'>
                    <Footer/>
                </div>

            </div>
        )
    }
}


export default App;

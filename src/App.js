import React, {Component, useEffect, useState} from 'react';
import './App.css';
import './index.css';
import Dropdown from './Dropdown.js';
import Structure from './Structure.js';
import {useLocation, useNavigate} from 'react-router-dom';
import RESTController from "./controller/RESTController";
import Scheduler from "./Scheduler"
import './Scheduler.css'


const Icon = () => {
    return (
        <svg height="20" width="20" viewBox="0 0 20 20">
            <path
                d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path>
        </svg>
    );
};

const Header = (props) => {

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
                    Engineering Task Manager
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
            <a>Visualizer Instruction</a>
            <p>Welcome to the University of Alberta's Engineering Program Plan Visualizer.</p>
            <p>This tool is designed to help you navigate the structure of your chosen program plan. </p>
            <p>Here is a guide to using the tool:</p>
            <ul>
                <li><b>Select a plan:</b>
                    To see all the courses in a program, choose a plan from the Plan dropdown at the top. All
                    courses in 8 or more terms will be displayed below. For Mechanical Engineering, you will
                    need to select a group after selecting a plan.
                </li>
                <li><b>Course Description:</b> By hovering over a course in the terms below, you
                    can view its course description. Right-click on the course to keep the description open.
                    The descirption provides details about the course content, hours and credits.
                </li>
                <li><b>Prerequisites and Corequisites:</b> Left-clicking on a course will display
                    prerequisites and postrequisites with solid blue arrows, and corequisites with dotted
                    yellow arrows.
                </li>
                <li><b>Course Categories:</b> Select a category in the Course Category Palette to see all
                    the courses that belong to the course category. This is useful for getting an overview of
                    courses with similar content or learning objectives.
                </li>
                <li><b>Graduation Attributes:</b> Clicking on a graduate attribute in the Graduate
                    Attributes Palette highlights each course that contains that attribute. Please refer to
                    the legend for details on the color meanings. The coloration displays where each learning
                    outcome is met throughout the degree program.
                </li>
            </ul>
            <p>We hope this tool aids your understanding of your chosen engineering program and supports
                your academic planning process. If you have any questions or encounter any difficulties,
                please do not hesitate to contact us at dnobes@ualberta.ca. </p>
        </div>
    );
}

const About = () => {

    return (
        <div className='about'>
            <h1 className='pageTitle'>
                About
            </h1>
            <h2 className='SelectedPlanDescription'>
                Development
            </h2>
            <p>
                The University of Alberta's Engineering Program Plan Visualizer was created under
                the direction of university professors Dr. David Nobes and Dr. Steven Knudsen.
                The code was written by Co-op students Xiangpeng Ji, Noah Batiuk and Fahrin Bushra.
            </p>
            <p>
                This tool is designed to help you navigate the structure of your chosen program plan.
            </p>
            <p>
                We hope this tool aids your understanding of your chosen engineering program and supports
                your academic planning process.
            </p>
            <h2 className='SelectedPlanDescription'>
                Contact
            </h2>
            <p>
                If you have any questions, inquiries or feature requests to do with the Visualizer,
                please do not hesitate to contact us at dnobes@ualberta.ca.
            </p>
        </div>
    );
}

const TabHeader = (props) => {

    const tabButtons = props.tabs.map((tab, index) => {

        const className = index === 0 ? 'tabButton1' : 'tabButton';

        return (
            <div
                className={className}
                onClick={() => {
                    props.setTab(index);
                    props.deleteLineMap();
                }}
                style={{
                    borderBottom: index === props.getTab() ? '2px solid' : 'none',
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

    const introDiv = (
        <div className='path'>
            {selectedProgram}
        </div>
    );

    const visualizerDiv = (
        <div className='path'>
            Visualizer
        </div>
    )

    const schedulerDiv = (
        <div className='path'>
            Scheduler
        </div>
    )

    const about = (
        <div className='path'>
            About
        </div>
    )

    let path;

    const homeButtonIcon = (
        <svg className='homeButtonIcon' height="20" width="20" viewBox="0 0 20 20">
            <path
                d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"
                style={{transform: "rotate(270deg)", transformOrigin: "center", fill: "#7B7B7B"}}
            ></path>
        </svg>);

    switch (props.tabIndex) {
        case 0:
            path = [introDiv, homeButtonIcon, visualizerDiv];
            break;
        case 1:
            path = [introDiv, homeButtonIcon, schedulerDiv];
            break;
        case 2:
            path = about;
            break;
        default:
            path = null;
            break;
    }

    return (
        <div className='subHeader'>
            <img alt="Home Button" src="home_button.png" className="homeButton" onClick={handleBackButtonClick}/>
            {homeButtonIcon}
            {path}
        </div>
    )
}

const PageTitle = () => {
    const location = useLocation();
    const {selectedProgram} = location.state;

    return (
        <div className='pageTitle'>
            {selectedProgram} Visualizer
        </div>
    )
}


//Plans has to be a simple component as it contains navigation
const Plans = (props) => {

    const location = useLocation();
    const {selectedProgram} = location.state;
    const [planList, setPlanList] = useState([]);
    const [isFirst, setIsFirst] = useState(true);

    const controller = new RESTController();

    // set the default plan
    useEffect(() => {
        controller.getPlans({programName: selectedProgram}).then((plans) => {
            setPlanList(plans);
            if (isFirst && !props.tabClick) {
                setIsFirst(false);

                if (selectedProgram === "Mechanical Engineering") {
                    props.setStructure(selectedProgram, plans[0].replace(/\{[^)]*\}/g, "").trimEnd().trimStart());
                } else {
                    props.setStructure(selectedProgram, plans[0]);
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

    const defaultPlan = plans[0];

    // Remove duplicate plan names
    const uniquePlans = [...new Set(plans)];


    // Return component with all the discipline's plans
    return (
        <div className="allPlans">
            <div className="SelectedPlanDescription">SELECT A PLAN</div>
            <div className="sectionDescription">Select a plan for your discipline below.</div>
            <div>
                <Dropdown
                    placeHolder={defaultPlan}
                    options={uniquePlans}
                    onChange={(plan) => {
                        props.setSelectedProgramPlan(selectedProgram, plan);
                        setIsFirst(false);
                    }}
                    width={250}
                    plan={props.selectedPlan}
                    type={'plan'}
                />
            </div>
        </div>
    )
}

const CourseGroup = (props) => {

    /*
    *  props.courseGroup: new Map([['Group 2', ["2A", "2B"]],
    *                              ['Group 3', ["3A", "3B"]],
    *                              ['Group 4', ["4A", "4B"]]]),
    * */

    // get the keys of course group like ["group2", "group3", "group4"]
    const courseGroupKeys = [...props.courseGroup.keys()];

    const [planName, setPlanName] = useState(props.selectedPlan);

    if (props.planChanged) {
        props.setPlanChanged(false);
    }

    // set the default course group of each plan in Mechanical Engineering
    useEffect(() => {

        // prevent duplicate render
        if (!props.selectedPlan.includes("{")) {
            let completePlanName = props.selectedPlan;
            completePlanName = completePlanName + " {";

            const nullMap = new Map();

            courseGroupKeys.forEach((key, index) => {
                const defaultGroup = props.courseGroup.get(key)[0];
                nullMap.set(key, defaultGroup);
                completePlanName += defaultGroup;

                if (index !== courseGroupKeys.length - 1) {
                    completePlanName += " ";
                }
            })

            completePlanName.trim();
            completePlanName += "}";

            setPlanName(completePlanName);
            props.setStructure(props.selectedProgram, completePlanName);
            props.setSelectedCourseGroupButtons(nullMap);
        }
    }, [props.planChanged])

    const keyComponent = courseGroupKeys.map((key, index) => {
        const defaultGroup = props.courseGroup.get(key)[0];
        return (
            <div key={key}>
                <div>
                    <Dropdown
                        index={index}
                        placeHolder={defaultGroup}
                        options={props.courseGroup.get(key)}
                        onChange={(group) => {

                            // delete the old leaderlines
                            props.deleteLineMap();

                            let newSelectedButtons = new Map(props.selectedCourseGroupButtons);
                            newSelectedButtons.set(key, group);

                            let groups = planName.substring(planName.indexOf("{") + 1, planName.indexOf("}"));
                            const groupNum = group[0];
                            const newGroups = groups.replace(groups.substring(groups.indexOf(groupNum), groups.indexOf(groupNum) + 2), group);

                            const newPlanName = planName.replace(groups, newGroups);

                            setPlanName(newPlanName);
                            props.setStructure(props.selectedProgram, newPlanName);
                            props.setSelectedCourseGroupButtons(newSelectedButtons);
                        }}
                        plan={props.selectedPlan}
                        type={'courseGroup'}
                        planChanged={props.planChanged}
                    />
                </div>
            </div>
        );
    });

    return (
        <div className="allGroups">
            <div className="SelectedPlanDescription">SELECT COURSE GROUPS</div>
            <div style={{fontFamily: 'Roboto, sans-serif', fontWeight: 400}}>
                Select the sub-categories for your plan here. Each numerical group has an option A or B.
            </div>
            <div className="groupDropdownWrapper">{keyComponent}</div>
        </div>
    );
};

const GradAttributes = (props) => {
    const cells = props.gradAttributeList.map((gradAttribute, index) => {
        return (
            <div
                key={index}
                className="indvGradAttribute"
                onClick={(event) => {
                    if (gradAttribute === props.selectedGradAtt) {
                        props.setSelectedGradAtt(null);
                    } else {
                        props.setSelectedGradAtt(gradAttribute);
                    }

                    props.setSelectedCategory(null);
                    props.setGradAttributeColor(event, gradAttribute);
                }}
                style={{backgroundColor: props.selectedGradAtt === gradAttribute ? "gold" : "#ced4da"}}
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

        return (
            <div
                key={index}
                className="indvCatagory"
                onClick={(event) => {
                    props.setSelectedCategory(category);
                    props.setSelectedGradAtt(null);
                    props.setCatagoryColor(event, category);
                }}

                style={{backgroundColor: props.selectedCategory.includes(category) ? category.color : "#ced4da"}}
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

const CourseGroupButton = (props) => {
    const location = useLocation();
    const {selectedProgram} = location.state;

    if (selectedProgram === "Mechanical Engineering" && !props.selectedPlan.includes("Biomedical")) {
        return (
            <div className='groupButton'
                 onClick={props.handleCourseGroupOnClick}
            >Group</div>
        )
    } else {
        return null;
    }
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

const Spinner = () => (
    <div className="spinner">
        <div className="double-bounce1"></div>
        <div className="double-bounce2"></div>
    </div>
);

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
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
            tabs: ['Visualizer', 'Scheduler', 'About'],
            selectedAtt: "",
            groupColorSet: new Map(),
            selectedProgram: "",
            selectedPlan: "",
            showOptions: false,
            planChanged: true,
            lineMap: new Map(),
            isDefault: true,
            containOptions: true,
            tabIndex: 0,
            selectedGradAtt: null,
            selectedCategory: [],
            courseGroupOnClick: false,
            termNumber: 0,
            tabClick: false,
            selectedCourseGroupButtons: new Map(),

            // states for scheduler
            dropDownClick: [true, true, true],
            termList: [],
            selectedTerm: "",
            lecInfo: [],
            labInfo: [],
            semInfo: [],
            lectureTab: [],
            labTab: [],
            seminarTab: [],

            highLightCells: Array.from({length: 26}, () => Array.from({length: 5}, () => [null, false, null])),
        };

        this.controller = new RESTController();
    }

    // delete everything in the app page
    componentWillUnmount() {
        this.deleteLineMap();
        this.deleteGradAtts();
        this.deleteCourseCategory();
    }

    setIsDefault = () => {
        this.setState({isDefault: false});
    }

    setContainCourseGroup = (isContained) => {
        this.setState({containCourseGroup: isContained});
    }

    /**
     *
     * Loop through and redraw the leader lines when a scroll occurs in the termWrapper box
     *
     */
    redrawLeaderlines = () => {
        Array.from(this.state.lineMap.entries()).map((course) => {
            course[1].map((line) => {
                line.position();
            });
        });
    }

    toggleOptionsHidden = () => {
        this.setState(prevState => ({
            showOptions: !prevState.showOptions
        }));
    }

    handleCourseGroupOnClick = () => {
        this.setState({courseGroupOnClick: !this.state.courseGroupOnClick});
    }

    setSelectedPlan = (plan) => {
        this.setState({selectedPlan: plan});
    }

    setTab = (index) => {
        this.setState({tabIndex: index});
        this.setState({tabClick: true});
    }

    getTab = () => {
        return this.state.tabIndex;
    }

    // set the selected grad attribute
    setSelectedGradAtt = (gradAttribute) => {
        this.setState({selectedGradAtt: gradAttribute});
    }

    setTermNumber = (termNum) => {
        this.setState({termNumber: termNum});
    }

    // add a selected category to the selected category list, if selected a duplicate category
    // then remove it
    setSelectedCategory = (category) => {
        let newSelectedCategory = this.state.selectedCategory.includes(category) ?
            this.state.selectedCategory.filter(item => item !== category) :
            [...this.state.selectedCategory, category];

        if (category === null) {
            newSelectedCategory = [];
        }

        this.setState({selectedCategory: newSelectedCategory});
    }

    deleteCourseCategory = () => {
        let groupColorSet = this.state.groupColorSet;

        groupColorSet.forEach((key, value) => {
            groupColorSet.set(value, []);
        });

        this.setState({groupColorSet: groupColorSet});
    }
    deleteGradAtts = () => {
        this.setState({selectedAtt: null});
    }

    setCatagoryColor = (event, catagory) => {

        let catagoryIndex = 0;
        let duplicateCategory = false;
        const {structure} = this.state;

        // delete the graduate attributes highlights when onclick course category
        this.deleteGradAtts();

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
        const {structure} = this.state;

        // delete the course categories highlights when onclick graduate attributes
        this.deleteCourseCategory();

        // if select the same graduate attribute
        if (gradAttribute === this.state.selectedAtt) {
            this.setState({selectedAtt: ""});
            structure.map((term, termIndex) => {
                term.courses.map((courseMap, courseIndex) => {
                    structure[termIndex].courses[courseIndex].color = '#ced4da';
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

        const haveCourseGroupOption = selectedProgram === "Mechanical Engineering" && !selectedPlan.includes("Co-op Plan 3");
        if (haveCourseGroupOption) {
            this.setState({containCourseGroup: true});
            this.setCourseGroup(selectedPlan);
        } else {
            this.setStructure(selectedProgram, selectedPlan);
        }
    }

    setStructure = (selectedProgram, selectedPlan) => {

        this.deleteCourseCategory();
        this.deleteGradAtts();
        this.setSelectedCategory(null);
        this.setSelectedGradAtt(null);
        this.setSelectedTerm("");

        this.setState({
            selectedProgram: selectedProgram,
            selectedPlan: selectedPlan,
        });

        const data = {
            programName: selectedProgram,
            planName: selectedPlan,
        };

        let termNumber;

        if (selectedProgram === "Mechanical Engineering" && !selectedPlan.includes("Co-op Plan 3")) {
            this.setContainCourseGroup(true);
            if (selectedPlan.includes("{")) {
                this.controller.getCourseInfo(data).then((courses) => {
                    if (courses !== null || undefined) {
                        termNumber = Object.keys(courses).length;
                    }
                    this.setState({structure: courses, termNumber: termNumber});
                });

                this.controller.getReqMap(data).then((reqMap) => {
                    this.setState({reqMap: reqMap});
                });
            }
        } else {
            this.setContainCourseGroup(false);
            this.controller.getCourseInfo(data).then((courses) => {
                if (courses !== null || undefined) {
                    termNumber = Object.keys(courses).length;
                }
                this.setState({structure: courses, termNumber: termNumber});
            });

            this.controller.getReqMap(data).then((reqMap) => {
                this.setState({reqMap: reqMap});
            });
        }
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

    setPlanChanged = (isChanged) => {
        this.setState({planChanged: isChanged});
    }

    componentDidUpdate(lineMap) {
        this.redrawLeaderlines(lineMap);
    }


    // setState method for the scheduler
    setDropDownClick = (index) => {
        const newDropDownClick = this.state.dropDownClick.map((value, i) => {
            if (i === index) {
                return !value;
            } else return value;
        });

        this.setState({dropDownClick: newDropDownClick});
    }

    setTermList = (termList) => {
        this.setState({termList: termList});
    }

    setSelectedTerm = (term) => {
        this.setState({selectedTerm: term});
    }

    setLecInfo = (lecInfo) => {
        this.setState({lecInfo: lecInfo});
    }

    setLabInfo = (labInfo) => {
        this.setState({labInfo: labInfo});
    }

    setSemInfo = (semInfo) => {
        this.setState({semInfo: semInfo});
    }

    setLectureTab = (lectureTab) => {
        this.setState({lectureTab: lectureTab});
    }

    setLabTab = (labTab) => {
        this.setState({labTab: labTab});
    }

    setSeminarTab = (seminarTab) => {
        this.setState({seminarTab: seminarTab});
    }

    setHighLightCells = (newCells) => {
        this.setState({highLightCells: newCells});
    }


    render() {
        const {
            // state that will be used in visualizer
            structure,
            courseGroup,
            selectedProgram,
            selectedPlan,
            lineMap,
            planChanged,
            reqMap,
            isDefault,
            selectedCategory,
            selectedGradAtt,
            courseGroupOnClick,
            tabIndex,
            termNumber,
            tabClick,
            selectedCourseGroupButtons,

            // state that will be used in scheduler
            dropDownClick,
            termList,
            selectedTerm,
            lecInfo,
            labInfo,
            semInfo,
            lectureTab,
            labTab,
            seminarTab,
            highLightCells
        } = this.state;

        let width = '100%';
        const minWidth = '100%';

        return (
            <div className='all'>

                <div className='header' style={{width, minWidth}}>
                    <Header termNumber={termNumber}
                            width={width}
                    />
                </div>

                <div className='tabHeader' style={{width, minWidth}}>
                    <TabHeader tabs={this.state.tabs}
                               setTab={this.setTab}
                               getTab={this.getTab}
                               termNumber={termNumber}
                               deleteLineMap={this.deleteLineMap}
                               setSelectedGradAtt={this.setSelectedGradAtt}
                               setSelectedCategory={this.setSelectedCategory}
                               deleteCourseCategory={this.deleteCourseCategory}
                               deleteGradAtts={this.deleteGradAtts}
                    />
                </div>

                <div className='subheader'>
                    <SubHeader
                        deletelinemap={this.deleteLineMap}
                        tabIndex={tabIndex}
                    />
                </div>

                {this.state.tabIndex === 0 && (
                    <div>
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
                                        setTermNumber={this.setTermNumber}
                                        selectedPlan={selectedPlan}
                                        tabClick={tabClick}
                                        setPlanChanged={this.setPlanChanged}
                                        planChanged={planChanged}
                                    />
                                </div>

                                {this.state.containCourseGroup && (
                                    <div className='groupWrapper'>
                                        <CourseGroup courseGroup={courseGroup}
                                                     selectedProgram={selectedProgram}
                                                     selectedPlan={selectedPlan}
                                                     deleteLineMap={this.deleteLineMap}
                                                     planChanged={planChanged}
                                                     setPlanChanged={this.setPlanChanged}
                                                     selectedCourseGroupButtons={selectedCourseGroupButtons}
                                                     setSelectedCourseGroupButtons={(newCourseGroupButtons) => this.setState({selectedCourseGroupButtons: newCourseGroupButtons})}
                                                     setStructure={this.setStructure}
                                                     setSelectedPlan={this.setSelectedPlan}
                                        />
                                    </div>)}
                            </div>

                            <div
                                className='collapsibleOptions'
                                onClick={() => {
                                    this.toggleOptionsHidden();
                                }}
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
                                                        selectedCategory={selectedCategory}
                                                        setSelectedGradAtt={this.setSelectedGradAtt}
                                                        setSelectedCategory={this.setSelectedCategory}
                                        />

                                    </div>

                                    <div className='GAWrapper'>
                                        <GradAttributes gradAttributeList={this.state.gradAttributeList}
                                                        setGradAttributeColor={this.setGradAttributeColor}
                                                        selectedGradAtt={selectedGradAtt}
                                                        setSelectedGradAtt={this.setSelectedGradAtt}
                                                        setSelectedCategory={this.setSelectedCategory}
                                        />
                                    </div>

                                    <div className='gradLegendWrapper'>
                                        <GALegend gaLegendList={this.state.gaLegendList}/>
                                        <RequisiteLegend/>
                                    </div>
                                </div>
                            )}

                            <div className='structureTitle'>COURSES</div>

                            <div className='structureDescriptionWrapper'>
                                <div className='structureDescription'> Below are each of the courses in each semester in
                                    your
                                    selected plan. Hover over a course to
                                    see it's course description. Click on a course to see it's prerequisites and
                                    coreqisites.
                                </div>

                                <div className='structureGroupButton'>
                                    <CourseGroupButton
                                        handleCourseGroupOnClick={this.handleCourseGroupOnClick}
                                        selectedPlan={selectedPlan}
                                    />
                                </div>
                            </div>
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
                                       courseGroupOnClick={courseGroupOnClick}
                            />
                        </div>
                    </div>
                )}

                {this.state.tabIndex === 1 && (
                    <div className='scheduler'>
                        <Scheduler
                            selectedProgram={selectedProgram}
                            selectedPlan={selectedPlan}
                            dropDownClick={dropDownClick}
                            termList={termList}
                            selectedTerm={selectedTerm}
                            setDropDownClick={this.setDropDownClick}
                            setSelectedTerm={this.setSelectedTerm}
                            setTermList={this.setTermList}
                            lecInfo={lecInfo}
                            labInfo={labInfo}
                            semInfo={semInfo}
                            setLecInfo={this.setLecInfo}
                            setLabInfo={this.setLabInfo}
                            setSemInfo={this.setSemInfo}
                            lectureTab={lectureTab}
                            labTab={labTab}
                            seminarTab={seminarTab}
                            setLectureTab={this.setLectureTab}
                            setLabTab={this.setLabTab}
                            setSeminarTab={this.setSeminarTab}
                            highLightCells={highLightCells}
                            setHighLightCells={this.setHighLightCells}
                        />
                    </div>
                )}

                {this.state.tabIndex === 2 && (
                    <About/>
                )}

                <div className='footer' style={{width, minWidth}}>
                    <Footer/>
                </div>

            </div>
        )
    }
}


export default App;
import React, {Component, useEffect, useState, useRef} from "react";
import './Scheduler.css'
import Searchbar from './Searchbar.js';
import {ExportCSV} from './ExportCSV.js';
import {ImportCSV} from './ImportCSV.js';
import {TestReport} from './ExportPDF.js';
import {useLocation} from "react-router-dom";
import RESTController from "./controller/RESTController";
import {pdf} from '@react-pdf/renderer';
import {saveAs} from 'file-saver';
import {Tooltip as ReactTooltip} from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css'
import JsPDF from 'jspdf';

// title of page, set to "Scheduler"
const PageTitle = (props) => {

    return (
        <div className='pageTitleScheduler'>
            {props.selectedProgram} Scheduler
        </div>
    )
}

// Div that displays the current plan and group selections from the previous Visualizer page to the user
const Plan = (props) => {

    const location = useLocation();
    const {selectedProgram} = location.state;

    const plan = props.selectedPlan;

    // Plan name component
    const planName = (
        <div className="planText">
            {props.selectedPlan.replace(/\{[^)]*\}/g, "").trimEnd().trimStart()}
        </div>
    );

    let courseGroup;

    // Account for MecE's {} names that store the group information
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

    // Show course groups if currently a MecE plan
    if (selectedProgram === "Mechanical Engineering" && !plan.includes("Co-op Plan 3")) {
        planTube = [planName, courseGroup];
    } else {
        planTube = [planName];
    }

    // return a box showing the plan selections
    return (
        <div>
            <div className="SelectedPlanDescription">SELECTED PLAN</div>
            <div className="scheduleDescription">Return to the visualizer to select different plans and course groups.
            </div>
            <div className="planTube">
                {planTube}
            </div>
        </div>
    )
}

// Header for the Schedule table section with instructions
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

// Set of tabs above the schedule where students can pick which term to edit
const Terms = (props) => {
    const restController = new RESTController();
    const program = props.selectedProgram;
    const plan = props.selectedPlan;

    // set the term list and default selected term
    useEffect(() => {

        if (program !== "Mechanical Engineering" || plan.includes("{") || plan.toLowerCase().includes("biomedical")) {
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

            restController.getAllCourses({program: data.programName}).then((courses) => {
                props.setSearchInfo(courses);
            });

            // Restore the saved schedule for the selected term
            if (props.scheduleMap.get(props.selectedTerm)) {
                props.setHighLightCells(props.scheduleMap.get(props.selectedTerm));
            }
        }
    }, [props.selectedProgram, props.selectedPlan, props.selectedTerm]);

    // Return tab divs for each of the terms in the plan
    const terms = props.termList.map((term) => {

        const isSelected = props.selectedTerm === term;
        const className = isSelected ? 'selectedIndivTerm' : 'indivTerm';

        return (
            <div
                className={className}
                onClick={() => {
                    if (term !== props.selectedTerm) {
                        props.setSelectedTerm(term);

                        const newHighLightCells = Array.from({length: 28}, () => Array.from({length: 5}, () => [null, '', null]));
                        props.setHighLightCells(newHighLightCells);
                    }
                }}
            >
                {term}
            </div>
        );
    })

    // Return the full set of tabs in a div
    return (
        <div className='termTube'>
            {terms}
            <NewTerm
                termList={props.termList}
                setTermList={props.setTermList}
                setHighLightCells={props.setHighLightCells}
                setSelectedTerm={props.setSelectedTerm}
            />
        </div>
    )
}

// Button to add additional terms to Scheduler, in the hape of a (+)
const NewTerm = (props) => {

    const [termNumber, setTermNumber] = useState(9);
    const [termIndex, setTermIndex] = useState(0);

    const termTypes = ['Summer', 'Fall', 'Winter'];

    // Add a new term with proper number and term type when + is clicked
    const handleClick = () => {

        const newTermName = [termTypes[termIndex], 'Term', termNumber];
        const term = newTermName.join(' ');

        // Add term to terms array
        props.setTermList([
            ...props.termList,
            term
        ])

        // Store next term type and number
        setTermNumber((prevNumber) => prevNumber + 1);
        setTermIndex((prevIndex) => (prevIndex + 1) % 3);

        props.setSelectedTerm(term);

        // Clear the scheduler table to show the new empty term table
        const newHighLightCells = Array.from({length: 28}, () => Array.from({length: 5}, () => [null, '', null]));
        props.setHighLightCells(newHighLightCells);
    }

    return (
        <div
            className="indivTerm"
            onClick={handleClick}
        >
            +
        </div>
    )
}

// Plus or minus sign shown on each left-hand side tab of the scheduler component
//
// Toggle symbol when clicked
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

// Left-hand tab for the lectures. Read each of the lecture names from lecInfo and store them in lectureTab. Display these in the tab.
const Lecs = (props) => {

    const isDropDown = props.dropDownClick[0];

    // Set whether dropdwon is open
    const onSignClick = () => {
        props.setDropDownClick(0);
    }

    // Adjust the lectureTab if lecInfo changes (if the term is switched)
    useEffect(() => {

        if (props.lecInfo && props.lecInfo.length > 0) {
            if (props.lectureTab === null || !props.lectureTab.some(lecture => props.lecInfo.map(info => info.name).includes(lecture))) {

                // Get all lecture names contained in lecInfo
                var lectures = props.lecInfo.map((lecture) => {
                        return lecture.name;
                    }
                )

                // Remove all lectures that are currently in the schedule
                if (props.tabMap.get(props.selectedTerm)) {
                    if (props.tabMap.get(props.selectedTerm).lectureTab) {

                        var toRemove = props.tabMap.get(props.selectedTerm).lectureTab;

                        const cleanedLectures = lectures.filter(function (lecture) {
                            return !toRemove.includes(lecture);
                        })

                        lectures = [...cleanedLectures];
                    }
                }

                // Set unplaced lectures into the lectureTab component
                props.setLectureTab(lectures);
            }
        } else {
            props.setLectureTab(null);
        }
    }, [props.lecInfo]);


    // Loop through lectures, return component box for each
    let lectures;
    if (props.lectureTab !== null) {
        lectures = props.lectureTab.map((lecture, index) => {

            // Get info for the course
            const lectureInfo = props.lecInfo.find(lectureInfo => lectureInfo.name === lecture);

            // Get options regarding what time slots/sections are available for the lecture
            let option;
            if (lectureInfo !== undefined) {
                option = lectureInfo.options;
            }

            const courseDetails = [];

            // Get relevant details (section, location, professor) for each lecture
            if (lectureInfo !== undefined) {
                lectureInfo.options.map((option) => {
                    const section = option.section;
                    const place = option.place;
                    const prof = option.instructor === "" ? "-" : option.instructor;

                    const courseProfANDPlaceInfo = "Section " + section + " Prof: " + prof + " ," + "Location: " + place + '\n';
                    courseDetails.push(courseProfANDPlaceInfo);
                })
            }

            // Create description for the tooltip popup that appears when you hover over the course
            const extendedName = lectureInfo !== undefined ? lectureInfo.extendedName : "";
            const courses = props.structure.find(courses => courses.term === props.selectedTerm);
            const course = courses === undefined ? undefined : courses.courses.find(course => course.name.replace(/\([^)]+\)/g, '') === lecture);
            const courseDesc = course !== undefined ? course.description : "";
            const toolTipUniqueId = lectureInfo !== undefined ? lectureInfo.extendedName + index.toString() : "";

            // Return a single lecture box with the course name inside. Also return a tooltip with the course info.
            return (
                <div>
                    <div
                        className='indivLecture'
                        draggable={true}
                        onDragStart={(event) => {
                            props.handleDragStart(option, event, lecture)
                        }}
                        onDragEnd={(event) => {
                            props.handleDragEnd(event);
                        }}
                        data-tooltip-id={toolTipUniqueId}
                        data-tooltip-content={courseDesc}
                        courseDetails={courseDetails}
                        extendedName={extendedName}
                    >
                        {lecture}
                    </div>

                    <ReactTooltip place="bottom" id={toolTipUniqueId} enterDelay={5000} render={({content, activeAnchor}) => (
                        <div className='popUpDescription'>
                            <div className='popUpExtendedName'>
                                <b>{activeAnchor?.getAttribute('extendedName')}</b>
                            </div>
                            <br/>
                            <div>
                                {content}
                                <br/>
                                <div className='popUpCourseDetails'>
                                    <b>Course Details:</b>
                                    <br/>
                                    {activeAnchor?.getAttribute('courseDetails').split('\n').map((courseDetail) => {
                                        courseDetail = courseDetail.replaceAll(",", "");
                                        return (
                                            <div>
                                                {courseDetail}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                    />

                </div>
            )
        })
    } else {
        lectures = (
            <div className='empty'>
                No Lectures
            </div>
        )
    }

    // Return a div for the lecture tab with each of the lecture box divs inside
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

// Left-hand tab for the labs. Read each of the lecture names from labInfo and store them in labTab. Display these in the tab.
const Labs = (props) => {

    const isDropDown = props.dropDownClick[2];

    const onSignClick = () => {
        props.setDropDownClick(2);
    }

    // Adjust the labTab if lecInfo changes (if the term is switched)
    useEffect(() => {

        if (props.labInfo && props.labInfo.length > 0) {
            if (props.labTab === null || !props.labTab.some(lab => props.labInfo.map(info => info.name).includes(lab))) {

                // Get all lab names contained in lecInfo
                var labs = props.labInfo.map((lab) => {
                    return lab.name;
                })

                // Remove all labs that are currently in the schedule
                if (props.tabMap.get(props.selectedTerm)) {
                    if (props.tabMap.get(props.selectedTerm).labTab) {

                        var toRemove = props.tabMap.get(props.selectedTerm).labTab;

                        const cleanedLabs = labs.filter(function (lab) {
                            return !toRemove.includes(lab);
                        })
                        labs = [...cleanedLabs];
                    }
                }

                props.setLabTab(labs);
            }
        } else {
            props.setLabTab(null);
        }
    }, [props.labInfo]);

    // Loop through labs, return component box for each
    let labs;
    if (props.labTab !== null) {
        labs = props.labTab.map((lab, index) => {

            // Get info for the course
            const labInfo = props.labInfo.find(labInfo => labInfo.name === lab);

            // Get options regarding what time slots/sections are available for the lab
            let option;
            if (labInfo !== undefined) {
                option = labInfo.options;
            }

            const courseDetails = [];

            // Get relevant details (section, location, professor) for each lab
            if (labInfo !== undefined) {
                labInfo.options.map((option) => {
                    const section = option.section;
                    const place = option.place;
                    const prof = option.instructor === "" ? "-" : option.instructor;

                    const courseProfANDPlaceInfo = "Section " + section + " Prof: " + prof + " ," + "Location: " + place + '\n';
                    courseDetails.push(courseProfANDPlaceInfo);
                })
            }

            // Create description for the tooltip popup that appears when you hover over the course
            const courses = props.structure.find(courses => courses.term === props.selectedTerm);
            const course = courses === undefined ? undefined : courses.courses.find(course => course.name.replace(/\([^)]+\)/g, '') === lab.replace(" Lab", ""));
            const courseDesc = course !== undefined ? course.description : "";
            const toolTipUniqueId = labInfo !== undefined ? labInfo.name.trim() + index.toString() : "";
            const extendedName = labInfo=== undefined ? "" : labInfo.name;

            // Return a single lab box with the course name inside. Also return a tooltip with the course info.
            return (
                <div>
                    <div
                        className='indivLab'
                        draggable={true}
                        onDragStart={(event) => {
                            props.handleDragStart(option, event, lab)
                        }}
                        onDragEnd={(event) => {
                            props.handleDragEnd(event);
                        }}
                        data-tooltip-id={toolTipUniqueId}
                        data-tooltip-content={courseDesc}
                        courseDetails={courseDetails}
                        extendedName={extendedName}
                    >
                        {lab}
                    </div>

                    <ReactTooltip place="bottom" id={toolTipUniqueId} enterDelay={5000} render={({content, activeAnchor}) => (
                        <div className='popUpDescription'>
                            <div className='popUpExtendedName'>
                                <b>{activeAnchor?.getAttribute('extendedName')}</b>
                            </div>
                            <br/>
                            <div>
                                {content}
                                <br/>
                                <div className='popUpCourseDetails'>
                                    <b>Lab Details:</b>
                                    <br/>
                                    {activeAnchor?.getAttribute('courseDetails').split('\n').map((courseDetail) => {
                                        courseDetail = courseDetail.replaceAll(",", "");
                                        return (
                                            <div>
                                                {courseDetail}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                    />
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

    // Return a div for the lab tab with each of the lab box divs inside
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

// Left-hand tab for the seminars. Read each of the lecture names from semInfo and store them in seminarTab. Display these in the tab.
const Seminars = (props) => {

    const isDropDown = props.dropDownClick[1];

    const onSignClick = () => {
        props.setDropDownClick(1);
    }

    // Adjust the seminarTab if lecInfo changes (if the term is switched)
    useEffect(() => {
        if (props.semInfo && props.semInfo.length > 0) {
            if (props.seminarTab === null || !props.seminarTab.some(sem => props.semInfo.map(info => info.name).includes(sem))) {

                // Get all seminar names contained in lecInfo
                var seminars = props.semInfo.map((seminar) => {
                    return seminar.name;
                })

                // Remove all seminars that are currently in the schedule
                if (props.tabMap.get(props.selectedTerm)) {
                    if (props.tabMap.get(props.selectedTerm).seminarTab) {

                        var toRemove = props.tabMap.get(props.selectedTerm).seminarTab;

                        const cleanedSeminars = seminars.filter(function (seminar) {
                            return !toRemove.includes(seminar);
                        })
                        seminars = [...cleanedSeminars];
                    }
                }

                props.setSeminarTab(seminars);
            }
        } else {
            props.setSeminarTab(null);
        }
    }, [props.semInfo]);

    // Loop through seminars, return component box for each
    let seminars;
    if (props.seminarTab !== null) {
        seminars = props.seminarTab.map((seminar, index) => {

            // Get info for the course
            const semInfo = props.semInfo.find(semInfo => semInfo.name === seminar);

            // Get options regarding what time slots/sections are available for the seminar
            let option;
            if (semInfo !== undefined) {
                option = semInfo.options;
            }

            const courseDetails = [];

            // Get relevant details (section, location, professor) for each seminar
            if (semInfo !== undefined) {
                semInfo.options.map((option) => {
                    const section = option.section;
                    const place = option.place;
                    const prof = option.instructor === "" ? "-" : option.instructor;

                    const courseProfANDPlaceInfo = "Section " + section + " Prof: " + prof + " ," + "Location: " + place + '\n';
                    courseDetails.push(courseProfANDPlaceInfo);
                })
            }

            // Create description for the tooltip popup that appears when you hover over the course
            const courses = props.structure.find(courses => courses.term === props.selectedTerm);
            const course = courses === undefined ? undefined : courses.courses.find(course => course.name.replace(/\([^)]+\)/g, '') === seminar.replace(" Sem", ""));
            const courseDesc = course !== undefined ? course.description : "";
            const toolTipUniqueId = semInfo !== undefined ? semInfo.name.trim() + index.toString() : "";
            const extendedName = semInfo === undefined ? "" : semInfo.name;

            // Return a single seminar box with the course name inside. Also return a tooltip with the course info.
            return (
                <div>
                    <div
                        className='indivSeminar'
                        draggable={true}
                        onDragStart={(event) => {
                            props.handleDragStart(option, event, seminar)
                        }}
                        onDragEnd={(event) => {
                            props.handleDragEnd(event);
                        }}
                        data-tooltip-id={toolTipUniqueId}
                        data-tooltip-content={courseDesc}
                        courseDetails={courseDetails}
                        extendedName={extendedName}
                    >
                        {seminar}
                    </div>

                    <ReactTooltip place="bottom" id={toolTipUniqueId} enterDelay={5000} render={({content, activeAnchor}) => (
                        <div className='popUpDescription'>
                            <div className='popUpExtendedName'>
                                <b>{activeAnchor?.getAttribute('extendedName')}</b>
                            </div>
                            <br/>
                            <div>
                                {content}
                                <br/>
                                <div className='popUpCourseDetails'>
                                    <b>Lab Details:</b>
                                    <br/>
                                    {activeAnchor?.getAttribute('courseDetails').split('\n').map((courseDetail) => {
                                        courseDetail = courseDetail.replaceAll(",", "");
                                        return (
                                            <div>
                                                {courseDetail}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                    />
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

    // Return a div for the seminar tab with each of the seminar box divs inside
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
                <div className='coursesInfo'>
                    {seminars}
                </div>
            )}
        </div>
    )
}

/**
 * Dropdwon for the unfinished Auto Generate feature (see next component)
 * Can re-add by uncommenting the CreateFromPreference component in the render() function at bottom of file
 * 
 */
const CreateFromPreference = (props) => {

    const isDropDown = props.dropDownClick[4];

    const onSignClick = () => {
        props.setDropDownClick(4);
    }

    return (
        <div>
            <div className={`createPalette ${isDropDown ? 'dropdownOpen' : ''}`}>
                <div className='createsPaletteTitle'>
                    Auto Generate
                </div>
                <div className='createsPaletteDropDownButton' onClick={onSignClick}>
                    <DropDownSign isDropDown={isDropDown}/>
                </div>
            </div>
            {!isDropDown && (
                <PreferenceTab {...props}/>
            )}
        </div>
    )
}

/**
 * Unfinished feature, designed to auto-generate a schedule for a particular term
 * Loops through each course in the lec, lab, and sem side panels and places them on the schedule table
 * Built as an extra tab on the scheduler left-hand side. Button to generate, dropdwons to pick preferred start time/end time for each day
 * 
 * Known issues: It doesn't always find a valid schedule, even if one exists. Sometimes need to add a course or two before works. 
 * 
 * @param {*} props 
 * @returns 
 */
const PreferenceTab = (props) => {
    const timeSlots = ['8:00', '8:30', '9:00', '9:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'];
    const [from, setFrom] = useState(timeSlots.at(0));
    const [to, setTo] = useState(timeSlots.at(timeSlots.length - 1));
    const [showDropDownList, setShowDropDownList] = useState([false, false]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState('');

    const openModal = (content) => {
        setIsModalOpen(true);
        setModalContent(content);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalContent('');
    };

    const handleDropDown = (index) => {
        const dropDownList = [...showDropDownList];
        dropDownList[index] = !dropDownList[index];
        setShowDropDownList(dropDownList);
    }

    const handleFromOnClick = (timeSlot, index) => {
        setFrom(timeSlot);
        handleDropDown(index);
    }

    const fromTimeDivs = timeSlots.map((timeSlot) => (
        <div className='time' onClick={() => handleFromOnClick(timeSlot, 0)}>
            {timeSlot}
        </div>
    ));

    const timeToMinutes = (time) => {
        const [hours, minutes] = time.split(':');
        return Number(hours) * 60 + Number(minutes);
    }

    const handleToOnClick = (timeSlot, index) => {
        const fromTimeInMinutes = timeToMinutes(from);
        const timeSlotInMinutes = timeToMinutes(timeSlot);

        if (timeSlotInMinutes <= fromTimeInMinutes) {
            alert('The selected time is invalid. It should be later than the start time.');
        } else {
            setTo(timeSlot);
        }

        handleDropDown(index);
    }

    const toTimeDivs = timeSlots.map((timeSlot) => (
        <div className='time' onClick={() => handleToOnClick(timeSlot, 1)}>
            {timeSlot}
        </div>
    ));

    /**
     * send http request to  the backend to get updated timetable
     * */
    const handleGenerateButtonOnclick = () => {
        const restController = new RESTController();
        let unDraggedTagList = [];
        props.lectureTab.forEach((lecture) => {
            unDraggedTagList.push(lecture);
        })

        if (props.labTab) {
            props.labTab.forEach((lab) => {
                unDraggedTagList.push(lab);
            })
        }

        if (props.seminarTab) {
            props.seminarTab.forEach((seminar) => {
                unDraggedTagList.push(seminar);
            })
        }

        // create new version of current ob-table schedule
        let newHighLightCells = [...props.highLightCells];
        const startInMin = timeToMinutes("8:00");
        const fromInMin = timeToMinutes(from);
        const endInMin = timeToMinutes("22:00");
        const toInMin = timeToMinutes(to);

        const startRow = (fromInMin - startInMin) / 30 - 1;
        const endRow = newHighLightCells.length - (endInMin - toInMin) / 30;

        // TODO: Not being used, need to update in the future
        const profs = Array.from({length: props.lectureTab.length}, () => ['ALL']);

        // Use restController to query backend for data
        restController.getUpdatedTimetable({
            timetable: props.highLightCells,
            courseList: unDraggedTagList,
            profs: profs,
            term: props.term,
            startRow: startRow,
            endRow: endRow
        })
            .then(updatedTimetable => {
                if (updatedTimetable.includes("Random Generate failed")) {
                    openModal(updatedTimetable);
                } else {
                    const reformatTimetable = props.reformatTimetable(updatedTimetable);
                    props.setHighLightCells(reformatTimetable);
                    props.setLectureTab([]);
                    props.setLabTab([]);
                    props.setSeminarTab([]);
                }
            });
    }

    return (
        <div className='coursesInfo'>
            <div className='innerButtonDiv'>
                <div className='preferredTime'>
                    <div className='preferredTimeTitle'>Choose A Time Period</div>
                    <div className='fromSection'>
                        From
                        <div className='fromTime'>
                            <div className='fromPart'
                                 onClick={() => {
                                     handleDropDown(0)
                                 }}>
                                {from}
                            </div>
                            {showDropDownList[0] && (<div className='timeDivWrapper'>{fromTimeDivs}</div>)}
                        </div>
                    </div>
                    <div className='toSection'>
                        To
                        <div className='toTime'>
                            <div className='fromPart'
                                 onClick={() => {
                                     handleDropDown(1)
                                 }}
                            >
                                {to}
                            </div>
                            {showDropDownList[1] && (<div className='timeDivWrapper'>{toTimeDivs}</div>)}
                        </div>
                    </div>
                </div>

                <div
                    className='generateButton'
                    onClick={handleGenerateButtonOnclick}
                >
                    Generate
                </div>
            </div>

            <div>
                <Modal isOpen={isModalOpen} onClose={closeModal} content={modalContent}/>
            </div>
        </div>
    );
}

// Component for the above Auto Generate component. Used to let user pick times I think.
const Modal = ({
                   isOpen, onClose, content
               }) => {

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-content">{content}</div>
                <button className="modal-close-button" onClick={onClose}>
                    &times;
                </button>
            </div>
        </div>
    );
};

/**
 * Allows the user to add a new course to their lecture, lab, and seminar panels. Passes in a list of courses and info to the Searchbar component.
 * Handles dropdown behaviour for this section, and hosts the Searchbar.
 * 
 * @param {*} props 
 * @returns 
 */
const Search = (props) => {

    const isDropDown = props.dropDownClick[3];

    const onSignClick = () => {
        props.setDropDownClick(3);
    }

    // Get list of all courses into a local var
    const courses = props.searchInfo;
    const placeHolder = 'Search...';


    // Return dropdwon searchbar component with all the discipline's plans' courses
    return (
        <div>
            <div className={`searchPalette ${isDropDown ? 'dropdownOpen' : ''}`}>
                <div className='searchPaletteTitle'>
                    Add
                </div>
                <div className='searchPaletteDropDownButton' onClick={onSignClick}>
                    <DropDownSign isDropDown={isDropDown}/>
                </div>
            </div>
            {!isDropDown && (
                <div className='searchBarCoursesInfo'>
                    <Searchbar
                        placeHolder={placeHolder}
                        options={courses}
                        addCourse={props.addCourse}
                        isSearchable={true}
                    />
                </div>
            )}
        </div>
    )
}

/**
 * Actual table component. Displays values in the highLightCells state function, a nested array in the form:
 * 
 *  [
 *      [[color, type of cell, course name], [color, type, name], ...]
 *      ...
 *      [[color, type of cell, course name],...]
 *          ^          ^             
 *          |          |             
 *         hex      Start, '', or End    --> determines styling/where to put course name
 *  ]
 * 
 * @param {*} props 
 * @returns 
 */
const Timetable = (props) => {
    const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const timeSlots = ['8:00', '8:30', '9:00', '9:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'];


    // Store the schedule for the current term in scheduleMap whenever it changes
    useEffect(() => {
        const updatedMap = new Map(props.scheduleMap);
        updatedMap.set(props.selectedTerm, props.highLightCells);
        props.setScheduleMap(updatedMap);

    }, [props.highLightCells]);


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
                {timeSlots.map((timeSlot, hourIndex) => {

                    return (
                        <tr key={hourIndex.toString()}>
                            {hourIndex % 2 === 0 && <td rowSpan="2" className="timeCell">{timeSlot}</td>}
                            {weekDays.map((day, dayIndex) => {

                                // Get individual details from the specific highLightCells cell
                                const color = props.highLightCells[hourIndex][dayIndex][0];
                                const part = props.highLightCells[hourIndex][dayIndex][1];
                                const section = props.highLightCells[hourIndex][dayIndex][2];
                                const className = hourIndex % 2 === 0 ? 'topCell' : 'bottomCell';

                                let innerClassName = "innerCell" + part;
                                let content;
                                let text = section;

                                // Reconstruct course name to not include the section letter/number
                                if (section !== null && color === '#275D38') {
                                    const sectionParts = section.split(' ');
                                    text = '';
                                    sectionParts.slice(0, sectionParts.length - 1).forEach((part) => {
                                        text += part;
                                        text += ' ';
                                    })
                                    text = text.trimEnd();
                                }

                                // time conflict text
                                if (color === '#888888') {
                                    text = '';
                                    innerClassName += 'Conflict';
                                }

                                // Show text of course name if this is the "Start" (first) cell for the course
                                if (innerClassName === 'innerCellStart') {
                                    content = text;
                                }

                                // pop up description
                                let descriptionContent = "";
                                let sectionLocation = "";
                                let sectionInstructor = "";
                                const hasSection = section !== null && color !== '#888888';
                                const toolTipUniqueId = section + "index" + dayIndex.toString();

                                // Handle tooltip info generation
                                if (hasSection) {
                                    let courseTitle = "";
                                    const parts = section.split(" ");
                                    parts.forEach((part, index) => {
                                        if (index !== parts.length - 1) {
                                            if (part.toLowerCase() !== "lab" && (part.toLowerCase() !== "sem")) {
                                                courseTitle += part;
                                                courseTitle += " ";
                                            }
                                        }
                                    })

                                    // Adjust info for display on the the tooltips that show when you hover over the course on the schedule
                                    const courses = props.structure.find(courses => courses.term === props.selectedTerm);
                                    const course = courses === undefined ? undefined : courses.courses.find(course => course.name.replace(/\([^)]+\)/g, '') === courseTitle.trim());
                                    descriptionContent = course !== undefined ? course.description : "";
                                    const courseSection = parts[parts.length - 1];

                                    // Get information for the tooltips that show when you hover over the course on the schedule
                                    if (section.toLowerCase().includes("lab")) {
                                        const lab = props.labInfo.find(lab => lab.name === courseTitle + "Lab");

                                        if (lab !== undefined) {
                                            const labSectionInfo = lab.options.find(labSection => labSection.section === courseSection);
                                            if (labSectionInfo !== undefined) {
                                                sectionLocation = labSectionInfo.place === "" ? "unknown" : labSectionInfo.place;
                                                sectionInstructor = labSectionInfo.instructor === "" ? "unknown" : labSectionInfo.instructor;
                                            }
                                        }
                                    } else if (section.toLowerCase().includes("sem")) {
                                        const seminar = props.semInfo.find(seminar => seminar.name === courseTitle + "Sem");

                                        if (seminar !== undefined) {
                                            const seminarSectionInfo = seminar.options.find(seminarSection => seminarSection.section === courseSection);
                                            if (seminarSectionInfo !== undefined) {
                                                sectionLocation = seminarSectionInfo.place === "" ? "unknown" : seminarSectionInfo.place;
                                                sectionInstructor = seminarSectionInfo.instructor === "" ? "unknown" : seminarSectionInfo.instructor;
                                            }
                                        }
                                    } else {
                                        const lecture = props.lecInfo.find(lecture => lecture.name === courseTitle.trim());

                                        if (lecture !== undefined) {
                                            const lectureSectionInfo = lecture.options.find(lectureSection => lectureSection.section === courseSection);
                                            if (lectureSectionInfo !== undefined) {
                                                sectionLocation = lectureSectionInfo.place === "" ? "unknown" : lectureSectionInfo.place;
                                                sectionInstructor = lectureSectionInfo.instructor === "" ? "unknown" : lectureSectionInfo.instructor;
                                            }
                                        }
                                    }
                                }

                                // Return a cell for the timetable if there is a course placed in that spot
                                return (
                                    <td
                                        key={day}
                                        className={className}
                                    >
                                        <div className="insideCell">
                                            {color && (
                                                <div
                                                    className={innerClassName}
                                                    style={{
                                                        color: color,
                                                        backgroundColor: color,
                                                        backgroundImage: innerClassName.includes("Conflict") ? `url(/conflict.png)` : null,
                                                        backgroundSize: '37px 37px',
                                                        backgroundPosition: "center",
                                                    }}
                                                    onContextMenu={(event) => props.handleRightClick(event, section)}
                                                    onDragOver={props.handleDragOver}
                                                    onDrop={(event) => props.handleDrop(event, hourIndex, dayIndex, section)}
                                                    data-tooltip-id="cellsInTimeTable"
                                                    data-tooltip-content={descriptionContent}
                                                    extendedName={section}
                                                    sectionLocation={sectionLocation}
                                                    sectionInstructor={sectionInstructor}
                                                >
                                                    <div className='content'>
                                                        {content}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                );
                            })}
                        </tr>
                    );
                })}
                </tbody>

                <ReactTooltip enterDelay={5000} place="bottom" id="cellsInTimeTable"
                              render={({content, activeAnchor}) => (
                                  <div className='popUpDescription'>
                                      <div className='popUpExtendedName'>
                                          <b>{activeAnchor?.getAttribute('extendedName')}</b>
                                      </div>
                                      <br/>
                                      <div>
                                          {content}
                                          <br/>
                                          <div className='popUpCourseDetails'>
                                              <b>Course Details:</b>
                                              <br/>
                                              <b>Instructor: </b>
                                              {activeAnchor?.getAttribute('sectionInstructor')}
                                              <br></br>
                                              <b>Location: </b>
                                              {activeAnchor?.getAttribute('sectionLocation')}
                                          </div>
                                      </div>
                                  </div>
                              )}
                />
            </div>
        </table>
    )
}


/**
 * The Scheduler tab. Displays the selected plan, options for the import or export of data, and then a timetable component.
 * The timetable has tabs for different terms, and in each term you can drag courses onto the timetable from the left hand
 * panels. 
 * 
 */
class Scheduler extends Component {

    // When a user selects a course on the "Add" searchbar, we query the backend for the course's data, and add it to the respective tab panels
    addCourse = (courseName) => {

        // Get if the term is Fall, Winter, or Summer
        const termType = this.props.selectedTerm.split(" ")[0].toLowerCase();
        const restController = new RESTController();

        // Put the data in the right format for the REST controller
        const data = {
            courseName: courseName,
            term: termType,
        }

        // Query backend for data about lec, lab, sem if exist for the searched course
        restController.getIndivLec(data).then((result) => {

            // Update respective info and tab data structures for lectures
            if (result !== [] && result[0] !== undefined && result[0] !== null) {
                this.props.setLecInfo([
                    ...this.props.lecInfo,
                    result[0]
                ])

                // Ensure we're not assigning a null to LectureTab (throws error)
                var updatedLecTab = (this.props.lectureTab !== null) ? [...this.props.lectureTab] : [];

                this.props.setLectureTab([
                    ...updatedLecTab,
                    result[0].name
                ])
            }
        });
        restController.getIndivLab(data).then((result) => {

            // Update respective info and tab data structures for lab
            if (result !== [] && result[0] !== undefined && result[0] !== null) {
                this.props.setLabInfo([
                    ...this.props.labInfo,
                    result[0]
                ])

                // Ensure we're not assigning a null to LectureTab (throws error)
                var updatedLabTab = (this.props.labTab !== null) ? [...this.props.labTab] : [];

                this.props.setLabTab([
                    ...updatedLabTab,
                    result[0].name
                ])
            }
        });
        restController.getIndivSem(data).then((result) => {

            // Update respective info and tab data structures for seminar
            if (result !== [] && result[0] !== undefined && result[0] !== null) {
                this.props.setSemInfo([
                    ...this.props.semInfo,
                    result[0]
                ])

                // Ensure we're not assigning a null to LectureTab (throws error)
                var updatedSemTab = (this.props.seminarTab !== null) ? [...this.props.seminarTab] : [];

                this.props.setSeminarTab([
                    ...updatedSemTab,
                    result[0].name
                ])
            }
        });
    }

    // Get the column index based on the name of the day of the week
    dateProcess = (date) => {

        // column number
        let colNum;
        switch (date) {
            case 'MON':
                colNum = 0;
                break;
            case 'TUE':
                colNum = 1;
                break;
            case 'WED':
                colNum = 2;
                break;
            case 'THU':
                colNum = 3;
                break;
            case 'FRI':
                colNum = 4;
                break;
            default:
                colNum = 5;
                break;
        }

        return colNum;
    }

    // calculate the cell row and column index
    timeProcess = (time, type) => {

        // row number
        let hour = time.split(':')[0];
        let minute = time.split(':')[1];

        if (hour.charAt(0) === '0') {
            hour = hour.substring(1);
        }

        let hourInInt;
        if (minute !== "00") {
            hourInInt = parseInt(hour, 10) + 0.5;
        } else {
            hourInInt = parseInt(hour, 10);
        }

        return type === 'start' ? (hourInInt - 8) * 2 : (hourInInt - 8) * 2 - 1;
    }

    // When the user right-clicks on a course, return it to the respective tab panel
    handleRightClick = (event, section) => {
        event.preventDefault();

        if (section.toLowerCase().includes('lab')) {
            // add the course back to palette
            const newLabTab = this.props.labTab;
            const sectionParts = section.split(' ');
            const course = sectionParts.slice(0, sectionParts.length - 1);
            let newCourse = '';
            course.forEach((part) => {
                newCourse += part;
                newCourse += ' ';
            })
            newLabTab.push(newCourse.trimEnd());
            this.props.setLabTab(newLabTab);

            // Remove course from list of placed courses
            this.removeTabMap(newCourse.trimEnd());

        } else if (section.toLowerCase().includes('sem')) {
            // add the course back to palette
            const newSemTab = this.props.seminarTab;
            const sectionParts = section.split(' ');
            const course = sectionParts.slice(0, sectionParts.length - 1);
            let newCourse = '';
            course.forEach((part) => {
                newCourse += part;
                newCourse += ' ';
            })
            newSemTab.push(newCourse.trimEnd());
            this.props.setSeminarTab(newSemTab);

            // Remove course from list of placed courses
            this.removeTabMap(newCourse.trimEnd());

        } else {
            // add the course back to palette
            const newLectureTab = this.props.lectureTab;
            const sectionParts = section.split(' ');
            const course = sectionParts.slice(0, sectionParts.length - 1);
            let newCourse = '';
            course.forEach((part) => {
                newCourse += part;
                newCourse += ' ';
            })

            newLectureTab.push(newCourse.trimEnd());
            this.props.setLectureTab(newLectureTab);

            // Remove course from list of placed courses
            this.removeTabMap(newCourse.trimEnd());
        }

        // delete from the timetable
        const newHighLightCells = this.props.highLightCells;
        newHighLightCells.forEach((row, rowIndex) => {
            row.forEach((column, columnIndex) => {
                if (column[2] === section) {
                    newHighLightCells[rowIndex][columnIndex] = [null, '', null];
                }
            })
        });

        this.props.setHighLightCells(newHighLightCells);
    }

    // start dragging function
    handleDragStart = (options, event, courseInfo) => {
        event.dataTransfer.setData('text', JSON.stringify(courseInfo));

        // Create new map for the timetable cells
        const newHighlightedCells = this.props.highLightCells.map(row => [...row]);
        const restController = new RESTController();
        const duplicateSectionSet = new Set();
        const conflictSections = new Set();

        // Loop through course time options
        options.map((option) => {
            const durations = option.times;
            const section = courseInfo + " " + option.section;
            const color = restController.generateRandomColor();

            // Loop through durations
            durations.map((duration) => {
                const date = duration.split('_')[0];
                const time = duration.split('_')[1];

                // Get details about the start and end locations of the course on the timetable
                const startTime = time.split('-')[0].length === 4 ? '0' + time.split('-')[0] : time.split('-')[0];
                const endTime = time.split('-')[1].length === 4 ? '0' + time.split('-')[1] : time.split('-')[1];
                const colNum = this.dateProcess(date);
                const startRowNumber = this.timeProcess(startTime, 'start');
                const endRowNumber = this.timeProcess(endTime, 'end');

                // Determine if cell is the start, middle, or end of the course on the timetable
                for (let i = startRowNumber; i <= endRowNumber; i++) {

                    if (newHighlightedCells[i][colNum][0] !== '#275D38') {
                        if (i === startRowNumber) {
                            newHighlightedCells[i][colNum] = [color, 'Start', section];
                        } else if (i === endRowNumber) {
                            newHighlightedCells[i][colNum] = [color, 'End', section];
                        } else {
                            newHighlightedCells[i][colNum] = [color, '', section];
                        }
                    } else {
                        duplicateSectionSet.add(newHighlightedCells[i][colNum][2]);
                        conflictSections.add(section);
                    }
                }
            })
        })

        // Remove duplicate sections I think
        duplicateSectionSet.forEach((section) => {
            newHighlightedCells.forEach((row, rowIndex) => {
                row.forEach((column, columnIndex) => {
                    const part = newHighlightedCells[rowIndex][columnIndex][1];
                    const oldSection = newHighlightedCells[rowIndex][columnIndex][2];
                    if (oldSection === section) {
                        newHighlightedCells[rowIndex][columnIndex] = ['#888888', part, section];
                    }
                })
            })
        })

        // Handle conflict regions, where a dragged course overlaps an already placed one
        conflictSections.forEach((section) => {
            newHighlightedCells.forEach((row, rowIndex) => {
                row.forEach((column, columnIndex) => {
                    if (column[2] === section) {
                        newHighlightedCells[rowIndex][columnIndex] = ['#888888', '', null];
                    }
                })
            })
        })

        // reformat the conflict region
        newHighlightedCells.forEach((row, rowIndex) => {
            row.forEach((column, columnIndex) => {
                const cell = newHighlightedCells[rowIndex][columnIndex];
                const color = cell[0];
                if (rowIndex === 0) {
                    if (color === '#888888') {
                        newHighlightedCells[rowIndex][columnIndex][1] = 'Start';
                    }
                } else if (rowIndex === newHighlightedCells.length - 1) {
                    if (color === '#888888') {
                        newHighlightedCells[rowIndex][columnIndex][1] = 'End';
                    }
                } else {
                    if (color === '#888888') {
                        newHighlightedCells[rowIndex][columnIndex][1] = '';

                        if (newHighlightedCells[rowIndex + 1][columnIndex][0] !== '#888888') {
                            newHighlightedCells[rowIndex][columnIndex][1] = 'End';
                        }

                        if (newHighlightedCells[rowIndex - 1][columnIndex][0] !== '#888888') {
                            newHighlightedCells[rowIndex][columnIndex][1] = 'Start';
                        }

                    }
                }
            })
        })

        // Set the new timetable
        this.props.setHighLightCells(newHighlightedCells);
    }


    // Once a user has dragged a course onto the timetable and let go, place that course on the timetable
    handleDragEnd = (event) => {
        event.preventDefault();

        // Get a new version of the storage system for the timetable cells
        let newHighlightedCells = this.props.highLightCells.map(row => row.map(cell => [...cell]));

        // Loop through and set the cells for the timetable with the course placed
        newHighlightedCells.forEach((row, rowIndex) => {
            row.forEach((cell, cellIndex) => {
                if (cell[0] !== '#275D38') {
                    if (cell[0] !== '#888888') {
                        newHighlightedCells[rowIndex][cellIndex] = [null, '', null];
                    } else {
                        if (cell[2] === null) {
                            newHighlightedCells[rowIndex][cellIndex] = [null, '', null];
                        } else {
                            newHighlightedCells[rowIndex][cellIndex][0] = '#275D38';
                        }
                    }
                }
            })
        })

        // Set the Start or End values in each cell
        const newTimeTable = this.reformatTimetable(newHighlightedCells);
        this.props.setHighLightCells(newTimeTable);
    }

    // end dragging function
    handleDragOver(event) {
        event.preventDefault();
    }

    // add a value to the tabMap, a map of all of the scheduled courses for each semester
    addTabMap(courseName) {
        var tabs = {};
        if (!this.props.tabMap.get(this.props.selectedTerm)) {

            // Create an empty data storage object for this term's tabs
            tabs = {
                lectureTab: [],
                labTab: [],
                seminarTab: []
            }
        } else {
            tabs = this.props.tabMap.get(this.props.selectedTerm);
        }

        // Updated the specific tab in the specific record in the tabMap
        if (courseName.includes('Sem')) {
            tabs.seminarTab.push(courseName);
        } else if (courseName.includes('Lab')) {
            tabs.labTab.push(courseName);
        } else {
            tabs.lectureTab.push(courseName);
        }
        const updatedTabMap = new Map(this.props.tabMap);
        updatedTabMap.set(this.props.selectedTerm, tabs);
        this.props.setTabMap(updatedTabMap);
    }

    // remove a value from the tabMap, a map of all of the scheduled courses for each semester
    removeTabMap(courseName) {
        if (this.props.tabMap.get(this.props.selectedTerm)) {

            var tabs = this.props.tabMap.get(this.props.selectedTerm);
            var updatedTabs = [];

            // Updated the specific tab in the specific record in the tabMap
            if (courseName.includes('Sem')) {
                updatedTabs = tabs.seminarTab.filter(function (course) {
                    return course !== courseName;
                })
                tabs["seminarTab"] = [...updatedTabs];
            } else if (courseName.includes('Lab')) {
                updatedTabs = tabs.labTab.filter(function (course) {
                    return course !== courseName;
                })
                tabs["labTab"] = [...updatedTabs];
            } else {
                updatedTabs = tabs.lectureTab.filter(function (course) {
                    return course !== courseName;
                })
                tabs["lectureTab"] = [...updatedTabs];
            }

            const updatedTabMap = new Map(this.props.tabMap);
            updatedTabMap.set(this.props.selectedTerm, tabs);
            this.props.setTabMap(updatedTabMap);
        }
    }

    // drop function
    handleDrop = (event, hourIndex, dayIndex, section) => {

        // if drop to a time conflict cell, nothing happens,
        if (!this.checkCell(hourIndex, dayIndex)) {
            event.preventDefault();

            let newHighlightedCells = this.props.highLightCells.map(row => row.map(cell => [...cell]));

            newHighlightedCells.forEach((row, rowIndex) => {
                row.forEach((column, columnIndex) => {
                    if (column[0] === '#888888') {
                        if (column[2] !== null) {
                            column[0] = '#275D38';
                        } else {
                            newHighlightedCells[rowIndex][columnIndex] = [null, '', null];
                        }
                    }
                })
            });

            // Set the start and end fields in the cells
            const newTimeTable = this.reformatTimetable(newHighlightedCells);
            this.props.setHighLightCells(newTimeTable);
            return;
        }

        // remove selected course from the palette
        const courseInfo = JSON.parse(event.dataTransfer.getData('text'));
        if (courseInfo.includes('Lab')) {
            const updatedLabTab = [...this.props.labTab];
            const newLabTab = updatedLabTab.filter(item => item !== courseInfo);
            this.props.setLabTab(newLabTab);
        } else if (courseInfo.includes('Sem')) {
            const updatedSemTab = [...this.props.seminarTab];
            const newSeminarTab = updatedSemTab.filter(item => item !== courseInfo);
            this.props.setSeminarTab(newSeminarTab);
        } else {
            const updatedLecTab = [...this.props.lectureTab];
            const newLecTab = updatedLecTab.filter(item => item !== courseInfo);
            this.props.setLectureTab(newLecTab);
        }

        // Add course to array of courses present in the schedule
        this.addTabMap(courseInfo);

        let newHighlightedCells = this.props.highLightCells.map(row => row.map(cell => [...cell]));

        // Handle conflict section removal
        newHighlightedCells.forEach((row, rowIndex) => {
            row.forEach((column, columnIndex) => {
                if (column[0] !== '#275D38') {
                    if (column[0] === '#888888') {
                        if (column[2] !== null) {
                            column[0] = '#275D38';
                        } else {
                            newHighlightedCells[rowIndex][columnIndex] = [null, '', null];
                        }
                    } else {
                        if (column[2] === section) {
                            column[0] = '#275D38';
                        } else {
                            column[0] = null;
                            column[1] = '';
                            column[2] = null;
                        }
                    }
                }
            })
        });

        // Set the start and end fields in the cells
        const newTimeTable = this.reformatTimetable(newHighlightedCells);
        this.props.setHighLightCells(newTimeTable);
    }

    // See if a cell in the timetable is empty
    checkCell = (hourIndex, dayIndex) => {
        const color = this.props.highLightCells[hourIndex][dayIndex][0];
        return color !== null && color !== '#275D38' && color !== '#888888';
    }

    /**
     * reformat the timetable to add proper start and end delimeters to cells at the start and end of courses
     * */
    reformatTimetable = (highLightCells) => {
        let newHighlightedCells = highLightCells.map(row => row.map(cell => [...cell]));

        newHighlightedCells.forEach((row, rowIndex) => {
            row.forEach((column, columnIndex) => {
                const color = newHighlightedCells[rowIndex][columnIndex][0];
                const section = newHighlightedCells[rowIndex][columnIndex][2];

                // If in first row, will always be a 'Start'
                if (rowIndex === 0) {
                    if (color === '#275D38' && section !== null) {
                        newHighlightedCells[rowIndex][columnIndex][1] = 'Start';
                    }
                } 
                // Always an 'End' if in the final row
                else if (rowIndex === newHighlightedCells.length - 1) {
                    if (color === '#275D38' && section !== null) {
                        newHighlightedCells[rowIndex][columnIndex][1] = 'End';
                    }
                } 
                // More complicated if in the middle, check nearby cell. If none above, 'Start', none below, 'End'
                else {
                    if (color === '#275D38') {
                        newHighlightedCells[rowIndex][columnIndex][1] = '';

                        if (newHighlightedCells[rowIndex + 1][columnIndex][2] !== section) {
                            newHighlightedCells[rowIndex][columnIndex][1] = 'End';
                        }

                        if (newHighlightedCells[rowIndex - 1][columnIndex][2] !== section) {
                            newHighlightedCells[rowIndex][columnIndex][1] = 'Start';
                        }
                    }
                }
            })
        });

        return newHighlightedCells;
    }

    /**
     * Create a no-style pdf report containing the information from scheduleMap
     * Report template located in ExportPDF.js
     * 
     * @returns 
     */
    generatePdfReport = async (scheduleMap) => {
        const blob = await pdf((
            <TestReport
                scheduleMap={scheduleMap}
            />
        )).toBlob();
        saveAs(blob, "Scheduler_Report.pdf");
    }

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
            searchInfo,
            lectureTab,
            labTab,
            seminarTab,
            highLightCells,
            structure,
        } = this.props;

        return (
            <div>
                <PageTitle selectedProgram={selectedProgram}/>
                <div className="optionsWrapper">
                    <div className="planDisplayWrapper">
                        <Plan
                            selectedProgram={selectedProgram}
                            selectedPlan={selectedPlan}
                        />
                    </div>
                    <div className="allOptions">
                        <div className="SelectedPlanDescription">ADDITIONAL ACTIONS</div>
                        <div className="scheduleDescription">
                            Import or export to excel, or save a pdf report of your schedule.
                        </div>
                        <div className="optionsButtonsWrapper">
                            <ExportCSV
                                csvMap={this.props.scheduleMap}
                                fileName="EngineeringSchedule"
                            />
                            <ImportCSV
                                setHighLightCells={this.props.setHighLightCells}
                                scheduleMap={this.props.scheduleMap}
                                setScheduleMap={this.props.setScheduleMap}
                                reformatTimetable={this.reformatTimetable}
                                lectureTab={lectureTab}
                                setLectureTab={this.props.setLectureTab}
                                labTab={labTab}
                                setLabTab={this.props.setLabTab}
                                seminarTab={seminarTab}
                                setSeminarTab={this.props.setSeminarTab}
                                tabMap={this.props.tabMap}
                                setTabMap={this.props.setTabMap}
                                selectedTerm={selectedTerm}
                            />
                            {/* <PDFDownloadLink 
                                document={
                                    <TestReport 
                                        scheduleMap={this.props.scheduleMap}
                                    />
                                } 
                                filename="SchedulerReport.pdf" 
                                className="exportButton"
                            >
                                {({ blob, url, loading, error }) => (loading ? 'Loading...' : 'Download Report')}
                            </PDFDownloadLink> */}
                            <button
                                onClick={ async () => {await this.generatePdfReport(this.props.scheduleMap); }}
                                className="exportButton"
                            >
                                Download Schedules
                            </button>
                        </div>
                    </div>
                </div>
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
                        setHighLightCells={this.props.setHighLightCells}
                        scheduleMap={this.props.scheduleMap}
                        setScheduleMap={this.props.setScheduleMap}
                        setLecInfo={this.props.setLecInfo}
                        setSemInfo={this.props.setSemInfo}
                        setLabInfo={this.props.setLabInfo}
                        setSearchInfo={this.props.setSearchInfo}
                        tabMap={this.props.tabMap}
                        setTabMap={this.props.setTabMap}
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
                            lectureTab={lectureTab}
                            setLectureTab={this.props.setLectureTab}
                            handleDragStart={this.handleDragStart}
                            handleDragEnd={this.handleDragEnd}
                            tabMap={this.props.tabMap}
                            structure={structure}
                        />
                        <Labs
                            dropDownClick={dropDownClick}
                            setDropDownClick={this.props.setDropDownClick}
                            selectedProgram={selectedProgram}
                            selectedPlan={selectedPlan}
                            selectedTerm={selectedTerm}
                            labInfo={labInfo}
                            labTab={labTab}
                            setLabTab={this.props.setLabTab}
                            handleDragStart={this.handleDragStart}
                            handleDragEnd={this.handleDragEnd}
                            tabMap={this.props.tabMap}
                            structure={structure}
                        />
                        <Seminars
                            dropDownClick={dropDownClick}
                            setDropDownClick={this.props.setDropDownClick}
                            selectedProgram={selectedProgram}
                            selectedPlan={selectedPlan}
                            selectedTerm={selectedTerm}
                            semInfo={semInfo}
                            seminarTab={seminarTab}
                            setSeminarTab={this.props.setSeminarTab}
                            handleDragStart={this.handleDragStart}
                            handleDragEnd={this.handleDragEnd}
                            tabMap={this.props.tabMap}
                            structure={structure}
                        />
                        {/* <CreateFromPreference
                            dropDownClick={dropDownClick}
                            setDropDownClick={this.props.setDropDownClick}
                            highLightCells={highLightCells}
                            setHighLightCells={this.props.setHighLightCells}
                            lectureTab={lectureTab}
                            setLectureTab={this.props.setLectureTab}
                            labTab={labTab}
                            setLabTab={this.props.setLabTab}
                            seminarTab={seminarTab}
                            setSeminarTab={this.props.setSeminarTab}
                            reformatTimetable={this.reformatTimetable}
                            term={this.props.selectedTerm}
                            reformatTimeTable={this.reformatTimetable}
                        /> */}
                        <Search
                            dropDownClick={dropDownClick}
                            setDropDownClick={this.props.setDropDownClick}
                            selectedTerm={selectedTerm}
                            searchInfo={searchInfo}
                            addCourse={this.addCourse}
                        />

                    </div>
                    <div className='timeTableTable'>
                        <Timetable
                            highLightCells={highLightCells}
                            handleDrop={this.handleDrop}
                            handleDragOver={this.handleDragOver}
                            handleRightClick={this.handleRightClick}
                            selectedTerm={selectedTerm}
                            scheduleMap={this.props.scheduleMap}
                            setScheduleMap={this.props.setScheduleMap}
                            tabMap={this.props.tabMap}
                            setTabMap={this.props.setTabMap}
                            lecInfo={lecInfo}
                            labInfo={labInfo}
                            semInfo={semInfo}
                            lectureTab={lectureTab}
                            labTab={labTab}
                            seminarTab={seminarTab}
                            structure={structure}
                        />
                    </div>
                </div>
            </div>
        )

    }
}

export default Scheduler;
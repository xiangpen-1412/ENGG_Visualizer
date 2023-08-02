import React, {Component, useEffect, useState} from "react";
import './Scheduler.css'
import Searchbar from './Searchbar.js';
import {ExportCSV} from './ExportCSV.js';
import {ImportCSV} from './ImportCSV.js';
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

            restController.getAllCourses({program: data.programName}).then((courses) => {
                props.setSearchInfo(courses);
            });
        }
    }, [props.selectedProgram, props.selectedPlan, props.selectedTerm]);

    const terms = props.termList.map((term) => {

        const isSelected = props.selectedTerm === term;
        const className = isSelected ? 'selectedIndivTerm' : 'indivTerm';

        return (
            <div
                className={className}
                onClick={() => {
                    props.setSelectedTerm(term);

                    const newHighLightCells = Array.from({length: 26}, () => Array.from({length: 5}, () => [null, '', null]));
                    props.setHighLightCells(newHighLightCells);
                }}
            >
                {term}
            </div>
        );
    })

    return (
        <div className='termTube'>
            {terms}
            <NewTerm
                termList={props.termList}
                setTermList={props.setTermList}
            />
        </div>
    )
}

// Button to add additional terms to Scheduler
const NewTerm = (props) => {

    const [termNumber, setTermNumber] = useState(9);
    const [termIndex, setTermIndex] = useState(0);

    const termTypes = ['Summer', 'Fall', 'Winter'];

    // Add a new term with proper number and term type when + is clicked
    const handleClick = () => {

        const newTermName = [termTypes[termIndex], 'Term', termNumber];

        // Add term to terms array
        props.setTermList([
            ...props.termList,
            newTermName.join(' ')
        ])

        // Store next term type and number
        setTermNumber((prevNumber) => prevNumber + 1);
        setTermIndex((prevIndex) => (prevIndex + 1) % 3);
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

    const isDropDown = props.dropDownClick[0];

    const onSignClick = () => {
        props.setDropDownClick(0);
    }

    useEffect(() => {
        if (props.lecInfo && props.lecInfo.length > 0) {
            if (props.lectureTab === null || !props.lectureTab.some(lecture => props.lecInfo.map(info => info.name).includes(lecture))) {
                const lectures = props.lecInfo.map((lecture) => {
                        return lecture.name;
                    }
                )
                props.setLectureTab(lectures);
            }
        } else {
            props.setLectureTab(null);
        }
    }, [props.lecInfo]);

    let lectures;
    if (props.lectureTab !== null) {
        lectures = props.lectureTab.map((lecture) => {

            const lectureInfo = props.lecInfo.find(lectureInfo => lectureInfo.name === lecture);

            let option;
            if (lectureInfo !== undefined) {
                option = lectureInfo.options;
            }

            return (
                <div
                    className='indivLecture'
                    draggable={true}
                    onDragStart={(event) => {
                        props.handleDragStart(option, event, lecture)
                    }}
                    onDragEnd={(event) => {
                        props.handleDragEnd(event);
                    }}
                >
                    {lecture}
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

    const isDropDown = props.dropDownClick[2];

    const onSignClick = () => {
        props.setDropDownClick(2);
    }


    useEffect(() => {
        if (props.labInfo && props.labInfo.length > 0) {
            if (props.labTab === null || !props.labTab.some(lab => props.labInfo.map(info => info.name).includes(lab))) {
                const labs = props.labInfo.map((lab) => {
                    return lab.name;
                })
                props.setLabTab(labs);
            }
        } else {
            props.setLabTab(null);
        }
    }, [props.labInfo]);

    let labs;
    if (props.labTab !== null) {
        labs = props.labTab.map((lab) => {

            const labInfo = props.labInfo.find(labInfo => labInfo.name === lab);

            let option;
            if (labInfo !== undefined) {
                option = labInfo.options;
            }

            return (
                <div
                    className='indivLab'
                    draggable={true}
                    onDragStart={(event) => {
                        props.handleDragStart(option, event, lab)
                    }}
                    onDragEnd={(event) => {
                        props.handleDragEnd(event);
                    }}
                >
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

    const isDropDown = props.dropDownClick[1];

    const onSignClick = () => {
        props.setDropDownClick(1);
    }

    useEffect(() => {
        if (props.semInfo && props.semInfo.length > 0) {
            if (props.seminarTab === null || !props.seminarTab.some(sem => props.semInfo.map(info => info.name).includes(sem))) {
                const seminars = props.semInfo.map((seminar) => {
                    return seminar.name;
                })
                props.setSeminarTab(seminars);
            }
        } else {
            props.setSeminarTab(null);
        }
    }, [props.semInfo]);

    let seminars;
    if (props.seminarTab !== null) {
        seminars = props.seminarTab.map((seminar) => {

            const semInfo = props.semInfo.find(semInfo => semInfo.name === seminar);

            let option;
            if (semInfo !== undefined) {
                option = semInfo.options;
            }

            return (
                <div
                    className='indivSeminar'
                    draggable={true}
                    onDragStart={(event) => {
                        props.handleDragStart(option, event, seminar)
                    }}
                    onDragEnd={(event) => {
                        props.handleDragEnd(event);
                    }}
                >
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
                <div className='coursesInfo'>
                    {seminars}
                </div>
            )}
        </div>
    )
}


const Search = (props) => {

    const isDropDown = props.dropDownClick[3];

    const onSignClick = () => {
        props.setDropDownClick(3);
    }

    // Get list of all courses into a local var
    const courses = props.searchInfo;
    const placeHolder = 'Search...';


    // Return component with all the discipline's plans
    return (
        <div>
            <div className={`electivesPalette ${isDropDown ? 'dropdownOpen' : ''}`}>
                <div className='electivesPaletteTitle'>
                    Add
                </div>
                <div className='electivesPaletteDropDownButton' onClick={onSignClick}>
                    <DropDownSign isDropDown={isDropDown}/>
                </div>
            </div>
            {!isDropDown && (
                <div className='coursesInfoBottom'>
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

const Timetable = (props) => {
    const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const timeSlots = ['8:00', '8:30', '9:00', '9:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30'];

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
                                const color = props.highLightCells[hourIndex][dayIndex][0];
                                const part = props.highLightCells[hourIndex][dayIndex][1];
                                const section = props.highLightCells[hourIndex][dayIndex][2];
                                const className = hourIndex % 2 === 0 ? 'topCell' : 'bottomCell';

                                let innerClassName = "innerCell" + part;

                                let content;
                                let text = section;

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

                                if (innerClassName === 'innerCellStart') {
                                    content = text;
                                }

                                return (
                                    <td
                                        key={day}
                                        className={className}
                                    >
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
                                            >
                                                <div className='content'>
                                                    {content}
                                                </div>
                                            </div>
                                        )}
                                    </td>
                                );
                            })}
                        </tr>
                    );
                })}
                </tbody>
            </div>
        </table>
    );
};

class Scheduler extends Component {

    addCourse = (courseName) => {
        
        const termType = this.props.selectedTerm.split(" ")[0].toLowerCase();
        const restController = new RESTController();

        const data = {
            courseName: courseName,
            term: termType,
        }
        
        // Query backend for data about lec, lab, sem if exist for the searched course
        restController.getIndivLec(data).then((result) => {
            
            // Update respective info and tab data structures for lectures
            if (result.size != []) {
                this.props.setLecInfo([
                    ...this.props.lecInfo,
                    result[0]
                ])
                this.props.setLectureTab([
                    ...this.props.lectureTab,
                    result[0].name
                ])
            }

            console.log(result);
        });
        restController.getIndivLab(data).then((result) => {
            
            // Update respective info and tab data structures for lab
            if (result.size != []) {
                this.props.setLabInfo([
                    ...this.props.labInfo,
                    result[0]
                ])
                this.props.setLabTab([
                    ...this.props.labTab,
                    result[0].name
                ])
            }

            console.log(result);
        });
        restController.getIndivSem(data).then((result) => {
            
            // Update respective info and tab data structures for seminar
            if (result.size != []) {
                this.props.setSemInfo([
                    ...this.props.semInfo,
                    result[0]
                ])
                this.props.setSeminarTab([
                    ...this.props.seminarTab,
                    result[0].name
                ])
            }

            console.log(result);
        });
    }

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

    // put back function
    handleRightClick = (event, section) => {
        event.preventDefault();

        if (section.includes('Lab')) {
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
        } else if (section.includes('Sem')) {
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

        const newHighlightedCells = this.props.highLightCells.map(row => [...row]);

        const restController = new RESTController();

        const duplicateSectionSet = new Set();
        const conflictSections = new Set();

        options.map((option) => {
            const durations = option.times;
            const section = courseInfo + " " + option.section;
            const color = restController.generateRandomColor();

            durations.map((duration) => {
                const date = duration.split('_')[0];
                const time = duration.split('_')[1];

                const startTime = time.split('-')[0].length === 4 ? '0' + time.split('-')[0] : time.split('-')[0];
                const endTime = time.split('-')[1].length === 4 ? '0' + time.split('-')[1] : time.split('-')[1];

                const colNum = this.dateProcess(date);
                const startRowNumber = this.timeProcess(startTime, 'start');
                const endRowNumber = this.timeProcess(endTime, 'end');

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

        console.log(newHighlightedCells);

        this.props.setHighLightCells(newHighlightedCells);
    }

    handleDragEnd = (event) => {
        event.preventDefault();

        let newHighlightedCells = this.props.highLightCells.map(row => row.map(cell => [...cell]));

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

        const newTimeTable = this.reformatTimetable(newHighlightedCells);
        this.props.setHighLightCells(newTimeTable);
    }

    // end dragging function
    handleDragOver(event) {
        event.preventDefault();
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

        let newHighlightedCells = this.props.highLightCells.map(row => row.map(cell => [...cell]));

        newHighlightedCells.forEach((row, rowIndex) => {
            row.forEach((column, columnIndex) => {
                if (column[0] !== '#275D38') {
                    if (column[0] === '#888888') {
                        if (column[2] !== null) {
                            column[0] = '#275D38';
                        } else {
                            newHighlightedCells[rowIndex][columnIndex] = [null, '',null];
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

        const newTimeTable = this.reformatTimetable(newHighlightedCells);
        this.props.setHighLightCells(newTimeTable);
    }

    checkCell = (hourIndex, dayIndex) => {
        const color = this.props.highLightCells[hourIndex][dayIndex][0];
        return color !== null && color !== '#275D38' && color !== '#888888';
    }


    /**
     * reformat the timetable
     * */
    reformatTimetable = (highLightCells) => {
        let newHighlightedCells = highLightCells.map(row => row.map(cell => [...cell]));

        newHighlightedCells.forEach((row, rowIndex) => {
            row.forEach((column, columnIndex) => {
                const color = newHighlightedCells[rowIndex][columnIndex][0];
                const section = newHighlightedCells[rowIndex][columnIndex][2];
                if (rowIndex === 0) {
                    if (color === '#275D38' && section !== null) {
                        newHighlightedCells[rowIndex][columnIndex][1] = 'Start';
                    }
                } else if (rowIndex === newHighlightedCells.length - 1) {
                    if (color === '#275D38' && section !== null) {
                        newHighlightedCells[rowIndex][columnIndex][1] = 'End';
                    }
                } else {
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
                        setHighLightCells={this.props.setHighLightCells}
                        setLecInfo={this.props.setLecInfo}
                        setSemInfo={this.props.setSemInfo}
                        setLabInfo={this.props.setLabInfo}
                        setSearchInfo={this.props.setSearchInfo}
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
                        />
                        <Search
                            dropDownClick={dropDownClick}
                            setDropDownClick={this.props.setDropDownClick}
                            selectedTerm={selectedTerm}
                            searchInfo={searchInfo}
                            addCourse={this.addCourse}
                        />
                        <ExportCSV
                            csvData={this.props.highLightCells}
                            fileName="Schedule"
                        />
                        <ImportCSV 
                            setHighLightCells={this.props.setHighLightCells}
                            reformatTimetable={this.reformatTimetable}
                            lectureTab={lectureTab}
                            setLectureTab={this.props.setLectureTab}
                            labTab={labTab}
                            setLabTab={this.props.setLabTab}
                            seminarTab={seminarTab}
                            setSeminarTab={this.props.setSeminarTab}
                        />
                        {/*<Choose for me />*/}
                    </div>
                    <div className='timeTableTable'>
                        <Timetable
                            highLightCells={highLightCells}
                            handleDrop={this.handleDrop}
                            handleDragOver={this.handleDragOver}
                            handleRightClick={this.handleRightClick}
                        />
                    </div>
                </div>
            </div>
        )

    }
}

export default Scheduler;
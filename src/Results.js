import React from 'react'
import VisualizerReport from './VisualizerReport.js';
import { jsPDF } from 'jspdf';
import './Scheduler.css'


export const Results = (props) => {
    const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const timeSlots = ['8:00', '8:30', '9:00', '9:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'];

    // placed here because jsPDF cannot render external styles, and we want to be able to export Results to pdf
    const styles = {



        results: {
            
        },
        resultsTitle: {
            margin: '25px 0px 40px 0px',
            color: "#275d38",
            fontSize: '53px',
            fontFamily: 'Roboto, sans-serif',
            fontWeight: 300,
            marginLeft: '185px',
        },
        introWrapper: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '1480px',
            marginRight: '10%',
            marginLeft: '185px',
        },
        buttonWrapper: {
            margin: '20px 77px 20px 20px',
        },
        subHeader: {
            color: "#275d38",
            fontSize: '35px',
            fontFamily: 'Roboto, sans-serif',
            fontWeight: 500,
            display: 'flex',
            overflow: 'hidden',
            marginBottom: '25px',
            letterSpacing: '0.3px',
        },
        resultsDescription: {
            fontFamily: 'Roboto, sans-serif',
            fontWeight: 400,
            marginBottom: '40px',
        },
        termWrapper: {
            display: 'grid',
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: '0px',
            marginBottom: '60px',
            marginLeft: '185px',
            width: '1480px',
            marginRight: '10%',
        },
        termHeader: {
            fontSize: '17px',
            fontFamily: 'Roboto, sans-serif',
            fontWeight: 500,
            marginLeft: '20px',
            marginBottom: '15px',
            verticalAlign: 'text-top',
        },
        termCourse: {
            fontSize: '17px',
            fontFamily: 'Roboto, sans-serif',
            fontWeight: 400,
            marginLeft: '20px',
        },
        termBox: {
            fontSize: '17px',
            fontFamily: 'Roboto, sans-serif',
            fontWeight: 500,
            width: '400px',
            border: '1px solid #CED4DA',
            borderRadius: '4px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            marginBottom: '20px',
            paddingTop: '20px',
            paddingBottom: '20px',
        },
        visualizerHeader: {
            width: '1480px',
            marginRight: '10%',
            marginLeft: '185px',
        },
        visualizerWrapper: {
            width: '100%',
            marginBottom: '60px',
        },
        schedulesWrapper: {
            width: '1480px',
            marginRight: '10%',
            marginLeft: '185px',
        }
    }

    const createStructure = (structure) => {


        console.log(Array.from(structure.values()));





        return structure;
    }
    
    
    const createPdf = async () => {

        // Ratio 11 x 8.5
        const report = new jsPDF('portrait', 'mm', [2200, 1700]);
        const data = await document.querySelector("#results");
        report.html(data).then(() => {
            report.save("engineering_report.pdf");
        })
    }
    
    
    
    
    
    
    return (
        <div id='results' className='results' style={styles.results}>
            <h1 className='resultsTitle' style={styles.resultsTitle}>
                Results
            </h1>
            <div className='introWrapper' style={styles.introWrapper}>
                <div>
                    <h2 className='subHeader' style={styles.subHeader}>
                        DEGREE OUTLINE
                    </h2>
                    <div className="resultsDescription" style={styles.resultsDescription}>
                        Below shows the courses placed in each term of your degree.
                    </div>
                </div>
                <div className='buttonWrapper' style={styles.buttonWrapper}>
                    <button
                        onClick={async () => createPdf()}
                        className='exportButton'
                    >
                        Export Results to PDF
                    </button>
                </div>
            </div>
            
            
            <div className='termsWrapper' style={styles.termWrapper}>
                

                {
                    Array.from(props.tabMap).map(([key, value]) => {

                        console.log(key);
                        console.log(value);

                        if (key !== '') {

                            return(
                                <div className='termBox' style={styles.termBox}>
                                    <div className='termHeader' style={styles.termHeader}>
                                        {key}
                                    </div>
                                    {
                                        value['lectureTab'].map((course) => {

                                            return (
                                                <div className='termCourse' style={styles.termCourse}>
                                                    {course}
                                                </div>
                                            );
                                        })
                                    }
                                </div>
                            );
                        }
                    })
                }
            </div>



            <div className='visualizerHeader' style={styles.visualizerHeader}>
                <h2 className='subHeader' style={styles.subHeader}>
                    VISUALIZER
                </h2>
                <div className="resultsDescription" style={styles.resultsDescription}>
                    Below is an updated version of the Visualizer based on your course selections
                </div>
            </div>
            <div className='visualizerWrapper' style={styles.visualizerWrapper}>
                <VisualizerReport 
                    structure={props.structure}
                    updateLineMap={props.updateLineMap}
                    lineMap={props.lineMap}
                    reqMap={props.reqMap}
                    tabMap={props.tabMap}
                />
            </div>







            <div className='schedulesWrapper' style={styles.schedulesWrapper}>
                <h2 className='subHeader' style={styles.subHeader}>
                    TERM SCHEDULES
                </h2>
                <div className="resultsDescription" style={styles.resultsDescription}>
                    Below are the schedules you have created for each term.
                </div>
                

                <div id="report">
                {
                    Array.from(props.scheduleMap).map(([key, value]) => {

                        // console.log(key, index);

                        if (key !== '') {

                            return (
                                    <table className='timeTable'>
                                        <div className="termHeader" style={styles.termHeader}>
                                            {key}
                                        </div>
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
                                                            const color = value[hourIndex][dayIndex][0];
                                                            const part = value[hourIndex][dayIndex][1];
                                                            const section = value[hourIndex][dayIndex][2];
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

                                                            if (innerClassName === 'innerCellStart') {
                                                                content = text;
                                                            }

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
                                                                                    backgroundSize: '37px 37px',
                                                                                    backgroundPosition: "center",
                                                                                }}
                                                                                extendedName={section}
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
                                        </div>
                                        <br></br>
                                        <br></br>
                                        <br></br>
                                    </table>
                                )

                        }
                    })
                }
                </div>
            </div>
        </div>
    );
}

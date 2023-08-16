import React from 'react'
import {PDFDownloadLink, Page, Text, View, Document, StyleSheet} from '@react-pdf/renderer';


const styles = StyleSheet.create({
  body: {
  	margin: 20
  },
  title: {
    marginBottom: 20
  },
  table: { 
    display: "table", 
    width: 500, 
    borderStyle: "solid", 
    borderWidth: 1, 
    borderRightWidth: 0, 
    borderBottomWidth: 0 
  }, 
  tableRow: { 
    margin: "auto", 
    flexDirection: "row" 
  }, 
  tableCol: { 
    width: 90, 
    borderStyle: "solid", 
    borderWidth: 1, 
    borderLeftWidth: 0, 
    borderTopWidth: 0 
  }, 
  timeCol: { 
    width: 49, 
    borderStyle: "solid", 
    borderWidth: 1, 
    borderLeftWidth: 0, 
    borderTopWidth: 0 
  }, 
  tableCell: { 
    margin: "auto", 
    marginTop: 5, 
    fontSize: 8 
  },
  highlightCell: { 
    margin: "auto", 
    marginTop: 5, 
    fontSize: 8,
    
  }
});









export const TestReport = (props) => (
    <Document>

        {
            Array.from(props.scheduleMap).map(([key, value]) => {

                // console.log(key, index);

                if (key !== '') {

                    return (

                        <Page style={styles.body}>
                            <Text style={styles.title}>
                                Engineering Visualizer Report
                            </Text>
                            <Text style={styles.title}>
                                {key}
                            </Text>
                            <View style={styles.table}>

                                <View style={styles.tableRow}>
                                    <View style={styles.timeCol}>
                                        <Text style={styles.tableCell}> </Text>
                                    </View>

                                    {
                                        ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => {

                                            return (

                                                <View style={styles.tableCol}>
                                                    <Text style={styles.tableCell}> {day} </Text>
                                                </View>
                                            );
                                        }
                                    )}

                                </View>

                                {['8:00', '8:30', '9:00', '9:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'].map((time, timeIndex) => {
                                    

                                    return (
                                        <View style={styles.tableRow}>
                                            <View style={styles.timeCol}>
                                                <Text style={styles.tableCell}> {time} </Text>
                                            </View>
                                            {
                                                value[timeIndex].map((item) => {

                                                    return (

                                                        <View style={styles.tableCol}>
                                                            <Text style={styles.tableCell}> {item[2]} </Text>
                                                        </View>
                                                    );
                                                }
                                            )}
                                        </View>
                                    );
                                    
                                })}
                            </View>
                        </Page>          
                    );
                }
            })
        }        
    </Document>
);





// Table for courses componet
const ReportPDF = (props) => {
    const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const timeSlots = ['8:00', '8:30', '9:00', '9:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'];

    return (
        <Document>
            <Page>
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
            </Page>
        </Document>
    );
};
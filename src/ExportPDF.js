import React from 'react'
import {PDFDownloadLink, Page, Text, View, Document, StyleSheet} from '@react-pdf/renderer';

// Styles placed here to ensure they end up in the pdf
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


// Series of pages, each with a table showing a term's shcedule
export const TestReport = (props) => (
    <Document>

        {
            Array.from(props.scheduleMap).map(([key, value]) => {
                
                // Skip term if it has no name
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


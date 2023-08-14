import React from 'react'
import {useState} from "react"
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import './Scheduler.css'

export const ImportCSV = ({setHighLightCells, scheduleMap, setScheduleMap, reformatTimetable, lectureTab, setLectureTab, labTab, setLabTab, seminarTab, setSeminarTab, tabMap, selectedTerm, setTabMap}) => {

    const hiddenFileInput = React.useRef();

    const placeData = (data, sheetName, updatedMap, updatedTabMap) => {

        // Remove the Weekday rows from the top of the excel sheet
        const newData = data.slice(2, data.length);

        // Create an empty timetable with [null, '', null] cells
        var emptyTable = Array.from({length: 26}, () => Array.from({length: 5}, () => [null, '', null]));

        var lecSet = new Set();
        var labSet = new Set();
        var semSet = new Set();

        // Move data from excel into the empty table
        const cleanedData = newData.map((row, rowIndex) => {
            var newRow = row.slice(1, row.length);
            return newRow.map((cell, colIndex) => {
                if (cell != null) {
                    emptyTable[rowIndex][colIndex] = ["#275D38", '', cell];
                    
                    // Remove section from the end of the course name
                    var lastIndex = cell.lastIndexOf(" ");
                    var courseName = cell.substring(0, lastIndex).trim();

                    // Keep a set of each lec, lab, sem in the schedule
                    if (courseName.includes('Sem')) {
                        semSet.add(courseName);
                    }
                    else if (courseName.includes('Lab')) {
                        labSet.add(courseName);
                    }
                    else {
                        lecSet.add(courseName);
                    }
                }
            })
        })

        // Add formatting data to the middle section of the cells and set the timeTable to the scheduler
        const reformattedTimetable = reformatTimetable(emptyTable);

        console.log(sheetName);
        console.log(reformattedTimetable);

        // Update the scheduleMap with the new term record
        updatedMap.set(sheetName, reformattedTimetable);

        // Clear duplicates from the lec, lab, sem tabs
        // var courseArray = Array.from(courseSet);
        // checkTabs(courseArray);

        // Update the tabs for current term


        const lecArray = Array.from(lecSet);
        const labArray = Array.from(labSet);
        const semArray = Array.from(semSet);

        // Update the tabs and schedule for the currently-open term
        if (selectedTerm === sheetName) {
            setTabs(lecArray.concat(labArray, semArray));
            setHighLightCells(reformattedTimetable);
        }

        const termTabs = {
            lectureTab: lecArray,
            labTab: labArray,
            seminarTab: semArray
        }

        updatedTabMap.set(sheetName, termTabs);
    }


    const fileSelectedHandler = event => {
        const reader = new FileReader();

        // Read spreadsheet data from the uploaded excel file
        reader.onload = (e) => {
            const result = e.target.result;
            const workbook = XLSX.read(result, {type: "array"});
            const updatedMap = new Map(scheduleMap);
            const updatedTabMap = new Map();

            workbook.SheetNames.map((sheetName) => {

                const sheet = workbook.Sheets[sheetName];
                const data = XLSX.utils.sheet_to_json(sheet, {header:1});
    
                // Format and display data on the Scheduler
                placeData(data, sheetName, updatedMap, updatedTabMap);
            })

            setScheduleMap(updatedMap);
            setTabMap(updatedTabMap);
        }
        reader.readAsArrayBuffer(event.target.files[0]);
    }

    // Click the hidden import button when the much nicer looking "Import from File" button is pressed
    const handleClick = event => {
        hiddenFileInput.current.click();
    };





    // Remove each course in the imported table from the corresponding side panel
    const setTabs = (duplicateEntries) => {

        // get the current state of the course tabs
        var updatedSemTab = (seminarTab !== null) ? [...seminarTab] : []; 
        var updatedLabTab = (labTab !== null) ? [...labTab] : [];
        var updatedLecTab = (lectureTab !== null) ? [...lectureTab] : [];

        // Loop through courses found during the import
        duplicateEntries.map(entry => {

            // Remove course from the tabs on the side of the scheduler
            if (entry.includes("Sem")) {
                updatedSemTab = updatedSemTab.filter(item => item !== entry);
            }
            else if (entry.includes("Lab")) {
                updatedLabTab = updatedLabTab.filter(item => item !== entry);
            }
            else {
                updatedLecTab = updatedLecTab.filter(item => item !== entry);
            }
        });
        
        // Set the updeated tabs
        setSeminarTab(updatedSemTab);
        setLabTab(updatedLabTab);
        setLectureTab(updatedLecTab);
    }





    return (
        <div >
            <button 
                className="exportButton"
                onClick={handleClick}
            >
                Import from File
            </button>
            <input 
                type="file" 
                onChange={fileSelectedHandler} 
                style={{display:'none'}}
                ref={hiddenFileInput}
            />
        </div>
    )
}
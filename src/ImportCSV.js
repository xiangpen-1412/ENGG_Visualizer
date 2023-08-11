import React from 'react'
import {useState} from "react"
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import './Scheduler.css'

export const ImportCSV = ({setHighLightCells, reformatTimetable, lectureTab, setLectureTab, labTab, setLabTab, seminarTab, setSeminarTab}) => {

    const hiddenFileInput = React.useRef();

    const placeData = (data) => {

        // Remove the Weekday rows from the top of the excel sheet
        const newData = data.slice(2, data.length);

        // Create an empty timetable with [null, '', null] cells
        var emptyTable = Array.from({length: 28}, () => Array.from({length: 5}, () => [null, '', null]));

        const courseSet = new Set();

        // Move data from excel into the empty table
        const cleanedData = newData.map((row, rowIndex) => {
            var newRow = row.slice(1, row.length);
            return newRow.map((cell, colIndex) => {
                if (cell != null) {
                    emptyTable[rowIndex][colIndex] = ["#275D38", '', cell];
                    courseSet.add(cell);
                }
            })
        })

        // Add formatting data to the middle section of the cells and set the timeTable tp the scheduler
        const reformattedTimetable = reformatTimetable(emptyTable);
        setHighLightCells(reformattedTimetable);

        var courseArray = Array.from(courseSet);
        checkTabs(courseArray);
    }


    const fileSelectedHandler = event => {
        const reader = new FileReader();

        // Read spreadsheet data from the uploaded excel file
        reader.onload = (e) => {
            const result = e.target.result;
            const workbook = XLSX.read(result, {type: "array"});
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const data = XLSX.utils.sheet_to_json(sheet, {header:1});

            // Format and display data on the Scheduler
            placeData(data);
        }
        reader.readAsArrayBuffer(event.target.files[0]);
    }

    // Click the hidden import button when the much nicer looking "Import from File" button is pressed
    const handleClick = event => {
        hiddenFileInput.current.click();
    };

    // Remove each course in the imported table from the corresponding side panel
    const checkTabs = (duplicateEntries) => {

        // get the current state of the course tabs
        var updatedSemTab = (seminarTab !== null) ? [...seminarTab] : []; 
        var updatedLabTab = (labTab !== null) ? [...labTab] : [];
        var updatedLecTab = (lectureTab !== null) ? [...lectureTab] : [];

        // Loop through courses found during the import
        duplicateEntries.map(entry => {

            // Remove section from the end of the course name
            var lastIndex = entry.lastIndexOf(" ");
            var courseName = entry.substring(0, lastIndex).trim();

            // Remove course from the tabs on the side of the scheduler
            if (entry.includes("Sem")) {
                updatedSemTab = updatedSemTab.filter(item => item !== courseName);
            }
            else if (entry.includes("Lab")) {
                updatedLabTab = updatedLabTab.filter(item => item !== courseName);
            }
            else {
                updatedLecTab = updatedLecTab.filter(item => item !== courseName);
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
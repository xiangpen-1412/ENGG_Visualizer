import React from 'react'
import {useState} from "react"
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import './Scheduler.css'

export const ImportCSV = ({setHighLightCells, reformatTimetable}) => {

    const hiddenFileInput = React.useRef();

    const placeData = (data) => {

        // Remove the Weekday rows from the top of the excel sheet
        const newData = data.slice(2, data.length);

        // Create an empty timetable with [null, '', null] cells
        var emptyTable = Array.from({length: 26}, () => Array.from({length: 5}, () => [null, '', null]));

        // Move data from excel into the empty table
        const cleanedData = newData.map((row, rowIndex) => {
            var newRow = row.slice(1, row.length);
            return newRow.map((cell, colIndex) => {
                if (cell != null) {
                    emptyTable[rowIndex][colIndex] = ["#275D38", '', cell];
                }
            })
        })

        // Add formatting data to the middle section of the cells and set the timeTable tp the scheduler
        const reformattedTimetable = reformatTimetable(emptyTable);
        setHighLightCells(reformattedTimetable);
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
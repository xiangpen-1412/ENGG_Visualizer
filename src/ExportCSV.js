import React from 'react'
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import './Scheduler.css'

export const ExportCSV = ({csvData, fileName}) => {

    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';

    var headers = [
        '',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday'
    ];

    const times = [
        '8:00',
        '8:30',
        '9:00',
        '9:30',
        '10:00',
        '10:30',
        '11:00',
        '11:30',
        '12:00',
        '12:30',
        '13:00',
        '13:30',        
        '14:00',
        '14:30',
        '15:00',
        '15:30',
        '16:00',
        '16:30',
        '17:00',
        '17:30',
        '18:00',
        '18:30',
        '19:00',
        '19:30',
        '20:00',
        '20:30',
    ];

    // Take input data, convert it to an xlsx sheet, download to user's computer
    const exportToCSV = (csvData, fileName) => {

        // Construct csv data from inputted course matrix
        var rows = csvData.map((row, index) => {

            // Read out the names of each object in Schedule matrix
            var timedRow = row.map((course) => {
                return course[2];
            });

            // Add time to left side
            timedRow.unshift(times[index]);

            return timedRow;
        });

        // Add Days of the Week to first row of sheet
        rows.unshift(headers);
        
        // Convert rows to xlsx and save to user's computer
        const ws = XLSX.utils.json_to_sheet(rows);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], {type: fileType});
        FileSaver.saveAs(data, fileName + fileExtension);
    }

    return (
        <div>
            <button className="exportButton" onClick={(e) => exportToCSV(csvData,fileName)}>
                Export to Excel
            </button>
        </div>
    )
}
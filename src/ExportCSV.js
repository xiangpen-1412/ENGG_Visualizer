import React from 'react'
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

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

    const exportToCSV = (csvData, fileName) => {

        console.log("-")
        console.log(csvData);
        console.log(JSON.stringify(csvData));

        var rows = csvData.map((row, index) => {

            var timedRow = row.map((course) => {
                return course[2];
            });

            timedRow.unshift(times[index]);

            return timedRow;
        });

        rows.unshift(headers);
        
        const ws = XLSX.utils.json_to_sheet(rows);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], {type: fileType});
        FileSaver.saveAs(data, fileName + fileExtension);
    }

    return (
        <div className="button" onClick={(e) => exportToCSV(csvData,fileName)}>
            Export to Excel
        </div>
    )
}
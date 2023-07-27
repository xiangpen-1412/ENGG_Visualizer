import React from 'react'
import {useState} from "react"
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import './Scheduler.css'

export const ImportCSV = () => {

    const [data, setData] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);

    const hiddenFileInput = React.useRef();

    const fileSelectedHandler = event => {
        setSelectedFile(event.target.files[0]);

        const reader = new FileReader();

        reader.onload = (e) => {
            const result = e.target.result;
            const workbook = XLSX.read(result, {type: "array"});
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const data = XLSX.utils.sheet_to_json(sheet, {header:1});

            setData(data);
            console.log(data);
        }
        reader.readAsArrayBuffer(event.target.files[0]);
    }

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
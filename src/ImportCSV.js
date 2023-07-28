import React from 'react'
import {useState} from "react"
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import './Scheduler.css'

export const ImportCSV = ({setHighLightCells}) => {

    const [data, setData] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);

    const hiddenFileInput = React.useRef();



    const placeData = (data) => {


        // this.setState(prevState => {
        //     return {
        //         data: [
        //             ...prevState.data.slice(0,2)
        //         ]
        //     }
        // })

        // console.log(this.state.data);

        console.log('data');
        console.log(data);


        const newData = data.slice(2, data.length);

        console.log('newData');
        console.log(newData);


        // var emptyTable = Array.from({length: 26}, () => Array.from({length: 5}, () => [null, '', null]));


        const cleanedData = newData.map(row => {
            var newRow = row.slice(1, row.length);
            return newRow.map(cell => {
                if (cell != []) {
                    return ["#275D38", '', cell];
                }
                else {
                    return [null, '', null];
                }
            })
        })

        console.log(0);
        console.log(cleanedData);

        // setHighLightCells(cleanedData);
    }


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
            placeData(data);
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
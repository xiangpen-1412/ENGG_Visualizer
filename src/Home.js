import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';


//programList is in state variable so now make a div for each program
const Program = (props) => {
    const navigate= useNavigate();

    const cells = props.programList.map((programs, yIndex) => {
        let cell = programs.map((program, xIndex)=> {
            return(
                <div
                    key={xIndex}
                    programInfo={program}
                    className = {"indvProgram" + " row" + yIndex}
                    onClick={(event) =>
                        navigate("/App",
                            {
                                state: {
                                    selectedProgram: program,
                                    replace: false
                                }
                            }
                        )
                    }
                >
                    {program}
                </div>
            )
        })

        return(
            cell
        )
    })


    return(

        <div className = "programPalette">
            <div className = "programPalette0">{cells[0]}</div>
            <div className = "programPalette1">{cells[1]}</div>
            <div className = "programPalette2">{cells[2]}</div>
            <div className = "programPalette3">{cells[3]}</div>
            <div className = "programPalette4">{cells[4]}</div>
        </div>

    )
}


class Home extends Component {
    constructor(props){
        super(props);


        this.state = {
            selectedProgram: "",

            programList: [
                [
                    "Chemical Engineering",
                    "Materials Engineering",
                ],
                [
                    "Civil Engineering",
                    "Mining Engineering",
                    "Petroleum Engineering",
                ],
                [
                    "Computer Engineering",
                    "Electrical Engineering",
                    "Engineering Physics",
                ],
                [
                    "Mechanical Engineering",
                ],
                [
                    "Mechatronics Engineering",
                ],
            ],
        }
    }

    render() {
        const {programList} = this.state;

        

        return (
            <div className="frontPageWrapper">

                <div className="logoWrapper">
                    <img src="engineering.png"  className="logo" width="450" height="100"/>
                </div>

                <div className="frontPageTextWrapper">
                    <h1>Engineering Visualizer </h1>
                </div>


                <div className="frontPageTextWrapper">
                    <h2>2022 - 2023 </h2>
                </div>

                <br></br>

                <div className='wrapperTermProgram'>
                    <Program programList={programList} onClickProgram={this.onClickProgram}/>
                </div>
            </div>
        )

    }
}

export default Home
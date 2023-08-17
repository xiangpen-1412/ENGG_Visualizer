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
                    className = "indvProgram"
                    onClick={(event) =>
                        navigate("/App",
                            {
                                state: {
                                    selectedProgram: program,
                                    replace: false,
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
            <div>
                <header className="header">
                    <div className="header-content">
                        <img alt="University of Alberta logo" src="uofalogo.png" className="image"/>
                        <div className="site-title">
                            Engineering Task Manager
                        </div>
                    </div>
                </header>
                <div className="frontPageWrapper">

                    <div className="frontPageTextWrapper">
                        <h1 className="homeTitle">Engineering Task Manager</h1>
                    </div>


                    <div className='homeDescription'> 
                        Select an Engineering discipline below.
                    </div>

                    <br></br>

                    <div className='wrapperTermProgram'>
                        <Program programList={programList} onClickProgram={this.onClickProgram}/>
                    </div>
                </div>
            </div>
        )
    }
}

export default Home
import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';


//programList is in state variable so now make a div for each program
const Program = (props) => {
    const navigate= useNavigate()






    const cells0 = props.programList[0].map((program,index)=> {
        return(
            <div
                key={index}
                programInfo={program}
                className = "indvProgram0"
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
        )})

    const cells1 = props.programList[1].map((program,index)=> {
        return(
            <div
                key={index}
                programInfo={program}
                className = "indvProgram1"
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
        )})

    const cells2 = props.programList[2].map((program,index)=> {
        return(
            <div
                key={index}
                programInfo={program}
                className = "indvProgram2"
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
        )})

    const cells3 = props.programList[3].map((program,index)=> {
        return(
            <div
                key={index}
                programInfo={program}
                className = "indvProgram3"
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
        )})

    return(

        <div className = "programPalette">
            <div className = "programPalette0">{cells0}</div>
            <div className = "programPalette1">{cells1}</div>
            <div className = "programPalette2">{cells2}</div>
            <div className = "programPalette3">{cells3}</div>
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

                <div className='wrapperTermProgram'>
                    <Program programList={programList} onClickProgram={this.onClickProgram}/>
                </div>
            </div>
        )

    }
}

export default Home
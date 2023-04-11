import { Component } from 'react';
import './index.css';
import { useLocation } from 'react-router-dom';
import { Tooltip as ReactTooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'


class Structure extends Component{

    render() {
        const {structure} = this.props

        const term = this.props.structure.map((termColumn, index) => {
            const coursedivs = termColumn.courses.map((courseitem,index) => {
                return(
                    <div className='indvcourses' 
                    style = {{backgroundColor: courseitem.color}}
                    onMouseEnter = {(event) => this.props.showToolTip(event)}
                    onMouseDown ={(event) => this.props.hideToolTip(event)}
                    onMouseLeave = {(event) => this.props.hideToolTip(event)}
                    data-tooltip-content={courseitem.description} data-tooltip-id='toolTip1'
                    extendedName={courseitem.extendedName} accreditionUnits={courseitem.accreditionUnits}
                    >
                        {courseitem.name}
                    </div>
                )

            })
            
            return (
                <div className='term'>
                    <b>
                    {termColumn.term}
                    </b>
                    <div className='courseWrapper'>
                        {coursedivs}
                    </div>
                </div>
            )
        })

        return (
            <p>
                <div className="termWrapper">
                    {term}
                </div>
            </p>
        )
    }        
}

export default Structure
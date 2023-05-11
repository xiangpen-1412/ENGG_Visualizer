import React, {Component} from 'react';
import axios from "axios";

class RESTController extends Component {

    constructor(props) {
        super(props);
        this.baseURL = "/nobes/timetable/calendar";

        this.config = {
            headers: {
                'Content-Type': 'application/json',
            },
        }
    }

    getPlans = (data) => {

        return axios
            .post(`${this.baseURL}/getPlans`, data.programName, this.config)
            .then(response => {
                const jsonMap = JSON.stringify(response.data.obj);
                const progMap = JSON.parse(jsonMap);
                return Object.keys(progMap);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }

    getCourseInfo = (data) => {

        return axios
            .post(`/nobes/timetable/visualizer/getInfo`, data, this.config)
            .then(response => {
                let courseMap = response.data.obj;
                const courses = [];

                for (const term in courseMap) {

                    let description;
                    let courseTitle;
                    let attributes;
                    let courseGroup;
                    let accreditionUnits;
                    let courseName;
                    let preReqs = [];
                    let coReqs = [];

                    if (courseMap[term] != null) {
                        let course = courseMap[term].map((course) => {

                            description = course.description;

                            attributes = course.attribute.map(Number);

                            courseGroup = course.group.map(Number);

                            courseTitle = course.title;
                            courseName = course.courseName;
                            preReqs = course.preReqs;
                            coReqs = course.coReqs;

                            if (!course.aucount) {
                                course.aucount = {};
                            }

                            accreditionUnits = Object.entries(course.aucount)
                                .map(([key, value]) => `${key}: ${value}`)
                                .join('\n');

                            return {
                                name: courseName,
                                attribute: attributes,
                                extendedName: courseTitle,
                                description: description,
                                accreditionUnits: accreditionUnits,
                                prerequisites : preReqs,
                                corequisites : coReqs,
                                catagory : courseGroup,
                            }
                        });

                        courses.push({
                            term: term,
                            courses: course
                        })
                    }
                }

                console.log("visualizer succeed");
                return courses;
            })
            .catch(error => {
                console.log(data);
                console.error('getLec: Error fetching data:', error);
            });
    }

}

export default RESTController;



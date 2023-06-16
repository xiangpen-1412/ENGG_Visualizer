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
                const courseMap = response.data.obj;
                const courses = [];

                for (const term in courseMap) {
                    if (courseMap[term] !== null) {
                        const courseList = courseMap[term].map(course => ({
                            name: course.courseName,
                            attribute: course.attribute.map(Number),
                            extendedName: course.title,
                            description: course.description,
                            accreditionUnits: Object.entries(course.aucount ?? {})
                                .map(([key, value]) => `${key}: ${value}`)
                                .join('\n'),
                            prerequisites: course.preReqs,
                            corequisites: course.coReqs,
                            category: course.group.map(Number),
                            orCase: course.orCase,
                            courseGroup: course.courseGroup,
                        }));

                        courses.push({
                            term: term,
                            courses: courseList
                        });
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

    getReqMap = (data) => {

        console.log(data);

        return axios
            .post(`/nobes/timetable/visualizer/getReqMap`, data, this.config)
            .then(response => {
                return response.data.obj;
            }).catch(error => {
                console.error('getLec: Error fetching data:', error);
            });
    }
}

export default RESTController;



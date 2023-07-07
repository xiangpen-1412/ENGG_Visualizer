import {Component} from 'react';
import axios from "axios";

class RESTController extends Component {

    constructor(props) {
        super(props);

        // online server url
        this.springbootUrl = "http://129.128.215.39:1412";

        this.schedulerBaseURL = "/nobes/timetable/calendar";

        this.visualizerBaseURL = "/nobes/timetable/visualizer";

        this.config = {
            headers: {
                'Content-Type': 'application/json',
            },
        }
    }

    /**
     * Visualizer API
     * */
    getPlans = (data) => {

        return axios
            .post(`${this.schedulerBaseURL}/getPlans`, data.programName, this.config)
            .then(response => {
                const jsonMap = JSON.stringify(response.data.obj);
                const progMap = JSON.parse(jsonMap);
                return Object.keys(progMap);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }

    /**
     * Visualizer API
     * */
    getCourseInfo = (data) => {

        return axios
            .post(`${this.visualizerBaseURL}/getInfo`, data, this.config)
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
                console.error('getLec: Error fetching data:', error);
            });
    }

    /**
     * Visualizer API
     * */
    getReqMap = (data) => {
        return axios
            .post(`${this.visualizerBaseURL}/getReqMap`, data, this.config)
            .then(response => {
                return response.data.obj;
            }).catch(error => {
                console.error('getLec: Error fetching data:', error);
            });
    }

    /**
     * Scheduler API
     * */
    getTerms = (data) => {
        return axios
            .post(`${this.schedulerBaseURL}/getPlans`, data.programName, this.config)
            .then(response => {
                const progMap = response.data.obj;
                return progMap[data.planName];
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    };
}

export default RESTController;

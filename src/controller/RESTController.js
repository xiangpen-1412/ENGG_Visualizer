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
            .post(`${this.springbootUrl}${this.schedulerBaseURL}/getPlans`, data.programName, this.config)
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
     * get all the terms in a plan
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

    /**
     * Scheduler API
     * get lecture information
     * */
    getLecs = (data) => {

        const newdata = {
            programName: data.programName,
            planName: data.planName,
            termName: data.termName,
            componentId: "1",
        }

        return axios
            .post(`${this.schedulerBaseURL}/getLecsInfo`, newdata, this.config)
            .then(response => {
                const lecMap = response.data.obj;
                const lecs = [];

                for (const course in lecMap) {
                    let courseTitle;

                    if (lecMap[course] != null) {
                        const options = lecMap[course].map((option) => {

                            const duration = this.updateTime(option);

                            if (courseTitle == null) {
                                courseTitle = option.courseTitle;
                            }

                            const place = option.place;
                            const instructor = option.instructorName;

                            return {
                                section: option.section,
                                color: this.generateRandomColor(),
                                times: duration,
                                place: place,
                                instructor: instructor,
                            }
                        });


                        lecs.push({
                            name: course,
                            extendedName: courseTitle,
                            color: "lightgrey",
                            options: options,
                        });
                    } else {
                        console.log("Missing information about " + course);
                    }
                }
                return lecs;
            })
            .catch(error => {
                console.error('getLec: Error fetching data:', error);
            });
    }

    /**
     * Scheduler API
     * get lab information
     * */
    getLabs = (data) => {

        const newdata = {
            programName: data.programName,
            planName: data.planName,
            termName: data.termName,
            componentId: "2",
        }

        return axios
            .post(`${this.schedulerBaseURL}/getLabsInfo`, newdata, this.config)
            .then(response => {
                const labMap = response.data.obj;
                const labs = [];

                for (const course in labMap) {

                    if (labMap[course] != null) {
                        const options = labMap[course].map((option) => {

                            const duration = this.updateTime(option);
                            const place = option.place;
                            const instructor = option.instructorName;

                            return {
                                section: option.section,
                                color: this.generateRandomColor(),
                                times: duration,
                                place: place,
                                instructor: instructor,
                            }
                        });

                        labs.push({
                            name: course + " Lab",
                            color: "lightgrey",
                            options: options,
                        });
                    }
                }
                return labs;
            })
            .catch(error => {
                console.error('getLab: Error fetching data:', error);
            });
    }

    /**
     * Scheduler API
     * get seminar information
     * */
    getSems = (data) => {

        const newdata = {
            programName: data.programName,
            planName: data.planName,
            termName: data.termName,
            componentId: "3",
        }

        return axios
            .post(`${this.schedulerBaseURL}/getSemsInfo`, newdata, this.config)
            .then(response => {
                const semMap = response.data.obj;
                const sems = [];

                for (const course in semMap) {

                    if (semMap[course] != null) {
                        const options = semMap[course].map((option) => {

                            const duration = this.updateTime(option);
                            const place = option.place;
                            const instructor = option.instructorName;

                            return {
                                section: option.section,
                                color: this.generateRandomColor(),
                                times: duration,
                                place: place,
                                instructor: instructor,
                            }
                        });

                        sems.push({
                            name: course + " Sem",
                            color: "lightgrey",
                            options: options,
                        });
                    }
                }
                return sems;
            })
            .catch(error => {
                console.error('getSem: Error fetching data:', error);
            });
    }

    /**
     * Scheduler API
     * get all the courses for a given program
     * */
    getAllCourses = (data) => {
        return axios
            .post(`${this.schedulerBaseURL}/getAllCourses`, data, this.config)
            .then(response => {
                return response.data.obj;
            })
    }


    /**
     * Scheduler API
     * get lecture/lab/seminar information for a given course
     * */
    getIndivCourseInfo = (data, path, type) => {

        return axios
            .post(`${this.schedulerBaseURL}/${path}`, data, this.config)
            .then(response => {
                const courseMap = response.data.obj;
                const courseInfo = [];

                let courseTitle;

                for (const course in courseMap) {
                    if (courseMap[course] != null) {
                        const options = courseMap[course].map((option) => {

                            const duration = this.updateTime(option);

                            if (courseTitle == null) {
                                courseTitle = option.courseTitle;
                            }

                            return {
                                section: option.section,
                                color: this.generateRandomColor(),
                                times: duration,
                            }
                        });

                        courseInfo.push({
                            name: course + type,
                            extendedName: type ? course : courseTitle,
                            color: "lightgrey",
                            options: options,
                        });

                    } else {
                        console.log("Missing information about " + course);
                    }
                }

                return courseInfo;
            })
            .catch(error => {
                console.error(`get${type}: Error fetching data:`, error);
            });
    }

    /**
     * Scheduler API
     * get lecture information for a given course
     *
     * data: courseName, term
     * */
    getIndivLec = (data) => {
        return this.getIndivCourseInfo(data, 'getIndividualCourseLecsInfo', '');
    }

    /**
     * Scheduler API
     * get lab information for a given course
     *
     * data: courseName, term
     * */
    getIndivLab = (data) => {
        return this.getIndivCourseInfo(data, 'getIndividualCourseLabsInfo', ' Lab');
    }

    /**
     * Scheduler API
     * get seminar information for a given course
     *
     * data: courseName, term
     * */
    getIndivSem = (data) => {
        return this.getIndivCourseInfo(data, 'getIndividualCourseSemsInfo', ' Sem');
    }

    updateTime(option) {
        return option.times.map((time) => {
            const [day, timeHrs] = time.split("_");
            const [startTime, endTime] = timeHrs.split("-");
            let [endHrs, endMin] = endTime.split(":");

            let endHrsNumber = parseInt(endHrs);
            let endMinNumber = parseInt(endMin);

            let carry = Math.floor((endMinNumber + 10) / 60);

            carry = carry < 1 ? 0 : 1;

            endHrsNumber += carry;

            endHrs = endHrsNumber.toString();

            if (carry === 1) {
                endMin = "00";
            } else {
                endMin = (endMinNumber + 10).toString();
            }

            let s = day + "_" + startTime + "-" + endHrs + ":" + endMin;

            return s;
        });
    }

    generateRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    /**
     * run the automatic populate algorithm in the backend and get the updated table
     * */
    getUpdatedTimetable = (data) => {
        return axios.post(`${this.schedulerBaseURL}/optimizeTimeTable`, data, this.config)
            .then(response => {
                console.log(response.data.obj);
                return response.data.obj;
            }).catch(error => {
                console.error(error);
            });
    }
}

export default RESTController;

import React, {Component, useEffect, useState} from "react";

const CourseGroup = (props) => {
    const courseGroupKeys = [...props.courseGroup.keys()];

    const [selectedButtons, setSelectedButtons] = useState(
        new Map(
            courseGroupKeys
                .filter((key) => ["group2", "group3", "group4"].includes(key))
                .map((key) => [key, null])
        )
    );

    if (props.planChanged) {
        const newSelectedButtons = new Map();
        courseGroupKeys.forEach((key) => {
            newSelectedButtons.set(key, null);
        });
        setSelectedButtons(newSelectedButtons);
    }

    const keyComponent = courseGroupKeys.map((key) => {
        const groupComponent = props.courseGroup.get(key).map((group) => {
            const isSelected = selectedButtons.get(key) === group;
            const color = isSelected ? "rgb(39, 93, 56)" : "rgb(255, 255, 255)";
            return (
                <div
                    className="indivCourseGroup"
                    key={group}
                    onClick={() => {
                        const newSelectedButtons = new Map(selectedButtons);
                        newSelectedButtons.set(key, group);
                        setSelectedButtons(newSelectedButtons);
                        props.setSelectedCourseGroup(group, props.deleteLineMap);
                    }}
                    style={{
                        backgroundColor: color
                    }}
                >
                    {group}
                </div>
            );
        });
        return (
            <div key={key}>
                <h3>{key}</h3>
                <div className="courseGroupPalatte">{groupComponent}</div>
            </div>
        );
    });

    if (props.planChanged) {
        props.setPlanChanged();
    }

    return <div className="allGroups">{keyComponent}</div>;
};
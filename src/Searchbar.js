// Adapted from: https://medium.com/tinyso/how-to-create-a-dropdown-select-component-in-react-bf85df53e206

import React, {useEffect, useRef, useState} from "react";

import "./Searchbar.css";

const Icon = () => {
    return (
        <svg height="20" width="20" viewBox="0 0 20 20">
            <path
                d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"
                style={{transform: "rotate(270deg)", transformOrigin: "center"}}
            ></path>
        </svg>
    );
};

// Dropdown searchbar to allow user to search, filter, and select an option
//
// Once sleected, course is added to the lec, lab, sem panels on the sheduler via addCourse()
const Searchbar = ({placeHolder, options, index, isSearchable, addCourse}) => {
    const [showMenu, setShowMenu] = useState(false);
    const [selectedValue, setSelectedValue] = useState(null);
    const inputRef = useRef();
    const [searchValue, setSearchValue] = useState("");
    const searchRef = useRef();

    // Begin with an empty display value, user can add leatters to filter search
    useEffect(() => {
        setSearchValue("");
        if (showMenu && searchRef.current) {
            searchRef.current.focus();
        }
    }, [showMenu]);

    // Unused apparently
    useEffect(() => {


    }, [options]);

    // Set the search value
    const onSearch = (e) => {
        setSearchValue(e.target.value);
    };

    // Get the dropdown options, filter based on letters typed
    const getOptions = () => {
        if (!searchValue) {
            return options;
        }
        return options.filter((option) => option.toLowerCase().indexOf(searchValue.toLowerCase()) >= 0);
    };

    // Listen for clicks
    useEffect(() => {
        const handler = (e) => {
            if (inputRef.current && !inputRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        }

        window.addEventListener("click", handler);
        return () => {
            window.removeEventListener("click", handler);
        };
    });

    // Toggle if menu is shown
    const handleInputClick = (event) => {
        setShowMenu(!showMenu);
    };

    // Set value when item is clicked, add the course to panels
    const onItemClick = (option) => {
        setSelectedValue(option);
        addCourse(option);
    };

    // Check if an option is the selected option
    const isSelected = (option) => {
        if (!selectedValue) {
            return false;
        }
        return selectedValue === option;
    }

    return (
        <div
            className="searchbar-container"
        >
            <div ref={inputRef} onClick={handleInputClick} className="searchbar-input">
                <div className="searchbar-tools">
                    <div className="searchbar-tool">
                        {placeHolder}
                    </div>
                </div>
            </div>
            {showMenu && (
                <div className="searchbar-menu">
                    {isSearchable && (
                        <div className="search-box">
                            <input onChange={onSearch} value={searchValue} ref={searchRef}/>
                        </div>
                    )}
                    {getOptions().map((option) => (
                        <div
                            onClick={() => onItemClick(option)}
                            key={option}
                            className={`searchbar-item ${isSelected(option) && "selected"}`}
                        >
                            {option}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Searchbar;
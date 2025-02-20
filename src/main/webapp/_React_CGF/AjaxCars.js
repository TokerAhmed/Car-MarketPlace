"use strict";

const AjaxCars = () => {

    console.log("AjaxCars running");

    // Common React pattern. Display a "...Loading..." UI while the page
    // is loading. Don't try to render the component until this is false.  
    const [isLoading, setIsLoading] = React.useState(true);

    // this is the data initially read (just once) from the DB.
    const [dbList, setDbList] = React.useState([]);

    // if there is an ajax error (or db connection error, set this state variable)
    const [error, setError] = React.useState(null);

    // the user's input that filters the list. 
    const [filterInput, setFilterInput] = React.useState("");

    // this is the filtered list.
    const [filteredList, setFilteredList] = React.useState([]);

    // useEffect 2nd parameter is an array of elements that 
    // (if any of those state variables change) should trigger the function specified 
    // as the 1st useEffect parameter. 
    // RUN ONCE PATTERN: If you put [] as 2nd param, it runs the 1st param (fn) once. 
    React.useEffect(() => {

        // ajax_alt takes three parameters: the URL to read, Success Fn, Failure Fn.
        ajax_alt(

            "car/getAll", // URL for AJAX call to invoke

            // success function (anonymous)
            function (dbList) {   // success function gets obj from ajax_alt
                if (dbList.dbError.length > 0) {
                    setError(dbList.dbError);
                } else {
                    console.log("in AjaxCars, here is car list (on the next line):");
                    console.log(dbList.carList);
                    jsSort(dbList.carList, "carId", "number");
                    setDbList(dbList.carList);
                    setFilteredList(dbList.carList);
                }
                setIsLoading(false); // set isLoading last to prevent premature rendering. 
            },

            // failure function (also anonymous)
            function (msg) {       // failure function gets error message from ajax_alt
                setError(msg);
                setIsLoading(false); // set isLoading last to prevent premature rendering.
            }
        );
    },
        []);

    function callInsert() {
        window.location.hash = "#/carInsert";
    }


    const doFilter = (filterInputVal) => {
        let newList = filterObjList(dbList, filterInputVal);
        console.log("function doFilter. filterInputVal is: " + filterInputVal +
            ". See filtered list on next line:");
        console.log(newList);
        setFilteredList(newList);
    };

    const clearFilter = () => {
        setFilterInput("");
        doFilter("");
    }

    
    function sortByProp(propName, sortType) {
        // sort the user list based on property name and type
        jsSort(filteredList, propName, sortType);
        console.log("Sorted list is below");
        console.log(filteredList);

        // For state variables that are objects or arrays, you have to do 
        // something like this or else React does not think that the state 
        // variable (dbList) has changed. Therefore, React will not re-render 
        // the component.
        let listCopy = JSON.parse(JSON.stringify(filteredList)); 
        setFilteredList(listCopy);
    }

    function deleteListEle(theList, indx) {

        // This javascript "built in function" removes 1 element (2nd param),
        // starting from position indx (1st param)
        theList.splice(indx,1);

        // You have to make React aware that the list has actually changed 
        // or else it won't re-render. Converting to JSON and back does the trick. 
        return JSON.parse(JSON.stringify(theList));
    }

    // invoke a web API passing in userId to say which record you want to delete. 
    // but also remove the row (of the clicked upon icon) from the HTML table -- 
    // if Web API sucessful... 
    function deleteCar(userObj, indx) {
        console.log("To delete car " + userObj.carName + "?");
        
        modalFw.confirm("Do you really want to delete " + userObj.carName + "?", function() {
            ajax_alt(
                "car/delete?carId=" + userObj.carId, 
                function (obj) {
                    if (obj.errorMsg.length > 0) {
                        alert(`Error: ${obj.errorMsg}`); 
                        console.log(`Error: ${obj.errorMsg}`);
                    } else {
                        console.log("The car record is deleted successfully", obj);
                        setDbList(deleteListEle(dbList, indx));
                        setFilteredList(deleteListEle(filteredList, indx));
                        modalFw.alert("The record has been deleted successfully.");
                    }
                },
                function (msg) {
                    modalFw.alert(`Error: ${msg}`);
                }
            );
        });
    }// deleteCar

    if (isLoading) {
        console.log("Is Loading...");
        return <div> Loading... </div>
    }

    if (error) {
        console.log("Error...");
        return <div>Error: {error} </div>;
    }

    console.log("items for CarTable on next line");
    return (
        <div className="clickSort">
            <h3>
                Car List &nbsp;
                <img src="icons/insert.png" onClick={callInsert}/>
            </h3>
                <input value={filterInput} onChange={(e) => setFilterInput(e.target.value)} />
                &nbsp; 
                <button onClick={() => doFilter(filterInput)}>Search</button>
                &nbsp; 
                <button onClick={clearFilter}>Clear</button>
            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th></th>
                        <th onClick={() => sortByProp("carName", "text")}
                            className="textAlignCenter">
                            <img src="icons/sortUpDown16_black.png" />CarName
                        </th>

                        <th onClick={() => sortByProp("Mileage", "number")}
                            className="textAlignRight" >
                            <img src="icons/sortUpDown16_black.png" />Mileage
                        </th>

                        <th className="textAlignCenter">carPicture</th>

                        <th onClick={() => sortByProp("carYear", "number")}
                            className="textAlignCenter">
                            <img src="icons/sortUpDown16_black.png" />CarYear
                        </th>

                        <th onClick={() => sortByProp("Make", "text")}
                            className="textAlignCenter">
                            <img src="icons/sortUpDown16_black.png" />Make
                        </th>

                        <th onClick={() => sortByProp("Model", "text")}
                            className="textAlignCenter">
                            <img src="icons/sortUpDown16_black.png" />Model
                        </th>

                        <th onClick={() => sortByProp("Price", "number")}
                            className="textAlignRight" >
                            <img src="icons/sortUpDown16_black.png" />Price
                        </th>

                        <th onClick={() => sortByProp("userEmail", "text")} >
                            <img src="icons/sortUpDown16_black.png" />User Email
                        </th>

                        <th>Error</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        filteredList.map((listObj, index) =>
                            <tr key={listObj.carId}>
                                <td>
                                    <a href={'#/carUpdate:'+listObj.carId}><img src="icons/edit.png" className="clickLink"/></a>
                                </td>
                                <td className="textAlignCenter" onClick={() => deleteCar(listObj, index)} >
                                    <img src="icons/delete.png" />
                                </td>
                                <td>{listObj.carName + ' ('+listObj.carId+')'}</td>
                                <td className="textAlignRight">{listObj.Mileage}</td>
                                <td className="simple textAlignCenter"><img src={listObj.carPicture} /></td>
                                <td className="textAlignRight">{listObj.carYear}</td>
                                <td>{listObj.Make}</td>
                                <td>{listObj.Model}</td>
                                <td className="textAlignRight">{listObj.Price}</td>
                                <td>{listObj.userEmail}</td>
                                <td>{listObj.errorMsg}</td>
                            </tr>
                        )
                    }
                </tbody>
            </table>
        </div>
    );

}; // function AjaxCars
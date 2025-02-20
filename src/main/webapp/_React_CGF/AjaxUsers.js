"use strict";

const AjaxUsers = () => {

    console.log("AjaxUsers running");

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

            "webUser/getAll", // URL for AJAX call to invoke

            // success function (anonymous)
            function (dbList) {   // success function gets obj from ajax_alt
                if (dbList.dbError.length > 0) {
                    setError(dbList.dbError);
                } else {
                    console.log("in AjaxUsers, here is web user list (on the next line):");
                    console.log(dbList.webUserList);
                    jsSort(dbList.webUserList, "webUserId", "number");
                    setDbList(dbList.webUserList);
                    setFilteredList(dbList.webUserList);
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
        window.location.hash = "#/userInsert";
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

    function deleteUser(userObj, indx) {
        console.log("To delete user " + userObj.userEmail + "?");
        
        // Instead of native confirm, use modalFw.confirm
        modalFw.confirm("Do you really want to delete " + userObj.userEmail + "?", function() {
            ajax_alt(
                "webUser/delete?userId=" + userObj.webUserId, 
                function (obj) {
                    if (obj.errorMsg.length > 0) {
                        alert(`Error: ${obj.errorMsg}`); 
                        console.log(`Error: ${obj.errorMsg}`);
                    } else {
                        console.log("The web user record is deleted successfully", obj);
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
    }
     // deleteUser


    if (isLoading) {
        console.log("Is Loading...");
        return <div> Loading... </div>
    }

    if (error) {
        console.log("Error...");
        return <div>Error: {error} </div>;
    }

    console.log("items for UserTable on next line");
    return (
        <div className="clickSort">
            <h3>
                Web User List &nbsp;
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
                        <th onClick={() => sortByProp("userEmail", "text")} >
                            <img src="icons/sortUpDown16_black.png" />Email 
                        </th>
                        <th className="textAlignCenter">Image</th>
                        <th onClick={() => sortByProp("birthday", "date")}
                            className="textAlignCenter">
                            <img src="icons/sortUpDown16_black.png" />Birthday
                        </th>
                        <th onClick={() => sortByProp("membershipFee", "number")}
                            className="textAlignRight" >
                            <img src="icons/sortUpDown16_black.png" />Membership Fee
                        </th>
                        <th onClick={() => sortByProp("userRoleType", "text")}>
                            <img src="icons/sortUpDown16_black.png" />Role
                        </th>
                        <th>Error</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredList.map((listObj, index) => (
                        <tr key={listObj.webUserId}>
                            <td>
                                <a href={'#/userUpdate:' + listObj.webUserId}><img src="icons/edit.png" className="clickLink" /></a>
                            </td>
                            <td className="textAlignCenter" onClick={() => deleteUser(listObj, index)} >
                                    <img src="icons/delete.png" />
                            </td>
                            <td>{listObj.userEmail + ' ('+listObj.webUserId+')'}</td>
                            <td className="shadowImage textAlignCenter"><img src={listObj.userImage} /></td>
                            <td className="textAlignCenter">{listObj.birthday}</td>
                            <td className="textAlignRight">{listObj.membershipFee}</td>
                            <td className="nowrap">{listObj.userRoleType}</td>
                            <td>{listObj.errorMsg}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

}; // function AjaxUsers 
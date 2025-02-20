"use strict";

const CarInsertOrUpdate = (props) => {
    // Determine if this is an insert or update operation
    var action = "insert";
    var id = "";
    var url = props.location.pathname;
    console.log("url that invoked CarInsertOrUpdate is " + url);
    if (url.search(":") > -1) {
        const url_list = url.split(":");
        id = url_list[url_list.length - 1];
        console.log("to update id " + id);
        action = "update";
    } else {
        console.log("to insert");
    }

    // State variables
    const [carData, setCarData] = React.useState({
        "carId": "",
        "carPicture": "",
        "carYear": "",
        "Make": "",
        "Model": "",
        "Price": "",
        "carName": "",
        "Mileage": "",
        "webUserId": "",
        "userEmail": "",
        "errorMsg": ""
    });

    const [userList, setUserList] = React.useState([]);
    const [errorObj, setErrorObj] = React.useState({
        "carId": "",
        "carPicture": "",
        "carYear": "",
        "Make": "",
        "Model": "",
        "Price": "",
        "carName": "",
        "Mileage": "",
        "webUserId": "",
        "userEmail": "",
        "errorMsg": ""
    });

    // Loading flags
    const [isLoadingUserList, setIsLoadingUserList] = React.useState(true);
    const [isLoadingCar, setIsLoadingCar] = React.useState(true);
    const [isLoadingSaveResponse, setIsLoadingSaveResponse] = React.useState(false);

    // Helper functions
    const encodeUserInput = () => {
        var carInputObj = {
            "carId": carData.carId,
            "carPicture": carData.carPicture,
            "carYear": carData.carYear,
            "Make": carData.Make,
            "Model": carData.Model,
            "Price": carData.Price,
            "carName": carData.carName,
            "Mileage": carData.Mileage,
            "webUserId": carData.webUserId
        };
        console.log("carInputObj on next line");
        console.log(carInputObj);
        return encodeURI(JSON.stringify(carInputObj));
    };

    const setProp = (obj, propName, propValue) => {
        var o = Object.assign({}, obj);
        o[propName] = propValue;
        return o;
    };

    // useEffect to fetch user list and car data (if updating)
    React.useEffect(() => {
        console.log("AJAX call for user list");
        ajax_alt("webUser/getAll",
            function (obj) { // Success function for user list
                if (obj.dbError && obj.dbError.length > 0) {
                    setErrorObj(setProp(errorObj, "webUserId", obj.dbError));
                } else {
                    // Sort users by email
                    obj.webUserList.sort((a, b) => {
                        if (a.userEmail > b.userEmail) return 1;
                        if (a.userEmail < b.userEmail) return -1;
                        return 0;
                    });
                    setUserList(obj.webUserList);

                    // Set initial user if this is an insert
                    if (action === "insert" && obj.webUserList.length > 0) {
                        const firstUser = obj.webUserList[0];
                        setCarData(prevData => ({
                            ...prevData,
                            webUserId: firstUser.webUserId.toString()
                        }));
                    }
                }
                setIsLoadingUserList(false);
            },
            function (ajaxErrorMsg) { // Failure function for user list
                setErrorObj(setProp(errorObj, "errorMsg", ajaxErrorMsg));
                setIsLoadingUserList(false);
            }
        );

        if (action === "update") {
            console.log("Now getting car record " + id + " for update");
            ajax_alt("car/getById?carid=" + id,
                function (obj) { // Success function for car data
                    if (obj.errorMsg.length > 0) {
                        setErrorObj(setProp(errorObj, "errorMsg", obj.errorMsg));
                    } else {
                        console.log("got the car record for update");
                        // Convert webUserId to string
                        const carDataWithStringId = {
                            ...obj,
                            webUserId: obj.webUserId.toString()
                        };
                        setCarData(carDataWithStringId);
                    }
                    setIsLoadingCar(false);
                },
                function (ajaxErrorMsg) { // Failure function for car data
                    setErrorObj(setProp(errorObj, "errorMsg", ajaxErrorMsg));
                    setIsLoadingCar(false);
                }
            );
        } else {
            setIsLoadingCar(false); // No need to fetch car data for insert
        }
    }, []);

    const validate = () => {
        setIsLoadingSaveResponse(true);
        console.log("Validate, should kick off AJAX call");
        console.log("Here is the car data that will be sent to the insert/update API");
        console.log(carData);

        ajax_alt("car/" + action + "?jsonData=" + encodeUserInput(),
            function (obj) { // Success function for save
                console.log("These are the error messages (next line)");
                console.log(obj);

                if (obj.errorMsg.length === 0) {
                    obj.errorMsg = "Record Saved!";
                }

                setErrorObj(obj);
                setIsLoadingSaveResponse(false);
            },
            function (ajaxErrorMsg) { // Failure function for save
                setErrorObj(setProp(errorObj, "errorMsg", ajaxErrorMsg));
                setIsLoadingSaveResponse(false);
            }
        );
    };

    if (isLoadingUserList || isLoadingCar || isLoadingSaveResponse) {
        return <div>... Loading ...</div>;
    }

    return (
        <table className="insertArea">
            <tbody>
                <tr>
                    <td>Id</td>
                    <td>
                        <input value={carData.carId} disabled />
                    </td>
                    <td className="error">
                        {errorObj.carId}
                    </td>
                </tr>

                <tr>
                    <td>Car Name</td>
                    <td>
                        <input value={carData.carName} onChange={
                            e => setCarData(setProp(carData, "carName", e.target.value))
                        } />
                    </td>
                    <td className="error">
                        {errorObj.carName}
                    </td>
                </tr>
                <tr>
                    <td>Car Mileage</td>
                    <td>
                        <input value={carData.Mileage} onChange={
                            e => setCarData(setProp(carData, "Mileage", e.target.value))
                        } />
                    </td>
                    <td className="error">
                        {errorObj.Mileage}
                    </td>
                </tr>

                <tr>
                    <td>Car Picture</td>
                    <td>
                        <input value={carData.carPicture} onChange={
                            e => setCarData(setProp(carData, "carPicture", e.target.value))
                        } />
                    </td>
                    <td className="error">
                        {errorObj.carPicture}
                    </td>
                </tr>
                <tr>
                    <td>Car Year</td>
                    <td>
                        <input value={carData.carYear} onChange={
                            e => setCarData(setProp(carData, "carYear", e.target.value))
                        } />
                    </td>
                    <td className="error">
                        {errorObj.carYear}
                    </td>
                </tr>
                <tr>
                    <td>Make</td>
                    <td>
                        <input value={carData.Make} onChange={
                            e => setCarData(setProp(carData, "Make", e.target.value))
                        } />
                    </td>
                    <td className="error">
                        {errorObj.Make}
                    </td>
                </tr>
                <tr>
                    <td>Model</td>
                    <td>
                        <input value={carData.Model} onChange={
                            e => setCarData(setProp(carData, "Model", e.target.value))
                        } />
                    </td>
                    <td className="error">
                        {errorObj.Model}
                    </td>
                </tr>
                <tr>
                    <td>Price</td>
                    <td>
                        <input value={carData.Price} onChange={
                            e => setCarData(setProp(carData, "Price", e.target.value))
                        } />
                    </td>
                    <td className="error">
                        {errorObj.Price}
                    </td>
                </tr>

                <tr>
                    <td>User Email</td>
                    <td>
                        <select
                            onChange={e => {
                                setCarData(setProp(carData, "webUserId", e.target.value));
                            }}
                            value={carData.webUserId}
                        >
                            {userList && userList.map(user => (
                                <option key={user.webUserId} value={user.webUserId.toString()}>
                                    {user.userEmail}
                                </option>
                            ))}
                        </select>
                    </td>
                    <td className="error">
                        {errorObj.webUserId}
                    </td>
                </tr>
                <tr>
                    <td>
                        <br />
                        <button type="button" onClick={validate}>Save</button>
                    </td>
                    <td className="error" colSpan="2">
                        <br />
                        {errorObj.errorMsg}
                    </td>
                </tr>
            </tbody>
        </table>
    );
};

"use strict";

function Profile() {
    const [msg, setMsg] = React.useState("");

    // Function to fetch profile data
    const fetchProfile = () => {
        var url = "webUser/getProfile";
        console.log("AJAX call to URL: " + url);

        // AJAX call using ajax_alt
        ajax_alt(
            url,
            function (obj) {
                console.log("Ajax Success - got object (see next line).");
                console.log(obj);
                if (obj.errorMsg && obj.errorMsg.length > 0) {
                    setMsg(<strong>{obj.errorMsg}</strong>);
                } else {
                    setMsg(
                        <div>
                            <h2>Welcome Web User {" "} {obj.webUserId}</h2>
                            <h3>Birthday: {obj.birthday}</h3>
                            <h3>Membership Fee: {obj.membershipFee}</h3>
                            <h3>User Role: {obj.userRoleId} {" "} {obj.userRoleType}</h3>
                            <p><img src={obj.userImage} alt="User" /></p>
                        </div>
                    );
                }
            },
            function (errorMsg) {
                console.log("AJAX error. Here's the message: " + errorMsg);
                setMsg("ajax failure: " + errorMsg);
            }
        );
    };

    // useEffect hook to call fetchProfile only once when the component mounts
    React.useEffect(() => {
        fetchProfile(); // Call the function to make the AJAX call
    }, []); // Empty dependency array means this effect runs once

    return (
        <div className="logon">
            <div><h2>{msg}</h2></div>
        </div>
    );
} // function function Profile () {
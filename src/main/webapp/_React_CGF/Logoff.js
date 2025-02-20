"use strict";

function Logoff() {
    const [msg, setMsg] = React.useState("");

    // Function to fetch profile data
    const fetchlogoff = () => {
        var url = "webUser/logoff";
        console.log("AJAX call to URL: " + url);

        // AJAX call using ajax_alt
        ajax_alt(
            url,
            function (obj) {
                console.log("Ajax Success - got object (see next line).");
                console.log(obj);
                setMsg(<strong>{obj.errorMsg}</strong>);
            },
            function (errorMsg) {
                console.log("AJAX error. Here's the message: " + errorMsg);
                setMsg("ajax failure: " + errorMsg);
            }
        );
    };

    // useEffect hook to call fetchProfile only once when the component mounts
    React.useEffect(() => {
        fetchlogoff(); // Call the function to make the AJAX call
    }, []); // Empty dependency array means this effect runs once

    return (
        <div className="logon">
            <div><h2>{msg}</h2></div>
        </div>
    );
} // function function AjaxProfile () {
"use strict";

function Logon() {
    const [isLoading, setIsLoading] = React.useState(false);
    const [userEmailInput, setUserEmailInput] = React.useState("");
    const [userPasswordInput, setUserPasswordInput] = React.useState("");
    const [msg, setMsg] = React.useState("");

    function findClick() {
        setIsLoading(true);

        // You have to encodeURI user input before putting it into a URL for an AJAX call.
        // Otherwise, the web server may reject your AJAX call (for security reasons).
        var url = "webUser/getUser?userEmail=" + encodeURI(userEmailInput) + "&userPassword=" + encodeURI(userPasswordInput);

        console.log("onclick function will call ajax_alt with url: " + url);

        // for testing, this shows findClick was called, but if everything works, 
        // this test message will be overwritten by the success or failure fn below.
        setMsg("findClick was called (testing)"); 

        // ajax_alt takes three parameters:
        //   1. url to call
        //   2. success function (input param is object converted from json page)
        //   3. failure function (input param is error message string)
        ajax_alt(
            url,
            function (obj) {
                console.log("Ajax Success - got object (see next line).");
                console.log(obj);
                if (obj.errorMsg.length > 0) {
                    setMsg(<strong>{obj.errorMsg}</strong>);
                } else {
                    setMsg(
                        <div>
                            <h3>Welcome Web User {" "} {obj.webUserId} </h3>

                            <h3>Birthday: {obj.birthday} </h3>
                            <h3>MembershipFee: {obj.membershipFee} </h3>
                            <h3>User Role: {obj.userRoleId} {" "} {obj.userRoleType} </h3>
                            <p> <img src={obj.userImage} /> </p>
                        </div>
                    );
                }
                setIsLoading(false);
            },
            function (errorMsg) {
                console.log("AJAX error. Here's the message: " + errorMsg);
                setMsg("ajax failure: " + errorMsg);
                setIsLoading(false);
            }
        );

    }  // function findClick

    if (isLoading) {
        return (
            <div>
                <h2>... Loading ....</h2>
            </div>
        );
    }

    return (
        <div className ="logon">
        <h2>Login</h2>    
        <p>
            Email Address<input value={userEmailInput} onChange={(e) => setUserEmailInput(e.target.value)} />
            Password<input type="password" value={userPasswordInput} onChange={(e) => setUserPasswordInput(e.target.value)} />
            <button onClick={findClick}>Submit</button>
        </p>
        <div>{msg}</div>
        </div>
    );
}
package com.ahmed_web;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.ObjectMapper;

import dbUtils.DbConn;
import dbUtils.Json;
import jakarta.servlet.http.HttpSession;
import model.webUser.DbMods;
import model.webUser.StringData;
import model.webUser.StringDataList;
import view.WebUserView;

@RestController
public class WebUserController {

    @RequestMapping("/hello2") // only for testing purposes
    public String helloController() {
        return "<h1>Hello World</h1>";
    }

    @RequestMapping(value = "/webUser/getAll", produces = "application/json")
    public String allUsers() {

        StringDataList list = new StringDataList(); // dbError empty, list empty
        DbConn dbc = new DbConn();
        list = WebUserView.getAllUsers(dbc);

        dbc.close(); // EVERY code path that opens a db connection must close it
                     // (or else you have a database connection leak).

        return Json.toJson(list); // convert sdl obj to JSON Format and return that.
    }

    @RequestMapping(value = "/webUser/insert", params = { "jsonData" }, produces = "application/json")
    public String insert(@RequestParam("jsonData") String jsonInsertData) {

        StringData errorMsgs = new StringData();

        if ((jsonInsertData == null) || jsonInsertData.length() == 0) {
            errorMsgs.errorMsg = "Cannot insert. No user data was provided in JSON format";
        } else {
            System.out.println("user data for insert (JSON): " + jsonInsertData);
            try {
                ObjectMapper mapper = new ObjectMapper();
                StringData insertData = mapper.readValue(jsonInsertData, StringData.class);
                System.out.println("user data for insert (java obj): " + insertData.toString());

                DbConn dbc = new DbConn();
                errorMsgs.errorMsg = dbc.getErr();
                if (errorMsgs.errorMsg.length() == 0) { // db connection OK
                    errorMsgs = DbMods.insert(insertData, dbc);
                }
                dbc.close();
            } catch (Exception e) {
                String msg = "Could not convert jsonData to model.webUser.StringData obj: "+
                jsonInsertData+ " - or other error in controller for 'user/insert': " +
                        e.getMessage();
                System.out.println(msg);
                errorMsgs.errorMsg += ". " + msg;
            }
        }
        return Json.toJson(errorMsgs);
    }


    @RequestMapping(value = "/webUser/getById", params = {
        "userId" }, produces = "application/json")
public String getById(@RequestParam("userId") String userId) {
    StringData sd = new StringData();
    if (userId == null) {
        sd.errorMsg = "Error: URL must be user/getById/xx " +
                "where xx is the web_user_id of the desired web_user record.";
    } else {
        DbConn dbc = new DbConn();
        sd.errorMsg = dbc.getErr();
        if (sd.errorMsg.length() == 0) {
            System.out.println("*** Ready to call DbMods.getById");
            sd = DbMods.getById(dbc, userId);
        }
        dbc.close(); // EVERY code path that opens a db connection must close it
        // (or else you have a database connection leak).
    }
    return Json.toJson(sd);
}

@RequestMapping(value = "/webUser/getUser", params = {"userEmail","userPassword"}, produces = "application/json")
public String getByEmailPassword(
        @RequestParam("userEmail") String userEmail, 
        @RequestParam("userPassword") String userPassword,
        HttpSession session) {

    StringData sd = new StringData();
    if (userEmail == null || userPassword == null) {
        sd.errorMsg = "Error: Must provide both userEmail and userPassword";
        return Json.toJson(sd);
    }

    DbConn dbc = new DbConn();
    sd = DbMods.getByEmailPassword(dbc, userEmail, userPassword);
    dbc.close();

    if (sd.errorMsg == null || sd.errorMsg.isEmpty()) {
        // No error means we have a valid logged in user. Store in session.
        session.setAttribute("loggedOnUser", sd);
    }

    return Json.toJson(sd);
}

@RequestMapping(value = "/webUser/getProfile", produces = "application/json")
public String getProfile(HttpSession session) {
    // Attempt to read the user from the session.
    StringData loggedInUser = (StringData) session.getAttribute("loggedOnUser");
    if (loggedInUser == null) {
        // User not logged in
        StringData sd = new StringData();
        sd.errorMsg = "User not logged in! Please login to view profile!";
        return Json.toJson(sd);
    }

    // User is logged in
    return Json.toJson(loggedInUser);
}

@RequestMapping(value = "/webUser/logoff", produces = "application/json")
public String logoff(HttpSession session) {
    
    StringData sd = new StringData();
    
    session.invalidate();

    sd.errorMsg = "User has been logged off";

    return Json.toJson(sd);
}


    @RequestMapping(value = "/webUser/update", params = { "jsonData" }, produces = "application/json")
    public String update(@RequestParam("jsonData") String jsonInsertData) {

        StringData errorData = new StringData();

        if ((jsonInsertData == null) || jsonInsertData.length() == 0) {
            errorData.errorMsg = "Cannot update. No user data was provided in JSON format";
        } else {
            System.out.println("user data for update (JSON): " + jsonInsertData);
            try {
                ObjectMapper mapper = new ObjectMapper();
                StringData updateData = mapper.readValue(jsonInsertData, StringData.class);
                System.out.println("user data for update (java obj): " + updateData.toString());

                // The next 3 statements handle their own exceptions (so should not throw any
                // exception).
                DbConn dbc = new DbConn();
                errorData = DbMods.update(updateData, dbc);
                dbc.close();
            } catch (Exception e) {
                String msg = "Unexpected error in controller for 'webUser/insert'... " +
                        e.getMessage();
                System.out.println(msg);
                errorData.errorMsg = msg;
            }
        }
        return Json.toJson(errorData);
    }

    @RequestMapping(value = "/webUser/delete", params = {
        "userId" }, produces = "application/json")
public String deleteById(@RequestParam("userId") String deleteUserId) {
    StringData sd = new StringData();
    if (deleteUserId == null) {
        sd.errorMsg = "Error: URL must be user/deleteById?userId=xx, where " +
                "xx is the web_user_id of the web_user record to be deleted.";
    } else {
        DbConn dbc = new DbConn();
        sd = DbMods.delete(dbc, deleteUserId);
        dbc.close(); // EVERY code path that opens a db connection must close it
        // (or else you have a database connection leak).
    }
    return Json.toJson(sd);
}

}
package com.ahmed_web;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.ObjectMapper;

import dbUtils.DbConn;
import dbUtils.Json;
import model.car.DbMods;
import model.car.StringData;
import model.car.StringDataList;
import view.CarView;

@RestController
public class CarTableController {

    @RequestMapping(value = "/car/getAll", produces = "application/json")
    public String allUsers() {

        StringDataList list = new StringDataList(); // dbError empty, list empty
        DbConn dbc = new DbConn();
        list = CarView.getAllUsers2(dbc);

        dbc.close(); // EVERY code path that opens a db connection must close it
                     // (or else you have a database connection leak).

        return Json.toJson(list); // convert sdl obj to JSON Format and return that.
    }

    @RequestMapping(value = "/car/insert", params = { "jsonData" }, produces = "application/json")
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

    @RequestMapping(value = "/car/getById", params = {
        "carid" }, produces = "application/json")
public String getById(@RequestParam("carid") String carid) {
    StringData sd = new StringData();
    if (carid == null) {
        sd.errorMsg = "Error: URL must be car/getById/xx " +
                "where xx is the car_id of the desired car record.";
    } else {
        DbConn dbc = new DbConn();
        sd.errorMsg = dbc.getErr();
        if (sd.errorMsg.length() == 0) {
            System.out.println("*** Ready to call DbMods.getById");
            sd = DbMods.getById(dbc, carid);
        }
        dbc.close(); // EVERY code path that opens a db connection must close it
        // (or else you have a database connection leak).
    }
    return Json.toJson(sd);
}


    @RequestMapping(value = "/car/update", params = { "jsonData" }, produces = "application/json")
    public String update(@RequestParam("jsonData") String jsonInsertData) {

        StringData errorData = new StringData();

        if ((jsonInsertData == null) || jsonInsertData.length() == 0) {
            errorData.errorMsg = "Cannot update. No car data was provided in JSON format";
        } else {
            System.out.println("car data for update (JSON): " + jsonInsertData);
            try {
                ObjectMapper mapper = new ObjectMapper();
                StringData updateData = mapper.readValue(jsonInsertData, StringData.class);
                System.out.println("car data for update (java obj): " + updateData.toString());

                // The next 3 statements handle their own exceptions (so should not throw any
                // exception).
                DbConn dbc = new DbConn();
                errorData = DbMods.update(updateData, dbc);
                dbc.close();
            } catch (Exception e) {
                String msg = "Unexpected error in controller for 'car/insert'... " +
                        e.getMessage();
                System.out.println(msg);
                errorData.errorMsg = msg;
            }
        }
        return Json.toJson(errorData);
    }

    @RequestMapping(value = "/car/delete", params = {
        "carId" }, produces = "application/json")
    public String deleteByCarId(@RequestParam("carId") String deleteCarId) {
    StringData sd = new StringData();
    if (deleteCarId == null) {
        sd.errorMsg = "Error: URL must be car/deleteByCarId?carid=xx, where " +
                "xx is the car_id of the car record to be deleted.";
    } else {
        DbConn dbc = new DbConn();
        sd = DbMods.deletecar(dbc, deleteCarId);
        dbc.close(); // EVERY code path that opens a db connection must close it
        // (or else you have a database connection leak).
    }
    return Json.toJson(sd);
    }
}
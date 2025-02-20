package view;

import java.sql.PreparedStatement;
import java.sql.ResultSet;

import dbUtils.DbConn;
import dbUtils.Format;
import model.car.StringData;
import model.car.StringDataList;

public class CarView {

    public static StringDataList getAllUsers2(DbConn dbc) {

        // sdl will be an empty array and DbError with "" 
        StringDataList sdl = new StringDataList(); 

        sdl.dbError = dbc.getErr(); // returns "" if connection is good, else db error msg.
        if (sdl.dbError.length() > 0) {
            return sdl; // cannot proceed, db error (and that's been recorded in return object).
        }
        
        // sd will have all of it's fields initialized to ""
        StringData sd = new StringData();
        
        try {
            String sql = "SELECT car.car_id, car.car_picture, car.car_year, car.make, car.model, car.price, car.car_name, car.mileage, "
            + "car.web_user_id, user_email "
            + "FROM car, web_user where car.web_user_id=web_user.web_user_id "
            + "ORDER BY car.car_id ";  // always order by something, not just 
            
            PreparedStatement stmt = dbc.getConn().prepareStatement(sql);
            ResultSet results = stmt.executeQuery();

            while (results.next()) {
                
                sd = new StringData();
                
                // the Format methods do not throw exceptions. If they find illegal data (like you 
                // tried to format a date as an integer), they return an error message (instead of 
                // returning the formatted value). So, you'll see these error messages right in the 
                // API output (JSON data) and/or you'll see it on the page in the UI.

                sd.carId = Format.fmtInteger(results.getObject("car_id"));
                sd.carPicture = Format.fmtString(results.getObject("car_picture"));
                sd.carYear = Format.fmtInteger(results.getObject("car_year"));
                sd.Make = Format.fmtString(results.getObject("make"));
                sd.Model = Format.fmtString(results.getObject("model"));
                sd.Price = Format.fmtDollar(results.getObject("price"));
                sd.carName = Format.fmtString(results.getObject("car_name"));
                sd.Mileage = Format.fmtString(results.getObject("mileage"));
                sd.webUserId = Format.fmtInteger(results.getObject("web_user_id"));
                sd.userEmail = Format.fmtString(results.getObject("user_email"));

                sdl.add(sd);
            }
            results.close();
            stmt.close();
        } catch (Exception e) {
            sd.errorMsg = "Exception thrown in CarView.getAllUsers2(): " + e.getMessage();
            sdl.add(sd);
        }
        return sdl;
    }
}

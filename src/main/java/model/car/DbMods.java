package model.car;

import java.sql.PreparedStatement;
import java.sql.ResultSet;

import dbUtils.DbConn;
import dbUtils.Format;
import dbUtils.PrepStatement;
import dbUtils.Validate;

public class DbMods {
    /*
     * Returns a "StringData" object that is full of field level validation
     * error messages (or "" for any field that passes validation).
     */
    private static StringData validate(StringData inputData) {

        StringData errorMsgs = new StringData();

        
        // Validation
        errorMsgs.carName = Validate.stringMsg(inputData.carName, 200, true);//unique field
        errorMsgs.carPicture = Validate.stringMsg(inputData.carPicture, 600, false);
        errorMsgs.carYear = Validate.integerMsg(inputData.carYear, false);
        errorMsgs.Make = Validate.stringMsg(inputData.Make, 45, false);
        errorMsgs.Model = Validate.stringMsg(inputData.Model, 45, false);
        errorMsgs.Price = Validate.decimalMsg(inputData.Price, false);
        errorMsgs.webUserId = Validate.integerMsg(inputData.webUserId, true);//foreign key
        errorMsgs.Mileage = Validate.stringMsg(inputData.Mileage, 600, true);

        return errorMsgs;
    } // validate

    public static StringData insert(StringData inputData, DbConn dbc) {

        StringData errorMsgs = new StringData();
        errorMsgs = validate(inputData);
        if (errorMsgs.characterCount() > 0) { // at least one field has an error, don't go any further.
            errorMsgs.errorMsg = "Please try again";
            return errorMsgs;

        } else { // all fields passed validation

            /*
             *SELECT car.car_id, car.car_picture, car.car_year, car.make, car.model, car.price, car.car_name, car.mileage, 
            * car.web_user_id, user_email
            * FROM car, web_user where car.web_user_id=web_user.web_user_id 
            * ORDER BY car.car_id
             */
            // Start preparing SQL statement
            String sql = "INSERT INTO car (car_picture, car_year, make, model, price, web_user_id , " 
            + " car_name, mileage) values (?,?,?,?,?,?,?,?)";

            // PrepStatement is Sally's wrapper class for java.sql.PreparedStatement
            // Only difference is that Sally's class takes care of encoding null
            // when necessary. And it also System.out.prints exception error messages.
            PrepStatement pStatement = new PrepStatement(dbc, sql);

            // Encode string values into the prepared statement (wrapper class).
            pStatement.setString(1, inputData.carPicture);
            pStatement.setInt(2, Validate.convertInteger(inputData.carYear));
            pStatement.setString(3, inputData.Make);
            pStatement.setString(4, inputData.Model);
            pStatement.setBigDecimal(5, Validate.convertDecimal(inputData.Price));
            pStatement.setInt(6, Validate.convertInteger(inputData.webUserId)); // string type is simple
            pStatement.setString(7, inputData.carName); // string type is simple
            pStatement.setString(8, inputData.Mileage); // string type is simple

            // here the SQL statement is actually executed
            int numRows = pStatement.executeUpdate();

            // This will return empty string if all went well, else all error messages.
            errorMsgs.errorMsg = pStatement.getErrorMsg();
            if (errorMsgs.errorMsg.length() == 0) {
                if (numRows == 1) {
                    errorMsgs.errorMsg = ""; // This means SUCCESS. Let the user interface decide how to tell this to
                                             // the user.
                } else {
                    // probably never get here unless you forgot your WHERE clause and did a bulk
                    // sql update.
                    errorMsgs.errorMsg = numRows + " records were inserted when exactly 1 was expected.";
                }
            } else if (errorMsgs.errorMsg.contains("foreign key")) {
                errorMsgs.errorMsg = "Invalid web user Id - " + errorMsgs.errorMsg;
            } else if (errorMsgs.errorMsg.contains("Duplicate entry")) {
                errorMsgs.errorMsg = "That car name is already taken - " + errorMsgs.errorMsg;
            }

        } // customerId is not null and not empty string.
        return errorMsgs;
    } // insert

    public static StringData update(StringData updateData, DbConn dbc) {

        StringData errorMsgs = new StringData();
        errorMsgs = validate(updateData);

        // For update, we also need to check that webUserId has been supplied by the user...
        errorMsgs.carId = Validate.integerMsg(updateData.carId, true);

        if (errorMsgs.characterCount() > 0) { // at least one field has an error, don't go any further.
            errorMsgs.errorMsg = "Please try again";
            return errorMsgs;

        } else { // all fields passed validation

            /* Useful to know the exact field names in the database... 
             * String sql =
             * "SELECT web_user_id, user_email, user_password, user_image, membership_fee, "
             * "birthday, web_user.user_role_id, user_role_type "+
             * "FROM web_user, user_role where web_user.user_role_id = user_role.user_role_id "
             * "ORDER BY web_user_id ";
             */

            String sql = "UPDATE car SET car_picture = ?, car_year = ?, make = ?, "+
                    "model = ?, price = ?, web_user_id = ?, car_name = ?, mileage = ? WHERE car_id = ?";

            // PrepStatement is Sally's wrapper class for java.sql.PreparedStatement
            // Only difference is that Sally's class takes care of encoding null
            // when necessary. And it also System.out.prints exception error messages.
            PrepStatement pStatement = new PrepStatement(dbc, sql);

            // Encode string values into the prepared statement (wrapper class).
            pStatement.setString(1, updateData.carPicture); // string type is simple
            pStatement.setInt(2, Validate.convertInteger(updateData.carYear));
            pStatement.setString(3, updateData.Make);
            pStatement.setString(4, updateData.Model);
            pStatement.setBigDecimal(5, Validate.convertDecimal(updateData.Price));
            pStatement.setInt(6, Validate.convertInteger(updateData.webUserId));
            pStatement.setString(7, updateData.carName);
            pStatement.setString(8, updateData.Mileage);
            pStatement.setInt(9, Validate.convertInteger(updateData.carId));

            // here the SQL statement is actually executed
            int numRows = pStatement.executeUpdate();

            // This will return empty string if all went well, else all error messages.
            errorMsgs.errorMsg = pStatement.getErrorMsg();
            if (errorMsgs.errorMsg.length() == 0) {
                if (numRows == 1) {
                    errorMsgs.errorMsg = ""; // This means SUCCESS. Let the user interface decide how to tell this to
                                             // the user.
                } else {
                    // probably never get here unless you forgot your WHERE clause and did a bulk
                    // sql update OR the web User id (supplied by the client side) does not exist.
                    errorMsgs.errorMsg = numRows + " records were inserted when exactly 1 was expected.";
                }
            } else if (errorMsgs.errorMsg.contains("foreign key")) {
                errorMsgs.errorMsg = "Invalid web user Id - " + errorMsgs.errorMsg;
            } else if (errorMsgs.errorMsg.contains("Duplicate entry")) {
                errorMsgs.errorMsg = "The car name is already taken - " + errorMsgs.errorMsg;
            }

        } // customerId is not null and not empty string.
        return errorMsgs;
    } // update

    //delete method
    public static StringData deletecar(DbConn dbc, String carId) {

        StringData sd = new StringData();

        if (carId == null) {
            sd.errorMsg = "modelCar.DbMods.delete: " +
                    "cannot delete car record because 'carId' is null";
            return sd;
        }

        sd.errorMsg = dbc.getErr();
        if (sd.errorMsg.length() > 0) { // cannot proceed, db error
            return sd;
        }

        try {

            String sql = "DELETE FROM car WHERE car_id = ?";

            // Compile the SQL (checking for syntax errors against the connected DB).
            PreparedStatement pStatement = dbc.getConn().prepareStatement(sql);

            // Encode user data into the prepared statement.
            pStatement.setString(1, carId);

            int numRowsDeleted = pStatement.executeUpdate();

            if (numRowsDeleted == 0) {
                sd.errorMsg = "Record not deleted - there was no record with car_id " + carId;
            } else if (numRowsDeleted > 1) {
                sd.errorMsg = "Programmer Error: > 1 record deleted. Did you forget the WHERE clause?";
            }

        } catch (Exception e) {
            sd.errorMsg = "Exception thrown in model.car.DbMods.delete(): " + e.getMessage();
        }

        return sd;
    }//delete

    public static StringData getById(DbConn dbc, String id) {
        StringData sd = new StringData();
        // This case already tested in the controller, but ("belt and suspenders")
        // we are double checking here as well.
        if (id == null) {
            sd.errorMsg = "Cannot getById (car): id is null";
            return sd;
        }

        Integer intId;
        try {
            intId = Integer.valueOf(id);
        } catch (Exception e) {
            sd.errorMsg = "Cannot getById (car): URL parameter 'id' can't be converted to an Integer.";
            return sd;
        }
        try {
            String sql = "SELECT car_id, car_picture, car_year, make, model, "
                    + "price, car.web_user_id, car_name, mileage "
                    + "FROM car, web_user WHERE car.web_user_id = web_user.web_user_id "
                    + "AND car_id = ?";
            PreparedStatement stmt = dbc.getConn().prepareStatement(sql);

            // Encode the id (that the user typed in) into the select statement, into the
            // the first (and only) ?
            stmt.setInt(1, intId);

            ResultSet results = stmt.executeQuery();
            if (results.next()) { // id is unique, one or zero records expected in result set

                // plainInteger returns integer converted to string with no commas.
                sd.carId = Format.fmtInteger(results.getObject("car_id"));
                sd.carPicture = Format.fmtString(results.getObject("car_picture"));
                sd.carYear = Format.fmtInteger(results.getObject("car_year"));
                sd.Make = Format.fmtString(results.getObject("make"));
                sd.Model = Format.fmtString(results.getObject("model"));
                sd.Price = Format.fmtDollar(results.getObject("price"));
                sd.webUserId = Format.fmtInteger(results.getObject("car.web_user_id"));
                sd.carName = Format.fmtString(results.getObject("car_name"));//unique
                sd.Mileage = Format.fmtString(results.getObject("mileage"));
            } else {
                sd.errorMsg = "car data Not Found.";
            }
            results.close();
            stmt.close();
        } catch (Exception e) {
            sd.errorMsg = "Exception thrown in model.car.DbMods.getById(): " + e.getMessage();
        }
        return sd;
    } // getById


}

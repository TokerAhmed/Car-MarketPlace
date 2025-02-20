package model.car;
public class StringData {
    public String carId = "";     // auto-increment primary key

    public String carPicture="";

    public String carYear="";

    public String Make="";

    public String Model = "";

    public String Price= "";

    public String carName = "";     // varChar 200, must be unique

    public String Mileage= "";

    public String webUserId= "";    //foreign key

    public String userEmail= "";    //from webuser table

    public String errorMsg = "";      // not actually in the database, used by the app 
                                      // to convey success or failure.    


 // default constructor leaves all data members with empty string (Nothing null).
  public StringData() {

  }

  public int characterCount() {
    String s = this.carId + this.carPicture + this.carYear +
    this.Make + this.Model + this.Price +
    this.webUserId + this.carName + this.Mileage;

    return s.length();
  }

}

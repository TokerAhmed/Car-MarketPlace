"use strict"; // prevent browser from globally auto-declaring variables

function MakeCarList({
    carName = "unknown",
    seller = "unknown",
    description = "Not available",
    imgUrl = "pics/missing.jpg",
    imagelist = [
        { "display": "Image not available", "val": "pics/missing.jpg" }
    ],
    mileage = 0,
    price = 0
}) {
    var carObj = document.createElement("div");
    carObj.classList.add("carlist");

    // Private variables
    carObj.carName = carName;
    var Seller = seller;
    carObj.description = description;
    var ImgUrl = imgUrl;
    var Mileage = mileage;
    var Price = price;

    carObj.setSeller = function (newSeller) {
        Seller = newSeller;
        display();
    };

    carObj.changeMileage = function (changemiles) {
        var n = Number(changemiles);
        console.log("changing mileage by this amount " + n);
        Mileage += n;
        display();
    };

    carObj.changePrice = function (changeprice) {
        var n = Number(changeprice);
        console.log("changing price by this amount " + n);
        Price += n;
        display();
    }

    carObj.setImageUrl = function (newImageUrl) {
        ImgUrl = newImageUrl;
        display();
    };

    // Build the UI
    carObj.innerHTML = `
        <div class='carInfoClass'></div>
        <button class='SellerButtonClass'>Change Seller to:</button>
        <input class='newSellerInputClass'/> <br/>
        <button class='MileageButtonClass'>Change Mileage(Add):</button>
        <input class='MileageInputClass'/> <br/>
        <button class='PriceButtonClass'>Change Price(Add/Subtract):</button>
        <input class='PriceInputClass'/> <br/>
        <label for='selectCarImage'>Change Image:</label>
        <select class='selectCarInputImage'></select>
    `;

    // Create variable references for all DOM elements that we need to access
    var carInfo = carObj.getElementsByClassName("carInfoClass")[0];
    var sellerButton = carObj.getElementsByClassName("SellerButtonClass")[0];
    var newSellerInput = carObj.getElementsByClassName("newSellerInputClass")[0];
    var mileageButton = carObj.getElementsByClassName("MileageButtonClass")[0];
    var mileageInput = carObj.getElementsByClassName("MileageInputClass")[0];
    var priceButton = carObj.getElementsByClassName("PriceButtonClass")[0];
    var priceInput = carObj.getElementsByClassName("PriceInputClass")[0];
    var selectCarImage = carObj.getElementsByClassName("selectCarInputImage")[0]; //selector

    // Display the car's current information
    var display = function () {
        carInfo.innerHTML = `
        <p>
          <h3>Car name: ${carObj.carName}</h3>
          Seller: ${Seller}<br/>
          Description: ${carObj.description}<br/>
          Mileage: ${Mileage} miles<br/>
          Price: ${Price} dollars<br/>
          <img src="${ImgUrl}" class="carImage"/>
        </p>
        `;
    };

    display();

    // Event listeners for updating the properties
    sellerButton.onclick = function () {
        carObj.setSeller(newSellerInput.value);
    };

    mileageButton.onclick = function () {
        carObj.changeMileage(mileageInput.value);
    };

    priceButton.onclick = function () {
        carObj.changePrice(priceInput.value);
    };


    //Added onblur event
    priceInput.onblur = function () {
        if (isNaN(priceInput.value)) {
            alert("Please enter a valid number");
        }
    };

    mileageInput.onblur = function () {
        if (isNaN(mileageInput.value)) {
            alert("Please enter a valid number");
        }
    };

    // put the options into the select tag
    for (var listEle of imagelist) {
        var opt = document.createElement("option");
        opt.innerHTML = listEle.display;
        opt.value = listEle.val;
        selectCarImage.appendChild(opt);
    }


    selectCarImage.addEventListener("change", function () {
        carObj.setImageUrl(this.value);  // Update the image source to the selected file
    });

    return carObj;
}

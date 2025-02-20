function MakeCarList_CGF() {
    // Create a container div that will hold the three car components
    var ele = document.createElement("div");

    //First car
    var carDiv1 = MakeCarList({
        carName: "Ruby",
        seller: "Angela",
        description: "Reliable, fuel-efficient and great for daily use.",
        imgUrl: "pics/Ruby(front).jpg",
        imagelist: [
            { "display": "Ruby front exterior", "val": "pics/Ruby(front).jpg" },
            { "display": "Ruby back exterior", "val": "pics/Ruby(back).jpg" },
            { "display": "Ruby interior", "val": "pics/Ruby(interior).jpg" },
        ],
        mileage: 50000,  // Mileage for the car (non-character property)
        price:12500

    });
    ele.appendChild(carDiv1);  

    // Second car
    var carDiv2 = MakeCarList({
        carName: "Beast",
        seller: "Andrew",
        description: "Strong and reliable car with a very low mileage.",
        imgUrl: "pics/Beast(front).jpg",
        imagelist: [
            { "display": "Beast front exterior", "val": "pics/Beast(front).jpg" },
            { "display": "Beast back exterior", "val": "pics/Beast(back).jpg" },
            { "display": "Beast interior", "val": "pics/Beast(interior).jpg" },
        ],
        mileage: 15000,  // Mileage for the car
        price:20000
    });
    ele.appendChild(carDiv2);  

    // Car 3: Default values 
    var carDiv3 = MakeCarList({});
    ele.appendChild(carDiv3);  

    
    return ele;
}

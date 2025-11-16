const mongoose = require("mongoose");
const initData = require("./data.js");
console.log(initData)
const Listing = require("../models/listing.js");


 
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";


main().then(() => {
    console.log("connected to DB");   
}).catch((err) => {
    console.log(err);
})

async function main() {
    await mongoose.connect(MONGO_URL);
}; 

const initDB = async () => {
    await Listing.deleteMany({});
    const listings = initData.sampleListings.map((obj) => ({
    ...obj,
    owner: "6918598cafa23c112b7c602b"
}));

await Listing.insertMany(listings);
    console.log("data was initialized");
};

initDB();
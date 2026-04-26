const mongoose = require("mongoose");
const Listing = require("../models/listing");
const initData = require("./data");

require("dotenv").config({ path: "../.env" });

async function main() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("DB connected");

    await initDB();

  } catch (err) {
    console.log(err);
  }
}

const initDB = async () => {
  try {
    await Listing.deleteMany({});
    console.log("Old data deleted");

    await Listing.insertMany(initData.data);
    console.log("✅ 200 Listings inserted successfully");

  } catch (err) {
    console.log("Insert Error:", err);
  } finally {
    mongoose.connection.close();
  }
};

main();
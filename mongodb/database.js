// mongodb/database.js
import mongoose from "mongoose";

let isConnected = false; // Database connection status

export const connectToDB = async () => {
    mongoose.set('strictQuery', true)

    // If the connection is already established, return that connection
    if (isConnected) {
      console.log("MongoDB is connected successfully!")
      return
    }

    // Connect to the database
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: "food_app",
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        // Set the connection status to true
        isConnected = true
        console.log("MongoDB is connected successfully!")
    } catch (error) {
        console.log("Error connecting to MongoDB: ", error)
    }
}
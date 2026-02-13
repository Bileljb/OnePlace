import dns from "dns";
import mongoose from "mongoose";
import { DB_URI, NODE_ENV } from "../config/env.js";

// Force public DNS servers BEFORE connecting
dns.setServers(["1.1.1.1", "8.8.8.8"]);

if (!DB_URI) {
    throw new Error(
        "Please define the MONGODB_URI environment variable inside .env<development/production>.local file"
    );
}

const connectDB = async () => {
    try {
        await mongoose.connect(DB_URI as string);
        console.log(`Connected to database successfully in ${NODE_ENV} environment`);
    } catch (error) {
        console.error("Error connecting to database: ", error);
        process.exit(1);
    }
};

export default connectDB;

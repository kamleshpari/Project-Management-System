import mongoose from "mongoose";

export const connectDB = async () => {
    mongoose.connect(process.env.MONGODB_URI, {
        dbName: "Fy-project-management-system",
    }).then(() => {
        console.log("Database connected successfully");
    }).catch((err) => {
        console.log("Database connection failed", err);
    });
}
   


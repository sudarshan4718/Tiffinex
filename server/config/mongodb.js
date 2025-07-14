import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Database Connected");
    } catch (err) {
        console.error("❌ MongoDB connection error:", err.message);
        process.exit(1);
    }

    mongoose.connection.on("error", (err) => {
        console.error("❌ MongoDB runtime error:", err.message);
    });
};

export default connectDB;

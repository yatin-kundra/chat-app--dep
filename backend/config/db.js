import mongoose from "mongoose";
import dotenv from "dotenv"
import colors from "colors"

dotenv.config();

const connectDB = async() => {
    try {
        const conn  = await mongoose.connect(process.env.MONGO_URI,{
        // useNewUrlParser: true,
        //     useUnifiedTopology: true,
            // useFindAndModify: true,
    })

    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.bold);


}   catch (error) {
        console.log(`${error}`)
    }
};

export default connectDB;
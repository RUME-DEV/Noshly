import mongoose from "mongoose";

const connectDB = async() => {
    try {
        const con = await mongoose.connect(process.env.MONGODB_URI)

        console.log(`Database Connected ${con.connection.host} ${con.connection.name}`)
    } catch(error) {
        console.error(`Database Connection Failed ${error.message}`)

        throw error
    }
}



export default connectDB
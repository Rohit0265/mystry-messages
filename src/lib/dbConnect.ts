import mongoose from "mongoose"
// import { number } from "zod"

type ConnectionObject = {
    isConnected?:number
}

const connection:ConnectionObject ={

}

async function dbConnect():Promise<void>{
    if(connection.isConnected){
        console.log("Already connected to dashboard")
        return
    }
    try{
        const db = await mongoose.connect(process.env.MONGO_URI || '',{});
        console.log(db);
        connection.isConnected = db.connections[0].readyState
console.log("DB Connected Successfully");

    }catch(error){
        console.log("darabase not connected due to some error like env error",error)
        process.exit(1);
    }
}


export default dbConnect;
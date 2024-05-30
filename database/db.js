const mongoose = require('mongoose');
const CONNECTION  = 'mongodb+srv://sajan2121089:sajank1818@cluster0.vljmit7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

const connectDb = async() => {
    try {
        const connect = await mongoose.connect(CONNECTION);
        if(connect){
            console.log("Connected Successfully");
        }else{
            console.log("Failure to connect Database");
        }
    } catch (error) {
        console.log("Error Occurred While Connecting DB",error);
    }
}

module.exports = connectDb;
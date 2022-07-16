import mongoose  from "mongoose";

const schema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true 
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    }
}, {
    timestamps:true,
})

export default mongoose.model("Products", schema)
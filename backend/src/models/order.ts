import mongoose  from "mongoose";

const schema = new mongoose.Schema({
    orderNumber: {
        type: String,
        required: true,
        unique: true 
    },
    items: {
        type: Array,
        required: true,
    },
    total: {
        type: Number,
        required: true
    }
}, {
    timestamps:true,
})

export default mongoose.model("Order", schema)
import mongoose  from "mongoose";
import bcryptjs from "bcryptjs";

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    passwordResetToken: {
        type: String,
        select: false
    },
    passwordResetExpires: {
        type: Date,
        select: false
    },
    permissions: {
        type: String,
        enum: ['ADMIN', 'USER'],
        default: 'USER'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

// antes de salvar o usuario novo ele primeiro vai fazer um criptgrafia da senha

schema.pre('save', async function (next){
    const hash = await bcryptjs.hash(this.password, 10)
    this.password = hash
    next()
})

export default mongoose.model("User", schema)
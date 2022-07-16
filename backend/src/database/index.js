import mongoose from 'mongoose'
import config from '../config/database'

class DataBase {
    constructor(){
        this.connection = mongoose.connect(config.url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
    }
}

export default new DataBase()
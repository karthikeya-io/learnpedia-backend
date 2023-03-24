require('dotenv').config({ path: './config/.env' })

const mongoose = require('mongoose');


//DB Connection
exports.dbConnect = mongoose.connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('db connected');
}).catch((err) => {
    console.log(err);
});

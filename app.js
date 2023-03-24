const express = require('express');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const {dbConnect} = require('./server');
const cors = require("cors");
const app = express();

//my routes
const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//my routes
app.use("/api", authRoutes)
app.use("/api", courseRoutes)



const port = 3001;
app.listen(port, () => {
  console.log(`app is running at ${port}`);
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});


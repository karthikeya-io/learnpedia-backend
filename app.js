const express = require('express');
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const {dbConnect} = require('./server');
const cors = require("cors");
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const app = express();
//my routes
const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const userRoutes = require("./routes/userRoutes");

//swagger
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Library API",
      version: "1.0.0",
      description: "A simple Express Library API"
    },
    servers:[
      {
        url : "http://localhost:3001/api"
      }
    ],
  },
  apis: ["./routes/*.js"]
}

const specs = swaggerJsDoc(options);
app.use("/api-docs", swaggerUI.serve,swaggerUI.setup(specs))

app.use(
  bodyParser.json()
);
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(cors());

// create a write stream (in append mode) for the log file
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'logs/access.log'), { flags: 'a' }
);

// setup the logger middleware using the "combined" format
app.use(morgan('combined', { stream: accessLogStream }));


//my routes
app.use("/api", authRoutes)
app.use("/api", courseRoutes)
app.use("/api", userRoutes)


const port = 3001;
app.listen(port, () => {
  console.log(`app is running at ${port}`);
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

module.exports = app;
const express = require('express');
const multer = require('multer');

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

// // Set up multer middleware for file uploads
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/'); // Set the destination folder for uploaded files
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + '-' + file.originalname); // Set the filename of the uploaded file
//   }
// });
// const upload = multer({ storage: storage });

// app.post('/lesson', upload.single('video'), (req, res) => {
//   console.log("hello");
//   console.log(req.body);
//   console.log(req.file)
//   res.status(200).json({message: "lesson uploaded :)"});
// })

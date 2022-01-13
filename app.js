const express = require("express");
const app = express();
const connect = require("./models/index");
connect();
const router = require("./routes/router");
const render = require('./renders');
const cors = require("cors");
const port = 3000;
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger-output");
require("dotenv").config();

app.use("*", cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api", router);
app.use('/', render);
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use("/public", express.static("public"));

app.use((req, res, next) => {
    try {
        console.error(error);
        res.sendStatus(404);
    } catch (error) {
        res.render('404');
    }
});

// app.use((req, res, next) => {
//     res.sendStatus(404);
// });
app.use((error, req, res, next) => {
    console.error(error);
    res.sendStatus(500);
});

app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`);
});

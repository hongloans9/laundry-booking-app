import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import methodOverride from "method-override";
import mongoose from "mongoose";
import Promise from 'bluebird';
import { mongoConf } from "./mongoConfig";
import { validateToken } from "./controllers/authentication";
import routes from "./routeIndex";

mongoose.Promise = Promise;
const mongoHost = mongoConf.host;
mongoose.connect(mongoHost);
mongoose.connection.on("error", () => {
    throw new Error(`unable to connect to database: ${mongoHost}`);
});

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(methodOverride());

app.use((req, res, next) => {
    if (req.originalUrl === "/status") {
        return next();
    }

    const token = req.headers.authorization;
    const notAuthErr = new Error("Not allowed");
    const user = validateToken(token);
    if (!token) {
        return next(notAuthErr);
    }

    if (user) {
        req.user = user;
        return next();
    }
    return next(notAuthErr);
});

app.use("/api", routes);
app.use((err, req, res, next) =>
    res.status(500).json({
        message: "Failed to process request",
        error: err.message
    })
);

const PORT = process.env.PORT || 7788;
app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
});

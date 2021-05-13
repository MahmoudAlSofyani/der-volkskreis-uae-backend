var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
var indexRouter = require("./routes/index");
var membersRouter = require("./routes/members");
var carsRouter = require("./routes/cars");
var utilitiesRouter = require("./routes/utility");
var eventsRouter = require("./routes/events");
var announcementsRouter = require("./routes/announcements");
var authRouter = require("./routes/auth");
var postsRouter = require("./routes/posts");
var commentsRouter = require("./routes/comments");
var advertisementsRouter = require("./routes/advertisements");
var app = express();

global.__basedir = __dirname;

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
// app.use(function (req, res, next) {
//   res.set(
//     "Content-Type",
//     req.accepts().includes("text/html") ? "text/html" : "application/json"
//   );
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, OPTIONS, PUT, PATCH, DELETE"
//   );
//   res.set("Accept-Encoding", "gzip");
//   if (req.method === "OPTIONS") {
//     res.sendStatus(200);
//   } else {
//     next();
//   }
// });
// app.use(express.static('uploads'));
app.use("/", indexRouter);
app.use("/members", membersRouter);
app.use("/cars", carsRouter);
app.use("/utility", utilitiesRouter);
app.use("/events", eventsRouter);
app.use("/announcements", announcementsRouter);
app.use("/auth", authRouter);
app.use("/posts", postsRouter);
app.use("/comments", commentsRouter);
app.use("/advertisements", advertisementsRouter);

module.exports = app;

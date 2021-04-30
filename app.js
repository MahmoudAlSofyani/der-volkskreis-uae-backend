var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var membersRouter = require("./routes/members");
var carsRouter = require("./routes/cars");
var utilitiesRouter = require("./routes/utility");
var eventsRouter = require("./routes/events");
var announcementsRouter = require("./routes/announcements");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/members", membersRouter);
app.use("/cars", carsRouter);
app.use("/utility", utilitiesRouter);
app.use("/events", eventsRouter);
app.use("/announcements", announcementsRouter);

module.exports = app;

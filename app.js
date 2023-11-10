import express from "express";
import { json, urlencoded } from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import session from "express-session";
import createError from "http-errors";
import { join } from "path";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.set("view engine", "pug");

// Configuración de sesión
app.use(
  session({
    secret: process.env.CLAVE_JWT, // Cambia esto a una clave secreta segura
    resave: false,
    saveUninitialized: true,
  })
);

app.use(logger("dev"));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());

// Configuración de rutas
import indexRouter from "./routes/index.js";
import usersRouter from "./routes/users.js";

app.use("/", indexRouter);
app.use("/api/users", usersRouter);


// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

export { app };

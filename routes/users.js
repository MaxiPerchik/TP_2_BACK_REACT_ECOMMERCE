import { Router } from "express";
const router = Router();
import userController from "../controllers/users.js";
import Jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const CLAVE_SECRETA = process.env.CLAVE_SECRETA;

/* GET users listing. */
router.get("/", async function (req, res, next) {
  res.json(await userController.getAllUsers());
});

router.post("/register", async function (req, res, next) {
  const newUser = req.body;
  const result = await userController.addUser(newUser);
  res.send(result);
});

router.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const passowrd = req.body.password;

    const token = await userController.login(email, passowrd);

    req.session.token = token;

    res.json({ token });
  } catch (error) {
    res.status(401).send("Autenticación fallida " + error.message);
  }
});

router.put("/update-user", (req, res) => {
   // chequea que el token este en la session
  if (!req.session.token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    // verifica que sea el token correcto
    const decoded = Jwt.verify(req.session.token, 'CLAVE_SECRETA');
    
    // se puede acceder al id del user con el token
    const userId = decoded._id;
    
    // habria que ver de validar la info de alguna manera
    userController.updateUser(userId, req.body.name);

    res.json({ message: "User updated successfully " + req.body.name });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Unauthorized" });
  }
});

export default router;

import { Router } from "express";
const router = Router();
import userController from "../controllers/users.js";
import Jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const CLAVE_JWT = process.env.CLAVE_JWT;

/* GET users listing. */
router.get("/", async function (req, res, next) {
  res.json(await userController.getAllUsers());
});

router.post("/register", async function (req, res, next) {
  const newUser = req.body;
  console.log("de la ruta", newUser);
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

router.put("/update-user", async (req, res) => {
  // chequea que el token este en la session
  if (!req.session.token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // verifica que sea el token correcto
    const decoded = Jwt.verify(req.session.token, CLAVE_JWT);

    res.json(await userController.updateUser(decoded._id, req.body.name)); // Envía el mensaje de respuesta
  } catch (error) {
    res.json({ message: error.message });
  }
});

router.delete("/delete", async (req, res) => {
  try {
    const { email, password } = req.body;
    res.json(await userController.destroy(email, password)); // Envía el mensaje de respuesta
  } catch (error) {
    res.json({ message: error.message });
  }
});

export default router;

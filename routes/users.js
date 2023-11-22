import { Router } from "express";
const router = Router();
import userController from "../controllers/users.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import Jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const CLAVE_JWT = process.env.CLAVE_JWT;

/* GET users listing. */
router.get("/", authMiddleware, async function (req, res, next) {
  try {
    console.log(req.user.role);
    // Verificar si el usuario es un administrador
    if (req.user.role !== "admin") {
      return res.status(403).json({
        error: "Acceso no autorizado. Se requiere rol de administrador.",
      });
    }

    res.json(await userController.getAllUsers());
  } catch (error) {
    console.log(error.message);
  }
});

router.post("/register", async function (req, res, next) {
  try {
    const newUser = req.body;
    const result = await userController.addUser(newUser);
    res.status(201).json({ success: true, result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
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

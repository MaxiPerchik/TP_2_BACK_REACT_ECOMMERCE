import { Router } from "express";
const router = Router();
import userController from "../controllers/users.js";

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

    res.json({ message: "Authentication successful", token });
  } catch (error) {
    res.status(401).send("Autenticación fallida " + error.message);
  }
});

export default router;

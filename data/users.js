import { getConnection } from "./conn.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { Schema, model } from "mongoose";

dotenv.config();
const CLAVE_JWT = process.env.CLAVE_JWT;

const userSchema = new Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  telefono: { type: String },
  email: { type: String, required: true, unique: true },
  emailConfirmacion: { type: String },
  password: { type: String, required: true },
  role: { type: String, enum: ["regular", "admin"], default: "regular" },
});

const User = model("User", userSchema);

async function getUsers() {
  const connectiondb = await getConnection();
  const users = await connectiondb
    .db("sample_mflix")
    .collection("users")
    .find()
    .toArray();

  return users;
}

async function addUser(user) {
  try {
    user.password = await bcrypt.hash(user.password, 8);
    user.role = user.role || "regular";
    const connection = await getConnection();

    if (user.email === "admin@gmail.com") {
      user.role = "admin";
    }
    const result = await connection
      .db("sample_mflix")
      .collection("users")
      .insertOne(user);

    return result;
  } catch (error) {
    if (error.code === 11000) {
      throw new Error("El correo electrónico ya está registrado");
    } else {
      throw new Error("Error al registrar el usuario");
    }
  }
}

async function findByCredentials(email, password) {
  const connection = await getConnection();

  const user = await connection
    .db("sample_mflix")
    .collection("users")
    .findOne({ email: email });

  return user;
}

function generateAuthToken(user) {
  // si quitamos la exiracion tenemos que usar el token en cada operacion.
  const token = Jwt.sign(
    { _id: user._id, email: user.email, username: user.username },
    CLAVE_JWT,
    {
      expiresIn: "1h",
    }
  );
  return token;
}

async function updateUser(id, name) {
  try {
    const connection = await getConnection();

    const result = await connection
      .db("sample_mflix")
      .collection("users")
      .updateOne({ _id: new ObjectId(id) }, { $set: { name: name } });

    return result;
  } catch (error) {
    return "Update failed: " + error.message;
  }
}

async function destroy(user) {
  const connection = await getConnection();
  const result = await connection
    .db("sample_mflix")
    .collection("users")
    .deleteOne(user);
  console.log(result);
  return result;
}
export default {
  User,
  getUsers,
  addUser,
  findByCredentials,
  generateAuthToken,
  updateUser,
  destroy,
};

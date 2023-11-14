import { getConnection } from "./conn.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

dotenv.config();
const CLAVE_JWT = process.env.CLAVE_JWT;

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
  console.log("del data", user);
  user.password = await bcrypt.hash(user.password, 8);
  const connection = await getConnection();
  console.log("despues de la conexion", user);
  const result = await connection
    .db("sample_mflix")
    .collection("users")
    .insertOne(user);
  console.log(result);

  if (result.acknowledged == true) {
    return true;
  }

  return result;
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
  getUsers,
  addUser,
  findByCredentials,
  generateAuthToken,
  updateUser,
  destroy,
};

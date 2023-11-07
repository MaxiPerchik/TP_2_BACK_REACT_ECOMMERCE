import { getConnection } from "./conn.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

dotenv.config();
const CLAVE_SECRETA = process.env.CLAVE_SECRETA;

async function getUsers() {
  const connectiondb = await getConnection();
  const users = await connectiondb.db("sample_mflix").collection("users").find().toArray();

  return users;
}

async function addUser(user) {
  user.password = await bcrypt.hash(user.password, 8);
  const connection = await getConnection();
  const result = await connection.db("sample_mflix").collection("users").insertOne(user);
  return result;
}

async function findByCredentials(email, password) {
  const connection = await getConnection();

  const user = await connection.db("sample_mflix").collection("users").findOne({ email: email });

  return user;
}

function generateAuthToken(user) {
  const token = Jwt.sign(
    { _id: user._id, email: user.email, username: user.username },
    'CLAVE_SECRETA',
    { expiresIn: "1h" }
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

    console.log(result);
    if (result.modifiedCount === 1) {
      return { message: "User updated successfully" };
    } else {
      return { message: "User not found or no changes made" };
    }
  } catch (error) {
    return { message: "Update failed", error: error.message };
  }
}

export default { getUsers, addUser, findByCredentials, generateAuthToken, updateUser };

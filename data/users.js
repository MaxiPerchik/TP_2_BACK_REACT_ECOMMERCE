import { getConnection } from "./conn.js";

import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";

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

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Password no corresponde a usuario");
  }
  return user;
}

export default { getUsers, addUser, findByCredentials };

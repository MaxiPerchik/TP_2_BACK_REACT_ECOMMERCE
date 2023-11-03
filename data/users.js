import { getConnection } from "./conn.js";

import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";

async function getUsers() {
  console.log("getusers");
  const connectiondb = await getConnection();
  const users = await connectiondb
    .db("sample_mflix")
    .collection("users")
    .find()
    .toArray();

  return users;
}

export { getUsers };

import { getConnection } from "./conn.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

const database = "sample_mflix";
const collection = "productos";

dotenv.config();
const CLAVE_JWT = process.env.CLAVE_JWT;

async function getProductosByName(name) {
  const connectiondb = await getConnection();
  const products = await connectiondb
    .db(database)
    .collection(collection)
    .find({ name: name })
    .toArray();
  return products;
}

async function getAllProducts() {
  const connectiondb = await getConnection();
  const products = await connectiondb.db(database).collection(collection).find().toArray();
  return products;
}

async function updatePrice(idProducto, valor) {
  try {
    const connectiondb = await getConnection();
    const result = await connectiondb
      .db(database)
      .collection(collection)
      .updateOne({ _id: new ObjectId(idProducto) }, { $set: { price: valor } });
  } catch (error) {
    return "update failed " + error.message;
  }
  return result;
}

async function addProducts(products) {
  try {
    const connectiondb = await getConnection();
    const result = await connectiondb.db(database).collection(collection).insertMany(products);
    return result;
  } catch (error) {
    return "insertion failed: " + error.message;
  }
}
export default { getProductosByName, getAllProducts, updatePrice, addProducts };

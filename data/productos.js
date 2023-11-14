import { getConnection } from "./conn.js";
const { ObjectId } = require('mongodb');
const database = "sample_mflix";
const collection = "productos";

async function GetProductosByName(name){
    const connectiondb = await getConnection();
    const products = await connectiondb.db(database).collection(collection).find({nombre: name}).toArray();
    return products;
}

async function GetAllProducts(){
    const connectiondb = await getConnection();
    const products = await connectiondb.db(database).collection(collection).find().toArray();
    return products
}

async function updatePrice(idProducto,valor){
    const connectiondb = await getConnection();
    const result = await connectiondb.db(database).collection(collection).updateOne({_id:new ObjectId(idProducto)},{$set: {'precio': valor}});
    return result;
}

export {GetProductosByName,GetAllProducts,updatePrice}
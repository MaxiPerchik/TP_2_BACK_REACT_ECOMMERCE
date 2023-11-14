import { Router } from "express";
const router = Router();
import { GetProductosByKeyword, getAllProducts } from "../controllers/productos.js";

router.get("/",async function (req,res){
    res.json(await getAllProducts());
});

router.get("/searchNombre/:nombre", async function (req, res) {
    console.log("buscando");
    res.json(await GetProductosPorNombre(req.params.nombre));
});

router.post("/createProduct/:nombre-", async function (req, res) {
    res.json(await GetProductosByKeyword(req.params.keyword));
});

  export default router;
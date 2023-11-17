import { Router } from "express";
const router = Router();
import productosController from "../controllers/productos.js";

router.get("/", async function (req, res) {
  res.json(await productosController.getAllProducts());
});

router.get("/searchNombre/:nombre", async function (req, res) {
  console.log("buscando");
  res.json(await productosController.GetProductosPorNombre(req.params.nombre));
});

router.put("/update/:_id", async function (req, res) {
    console.log(req.params._id)
  try {
    const _id = req.params._id;
    const price = req.body.price;
    res.json(await productosController.updatePrecio(_id, price));
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
});

// router.post("/createProduct/:nombre-", async function (req, res) {
//   res.json(await GetProductosByKeyword(req.params.keyword));
// });

router.post("/addProducts", async function (req, res) {
  try {
    const result = await productosController.addProducts(req.body.products);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
});
export default router;

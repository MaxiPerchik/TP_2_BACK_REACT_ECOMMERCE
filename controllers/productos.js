import productos from "../data/productos.js";

async function GetProductosPorNombre(nombre) {
  return productos.getProductosByName(nombre);
}
async function getAllProducts() {
  return productos.getAllProducts();
}

async function updatePrecio(id, valor) {
  return productos.updatePrice(id, valor);
}

async function addProducts(products) {
  return productos.addProducts(products);
}
export default { GetProductosPorNombre, getAllProducts, updatePrecio, addProducts };

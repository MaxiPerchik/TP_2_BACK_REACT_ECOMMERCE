import { GetAllProducts } from "../data/productos";
import { updatePrice} from "../data/productos";

async function GetProductosPorNombre(nombre){
    return GetProductosByName(nombre);
}
async function getAllProducts(){
    return GetAllProducts();
}
async function updatePrecio(id,valor){
    return updatePrice(id,valor);
}


export {GetProductosPorNombre,getAllProducts,updatePrecio}
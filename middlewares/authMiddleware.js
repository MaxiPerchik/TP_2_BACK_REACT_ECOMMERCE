import Jwt from "jsonwebtoken";
const CLAVE_JWT = process.env.CLAVE_JWT;

const authMiddleware = (req, res, next) => {
    // Obtener el token del encabezado de autorización
    const token = req.header('Authorization');
  
    // Verificar si hay un token
    if (!token) {
      return res.status(401).json({ error: 'Acceso no autorizado. Usuario no se encuentra Logeado.' });
    }
  
    try {
      // Manejar el caso en que se incluye la palabra "Bearer"
      const tokenWithoutBearer = token.replace('Bearer ', '');
  
      // Verificar el token
      const decoded = Jwt.verify(tokenWithoutBearer, CLAVE_JWT);
  
      // Agregar el usuario al objeto de solicitud
      req.user = decoded.user;
  
      // Pasar al siguiente middleware o ruta
      next();
    } catch (error) {
      res.status(401).json({ error: 'Token no válido' });
    }
  };
  
  
  
export default authMiddleware;

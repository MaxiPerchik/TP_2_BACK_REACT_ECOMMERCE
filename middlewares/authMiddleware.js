import Jwt from "jsonwebtoken";
const CLAVE_JWT = process.env.CLAVE_JWT;

const authMiddleware = (req, res, next) => {
  try {
    // Obtener el token del encabezado de autorización
    const token = req.header("Authorization");

    console.log("Token:", token);

    // Verificar si hay un token
    if (!token) {
      return res.status(401).json({
        error: "Acceso no autorizado. Usuario no se encuentra Logeado.",
      });
    }

    // Manejar el caso en que se incluye la palabra "Bearer"
    const tokenWithoutBearer = token.replace("Bearer ", "");

    // Verificar el token
    const decoded = Jwt.verify(tokenWithoutBearer, CLAVE_JWT);

    console.log("Decoded Token:", decoded);

    // Agregar el usuario al objeto de solicitud
    req.user = decoded.user;

    console.log("User:", req.user);

    // Verificar el rol del usuario
    if (req.user.role !== "admin") {
      return res.status(403).json({
        error: "Acceso no autorizado. Se requiere rol de administrador.",
      });
    }

    // Pasar al siguiente middleware o ruta
    next();
  } catch (error) {
    console.error(error); // Loguear el error para propósitos de depuración

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expirado" });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Token no válido" });
    } else {
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }
};

export default authMiddleware;

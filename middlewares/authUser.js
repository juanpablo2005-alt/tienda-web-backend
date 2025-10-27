// middlewares/authMiddleware.js
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const verifyUserToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Token no proporcionado" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: "Usuario no encontrado" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Error en verifyUserToken:", error);
        res.status(401).json({ message: "Token inválido o expirado" });
    }
};

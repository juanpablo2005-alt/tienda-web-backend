import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Admin } from "../models/Admin.js";
import { Order } from "../models/Order.js";
import { User } from "../models/User.js";

export const loginAdmin = async (req, res) => {
    const { username, password } = req.body;
    try {
        const admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(401).json({ message: "Credenciales incorrectas" });
        }

        const match = await bcrypt.compare(password, admin.password);

        if (!match) {
            return res.status(401).json({ message: "Credenciales incorrectas" });
        }

        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });

        res.json({ message: "Inicio de sesión exitoso", token });
    } catch (error) {
        console.error("Error en loginAdmin:", error);
        res.status(500).json({ message: "Error del servidor" });
    }
};


export const getDashboardData = async (req, res) => {
    try {
        // Total general de ventas
        const totalVentas = await Order.aggregate([
            { $group: { _id: null, total: { $sum: "$total" } } }
        ]);

        // Ventas agrupadas por usuario
        const ventasPorUsuario = await Order.aggregate([
            { $group: { _id: "$userId", total: { $sum: "$total" } } }
        ]);

        // Obtener info de los usuarios
        const usuarios = await User.find(
            { _id: { $in: ventasPorUsuario.map(v => v._id) } },
            { _id: 1, name: 1, email: 1 } // solo traemos lo necesario
        );

        // Mezclamos ventas con datos del usuario
        const ventasConUsuarios = ventasPorUsuario.map(v => {
            const user = usuarios.find(u => u._id.toString() === v._id.toString());
            return {
                userId: v._id,
                nombre: user?.name || "Usuario desconocido",
                email: user?.email || "Sin correo",
                total: v.total,
            };
        });

        res.json({
            totalVentas: totalVentas[0]?.total || 0,
            ventasPorUsuario: ventasConUsuarios
        });
    } catch (error) {
        console.error("Error al obtener datos del dashboard:", error);
        res.status(500).json({ message: "Error al obtener datos del dashboard", error });
    }
};


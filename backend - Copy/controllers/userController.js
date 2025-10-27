import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";

export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ message: "El usuario ya existe" });

        const user = new User({ name, email, password });
        await user.save();
        res.status(201).json({ message: "Usuario registrado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al registrar usuario", error });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ message: "Credenciales incorrectas" });

        const token = jwt.sign({ id: user._id, role: "user" }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.json({ message: "Inicio de sesión exitoso", token });
    } catch (error) {
        res.status(500).json({ message: "Error en el inicio de sesión", error });
    }
};

export const payForProducts = async (req, res) => {
    try {
        const userId = req.user._id;
        const { products, total } = req.body;

        if (!products || products.length === 0) {
            return res.status(400).json({ message: "No se enviaron productos" });
        }

        // Verifica que los productos existan
        const existingProducts = await Product.find({ _id: { $in: products } });
        if (existingProducts.length !== products.length) {
            return res.status(400).json({ message: "Uno o más productos no existen" });
        }

        const order = new Order({
            userId,
            products,
            total,
        });

        await order.save();

        res.status(201).json({ message: "Pago registrado exitosamente", order });
    } catch (error) {
        console.error("Error en payForProducts:", error);
        res.status(500).json({ message: "Error al procesar el pago" });
    }
};
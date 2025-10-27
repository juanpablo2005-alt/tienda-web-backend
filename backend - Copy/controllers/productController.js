import { Product } from "../models/Product.js";

export const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener productos", error });
    }
};

export const getAvailableProducts = async (req, res) => {
    try {
        const products = await Product.find({ available: true });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener productos disponibles", error });
    }
};


export const createProduct = async (req, res) => {
    try {
        const { name, price, available } = req.body;
        const product = new Product({ name, price, available });
        await product.save();
        res.status(201).json({ message: "Producto creado", product });
    } catch (error) {
        res.status(500).json({ message: "Error al crear producto", error });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!product) return res.status(404).json({ message: "Producto no encontrado" });
        res.json({ message: "Producto actualizado", product });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar producto", error });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        res.json({ message: "Producto eliminado correctamente", product });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar producto", error });
    }
};


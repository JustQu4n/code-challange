import { Request, Response } from "express";
import { Product } from "../models/product";
import { Op } from "sequelize";
import fs from "fs";
import path from "path";

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, price, category, stock } = req.body;
    // if multer saved a file, it will be available as req.file
    const file = (req as any).file;

    // validate required fields
    if (!name || !description || price === undefined || !category) {
      res.status(400).json({ 
        error: "Missing required fields: name, description, price, category" 
      });
      return;
    }

    const product = await Product.create({
      name,
      description,
      price,
      category,
      stock: stock || 0,
      image: file ? file.filename : null
    });

    res.status(201).json({
      message: "Product created successfully",
      data: product
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, minPrice, maxPrice, search, page = 1, limit = 10 } = req.query;

    const where: any = {};

    // filter by category if provided
    if (category) {
      where.category = category;
    }

    // price range filter
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = parseFloat(minPrice as string);
      if (maxPrice) where.price[Op.lte] = parseFloat(maxPrice as string);
    }

    // search in name or description
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const offset = (Number(page) - 1) * Number(limit);

    const { count, rows } = await Product.findAndCountAll({
      where,
      limit: Number(limit),
      offset,
      order: [["createdAt", "DESC"]]
    });

    // attach image URLs
    const host = `${req.protocol}://${req.get("host")}`;
    const data = rows.map(r => {
      const p = (r as any).toJSON();
      p.imageUrl = p.image ? `${host}/uploads/${p.image}` : null;
      return p;
    });

    res.status(200).json({
      message: "Products retrieved successfully",
      data,
      pagination: {
        total: count,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(count / Number(limit))
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);

    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    const host = `${req.protocol}://${req.get("host")}`;
    const p = (product as any).toJSON();
    p.imageUrl = p.image ? `${host}/uploads/${p.image}` : null;

    res.status(200).json({
      message: "Product retrieved successfully",
      data: p
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, price, category, stock } = req.body;
    const file = (req as any).file;

    const product = await Product.findByPk(id);

    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    // only update fields that are provided
    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (category !== undefined) product.category = category;
    if (stock !== undefined) product.stock = stock;

    // handle image replacement
    if (file) {
      // delete old file if exists
      if (product.image) {
        const oldPath = path.join(process.cwd(), "uploads", product.image);
        try { fs.unlinkSync(oldPath); } catch {}
      }
      product.image = file.filename;
    }

    await product.save();

    res.status(200).json({
      message: "Product updated successfully",
      data: product
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);

    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    // remove file if present
    if ((product as any).image) {
      const img = (product as any).image;
      const p = path.join(process.cwd(), "uploads", img);
      try { fs.unlinkSync(p); } catch {}
    }

    await product.destroy();

    res.status(200).json({
      message: "Product deleted successfully",
      data: { id }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

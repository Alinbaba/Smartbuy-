// ======================================================
// SmartBuy Category Controller
// ======================================================

const Category = require("../models/Category");


// ======================================================
// Create Category
// ======================================================

exports.createCategory = async (req, res) => {

    try {

        const category = await Category.create(req.body);

        return res.status(201).json({

            success: true,

            message: "Category created successfully.",

            category

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ======================================================
// Get All Categories
// ======================================================

exports.getAllCategories = async (req, res) => {

    try {

        const categories = await Category.find()
            .populate("parentCategory", "name slug")
            .populate("createdBy", "name email")
            .populate("updatedBy", "name email")
            .sort({ displayOrder: 1, name: 1 });

        return res.status(200).json({

            success: true,

            total: categories.length,

            categories

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ======================================================
// Get Single Category
// ======================================================

exports.getCategoryById = async (req, res) => {

    try {

        const category = await Category.findById(req.params.id)
            .populate("parentCategory", "name slug")
            .populate("createdBy", "name email")
            .populate("updatedBy", "name email");

        if (!category) {

            return res.status(404).json({

                success: false,

                message: "Category not found."

            });

        }

        return res.status(200).json({

            success: true,

            category

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ======================================================
// Update Category
// ======================================================

exports.updateCategory = async (req, res) => {

    try {

        const category = await Category.findById(req.params.id);

        if (!category) {

            return res.status(404).json({

                success: false,

                message: "Category not found."

            });

        }

        Object.assign(category, req.body);

        if (req.user) {

            category.updatedBy = req.user.id;

        }

        await category.save();

        return res.status(200).json({

            success: true,

            message: "Category updated successfully.",

            category

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ======================================================
// Delete Category
// ======================================================

exports.deleteCategory = async (req, res) => {

    try {

        const category = await Category.findById(req.params.id);

        if (!category) {

            return res.status(404).json({

                success: false,

                message: "Category not found."

            });

        }

        await category.deleteOne();

        return res.status(200).json({

            success: true,

            message: "Category deleted successfully."

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
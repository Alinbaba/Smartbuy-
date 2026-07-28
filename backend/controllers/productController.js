const Product = require("../models/Product");
const slugify = require("slugify");

// ==========================
// Get Products (Search + Filter + Pagination)
// ==========================

exports.getProducts = async (req, res) => {

    try {

        const page = Number(req.query.page) || 1;

        const limit = Number(req.query.limit) || 12;

        const skip = (page - 1) * limit;

        const filter = {
          status: "approved"
        };

        if (req.query.category) {

            filter.category = req.query.category;

        }

        if (req.query.brand) {

            filter.brand = req.query.brand;

        }

        if (req.query.featured) {

            filter.featured = req.query.featured === "true";

        }

        if (req.query.search) {

            filter.name = {

                $regex: req.query.search,

                $options: "i"

            };

        }

        const products = await Product.find(filter)

            .skip(skip)

            .limit(limit);

        const totalProducts = await Product.countDocuments(filter);

        res.status(200).json({

            success: true,

            currentPage: page,

            totalPages: Math.ceil(totalProducts / limit),

            totalProducts,

            products

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ==========================
// Create Product
// ==========================

exports.createProduct = async (req, res) => {

    try {
      
      if (!req.body.name) {

    return res.status(400).json({

        success: false,

        message: "Product name is required."

    });

}

if (!req.body.price) {

    return res.status(400).json({

        success: false,

        message: "Product price is required."

    });

}
        
        const existingProduct = await Product.findOne({

    slug: slugify(req.body.name, {

        lower: true,

        strict: true

    })

});

if (existingProduct) {

    return res.status(400).json({

        success: false,

        message: "A product with this name already exists."

    });

}
        
        const productData = {

    ...req.body,

    seller: req.user.id,

    slug: slugify(req.body.name, {

        lower: true,

        strict: true

    }),

    status: "pending",

    images: req.body.images || [],

    thumbnail:

        req.body.images && req.body.images.length > 0

            ? req.body.images[0]

            : ""

};

const product = await Product.create(productData);

        res.status(201).json({

            success: true,

            product

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ==========================
// Get Single Product
// ==========================

exports.getSingleProduct = async (req, res) => {

    try {

        const product = await Product.findById(req.params.id);

        if (!product) {

            return res.status(404).json({

                success: false,

                message: "Product not found."

            });

        }

        // Increase view count

        product.views += 1;

        await product.save();

        res.status(200).json({

            success: true,

            product

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ==========================
// Update Product
// ==========================

exports.updateProduct = async (req, res) => {

    try {

        const product = await Product.findById(req.params.id);

        if (!product) {

            return res.status(404).json({

                success: false,

                message: "Product not found."

            });

        }

// Seller can only edit their own product

        if (

            req.user.role === "Seller" &&

            product.seller.toString() !== req.user.id

        ) {

            return res.status(403).json({

                success: false,

                message: "You are not allowed to edit this product."

            });

        }

        Object.assign(product, req.body);

        await product.save();

        const relatedProducts = await Product.find({

    category: product.category,

    _id: { $ne: product._id },

    status: "approved"

}).limit(8);

res.status(200).json({

    success: true,

    product,

    relatedProducts

});
    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ==========================
// Delete Product
// ==========================

exports.deleteProduct = async (req, res) => {

    try {

        const product = await Product.findById(req.params.id);

        if (!product) {

            return res.status(404).json({

                success: false,

                message: "Product not found."

            });

        }

// Seller can only delete their own product

        if (

            req.user.role === "Seller" &&

            product.seller.toString() !== req.user.id

        ) {

            return res.status(403).json({

                success: false,

                message: "You are not allowed to delete this product."

            });

        }

        await product.deleteOne();

        res.status(200).json({

            success: true,

            message: "Product deleted successfully."

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ==========================
// Approve Product
// ==========================

exports.approveProduct = async (req, res) => {

    try {

        const product = await Product.findById(req.params.id);

        if (!product) {

            return res.status(404).json({

                success: false,

                message: "Product not found."

            });

        }

        product.status = "approved";
        product.approvedBy = req.user.id;
        product.approvedAt = new Date();
        product.rejectionReason = "";

        await product.save();

        res.status(200).json({

            success: true,

            message: "Product approved successfully.",

            product

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ==========================
// Reject Product
// ==========================

exports.rejectProduct = async (req, res) => {

    try {

        const product = await Product.findById(req.params.id);

        if (!product) {

            return res.status(404).json({

                success: false,

                message: "Product not found."

            });

        }

        product.status = "rejected";
        product.rejectionReason = req.body.reason || "No reason provided.";

        await product.save();

        res.status(200).json({

            success: true,

            message: "Product rejected.",

            product

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ======================================================
// SmartBuy Enterprise Admin Middleware
// ======================================================

const adminRoles = [

    "super-admin",
    "admin",
    "finance-admin",
    "customer-care",
    "logistics-admin",
    "advertising-admin",
    "security-admin",
    "ai-admin",
    "vendor-manager"

];

// ======================================================
// Check Admin Permission
// ======================================================

exports.adminOnly = (req, res, next) => {

    try {

        // Check if user exists
        if (!req.user) {

            return res.status(401).json({

                success: false,
                message: "Authentication required."

            });

        }

        // Check role
        if (!adminRoles.includes(req.user.role)) {

            return res.status(403).json({

                success: false,
                message: "Access denied. Admin privileges required."

            });

        }

        next();

    } catch (error) {

        return res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

// ======================================================
// Role-Based Permission Middleware
// ======================================================

exports.allowRoles = (...roles) => {

    return (req, res, next) => {

        try {

            if (!req.user) {

                return res.status(401).json({

                    success: false,
                    message: "Authentication required."

                });

            }

            if (!roles.includes(req.user.role)) {

                return res.status(403).json({

                    success: false,
                    message: "You are not authorized to perform this action."

                });

            }

            next();

        } catch (error) {

            return res.status(500).json({

                success: false,
                message: error.message

            });

        }

    };

};

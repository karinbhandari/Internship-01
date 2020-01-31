const express = require("express")
const router = express.Router()

const checkAuth = require("../middlewares/check-auth")
const ProductsController = require("../controllers/products")

const multer = require("multer")

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "upload/")
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if(file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg"){
        cb(null, true)
    }else{
        cb(new Error("File extension is not allowed!"), false)
    }
}

const upload = multer({
    storage, 
    limits: {
        fileSize: 1024 * 1024,
        files: 1
    },
    fileFilter
})

// Get all
router.get("/", ProductsController.get_all_products)

// Get a specific
router.get('/:productId', ProductsController.get_a_product)

// Handling incomming POST request to products
router.post('/', checkAuth, upload.single("productImage"),  ProductsController.post_a_product)

// Update
router.patch("/:productId", checkAuth, ProductsController.update_a_product)

// Delete
router.delete("/:productId", checkAuth, ProductsController.delete_a_product)

module.exports = router
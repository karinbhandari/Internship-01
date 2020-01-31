const express = require("express")
const router = express.Router()
const checkAuth = require("../middlewares/check-auth")

const OrdersController = require("../controllers/orders")


// Handling incoming GET request to /orders
router.get("/", checkAuth, OrdersController.orders_get_all)

router.get("/:orderId", checkAuth, OrdersController.orders_get_a_order)

router.post("/", checkAuth, OrdersController.orders_create_a_order)

router.delete("/:orderId", checkAuth, OrdersController.orders_delete_a_order)

module.exports = router
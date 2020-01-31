const mongoose = require("mongoose")
const Order = require("../models/order")
const Product = require("../models/product")

exports.orders_get_all = (req, res, next)=>{
    Order
        .find()
        .select("_id product quantity")
        .populate("product", "name")
        .exec()
        .then(docs => {
            if(docs.length){
                res.status(200).json({
                    message: "Orders sucessfully fetched!",
                    count: docs.length,
                    orders: docs.map(doc=>({
                        doc,
                        request: {
                            type: "GET",
                            url: "http://localhost:3000/orders" + doc._id
                        }
                    }))
    
                })
                console.log("[*GET*] All orders were sent!")
            }else{
                res.status(404).json({
                    message: "No Orders found",
                    count: docs.length,
                    orders: doc
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                message: err.message
            })
            console.log("[*GET ERROR*] All orders couldn't be sent => " + err.message)
        })

}

exports.orders_get_a_order = (req, res, next)=>{

    const orderId = req.params.orderId

    Order
        .where({_id: orderId})
        .find()
        .exec()
        .then(doc=>{
            if(doc.length){
                res.status(200).json({
                    message: "Order Sucessfully fetched with the given id " + orderId + ".",
                    order: {
                        doc,
                        request: {
                            type: "GET",
                            url: "http://localhost:3000/orders/" + orderId
                        }    
                    }
                })
                console.log("Order sucessfully sent!")
            }else{
                res.status(404).json({
                    message: "No orders document found in the collection!",
                    count: doc.length,
                    request: {
                        type: "GET",
                        url: "http://localhost:3000/orders/" + orderId
                    }
                       
                })
                console.log("No Orders document found in the collection!")
            }
        })
        .catch(error=>{
            res.status(500).json({
                error: error.message,
                request: {
                    type: "GET",
                    url: "http://localhost:3000/orders/" + orderId
                }
            })
            console.log(error.message)
        })
}

exports.orders_create_a_order = (req, res, next)=>{

    Product
        .findById({_id: req.body.productId})
        // .exec()
        .then(doc => {
            if(doc){
                const order = new Order({
                    _id: new mongoose.Types.ObjectId(),
                    product: req.body.productId,
                    quantity: req.body.quantity
                })
                order.save()
                .then(result=>{
                    res.status(200).json({
                        message: "Order was sucessfully saved!",
                        savedOrder: {
                            _id: result._id,
                            product: result.product,
                            quantity: result.quantity
                        },
                        request: {
                            type: "POST",
                            url: "http://localhost:3000/orders/"
                        }
                    })
                    console.log("Order was successfully saved! ")
            
                })
                .catch(err=>{
                    res.status(500).json({
                        message: "Error while making order => " + err.message
                    })
                    console.log("Error while making order! => ", err.message)
                })               
            }else{
                res.status(404).json({
                    message: "No product with such key exist!",
                    key: req.body.productId,
                    require: {
                        type: "POST",
                        url: "http://localhost:3000/orders/"
                    }
                })
                console.log("No product with such keu exist")
            }
        })
        .catch(error=>{
            console.log(error.message)
            res.status(500).json({
                message: "No product with the provided id combination.",
                error: error.message
            })
        })

}

exports.orders_delete_a_order = (req, res, next)=>{
    
    const orderToDeleteId = req.params.orderId 

    Order
        .where({_id: orderToDeleteId})
        .deleteOne()
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Order sucessfully deleted!",
                request: {
                    type: "DELETE",
                    url: "http://localhost:3000/orders/" + orderToDeleteId
                }
            })
            console.log("Order sucessfully deleted!")
        })
        .catch(error => {
            res.status(500).json({
                message: error.message,
                request: {
                    type: "DELETE",
                    url: "http://localhost:3000/orders/" + orderToDeleteId
                }
            })
            console.log(error.message)
        })
}
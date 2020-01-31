const Product = require("../models/product")
const mongoose = require("mongoose")

exports.get_all_products = (req, res, next)=>{
    Product.find()
    .then(docs=>{
        if(docs.length){
            res.status(200).json({
                message: "Products sucessfully fetched!",
                count: docs.length,
                data: docs.map((doc)=>({
                    "_id": doc._id,
                    "name": doc.name,
                    "price": doc.price,
                    productImage: doc.productImage,
                    "request": {
                        type: "GET",
                        url: "http://localhost:3000/products/" + doc._id
                    } 
                }))
            })
            console.log("Available documents sucessfully sent to products GET request!")
        }
        else{
            res.status(404).json({
                message: "No products in the collection!",
                data: docs
            })
            console.log("No products in the collection!")
        }
    })
    .catch(err=>{
        res.status(500).json({
            message: err.message
        })
        console.log("Error while fetching products => ", err.message)
    })
}

exports.get_a_product = (req, res, next)=>{

    console.log(req.file)

    const productIdToFind = req.params.productId

    Product.findById(productIdToFind)
    .select("_id name price productImage")
    .exec()
    .then(docs => {
        if(docs){
            res.status(200).json({
                message: "Products with the given id was successfully found!",
                productFound: docs,
                request: {
                    type: "GET",
                    url: "http://localhost:3000/product/" + productIdToFind 
                }

            })
            console.log(`[*SUCCESS*] Products with given id was sucessfully sent!`)
        }else{
            res.status(404).json({
                message: "No products were found with the provided id",
                data: docs 
            })
            console.log(`[*SUCCESS*] Products with given id was sucessfully sent!`)
        }
    })
    .catch(err=>{
        res.status(500).json({
            message: err.message
        })
        console.log(`[*ERROR*] Error while getting the product id.`)
    })
    
}

exports.post_a_product = (req, res, next)=>{

    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    })

    product.save()
    .then(result=>{
        res.status(201).json({
            message:`Product was sucessfully saved!`,
            createdProduct: {
                name: req.body.name,
                price: req.body.price
            },
            request: {
                type: "POST",
                url: "http://localhost:3000/products/" + result._id
            }
        })
        console.log(`[*SUCCESS*] Product was sucessfully saved!`)
    })
    .catch(err => {
        res.status(500).json({
            error: err.message
        })
        console.log(`[*ERROR*] Error while saving products => ${err.message}`)
    })
}

exports.update_a_product = (req, res, next)=>{
    
    const idToUpdate = req.params.productId

    Product.update({_id: idToUpdate},{ $set: req.body })
    .exec()
    .then(result=>{
        res.status(200).json({
            message: "Product Sucessfully Update",
            request: {
                type: "PATCH",
                url: "http://localhost:3000/" + idToUpdate
            }
        })
        console.log("Updated sucessfully!")
    })
    .catch(err=>{
        res.status(500).json({
            message: `Failed to update the product with given id : ${idToUpdate}`
        })
        console.log("Failed to update products => ", err.message)
    })
}

exports.delete_a_product = (req, res, next)=>{
    const idToDelete = req.params.productId
    Product.remove({_id: idToDelete})
    .exec()
    .then(doc=>{
        res.status(200).json({
            message: "Products deleted sucessfully",
            request: {
                type: "DELETE",
                url: "http://localhost:3000/products/" + idToDelete
            }            
        })
        console.log("Product was deleted sucessfully!")
    })
    .catch(err=>{
        res.status(500).json({
            message: err.message
        })
        console.log(`Error while deleting a product with given id => ${idToDelete}`, err.message)
    })
}
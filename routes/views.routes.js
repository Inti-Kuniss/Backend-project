const express = require('express');
const router = express.Router();
const { productManager } = require('../persistance/index');

router.get("/", async(req,res)=>{
    const products = await productManager.getProducts();
    console.log("products", products);
    res.render("home",{products:products});
});

router.get("/realtimeproducts", (req,res)=>{
    res.render("realTime");
});

module.exports = router;
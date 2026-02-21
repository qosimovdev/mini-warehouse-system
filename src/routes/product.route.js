const router = require("express").Router()
const prodController = require("../controllers/product.controller")

router.post("/", prodController.createProduct)
router.get("/", prodController.getProducts)
router.patch("/:id", prodController.updateProduct)
router.delete("/:id", prodController.deleteProduct)

module.exports = router
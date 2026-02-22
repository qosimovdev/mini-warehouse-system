const router = require("express").Router()
const prodController = require("../controllers/product.controller")
const protect = require("../middlewares/auth.middleware")
const roleGuard = require("../middlewares/role.middleware")

router.use(protect)
// router.use(roleGuard("ADMIN"))

router.post("/", prodController.createProduct)
router.get("/", prodController.getProducts)
router.patch("/:id", prodController.updateProduct)
router.delete("/:id", prodController.deleteProduct)

module.exports = router
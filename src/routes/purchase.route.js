const router = require("express").Router()
const purchaseController = require("../controllers/purchase.controller")
const protect = require("../middlewares/auth.middleware")

router.post("/", purchaseController.createPurchase)
router.get("/", purchaseController.getPurchases)
router.patch("/:id", purchaseController.updatePurchase)
router.delete("/:id", purchaseController.deletePurchase)

module.exports = router
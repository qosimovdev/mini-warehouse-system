const router = require("express").Router()
const purchaseController = require("../controllers/purchase.controller")
const protect = require("../middlewares/auth.middleware")
const roleGuard = require("../middlewares/role.middleware")

router.use(protect)
router.use(roleGuard("ADMIN"))

router.post("/", purchaseController.createPurchase)
router.get("/", purchaseController.getPurchases)
router.patch("/:id", purchaseController.updatePurchase)
router.delete("/:id", purchaseController.deletePurchase)

module.exports = router
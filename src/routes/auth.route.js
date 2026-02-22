const router = require("express").Router()
const authController = require("../controllers/auth.controller")
const roleGuard = require("../middlewares/role.middleware")

router.post("/login", authController.login)
router.post("/refresh-token", authController.refresh)

module.exports = router
const router = require("express").Router()
const companyController = require("../controllers/company.controller")
const protect = require("../middlewares/auth.middleware")
const roleGuard = require("../middlewares/role.middleware")

router.post("/", protect, roleGuard("ADMIN"), companyController.createCompany)
router.get("/", protect, companyController.getCompanies)
router.patch("/:id", protect, roleGuard("ADMIN"), companyController.updateCompany)
router.delete("/:id", protect, roleGuard("ADMIN"), companyController.deleteCompany)

module.exports = router
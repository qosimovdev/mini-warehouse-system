const router = require("express").Router()
const companyController = require("../controllers/company.controller")

router.post("/", companyController.createCompany)
router.get("/", companyController.getCompanies)
router.patch("/:id", companyController.updateCompany)
router.delete("/:id", companyController.deleteCompany)

module.exports = router
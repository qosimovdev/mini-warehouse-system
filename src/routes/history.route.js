const router = require("express").Router();
const historyController = require("../controllers/history.controller");
const protect = require("../middlewares/auth.middleware");
const roleGuard = require("../middlewares/role.middleware");

router.use(protect);
// router.use(roleGuard("ADMIN"));

router.get("/", historyController.getHistory);

module.exports = router;
const router = require("express").Router();
const historyController = require("../controllers/history.controller");
const protect = require("../middlewares/auth.middleware");

router.get("/", historyController.getHistory);

module.exports = router;
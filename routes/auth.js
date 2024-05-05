const express = require("express");
const router = express.Router();
const { registerUsers, signIn } = require("../controllers/auth");
const verifyAuthorit = require("../middlewares/verifyAuth");

router.post("/signup", registerUsers);
router.post("/signin", signIn);

module.exports = router;
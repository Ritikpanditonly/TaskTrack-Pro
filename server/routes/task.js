const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

// ✅ All routes below are protected
router.use(auth);

router.get("/", (req, res) => {
  res.send("This route is protected!");
});

module.exports = router;

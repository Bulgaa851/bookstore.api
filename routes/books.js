const express = require("express");
const router = express.Router({ mergeParams: true });

//Routers
const {
  getbooks,
  getbook,
  createbook,
  updatebook,
  deletebook,
} = require("../controller/bookController");

//Controller Router 2-ыг холбох "

router.route("/").get(getbooks).post(createbook);
router.route("/:id").get(getbook).put(updatebook).delete(deletebook);
module.exports = router;

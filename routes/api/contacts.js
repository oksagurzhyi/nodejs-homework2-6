const express = require("express");

const router = express.Router();

const ctrl = require("../../controlllers/contactController");

// const mdlw = require("../../middlewares");

router.get("/", ctrl.getAll);

// router.route("/").get(ctrl.getAll).post(mdlw.isContactDataValid, ctrl.add);

// router.route("/:id").get(ctrl.getById).delete(ctrl.remove).patch(ctrl.update);

module.exports = router;

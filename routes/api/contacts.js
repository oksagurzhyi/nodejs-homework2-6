const express = require("express");
const router = express.Router();
const ctrl = require("../../controlllers/contactController");
const mdlw = require("../../middlewares");
const { updateFavoriteSchema } = require("../../models/contacts.model");

router.route("/").get(ctrl.getAll).post(mdlw.isContactDataValid, ctrl.add);

router.route("/:id").get(ctrl.getById).delete(ctrl.remove).patch(ctrl.update);

router.patch(
  "/:id/favorite",
  mdlw.validateBody(updateFavoriteSchema),
  ctrl.updateStatusContact
);

module.exports = router;

const express = require("express");
const router = express.Router();
const ctrl = require("../../controlllers/contactController");
const { authMdlw, contactsMdlw } = require("../../middlewares");
const { updateFavoriteSchema } = require("../../models/contacts.model");

router.use(authMdlw.protect);

router
  .route("/")
  .get(ctrl.getAll)
  .post(contactsMdlw.isContactDataValid, ctrl.add);

router.route("/:id").get(ctrl.getById).delete(ctrl.remove).patch(ctrl.update);

router.patch(
  "/:id/favorite",
  contactsMdlw.validateBody(updateFavoriteSchema),
  ctrl.updateStatusContact
);

module.exports = router;

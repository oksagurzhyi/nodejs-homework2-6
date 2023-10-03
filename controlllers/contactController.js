const { HttpError, ctrlWrapper } = require("../helpers");
const { Contact } = require("../models/contacts.model");
const { createContact, getContactsList } = require("../service/contactService");

const getAll = async (req, res) => {
  const { contactsList, total } = await getContactsList(req.query, req.user);
  console.log("total", total);
  return res.status(200).json({
    message: "Success",
    contactsList,
    total,
    user: req.user,
  });
};

const getById = async (req, res, next) => {
  const { id } = req.params;
  const result = await Contact.findById(id);

  if (!result) {
    return next(HttpError(404, "Not found"));
  }
  return res.status(200).json(result);
};

const add = async (req, res, next) => {
  const result = await createContact(req.body, req.user.id);
  console.log(req.user);
  return res.status(201).json(result);
};

const update = async (req, res, next) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });

  if (!result) {
    return next(HttpError(400, "Missing fields"));
  }
  return res.status(201).json(result);
};

const remove = async (req, res, next) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndDelete(id);
  if (!result) {
    return next(HttpError(404, "Not found"));
  }
  return res.status(200).json({ message: "contact deleted" });
};

const updateStatusContact = async (req, res, next) => {
  const result = await Contact.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!result) {
    return next(HttpError(404, "Not found"));
  }
  return res.status(200).json(result);
};

module.exports = {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  add: ctrlWrapper(add),
  update: ctrlWrapper(update),
  remove: ctrlWrapper(remove),
  updateStatusContact: ctrlWrapper(updateStatusContact),
};

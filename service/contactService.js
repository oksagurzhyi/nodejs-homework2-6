const { Contact } = require("../models/contacts.model");

const createContact = async (newDataContact, owner) => {
  const newContact = await Contact.create({
    ...newDataContact,
    owner,
  });
  return newContact;
};

const getContactsList = async (filter, user) => {
  const findOptions = filter.favorite
    ? {
        $or: [
          {
            favorite:
              typeof filter.favorite === "boolean"
                ? { $regex: filter.favorite }
                : filter.favorite,
          },
        ],
      }
    : {};

  const paginationPage = filter.page ? +filter.page : 1;
  const paginationLimit = filter.limit ? +filter.limit : 10;
  const docsToSkip = (paginationPage - 1) * paginationLimit;

  const contactQuery = await Contact.find(findOptions, { owner: user.id })
    .populate({ path: "owner", select: "_id" })
    .skip(docsToSkip)
    .limit(paginationLimit);
  const contactsList = contactQuery;
  const total = await Contact.count(findOptions);

  return { contactsList, total };
};

module.exports = { createContact, getContactsList };

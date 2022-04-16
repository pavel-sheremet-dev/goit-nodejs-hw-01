const fs = require('fs').promises;
const path = require('path');
const { nanoid } = require('nanoid');
const errMsg = require('./messages/errors');

const contactsPath = path.resolve('./db/contacts.json');

const getContacts = async () => {
  try {
    const contacts = await fs.readFile(contactsPath, 'utf8');
    return JSON.parse(contacts);
  } catch (error) {
    throw error;
  }
};

const getContactById = async id => {
  try {
    const contacts = await getContacts();
    checkContactId(id, contacts);
    return contacts.filter(contact => contact.id === id)[0];
  } catch (error) {
    throw error;
  }
};

const removeContact = async id => {
  try {
    const contacts = await getContacts();
    checkContactId(id, contacts);

    const filteredContacts = contacts.filter(contact => contact.id !== id);
    const stringifiedContacts = JSON.stringify(filteredContacts);
    await fs.writeFile(contactsPath, stringifiedContacts);
  } catch (error) {
    throw error;
  }
};

const addContact = async (name, email, phone) => {
  if (!name || !email || !phone) {
    throw new Error(errMsg.emptyOption);
  }
  try {
    const contacts = await getContacts();
    const id = generateNewId(contacts);
    const newContacts = [
      ...contacts,
      { id, name, email, phone: String(phone) },
    ];

    await fs.writeFile(contactsPath, JSON.stringify(newContacts));
    return { name, email, phone: String(phone) };
  } catch (error) {
    throw error;
  }
};

const generateNewId = contacts => {
  let id = '';
  do {
    id = nanoid();
  } while (isIdInData(id, contacts));
  return id;
};

const isIdInData = (id, data) => data.some(item => item.id === id);

const checkContactId = (contactId, contacts) => {
  if (isIdInData(contactId, contacts)) return;
  if (!contactId) throw new Error(errMsg.emptyOption);
  throw new Error(errMsg.checkContact(contactId));
};

module.exports = { getContacts, getContactById, removeContact, addContact };

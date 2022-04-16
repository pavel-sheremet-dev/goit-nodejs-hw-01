const fs = require('fs').promises;
const path = require('path');
const { nanoid } = require('nanoid');

const errMsg = require('./messages/errors');
const contactsPath = path.resolve('./db/contacts.json');

const tryAsync = async (asyncFunction, ...args) => {
  try {
    return await asyncFunction(...args);
  } catch (error) {
    throw error;
  }
};

const getContacts = async () => {
  const contacts = await tryAsync(fs.readFile, contactsPath, 'utf8');
  return JSON.parse(contacts);
};

const getContactById = async id => {
  const contacts = await tryAsync(getContacts);
  checkContactId(id, contacts);
  return contacts.filter(contact => contact.id === id);
};

const removeContact = async contactId => {
  const contacts = await tryAsync(getContacts);
  checkContactId(id, contacts);
  const filteredContacts = contacts.filter(contact => contact.id !== contactId);
  const stringifiedContacts = JSON.stringify(filteredContacts);
  await tryAsync(fs.writeFile, contactsPath, stringifiedContacts);
  return contactId;
};

const addContact = async (name, email, phone) => {
  if (!name || !email || !phone) {
    throw new Error(errMsg.emptyOption);
  }
  const contacts = await tryAsync(getContacts);
  const id = generateNewId(contacts);
  const newContacts = [...contacts, { id, name, email, phone: String(phone) }];

  await tryAsync(fs.writeFile, contactsPath, JSON.stringify(newContacts));
  return { name, email, phone: String(phone) };
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

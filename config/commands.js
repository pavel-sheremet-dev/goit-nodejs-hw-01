module.exports = {
  list: {
    type: 'list',
    desc: 'Get all Contacts. Call this method without any arguments',
    resultMsg: 'Contacts:',
    helper: '',
  },
  get: {
    type: 'get',
    desc: 'Get contact by ID. You need pass ID',
    resultMsg: 'Find contact:',
    helper: 'contact id was not passed. Watch help',
  },
  add: {
    type: 'add',
    desc: 'Add new contact. You need pass 3 arguments: name, email, phone',
    resultMsg: 'Added contact:',
    helper: 'One of options (name, email, phone) was not passed. Watch help',
  },
  remove: {
    type: 'remove',
    desc: 'Remove contact from contacts list. You need pass ID of contact',
    resultMsg: 'Contact was removed. ID of removed contact:',
    helper: 'contact id was not passed. Watch help',
  },
};

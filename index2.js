const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const {
  getContacts,
  getContactById,
  removeContact,
  addContact,
} = require('./contacts2');
const { list, get, add, remove } = require('./config/commands');
const { id, name, email, phone } = require('./config/options');

const showResults = (title, result) => console.log(`\n${title}`, result);

const getResult = async (msg, asyncFunction, ...args) => {
  try {
    const data = await asyncFunction(...args);
    showResults(msg, data);
  } catch (error) {
    console.log(error.message);
  }
};

const isArgsPassed = (...args) => [...args].some(arg => arg === undefined);

yargs(hideBin(process.argv))
  .command(
    list.type,
    list.desc,
    yargs => yargs,
    async () => {
      await getResult(list.resultMsg, getContacts);
    },
  )
  .command(
    get.type,
    get.desc,
    yargs => {
      if (isArgsPassed(yargs.argv.id)) {
        console.log(get.helper);
        yargs.showHelp();
      }
      return yargs;
    },
    async ({ id }) => {
      await getResult(get.resultMsg, getContactById, id);
    },
  )
  .command(
    add.type,
    add.desc,
    yargs => {
      const { name, email, phone } = yargs.argv;
      if (isArgsPassed(name, email, phone)) {
        console.log(add.helper);
        yargs.showHelp();
      }
      return yargs;
    },
    async ({ name, email, phone }) => {
      await getResult(add.resultMsg, addContact, name, email, phone);
    },
  )
  .command(
    remove.type,
    remove.desc,
    yargs => {
      if (isArgsPassed(yargs.argv.id)) {
        console.log(remove.helper);
        yargs.showHelp();
      }
      return yargs;
    },
    async ({ id }) => {
      await getResult(remove.resultMsg, removeContact, id);
    },
  )
  .option(id.flag, {
    alias: id.alias,
    type: id.type,
    description: id.desc,
  })
  .option(name.flag, {
    alias: name.alias,
    type: name.type,
    description: name.desc,
  })
  .option(email.flag, {
    alias: email.alias,
    type: email.type,
    description: email.desc,
  })
  .option(phone.flag, {
    alias: phone.alias,
    type: phone.type,
    description: phone.desc,
  })
  .parse();

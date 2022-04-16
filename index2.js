const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const {
  getContacts,
  getContactById,
  removeContact,
  addContact,
} = require('./contacts2');
const { list, get, add, remove } = require('./commands/config');

const showResults = (title, result) => console.log(`\n${title}`, result);

const getResult = async (msg, asyncFunction, ...args) => {
  try {
    const data = await asyncFunction(...args);
    console.log(data);
    showResults(msg, data);
  } catch (error) {
    console.log(error.message);
  }
};

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
      if (yargs.argv.id === undefined) {
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
      if ([name, email, phone].some(item => item === undefined)) {
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
      if (yargs.argv.id === undefined) {
        console.log(remove.helper);
        yargs.showHelp();
      }
      return yargs;
    },
    async ({ id }) => {
      await getResult(remove.resultMsg, removeContact, id);
    },
  )
  .option('id', { alias: 'i', type: 'string', description: 'contact id' })
  .option('name', { alias: 'n', type: 'string', description: 'contact name' })
  .option('email', { alias: 'e', type: 'string', description: 'contact email' })
  .option('phone', { alias: 'p', type: 'string', description: 'contact phone' })
  .parse();

const commands = require('../commands/index');
const { createDisk, onlyInf } = require('../helpers');
const { logColored, log } = require('../logger');
const { save } = require('../secure/secure');
const { line } = require('./rl');

const cliLine = async (state) => {
  const answer = await line(state.file ? '' : `${state.currentDir}:$ `);
  const [command, ...params] = answer.split(' ');
  const commandFunc = commands[command];
  try {
    if (!commandFunc && !state.file) log(`Incorrect command "${command}"`);
    else if (state.file) {
      state.disk = onlyInf(createDisk(state.disk, state.currentDir, state.file, state.user, 'file', answer));
      save(state.disk);
      delete state.file;
    } else {
      await commandFunc(state, params);
    }
  } catch (e) {
    logColored(e.message, '\x1b[31m%s\x1b[0m');
  }
  await cliLine(state);
};

module.exports = {
  cliLine,
};

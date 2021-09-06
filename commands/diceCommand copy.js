const BotCommand = require("./botCommand.js")
class DiceCommand extends BotCommand {
  constructor({ client = {}, config = {} }) {
    super({ client: client, config: config });
  }
  execute({ target = "unkown" }) {
    const sides = 6;
    const num = Math.floor(Math.random() * sides) + 1;
    this.client.say(target, `You rolled a ${num}`);
  }
}
module.exports = DiceCommand;

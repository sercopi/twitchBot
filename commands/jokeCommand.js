const BotCommand = require("./botCommand.js")
class JokeCommand extends BotCommand {
  constructor({ client = {}, config = {} }) {
    super({ client: client, config: config });
  }
  execute({ target = "unkown" }) {
    const fs = require("fs");
    const jokes = fs.readFileSync(this.config.additionalConfiguration.jokes).toString().split("\n");
    this.client.say(target, jokes[Math.floor(Math.random() * jokes.length)]);
  }
}
module.exports = JokeCommand;

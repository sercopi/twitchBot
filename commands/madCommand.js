const BotCommand = require("./botCommand.js")
class MadCommand extends BotCommand {
  constructor({ client = {}, config = {}}) {
    super({ client: client, config: config });
  }
  execute({ target = "unkown" }) {
    const fs = require("fs");
    const dbData = JSON.parse(fs.readFileSync(this.config.additionalConfiguration.db, "utf8"));
    if (!dbData[target] || !dbData[target].madcounter) {
      dbData[target] = {
        madcounter: 0,
      };
    }
    dbData[target].madcounter++;
    fs.writeFileSync(this.config.additionalConfiguration.db, JSON.stringify(dbData));
    this.client.say(
      target,
      `${target} se ha calentado ` +
        dbData[target].madcounter +
        " veces! https://www.youtube.com/watch?v=HBxn56l9WcU&ab_channel=BBC"
    );
  }
}
module.exports = MadCommand;

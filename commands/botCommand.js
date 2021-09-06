class BotCommand {
  constructor({ client = {}, config = {} }) {
    this.client = client;
    this.config = config;
  }
  execute() {
      throw new Error("can't execute the base bot commands");
  }
}
module.exports = BotCommand;

class CommandExecutor {
  constructor(client = {}, config = {}) {
    this.client = client;
    this.history = [];
    this.config = config;
    this.commandsMapping = require("./commands/commandsMapping.js");
  }
  execute(target, context, msg) {
    const parsedMSG = msg.split(" ");
    const commandName = parsedMSG[0].slice(1);
    const commandInstance = this.commandsMapping[commandName];
    const variables = parsedMSG.slice(1, parsedMSG.length);
    //if the command doesn't exist or it's not allowed for the channel, it doesn't do anything
    if (
      !commandInstance ||
      !this.config.botConfig.channelsConfig[target.substring(1)].allowedCommands.includes(
        commandName
      )
    ) {
      console.log("wrong command input");
      return true;
    }
    //save a history of commands for debugging in the future, this can be put to a database or written somewhere else
    this.history.push({
      target: target,
      context: context,
      msg: msg,
      variables: variables,
    });
    try {
      //we create the command object with all the parameters necessary
      const commandObject = new commandInstance({
        client: this.client,
        config: this.config,
      });
      //we execute the command's execute function with the necessary parameters
      commandObject.execute({
        target: target,
        variables: variables,
      });
    } catch (error) {
      console.error(error);
    }
  }
}
module.exports = CommandExecutor;

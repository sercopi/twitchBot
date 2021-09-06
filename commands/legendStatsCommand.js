const BotCommand = require("./botCommand.js");
class LegendStatsCommand extends BotCommand {
  constructor({ client = {}, config = {} }) {
    super({ client: client, config: config });
  }
  legendDataExtractorFunction() {
    const infoOne = document.querySelector(
      "#mw-content-text > div > p:nth-child(3)"
    );
    const infoTwo = document.querySelector(
      "#mw-content-text > div > p:nth-child(4)"
    );
    if (infoOne && infoTwo) {
      return {
        info:
          infoOne.innerHTML.replace(/(<([^>]+)>)/gi, "") +
          " " +
          infoTwo.innerHTML.replace(/(<([^>]+)>)/gi, ""),
      };
    }
    return {};
  }
  execute({ target = "unkown", variables = [] }) {
    const legendName = variables[0];
    (async () => {
      //if the info is on redis, we retrieve it
      const redisValue = await this.config.redisClient
        .get("legendStats-" + variables.join("-"))
        .catch((error) => console.log(error));
      if (redisValue) {
        console.log("from redis");
        this.client.say(target, redisValue);
        return true;
      }
      const legendData = await this.config.scrapperTool.get(
        "https://apexlegends.fandom.com/wiki/" +
          legendName.charAt(0).toUpperCase() +
          legendName.slice(1).toLowerCase(),
        this.legendDataExtractorFunction
      );
      const dataForClient = legendData.info
        ? legendData.info
        : "does that legend exist? o.o";

      this.config.redisClient
        .set("legendStats-" + variables.join("-"), dataForClient)
        .catch((error) => console.log(error));
      this.client.say(target, dataForClient);
    })();
  }
}
module.exports = LegendStatsCommand;

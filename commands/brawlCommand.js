const BotCommand = require("./botCommand.js");
class BrawlCommand extends BotCommand {
  constructor({ client = {}, config = {} }) {
    super({ client: client, config: config });
  }
  getBrawlerStats() {
    const name = document.querySelector("#brawl-stats-header > div.meta > h3")
      .innerHTML;
    const stats = Array.from(
      document.querySelectorAll("#general-tab > div .meta")
    ).map((item) => {
      return {
        title: item.querySelector("p").innerHTML,
        description: item.querySelector("span").innerHTML,
      };
    });
    return { name: name, stats: stats };
  }
  execute({ target = "unkown", variables = [] }) {
    const profileID = variables[0];
    (async () => {
      const redisValue = await this.config.redisClient
        .get("brawl-" + variables.join("-"))
        .catch((error) => console.log(error));
      if (redisValue) {
        console.log("from redis");
        this.client.say(target, redisValue);
        return true;
      }
      const profileData = await this.config.scrapperTool.get(
        "https://todobrawl.com/ver-estadisticas-de-brawl-stars/?tag=" +
          profileID,
        this.getBrawlerStats
      );
      const dataForClient = profileData
        ? "nombre: " +
          profileData.name +
          "\n" +
          profileData.stats.reduce((acc, item) => {
            return (
              acc +
              item.title +
              ": " +
              (item.description ? item.description : "sin información") +
              "\n"
            );
          }, "")
        : "existe ese brawler? O.O";

      this.config.redisClient
        .set("brawl-" + variables.join("-"), dataForClient)
        .catch((error) => console.log(error));

      this.client.say(target, dataForClient);
    })();
  }
}
module.exports = BrawlCommand;

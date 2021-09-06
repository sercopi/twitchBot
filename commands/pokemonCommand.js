const BotCommand = require("./botCommand.js");
class PokemonCommand extends BotCommand {
  constructor({ client = {}, config = {} }) {
    super({ client: client, config: config });
  }
  //all functions available to scrap different parts of the page
  infoFunctions = {
    stats: () => {
      const stats = document.querySelectorAll("#stats .para-div-rb");
      if (!stats) {
        return false;
      }
      return Array.from(stats).reduce(
        (acc, statElement) => acc + statElement.textContent,
        ""
      );
    },
    builds: () => {},
    combos: () => {},
    moves: () => {},
    items: () => {},
    goodwith: () => {
      const goodwith = document.querySelectorAll(
        "#goodwith .goodwith-single-css-pu .div-good-with-name-css-pu"
      );
      if (!goodwith) {
        return false;
      }
      return Array.from(goodwith)
        .map((goodwithElement) => goodwithElement.textContent)
        .join(", ");
    },
    counters: () => {
      const counters = document.querySelectorAll(
        "#counter .goodwith-single-css-pu.counter .div-good-with-name-css-pu"
      );
      if (!counters) {
        return false;
      }
      return Array.from(counters)
        .map((counterElement) => counterElement.textContent)
        .join(", ");
    },
  };
  execute({ target = "unkown", variables = [] }) {
    if (variables[0] == "help") {
      this.client.say(
        target,
        "escribe !pokemon + nombre de un pokemon (en inglés) + (stats, goodwith, counters)"
      );
      return true;
    }
    const selectedInfoFunction = this.infoFunctions[variables[1]];
    const pokeName = variables[0];

    (async (infoFunction, variables) => {
      //if the info is on redis, we retrieve it
      const redisValue = await this.config.redisClient
        .get("pokemon-" + variables.join("-"))
        .catch((error) => console.log(error));
      if (redisValue) {
        console.log("from redis");
        this.client.say(target, redisValue);
        return true;
      }
      const pokeData = await this.config.scrapperTool.get(
        "https://rankedboost.com/pokemon-unite/" + pokeName.toLowerCase(),
        infoFunction
      );
      const dataForClient = pokeData ? pokeData : "no conozco esa info D:";
      //set the response on redis
      this.config.redisClient.set(
        "pokemon-" + variables.join("-"),
        dataForClient
      );
      this.client.say(target, dataForClient);
    })(selectedInfoFunction, variables);
  }
}
module.exports = PokemonCommand;

const BotCommand = require("./botCommand.js");
class ApexTrackerCommand extends BotCommand {
  constructor({ client = {}, config = {} }) {
    super({ client: client, config: config });
  }
  execute({ target = "unkown", variables = [] }) {
    const request = require("request");
    const apexProfile = variables[0];
    request(
      {
        headers: {
          "content-type": "application/json",
          "TRN-Api-Key": `${this.config.botConfig.apiTrackerToken}`,
        },
        uri:
          "https://public-api.tracker.gg/v2/apex/standard/profile/psn/" +
          apexProfile,
        method: "GET",
      },
      (err, res, body) => {
        try {
          const responseBody = JSON.parse(body);
          if (responseBody.errors) {
            this.client.say(target, "ese jugador no existe D:");
            return true;
          }
          const response = responseBody.data;
          const rank = response.segments[0].stats.rankScore.metadata.rankName;
          const currentHero = response.metadata.activeLegendName;
          this.client.say(
            target,
            apexProfile +
              "´s current rank is: " +
              rank +
              ", and has recently played " +
              currentHero
          );
        } catch (error) {
          console.log(error);
        }
      }
    );
  }
}
module.exports = ApexTrackerCommand;

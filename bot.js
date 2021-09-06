const tmi = require("tmi.js");
const CommandExecutor = require("./commandExecutor.js");
const fs = require("fs");
/*
https://id.twitch.tv/oauth2/authorize
    ?client_id=yourClientID
    &redirect_uri=http://localhost
    &response_type=token
    &scope=channel:moderate+chat:edit+chat:read+whispers:edit+whispers:read

*/

//obtain global config
const config = JSON.parse(fs.readFileSync(__dirname+"/configuration.json"));

const opts = {
  options: { debug: true },
  identity: {
    username: config.username,
    password: `oauth:${config.accessToken}`,
  },
  channels: Object.keys(config.channelsConfig), //array of channel Names to connect to
};
console.log(opts);
// Create a twitch client with our options
const client = new tmi.client(opts);

const RedisAsyncWrapper = require(__dirname +
  "/utilities/redisAsyncWrapper.js");
const ScrapperTool = require(__dirname + "/utilities/scrapperTool.js");
//create an instance for the commandExecutor
const commandExecutor = new CommandExecutor(client, {
  additionalConfiguration: {
    db: __dirname + "/assets/db.json",
    jokes: __dirname + "/assets/jokes.txt",
  },
  botConfig: config,
  redisClient: new RedisAsyncWrapper(),
  scrapperTool: new ScrapperTool(),
});

// Called every time a message comes in
function onMessageHandler(target, context, msg, self) {
  try {
    if (self) {
      return;
    } // Ignore messages from the bot
    // Remove whitespace from chat message
    const command = msg.trim();
    // If the command is known, let's execute it
    if (/^!/.test(msg)) {
      commandExecutor.execute(target, context, command);
    }
    //non-commands
  } catch (error) {
    console.log(error);
  }
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler(addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}


// Register our event handlers (defined below)
client.on("message", onMessageHandler);
client.on("connected", onConnectedHandler);
// Connect to Twitch:
client.connect().catch((error) => console.log(error));



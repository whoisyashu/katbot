const { Highrise, Events, Emotes} = require('highrise.sdk.dev');
const { Facing } = require("highrise.sdk.dev");
const { Reactions } = require("highrise.sdk.dev");
const token = "0cc91aaece7923f5173c7174a347147d641350ab25bf97fa8524fed2d6c0aac5";
const room = "6784fad4eeeced25dfdf0b26";
const bot = new Highrise({
    Events: [
        Events.Messages,
        Events.Joins,
        Events.Emotes,
        Events.Leaves,
        Events.Movements,
        Events.Reactions,
        Events.DirectMessages,
        Events.Moderate,
     ],
});

// Log that the bot is ready.

bot.on('ready', (session) => {
    console.log("[READY] Bot is ready!".green + ` Session: ${session}`);
    bot.outfit.change("default").catch(e => console.error(e));
    bot.player.teleport(bot.info.user.id, 14.5, 0, 14.5, Facing.FrontLeft)
      .catch(e => console.error("[ERROR] Failed to teleport:", e));
});

setInterval(() => {
    bot.message.send(`This is kat's home. Bot commands can be viewed using '!assist' .Enjoy the features of bot.`);
    bot.player.react(bot.info.owner.id, Reactions.Heart);
    bot.player.react("66ce8153010c6659dd76e1d1", Reactions.Heart);
}, 60000); 

//Emote event

const activeLoops = new Map(); // Stores looping emotes per user

const emotes = {
  kiss: { id: "emote-kiss", duration: 3 },
  laugh: { id: "emote-laughing", duration: 3 },
  sit: { id: "idle-loop-sitfloor", duration: 10 },
  lust: { id: "emote-lust", duration: 5 },
  curse: { id: "emoji-cursing", duration: 2.5 },
  greedy: { id: "emote-greedy", duration: 4.8 },
  flex: { id: "emoji-flex", duration: 3 },
  gag: { id: "emoji-gagging", duration: 6 },
  celebrate: { id: "emoji-celebrate", duration: 4 },
  macarena: { id: "dance-macarena", duration: 12.5 },
  tiktok8: { id: "dance-tiktok8", duration: 11 },
  blackpink: { id: "dance-blackpink", duration: 7 },
  model: { id: "emote-model", duration: 6.3 },
  tiktok2: { id: "dance-tiktok2", duration: 11 },
  pennywise: { id: "dance-pennywise", duration: 1.5 },
  bow: { id: "emote-bow", duration: 3.3 },
  russian: { id: "dance-russian", duration: 10.3 },
  curtsy: { id: "emote-curtsy", duration: 2.8 },
  snowball: { id: "emote-snowball", duration: 6 },
  hot: { id: "emote-hot", duration: 4.8 },
  snowangel: { id: "emote-snowangel", duration: 6.8 },
  charge: { id: "emote-charging", duration: 8.5 },
  cartdance: { id: "dance-shoppingcart", duration: 8 },
  confused: { id: "emote-confused", duration: 9.3 },
  hype: { id: "idle-enthusiastic", duration: 16.5 },
  psychic: { id: "emote-telekinesis", duration: 11 },
  float: { id: "emote-float", duration: 9.3 },
  teleport: { id: "emote-teleporting", duration: 12.5 },
  swordfight: { id: "emote-swordfight", duration: 6 },
  maniac: { id: "emote-maniac", duration: 5.5 },
  energyball: { id: "emote-energyball", duration: 8.3 },
  snake: { id: "emote-snake", duration: 6 },
  sing: { id: "idle_singing", duration: 11 },
  frog: { id: "emote-frog", duration: 15 },
  pose: { id: "emote-superpose", duration: 4.6 },
  cute: { id: "emote-cute", duration: 7.3 },
  tiktok9: { id: "dance-tiktok9", duration: 13 },
  weird: { id: "dance-weird", duration: 22 },
  tiktok10: { id: "dance-tiktok10", duration: 9 },
  pose7: { id: "emote-pose7", duration: 5.3 },
  pose8: { id: "emote-pose8", duration: 4.6 },
  casualdance: { id: "idle-dance-casual", duration: 9.7 },
  pose1: { id: "emote-pose1", duration: 3 },
  pose3: { id: "emote-pose3", duration: 4.7 },
  pose5: { id: "emote-pose5", duration: 5 },
  cutey: { id: "emote-cutey", duration: 3.5 },
  punkguitar: { id: "emote-punkguitar", duration: 10 },
  zombierun: { id: "emote-zombierun", duration: 10 },
  fashionista: { id: "emote-fashionista", duration: 6 },
  gravity: {id: "emote-gravity", duration: 9.8},
  icecream: { id: "dance-icecream", duration: 15 },
  wrongdance: { id: "dance-wrong", duration: 13 },
  uwu: { id: "idle-uwu", duration: 25 },
  tiktok4: { id: "idle-dance-tiktok4", duration: 16 },
  shy: { id: "emote-shy2", duration: 5 },
  anime: { id: "dance-anime", duration: 7.8 },
};

const emotePages = Math.ceil(Object.keys(emotes).length / 7);

bot.on("chatCreate", async (user, message) => {
  const args = message.toLowerCase().split(" "); // Convert input to lowercase
  const command = args[0];
  const emoteName = args.slice(1).join(" ");
  if (command === "!assistemote") {
    const assistMessage = `
      List of Commands for User Fun:
      1.!emote <emote_name>
      2.!loop <emote_name>
      3.!stop
      4.!emotelist <page_number>
      Use these commands to have fun with emotes! 🎉
    `;

    bot.message.send(assistMessage).catch(e => console.error(e));
  }
  else if (command === "!emotelist") {
    const page = args[1] ? parseInt(args[1]) : 1;
    
    if (isNaN(page) || page < 1 || page > emotePages) {
      bot.message.send(`Usage: !emotelist <page_number>. Valid page numbers are from 1 to ${emotePages}.`);
      return;
    }

    const emoteKeys = Object.keys(emotes);
    const emotesForPage = emoteKeys.slice((page - 1) * 7, page * 7);
    
    let emoteListMessage = `Emote list (Page ${page}/${emotePages}):\n`;
    emotesForPage.forEach(emote => {
      emoteListMessage += `\`${emote}\` - ${emotes[emote].id}\n`;
    });

    bot.message.send(emoteListMessage).catch(e => console.error(e));
  }
  else if (command === "!emote") {
    if (!emotes[emoteName]) {
      bot.message.send(`Invalid emote name: ${emoteName}`);
      return;
    }

    bot.player.emote(user.id, emotes[emoteName].id)
      .catch(e => console.error(`[ERROR] Failed to perform emote:`, e));

  } else if (command === "!loop") {
    if (!emotes[emoteName]) {
      bot.message.send(`Invalid emote name: ${emoteName}`);
      return;
    }

    // Stop previous loop if already active for the user
    if (activeLoops.has(user.id)) {
      clearInterval(activeLoops.get(user.id));
    }

    // Start looping the emote
    const loopInterval = setInterval(() => {
      bot.player.emote(user.id, emotes[emoteName].id)
        .catch(e => console.error(`[ERROR] Failed to perform emote:`, e));
    }, emotes[emoteName].duration * 1000);

    activeLoops.set(user.id, loopInterval);
    bot.message.send(`Looping ${emoteName} for ${user.username}.`);

  } else if (command === "!stop") {
    if (activeLoops.has(user.id)) {
      clearInterval(activeLoops.get(user.id));
      activeLoops.delete(user.id);
      bot.message.send(`Stopped looping emotes for ${user.username}.`);
    } else {
      bot.message.send(`No active emote loop to stop.`);
    }
  }
});
bot.on("chatCreate",async(user,message)=>{
    if(message.startsWith("!floor")){
        const targetfloor = message.split(" ")[1];
        if(targetfloor === "1"){
            bot.player.teleport(user.id, 14.5, 6, 8.5, Facing.FrontLeft);}
        else if(targetfloor === "2"){
            bot.player.teleport(user.id, 11.5, 11.25, 1.5, Facing.FrontRight);}
        else if(targetfloor === "0"){
            bot.player.teleport(user.id, 1.5, 0, 6.5, Facing.FrontRight);
        }
        }
    })


//rps game

  bot.on("chatCreate", async (user, message) => {
    if (message.startsWith("!rps")) {
      const userChoice = message.split(" ")[1]; // Get the user's choice
  
      // Validate the user's choice
      if (!['rock', 'paper', 'scissors'].includes(userChoice)) {
        return bot.message.send("Please choose rock, paper, or scissors.");
      }
  
      // Generate the bot's random choice
      const choices = ['rock', 'paper', 'scissors'];
      const botChoice = choices[Math.floor(Math.random() * choices.length)];
  
      // Determine the outcome of the game
      let result;
      if (userChoice === botChoice) {
        result = "It's a tie!";
      } else if (
        (userChoice === 'rock' && botChoice === 'scissors') ||
        (userChoice === 'scissors' && botChoice === 'paper') ||
        (userChoice === 'paper' && botChoice === 'rock')
      ) {
        result = "You win!";
      } else {
        result = "You lose!";
      }
  
      // Send the bot's choice and the result
      bot.message.send(`You chose ${userChoice}. I chose ${botChoice}. ${result}`);
    }
  });
  bot.on("chatCreate", async (user, message) => {
    if (message.startsWith("!assistgame")) {
      // Extract the game name
      const gameName = message.split(" ")[1];
  
      // Ensure gameName is provided and check if it's valid
      if (!gameName) {
        bot.message.send("Please specify the game you need help with. Example: `!assistgame rps`");
        return;
      }
  
      let assistanceMessagePart1 = "";
      let assistanceMessagePart2 = "";
  
      // Provide brief assistance based on the game name
      switch (gameName.toLowerCase()) {
        case "rps":
          assistanceMessagePart1 = `
            **Rock-Paper-Scissors:**
            1. Type \`!rps\` to start.
            2. Choose: rock, paper, or scissors.
          `;
          assistanceMessagePart2 = `
            3. The bot picks a choice, and the winner is determined by:
               - Rock > Scissors, Scissors > Paper, Paper > Rock.
          `;
          break;
        default:
          assistanceMessagePart1 = "I don't recognize that game. Try `!assistgame rps`.";
      }
  
      // Send the first part of the assistance message
      bot.message.send(assistanceMessagePart1).catch(e => console.error(e));
  
      // Send the second part (if applicable)
      if (assistanceMessagePart2) {
        bot.message.send(assistanceMessagePart2).catch(e => console.error(e));
      }
    }
  });
  
  const fs = require('fs');
  const path = require('path');
  
  // Path to the JSON file to store player data
  const playerDataFile = path.join(__dirname, 'playerData.json');
  
  // Function to load the player data from the JSON file
  function loadPlayerData() {
    if (fs.existsSync(playerDataFile)) {
      const rawData = fs.readFileSync(playerDataFile);
      return JSON.parse(rawData);
    }
    return {};
  }
  
  // Function to save the player data to the JSON file
  function savePlayerData(data) {
    fs.writeFileSync(playerDataFile, JSON.stringify(data, null, 2), 'utf8');
  }
  
  // Player movement tracking and saving data
  bot.on("playerMove", (user, position) => {
    const playerData = loadPlayerData();
  
    // Log player movement and save their position
    if ('x' in position) {
      playerData[user.id] = {
        username: user.username,
        position: {
          x: position.x,
          y: position.y,
          z: position.z,
          facing: position.facing,
        },
      };
    } else {
      playerData[user.id] = {
        username: user.username,
        position: {
          entity_id: position.entity_id,
          anchor_ix: position.anchor_ix,
        },
      };
    }
  
    // Save updated player data to the JSON file
    savePlayerData(playerData);
  });
  
  // Player join event
  bot.on('playerJoin', (user, position) => {
    console.log(`[PLAYER JOINED]: ${user.username}:${user.id} - ${JSON.stringify(position)}`);
    // Teleport the user to a specific location
    bot.player.teleport(user.id, 14.5, 0.5, 8.5, Facing.FrontLeft)
      .then(() => {
        // Wait 0.5 seconds before playing emote
        setTimeout(() => {
          bot.player.emote(bot.info.user.id, Emotes.Bow.id)
            .then(() => console.log(`[EMOTE] ${user.username} performed a bow`))
            .catch(e => console.error(`[ERROR] Failed to perform emote:`, e));
  
          // Send welcome message
          if(user.id === bot.info.owner.id){
            bot.message.send("Welcome to the Home, my lady. Lots of Love and care from @StarryEcho");
          }else{
          bot.message.send(`Welcome to the home @${user.username}🍹`);
          }
          // Update the player's coordinates in playerData.json
          const updatedData = {
            username: user.username,
            userId: user.id,
            position: { x: 3.5, y: 0, z: 1 }, // The coordinates to which the player was teleported
            facing: 'FrontRight'
          };
  
          // Read the current player data from the file
          const playerData = loadPlayerData();
  
          // Add or update the player's data
          playerData[user.id] = updatedData;
  
          // Write the updated player data back to the file
          savePlayerData(playerData);
  
          console.log(`[PLAYER DATA] Updated coordinates for ${user.username}`);
        }, 500);
      })
      .catch(e => console.error(`[ERROR] Failed to teleport:`, e));
  });
  
  // Player leave event
  bot.on("playerLeave", (user) => {
    const playerData = loadPlayerData();
  
    // Remove the player's data when they leave
    if (playerData[user.id]) {
      delete playerData[user.id];
      savePlayerData(playerData);
    }
  
    console.log(`[PLAYER LEFT]: ${user.username}:${user.id}`);
  
    // Send a goodbye message
    bot.message.send(`Goodbye for now! Hope to see you again soon. Your next visit will make my day! 😊🚀`);
  
    // Perform a kiss emote
    bot.player.emote(bot.info.user.id, Emotes.Kiss.id)
      .then(() => console.log(`[EMOTE] ${user.username} performed a kiss`))
      .catch(e => console.error(`[ERROR] Failed to perform emote:`, e));
  });

// Function to load the player data from the JSON file
function loadPlayerData() {
  if (fs.existsSync(playerDataFile)) {
    const rawData = fs.readFileSync(playerDataFile);
    return JSON.parse(rawData);
  }
  return {};
}

// Listen to chat messages
bot.on("chatCreate", (user, message) => {
  // If the message is "!goto @username"
  if (message.startsWith("!goto @")) {
    // Extract the target username from the message
    const targetUsername = message.split(" ")[1].replace('@','');
    
    // Load player data to check if the target player exists
    const playerData = loadPlayerData();

    // Find the target player by username (case insensitive)
    const targetPlayer = Object.values(playerData).find(player => player.username.toLowerCase() === targetUsername.toLowerCase());

    // Ensure that the user is not trying to teleport to the bot
    if (targetPlayer.username === bot.info.user.username) {
        bot.message.send(`Sorry, ${user.username} cannot teleport to the bot.`);
        return;
    }

    if (!targetPlayer) {
      // If the player is not found in the data
      bot.message.send(`Player @${targetUsername} not found!`);
      return;
    }

    // Retrieve target player's coordinates
    const { x, y, z } = targetPlayer.position;

    // Perform teleportation to the target player's coordinates
    bot.player.teleport(user.id, x, y, z, Facing.FrontLeft)
      .then(() => {
        bot.message.send(`You have been teleported to ${targetUsername}'s location!`);
      })
      .catch(e => {
        console.error(`[ERROR] Failed to teleport:`, e);
        bot.message.send(`Failed to teleport to ${targetUsername}.`);
      });
  }
});
bot.on("chatCreate", async (user, message) => {
    if (message === "!assist") {
      bot.message.send(
        "📌Commands Overview:\n"+
        "🔹 `!assistemote` - Learn about emote assist\n" +
        "🔹 `!floor number` - Teleport to the desired floor\n" +
        "🔹 `!assistgames` - Get help with Rock-Paper-Scissors (RPS)\n" +
        "🔹 `!goto @username` - Teleport to user\n"
      );
    }
});

bot.on("chatCreate", async (user, message) => { 
    const args = message.split(" ");
    const command = args[0].toLowerCase();

    if (command === "!add" && args[1] === "designer") {
        if (bot.info.owner.id !== user.id ) {
            bot.message.send("❌ You are not the bot owner!");
            return;
        }

        const targetUsername = args[2]?.replace("@", ""); // Remove '@' from mention
        if (!targetUsername) {
            bot.message.send("⚠️ Please mention a username: `!add designer @username`");
            return;
        }

        // Get all players in the room
        bot.room.players.get().then(players => {
            // Find the target user in the room
            const targetPlayer = players.find(([playerInfo]) => playerInfo.username === targetUsername);

            if (!targetPlayer) {
                bot.message.send(`❌ @${targetUsername} is not in the room!`);
                return;
            }

            const targetUserId = targetPlayer[0].id; // Extract user ID

            // Try to add the user as a designer
            bot.player.designer.add(targetUserId)
                .then(() => bot.message.send(`✅ @${targetUsername} has been added as a designer!`))
                .catch(e => {
                    console.error("Error adding designer:", e);
                    bot.message.send("⚠️ Failed to add designer.");
                });
        }).catch(e => {
            console.error("Error fetching players:", e);
            bot.message.send("⚠️ Failed to retrieve players in the room.");
        });
    }
});
bot.on("roomModerate", (moderator_id, target_id, action, duration) => {
    // Log the moderation event to the console.
    console.log(`[MODERATION]: ${moderator_id} - ${target_id} - ${action} - ${duration}`);
});

bot.login(token,room);

const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const { prefix, token } = require('./config.json');

client.once('ready', () => {
    console.log('Ready!');
})

client.login(token);

// regex for getting an @
const idex = /<@!([0-9]*)>/;

// format [[[userId1, userSelection1],[userId2, userSelection2], channel, timestamp]]
var runningGames = [];

client.on('message', message => {
    // get author ID which is useful later
    const sender = message.author.id;

    // get timestamp of message for pruning old games
    const date = new Date();
    const timestamp = date.getTime();

    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);

    switch (args[0]) {
        case "rps":
            var channel = message.channel;
            // make sure syntax is valid
            if (args.length != 2) {
                channel.send("Proper syntax: !rps @User");
                return;
            }
            var target = args[1].match(idex);
            if (!target) {
                channel.send("Proper syntax: !rps @User");
                return;
            }
            // get user ids
            target = target[1];
            if (target == sender) {
                channel.send("You cannot challenge yourself >:(")
                return;
            }

            for (i = 0; i < runningGames.length; i++) {
                // check if either user is already in a game
                if (runningGames[i][0][0] == sender || runningGames[i][1][0] == sender) {
                    channel.send("You are already in a game.");
                    return;
                } else if (runningGames[i][0][0] == target || runningGames[i][1][0] == target) {
                    channel.send("<@"+target+"> is already in a game.");
                    return;
                }
            }
            // append the game to the list of running games
            channel.send("<@"+sender+"> has challenged <@"+target+"> to rps, DM me with !rock, !paper, or !scissors to make your selection or !withdraw to cancel your game.")
            runningGames.push([[sender, "n"],[target, "n"],channel,timestamp]);
            break;
        case "rock":
        case "r":
            var gameIndex = -1;
            for (i = 0; i < runningGames.length; i++) {
                if (runningGames[i][0][0] == sender) {
                    runningGames[i][0][1] = "r";
                    gameIndex = i;
                }
                if (runningGames[i][1][0] == sender) {
                    runningGames[i][1][1] = "r";
                    gameIndex = i;
                }
            }
            if (gameIndex == -1) {
                message.channel.send("You are not currently in a game.")
                return;
            }
            if (runningGames[gameIndex][0][1] != "n" && runningGames[gameIndex][1][1] != "n") {
                displayWinner(runningGames[gameIndex]);
                runningGames.splice(gameIndex, 1);
            }
            if (message.guild !== null) {
                message.delete();
            } else {
                message.channel.send("Selection received!");
            }
            break;
        case "scissors":
        case "s":
            var gameIndex = -1;
            for (i = 0; i < runningGames.length; i++) {
                if (runningGames[i][0][0] == sender) {
                    runningGames[i][0][1] = "s";
                    gameIndex = i;
                }
                if (runningGames[i][1][0] == sender) {
                    runningGames[i][1][1] = "s";
                    gameIndex = i;
                }
            }
            if (gameIndex == -1) {
                message.channel.send("You are not currently in a game.")
                return;
            }
            if (runningGames[gameIndex][0][1] != "n" && runningGames[gameIndex][1][1] != "n") {
                displayWinner(runningGames[gameIndex]);
                runningGames.splice(gameIndex, 1);
            }
            if (message.guild !== null) {
                message.delete();
            } else {
                message.channel.send("Selection received!");
            }
            break;
        case "paper":
        case "p":
            var gameIndex = -1;
            for (i = 0; i < runningGames.length; i++) {
                if (runningGames[i][0][0] == sender) {
                    runningGames[i][0][1] = "p";
                    gameIndex = i;
                }
                if (runningGames[i][1][0] == sender) {
                    runningGames[i][1][1] = "p";
                    gameIndex = i;
                }
            }
            if (gameIndex == -1) {
                message.channel.send("You are not currently in a game.")
                return;
            }
            if (runningGames[gameIndex][0][1] != "n" && runningGames[gameIndex][1][1] != "n") {
                displayWinner(runningGames[gameIndex]);
                runningGames.splice(gameIndex, 1);
            }
            if (message.guild !== null) {
                message.delete();
            } else {
                message.channel.send("Selection received!");
            }
            break;
        case "withdraw":
            for (i = 0; i < runningGames.length; i++) {
                // check if either user is already in a game
                if (runningGames[i][0][0] == sender || runningGames[i][1][0] == sender) {
                    runningGames.splice(i, 1);
                    message.channel.send("Game cancelled.");
                    return;
                }
            }
            message.channel.send("You are not currently in a game.");
            break;
    }
});

function displayWinner(gameData) {
    const id1 = gameData[0][0];
    const id2 = gameData[1][0];
    const choice1 = gameData[0][1];
    const choice2 = gameData[1][1];
    const channel = gameData[2];
    const disp = {"r" : "rock", "p" : "paper", "s" : "scissors"};
    const indexBeatValue = {"r" : "s", "s": "p", "p" : "r"};
    if (choice1 == choice2) {
        channel.send("Tie! <@"+id1+"> and <@"+id2+"> both chose "+disp[choice1]+".");
        return;
    }
    if (indexBeatValue[choice1] == choice2) {
        channel.send("<@"+id1+"> ("+disp[choice1]+") wins! (beating <@"+id2+"> ["+disp[choice2]+"]).")
    } else {
        channel.send("<@"+id2+"> ("+disp[choice2]+") wins! (beating <@"+id1+"> ["+disp[choice1]+"]).")
    }
    return;
}
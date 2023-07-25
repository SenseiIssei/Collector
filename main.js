const Discord = require('discord.js');
const { exec } = require('child_process');

const token = 'Token';
// Define the required intents
const { Client, Intents } = require('discord.js');
const client = new Discord.Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.once('ready', () => {
  console.log('Bot is online!');
});

client.on('message', (message) => {
  if (!message.content.startsWith('!') || message.author.bot) return;

  const args = message.content.slice(1).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'start') {
    // Execute the start_bot.sh script
    exec('bash start_bot.sh', (error, stdout, stderr) => {
      if (error) {
        message.channel.send('An error occurred while starting the bot.');
        console.error(error);
      } else {
        message.channel.send('Bot started successfully.');
      }
    });
  } else if (command === 'restart') {
    // Execute the restart_bot.sh script
    exec('bash restart_bot.sh', (error, stdout, stderr) => {
      if (error) {
        message.channel.send('An error occurred while restarting the bot.');
        console.error(error);
      } else {
        message.channel.send('Bot restarted successfully.');
      }
    });
  } else if (command === 'shutdown') {
    // Execute the shutdown command
    exec('killall node', (error, stdout, stderr) => {
      if (error) {
        message.channel.send('An error occurred while shutting down the bot.');
        console.error(error);
      } else {
        message.channel.send('Bot shutdown successfully.');
      }
    });
  }  else if (command === 'startlog') {
       const logProcess = exec('tail -f /var/log/syslog'); // Replace the file path with the log file you want to monitor

       // Read console output and send as a message
       logProcess.stdout.on('data', (data) => {
         const logMessage = data.toString();
         const logChannel = client.channels.cache.get(channelId);
         if (logChannel) {
           logChannel.send(`\`\`\`${logMessage}\`\`\``);
         }
       });

       logProcess.stderr.on('data', (data) => {
         console.error(`Error while reading log: ${data}`);
       });

       message.channel.send('Started monitoring log and sending to Discord channel.');
     } else if (command === 'stoplog') {
       // Kill the log process to stop monitoring
       exec('pkill tail');
       message.channel.send('Stopped monitoring log.');
     }
});

client.login(token);

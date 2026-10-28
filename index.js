
const {
  Client,
  GatewayIntentBits,
  EmbedBuilder
} = require('discord.js');

const token = process.env.DISCORD_TOKEN;
const logChannelId = process.env.LOG_CHANNEL_ID;

if (!token || !logChannelId) {
  throw new Error('Thieu DISCORD_TOKEN hoac LOG_CHANNEL_ID');
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates
  ]
});

client.once('ready', () => {
  console.log(`Bot da online: ${client.user.tag}`);
});

client.on('voiceStateUpdate', async (oldState, newState) => {
  const member = newState.member || oldState.member;
  if (!member || member.user.bot) return;

  let title;
  let description;

  if (!oldState.channelId && newState.channelId) {
    title = '🟢 Thành viên vào voice';
    description = `${member.user.tag} đã vào ${newState.channel.name}`;
  } else if (oldState.channelId && !newState.channelId) {
    title = '🔴 Thành viên rời voice';
    description = `${member.user.tag} đã rời ${oldState.channel.name}`;
  } else if (
    oldState.channelId !== newState.channelId &&
    oldState.channelId && newState.channelId
  ) {
    title = '🔄 Thành viên chuyển voice';
    description = `${member.user.tag}: ${oldState.channel.name} → ${newState.channel.name}`;
  } else {
    return;
  }

  try {
    const channel = await client.channels.fetch(logChannelId);
    if (channel && channel.isTextBased()) {
      const embed = new EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setTimestamp();

      await channel.send({ embeds: [embed] });
    }
  } catch (error) {
    console.error(error);
  }
});

client.login(token);

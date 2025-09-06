require('dotenv').config(); 
const { 
  Client, GatewayIntentBits, 
  EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, Events 
} = require('discord.js');
const axios = require('axios');

const TOKEN = process.env.DISCORD_TOKEN;
const API_URL = process.env.API_URL; // 例: http://100.85.xx.xx:47823/sunshine
const API_KEY = process.env.API_KEY;
const ALLOWED_USER = process.env.ALLOWED_USER;

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

client.once('clientReady', () => {
    console.log(`Logged in as ${client.user.tag}`);
  });
  

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  // コマンドで Embed + ボタンを表示
  if (message.content === "!sunshine") {
    const embed = new EmbedBuilder()
      .setColor(0x2ecc71) // 緑
      .setTitle("Sunshine コントロールパネル")
      .setDescription("下のボタンから Sunshine を操作できます。");

    const startBtn = new ButtonBuilder()
      .setCustomId("sunshine_start")
      .setLabel("起動")
      .setStyle(ButtonStyle.Success);

    const stopBtn = new ButtonBuilder()
      .setCustomId("sunshine_stop")
      .setLabel("停止")
      .setStyle(ButtonStyle.Danger);

    const statusBtn = new ButtonBuilder()
      .setCustomId("sunshine_status")
      .setLabel("状態確認")
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents(startBtn, stopBtn, statusBtn);

    await message.reply({ embeds: [embed], components: [row] });
  }
});

// ボタンが押されたときの処理
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isButton()) return;

  if (interaction.user.id !== ALLOWED_USER) {
    return interaction.reply({ content: "⛔ あなたには権限がありません", ephemeral: true });
  }

  try {
    let res;
    if (interaction.customId === "sunshine_start") {
      res = await axios.get(`${API_URL}/start`, { params: { key: API_KEY } });
    } else if (interaction.customId === "sunshine_stop") {
      res = await axios.get(`${API_URL}/stop`, { params: { key: API_KEY } });
    } else if (interaction.customId === "sunshine_status") {
      res = await axios.get(`${API_URL}/status`, { params: { key: API_KEY } });
    }

    if (res) {
      await interaction.reply({ content: `✅ ${res.data}`, ephemeral: true });
    }
  } catch (err) {
    console.error(err);
    await interaction.reply({ content: "❌ Sunshine の操作に失敗しました", ephemeral: true });
  }
});

client.login(TOKEN);

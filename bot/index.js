require('dotenv').config(); 
const { 
  Client, GatewayIntentBits, 
  EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, Events 
} = require('discord.js');
const axios = require('axios');

const TOKEN = process.env.DISCORD_TOKEN;
const API_URL = process.env.API_URL;
const API_KEY = process.env.API_KEY;
const ALLOWED_USER = process.env.ALLOWED_USER;

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  // コマンドで Embed + ボタンを表示
  if (message.content === "!sunshine") {
    const embed = new EmbedBuilder()
      .setColor(0x2ecc71) // 緑
      .setTitle("Sunshine 起動コントロール")
      .setDescription("下のボタンを押すと Sunshine を起動します 🚀");

    const button = new ButtonBuilder()
      .setCustomId("sunshine_start")
      .setLabel("起動する")
      .setStyle(ButtonStyle.Success); // 緑ボタン

    const row = new ActionRowBuilder().addComponents(button);

    await message.reply({ embeds: [embed], components: [row] });
  }
});

// ボタンが押されたときの処理
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isButton()) return;

  if (interaction.customId === "sunshine_start") {
    if (interaction.user.id !== ALLOWED_USER) {
      return interaction.reply({ content: "⛔ あなたには権限がありません", ephemeral: true });
    }

    try {
      const res = await axios.get(API_URL, { params: { key: API_KEY } });
      await interaction.reply({ content: `✅ ${res.data}`, ephemeral: true });
    } catch (err) {
      console.error(err);
      await interaction.reply({ content: "❌ Sunshine の起動に失敗しました", ephemeral: true });
    }
  }
});

client.login(TOKEN);

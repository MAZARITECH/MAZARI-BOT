/*
 * MAZARI BOT - Professional WhatsApp Bot by Mazari Technical
 * 
 * 1. Install Node.js (Termux: pkg install nodejs)
 * 2. Install Baileys: npm install @whiskeysockets/baileys axios moment-timezone
 * 3. Run: node mazari-bot.js
 * 
 * GitHub par sirf is file ko upload karen!
 */

const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, downloadMediaMessage } = require('@whiskeysockets/baileys');
const axios = require('axios');
const fs = require('fs');
const moment = require('moment-timezone');

// ====== CONFIGURATION ======
const config = {
  ownerName: "MAZARI TECHNICAL",
  botName: "MAZARI BOT",
  youtube: "https://youtube.com/@mazari_technical304?si=lf5R8QjK-WSm3nVJ",
  whatsapp: "https://wa.me/+923443895572",
  telegram: "https://t.me/Mazari180",
  instagram: "https://www.instagram.com/itx_mazari_hacker?igsh=enRudGowYjVidHAy",
  channel: "https://whatsapp.com/channel/0029Vb6GUj8BPzjOWNfnhm1B",
  features: {
    autoReact: true,
    autoReply: true,
    statusSeen: true,
    goodMorningNight: true,
    antiLink: true,
    tagAll: true,
    welcome: true,
    groupProtection: true,
    broadcast: true,
    blockUnblock: true,
    banUnban: true,
    customCommands: true,
    setProfile: true,
    ping: true,
    groupInfo: true,
    groupMute: true,
    groupUnmute: true,
    promote: true,
    demote: true,
    groupList: true,
    sticker: true,
    quote: true,
    weather: true,
    time: true,
    mentionAdmins: true,
    groupDesc: true,
    groupSubject: true,
    groupInvite: true,
    groupLeave: true,
    groupJoin: true,
    groupOwner: true,
    groupCount: true,
    groupPic: true,
    help: true
  }
};

// ====== MENU MESSAGE ======
function getMenu() {
  return `
╔══════════════════════╗
║      ${config.botName}      ║
╠══════════════════════╣
║ Owner: ${config.ownerName}
║
║ 💬 WhatsApp Channel:
║   ${config.channel}
║ 🎥 YouTube:
║   ${config.youtube}
║ 📞 WhatsApp:
║   ${config.whatsapp}
║ 🐍 Telegram:
║   ${config.telegram}
║ 📸 Instagram:
║   ${config.instagram}
╠══════════════════════╣
║ 1. .menu - Show Menu
║ 2. .ping - Bot Status
║ 3. .autoreact - Auto React
║ 4. .autoreply - Auto Reply
║ 5. .statusseen - Auto Status Seen
║ 6. .goodmorning / .goodnight
║ 7. .antilink - Anti Link (Group)
║ 8. .tagall - Tag All (Group)
║ 9. .welcome - Welcome/Goodbye
║ 10. .groupprotection
║ 11. .broadcast - Broadcast Msg
║ 12. .block / .unblock
║ 13. .ban / .unban (Group)
║ 14. .setprofile - Set Bot Profile
║ 15. .custom - Custom Commands
║ 16. .feature - Feature On/Off
║ 17. .groupinfo - Group Info
║ 18. .groupmute / .groupunmute
║ 19. .promote / .demote
║ 20. .grouplist - List Groups
║ 21. .sticker (reply image/video)
║ 22. .quote - Random Quote
║ 23. .weather <city>
║ 24. .time - Current Time
║ 25. .mentionadmins
║ 26. .groupdesc <desc>
║ 27. .groupsubject <name>
║ 28. .groupinvite
║ 29. .groupleave
║ 30. .groupjoin <invite>
║ 31. .groupowner
║ 32. .groupcount
║ 33. .grouppic (reply image)
║ 34. .help <feature>
╚══════════════════════╝
Type .help <feature> for details.
`;
}

// ====== EMOJIS FOR AUTO REACT ======
const emojis = ['😁','😂','😍','🥰','😎','😜','😇','🤩','😏','😅'];

// ====== FEATURE TOGGLE FUNCTION ======
function toggleFeature(feature, state) {
  if (config.features.hasOwnProperty(feature)) {
    config.features[feature] = state;
    return Feature "${feature}" is now ${state ? 'ON' : 'OFF'}.;
  }
  return Feature "${feature}" not found.;
}

// ====== CUSTOM COMMANDS STORAGE (IN-MEMORY) ======
const customCmds = {};

// ====== MAIN BOT FUNCTION ======
async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message) return;
    const text = msg.message.conversation || msg.message.extendedTextMessage?.text || '';
    const sender = msg.key.remoteJid;
    const isGroup = sender.endsWith('@g.us');
    const fromMe = msg.key.fromMe;
    const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

    // ===== MENU =====
    if (/^\.?menu$/i.test(text)) {
      await sock.sendMessage(sender, { text: getMenu() });
    }

    // ===== PING =====
    if (/^\.?ping$/i.test(text) && config.features.ping) {
      const start = Date.now();
      await sock.sendMessage(sender, { text: 'Pinging...' });
      const end = Date.now();
      await sock.sendMessage(sender, { text: ✅ Bot is online!\nResponse: ${end - start}ms });
    }

    // ===== AUTO REACT =====
    if (config.features.autoReact && !fromMe && !isGroup) {
      const emoji = emojis[Math.floor(Math.random() * emojis.length)];
      try {
        await sock.sendMessage(sender, { react: { text: emoji, key: msg.key } });
      } catch (e) {}
    }

    // ===== AUTO REPLY =====
    if (config.features.autoReply && !fromMe && !isGroup) {
      if (/hello|hi|salam|assalam/i.test(text)) {
        await sock.sendMessage(sender, { text: Wa Alaikum Salam! This is ${config.botName}.\nType .menu to see features. });
      }
      if (/good night/i.test(text)) {
        await sock.sendMessage(sender, { text: Good Night! 🌙 });
      }
      if (/good morning/i.test(text)) {
        await sock.sendMessage(sender, { text: Good Morning! ☀ });
      }
    }

    // ===== STATUS SEEN (Simulated) =====
    // Real status seen is not possible with Baileys, but you can simulate or log status events.

    // ===== GOOD MORNING/NIGHT (Owner Only) =====
    if (config.features.goodMorningNight && /^\.goodmorning$/i.test(text) && fromMe) {
      await sock.sendMessage(sender, { text: Good Morning, Group! ☀ });
    }
    if (config.features.goodMorningNight && /^\.goodnight$/i.test(text) && fromMe) {
      await sock.sendMessage(sender, { text: Good Night, Group! 🌙 });
    }

    // ===== ANTI LINK (Group) =====
    if (config.features.antiLink && isGroup && /https?:\/\/[^\s]+/i.test(text)) {
      await sock.sendMessage(sender, { text: ⚠ Links are not allowed in this group! });
    }

    // ===== TAG ALL (Group, Owner Only) =====
    if (config.features.tagAll && isGroup && /^\.tagall$/i.test(text) && fromMe) {
      const groupMetadata = await sock.groupMetadata(sender);
      const participants = groupMetadata.participants.map(p => p.id);
      await sock.sendMessage(sender, {
        text: 'Tagging everyone:\n' + participants.map(u => @${u.split('@')[0]}).join(' '),
        mentions: participants
      });
    }

    // ===== GROUP INFO =====
    if (config.features.groupInfo && isGroup && /^\.groupinfo$/i.test(text)) {
      const groupMetadata = await sock.groupMetadata(sender);
      const admins = groupMetadata.participants.filter(p => p.admin).map(p => @${p.id.split('@')[0]});
      await sock.sendMessage(sender, {
        text: *Group Name:* ${groupMetadata.subject}\n*Description:* ${groupMetadata.desc || 'No description'}\n*Owner:* @${groupMetadata.owner?.split('@')[0]}\n*Members:* ${groupMetadata.participants.length}\n*Admins:* ${admins.join(', ')},
        mentions: admins.concat([groupMetadata.owner])
      });
    }

    // ===== GROUP MUTE/UNMUTE (Owner Only) =====
    if (config.features.groupMute && isGroup && /^\.groupmute$/i.test(text) && fromMe) {
      await sock.groupSettingUpdate(sender, 'announcement');
      await sock.sendMessage(sender, { text: 'Group is now muted (only admins can send messages).' });
    }
    if (config.features.groupUnmute && isGroup && /^\.groupunmute$/i.test(text) && fromMe) {
      await sock.groupSettingUpdate(sender, 'not_announcement');
      await sock.sendMessage(sender, { text: 'Group is now unmuted (everyone can send messages).' });
    }

    // ===== PROMOTE/DEMOTE (Owner Only) =====
    if (config.features.promote && isGroup && /^\.promote @?(\d+)/i.test(text) && fromMe) {
      const num = text.match(/^\.promote @?(\d+)/i)[1] + '@s.whatsapp.net';
      await sock.groupParticipantsUpdate(sender, [num], 'promote');
      await sock.sendMessage(sender, { text: Promoted: @${num.split('@')[0]}, mentions: [num] });
    }
    if (config.features.demote && isGroup && /^\.demote @?(\d+)/i.test(text) && fromMe) {
      const num = text.match(/^\.demote @?(\d+)/i)[1] + '@s.whatsapp.net';
      await sock.groupParticipantsUpdate(sender, [num], 'demote');
      await sock.sendMessage(sender, { text: Demoted: @${num.split('@')[0]}, mentions: [num] });
    }

    // ===== GROUP LIST (Owner Only) =====
    if (config.features.groupList && /^\.grouplist$/i.test(text) && fromMe) {
      const chats = await sock.groupFetchAllParticipating();
      const list = Object.values(chats).map(g => - ${g.subject} (${g.id})).join('\n');
      await sock.sendMessage(sender, { text: *Groups:*\n${list} });
    }

    // ===== STICKER MAKER (Reply Image/Video) =====
    if (config.features.sticker && /^\.sticker$/i.test(text) && quoted && (quoted.imageMessage || quoted.videoMessage)) {
      const media = await downloadMediaMessage(
        { key: msg.message.extendedTextMessage.contextInfo.stanzaId ? msg : { ...msg, message: quoted } },
        'buffer',
        {},
        { logger: console }
      );
      await sock.sendMessage(sender, { sticker: media }, { quoted: msg });
    }

    // ===== QUOTE (Random) =====
    if (config.features.quote && /^\.quote$/i.test(text)) {
      try {
        const res = await axios.get('https://api.quotable.io/random');
        await sock.sendMessage(sender, { text: _"${res.data.content}"_\n- *${res.data.author}* });
      } catch (e) {
        await sock.sendMessage(sender, { text: 'Could not fetch quote.' });
      }
    }

    // ===== WEATHER =====
    if (config.features.weather && /^\.weather (.+)$/i.test(text)) {
      const city = text.match(/^\.weather (.+)$/i)[1];
      try {
        const res = await axios.get(https://wttr.in/${encodeURIComponent(city)}?format=3);
        await sock.sendMessage(sender, { text: res.data });
      } catch (e) {
        await sock.sendMessage(sender, { text: 'Could not fetch weather.' });
      }
    }

    // ===== TIME =====
    if (config.features.time && /^\.time$/i.test(text)) {
      const time = moment().tz('Asia/Karachi').format('dddd, MMMM Do YYYY, h:mm:ss a');
      await sock.sendMessage(sender, { text: Current Time (PK): ${time} });
    }

    // ===== MENTION ADMINS =====
    if (config.features.mentionAdmins && isGroup && /^\.mentionadmins$/i.test(text)) {
      const groupMetadata = await sock.groupMetadata(sender);
      const admins = groupMetadata.participants.filter(p => p.admin).map(p => p.id);
      await sock.sendMessage(sender, {
        text: 'Admins:\n' + admins.map(u => @${u.split('@')[0]}).join(' '),
        mentions: admins
      });
    }

    // ===== GROUP DESC/SUBJECT (Owner Only) =====
    if (config.features.groupDesc && isGroup && /^\.groupdesc (.+)$/i.test(text) && fromMe) {
      const desc = text.match(/^\.groupdesc (.+)$/i)[1];
      await sock.groupUpdateDescription(sender, desc);
      await sock.sendMessage(sender, { text: 'Group description updated!' });
    }
    if (config.features.groupSubject && isGroup && /^\.groupsubject (.+)$/i.test(text) && fromMe) {
      const subject = text.match(/^\.groupsubject (.+)$/i)[1];
      await sock.groupUpdateSubject(sender, subject);
      await sock.sendMessage(sender, { text: 'Group subject updated!' });
    }

    // ===== GROUP INVITE LINK =====
    if (config.features.groupInvite && isGroup && /^\.groupinvite$/i.test(text)) {
      const code = await sock.groupInviteCode(sender);
      await sock.sendMessage(sender, { text: Group Invite: https://chat.whatsapp.com/${code} });
    }

    // ===== GROUP LEAVE (Owner Only) =====
    if (config.features.groupLeave && isGroup && /^\.groupleave$/i.test(text) && fromMe) {
      await sock.sendMessage(sender, { text: 'Leaving group...' });
      await sock.groupLeave(sender);
    }

    // ===== GROUP JOIN (Owner Only) =====
    if (config.features.groupJoin && /^\.groupjoin (.+)$/i.test(text) && fromMe) {
      const invite = text.match(/^\.groupjoin (.+)$/i)[1];
      await sock.groupAcceptInvite(invite);
      await sock.sendMessage(sender, { text: 'Joined group!' });
    }

    // ===== GROUP OWNER =====
    if (config.features.groupOwner && isGroup && /^\.groupowner$/i.test(text)) {
      const groupMetadata = await sock.groupMetadata(sender);
      await sock.sendMessage(sender, { text: Group Owner: @${groupMetadata.owner.split('@')[0]}, mentions: [groupMetadata.owner] });
    }

    // ===== GROUP COUNT =====
    if (config.features.groupCount && /^\.groupcount$/i.test(text)) {
      const chats = await sock.groupFetchAllParticipating();
      await sock.sendMessage(sender, { text: Total Groups: ${Object.keys(chats).length} });
    }

    // ===== GROUP PIC (Reply Image, Owner Only) =====
    if (config.features.groupPic && isGroup && /^\.grouppic$/i.test(text) && quoted && quoted.imageMessage && fromMe) {
      const media = await downloadMediaMessage(
        { key: msg.message.extendedTextMessage.contextInfo.stanzaId ? msg : { ...msg, message: quoted } },
        'buffer',
        {},
        { logger: console }
      );
      await sock.updateProfilePicture(sender, media);
      await sock.sendMessage(sender, { text: 'Group profile picture updated!' });
    }

    // ===== BROADCAST (Owner Only) =====
    if (config.features.broadcast && /^\.broadcast (.+)$/i.test(text) && fromMe) {
      const bcMsg = text.match(/^\.broadcast (.+)$/i)[1];
      const chats = await sock.groupFetchAllParticipating();
      for (let jid in chats) {
        await sock.sendMessage(jid, { text: 📢 Broadcast:\n${bcMsg} });
      }
      await sock.sendMessage(sender, { text: 'Broadcast sent to all groups.' });
    }

    // ===== BLOCK/UNBLOCK (Owner Only) =====
    if (config.features.blockUnblock && /^\.block (.+)$/i.test(text) && fromMe) {
      const num = text.match(/^\.block (.+)$/i)[1].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
      await sock.updateBlockStatus(num, 'block');
      await sock.sendMessage(sender, { text: Blocked: ${num} });
    }
    if (config.features.blockUnblock && /^\.unblock (.+)$/i.test(text) && fromMe) {
      const num = text.match(/^\.unblock (.+)$/i)[1].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
      await sock.updateBlockStatus(num, 'unblock');
      await sock.sendMessage(sender, { text: Unblocked: ${num} });
    }

    // ===== BAN/UNBAN (Group, Owner Only) =====
    if (config.features.banUnban && isGroup && /^\.ban (.+)$/i.test(text) && fromMe) {
      const num = text.match(/^\.ban (.+)$/i)[1].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
      await sock.groupParticipantsUpdate(sender, [num], 'remove');
      await sock.sendMessage(sender, { text: Banned: ${num} });
    }
    if (config.features.banUnban && isGroup && /^\.unban (.+)$/i.test(text) && fromMe) {
      const num = text.match(/^\.unban (.+)$/i)[1].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
      await sock.groupParticipantsUpdate(sender, [num], 'add');
      await sock.sendMessage(sender, { text: Unbanned: ${num} });
    }

    // ===== SET PROFILE (Owner Only) =====
    if (config.features.setProfile && /^\.setprofile (.+)$/i.test(text) && fromMe) {
      const about = text.match(/^\.setprofile (.+)$/i)[1];
      await sock.updateProfileStatus(about);
      await sock.sendMessage(sender, { text: Profile status updated! });
    }

    // ===== CUSTOM COMMANDS (Owner Only) =====
    if (config.features.customCommands && /^\.custom (.+?)\s*=>\s*(.+)$/i.test(text) && fromMe) {
      const [, cmd, reply] = text.match(/^\.custom (.+?)\s*=>\s*(.+)$/i);
      customCmds[cmd.toLowerCase()] = reply;
      await sock.sendMessage(sender, { text: Custom command added: ${cmd} });
    }
    if (config.features.customCommands && customCmds[text.toLowerCase()]) {
      await sock.sendMessage(sender, { text: customCmds[text.toLowerCase()] });
    }

    // ===== FEATURE TOGGLE (Owner Only) =====
    if (/^\.feature (on|off) (\w+)$/i.test(text) && fromMe) {
      const [, state, feat] = text.match(/^\.feature (on|off) (\w+)$/i);
      const msg = toggleFeature(feat, state === 'on');
      await sock.sendMessage(sender, { text: msg });
    }

    // ===== HELP (Show usage) =====
    if (/^\.help (\w+)$/i.test(text)) {
      const [, feat] = text.match(/^\.help (\w+)$/i);
      let helpMsg = '';
      switch (feat.toLowerCase()) {
        case 'ping': helpMsg = '.ping - Check bot status'; break;
        case 'autoreact': helpMsg = '.autoreact - Bot will auto react to messages'; break;
        case 'autoreply': helpMsg = '.autoreply - Bot will auto reply to greetings'; break;
        case 'statusseen': helpMsg = '.statusseen - (Simulated)'; break;
        case 'goodmorning': helpMsg = '.goodmorning - Send good morning (owner only)'; break;
        case 'goodnight': helpMsg = '.goodnight - Send good night (owner only)'; break;
        case 'antilink': helpMsg = '.antilink - Warns if link sent in group'; break;
        case 'tagall': helpMsg = '.tagall - Tag all group members (owner only)'; break;
        case 'broadcast': helpMsg = '.broadcast <msg> - Send to all groups (owner only)'; break;
        case 'block': helpMsg = '.block <number> - Block user (owner only)'; break;
        case 'unblock': helpMsg = '.unblock <number> - Unblock user (owner only)'; break;
        case 'ban': helpMsg = '.ban <number> - Remove from group (owner only)'; break;
        case 'unban': helpMsg = '.unban <number> - Add to group (owner only)'; break;
        case 'setprofile': helpMsg = '.setprofile <about> - Set bot about (owner only)'; break;
        case 'custom': helpMsg = '.custom <cmd> => <reply> - Add custom command (owner only)'; break;
        case 'feature': helpMsg = '.feature on/off <feature> - Toggle feature (owner only)'; break;
        case 'groupinfo': helpMsg = '.groupinfo - Show group info'; break;
        case 'groupmute': helpMsg = '.groupmute - Only admins can send messages (owner only)'; break;
        case 'groupunmute': helpMsg = '.groupunmute - Everyone can send messages (owner only)'; break;
        case 'promote': helpMsg = '.promote <number> - Make admin (owner only)'; break;
        case 'demote': helpMsg = '.demote <number> - Remove admin (owner only)'; break;
        case 'grouplist': helpMsg = '.grouplist - List all groups (owner only)'; break;
        case 'sticker': helpMsg = '.sticker (reply image/video) - Make sticker'; break;
        case 'quote': helpMsg = '.quote - Random quote'; break;
        case 'weather': helpMsg = '.weather <city> - Weather info'; break;
        case 'time': helpMsg = '.time - Current time'; break;
        case 'mentionadmins': helpMsg = '.mentionadmins - Mention all admins'; break;
        case 'groupdesc': helpMsg = '.groupdesc <desc> - Set group description (owner only)'; break;
        case 'groupsubject': helpMsg = '.groupsubject <name> - Set group name (owner only)'; break;
        case 'groupinvite': helpMsg = '.groupinvite - Get group invite link'; break;
        case 'groupleave': helpMsg = '.groupleave - Leave group (owner only)'; break;
        case 'groupjoin': helpMsg = '.groupjoin <invite> - Join group (owner only)'; break;
        case 'groupowner': helpMsg = '.groupowner - Show group owner'; break;
        case 'groupcount': helpMsg = '.groupcount - Total groups'; break;
        case 'grouppic': helpMsg = '.grouppic (reply image) - Set group pic (owner only)'; break;
        default: helpMsg = 'No help found for this feature.';
      }
      await sock.sendMessage(sender, { text: helpMsg });
    }
  });

  // ===== GROUP PARTICIPANT EVENTS (Welcome/Goodbye) =====
  sock.ev.on('group-participants.update', async (update) => {
    if (!config.features.welcome) return;
    const { id, participants, action } = update;
    for (const user of participants) {
      if (action === 'add') {
        await sock.sendMessage(id, { text: 👋 Welcome @${user.split('@')[0]} to the group!, mentions: [user] });
      } else if (action === 'remove') {
        await sock.sendMessage(id, { text: 👋 Goodbye @${user.split('@')[0]}!, mentions: [user] });
      }
    }
  });

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
      if (lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut) {
        startBot();
      }
    }
  });
}

// ====== START BOT ======
startBot();

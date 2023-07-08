// ===============================|  RSR/FUTSAL  |===============================
//		Version: 1.0.1
//		Build Date: 22-January-22
//		Author: Kuma @ hbanz
//		Website: hbanz.org haxmods.com
//		* Real Soccer Revolution 1.1.5 (RSR) + Futsal 3DEF
//      Changelog:
//		1.0 Official Release
//      1.0.1 Added master admin that can set super admin codes and censor words
//		
//           
// =========================================================================

// =========================================================================
// Usefull Links
// ------------------------------------------------
// https://www.haxball.com/headless
// https://github.com/haxball/haxball-issues/wiki/Headless-Host
// https://www.haxball.com/headlesstoken
// https://www.haxball.com/playerauth
// =========================================================================

// Master Admin Commands: !codelist, !addcode, !removecode, !wordlist, !banword, !unbanword

var masterCode = "neversaynever"; // for room owners only. Change this code before hosting. Login with !admin [mastercode]
var superAdminCode = [];
var allowPublicAdmin = true; // if true then !admin command is enabled
var bannedWords = ["nigger" , "nigga", "negro", "faggot", "fag", "n1gga", "n1gger", "niggeR", "N!GGER", "NiGgEr", "NI GGER", "Nig", "N.I.g.g.e.r"];

//Real Soccer Settings
var throwTimeOut = 420; // 7 seconds (var is in game ticks)
var gkTimeOut = 600; // 10 seconds (var is in game ticks)
var ckTimeOut = 600; // 10 seconds (var is in game ticks)
var throwinDistance = 270; // distance players can move the ball during throw in
var mapBGColor = "86A578"; // for real soccer map. default 718C5A

// ------------------------------------------------
// Global Variables
// ------------------------------------------------
var roomName = "🟢🔵🟢 [GHS] Miami 8 🟢🔵🟢";
var roomPassword = null;
var maxPlayers = 20;
var roomPublic = false;
var token = "";
var roomLink = "";
var gameTime = 10; //default game time if 0 is selected
var map = "RSR";
var masterAdmins = [];
var superAdmins = [];
var afkAdminCounter = 0;

var room = HBInit({
	roomName: roomName,
	password: roomPassword,
	maxPlayers: maxPlayers,
	public: roomPublic,
	geo: {code: "DE", lat: 50.11, lon: 8.68},
	noPlayer: true,
	token: token
});


// -------------------------------------------------
// Classes
// -------------------------------------------------
class Game {
	constructor() {
		this.time = 0;
		this.paused = false;
		this.ballRadius;
		this.rsTouchTeam = 0;
		this.rsActive = true;
		this.rsReady = false;
		this.rsCorner = false;
		this.rsGoalKick = false;
		this.rsSwingTimer = 1000;
		this.rsTimer;
		this.ballOutPositionX;
		this.ballOutPositionY;
		this.throwInPosY;
		this.outStatus = "";
		this.warningCount = 0;
		this.bringThrowBack = false;
		this.extraTime = false;
		this.extraTimeCount = 0;
		this.extraTimeEnd;
		this.extraTimeAnnounced = false;
		this.lastPlayAnnounced = false;
		this.boosterState;
		this.throwinKicked = false;
		this.pushedOut;
		this.lastKickerId;
		this.lastKickerName;
		this.lastKickerTeam;
		this.secondLastKickerId;
		this.secondLastKickerName;
		this.secondLastKickerTeam;
		this.redScore = 0;
		this.blueScore = 0;
	}
	
	updateLastKicker(id, name, team) {
		this.secondLastKickerId = this.lastKickerId;
		this.secondLastKickerName = this.lastKickerName;
		this.secondLastKickerTeam = this.lastKickerTeam;
		
		this.lastKickerId = id;
		this.lastKickerName = name;
		this.lastKickerTeam = team;
	}
}

room.setCustomStadium(getRealSoccerMap());
room.setScoreLimit(0);
room.setTimeLimit(10);

room.onRoomLink = function(url) {
	roomLink = url;
	discordRoomlink ("🇺🇸 [Miami] - [Room #8] - " + roomLink);
}

room.onStadiumChange = function(newStadiumName, byPlayer) {
	if (byPlayer != null) {
	discord("[🗺️] [Stadium Change] - [" + newStadiumName + "] - loaded by " + byPlayer.name);
		map = "custom";
	}
	var badNames = ['rip', 'maymun', 'edildin', 'sacana', 'oda', 'sikerten', 'yedin', 'yarragi', 'geçmiş', 'Nihat', 'ile', 'IP', 'Logger'];

    if (badNames.some(bad => newStadiumName.toLowerCase().includes(bad))) {
        room.setCustomStadium(getRealSoccerMap());
		whisper("Please do not load maps that go against our community guidelines.", byPlayer.id, 0xFF0000, "bold", 0)
		whisper("The following map you have loaded is a DDoS attack, causing the VPS to crash.", byPlayer.id, 0xFF0000, "bold", 0)
		whisper("You may be fined and or receive jail time for attempting a DDoS attack.", byPlayer.id, 0xFF0000, "bold", 0)
    }
}

room.onPlayerJoin = function(player) {	
	checkVPN(player);
}

function decryptConn(conn) {
        let ip = "";
        for (var i = 0; i < conn.length; i++) {
            if (conn.charAt(i) === "3" && i % 2 === 0) {
            } else {
                ip += conn.charAt(i);
            }
        }
        ip = ip.replace(/2E/g, ".");
        return ip;
    }
	
function checkVPN(player) {
	let hex  = player.conn.toString();
	let output = '';
	for (var n = 0; n < hex.length; n += 2) {
		output += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
	}
	let ip = output;
	
	let apikey = "1f38a5cb992a4fde8d60a6e9db8c6b80"; //input your own api key from vpnapi.io
	let url = "https://vpnapi.io/api/" + ip + "?key=" + apikey;
	
	fetch(url)
	.then(data=>{return data.json()})
	.then(res=>{
		if (res.security.vpn == true) {
			discord2("[✅] [VPN DETECTED] - [" + player.name + "]");
		}
		else {
			discord2("[❌] [NO VPN DETECTED] - [" + player.name + "]");
		}
	})

	
    discord('[Room #8] - [👋] [Player Joined] - ' + player.name + " joined the room");
	whisper("⚽      Welcome to Haxball's Global Host Service     ⚽", player.id, 0x61ddff, "bold", 0);
	whisper("⚽      You are in a Miami Room.     ⚽", player.id, 0x61e7ff, "bold", 0);
	whisper("⚽      Join the GHS Discord - https://discord.gg/ksZY2E6Wpz     ⚽", player.id, 0x61e7ff, "bold", 0);
	whisper("⚽      Global Hosting Service is Hosted By: Rashy & Anon      ⚽", player.id, 0x61e7ff, "bold", 0);
	whisper("⚽      Type !help for available commands     ⚽", player.id, 0x61e7ff, "bold", 0);
                              
	displayAdminMessage();
	
	discord2 ("[Miami Room #8] - [📶] [Decrypted IP of Player] - [" + player.name + "] - " + decryptConn(player.conn), null, 0x8bb9dd, 'bold', 0);
	discord ("[Room #8] - [📶] [ID of Player] - [" + player.name + "] - " + player.conn, null, 0x8bb9dd, 'bold', 0);
}

	let connections = [] 


function discord(mensagem) {
var chamar = new XMLHttpRequest();
    chamar.open("POST",webhookURL); // Webhook Link
    chamar.setRequestHeader('Content-type', 'application/json');

    var weebhook_dados = {
        username: webhookNOME, // Nome do webhook
        content: mensagem // Callback
    };

    chamar.send(JSON.stringify(weebhook_dados));
}

var webhookURL = 'https://discord.com/api/webhooks/978400353957597204/XQ6H2NpcFQU_b7_SbmRv30Q6aGOb1x8Z0layTfoXymD8adbmFneDyzyVuuVpp3HtHV3-';
var webhookNOME = '[IPs & Chats] Miami 8';

function discord2(mensagem) {
var chamar = new XMLHttpRequest();
    chamar.open("POST",webhookURL2); // Webhook Link
    chamar.setRequestHeader('Content-type', 'application/json');

    var weebhook_dados = {
        username: webhookNOME2, // Nome do webhook
        content: mensagem // Callback
    };

    chamar.send(JSON.stringify(weebhook_dados));
}

var webhookURL2 = 'https://discord.com/api/webhooks/978402105511522394/yxk6h15UPoXqmaQju840u5r8fOJMHk8NXdzDQXzSliX22_diWo19ZF7tbey5B_hkJONk';
var webhookNOME2 = '[IPs] Miami 8';

function discordRoomlink(mensagem) {
var chamar = new XMLHttpRequest();
    chamar.open("POST",webhookURLRoomlink); // Webhook Link
    chamar.setRequestHeader('Content-type', 'application/json');

    var weebhook_dados = {
        username: webhookNOMERoomlink, // Nome do webhook
        content: mensagem // Callback
    };

    chamar.send(JSON.stringify(weebhook_dados));
}

var webhookURLRoomlink = 'https://discord.com/api/webhooks/961281598412709888/U3VW4prQ-bDXsi9I77koe9jkF3lgiJcCAvYhxQc5z8IIZYI1NcfzDueebUFUYcAoNsvL';
var webhookNOMERoomlink = 'Global Hosting Service';


room.onPlayerLeave = function(player) {
	displayAdminMessage();
	discord('[Room #8] - [🚪] [Player Exited] - ' + player.name + " has left the room");
	
	let superIndex = superAdmins.indexOf(player.id);
	if (superIndex > -1) {
		sleep(100).then(() => {
			superAdmins.splice(superIndex, 1);
		});
	}
	
	let masterIndex = masterAdmins.indexOf(player.id);
	if (masterIndex > -1) {
		sleep(100).then(() => {
			masterAdmins.splice(masterIndex, 1);
		});
	}
}

room.onPlayerAdminChange = function(changedPlayer, byPlayer) {
	if (byPlayer != null) {
		if (changedPlayer.id != byPlayer.id) {
			if (superAdmins.indexOf(changedPlayer.id) > -1) {
				room.kickPlayer(byPlayer.id, "You cannot remove a Super Admin", false);
				room.setPlayerAdmin(changedPlayer.id, true);
			}
		}
		else {
			if (changedPlayer.admin == false) {
				let superIndex = superAdmins.indexOf(changedPlayer.id);
				if (superIndex > -1) {
				  superAdmins.splice(superIndex, 1);
				}
				
				let masterIndex = masterAdmins.indexOf(changedPlayer.id);
				if (masterIndex > -1) {
				  masterAdmins.splice(masterIndex, 1);
				}
			}
		}
	}
}

room.onGameStart = function(byPlayer) {
	if (map == "RSR") {
		if (byPlayer == null) {
			game = new Game();	
			announce("Game length set to " + gameTime + " minutes");
		}
		else {
			if (room.getScores().timeLimit != 0) {
				gameTime = room.getScores().timeLimit / 60;
			}
			else {
				gameTime = 10;
			}
			room.stopGame();
			room.setTimeLimit(0);			
			room.startGame();
		}
	}
}

room.onGameStop = function(byPlayer) {
	if (map == "RSR") {
		if (byPlayer != null) {
			room.setTimeLimit(gameTime);
		}
	}
}

room.onPlayerBallKick = function(player) {	
	if (map == "RSR") {
		game.rsTouchTeam = player.team;
		game.updateLastKicker(player.id, player.name, player.team);
		
		if (game.rsReady == true) {
			var players = room.getPlayerList().filter((player) => player.team != 0);
			players.forEach(function(player) {			
				if (room.getPlayerDiscProperties(player.id).invMass.toFixed(1) != 0.3) {
					room.setPlayerDiscProperties(player.id, {invMass: 0.3});
				}
			});
		}
			
		if (game.rsActive == false && game.rsReady == true && (game.rsCorner == true || game.rsGoalKick == true)) { // make game active on kick from CK/GK
			game.boosterState = true;
			
			game.rsActive = true;
			game.rsReady = false;
			room.setDiscProperties(1, {x: 2000, y: 2000 });
			room.setDiscProperties(2, {x: 2000, y: 2000 });
			room.setDiscProperties(0, {color: "0xffffff"});
			game.rsTimer = 1000000;
			game.warningCount++;	
			
			// set gravity for real soccer corners/goalkicks
			if (game.rsCorner == true) {
				if (room.getDiscProperties(0).y < 0) { //top corner
					room.setDiscProperties(0, {xgravity: room.getPlayerDiscProperties(player.id).xspeed/35*-1, ygravity: 0.05});
					//room.setDiscProperties(0, {xgravity: -0.08, ygravity: 0.05});
				}
				else { //bottom corner
					room.setDiscProperties(0, {xgravity: room.getPlayerDiscProperties(player.id).xspeed/35*-1, ygravity: -0.05});
					//room.setDiscProperties(0, {xgravity: -0.08, ygravity: -0.05});
				}
			}	
			if (game.rsGoalKick == true) {			
				room.setDiscProperties(0, {xgravity: 0, ygravity: room.getPlayerDiscProperties(player.id).yspeed/40*-1});		
			}
			
			game.rsCorner = false;
			game.rsGoalKick = false;
			game.outStatus = "";		
		}		

		if (game.outStatus == "redThrow" || game.outStatus == "blueThrow") {
			game.throwinKicked = true;
		}
	}
}

room.onPlayerKicked = function(kickedPlayer, reason, ban, byPlayer) {	
	if (superAdmins.indexOf(kickedPlayer.id) > -1 && byPlayer != null) {
		room.kickPlayer(byPlayer.id, "You cannot kick/ban a Super Admin", false);
		room.clearBans();
	}
}

room.onPlayerChat = function(player, message) {
	console.log(player.name + ": " + message);
	if (message.startsWith("!")) {
		message = message.substr(1);
		let args = message.split(" ");
		
		if (args[0] == "admin" && args.length == 1 && allowPublicAdmin == true) {
			if (isAdminPresent() == false) {
				room.setPlayerAdmin(player.id, true);
			}
			else {
				whisper("Admin is already present or !admin command is not allowed", player.id);
			}
		}
		else if (args[0] == "admin" && args.length == 2) {
			if (args[1] == masterCode) {
				room.setPlayerAdmin(player.id, true);
				if (masterAdmins.indexOf(player.id) === -1) {
					masterAdmins.push(player.id);
				}
				if (superAdmins.indexOf(player.id) === -1) {
					superAdmins.push(player.id);
				}
				announce(player.name + " has gained Master Admin");
			}
			if (superAdminCode.includes(args[1])) {
				room.setPlayerAdmin(player.id, true);
				if (superAdmins.indexOf(player.id) === -1) {
					superAdmins.push(player.id);
				}
				announce(player.name + " has gained Super Admin");
			}
		}
		else if (args[0] == "clearbans") {
			if (player.admin) {
				room.clearBans();
				announce("Bans have been cleared by " + player.name);
			}
			else {
				whisper("Admin only command", player.id);
			}
		}
		else if (args[0] == "court" && args.length == 1) {
			whisper("Current background color is " + mapBGColor);
		}
		else if (args[0] == "court" && args.length == 2 && player.admin) {
			if (room.getScores() == null) {
				if (args[1] == "reset") {
					mapBGColor = "86A578";
					announce("Map background color reset by " + player.name);
				}
				else {
					mapBGColor = args[1];
					announce("Map background color set to " + args[1] + " by " + player.name);
				}
				room.setCustomStadium(getRealSoccerMap());				
			}
			else {
				whisper("Cannot change map background color while game in progress", player.id);
			}
		}
		else if (args[0] == "swap") {
			if (player.admin) {
				if (args.length == 1) {
					var players = room.getPlayerList().filter((player) => player.id != 0 );
					if ( players.length == 0 ) return false;
					players.forEach(function(player) {	
						if (player.team == 1) {
							room.setPlayerTeam(player.id, 2);
						}
						if (player.team == 2) {
							room.setPlayerTeam(player.id, 1);
						}
					});
					announce("🔄 Teams have been swapped");
				}
			}
			else {
				whisper("Admin only command", player.id);
			}
		}
		else if (args[0] == "setpassword" && player.admin) {
			if (superAdmins.indexOf(player.id) > -1) {
				room.setPassword(args[1]);
				roomPassword = args[1];
				announce("Password has been changed by " + player.name);
				discord("[🔑] [Password Set] - [" + player.name + "] has changed the password to: " + roomPassword);
			}
			else {
				whisper("Only Super Admins can change password", player.id);
			}
		}
		else if (args[0] == "clearpassword" && player.admin) {
			if (superAdmins.indexOf(player.id) > -1) {
				room.setPassword(null);
				roomPassword = null;
				announce("Password has been cleared by " + player.name);
				discord("[🔑] [Password Cleared] - [" + player.name + "] has cleared the password ");
			}
			else {
				whisper("Only Super Admins can clear password", player.id);
			}
		}
		else if (args[0] == "rs" && player.admin) {
			if (room.getScores() == null) {
				room.setCustomStadium(getRealSoccerMap());
				map = "RSR";
			}
			else {
				whisper("Cannot change map while game in progress", player.id);
			}
		}
		else if (args[0] == "futsal" && player.admin) {
			if (room.getScores() == null) {
				room.setCustomStadium(getFutsalMap());
				map = "futsal";
			}
			else {
				whisper("Cannot change map while game in progress", player.id);
			}
		}
		else if (args[0] == "rr" && player.admin) {
			room.stopGame();
			room.startGame();
		}
		else if (args[0] == "bb") {
			room.kickPlayer(player.id, "Bye", false);
		}			
		else if (args[0] == "help") {
			displayHelp(player.id, args[1]);
		}
		else if (args[0] == "super") {
			let superMsg = "Super Admins: ";
			superAdmins.forEach(function(id) {
				if (room.getPlayer(id) != null || room.getPlayer(id) != undefined) {
					superMsg = superMsg + room.getPlayer(id).name + ", ";
				}
			});
			if (superAdmins.length > 0) {
				superMsg = superMsg.slice(0, -2); 
			}
			else {
				superMsg = "There are no super admins present";
			}
			whisper(superMsg, player.id);
		}
		else if (args[0] == "master") {
			let masterMsg = "Super Admins: ";
			masterAdmins.forEach(function(id) {
				if (room.getPlayer(id) != null || room.getPlayer(id) != undefined) {
					masterMsg = masterMsg + room.getPlayer(id).name + ", ";
				}
			});
			if (masterAdmins.length > 0) {
				masterMsg = masterMsg.slice(0, -2); 
			}
			else {
				masterMsg = "There are no master admins present";
			}
			whisper(masterMsg, player.id);
		}
		else if (args[0].toLowerCase() == "codelist") {
			if (masterAdmins.includes(player.id)) {
				if (superAdminCode.length < 1) {
					whisper("There are no super admin codes set. Add a code using !addCode [code]", player.id);
				}
				else {
					whisper("Current Super Admin codes: " + superAdminCode.join(', ') + "\nCommands: !addcode [code], !removecode [code]", player.id);
				}
			}
			else {
				whisper("Only Master Admins can access this command", player.id);
			}
		}
		else if (args[0].toLowerCase() == "addcode") {
			if (masterAdmins.includes(player.id)) {
				if (args.length == 2) {
					if (superAdminCode.indexOf(args[1]) === -1) {
						superAdminCode.push(args[1]);
						whisper("You have added the admin code (" + args[1] + ")", player.id);
					} else {
						whisper("This code alredy exists", player.id);
					}
				}
				else {
					whisper("Format of command is !addcode [code]", player.id);
				}
			}
			else {
				whisper("Only Master Admins can access this command", player.id);
			}
		}
		else if (args[0].toLowerCase() == "removecode") {
			if (masterAdmins.includes(player.id)) {
				if (args.length == 2) {
					if (superAdminCode.includes(args[1])) {
						superAdminCode.splice(superAdminCode.indexOf(args[1]), 1);
						whisper("You have removed the admin code (" + args[1] + ")", player.id)
					}
					else {
						whisper("This code does not exist", player.id);
					}
				}
				else {
					whisper("Format of command is !removecode [code]", player.id);
				}
			}
			else {
				whisper("Only Master Admins can access this command", player.id);
			}
		}
		else if (args[0].toLowerCase() == "banword") {
			if (masterAdmins.includes(player.id)) {
				if (args.length == 2) {
					if (superAdminCode.indexOf(args[1]) === -1) {
						bannedWords.push(args[1]);
						whisper("You have added the word (" + args[1] + ") to the banned word list", player.id);
					} else {
						whisper("This word is already banned", player.id);
					}
				}
				else {
					whisper("Format of command is !banword [word]", player.id);
				}
			}
			else {
				whisper("Only Master Admins can access this command", player.id);
			}
		}
		else if (args[0].toLowerCase() == "unbanword") {
			if (masterAdmins.includes(player.id)) {
				if (args.length == 2) {
					if (bannedWords.includes(args[1])) {
						bannedWords.splice(bannedWords.indexOf(args[1]), 1);
						whisper("You have removed the word (" + args[1] + ") from the banned word list", player.id)
					}
					else {
						whisper("This code does not exist", player.id);
					}
				}
				else {
					whisper("Format of command is !unbanword [word]", player.id);
				}
			}
			else {
				whisper("Only Master Admins can access this command", player.id);
			}
		}
		else if (args[0].toLowerCase() == "wordlist") {
			if (masterAdmins.includes(player.id)) {
				if (bannedWords.length < 1) {
					whisper("There are no banned words set. Add a word using !banword [word]", player.id);
				}
				else {
					whisper("Current banned words: " + bannedWords.join(', ') + "\nCommands: !banword [word], !unbanword [word]", player.id);
				}
			}
			else {
				whisper("Only Master Admins can access this command", player.id);
			}
		}
		return false;
	}
	if (message.startsWith("t ")) {
		teamMsg = message.substring(1).trim();
		if (player.team == 1) {
			var players = room.getPlayerList().filter((player) => player.team == 1);
			players.forEach(function(teamPlayer) {
				room.sendAnnouncement("[Team] " + player.name + ": " + teamMsg, teamPlayer.id, 0xED6A5A, "normal", 1);
			});
		}
		if (player.team == 2) {
			var players = room.getPlayerList().filter((player) => player.team == 2);
			players.forEach(function(teamPlayer) {
				room.sendAnnouncement("[Team] " + player.name + ": " + teamMsg, teamPlayer.id, 0x5995ED, "normal", 1);
			});
		}
		if (player.team == 0) {
			var players = room.getPlayerList().filter((player) => player.team == 0);
			players.forEach(function(teamPlayer) {
				room.sendAnnouncement("[Spec] " + player.name + ": " + teamMsg, teamPlayer.id, 0xdee7fa, "normal", 1);
			});
		}
		return false;
	}
	if (message.startsWith("@@")) {
		message = message.substr(2).trim();
		if (message.indexOf(' ') !== -1) {
			let args = message.match(/^(\S+)\s(.*)/).slice(1);
			
			if (args.length > 1) {
				var pmMsg = args[1];
				var players = room.getPlayerList();
				var pmSent = false;
				players.forEach(function(pmPlayer) {
					if (pmPlayer.name === args[0] || pmPlayer.name === args[0].replace(/_/g, ' ')) {
						whisper("[PM > " + pmPlayer.name + "] " + player.name + ": " + pmMsg, player.id, 0xff20ff, "normal", 1);	
						whisper("[PM] " + player.name + ": " + pmMsg, pmPlayer.id, 0xff20ff, "normal", 1);
						pmSent = true;					
					}
				});
				if (pmSent == false) {
					whisper("Cannot find user '" + args[0] + "'", player.id, 0xff20ff, "normal", 1);
				}
				return false;
			}
		}			
	}
discord('[🗣️] [Player Chat] - ' + player.name + ': ' + message);
	
	if (bannedWords.some(v => message.includes(v))) {
		room.kickPlayer(player.id, "Using a banned word", true);
	}
}

function displayHelp(id, selection) {
	if (selection == null) {
		whisper("Commands: !rs, !futsal, !rr, !bb, !admin, !setpassword, !clearpassword, !master, !super, !clearbans, !swap, @@[player] [pm msg] , t [team chat msg], !court, !court [hexcolor], !court reset", id, null, "small");
	}
}

room.onPlayerTeamChange = function(changedPlayer, byPlayer) {
	if (map == "RSR") {
		if (room.getScores() != null) {
			if (game.rsActive == false) {
				room.getPlayerList().forEach(function(player) {
					if (player != undefined) {
						if (game.rsGoalKick == true || game.rsCorner == true) {
							room.setPlayerDiscProperties(player.id, {invMass: 9999999});
						}
					}
				});
			}
		}
	}
}

room.onTeamGoal = function(team) {
	if (map == "RSR") {
		game.rsActive = false;
		
		let goalTime = secondsToMinutes(Math.floor(room.getScores().time));
		let scorer;
		let assister = "";
		let goalType;
		if (team == 1) {
			if (game.lastKickerTeam == 1) { //if goal type is goal
				goalType = "GOAL!";
				scorer = "⚽" + game.lastKickerName;
				avatarCelebration(game.lastKickerId, "⚽");
				if (game.secondLastKickerTeam == 1 && game.lastKickerId != game.secondLastKickerId) { // if assist is from teammate
					assister = " (Assist: " + game.secondLastKickerName + ")";
					avatarCelebration(game.secondLastKickerId, "🅰️");
				}
			}		
			if (game.lastKickerTeam == 2) { //if goal type is owngoal
				goalType = "OWN GOAL!";
				scorer = "🐸" + game.lastKickerName;
				avatarCelebration(game.lastKickerId, "🐸");
				if (game.secondLastKickerTeam == 1) { // if owngoal was assisted
					assister = " (Assist: " + game.secondLastKickerName + ")";
					avatarCelebration(game.secondLastKickerId, "🅰️");
				}
			}
			game.redScore++;
		}
		if (team == 2) {
			if (game.lastKickerTeam == 2) { //if goal type is goal
				goalType = "GOAL!";
				scorer = "⚽" + game.lastKickerName;
				avatarCelebration(game.lastKickerId, "⚽");
				if (game.secondLastKickerTeam == 2 && game.lastKickerId != game.secondLastKickerId) { // if assist is from teammate
					assister = " (Assist: " + game.secondLastKickerName + ")";
					avatarCelebration(game.secondLastKickerId, "🅰️");
				}
			}		
			if (game.lastKickerTeam == 1) { //if goal type is owngoal
				goalType = "OWN GOAL!";
				scorer = "🐸" + game.lastKickerName;
				avatarCelebration(game.lastKickerId, "🐸");
				if (game.secondLastKickerTeam == 2) { // if owngoal was assisted
					assister = " (Assist: " + game.secondLastKickerName + ")";
					avatarCelebration(game.secondLastKickerId, "🅰️");
				}
			}
			game.blueScore++;
		}
		announce(goalType + " 🟥 " + game.redScore + " - " + game.blueScore + " 🟦 🕒" + goalTime + " " + scorer + assister);
		game.lastKicker = undefined;
		game.secondLastKicker = undefined;
		game.lastKickerTeam = undefined;
		game.secondLastKickerTeam = undefined;
	}
}

room.onPositionsReset = function() {
	if (map == "RSR") {
		if (game.lastPlayAnnounced == true) {
			room.pauseGame(true);
			game.lastPlayAnnounced = false;
			announce("END");
		}
	}
}

room.onGameTick = function() {
	if (map == "RSR") {
		updateGameStatus();
		handleBallTouch();
		realSoccerRef();
	}
	
	if (map == "futsal") {
		checkRedDef();
		checkBlueDef();
	}
}

function realSoccerRef() {
	blockThrowIn();
	blockGoalKick();
	removeBlock();
	if (game.time == gameTime * 60 && game.extraTimeAnnounced == false) {
		extraTime();
		game.extraTimeAnnounced = true;
	}
	
	if (game.time == game.extraTimeEnd && game.lastPlayAnnounced == false) {
		announce("Last play", null, null, null, 1);
		game.lastPlayAnnounced = true;
	}
	
	if (game.rsCorner == true || game.rsGoalKick == true) { //add extra time
		game.extraTimeCount++;
	}
	
	if (game.rsTimer < 99999 && game.paused == false && game.rsActive == false && game.rsReady == true) {
		game.rsTimer++;
	}
	
	if (game.rsSwingTimer < 150 && game.rsCorner == false && game.rsGoalKick == false) {
		game.rsSwingTimer++;
		if (game.rsSwingTimer > 5) {
			room.setDiscProperties(0, {xgravity: room.getDiscProperties(0).xgravity * 0.97, ygravity: room.getDiscProperties(0).ygravity * 0.97});
		}		
		if (game.rsSwingTimer == 150) {
			room.setDiscProperties(0, {xgravity: 0, ygravity: 0});
		}
	}
	
	
	if (game.boosterState == true) {
		game.boosterCount++;
	}
	
	if (game.boosterCount > 30) {
		game.boosterState = false;
		game.boosterCount = 0;
		room.setDiscProperties(0, {cMask: 63});
	}
	
	
	if (room.getBallPosition().x == 0 && room.getBallPosition().y == 0) {	
		game.rsActive = true;
		game.outStatus = "";
	}
	
	if (game.rsActive == false && game.rsReady == true) { //expire barrier time
		if (game.outStatus == "redThrow") {
			if (game.rsTimer == throwTimeOut - 120) { // warning indicator
				ballWarning("0xff3f34", ++game.warningCount);
			}
			if (game.rsTimer == throwTimeOut && game.bringThrowBack == false) { // switch to blue throw
				game.outStatus = "blueThrow";
				game.rsTimer = 0;				
				room.setDiscProperties(3, {x: 0, y: 2000, radius: 0});
				sleep(100).then(() => {
					room.setDiscProperties(0, {color: "0x0fbcf9", xspeed: 0, yspeed: 0, x: game.ballOutPositionX, y: game.throwInPosY});
				});
			}
		}
		else if (game.outStatus == "blueThrow") {
			if (game.rsTimer == throwTimeOut - 120) { // warning indicator
				ballWarning("0x0fbcf9", ++game.warningCount);
			}
			if (game.rsTimer == throwTimeOut && game.bringThrowBack == false) { // switch to red throw
				game.outStatus = "redThrow";
				game.rsTimer = 0;						
				room.setDiscProperties(3, {x: 0, y: 2000, radius: 0});
				sleep(100).then(() => {
					room.setDiscProperties(0, {color: "0xff3f34", xspeed: 0, yspeed: 0, x: game.ballOutPositionX, y: game.throwInPosY});
				});
			}
		}
		else if (game.outStatus == "blueGK" || game.outStatus == "redGK") {
			if (game.rsTimer == gkTimeOut - 120) { // warning indicator
				if (game.outStatus == "blueGK") {
					ballWarning("0x0fbcf9", ++game.warningCount);
				}
				if (game.outStatus == "redGK") {
					ballWarning("0xff3f34", ++game.warningCount);
				}
			}
			if (game.rsTimer == gkTimeOut) {
				game.outStatus = "";
				room.setDiscProperties(0, {color: "0xffffff"});
				game.rsTimer = 1000000;							
			}
		}
		else if (game.outStatus == "blueCK" || game.outStatus == "redCK") {
			if (game.rsTimer == ckTimeOut - 120) {
				if (game.outStatus == "blueCK") {
					ballWarning("0x0fbcf9", ++game.warningCount);
				}
				if (game.outStatus == "redCK") {
					ballWarning("0xff3f34", ++game.warningCount);
				}
			}
			if (game.rsTimer == ckTimeOut) {
				game.outStatus = "";
				room.setDiscProperties(1, {x: 0, y: 2000, radius: 0});
				room.setDiscProperties(2, {x: 0, y: 2000, radius: 0});
				room.setDiscProperties(0, {color: "0xffffff"});
				game.rsTimer = 1000000;							
			}
		}
	}
	
	if (game.rsActive == true) {
		if ((room.getBallPosition().y > 611.45 || room.getBallPosition().y < -611.45)) {
			game.rsActive = false;
			if (game.lastPlayAnnounced == true) {
				room.pauseGame(true);
				game.lastPlayAnnounced = false;
				announce("END");
			}
			
			room.setDiscProperties(0, {xgravity: 0, ygravity: 0});
			
			game.ballOutPositionX = Math.round(room.getBallPosition().x * 10) / 10;
			if (room.getBallPosition().y > 611.45) {
				game.ballOutPositionY = 400485;
				game.throwInPosY = 618;
			}
			if (room.getBallPosition().y < -611.45) {
				game.ballOutPositionY = -400485;
				game.throwInPosY = -618;
			}
			if (room.getBallPosition().x > 1130) {
				game.ballOutPositionX = 1130;
			}
			if (room.getBallPosition().x < -1130) {
				game.ballOutPositionX = -1130;
			}
			
			
			if (game.rsTouchTeam == 1) {				
				room.setDiscProperties(3, {x: game.ballOutPositionX, y: game.throwInPosY, radius: 18 });
				sleep(100).then(() => {
					game.outStatus = "blueThrow";
					game.throwinKicked = false;
					game.rsTimer = 0;
					game.rsReady = true;
					room.setDiscProperties(0, {xspeed: 0, yspeed: 0, x: game.ballOutPositionX, y: game.throwInPosY, xgravity: 0, ygravity: 0});
					//announce("🖐️ Throw In: 🔵 Blue");
					room.setDiscProperties(0, {color: "0x0fbcf9"});				
				});	
				sleep(100).then(() => {
					room.setDiscProperties(3, {x: 0, y: 2000, radius: 0});
				});
			}
			else {				
				room.setDiscProperties(3, {x: game.ballOutPositionX, y: game.throwInPosY, radius: 18 });
				sleep(100).then(() => {
					game.outStatus = "redThrow";
					game.throwinKicked = false;
					game.rsTimer = 0;
					game.rsReady = true;
					room.setDiscProperties(0, {xspeed: 0, yspeed: 0, x: game.ballOutPositionX, y: game.throwInPosY, xgravity: 0, ygravity: 0});
					//announce("🖐️ Throw In: 🔴 Red");
					room.setDiscProperties(0, {color: "0xff3f34"});				
				});	
				sleep(100).then(() => {
					room.setDiscProperties(3, {x: 0, y: 2000, radius: 0});
				});
			}
		}
	
		if (room.getBallPosition().x > 1162.45 && (room.getBallPosition().y > 124 || room.getBallPosition().y < -124)) {
			game.rsActive = false;	
			if (game.lastPlayAnnounced == true) {
				room.pauseGame(true);
				game.lastPlayAnnounced = false;
				announce("END");
			}
			room.setDiscProperties(0, {xgravity: 0, ygravity: 0});
			room.getPlayerList().forEach(function(player) {
				room.setPlayerDiscProperties(player.id, {invMass: 100000});
			});
			
			if (game.rsTouchTeam == 1) {				
				room.setDiscProperties(3, {x: 1060, y: 0, radius: 18 });
				sleep(100).then(() => {					
					game.outStatus = "blueGK";
					game.rsTimer = 0;
					game.rsReady = true;
					//announce("🥅 Goal Kick: 🔵 Blue");
					game.rsGoalKick = true;
					game.rsSwingTimer = 0;
					game.boosterCount = 0;
					game.boosterState = false;
					room.setDiscProperties(0, {xspeed: 0, yspeed: 0, x: 1060, y: 0, color: "0x0fbcf9", cMask: 268435519, xgravity: 0, ygravity: 0});
				});
				sleep(3000).then(() => {
					room.setDiscProperties(3, {x: 0, y: 2000, radius: 0});
				});
			}
			else {	
				//announce("🚩 Corner Kick: 🔴 Red");							
				game.rsSwingTimer = 0;
				if (room.getBallPosition().y < -124) {					
					room.setDiscProperties(3, {x: 1140, y: -590, radius: 18 });
					sleep(100).then(() => {
						game.rsCorner = true;
						game.outStatus = "redCK";
						game.rsTimer = 0;
						game.rsReady = true;
						game.boosterCount = 0;
						game.boosterState = false;
						room.setDiscProperties(0, {x: 1140, y: -590, xspeed: 0, yspeed: 0, color: "0xff3f34", cMask: 268435519, xgravity: 0, ygravity: 0});
						room.setDiscProperties(2, {x: 1150, y: -670, radius: 420 });
						room.setDiscProperties(3, {x: 0, y: 2000, radius: 0});
					});
				}
				if (room.getBallPosition().y > 124) {
					room.setDiscProperties(3, {x: 1140, y: 590, radius: 18 });
					sleep(100).then(() => {
						game.rsCorner = true;
						game.outStatus = "redCK";
						game.rsTimer = 0;
						game.rsReady = true;
						game.boosterCount = 0;
						game.boosterState = false;
						room.setDiscProperties(0, {x: 1140, y: 590, xspeed: 0, yspeed: 0, color: "0xff3f34", cMask: 268435519, xgravity: 0, ygravity: 0});
						room.setDiscProperties(2, {x: 1150, y: 670, radius: 420 });
						room.setDiscProperties(3, {x: 0, y: 2000, radius: 0});
					});
				}
			}
		}
		if (room.getBallPosition().x < -1162.45 && (room.getBallPosition().y > 124 || room.getBallPosition().y < -124)) {
			game.rsActive = false;
			if (game.lastPlayAnnounced == true) {
				room.pauseGame(true);
				game.lastPlayAnnounced = false;
				announce("END");
			}
			room.setDiscProperties(0, {xgravity: 0, ygravity: 0});
			room.getPlayerList().forEach(function(player) {
				room.setPlayerDiscProperties(player.id, {invMass: 100000});
			});
			
			if (game.rsTouchTeam == 1) {				
				//announce("🚩 Corner Kick: 🔵 Blue");				
				game.rsSwingTimer = 0;
				if (room.getBallPosition().y < -124) {
					room.setDiscProperties(3, {x: -1140, y: -590, radius: 18 });
					sleep(100).then(() => {
						game.rsCorner = true;
						game.outStatus = "blueCK";
						game.rsTimer = 0;
						game.rsReady = true;
						game.boosterCount = 0;
						game.boosterState = false;
						room.setDiscProperties(0, {x: -1140, y: -590, xspeed: 0, yspeed: 0, color: "0x0fbcf9", cMask: 268435519, xgravity: 0, ygravity: 0});
						room.setDiscProperties(1, {x: -1150, y: -670, radius: 420 });
						room.setDiscProperties(3, {x: 0, y: 2000, radius: 0});
					});	
				}
				if (room.getBallPosition().y > 124) {
					room.setDiscProperties(3, {x: -1140, y: 590, radius: 18 });
					sleep(100).then(() => {
						game.rsCorner = true;
						game.outStatus = "blueCK";
						game.rsTimer = 0;
						game.rsReady = true;
						game.boosterCount = 0;
						game.boosterState = false;
						room.setDiscProperties(0, {x: -1140, y: 590, xspeed: 0, yspeed: 0, color: "0x0fbcf9", cMask: 268435519, xgravity: 0, ygravity: 0});
						room.setDiscProperties(1, {x: -1150, y: 670, radius: 420 });
						room.setDiscProperties(3, {x: 0, y: 2000, radius: 0});
					});		
				}				
			}
			else {				
				room.setDiscProperties(3, {x: -1060, y: 0, radius: 18 });
				sleep(100).then(() => {
					game.outStatus = "redGK";
					game.rsTimer = 0;
					game.rsReady = true;
					//announce("🥅 Goal Kick: 🔴 Red");
					game.rsGoalKick = true;
					game.rsSwingTimer = 0;
					game.boosterCount = 0;
					game.boosterState = false;
					room.setDiscProperties(0, {xspeed: 0, yspeed: 0, x: -1060, y: 0, color: "0xff3f34", cMask: 268435519, xgravity: 0, ygravity: 0});
				});
				sleep(3000).then(() => {
					room.setDiscProperties(3, {x: 0, y: 2000, radius: 0});
				});
			}
		}
	}
	
	if (game.rsActive == false && (game.outStatus == "redThrow" || game.outStatus == "blueThrow")) { 
		if ((room.getBallPosition().y > 611.45 || room.getBallPosition().y < -611.45) && (room.getBallPosition().x < game.ballOutPositionX - throwinDistance || room.getBallPosition().x > game.ballOutPositionX + throwinDistance) && game.bringThrowBack == false) { //if bad throw from run too far
			game.bringThrowBack	= true;
			if (game.outStatus == "redThrow") { //switch to blue throw
				game.rsTimer = 0;
				game.warningCount++;
				game.outStatus = "blueThrow";								
				room.setDiscProperties(3, {x: 0, y: 2000, radius: 0});
				sleep(100).then(() => {
					room.setDiscProperties(0, {xspeed: 0, yspeed: 0, color: "0x0fbcf9", x: game.ballOutPositionX, y: game.throwInPosY});	
				});			
			}
			else if (game.outStatus == "blueThrow") { //switch to red throw
				game.rsTimer = 0;
				game.warningCount++;
				game.outStatus = "redThrow";										
				room.setDiscProperties(3, {x: 0, y: 2000, radius: 0});	
				sleep(100).then(() => {
					room.setDiscProperties(0, {xspeed: 0, yspeed: 0, color: "0xff3f34", x: game.ballOutPositionX, y: game.throwInPosY});
				});
			}
				
		}
		
		if (room.getBallPosition().y < 611.45 && room.getBallPosition().y > -611.45 && game.throwinKicked == false && game.pushedOut == false) { //if bad throw from push ball back into active without kick		
			if (game.outStatus == "redThrow") { //switch to blue throw
				game.rsTimer = 0;
				game.warningCount++;
				game.outStatus = "blueThrow";								
				room.setDiscProperties(3, {x: 0, y: 2000, radius: 0});
				sleep(100).then(() => {
					room.setDiscProperties(0, {xspeed: 0, yspeed: 0, color: "0x0fbcf9", x: game.ballOutPositionX, y: game.throwInPosY});
				});					
			}
			else if (game.outStatus == "blueThrow") { //switch to red throw
				game.rsTimer = 0;
				game.warningCount++;
				game.outStatus = "redThrow";										
				room.setDiscProperties(3, {x: 0, y: 2000, radius: 0});	
				sleep(100).then(() => {
					room.setDiscProperties(0, {xspeed: 0, yspeed: 0, color: "0xff3f34", x: game.ballOutPositionX, y: game.throwInPosY});
				});
			}
			game.pushedOut = true;
		}
		
		if (room.getBallPosition().y < 611.45 && room.getBallPosition().y > -611.45 && game.throwinKicked == true) { // if throw is good
			game.outStatus = "";
			game.rsActive = true;
			game.rsReady = false;
			room.setDiscProperties(0, {color: "0xffffff"});
			game.rsTimer = 1000000;
			game.warningCount++;
		}
		
		if (room.getBallPosition().y.toFixed(1) == game.throwInPosY.toFixed(1) && room.getBallPosition().x.toFixed(1) == game.ballOutPositionX.toFixed(1)) {
			game.bringThrowBack	= false;
			game.pushedOut = false;
		}
	}
}


function handleBallTouch() {
	var players = room.getPlayerList();
	var ballPosition = room.getBallPosition();
	var ballRadius = game.ballRadius;
	var playerRadius = 15;
	var triggerDistance = ballRadius + playerRadius + 0.01;
	
	for (var i = 0; i < players.length; i++) { // Iterate over all the players
		var player = players[i];
		if ( player.position == null ) continue;
		var distanceToBall = pointDistance(player.position, ballPosition);
		if ( distanceToBall < triggerDistance ) {				
			game.rsTouchTeam = player.team;
			game.throwinKicked = false;
			
			if (game.rsCorner == false && room.getDiscProperties(0).xgravity != 0) {
				room.setDiscProperties(0, {xgravity: 0, ygravity:0});
				game.rsSwingTimer = 10000;
			}
		}		
	}
}

function updateGameStatus() {
	game.time = Math.floor(room.getScores().time);
	game.ballRadius = room.getDiscProperties(0).radius;
}


function announce(msg, targetId, color, style, sound) {
	if (color == null) {
		color = 0xFFFD82;
	}
	if (style == null) {
		style = "bold";
	}
	if (sound == null) {
		sound = 0;
	}
	room.sendAnnouncement(msg, targetId, color, style, sound);
	console.log("Announce: " + msg);
}

function whisper(msg, targetId, color, style, sound) {
	if (color == null) {
		color = 0x66C7FF;
	}
	if (style == null) {
		style = "normal";
	}
	if (sound == null) {
		sound = 0;
	}
	room.sendAnnouncement(msg, targetId, color, style, sound);
	if (room.getPlayer(targetId) != null) {
		console.log("Whisper -> " + room.getPlayer(targetId).name + ": " + msg);
	}
}

function isAdminPresent() {
	var players = room.getPlayerList();
	if (players.find((player) => player.admin) != null) {
		return true;
	}
	else {
		return false;
	}
}

function displayAdminMessage() {
	if (isAdminPresent() == false && allowPublicAdmin == true) {
		announce("No admin present: Type !admin to take control");
	}
}

function pointDistance(p1, p2) {
	var d1 = p1.x - p2.x;
	var d2 = p1.y - p2.y;
	return Math.sqrt(d1 * d1 + d2 * d2);
}

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

function ballWarning(origColour, warningCount) {
	sleep(200).then(() => {
		if (game.warningCount == warningCount) {
			room.setDiscProperties(0, {color: "0xffffff"});
		}
	});
	sleep(400).then(() => {
		if (game.warningCount == warningCount) {
			room.setDiscProperties(0, {color: origColour});
		}
	});
	sleep(600).then(() => {
		if (game.warningCount == warningCount) {
			room.setDiscProperties(0, {color: "0xffffff"});
		}
	});
	sleep(800).then(() => {
		if (game.warningCount == warningCount) {
			room.setDiscProperties(0, {color: origColour});
		}
	});
	sleep(1000).then(() => {
		if (game.warningCount == warningCount) {
			room.setDiscProperties(0, {color: "0xffffff"});
		}
	});
	sleep(1200).then(() => {
		if (game.warningCount == warningCount) {
			room.setDiscProperties(0, {color: origColour});
		}
	});
	sleep(1400).then(() => {
		if (game.warningCount == warningCount) {
			room.setDiscProperties(0, {color: "0xffffff"});
		}
	});
	sleep(1600).then(() => {
		if (game.warningCount == warningCount) {
			room.setDiscProperties(0, {color: origColour});
		}
	});
	sleep(1675).then(() => {
		if (game.warningCount == warningCount) {
			room.setDiscProperties(0, {color: "0xffffff"});
		}
	});
	sleep(1750).then(() => {
		if (game.warningCount == warningCount) {
			room.setDiscProperties(0, {color: origColour});
		}
	});
}

function extraTime() {
	var extraSeconds = Math.ceil(game.extraTimeCount / 60);
	game.extraTimeEnd = (gameTime * 60) + extraSeconds;
	announce("Extra time: " + extraSeconds + " Seconds", null, null, null, 1);
}

function avatarCelebration(playerId, avatar) {
	room.setPlayerAvatar(playerId, avatar);
	sleep(250).then(() => {
		room.setPlayerAvatar(playerId, null);
	});
	sleep(500).then(() => {
		room.setPlayerAvatar(playerId, avatar);
	});
	sleep(750).then(() => {
		room.setPlayerAvatar(playerId, null);
	});
	sleep(1000).then(() => {
		room.setPlayerAvatar(playerId, avatar);
	});
	sleep(1250).then(() => {
		room.setPlayerAvatar(playerId, null);
	});
	sleep(1500).then(() => {
		room.setPlayerAvatar(playerId, avatar);
	});
	sleep(1750).then(() => {
		room.setPlayerAvatar(playerId, null);
	});
	sleep(2000).then(() => {
		room.setPlayerAvatar(playerId, avatar);
	});
	sleep(2250).then(() => {
		room.setPlayerAvatar(playerId, null);
	});
	sleep(2500).then(() => {
		room.setPlayerAvatar(playerId, avatar);
	});
	sleep(2750).then(() => {
		room.setPlayerAvatar(playerId, null);
	});
	sleep(3000).then(() => {
		room.setPlayerAvatar(playerId, avatar);
	});
	sleep(3250).then(() => {
		room.setPlayerAvatar(playerId, null);
	});
}

function secondsToMinutes(time) {
	// Hours, minutes and seconds
    var hrs = ~~(time / 3600);
    var mins = ~~((time % 3600) / 60);
    var secs = ~~time % 60;

    // Output like "1:01" or "4:03:59" or "123:03:59"
    var ret = "";
    if (hrs > 0) {
        ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }
    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
}

function blockThrowIn() {
	var players = room.getPlayerList().filter((player) => player.team != 0);
	if (room.getBallPosition().y < 0) { // top throw line
		if (game.outStatus == "redThrow") {
			players.forEach(function(player) {
				if (player.team == 2 && room.getPlayerDiscProperties(player.id).y < 0) {
					if (room.getPlayerDiscProperties(player.id).cGroup != 536870918) {
						room.setPlayerDiscProperties(player.id, {cGroup: 536870918});
					}
					if (player.position.y < -485) {
						room.setPlayerDiscProperties(player.id, {y: -470});
					}
				}
				if (player.team == 1 && room.getPlayerDiscProperties(player.id).cGroup != 2) {
					room.setPlayerDiscProperties(player.id, {cGroup: 2});
				}
				if (room.getDiscProperties(17).x != 1149) { // show top red line
					room.setDiscProperties(17, {x: 1149});
				}
				if (room.getDiscProperties(19).x != -1149) { // hide top blue line
					room.setDiscProperties(19, {x: -1149});
				}
			});
		}
		if (game.outStatus == "blueThrow") {
			players.forEach(function(player) {
				if (player.team == 1 && room.getPlayerDiscProperties(player.id).y < 0) {
					if (room.getPlayerDiscProperties(player.id).cGroup != 536870918) {
						room.setPlayerDiscProperties(player.id, {cGroup: 536870918});
					}
					if (player.position.y < -485) {
						room.setPlayerDiscProperties(player.id, {y: -470});
					}
				}
				if (player.team == 2 && room.getPlayerDiscProperties(player.id).cGroup != 2) {
					room.setPlayerDiscProperties(player.id, {cGroup: 2});
				}
				if (room.getDiscProperties(19).x != 1149) { // show top blue line
					room.setDiscProperties(19, {x: 1149});
				}
				if (room.getDiscProperties(17).x != -1149) { // hide top red line
					room.setDiscProperties(17, {x: -1149});
				}
			});
		}
	}
	if (room.getBallPosition().y > 0) { // bottom throw line
		if (game.outStatus == "redThrow") {
			players.forEach(function(player) {
				if (player.team == 2 && room.getPlayerDiscProperties(player.id).y > 0) {
					if (room.getPlayerDiscProperties(player.id).cGroup != 536870918) {
						room.setPlayerDiscProperties(player.id, {cGroup: 536870918});
					}
					if (player.position.y > 485) {
						room.setPlayerDiscProperties(player.id, {y: 470});
					}
				}
				if (player.team == 1 && room.getPlayerDiscProperties(player.id).cGroup != 2) {
					room.setPlayerDiscProperties(player.id, {cGroup: 2});
				}
				if (room.getDiscProperties(21).x != 1149) { // show bottom red line
					room.setDiscProperties(21, {x: 1149});
				}
				if (room.getDiscProperties(23).x != -1149) { // hide bottom blue line
					room.setDiscProperties(23, {x: -1149});
				}
			});
		}
		if (game.outStatus == "blueThrow") {
			players.forEach(function(player) {
				if (player.team == 1 && room.getPlayerDiscProperties(player.id).y > 0) {
					if (room.getPlayerDiscProperties(player.id).cGroup != 536870918) {
						room.setPlayerDiscProperties(player.id, {cGroup: 536870918});
					}
					if (player.position.y > 485) {
						room.setPlayerDiscProperties(player.id, {y: 470});
					}
				}
				if (player.team == 2 && room.getPlayerDiscProperties(player.id).cGroup != 2) {
					room.setPlayerDiscProperties(player.id, {cGroup: 2});
				}
				if (room.getDiscProperties(23).x != 1149) { // show bottom blue line
					room.setDiscProperties(23, {x: 1149});
				}
				if (room.getDiscProperties(21).x != -1149) { // hide bottom red line
					room.setDiscProperties(21, {x: -1149});
				}
			});
		}		
	}	
}


function blockGoalKick() {
	var players = room.getPlayerList().filter((player) => player.team != 0);
	if (room.getBallPosition().x < 0) { // left side red goal kick
		if (game.outStatus == "redGK") {
			players.forEach(function(player) {
				if (player.team == 2 && room.getPlayerDiscProperties(player.id).x < 0) {
					if (room.getPlayerDiscProperties(player.id).cGroup != 268435462) {
						room.setPlayerDiscProperties(player.id, {cGroup: 268435462});
					}
					if (player.position.x < -840 && player.position.y > -320 && player.position.y < 320) {
						room.setPlayerDiscProperties(player.id, {x: -825});
					}
				}
				if (player.team == 1 && room.getPlayerDiscProperties(player.id).cGroup != 2) {
					room.setPlayerDiscProperties(player.id, {cGroup: 2});
				}
			});
		}
	}
	if (room.getBallPosition().x > 0) { // right side blue goal kick
		if (game.outStatus == "blueGK") {
			players.forEach(function(player) {
				if (player.team == 1 && room.getPlayerDiscProperties(player.id).x > 0) {
					if (room.getPlayerDiscProperties(player.id).cGroup != 268435462) {
						room.setPlayerDiscProperties(player.id, {cGroup: 268435462});
					}
					if (player.position.x > 840 && player.position.y > -320 && player.position.y < 320) {
						room.setPlayerDiscProperties(player.id, {x: 825});
					}
				}
				if (player.team == 2 && room.getPlayerDiscProperties(player.id).cGroup != 2) {
					room.setPlayerDiscProperties(player.id, {cGroup: 2});
				}
			});
		}		
	}	
}



function removeBlock() {
	var players = room.getPlayerList().filter((player) => player.team != 0);
	if (game.outStatus == "") {
		players.forEach(function(player) {
			if (player.team == 1 && room.getPlayerDiscProperties(player.id).cGroup != 2) {
				room.setPlayerDiscProperties(player.id, {cGroup: 2});
			}
			if (player.team == 2 && room.getPlayerDiscProperties(player.id).cGroup != 4) {
				room.setPlayerDiscProperties(player.id, {cGroup: 4});
			}
		});
		if (room.getDiscProperties(17).x != -1149) { // hide top red line
			room.setDiscProperties(17, {x: -1149});
		}
		if (room.getDiscProperties(19).x != -1149) { // hide top blue line
			room.setDiscProperties(19, {x: -1149});
		}
		if (room.getDiscProperties(21).x != -1149) { // hide bottom red line
			room.setDiscProperties(21, {x: -1149});
		}
		if (room.getDiscProperties(23).x != -1149) { // hide bottom blue line
			room.setDiscProperties(23, {x: -1149});
		}		
	}
}

function checkRedDef() {
	let line = -360 + 15;
	var players = room.getPlayerList().filter((player) => player.team == 1);
	let defCount = 0;
	let positions = [];
	players.forEach(function(player) {
		positions.push([player.id, player.position.x]);
		if (player.position.x < line) {
			defCount++;
		}
	});
	
	if (defCount >= 3 && positions.length >= 4) {		
		if (room.getDiscProperties(8).y != 318) {
			room.setDiscProperties(8, {y: 318});
		}
		
		positions.sort(compareRed);
		for (var i = 0; i < positions.length; i++) {
			if (i >= 3) {
				if (room.getPlayerDiscProperties(positions[i][0]).cGroup != 536870918) {
					room.setPlayerDiscProperties(positions[i][0], {cGroup: 536870918}); // block red from def
				}
			}
		}
	}
	else {
		if (room.getDiscProperties(8).y != -318) {
			room.setDiscProperties(8, {y: -318});
		}
		players.forEach(function(player) {
			if (room.getPlayerDiscProperties(player.id).cGroup != 6) {
				room.setPlayerDiscProperties(player.id, {cGroup: 6}); // remove red block
			}
		});
	}
}

function checkBlueDef() {
	let line = 360 - 15;
	var players = room.getPlayerList().filter((player) => player.team == 2);
	let defCount = 0;
	let positions = [];
	players.forEach(function(player) {
		positions.push([player.id, player.position.x]);
		if (player.position.x > line) {
			defCount++;
		}
	});
	if (defCount >= 3 && positions.length >= 4) {
		if (room.getDiscProperties(6).y != 318) {
			room.setDiscProperties(6, {y: 318});
		}
		
		positions.sort(compareBlue);
		for (var i = 0; i < positions.length; i++) {
			if (i >= 3) {
				if (room.getPlayerDiscProperties(positions[i][0]).cGroup != 1073741830) {
					room.setPlayerDiscProperties(positions[i][0], {cGroup: 1073741830}); // block blue from def
				}
			}
		}
	}
	else {
		if (room.getDiscProperties(6).y != -318) {
			room.setDiscProperties(6, {y: -318});
		}
		players.forEach(function(player) {
			if (room.getPlayerDiscProperties(player.id).cGroup != 6) {
				room.setPlayerDiscProperties(player.id, {cGroup: 6}); // remove blue block
			}
		});
	}
	
}

function compareBlue(a, b) {
    if (a[1] === b[1]) {
        return 0;
    }
    else {
        return (a[1] > b[1]) ? -1 : 1;
    }
}

function compareRed(a, b) {
    if (a[1] === b[1]) {
        return 0;
    }
    else {
        return (a[1] < b[1]) ? -1 : 1;
    }
}
room.onPlayerActivity = function(player) {
	afkAdminCounter = 0;
}

var afkAdminTimer = setInterval(afkTimer, 30000);
var kickTimeLimit = 5; //kick admins after x minutes if room activity is inactive
function afkTimer() {
	var players = room.getPlayerList().filter((player) => player.id != 0 && player.admin);
	if ( players.find((player) => player.admin) != null ) {
		afkAdminCounter++;
	}
	else {
		afkAdminCounter = 0;
	}
	
	if (afkAdminCounter == kickTimeLimit * 2) {
		players.forEach(function(player) {
			announce("Warning: No in game activity detected. Kicking all admins in 30s...");
		});
	}
	
	if (afkAdminCounter > kickTimeLimit * 2) {
		players.forEach(function(player) {
			room.kickPlayer(player.id, "AFK Admin", false);
			console.log("AFK Admin Kicked: " + player.name);
			afkAdminCounter = 0;
		});
	}
}

/*-------------------------------- STADIUMS ---------------------------------*/
function getRealSoccerMap() {
	var realSoccerMap = `{"name":"Real Soccer Revolution","width":1300,"height":670,"spawnDistance":560,"bg":{"type":"grass","width":1150,"height":600,"kickOffRadius":180,"cornerRadius":0,"color":"`+mapBGColor+`"},"playerPhysics":{"bCoef":0.3,"invMass":0.5,"damping":0.96,"acceleration":0.12,"kickingAcceleration":0.07,"kickingDamping":0.96,"kickStrength":5.65},"ballPhysics":{"radius":9,"bCoef":0.5,"invMass":1.05,"damping":0.99,"color":"FFFFFF","cMask":["all"],"cGroup":["ball"]},"vertexes":[{"x":0,"y":675,"trait":"kickOffBarrier"},{"x":0,"y":180,"trait":"kickOffBarrier"},{"x":0,"y":-180,"trait":"kickOffBarrier"},{"x":0,"y":-675,"trait":"kickOffBarrier"},{"x":1150,"y":320,"trait":"line"},{"x":840,"y":320,"trait":"line"},{"x":1150,"y":-320,"trait":"line"},{"x":840,"y":-320,"trait":"line"},{"x":1150,"y":180,"trait":"line"},{"x":1030,"y":180,"trait":"line"},{"x":1150,"y":-180,"trait":"line"},{"x":1030,"y":-180,"trait":"line"},{"x":840,"y":-130,"trait":"line","curve":-130},{"x":840,"y":130,"trait":"line","curve":-130},{"x":-1150,"y":-320,"trait":"line"},{"x":-840,"y":-320,"trait":"line"},{"x":-1150,"y":320,"trait":"line"},{"x":-840,"y":320,"trait":"line"},{"x":-1150,"y":-175,"trait":"line"},{"x":-1030,"y":-175,"trait":"line"},{"x":-1150,"y":175,"trait":"line"},{"x":-1030,"y":175,"trait":"line"},{"x":-840,"y":130,"trait":"line","curve":-130},{"x":-840,"y":-130,"trait":"line","curve":-130},{"x":935,"y":3,"trait":"line"},{"x":935,"y":-3,"trait":"line"},{"x":-935,"y":3,"trait":"line"},{"x":-935,"y":-3,"trait":"line"},{"x":-1150,"y":570,"bCoef":-2.65,"cMask":["ball"],"cGroup":["c0"],"trait":"line"},{"x":-1120,"y":600,"bCoef":-2.65,"cMask":["ball"],"cGroup":["c0"],"trait":"line"},{"x":-1120,"y":-600,"bCoef":-2.65,"cMask":["ball"],"cGroup":["c0"],"trait":"line"},{"x":-1150,"y":-570,"bCoef":-2.65,"cMask":["ball"],"cGroup":["c0"],"trait":"line"},{"x":1120,"y":600,"bCoef":-2.65,"cMask":["ball"],"cGroup":["c0"],"trait":"line"},{"x":1150,"y":570,"bCoef":-2.65,"cMask":["ball"],"cGroup":["c0"],"trait":"line"},{"x":1150,"y":-570,"bCoef":-2.65,"cMask":["ball"],"cGroup":["c0"],"trait":"line"},{"x":1120,"y":-600,"bCoef":-2.65,"cMask":["ball"],"cGroup":["c0"],"trait":"line"},{"x":0,"y":180,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["blueKO"],"trait":"kickOffBarrier","curve":-180},{"x":0,"y":-180,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO"],"trait":"kickOffBarrier","curve":180},{"x":0,"y":180,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO"],"trait":"kickOffBarrier","curve":180},{"x":-1030,"y":-40,"bCoef":-5.7,"cMask":["ball"],"cGroup":["c0"],"trait":"line","curve":70,"color":"576C46","vis":false},{"x":-1030,"y":40,"bCoef":-5.7,"cMask":["ball"],"cGroup":["c0"],"trait":"line","curve":70,"color":"576C46","vis":false},{"x":1030,"y":-40,"bCoef":-5.7,"cMask":["ball"],"cGroup":["c0"],"trait":"line","curve":-70,"color":"576C46","vis":false},{"x":1030,"y":40,"bCoef":-5.7,"cMask":["ball"],"cGroup":["c0"],"trait":"line","curve":-70,"color":"576C46","vis":false},{"x":1030,"y":-40,"trait":"line","color":"576C46"},{"x":1030,"y":40,"trait":"line","color":"576C46"},{"x":-1030,"y":-40,"trait":"line","color":"576C46"},{"x":-1030,"y":40,"trait":"line","color":"576C46"},{"x":0,"y":3,"trait":"line"},{"x":0,"y":-3,"trait":"line"},{"x":-1157,"y":605,"bCoef":0,"cMask":["ball"],"trait":"ballArea"},{"x":-1157,"y":655,"bCoef":0,"cMask":["ball"],"trait":"ballArea"},{"x":-1157,"y":-655,"bCoef":0,"cMask":["ball"],"trait":"ballArea"},{"x":-1157,"y":-605,"bCoef":0,"cMask":["ball"],"trait":"ballArea"},{"x":1157,"y":605,"bCoef":0,"cMask":["ball"],"trait":"ballArea"},{"x":1157,"y":655,"bCoef":0,"cMask":["ball"],"trait":"ballArea"},{"x":1157,"y":-655,"bCoef":0,"cMask":["ball"],"trait":"ballArea"},{"x":1157,"y":-605,"bCoef":0,"cMask":["ball"],"trait":"ballArea"},{"x":-1300,"y":-485,"bCoef":0,"cMask":["c1"],"cGroup":["red","blue"],"color":"ec644b","vis":false},{"x":1300,"y":-485,"bCoef":0,"cMask":["c1"],"cGroup":["red","blue"],"color":"ec644b","vis":false},{"x":-1300,"y":485,"bCoef":0,"cMask":["c1"],"cGroup":["red","blue"],"color":"ec644b","vis":false},{"x":1300,"y":485,"bCoef":0,"cMask":["c1"],"cGroup":["red","blue"],"color":"ec644b","vis":false},{"x":-1295,"y":-320,"cMask":["c0"],"cGroup":["red","blue"]},{"x":-840,"y":-320,"cMask":["c0"],"cGroup":["red","blue"]},{"x":-840,"y":320,"cMask":["c0"],"cGroup":["red","blue"]},{"x":-1295,"y":320,"cMask":["c0"],"cGroup":["red","blue"]},{"x":1295,"y":-320,"cMask":["c0"],"cGroup":["red","blue"]},{"x":840,"y":-320,"cMask":["c0"],"cGroup":["red","blue"]},{"x":840,"y":320,"cMask":["c0"],"cGroup":["red","blue"]},{"x":1295,"y":320,"cMask":["c0"],"cGroup":["red","blue"]},{"x":-1150,"y":-124,"bCoef":0,"cMask":["ball","red","blue"]},{"x":-1210,"y":-124,"bCoef":0,"cMask":["ball"],"bias":0,"curve":5},{"x":-1150,"y":124,"bCoef":0,"cMask":["ball","red","blue"]},{"x":-1210,"y":124,"bCoef":0,"cMask":["ball"],"bias":0,"curve":5},{"x":-1250,"y":-158,"bCoef":0,"cMask":["ball"]},{"x":-1250,"y":158,"bCoef":0,"cMask":["ball"]},{"x":1150,"y":124,"bCoef":0,"cMask":["ball","red","blue"]},{"x":1210,"y":124,"bCoef":0,"cMask":["ball"],"curve":-5},{"x":1150,"y":-124,"bCoef":0,"cMask":["ball","red","blue"]},{"x":1210,"y":-124,"bCoef":0,"cMask":["ball"],"curve":-5},{"x":1250,"y":-158,"bCoef":0,"cMask":["ball"]},{"x":1250,"y":158,"bCoef":0,"cMask":["ball"]}],"segments":[{"v0":0,"v1":1,"trait":"kickOffBarrier"},{"v0":2,"v1":3,"trait":"kickOffBarrier"},{"v0":4,"v1":5,"trait":"line","y":320},{"v0":5,"v1":7,"trait":"line","x":840},{"v0":6,"v1":7,"trait":"line","y":-320},{"v0":8,"v1":9,"trait":"line","y":180},{"v0":9,"v1":11,"trait":"line","x":1030},{"v0":10,"v1":11,"trait":"line","y":-180},{"v0":12,"v1":13,"curve":-130,"trait":"line","x":840},{"v0":14,"v1":15,"trait":"line","y":-320},{"v0":15,"v1":17,"trait":"line","x":-840},{"v0":16,"v1":17,"trait":"line","y":320},{"v0":18,"v1":19,"trait":"line","y":-175},{"v0":19,"v1":21,"trait":"line","x":-1030},{"v0":20,"v1":21,"trait":"line","y":175},{"v0":22,"v1":23,"curve":-130,"trait":"line","x":-840},{"v0":24,"v1":25,"curve":-180,"trait":"line","x":935},{"v0":26,"v1":27,"curve":-180,"trait":"line","x":-935},{"v0":24,"v1":25,"curve":180,"trait":"line","x":935},{"v0":26,"v1":27,"curve":180,"trait":"line","x":-935},{"v0":24,"v1":25,"curve":90,"trait":"line","x":935},{"v0":26,"v1":27,"curve":90,"trait":"line","x":-935},{"v0":24,"v1":25,"curve":-90,"trait":"line","x":935},{"v0":26,"v1":27,"curve":-90,"trait":"line","x":-935},{"v0":24,"v1":25,"trait":"line","x":935},{"v0":26,"v1":27,"trait":"line","x":-935},{"v0":28,"v1":29,"curve":90,"bCoef":-2.65,"cMask":["ball"],"cGroup":["c0"],"trait":"line"},{"v0":30,"v1":31,"curve":90,"bCoef":-2.65,"cMask":["ball"],"cGroup":["c0"],"trait":"line"},{"v0":32,"v1":33,"curve":90,"bCoef":-2.65,"cMask":["ball"],"cGroup":["c0"],"trait":"line"},{"v0":34,"v1":35,"curve":90,"bCoef":-2.65,"cMask":["ball"],"cGroup":["c0"],"trait":"line"},{"v0":37,"v1":36,"curve":-180,"vis":false,"bCoef":0.1,"cGroup":["blueKO"],"trait":"kickOffBarrier"},{"v0":39,"v1":40,"curve":70,"vis":false,"color":"576C46","bCoef":-5.7,"cMask":["ball"],"cGroup":["c0"],"trait":"line","x":-1030},{"v0":41,"v1":42,"curve":-70,"vis":false,"color":"576C46","bCoef":-5.7,"cMask":["ball"],"cGroup":["c0"],"trait":"line","x":1030},{"v0":37,"v1":38,"curve":180,"vis":false,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO"],"trait":"kickOffBarrier"},{"v0":43,"v1":44,"vis":true,"color":"576C46","trait":"line","x":1030},{"v0":45,"v1":46,"vis":true,"color":"576C46","trait":"line","x":-1030},{"v0":47,"v1":48,"curve":-180,"trait":"line","x":-935},{"v0":47,"v1":48,"curve":180,"trait":"line","x":-935},{"v0":47,"v1":48,"curve":90,"trait":"line","x":-935},{"v0":47,"v1":48,"curve":-90,"trait":"line","x":-935},{"v0":47,"v1":48,"trait":"line","x":-935},{"v0":49,"v1":50,"color":"FFFF00","bCoef":0,"cMask":["ball"],"trait":"ballArea","x":-1157},{"v0":51,"v1":52,"color":"FFFF00","bCoef":0,"cMask":["ball"],"trait":"ballArea","x":-1157},{"v0":53,"v1":54,"color":"FFFF00","bCoef":0,"cMask":["ball"],"trait":"ballArea","x":1157},{"v0":55,"v1":56,"color":"FFFF00","bCoef":0,"cMask":["ball"],"trait":"ballArea","x":1157},{"v0":57,"v1":58,"vis":false,"color":"ec644b","bCoef":0,"cMask":["c1"],"cGroup":["red","blue"],"y":-485},{"v0":59,"v1":60,"vis":false,"color":"ec644b","bCoef":0,"cMask":["c1"],"cGroup":["red","blue"],"y":485},{"v0":61,"v1":62,"vis":false,"color":"ec644b","cMask":["c0"],"cGroup":["red","blue"]},{"v0":62,"v1":63,"vis":false,"color":"ec644b","cMask":["c0"],"cGroup":["red","blue"]},{"v0":63,"v1":64,"vis":false,"color":"ec644b","cMask":["c0"],"cGroup":["red","blue"]},{"v0":65,"v1":66,"vis":false,"cMask":["c0"],"cGroup":["red","blue"]},{"v0":66,"v1":67,"vis":false,"cMask":["c0"],"cGroup":["red","blue"]},{"v0":67,"v1":68,"vis":false,"cMask":["c0"],"cGroup":["red","blue"]},{"v0":69,"v1":70,"color":"FFFFFF","bCoef":0,"cMask":["ball","red","blue"],"y":-124},{"v0":71,"v1":72,"color":"FFFFFF","bCoef":0,"cMask":["ball","red","blue"],"y":124},{"v0":72,"v1":70,"curve":5,"color":"FFFFFF","bCoef":0,"cMask":["ball","red","blue"],"bias":0},{"v0":70,"v1":73,"color":"FFFFFF","bCoef":0,"cMask":["ball"]},{"v0":72,"v1":74,"color":"FFFFFF","bCoef":0,"cMask":["ball"]},{"v0":75,"v1":76,"color":"FFFFFF","bCoef":0,"cMask":["ball","red","blue"],"y":124},{"v0":77,"v1":78,"color":"FFFFFF","bCoef":0,"cMask":["ball","red","blue"],"y":-124},{"v0":76,"v1":78,"curve":-5,"color":"FFFFFF","bCoef":0,"cMask":["ball","red","blue"]},{"v0":78,"v1":79,"color":"FFFFFF","bCoef":0,"cMask":["ball"]},{"v0":76,"v1":80,"color":"FFFFFF","bCoef":0,"cMask":["ball"]}],"goals":[{"p0":[-1162.45,124],"p1":[-1162.45,-124],"team":"red"},{"p0":[1162.45,124],"p1":[1162.45,-124],"team":"blue","radius":0,"invMass":1}],"discs":[{"radius":0,"invMass":0,"pos":[-1311,-19],"color":"ffffffff","bCoef":0,"cMask":["red"],"cGroup":["ball"]},{"radius":0,"invMass":0,"pos":[-1310,29],"color":"ffffffff","bCoef":0,"cMask":["blue"],"cGroup":["ball"]},{"radius":0,"invMass":0,"pos":[-1308,62],"color":"ffffffff","bCoef":0,"cMask":["red","blue"],"cGroup":["ball"]},{"radius":2.7,"pos":[-1150,600],"cGroup":["ball"],"trait":"cornerflag"},{"radius":2.7,"pos":[1150,-600],"cGroup":["ball"],"trait":"cornerflag"},{"radius":2.7,"pos":[1150,600],"cGroup":["ball"],"trait":"cornerflag"},{"radius":5,"invMass":0,"pos":[-1150,-124],"bCoef":0.5,"trait":"goalPost"},{"radius":5,"invMass":0,"pos":[-1150,124],"bCoef":0.5,"trait":"goalPost"},{"radius":2,"invMass":0,"pos":[-1250,-158],"color":"000000","bCoef":1,"trait":"goalPost"},{"radius":2,"invMass":0,"pos":[-1250,158],"color":"000000","bCoef":1,"trait":"goalPost"},{"radius":5,"invMass":0,"pos":[1150,-124],"bCoef":0.5,"trait":"goalPost"},{"radius":5,"invMass":0,"pos":[1150,124],"bCoef":0.5,"trait":"goalPost"},{"radius":2,"invMass":0,"pos":[1250,-158],"color":"000000","bCoef":1,"trait":"goalPost"},{"radius":2,"invMass":0,"pos":[1250,158],"color":"000000","bCoef":1,"trait":"goalPost"},{"radius":2.7,"pos":[-1150,-600],"cGroup":["ball"],"trait":"cornerflag"},{"radius":0,"pos":[-1149,-485],"cMask":["none"]},{"radius":0,"pos":[1149,-485],"cMask":["none"]},{"radius":0,"pos":[-1149,-485],"cMask":["none"]},{"radius":0,"pos":[1149,-485],"cMask":["none"]},{"radius":0,"pos":[-1149,485],"cMask":["none"]},{"radius":0,"pos":[1149,485],"cMask":["none"]},{"radius":0,"pos":[-1149,485],"cMask":["none"]},{"radius":0,"pos":[1149,485],"cMask":["none"]}],"planes":[{"normal":[0,1],"dist":-627,"bCoef":0,"cGroup":["ball"],"trait":"ballArea","_data":{"extremes":{"normal":[0,1],"dist":-627,"canvas_rect":[-1311,-675,1300,675],"a":[-1311,-627],"b":[1300,-627]}}},{"normal":[0,-1],"dist":-627,"bCoef":0,"cGroup":["ball"],"trait":"ballArea","_data":{"extremes":{"normal":[0,-1],"dist":-627,"canvas_rect":[-1311,-675,1300,675],"a":[-1311,627],"b":[1300,627]},"mirror":{}}},{"normal":[0,1],"dist":-670,"bCoef":0,"_data":{"extremes":{"normal":[0,1],"dist":-670,"canvas_rect":[-1311,-675,1300,675],"a":[-1311,-670],"b":[1300,-670]},"mirror":{}}},{"normal":[0,-1],"dist":-670,"bCoef":0,"_data":{"extremes":{"normal":[0,-1],"dist":-670,"canvas_rect":[-1311,-675,1300,675],"a":[-1311,670],"b":[1300,670]},"mirror":{}}},{"normal":[1,0],"dist":-1300,"bCoef":0,"_data":{"extremes":{"normal":[1,0],"dist":-1300,"canvas_rect":[-1311,-675,1300,675],"a":[-1300,-675],"b":[-1300,675]}}},{"normal":[-1,0],"dist":-1300,"bCoef":0.1,"_data":{"extremes":{"normal":[-1,0],"dist":-1300,"canvas_rect":[-1311,-675,1300,675],"a":[1300,-675],"b":[1300,675]}}},{"normal":[1,0],"dist":-1230,"bCoef":0,"cMask":["ball"],"cGroup":["ball"],"_data":{"extremes":{"normal":[1,0],"dist":-1230,"canvas_rect":[-1311,-675,1300,675],"a":[-1230,-675],"b":[-1230,675]}}},{"normal":[-1,0],"dist":-1230,"bCoef":0,"cMask":["ball"],"cGroup":["ball"],"_data":{"extremes":{"normal":[-1,0],"dist":-1230,"canvas_rect":[-1311,-675,1300,675],"a":[1230,-675],"b":[1230,675]}}}],"traits":{"ballArea":{"vis":false,"bCoef":0,"cMask":["ball"],"cGroup":["ball"]},"goalPost":{"radius":5,"invMass":0,"bCoef":1,"cGroup":["ball"]},"rightNet":{"radius":0,"invMass":1,"bCoef":0,"cGroup":["ball","c3"]},"leftNet":{"radius":0,"invMass":1,"bCoef":0,"cGroup":["ball","c2"]},"stanchion":{"radius":3,"invMass":0,"bCoef":3,"cMask":["none"]},"cornerflag":{"radius":3,"invMass":0,"bCoef":0.2,"color":"FFFF00","cMask":["ball"]},"reargoalNetleft":{"vis":true,"bCoef":0.1,"cMask":["ball","red","blue"],"curve":10,"color":"C7E6BD"},"reargoalNetright":{"vis":true,"bCoef":0.1,"cMask":["ball","red","blue"],"curve":-10,"color":"C7E6BD"},"sidegoalNet":{"vis":true,"bCoef":1,"cMask":["ball","red","blue"],"color":"C7E6BD"},"kickOffBarrier":{"vis":false,"bCoef":0.1,"cGroup":["redKO","blueKO"],"cMask":["red","blue"]},"line":{"vis":true,"cMask":[],"color":"C7E6BD"}},"joints":[{"d0":16,"d1":17,"strength":"rigid","color":"ec7458","length":null},{"d0":18,"d1":19,"strength":"rigid","color":"48bef9","length":null},{"d0":20,"d1":21,"strength":"rigid","color":"ec7458","length":null},{"d0":22,"d1":23,"strength":"rigid","color":"48bef9","length":null}],"redSpawnPoints":[],"blueSpawnPoints":[],"canBeStored":false}`;
	
	return realSoccerMap;
}

function getFutsalMap() {
	var futsalMap = `{"name":"AF Official 4v4 Futsal","width":810,"height":350,"bg":{"kickOffRadius":80,"color":"1D2431"},"vertexes":[{"x":-700,"y":-85,"bCoef":0.1,"cMask":["ball"]},{"x":-735,"y":-85,"bCoef":0.1,"cMask":["ball"]},{"x":-734,"y":-86,"bCoef":0.1,"cMask":["ball"]},{"x":-734,"y":86,"bCoef":0.1,"cMask":["ball"]},{"x":-735,"y":85,"bCoef":0.1,"cMask":["ball"]},{"x":-700,"y":85,"bCoef":0.1,"cMask":["ball"]},{"x":700,"y":85,"bCoef":0.1,"cMask":["ball"]},{"x":735,"y":85,"bCoef":0.1,"cMask":["ball"]},{"x":734,"y":86,"bCoef":0.1,"cMask":["ball"]},{"x":734,"y":-86,"bCoef":0.1,"cMask":["ball"]},{"x":735,"y":-85,"bCoef":0.1,"cMask":["ball"]},{"x":700,"y":-85,"bCoef":0.1,"cMask":["ball"]},{"x":-700,"y":-321.5,"cMask":["ball"]},{"x":-700,"y":-85,"cMask":["ball"]},{"x":-700,"y":85,"cMask":["ball"]},{"x":-700,"y":321.5,"cMask":["ball"]},{"x":-700,"y":320,"cMask":["ball"]},{"x":700,"y":320,"cMask":["ball"]},{"x":700,"y":321.5,"cMask":["ball"]},{"x":700,"y":85,"cMask":["ball"]},{"x":700,"y":-85,"cMask":["ball"]},{"x":700,"y":-321.5,"cMask":["ball"]},{"x":700,"y":-320,"cMask":["ball"]},{"x":-700,"y":-320,"cMask":["ball"]},{"x":-700,"y":-85,"cMask":[]},{"x":-700,"y":85,"cMask":[]},{"x":700,"y":85,"cMask":[]},{"x":700,"y":-85,"cMask":[]},{"x":-360,"y":318,"cMask":[]},{"x":-360,"y":-318,"cMask":[]},{"x":360,"y":-318,"cMask":[]},{"x":360,"y":318,"cMask":[]},{"x":-500,"y":-1,"cMask":[]},{"x":-500,"y":1,"cMask":[]},{"x":-500,"y":-2,"cMask":[]},{"x":-500,"y":2,"cMask":[]},{"x":0,"y":-80,"cMask":["red","blue"],"cGroup":["redKO"]},{"x":0,"y":80,"cMask":["red","blue"],"cGroup":["redKO"]},{"x":0,"y":-350,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"x":0,"y":350,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"x":0,"y":-318,"cMask":[]},{"x":0,"y":-80,"cMask":[]},{"x":0,"y":318,"cMask":[]},{"x":0,"y":80,"cMask":[]},{"x":500,"y":-1,"cMask":[]},{"x":500,"y":1,"cMask":[]},{"x":500,"y":-2,"cMask":[]},{"x":500,"y":2,"cMask":[]},{"x":-360,"y":-135,"cMask":[]},{"x":-360,"y":135,"cMask":[]},{"x":360,"y":135,"cMask":[]},{"x":360,"y":-135,"cMask":[]},{"x":-698,"y":125,"cMask":[]},{"x":-630,"y":125,"cMask":[]},{"x":-630,"y":-125,"cMask":[]},{"x":-698,"y":-125,"cMask":[]},{"x":-630,"y":126.5,"cMask":[]},{"x":-630,"y":-126.5,"cMask":[]},{"x":698,"y":125,"cMask":[]},{"x":630,"y":125,"cMask":[]},{"x":630,"y":-125,"cMask":[]},{"x":698,"y":-125,"cMask":[]},{"x":630,"y":126.5,"cMask":[]},{"x":630,"y":-126.5,"cMask":[]},{"x":-50,"y":30,"cMask":[]},{"x":-25,"y":-30,"cMask":[]},{"x":11,"y":30,"cMask":[]},{"x":20,"y":-30,"cMask":[]},{"x":-42.5,"y":30,"cMask":[]},{"x":-17.5,"y":-30,"cMask":[]},{"x":-52,"y":30,"cMask":[]},{"x":-27,"y":-30,"cMask":[]},{"x":-40.5,"y":30,"cMask":[]},{"x":-15.5,"y":-30,"cMask":[]},{"x":-33,"y":30,"cMask":[]},{"x":-8,"y":-30,"cMask":[]},{"x":-31,"y":30,"cMask":[]},{"x":-6,"y":-30,"cMask":[]},{"x":-29,"y":30,"cMask":[]},{"x":-4,"y":-30,"cMask":[]},{"x":-27,"y":30,"cMask":[]},{"x":-2,"y":-30,"cMask":[]},{"x":-25,"y":30,"cMask":[]},{"x":0,"y":-30,"cMask":[]},{"x":5,"y":30,"cMask":[]},{"x":0,"y":-30,"cMask":[]},{"x":3,"y":30,"cMask":[]},{"x":-2,"y":-30,"cMask":[]},{"x":1,"y":30,"cMask":[]},{"x":-4,"y":-30,"cMask":[]},{"x":-1,"y":30,"cMask":[]},{"x":-6,"y":-30,"cMask":[]},{"x":-3,"y":30,"cMask":[]},{"x":-8,"y":-30,"cMask":[]},{"x":-21,"y":19,"cMask":[]},{"x":-5,"y":19,"cMask":[]},{"x":-21,"y":17,"cMask":[]},{"x":-5,"y":17,"cMask":[]},{"x":-21,"y":15,"cMask":[]},{"x":-5,"y":15,"cMask":[]},{"x":-21,"y":13,"cMask":[]},{"x":-5,"y":13,"cMask":[]},{"x":-21,"y":11,"cMask":[]},{"x":-5,"y":11,"cMask":[]},{"x":13,"y":30,"cMask":[]},{"x":22,"y":-30,"cMask":[]},{"x":15,"y":30,"cMask":[]},{"x":24,"y":-30,"cMask":[]},{"x":17,"y":30,"cMask":[]},{"x":26,"y":-30,"cMask":[]},{"x":19,"y":30,"cMask":[]},{"x":28,"y":-30,"cMask":[]},{"x":19,"y":-29,"cMask":[]},{"x":49,"y":-29,"cMask":[]},{"x":19,"y":-27,"cMask":[]},{"x":49,"y":-27,"cMask":[]},{"x":19,"y":-25,"cMask":[]},{"x":49,"y":-25,"cMask":[]},{"x":19,"y":-23,"cMask":[]},{"x":49,"y":-23,"cMask":[]},{"x":19,"y":-21,"cMask":[]},{"x":49,"y":-21,"cMask":[]},{"x":23,"y":-6,"cMask":[]},{"x":42,"y":-6,"cMask":[]},{"x":23,"y":-4,"cMask":[]},{"x":42,"y":-4,"cMask":[]},{"x":23,"y":-2,"cMask":[]},{"x":42,"y":-2,"cMask":[]},{"x":23,"y":0,"cMask":[]},{"x":42,"y":0,"cMask":[]},{"x":23,"y":2,"cMask":[]},{"x":42,"y":2,"cMask":[]},{"x":-52,"y":27,"cMask":[]},{"x":-27,"y":-33,"cMask":[]},{"x":9,"y":27,"cMask":[]},{"x":18,"y":-33,"cMask":[]},{"x":-44.5,"y":27,"cMask":[]},{"x":-19.5,"y":-33,"cMask":[]},{"x":-54,"y":27,"cMask":[]},{"x":-29,"y":-33,"cMask":[]},{"x":-42.5,"y":27,"cMask":[]},{"x":-17.5,"y":-33,"cMask":[]},{"x":-35,"y":27,"cMask":[]},{"x":-10,"y":-33,"cMask":[]},{"x":-33,"y":27,"cMask":[]},{"x":-8,"y":-33,"cMask":[]},{"x":-31,"y":27,"cMask":[]},{"x":-6,"y":-33,"cMask":[]},{"x":-29,"y":27,"cMask":[]},{"x":-4,"y":-33,"cMask":[]},{"x":-27,"y":27,"cMask":[]},{"x":-2,"y":-33,"cMask":[]},{"x":3,"y":27,"cMask":[]},{"x":-2,"y":-33,"cMask":[]},{"x":1,"y":27,"cMask":[]},{"x":-4,"y":-33,"cMask":[]},{"x":-1,"y":27,"cMask":[]},{"x":-6,"y":-33,"cMask":[]},{"x":-3,"y":27,"cMask":[]},{"x":-8,"y":-33,"cMask":[]},{"x":-5,"y":27,"cMask":[]},{"x":-10,"y":-33,"cMask":[]},{"x":-23,"y":16,"cMask":[]},{"x":-7,"y":16,"cMask":[]},{"x":-23,"y":14,"cMask":[]},{"x":-7,"y":14,"cMask":[]},{"x":-23,"y":12,"cMask":[]},{"x":-7,"y":12,"cMask":[]},{"x":-23,"y":10,"cMask":[]},{"x":-7,"y":10,"cMask":[]},{"x":-23,"y":8,"cMask":[]},{"x":-7,"y":8,"cMask":[]},{"x":11,"y":27,"cMask":[]},{"x":20,"y":-33,"cMask":[]},{"x":13,"y":27,"cMask":[]},{"x":22,"y":-33,"cMask":[]},{"x":15,"y":27,"cMask":[]},{"x":24,"y":-33,"cMask":[]},{"x":17,"y":27,"cMask":[]},{"x":26,"y":-33,"cMask":[]},{"x":17,"y":-32,"cMask":[]},{"x":47,"y":-32,"cMask":[]},{"x":17,"y":-30,"cMask":[]},{"x":47,"y":-30,"cMask":[]},{"x":17,"y":-28,"cMask":[]},{"x":47,"y":-28,"cMask":[]},{"x":17,"y":-26,"cMask":[]},{"x":47,"y":-26,"cMask":[]},{"x":17,"y":-24,"cMask":[]},{"x":47,"y":-24,"cMask":[]},{"x":21,"y":-9,"cMask":[]},{"x":40,"y":-9,"cMask":[]},{"x":21,"y":-7,"cMask":[]},{"x":40,"y":-7,"cMask":[]},{"x":21,"y":-5,"cMask":[]},{"x":40,"y":-5,"cMask":[]},{"x":21,"y":-3,"cMask":[]},{"x":40,"y":-3,"cMask":[]},{"x":21,"y":-1,"cMask":[]},{"x":40,"y":-1,"cMask":[]}],"segments":[{"v0":0,"v1":1,"color":"717F98","bCoef":0.1,"cMask":["ball"],"bias":10},{"v0":3,"v1":2,"curve":35,"color":"717F98","bCoef":0.1,"cMask":["ball"],"bias":-10,"curveF":3.1715948023632126},{"v0":4,"v1":5,"color":"717F98","bCoef":0.1,"cMask":["ball"],"bias":10},{"v0":6,"v1":7,"color":"717F98","bCoef":0.1,"cMask":["ball"],"bias":10},{"v0":9,"v1":8,"curve":35,"color":"717F98","bCoef":0.1,"cMask":["ball"],"bias":-10,"curveF":3.1715948023632126},{"v0":10,"v1":11,"color":"717F98","bCoef":0.1,"cMask":["ball"],"bias":10},{"v0":12,"v1":13,"color":"717F98","cMask":["ball"],"bias":10},{"v0":14,"v1":15,"color":"717F98","cMask":["ball"],"bias":10},{"v0":16,"v1":17,"color":"717F98","cMask":["ball"],"bias":10},{"v0":18,"v1":19,"color":"717F98","cMask":["ball"],"bias":10},{"v0":20,"v1":21,"color":"717F98","cMask":["ball"],"bias":10},{"v0":22,"v1":23,"color":"717F98","cMask":["ball"],"bias":10},{"v0":24,"v1":25,"color":"3B424F","cMask":[]},{"v0":26,"v1":27,"color":"3B424F","cMask":[]},{"v0":28,"v1":29,"color":"161C26","cMask":[]},{"v0":30,"v1":31,"color":"161C26","cMask":[]},{"v0":33,"v1":32,"curve":180,"color":"161C26","cMask":[],"curveF":6.123233995736766e-17},{"v0":32,"v1":33,"curve":180,"color":"161C26","cMask":[],"curveF":6.123233995736766e-17},{"v0":35,"v1":34,"curve":180,"color":"161C26","cMask":[],"curveF":6.123233995736766e-17},{"v0":34,"v1":35,"curve":180,"color":"161C26","cMask":[],"curveF":6.123233995736766e-17},{"v0":38,"v1":36,"vis":false,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"v0":39,"v1":37,"vis":false,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"v0":37,"v1":36,"curve":180,"vis":false,"cMask":["red","blue"],"cGroup":["blueKO"],"curveF":6.123233995736766e-17},{"v0":36,"v1":37,"curve":180,"vis":false,"cMask":["red","blue"],"cGroup":["redKO"],"curveF":6.123233995736766e-17},{"v0":40,"v1":41,"color":"161C26","cMask":[]},{"v0":42,"v1":43,"color":"161C26","cMask":[]},{"v0":43,"v1":41,"curve":180,"color":"161C26","cMask":[],"curveF":6.123233995736766e-17},{"v0":41,"v1":43,"curve":180,"color":"161C26","cMask":[],"curveF":6.123233995736766e-17},{"v0":45,"v1":44,"curve":180,"color":"161C26","cMask":[],"curveF":6.123233995736766e-17},{"v0":44,"v1":45,"curve":180,"color":"161C26","cMask":[],"curveF":6.123233995736766e-17},{"v0":47,"v1":46,"curve":180,"color":"161C26","cMask":[],"curveF":6.123233995736766e-17},{"v0":46,"v1":47,"curve":180,"color":"161C26","cMask":[],"curveF":6.123233995736766e-17},{"v0":48,"v1":49,"curve":89.99999999999999,"color":"161C26","cMask":[],"curveF":1.0000000000000002},{"v0":50,"v1":51,"curve":89.99999999999999,"color":"161C26","cMask":[],"curveF":1.0000000000000002},{"v0":52,"v1":53,"color":"161C26","cMask":[]},{"v0":54,"v1":55,"color":"161C26","cMask":[]},{"v0":56,"v1":57,"color":"161C26","cMask":[]},{"v0":58,"v1":59,"color":"161C26","cMask":[]},{"v0":60,"v1":61,"color":"161C26","cMask":[]},{"v0":62,"v1":63,"color":"161C26","cMask":[]},{"v0":64,"v1":65,"color":"9101D","cMask":[]},{"v0":66,"v1":67,"color":"9101D","cMask":[]},{"v0":68,"v1":69,"color":"9101D","cMask":[]},{"v0":70,"v1":71,"color":"9101D","cMask":[]},{"v0":72,"v1":73,"color":"9101D","cMask":[]},{"v0":74,"v1":75,"color":"9101D","cMask":[]},{"v0":76,"v1":77,"color":"9101D","cMask":[]},{"v0":78,"v1":79,"color":"9101D","cMask":[]},{"v0":80,"v1":81,"color":"9101D","cMask":[]},{"v0":82,"v1":83,"color":"9101D","cMask":[]},{"v0":84,"v1":85,"color":"9101D","cMask":[]},{"v0":86,"v1":87,"color":"9101D","cMask":[]},{"v0":88,"v1":89,"color":"9101D","cMask":[]},{"v0":90,"v1":91,"color":"9101D","cMask":[]},{"v0":92,"v1":93,"color":"9101D","cMask":[]},{"v0":94,"v1":95,"color":"9101D","cMask":[]},{"v0":96,"v1":97,"color":"9101D","cMask":[]},{"v0":98,"v1":99,"color":"9101D","cMask":[]},{"v0":100,"v1":101,"color":"9101D","cMask":[]},{"v0":102,"v1":103,"color":"9101D","cMask":[]},{"v0":104,"v1":105,"color":"9101D","cMask":[]},{"v0":106,"v1":107,"color":"9101D","cMask":[]},{"v0":108,"v1":109,"color":"9101D","cMask":[]},{"v0":110,"v1":111,"color":"9101D","cMask":[]},{"v0":112,"v1":113,"color":"9101D","cMask":[]},{"v0":114,"v1":115,"color":"9101D","cMask":[]},{"v0":116,"v1":117,"color":"9101D","cMask":[]},{"v0":118,"v1":119,"color":"9101D","cMask":[]},{"v0":120,"v1":121,"color":"9101D","cMask":[]},{"v0":122,"v1":123,"color":"9101D","cMask":[]},{"v0":124,"v1":125,"color":"9101D","cMask":[]},{"v0":126,"v1":127,"color":"9101D","cMask":[]},{"v0":128,"v1":129,"color":"9101D","cMask":[]},{"v0":130,"v1":131,"color":"9101D","cMask":[]},{"v0":132,"v1":133,"color":"333945","cMask":[]},{"v0":134,"v1":135,"color":"333945","cMask":[]},{"v0":136,"v1":137,"color":"333945","cMask":[]},{"v0":138,"v1":139,"color":"333945","cMask":[]},{"v0":140,"v1":141,"color":"333945","cMask":[]},{"v0":142,"v1":143,"color":"333945","cMask":[]},{"v0":144,"v1":145,"color":"333945","cMask":[]},{"v0":146,"v1":147,"color":"333945","cMask":[]},{"v0":148,"v1":149,"color":"333945","cMask":[]},{"v0":150,"v1":151,"color":"333945","cMask":[]},{"v0":152,"v1":153,"color":"333945","cMask":[]},{"v0":154,"v1":155,"color":"333945","cMask":[]},{"v0":156,"v1":157,"color":"333945","cMask":[]},{"v0":158,"v1":159,"color":"333945","cMask":[]},{"v0":160,"v1":161,"color":"333945","cMask":[]},{"v0":162,"v1":163,"color":"333945","cMask":[]},{"v0":164,"v1":165,"color":"333945","cMask":[]},{"v0":166,"v1":167,"color":"333945","cMask":[]},{"v0":168,"v1":169,"color":"333945","cMask":[]},{"v0":170,"v1":171,"color":"333945","cMask":[]},{"v0":172,"v1":173,"color":"333945","cMask":[]},{"v0":174,"v1":175,"color":"333945","cMask":[]},{"v0":176,"v1":177,"color":"333945","cMask":[]},{"v0":178,"v1":179,"color":"333945","cMask":[]},{"v0":180,"v1":181,"color":"333945","cMask":[]},{"v0":182,"v1":183,"color":"333945","cMask":[]},{"v0":184,"v1":185,"color":"333945","cMask":[]},{"v0":186,"v1":187,"color":"333945","cMask":[]},{"v0":188,"v1":189,"color":"333945","cMask":[]},{"v0":190,"v1":191,"color":"333945","cMask":[]},{"v0":192,"v1":193,"color":"333945","cMask":[]},{"v0":194,"v1":195,"color":"333945","cMask":[]},{"v0":196,"v1":197,"color":"333945","cMask":[]},{"v0":198,"v1":199,"color":"333945","cMask":[]}],"planes":[{"normal":[0,1],"dist":-350,"_data":{"extremes":{"normal":[0,1],"dist":-350,"canvas_rect":[-810,-394,810,395],"a":[-810,-350],"b":[810,-350]}}},{"normal":[0,-1],"dist":-350,"_data":{"extremes":{"normal":[0,-1],"dist":-350,"canvas_rect":[-810,-394,810,395],"a":[-810,350],"b":[810,350]}}},{"normal":[1,0],"dist":-810,"_data":{"extremes":{"normal":[1,0],"dist":-810,"canvas_rect":[-810,-394,810,395],"a":[-810,-394],"b":[-810,395]}}},{"normal":[-1,0],"dist":-810,"_data":{"extremes":{"normal":[-1,0],"dist":-810,"canvas_rect":[-810,-394,810,395],"a":[810,-394],"b":[810,395]}}},{"normal":[-1,0],"dist":-360,"bCoef":0,"cMask":["c2"],"_data":{"extremes":{"normal":[-1,0],"dist":-360,"canvas_rect":[-810,-394,810,395],"a":[360,-394],"b":[360,395]}}},{"normal":[1,0],"dist":-360,"bCoef":0,"cMask":["c1"],"_data":{"extremes":{"normal":[1,0],"dist":-360,"canvas_rect":[-810,-394,810,395],"a":[-360,-394],"b":[-360,395]}}}],"goals":[{"p0":[-708.3,-85],"p1":[-708.3,85],"team":"red"},{"p0":[708.3,85],"p1":[708.3,-85],"team":"blue"}],"discs":[{"radius":5.4,"invMass":0,"pos":[-700,85],"color":"3B424F"},{"radius":5.4,"invMass":0,"pos":[-700,-85],"color":"3B424F"},{"radius":5.4,"invMass":0,"pos":[700,85],"color":"3B424F"},{"radius":5.4,"invMass":0,"pos":[700,-85],"color":"3B424F"},{"radius":0,"invMass":0,"pos":[360,-318],"cMask":["none"]},{"radius":0,"invMass":0,"pos":[360,318],"cMask":["none"]},{"radius":0,"invMass":0,"pos":[-360,-318],"cMask":["none"]},{"radius":0,"invMass":0,"pos":[-360,318],"cMask":["none"]}],"playerPhysics":{"bCoef":0,"acceleration":0.11,"kickingAcceleration":0.083,"kickStrength":4.545},"ballPhysics":{"radius":5.8,"invMass":1.5,"color":"FFA500","bCoef":0.412},"spawnDistance":366.5,"traits":{},"joints":[{"d0":5,"d1":6,"strength":"rigid","color":"4F5869","length":null},{"d0":7,"d1":8,"strength":"rigid","color":"4F5869","length":null}],"redSpawnPoints":[],"blueSpawnPoints":[],"canBeStored":false}`;
	
	return futsalMap;
}

/*------------------------------ END OF STADIUMS ----------------------------*/
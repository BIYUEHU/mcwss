const WebSocketServer = require('ws').Server;
const readline =require('readline');
const rl = readline.createInterface({
	input:process.stdin,
	output:process.stdout
  })
const fs = require('fs');
const http = require('http');
const needle = require('needle');
const chinaTime = require('china-time');


//配置
var config = JSON.parse(fs.readFileSync('./data/config.json').toString());
var blacklist_temp1 = JSON.parse(fs.readFileSync('./data/blacklist.list').toString());
var blacklist_temp2 = blacklist_temp1.title + "\n外传平台 外传者信息 外传文件\n"
for (var i = 0;i < blacklist_temp1.blacklist.length;i++) {
	if (blacklist_temp1.blacklist != null) {
		var blacklist_temp2 = blacklist_temp2 + blacklist_temp1.blacklist[i].wcpt + ' ' + blacklist_temp1.blacklist[i].wczxx + ' ' + blacklist_temp1.blacklist[i].wcwj + '\n';
	} else {
		console.log("[错误]读取黑名单文件时出现了问题");
	}
}

const port = config.port;
const key = config.key;
const by = 'BIYUEHU'
const banben = '1.0.0';
const blacklist = blacklist_temp2 + blacklist_temp1.welcome + "\n最后更新:" + blacklist_temp1.lasttime; 

const allowhtmlconnections = config.allowhtmlconnections;
// const htmlport = config.htmlport;

const wss = new WebSocketServer({port:port});  

console.info('Beijing Time:' + chinaTime('YYYY-MM-DD HH:mm:ss'));
console.log('Welcome to HuliWs WebSocket');
console.log('Author:' +  by);
console.log('Version:' + banben);
console.log('My github:@BIYUEHU');
console.log('All owned by biyuehu');




//uuid获取
function uuid() {
	var s = [];
	var hexDigits = "0123456789abcdef";
	for (var i = 0; i < 36; i++) {
		s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
	}
	s[14] = "4"; 
	s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); 
	s[8] = s[13] = s[18] = s[23] = "-";

	var uuid = s.join("");   
	return uuid;
}


rl.on('line', function(line){
    switch(line.trim()) {
        case '-end':
            rl.close();
            break;
    }
});

//随机数
function sjs (n) {
    var v = Math.floor(Math.random()*n);
    return v;
}

//获取本地IP
function getLocalIP() {
    const os = require('os');
    const osType = os.type(); //系统类型
    const netInfo = os.networkInterfaces(); //网络信息
    let ip = '';
    if (osType === 'Windows_NT') { 
        for (let dev in netInfo) {
        	//win7的网络信息中显示为本地连接，win10显示为以太网
            if (dev === '本地连接' || dev === '以太网') {
                for (let j = 0; j < netInfo[dev].length; j++) {
                    if (netInfo[dev][j].family === 'IPv4') {
                        ip = netInfo[dev][j].address;
                        break;
                    }
                }
            }
        }

    } else if (osType === 'Linux') {
        ip = netInfo.eth0[0].address;
    }

    return ip;
}


wss.on('connection', function connection(ws, req){
const ClientIp = req.connection.remoteAddress;

//世界卸载
ws.send(JSON.stringify(
{
	"body": {
		"eventName": "WorldUnloaded"
	},
	"header": {
		"requestId": uuid(),		
		"messagePurpose": "subscribe",
		"version": 1,
		"messageType": "commandRequest"
	}
}
));
//挖掘方块
ws.send(JSON.stringify(
{
	"body": {
		"eventName": "BlockBroken"
	},
	"header": {
		"requestId": uuid(),
		"messagePurpose": "subscribe",
		"version": 1,
		"messageType": "commandRequest"
	}
}
));
//放置方块
ws.send(JSON.stringify(
{
	"body": {
		"eventName": "BlockPlaced"
	},
	"header": {
		"requestId": uuid(),
		"messagePurpose": "subscribe",
		"version": 1,
		"messageType": "commandRequest"
	}
}
));
//板文字更新
ws.send(JSON.stringify(
{
	"body": {
		"eventName": "BoardTextUpdated"
	},
	"header": {
		"requestId": uuid(),
		"messagePurpose": "subscribe",
		"version": 1,
		"messageType": "commandRequest"
	}
}
));
//制作物品
ws.send(JSON.stringify(
{
	"body": {
		"eventName": "ItemCrafted"
	},
	"header": {
		"requestId": uuid(),
		"messagePurpose": "subscribe",
		"version": 1,
		"messageType": "commandRequest"
	}
}
));
//摧毁物品
ws.send(JSON.stringify(
{
	"body": {
		"eventName": "ItemDestroyed"
	},
	"header": {
		"requestId": uuid(),
		"messagePurpose": "subscribe",
		"version": 1,
		"messageType": "commandRequest"
	}
}
));
//使用物品
ws.send(JSON.stringify(
{
	"body": {
		"eventName": "ItemUsed"
	},
	"header": {
		"requestId": uuid(),
		"messagePurpose": "subscribe",
		"version": 1,
		"messageType": "commandRequest"
	}
}
));
//吉祥物创建
ws.send(JSON.stringify(
{
	"body": {
		"eventName": "AgentCreated"
	},
	"header": {
		"requestId": uuid(),
		"messagePurpose": "subscribe",
		"version": 1,
		"messageType": "commandRequest"
	}
}
));
//吉祥物指令
ws.send(JSON.stringify(
{
	"body": {
		"eventName": "AgentCommand"
	},
	"header": {
		"requestId": uuid(),
		"messagePurpose": "subscribe",
		"version": 1,
		"messageType": "commandRequest"
	}
}
));
//击杀BOSS
ws.send(JSON.stringify(
{
	"body": {
		"eventName": "BossKilled"
	},
	"header": {
		"requestId": uuid(),
		"messagePurpose": "subscribe",
		"version": 1,
		"messageType": "commandRequest"
	}
}
));
//击杀怪物
ws.send(JSON.stringify(
{
	"body": {
		"eventName": "MobKilled"
	},
	"header": {
		"requestId": uuid(),
		"messagePurpose": "subscribe",
		"version": 1,
		"messageType": "commandRequest"
	}
}
));
//玩家死亡
ws.send(JSON.stringify(
{
	"body": {
		"eventName": "PlayerDied"
	},
	"header": {
		"requestId": uuid(),
		"messagePurpose": "subscribe",
		"version": 1,
		"messageType": "commandRequest"
	}
}
));
//玩家加入
ws.send(JSON.stringify(
{
	"body": {
		"eventName": "PlayerJoin"
	},
	"header": {
		"requestId": uuid(),
		"messagePurpose": "subscribe",
		"version": 1,
		"messageType": "commandRequest"
	}
}
));
//玩家退出
ws.send(JSON.stringify(
{
	"body": {
		"eventName": "PlayerLeave"
	},
	"header": {
		"requestId": uuid(),
		"messagePurpose": "subscribe",
		"version": 1,
		"messageType": "commandRequest"
	}
}
));
//玩家传送
ws.send(JSON.stringify(
{
	"body": {
		"eventName": "PlayerTeleported"
	},
	"header": {
		"requestId": uuid(),
		"messagePurpose": "subscribe",
		"version": 1,
		"messageType": "commandRequest"
	}
}
));
//玩家消息
ws.send(JSON.stringify(
{
	"body": {
		"eventName": "PlayerMessage"
	},
	"header": {
		"requestId": uuid(),
		"messagePurpose": "subscribe",
		"version": 1,
		"messageType": "commandRequest"
	}
}
));
//建造门户
ws.send(JSON.stringify(
{
	"body": {
		"eventName": "PortalBuilt"
	},
	"header": {
		"requestId": uuid(),
		"messagePurpose": "subscribe",
		"version": 1,
		"messageType": "commandRequest"
	}
}
));
//门户使用
ws.send(JSON.stringify(
{
	"body": {
		"eventName": "PortalUsed"
	},
	"header": {
		"requestId": uuid(),
		"messagePurpose": "subscribe",
		"version": 1,
    	"messageType": "commandRequest"
	}
}
));


function cmd (command){
	return (
		ws.send(JSON.stringify(
			{ 
				"body": { 
					"origin": { 
						"type": "player" 
					}, 
					"commandLine": command, 
					"version": 1 
				}, 
				"header": { 
					"requestId": uuid(), 
					"messagePurpose": "commandRequest", 
					"version": 1, 
					"messageType": "commandRequest" 
				} 
			}
		))	
	)
};

function log (rizhi,sj) {
	if (sj == false) {
		console.log(rizhi);
	} else {
		console.log('[' + chinaTime('YYYY-MM-DD HH:mm:ss') + ']' + rizhi);		
	}	
	fs.appendFile('./data/logs/' + chinaTime('YYYY-MM-DD') + '.log', '[' + chinaTime('YYYY-MM-DD HH:mm:ss') + ']' + rizhi /*+ '\r\n'*/, err=> {})		
}

function time (time,hanshu,canshu) {
	setTimeout(
        function () {
            hanshu (canshu)
        },
    time)
};

function fun (path) {
    fs.readFile(path,'utf8',
        function (e,data) {		
            if (e) {
                log('读取失败');
            }	
            if (!e) {
                data.toString().split('\n').forEach(
                    function (a,b,c) {
                        cmd(a);
                    }
                );
            }
        }
    )
}

function times (time,hanshu,canshu) 
    {setInterval(
        function () {
            hanshu(canshu)
        },
    time);
}

function chat (n) {
    cmd('say ' + n)
}

function chatf (v,n,c) {
    if (c != null) {
        if (c == 0) {
            var c1 = 'c';
        } else if (c == 1) {
            var c1 = 'e';
        } else if (c == 2) {
            var c1 = 'b';
        } else if (c == 3) {
            var c1 = 'a';
        }
    }

    if (v != null && n == null && c == null) {        
        cmd('tellraw @a { \"rawtext\" : [ { \"text\" : \"' + v + '\" } ] }');
    } else if (v != null && n != null && c == null ) {
        cmd('tellraw @a { \"rawtext\" : [ { \"text\" : \"<' + n + '>' + v + '§r\" } ] }');
    } else if (v != null && n == null && c != null) {
        cmd('tellraw @a { \"rawtext\" : [ { \"text\" : \"§' + c1 + v + '\" } ] }');
    } else if (v != null && n != null && c !== null) {
        cmd('tellraw @a { \"rawtext\" : [ { \"text\" : \"<' + n + '>§' + c1 + v + '§r\" } ] }');
    }          
}

function playsound (music) {
	cmd('stopsound @a');
	cmd('playsound ' + music + '@a');
	chatf('[播放机]§e正在为您播放 §5' + music + '§6.ogg §eIng...');
}

function stopsound () {
	cmd('stopsound @a')
	chatf('[播放机]§2已为您关闭所有播放中的音乐');
}

rl.on('line', function(line){
    switch(line.trim()) {
		case '-list': 
			cmd('list')
			break
		case '-outwss':
			cmd('wsserver out')
			break
        default:
            cmd(line)
            break;
    }
});


//HTML控制台服务器
var htmlport = sjs(65535);
var htmlport1 = parseInt(fs.readFileSync('./data/temp/ports').toString());
if (htmlport1 == null) {
	var htmlport1 = 0;
} 
if (htmlport == htmlport1) {
	var htmlport = sjs(65535);
} else if (htmlport == htmlport1) {
	var htmlport = sjs(65535);
} else if (htmlport == htmlport1) {
	var htmlport = sjs(65535);
}
fs.writeFile('./data/temp/ports', htmlport + '', err=> {});

var ws2 = require("nodejs-websocket");

if (allowhtmlconnections == true) {
	var server = ws2.createServer(function (conn) {
		conn.on("text", function (str) {
			log("HTML控制台:" + str)
			if (str.substring(0,4) == 'key:') {
				if (str.split(':')[1] != key) {
					connection.close
					log("HTML控制台:" + "key错误")
				} else {
					log("HTML控制台:" + "验证通过")
				}				
				server.close;
				var key1 = str.split(':')[1]
			}
			if (str.substring(0,4) == 'cmd:') {
				cmd(str.split(':')[1])
			} else if (str.substring(0,4) == 'say:') {
				chatf(str.split(':')[1],'HTML控制台')
			}
		})
		conn.on("close", function (code, reason) {
			log("HTML控制台:" + "关闭了连接")
		});
		conn.on("error", function (code, reason) {
			log("HTML控制台:" + "异常关闭")
		});
	}).listen(htmlport)
}
/*
cmd(command)   
执行MC/指令
<command> string;MC指令，要加'/'

log(log,time)   
向控制台输出日志并保存日志文件
<log> string;日志内容
<time> boor;可选;控制台输出日志时是否带有时间，默认true

fun(path)
执行指定服务器相对路径的mcfunction文件内容
<path> string;mcfunction文件路径

time(time,function,parameter)   
延时执行一条函数
<time> num;延时时间，单位为tick 1000Tick=1S
<function> fun;函数名
<parameter> any;可选;执行函数的参数

times(time,function,parameter)
间隔一定时间执行一个函数，一旦使用，不会停止
<time> num;间隔时间，单位为tick 1000Tick=1S
<function> fun;函数名
<parameter> any;可选;执行函数的参数

chat(message)
向所有连接玩家发送一条普通消息，带有发送者名为'外部'的前缀
<message> string;消息内容

chatf(message,name,color)
向所有连接玩家发送一条高级消息
<message> string;消息内容
<name> string;可选;发送者名字
<color> num;消息文字颜色，0红色,1黄色,2蓝色,3绿色
*/


chatf('欢迎使用HuliWs', null, 1)
chatf('WS作者：' +  by, null, 3)
chatf('WS版本：' + banben, null, 3)
chatf('您的IP是 ' + ClientIp, null, 2)
var lianjie = chinaTime('YYYY-MM-DD HH:mm:ss')
chatf('现在北京时间：' + lianjie, null, 1)
chatf("§4" + blacklist)
var neirong = '[' + chinaTime('YYYY-MM-DD HH:mm:ss') + ']IP ' + ClientIp + ' 连接到了服务器'
log(neirong)
var neirong = 'WebSocket收到了新的连接,设定Html控制台端口:' + htmlport + ' 完整URL:WS//WS服务器IP' + getLocalIP() + ':' + htmlport + ' WSKey:' + key;
chatf(neirong)
log(neirong)
chatf('输入 */help 获取更多')



var h = m = s = 0;
function jishi () {
    s++;
    if (s > 59) {
        s = s%60
        m++
    }
    if (m > 59) {
        m = s%60
        h++
    }
    var lianjie3 = h + '时' + m + '分' + s + '秒'
    return lianjie3
}
times(1000,jishi)


function clears () {
	for (var i = 0;i < 100;i++) {
		chatf('')
	}
}

ws.on('message',function (message,wsi){
	var neirong = "[检测] [客户端ID " + wsi + "] 收到: " + message;
	log(neirong);
	var message_temp = JSON.parse(message);
	// chat(message_temp);

	
	var resp_temp = JSON.parse(message)
	if (resp_temp.body.properties != null && resp_temp.body.properties.Receiver != null && resp_temp.body.properties.UserId != null) {
		var player_name = resp_temp.body.properties.Receiver;
		var player_id = resp_temp.body.properties.UserId;
		fs.exists('./data/players/' + player_name + '_' + player_id + '.info', (exists) => {
			if (exists) {	 
				 
		   	} else {
				fs.writeFile('./data/players/' + player_name + '_' + player_id + '.info', JSON.stringify(resp_temp), err=> {})
			}
	  	})
	}

	function onSay (n,callack,canshu1,canshu2,canshu3) {	
		if(JSON.parse(message).body.eventName=="PlayerMessage" && JSON.parse(message).body.properties.MessageType=="chat") {		
			var Sender = JSON.parse(message).body.properties.Sender;
			var Message = JSON.parse(message).body.properties.Message;
			if (Message == n && Sender != '外部') {
				callack(canshu1,canshu2,canshu3);
			}
			return Sender, Message;
		}
	}

	function onBlockPlaced (callback) {
		if(JSON.parse(message).body.eventName=="BlockPlaced") {
			var block = JSON.parse(message).body.properties.Block;
			var id = JSON.parse(message).body.properties.Type
			callback()
			return block,id;
		}
	}

	function onJoin (callback,canshu1,canshu2,canshu3) {
		if(JSON.parse(message).body.eventName=="PlayerJoin") {
			var PlayerName = JSON.parse(message).body.properties.PlayerName;
			callack(canshu1,canshu2,canshu3);
			return PlayerName;
		}
	}

	onSay('*/help',chatf,'§2--- HuliWs指令帮助页 ---§r\n*/help §7- 显示HuliWs指令帮助页§r\n*/ct §7- 显示WebSocket连接时间§r\n*/about §7- 关于信息§r\n*/blacklist §7- 查看黑名单§r\n*/clears §7- 清除聊天栏内容§r\n*/helpy §7- 显示隐藏指令帮助页§r')
	onSay('*/helpy',chatf,'§2---- 隐藏指令帮助页 ----§r\n./closewebsocket §7- 关闭websocket连接§r\n./gettopsolidblock <x> <y> <z> §7- 获取坐标点最顶层固态方块坐标§r\n./querytarget <选择器> §7- 获取实体的精确浮点坐标§r\n./agent §7- 吉祥物§r\n./enableencryption §7- 未知§r\n./closechat §7- 关闭聊天栏§r\n./geteduclientinfo §7- 获取版本信息§r\n./getlocalplayername §7- 返回玩家名字§r')
	onSay('*/ct',chatf,'已正常连接' + jishi() + '\n连接时间：' + lianjie)   
	onSay('*/about',chatf,'HuliWs\n作者：' +  by + '\nWS版本：' + banben + '\n您的IP是 ' + ClientIp + '\n设定Html控制台端口:' + htmlport + '\n完整URL:WS//WS服务器IP' + getLocalIP() + ':' + htmlport + '\nWSKey:' + key)
	onSay('*/blacklist',chatf,"§4" + blacklist)
	onSay('*/clears',clears)
	onSay('fun',fun,'./data/functions/test.mcfunction')

	onSay('停止播放',stopsound)
	onSay('播放 病名为爱',playsound,'bmwa')
	onSay('播放 打上火花',playsound,'dshh')
	onSay('播放 Alone',playsound,'alone')
	onSay('播放 心做',playsound,'xz')
	onSay('播放 oldmemory',playsound,'oldmemory')

	if (JSON.parse(message).body.statusMessage != null) {
		chat('Command Return:\n' + message_temp.body.statusMessage)
	} else if (JSON.parse(message).body.blockName != null) {
		chat('Command Return:\n' + JSON.stringify(message_temp))
	} else if (JSON.parse(message).body.clientuuid != null) {
		chat('Command Return:\n' + JSON.stringify(message_temp))
	} 
	if(JSON.parse(message).body.eventName=="PlayerMessage") {
		if (JSON.parse(message).body.properties.Message.substring(0, 2) == "./") {
			cmd(JSON.parse(message).body.properties.Message.split("/")[1]);
			
		}
	}
	/* 
	/closewebsocket 1 关闭WS连接
	/gettopsolidblock x y z 1 获取坐标点最顶层固态方块坐标
	/querytarget 选择器 1 获取实体的精确浮点坐标
	/agent 1 吉祥物
	/enableencryption 3 未知
	/closechat 1 关闭聊天栏
	/geteduclientinfo 1 获取版本信息
	/getlocalplayername 1 返回玩家名
	*/

	if(JSON.parse(message).body.eventName=="PlayerMessage" && JSON.parse(message).body.properties.MessageType=="say") {
		var neirong = JSON.parse(message).body.properties.Sender + " 运行Say指令: " + JSON.parse(message).body.properties.Message;
		log(neirong)
	}
	if(JSON.parse(message).body.eventName=="PlayerMessage" && JSON.parse(message).body.properties.MessageType=="tell") {			
		var neirong = JSON.parse(message).body.properties.Sender + " 告诉 " + JSON.parse(message).body.properties.Receiver+  " : " + JSON.parse(message).body.properties.Message;
		log(neirong)
	}	
	if(JSON.parse(message).body.eventName=="PlayerMessage" && JSON.parse(message).body.properties.MessageType=="chat") {			
		var neirong = JSON.parse(message).body.properties.Sender + " 说: " + JSON.parse(message).body.properties.Message;
		log(neirong)
		// fs.writeFile('./data/temp/kuashijie', '>>>跨世界聊天 ' + JSON.parse(message).body.properties.Sender + " 说: " + JSON.parse(message).body.properties.Message, err=> {})
	}	
	if(JSON.parse(message).body.eventName=="BlockBroken") {
		var neirong = "方块 " + JSON.parse(message).body.properties.Block + "(Id:" + JSON.parse(message).body.properties.Type + ") 被物品: "+ JSON.parse(message).body.properties.ToolItemType +" 摧毁";
		log(neirong)
	}
	if(JSON.parse(message).body.eventName=="BlockPlaced") {
		var neirong = "方块 " + JSON.parse(message).body.properties.Block + "(Id:" + JSON.parse(message).body.properties.Type + ") 被放置";
		log(neirong)
	}
	if(JSON.parse(message).body.eventName=="PlayerJoin") {
		var neirong = JSON.parse(message).body.properties.PlayerName + " 加入了游戏 游戏颜色: " + JSON.parse(message).body.properties.PlayerColor;
		log(neirong)
	}
	if(JSON.parse(message).body.eventName=="PlayerLeave") {
		var neirong = JSON.parse(message).body.properties.PlayerName + " 退出了游戏 游戏颜色:" + JSON.parse(message).body.properties.PlayerColor;
		log(neirong)
	}
	if(JSON.parse(message).body.eventName=="PortalBuilt") {
		var neirong = "门户创建!";
		log(neirong)
	}
	if(JSON.parse(message).body.eventName=="PortalUsed") {
		var neirong = "门户使用";
		log(neirong)
	}
	if(JSON.parse(message).body.eventName=="PlayerDied") {
		var neirong = "玩家 " + JSON.parse(message).body.properties.Cause + " 死了 用 " + JSON.parse(message).body.properties.KillerEntity;
		log(neirong)
	}
	if(JSON.parse(message).body.eventName=="MobKilled") {
		var neirong = "怪物 " + JSON.parse(message).body.properties.MobType + " 死了 用武器:" + JSON.parse(message).body.properties.WeaponType + ",方式:" + JSON.parse(message).body.properties.MethodType;
		log(neirong)
	}
	if(JSON.parse(message).body.eventName=="ItemDestroyed") {
		var neirong = "物品被摧毁了 通过 " + JSON.parse(message).body.properties.DestructionMethodType;
		log(neirong)
	}
	if(JSON.parse(message).body.eventName=="ItemCrafted") {
		var neirong = "物品被创建了";
		log(neirong)
	}
	if(JSON.parse(message).body.eventName=="BossKilled") {
		var neirong = "Boss " + JSON.parse(message).body.properties.BossType + " 被击杀";
		log(neirong)
	}
	if(JSON.parse(message).body.eventName=="AgentCommand") {
	    var neirong = "吉祥物收到指令";
		log(neirong)
	}
	if(JSON.parse(message).body.eventName=="AgentCreated") {	
		var neirong = "吉祥物被创建";
		log(neirong)		
	}
})    
});

rl.on('close', function() {
    console.log('bye bye');
    process.exit(0);
});
# HULIWS-功能文档
## 功能  
### 文件结构  
**根**  
- data  
  - function  
    - test.mcfunction  
    - (...mcfunction文件)  
  - logs  
    - (...XXXX-XX-XX.log文件)  
  - players  
    - (...playername_userid.info玩家信息文件)    
  - blacklist.list  (存放黑名单内容)  
  - config.json  (配置文件)  
- node_modules  
  - (存放着node模块资源，内容省略)  
- web  
  - fonts  
    - (存放字体文件，内容省略)  
  - images  
    - (存放图片文件，内容省略)   
  - js  
    - (存放JS文件，内容省略)  
  - styles  
    - (存放CSS文件，内容省略)  
  - index.html  
- md
  - (存放着MD文件，内容省略)
- .gitignore  
- License  
- main.js  
- package.json  
- README.md  
- start.bat  

## 详细  
接下来将会详细解释每个文件/文件夹的作用，以了解该WS功能  
### main.js  
整个WS主要文件，可在CMD内输入node js或npm run huliws(在package.json可用情况下)  
### start.bat  
特殊情况外，运行本WS只需双击运行该bat文件即可(在Windows下)  
### data/  
存放主要数据  
子文件夹**function**存放着mcfunction函数文件，以供调用  
子文件夹**logs**存放着XXXX-XX-XX时间格式的log日志文件  
记录事件信息表  
| 事件信息                                                     |               备注 |
| ------------------------------------------------------------ | -----------------: |
| IP[IP] 连接到了服务器                                        |                    |
| HTML控制台:[string]                                          |                    |
| HTML控制台:[key]                                             |                    |
| HTML控制台:验证通过/key错误                                  |                    |
| HTML控制台:关闭了连接                                        |                    |
| HTML控制台:异常关闭                                          |                    |
| WebScoket收到了新的连接,设定Html控制台端口:[htmlport]完整URL:WS//WS服务器IP[LocalIP]:[htmlport]WSkey:[key] |                    |
| 读取失败                                                     | mcfunction文件读取 |
| [检测]\[客户端ID[wsi]]收到:[message]                         |                    |
| [playername]运行Say指令:[message]                            |                    |
| [playername]告诉[receivor]:[message]                         |                    |
| [playername]说:[message]                                     |                    |
| 方块[block]\(Id:[id])被物品[item]摧毁                        |                    |
| 方块[block]\(id:[id])被放置                                  |                    |
| [playername]加入了游戏 游戏颜色:[playercolor]                |                    |
| [playername]退出了游戏 游戏颜色[playercolor]                 |                    |
| 门户创建!                                                    |                    |
| 门户使用                                                     |                    |
| 玩家[cause]死了 用[killerentity]                             |                    |
| 怪物[mobtype]死了 用武器[weapontype],方式[methodtype]        |                    |
| 物品被摧毁了 通过[destructionmethodtype]                     |                    |
| 物品被创建了                                                 |                    |
| Boss[bosstype]被击杀                                         |                    |
| 吉祥物收到指令                                               |                    |
| 吉祥物被创建                                                 |                    |
子文件夹**players**存放着玩家信息文件，其后缀为.info  
其本质只是个JSON。每同一个玩家信息仅会记录一遍，便不再更新，可删除对应信息文件手动更新  
信息示例:  
```json  
{
	"body": {
		"eventName": "PlayerMessage",
		"measurements": null,
		"properties": {
			"AccountType": 1,
			"ActiveSessionID": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
			"AppSessionID": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
			"Biome": 29,
			"Build": "1.17.X",//GameVersion
			"BuildNum": "550xxxx",//VersionNumber
			"BuildPlat": 1,
			"Cheevos": false,
			"ClientId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
			"CurrentNumDevices": 1,
			"DeviceSessionId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
			"Difficulty": "NORMAL",
			"Dim": 0,
			"GlobalMultiplayerCorrelationId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
			"Message": "{\"rawtext\":[{\"text\":\"Input */help to Get Another\"}]}\n",
			"MessageType": "tell",
			"Mode": 1,
			"NetworkType": 0,
			"Plat": "Android/windows/ios/macos/...",//Os of the player
			"PlayerGameMode": 1,
			"Receiver": "xxxxxx",//playername
			"Sender": "External",
			"Seq": 242,
			"ServerId": "raknet:xxxxxxxxxxxxxxxxxxxx",
			"UserId": "xxxxxxxxxxxxxxxx",
			"WorldFeature": 0,
			"WorldSessionId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
			"isTrial": 0,
			"locale": "zh_CN",//The player is using language
			"vrMode": false
		}
	},
	"header": {
		"messagePurpose": "event",
		"requestId": "00000000-0000-0000-0000-000000000000",
		"version": 1
	}
}
```
**blacklist.list**  
存放着黑名单内容  
**config.json**  
配置文件，目前可配置参数较少  
```json  
{  
    "port": 1,//WSServer Port,Number 0-65535   
    "allowhtmlconnections": true,//The Html can connections,Bool  
    "htmlport": null,//Ueless the configuration item  
    "key": "xxxxxxxxxxx"//WSkey,It's using in html connecting,String  
}  
```
### web  
存放HTML控制台web页面文件，可以将其复制到其它地方  
子文件夹**fonts**存放着字体文件  
子文件夹**images**存放着图片文件  
子文件夹**styles**存放着CSS文件  
子文件夹**js**存放着JS以及HTML控制台核心文件  
**index.html**  
HTML控制台主页文件  

## 游戏  
### 内置指令  
**内置指令**一般指该WS其内置的指令，以“\*"号+"/"开头  
目前一共有六个内置指令  
| 指令        | 功能                  | 备注                           |
| ----------- | --------------------- | ------------------------------ |
| */help      | 显示HuliWs指令帮助页  |                                |
| */helpy     | 显示隐藏指令帮助页    |                                |
| */ct        | 显示WebSocket连接时间 |                                |
| */about     | 关于信息              |                                |
| */blacklist | 查看黑名单            |                                |
| */clears    | 清除聊天栏内容        | 执行后需退出聊天栏才可查看效果 |

### 隐藏指令  
\*词可能带歧义，请注意区分  
连接WS后，可使用游戏中平常无法使用的指令，这些指令为游戏内置，，以“.”逗号+"/"开头  
目前一共有八个隐藏指令  
| 指令                              | 功能                         |
| --------------------------------- | ---------------------------- |
| ./closewebsocket                  | 关闭websocket连接            |
| ./gettopsolidblock \<x> \<y> \<z> | 获取坐标点最顶层固态方块坐标 |
| ./querytarget <选择器>            | 获取实体的精确福点坐标       |
| ./agent                           | 吉祥物                       |
| ./enableencryption                | 未知                         |
| ./closechat                       | 关闭聊天栏                   |
| ./geteduclientinfo                | 获取版本信息                 |
| ./getlocalplayername              | 返回玩家名字                 |

### HTML控制台  
可直接通过浏览器打开**web/index.html**文件，亦或挂在自己的网站上，也可通过我们已搭建  在线网站:[>This](https://biyuehu.github.io/huliws)  
![](../web/images/z1.png)  
![](../web/images/z2.png)  
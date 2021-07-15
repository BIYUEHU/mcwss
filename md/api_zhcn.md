# HULIWS-API文档  
将此项目放置node_modules文件夹  
```js  
const huliws = require("huliws")  
//引入模块  
```

## 全局函数  
#### uuid()  
将会获取一条UUID  
*返回值*  
| 类型   | 内容     |
| ------ | -------- |
| string | 一条uuid |

#### sjs(max)  
将会随机生成一个数值  
*参数*  
| 名字 | 类型   | 备注                     |
| ---- | ------ | ------------------------ |
| max  | number | 生成的最大值,最小值默认0 |
*返回值*  
| 类型   | 内容   |
| ------ | ------ |
| number | 随机值 |

#### getLocalIP()  
返回本地IP  
*返回值*  
| 类型   | 内容   |
| ------ | ------ |
| string | 本地IP |

## 局部函数  
### 局部函数一  
在**wss.on('connection', function connection(ws, req){...}**内可用  

#### cmd(command)  
执行MC指令  
*参数*  
| 名字    | 类型   | 备注                 |
| ------- | ------ | -------------------- |
| command | string | 指令内容,可不加斜杠/ |
*返回值*  
| 类型   | 内容 |
| ------ | ---- |
| object | 指令 |

#### log(message,usetime)  
输出一条日志,可以当作console.log简化版,且使用该函数输出的日志将会自动记录到logs文件夹的  log文件内  
*参数*  
| 名字    | 类型   | 备注                           |
| ------- | ------ | ------------------------------ |
| message | string | 日志内容                       |
| usetime | bool   | 是否在记录的日志信息前加上时间 |

#### time(time,function,parameter)  
延时执行一条函数  
*参数*  
| 名字      | 类型   | 备注                           |
| --------- | ------ | ------------------------------ |
| time      | number | 延时时间,单位:tick 1000Tick=1S |
| function  | string | 执行函数名                     |
| parameter | string | 执行函数参数;非必要            |

#### fun(path)  
读取WS服务器本地.mcfunction文件并执行;失败将在日志输出'读取失败'  
*参数*  
| 名字 | 类型   | 备注                |
| ---- | ------ | ------------------- |
| path | string | .mcfunction文件路径 |

#### times(time,function,parameter)  
间隔一定时间执行一个函数,一旦使用,直至MCWS终止时才会停止  
*参数*  
| 名字      | 类型   | 备注                |
| --------- | ------ | ------------------- |
| time      | number | 间隔时间,单位:tick  |
| function  | string | 执行函数名          |
| parameter | string | 执行函数参数;非必要 |

#### chat(message)  
向所有连接玩家发送一条普通消息，带有发送者名为'外部'的前缀  
*参数*  
| 名字    | 类型   | 备注     |
| ------- | ------ | -------- |
| message | string | 消息内容 |

#### chatf(message,name,color)  
向所有连接玩家发送一条高级消息  
*参数*  
| 名字    | 类型   | 备注 |
| ------- | ------ | ------------------------------------------------------------ |
| message | string | 消息内容                                                     |
| name    | string | 发送者名字,若没有将不带名字前缀;非必要                       |
| color   | number | 消息字体颜色,可选值:<font color="#AA000">0 Red</font>;<font color="#FEFE54">1 Yellow</font>;<font color="#54FFFF">2 Blue</font>;<font color="#54FF54">3 Green</font>. |

#### playersound(music)  
向所有连接玩家一首音乐,需与其音乐包结合  
*参数*  
| 名字  | 类型   | 备注                                   |
| ----- | ------ | ------------------------------------ |
| music | string | 音乐名字(资源包sound.json内定义的id) |

#### stopsound()  
向所有连接玩家停止播放所有音乐  

 ### 局部函数二  
在**ws.on('message',function (message,wsi){...}**下可用  

#### onSay(message,function,parameter)  
玩家发送消息时触发,并触发函数  
*参数*  
| 名字      | 类型   | 备注                     |
| --------- | ------ | ------------------------ |
| message   | string | 需检测的玩家发送消息内容 |
| function  | string | 触发函数名               |
| parameter | string | 触发函数参数;非必要      |
*返回值*  
| 类型   | 内容     |
| ------ | -------- |
| string | 玩家名字 |
| string | 消息内容 |

#### onBlockPlaced(function,parameter)  
玩家放置方块时触发  
*参数*  
| 名字      | 类型   | 备注                |
| --------- | ------ | ------------------- |
| function  | string | 触发函数名          |
| parameter | string | 触发函数参数;非必要 |
*返回值*  
| 类型   | 内容 |
| ------ | ---- |
| string | 方块 |
| string | ID   |

#### onJoin(function,parameter)  
玩家加入游戏时触发  
*参数*  
| 名字      | 类型   | 备注                |
| --------- | ------ | ------------------- |
| function  | string | 触发函数名          |
| parameter | string | 触发函数参数;非必要 |
*返回值*  
| 类型   | 内容     |
| ------ | -------- |
| string | 玩家名字 |
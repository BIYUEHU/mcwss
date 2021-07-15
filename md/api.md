# HULIWS-API Doc  
Place this item in node_ Modules folder  
```js    
const huliws = require("huliws")  
//Introduction module  
```

## Global function  
#### uuid()  
Return a UUID  
*Return values*  
| Type   | content     |
| ------ | -------- |
| string | A uuid |

#### sjs(max)  
A random number will be generated  
*parameters*  
| Name | Type   | remarks                     |
| ---- | ------ | ------------------------ |
| max  | number | max value,min value is 0 |
*Return values*  
| Type   | content   |
| ------ | ------ |
| number | Random value |

#### getLocalIP()  
Return Local IP  
*Return values*  
| Type   | content   |
| ------ | ------ |
| string | Local IP |

## Local function  
### Local function 1  
In the function**wss.on('connection', function connection(ws, req){...}**Available  

#### cmd(command)  
Execute MC instruction  
*parameters*  
| Name    | Type   | remarks                 |
| ------- | ------ | -------------------- |
| command | string | Command content,No slashes/ |
*Return values*  
| Type   | content |
| ------ | ---- |
| object | command |

#### log(message,usetime)  
Output a log, which can be regarded as a simplified version of console.log, and the log output by this function will be automatically recorded in the log file of logs folder  
*parameters*  
| Name    | Type   | remarks                           |
| ------- | ------ | ------------------------------ |
| message | string | Log content                       |
| usetime | bool   | Whether to add time before the recorded log information |

#### time(time,function,parameter)  
Delay execution of a function  
*parameters*  
| Name      | Type   | remarks                           |
| --------- | ------ | ------------------------------ |
| time      | number | Delay Time,Company:tick 1000Tick=1S |
| function  | string | Trigger function Name                     |
| parameter | string | Trigger function parameters;Unnecessary            |

#### fun(path)  
Read and execute the local. Mcfunction file of WS server; Failure will be in log output 'read failed'  
*parameters*  
| Name | Type   | remarks                |
| ---- | ------ | ------------------- |
| path | string | .mcfunction file path |

#### times(time,function,parameter)  
A function is executed at regular intervals. Once used, it will not stop until mcws is terminated  
*parameters*  
| Name      | Type   | remarks                |
| --------- | ------ | ------------------- |
| time      | number | Interval time,Company:tick  |
| function  | string | Trigger function name          |
| parameter | string | Trigger function parameters;Unnecessary |

#### chat(message)  
Send a normal message to all connected players, prefixed with the sender's name 'external'  
*parameters*  
| Name    | Type   | remarks     |
| ------- | ------ | -------- |
| message | string | Message content |

#### chatf(message,name,color)  
Send an advanced message to all connected players  
*parameters*  
| Name    | Type   | remarks |
| ------- | ------ | ------------------------------------------------------------ |
| message | string | Message content                                                     |
| name    | string | Sender's name, if not, will not be prefixed with the name; Unnecessary                       |
| color   | number | Message font color,Optional value:<font color="#AA000">0 Red</font>;<font color="#FEFE54">1 Yellow</font>;<font color="#54FFFF">2 Blue</font>;<font color="#54FF54">3 Green</font>. |

#### playersound(music)  
To connect all players with a piece of music, it needs to be combined with its music package  
*parameters*  
| Name  | Type   | remarks                                   |
| ----- | ------ | ------------------------------------ |
| music | string | Music Name(In the Resource sound.json Defined id) |

#### stopsound()  
Stop playing all music to all connected players  

 ### Local function 2  
On the function **ws.on('message',function (message,wsi){...}**available  

#### onSay(message,function,parameter)  
Trigger when player sends a message, and Trigger function   
*parameters*  
| Name      | Type   | remarks                     |
| --------- | ------ | ------------------------ |
| message   | string | Players to be detected send messages content |
| function  | string | Trigger function name               |
| parameter | string | Trigger function parameters;Unnecessary      |
*Return values*  
| Type   | content     |
| ------ | -------- |
| string | Player Name |
| string | Message content |

#### onBlockPlaced(function,parameter)  
Triggered when player places a square  
*parameters*  
| Name      | Type   | remarks                |
| --------- | ------ | ------------------- |
| function  | string | Trigger function name          |
| parameter | string | Trigger function parameters;Unnecessary |
*Return values*  
| Type   | content |
| ------ | ---- |
| string | block |
| string | ID   |

#### onJoin(function,parameter)  
Trigger when players join the game  
*parameters*  
| Name      | Type   | remarks                |
| --------- | ------ | ------------------- |
| function  | string | Trigger function name          |
| parameter | string | Trigger function parameters;Unnecessary |
*Return values*  

| Type   | content     |
| ------ | -------- |
| string | Player name |
# HULIWS  
#### 选择语言  
[中文简体]()  
[English](../README.md)  

## 前言  
这是一个Minecraft基岩版**WebSocketMod**，功能齐全且强大，并提过额外的API，可用于多种领域。  
例如：开发调试、行为记录&检测&日志、实时内容（内容更新、名单之类的）等  

## 使用  
### 方法一  
1.下载本项目，将其解压  
2.在其根目录的地址栏内输入”cmd“调出CMD  
3.输入"node main.js"或”npm run huliws“回车  
4.在游戏里输入  
```js  
/connect 127.0.0.1:1  
```
### 方法二  
1.下载本项目，将其解压  
2.在根目录找到”start.bat“，双击运行  
4.在游戏里输入  
```js  
/connect 127.0.0.1:1
```
### 方法三  
~~使用我们已搭建好的WS服务器,无需下载~~  
在游戏里输入  
```js  
/connect huliapi.xyz:1  
```
**PS:在本机连接请确保已解除UWP应用循环限制**  
否则将无法连接;以管理员身份运行CMD,输入  
```cmd  
CheckNetIsolation.exe LoopbackExempt –a –p=S-1-15-2-1958404141-86561845-1752920682-3514627264-368642714-62675701-733520436  
```

## 文档  
[功能文档](./function_zhcn.md)  
[API文档](./api_zhcn.md)  

# HULIWS  
####  Choose language   
[Simplified Chinese](./md/README_zhcn.md)  
[English]()  

## preface  
This is a minecraft bedrock version **websocketmod**, which is full-featured and powerful. It also mentions additional API and can be used in many fields。  
For example: development and debugging, behavior record &amp; Detection &amp; log, real-time content (content update, list, etc.) and so on  

## Using  
### Method 1  
1.Download this project and unzip it  
2.Enter "CMD" in the address column of the root directory to call out the CMD  
3.Enter "node main. JS" or "npm run huiws" enter  
4.Input in the game this  

```js  
/connect 127.0.0.1:1  
```
### Method 2  
1.Download this project and unzip it  
2.Find "start. Bat" in the root directory and double-click to run  
4.Input in the game this  
```js  
/connect 127.0.0.1:1
```
### Method 3  
~~Using the WS server we have built, there is no need to download it~~  
Input in the game this  
```js  
/connect 82.157.165.201:1  
```
**PS:Make sure that the uwp application cycle limit has been removed when connecting locally**  
Otherwise, it will not be able to connect; Run the CMD as an administrator and enter  
```cmd  
CheckNetIsolation.exe LoopbackExempt –a –p=S-1-15-2-1958404141-86561845-1752920682-3514627264-368642714-62675701-733520436  
```

## Doc  
[Function Doc](./md/function.md)  
[API Doc](./md/api.md)  

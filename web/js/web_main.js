var cmd;
function lianjie() {
    var mess = document.getElementById("mess");
    var wsweb = document.getElementById('wsweb').value;
    var key = document.getElementById('key').value
    // var ts = document.getElementById("ts");
    if (wsweb == "" && key == "") {
        alert("WS地址和key必填")
    } else {
        if (window.WebSocket) {
            mess.innerHTML = ("正在连接中ing...");
            var ws = new WebSocket(wsweb);
            ws.onopen = function (e) {
                // console.log("连接服务器成功");
                // ws.send("game1");
                ws.send("控制台已连接");
                ws.send("key:" + key)
            }
            ws.onclose = function () {
                mess.innerHTML = ("服务器关闭");
            }
            ws.onerror = function () {
                mess.innerHTML = ("连接出错");
            }

            ws.onmessage = function (e) {
                // console.log('w')
                mess.innerHTML = "连接成功"
                document.querySelector(".kuang").onclick = function (e) {
                    // var time = new Date();
                    // ws.send(e.target.innerHTML);
                }
            }
            mess.innerHTML = ("连接成功");
        }
        function cmd3() {
            var command = document.getElementById("cmd2").value;
            if (command != null) {
                if (window.WebSocket) {
                    ws.send('cmd:' + command);
                    document.getElementById("cmd2").value = ''
                }
            }
        }
        cmd = cmd3;
        function chat3() {
            var message = document.getElementById("chat2").value;
            if (message != null) {
                if (window.WebSocket) {
                    ws.send('say:' + message);
                    document.getElementById("chat2").value = ''
                }
            }
        }
        chat = chat3;

        function g01() {
            ws.send('cmd:' + 'gamemode 0')
        }
        function g11() {
            ws.send('cmd:' + 'gamemode 1')
        }
        function g21() {
            ws.send('cmd:' + 'gamemode 2')
        }
        function t11() {
            ws.send('cmd:' + 'time set sunrise')
        }
        function t21() {
            ws.send('cmd:' + 'time set noon')
        }
        function t31() {
            ws.send('cmd:' + 'time set sunset')
        }
        function t41() {
            ws.send('cmd:' + 'time set night')
        }
        function w11() {
            ws.send('cmd:' + 'weather clear')
        }
        function w21() {
            ws.send('cmd:' + 'weather rain')
        }
        function w31() {
            ws.send('cmd:' + 'weather thunder')
        }
        function zs1() {
            ws.send('cmd:' + 'kill @s')
        }
        function kill1() {
            ws.send('cmd:' + 'kill @e[type=!player]')
        }
        function csd1() {
            ws.send('cmd:' + 'setworldspawn')
        }
        function cc1() {
            ws.send('cmd:' + 'closechat')
        }
        g0 = g01;
        g1 = g11;
        g2 = g21;
        t1 = t11;
        t2 = t21;
        t3 = t31;
        t4 = t41;
        w1 = w11;
        w2 = w21;
        w3 = w31;
        zs = zs1;
        kill = kill1;
        csd = csd1;
        cc = cc1;
    }
}

function about() {
    alert("配合HuliWs WebSocket使用\n通过网页连接HuliWs的WS服务器，并向其WS服务器发送数据，WS通过解析又转发至对应的控制台端口的玩家游戏中执行/斜杆指令\nHuliWs&Html控制台作者:碧月狐dada\nMyBlog:https://biyuehu.github.io")
}

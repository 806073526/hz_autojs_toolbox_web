console.log("本代码仅适配了MIUI系统,其他系统可手动适配,另外请先手动开启开发者模式、USB调试模式、USB调试安全设置,执行之前,需要手动退出设置后台进程");
home();
sleep(100);
var intent = new Intent();
intent.setAction(android.provider.Settings.ACTION_APPLICATION_DEVELOPMENT_SETTINGS);
app.startActivity(intent);

// 等待开发者界面
textContains("开发者").findOne(2000);

let exit无线调试 = textContains("无线调试").findOnce();
if (!exit无线调试) {
    let wait = true;
    let count = 0;
    while (wait) {
        swipe(device.width / 2, device.height * 9 / 10, device.width / 2, device.height * 1 / 10, 500);
        count++;
        if (textContains("无线调试").findOnce() || descContains("无线调试").findOnce()) {
            wait = false;
        }
        if (count > 10) {
            wait = false;
        }
    }
    let 无线调试 = id("android:id/title").text("无线调试").findOne(2000);
    if (无线调试) {
        无线调试.clickCenter();
    }

    sleep(200);
    textContains("无线调试").waitFor();
    sleep(200)
    let switchObj = className("android.widget.Switch").checked(false).findOne(1000);
    if (switchObj) {
        click("无线调试");
    }
    sleep(2000);
}

let code = "";
let ip = "";
let port = "";
let 配对码 = textContains("配对码").findOne(1000);
if (配对码) {
    click("配对码配对设备");
    let 配对码2 = textEndsWith("配对码").className("android.widget.TextView").findOne(1000);
    if (配对码2) {
        sleep(500);
        let parentObj = 配对码2.parent();
        let childCount = parentObj.childCount();
        if (childCount <= 4) {

            let codeObj = parentObj.child(1);
            let ipObj = parentObj.child(3);

            if (codeObj) {
                code = codeObj.text();
            }
            if (ipObj) {
                let ipStr = ipObj.text();

                ip = ipStr.split(":")[0];
                port = ipStr.split(":")[1];
            }
        }
    }
}

let commonStorage = storages.create("zjh336.cncommon");
// 请求接口 使用adb进行配对
http.request(commonStorage.get("服务端IP") + ':' + (commonStorage.get("服务端Port") || 9998) + '/device/pairDevice?ip=' + ip + "&port=" + port + "&code=" + code, {
    headers: {
        "deviceUUID": commonStorage.get('deviceUUID')
    },
    method: 'GET',
    contentType: 'application/json',
    body: null,
}, (e) => {
    toastLog("配对成功");
    sleep(500);
    // 获取ip和端口
    let view = textMatches(/192\.168.*/)
        .className("android.widget.TextView")
        .findOne(2000);
    let url = view.text();
    let ip = url.split(":")[0];
    let port = url.split(":")[1];
    // 请求接口 进行adb连接
    http.request(commonStorage.get("服务端IP") + ':' + (commonStorage.get("服务端Port") || 9998) + '/device/connectDevice?ip=' + ip + "&port=" + port + "&openQtScrcpy=open", {
        headers: {
            "deviceUUID": commonStorage.get('deviceUUID')
        },
        method: 'GET',
        contentType: 'application/json',
        body: null,
    }, (e) => {
        toastLog("连接成功");
    });
});
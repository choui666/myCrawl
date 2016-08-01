/**
 * 新版SDK2.0页面，webviewBridge通信初始化;
 * version:1.0.20
 */
(function () {

    // 标志是否进行过初始化
    var initFlag = false;
    var webViewNativeInitPageFinishedEvent = "WebViewNativeInitPageFinished";
    var pageCallBackFunction = null; // 具体页面设置的callBack方法

    // 原始的初始化json对象
    var pageInitParasString = null;
    // HTTP 请求通用的Header
    var httpHeaders = {
        oUa: null, // 客户端信息(oUa)：平台ID|设备名称|设备系统版本|设备分辨率(宽*高)|设备UDID|手机卡IMSI|手机号|手机品牌
        version: null, // 版本信息(version)：SDK版本ID|游戏版本ID|游戏资源版本ID
        oService: null, // 业务ID(oService)：必填
        oChannel: null, // 渠道ID(oChannel)：必填
        device: null, // 设备信息(device)：mac|idfa|deviceUniqueId
        deviceIM: null, // 手机IMEI(deviceIM)：必填
        advertising_id: null, // 谷歌广告ID(advertising_id)：必填
        workNetType: null, // 网络类型(workNetType)：必填 0(未知网络，可能为网线) 1(WIFI) 2(移动网络)
        networkSubType: null, // 手机网络子类型(networkSubType)：必填
        deviceGroupId: null, // 机型组(deviceGroupId):必填
        localeId: null, // 地区(localeId):必填
        oUser: "0", // 用户ID(oUser)：掌趣用户中心生成的用户ID（未登陆之前传0,登陆后需要base64encode）
        sessionId: "0", // 用户sessionId(sessionId):掌趣用户中心生成的用户sessionId（未登陆之前传0）
        userName: "0", // 用户名(userName):掌趣用户中心生成的用户userName（未登陆之前传0,登陆后需要base64encode）
        palmId: "0", // 用户palmId(palmId)：掌趣用户中心生成的掌趣号（未登陆之前传0,登陆后需要base64encode）
        oRole: "0", // 角色ID(oRole)：游戏角色ID（未登陆游戏之前传0）
        oServer: "0", // 分区ID(oServer)：分区ID（未进登陆游戏之前传0）
        actionId: "0", // 动作ID(actionId)：动作ID，比如用户激活，注册，登陆等等联网操作。（暂时写死0）
        gameType: "0" // 游戏类型(gameType) :  网游0 ，单机为1
    };

    var sdkData = { // SDK相关初始化数据
        devicePlatformId: null, //  (0：安卓  1：IOS   2：wp8)
        oService: null,
        deviceGroupId: null,
        localeId: null,
        oChannel: null,
        opid: null,
        version: null,
        gameType: null,
        ucenterEntryUrl: null,
        ucenterCoreUrl: null,
        bcenterUrl: null,
        statisUrl: null,
        gscFrontUrl: null,
        sdkLogSwitch: null,
        protocolSwitch: null,
        advertising_id: null,
        actionId: null
    };

    var userData = { // 用户相关初始化数据
        sessionId: null,
        oUser: null,
        userName: null,
        nickName: null,
        palmId: null
    };

    var gameData = { // 游戏相关初始化数据
        gameName: null,
        oServer: null,
        oRole: null,
        oRoleName: null
    };

    var deviceData = { // 设备相关初始化数据
        oUa: null,
        device: null,
        mac: null,
        idfa: null,
        deviceUniqueId: null,
        deviceIM: null,
        workNetType: null,
        networkSubType: null
    };


    var pageInitParas = {
        sdkData: sdkData,
        userData: userData,
        gameData: gameData,
        deviceData: deviceData
    }

    /**
     * 页面初始化接口，由SDK负责调用，并传递sdk参数到页面
     */
    function pageInit(json, callback) {
        console.log("pageBrideInit.js-->pageInit" + json);
        pageInitParasString = json;
        try {
            pageInitParas = JSON.parse(json);
            initHttpHeaders(json);
            console.log("pageBrideInit.js-->pageInit success");
        } catch (exception) {
            console.log("pageBridgeInit.js-->pageInit exception: threw.", exception);
        }

        initFlag = true;
        var initPageFinishedEvent = document.createEvent('Events');
        initPageFinishedEvent.initEvent("webViewNativeInitPageFinishedEvent");
        document.dispatchEvent(initPageFinishedEvent); // 广播页面信息初始化完毕事件

        console.log("pageBrideInit.js-->pageInit-->dispatchEvent webViewNativeInitPageFinishedEvent");


        if (callback) {
            callback("pageBrideInit.js-->pageInit success!");
        }
    }

    /**
     * 响应SDK的back事件; 如果页面通过setPageBackCallBack注册了pageCallBackFunction函数，则由页面响应back事件；否则由SDK处理back事件
     */
    function pageBack(callback) {
        console.log("pageBrideInit.js-->pageBack");
        if (pageCallBackFunction) {
            callback("true");
            console.log("pageBrideInit.js-->pageBack-->return true");
        } else {
            callback("true");
            console.log("pageBrideInit.js-->pageBack-->return true");
        }
    }

    /**
     * 页面注册pageCallBackFunction函数，用来响应SDK的back事件；如果未注册，默认页面不响应SDK的back事件
     */
    function setPageBackCallBack(callback) {
        if (callback) {
            pageCallBackFunction = callback;
            console.log("pageBrideInit.js-->setPageBackCallBack");
        }
    }

    /**
     * 同步调用初始化信息模块方法
     */
    function applyCall(callback) {
        if (initFlag) {
            console.log("pageBrideInit.js-->applyCall-->direct call");
            callback();
        } else {
            console.log("pageBrideInit.js-->applyCall-->add webViewNativeInitPageFinishedEvent event");
            document.addEventListener("webViewNativeInitPageFinishedEvent", function () {
                console.log("pageBrideInit.js-->applyCall-->call webViewNativeInitPageFinishedEvent");
                callback();
            }, false);
        }
    }

    /**
     * 初始化Header信息
     */
    function initHttpHeaders(json) {
        console.log("pageBrideInit.js-->initHttpHeaders");
        var data = JSON.parse(json);
        if (data && data.sdkData) {
            with (data.sdkData) {
                httpHeaders.version = (typeof(version) == "undefined" || !version) ? "" : version;
                httpHeaders.oService = (typeof(oService) == "undefined" || !oService) ? "" : oService;
                httpHeaders.oChannel = (typeof(oChannel) == "undefined" || !oChannel) ? "" : oChannel;
                httpHeaders.advertising_id = (typeof(advertising_id) == "undefined" || !advertising_id) ? "" : advertising_id;
                httpHeaders.deviceGroupId = (typeof(deviceGroupId) == "undefined" || !deviceGroupId) ? "" : deviceGroupId;
                httpHeaders.localeId = (typeof(localeId) == "undefined" || !localeId) ? "" : localeId;
                httpHeaders.actionId = (typeof(actionId) == "undefined" || !actionId) ? "0" : actionId;
                httpHeaders.gameType = (typeof(gameType) == "undefined" || !gameType) ? "0" : gameType;
            }
            with (data.deviceData) {
                httpHeaders.oUa = (typeof(oUa) == "undefined" || !oUa) ? "" : oUa;
                httpHeaders.workNetType = (typeof(workNetType) == "undefined" || !workNetType) ? "" : workNetType;
                httpHeaders.networkSubType = (typeof(networkSubType) == "undefined" || !networkSubType) ? "" : networkSubType;
            }
            with (data.userData) {
                httpHeaders.oUser = (typeof(oUser) == "undefined" || !oUser) ? "0" : oUser;
                httpHeaders.sessionId = (typeof(sessionId) == "undefined" || !sessionId) ? "0" : sessionId;
                httpHeaders.userName = (typeof(userName) == "undefined" || !userName) ? "0" : userName;
                httpHeaders.palmId = (typeof(palmId) == "undefined" || !palmId) ? "0" : palmId;
            }
            with (data.gameData) {
                httpHeaders.oRole = (typeof(oRole) == "undefined" || !oRole) ? "0" : oRole;
                httpHeaders.oServer = (typeof(oServer) == "undefined" || !oServer) ? "0" : oServer;
            }
        }
        console.log("pageBrideInit.js-->initHttpHeaders success");
    }

    /**
     * 获取页面初始化的原始参数
     */
    function getPageInitParasString() {
        console.log("pageBrideInit.js-->getPageInitParasString");
        if (pageInitParasString) {
            console.log("pageBrideInit.js-->getPageInitParasString:" + pageInitParasString);
            return pageInitParasString;
        } else {
            console.log("pageBrideInit.js-->getPageInitParasString:");
            return "";
        }
    }

    /**
     * 获取页面参数
     */
    function getPageInitParas() {
        console.log("pageBrideInit.js-->getPageInitParas");
        if (pageInitParas) {
            var r_s = JSON.stringify(pageInitParas);
            console.log("pageBrideInit.js-->getPageInitParas:" + r_s);
            return r_s;
        } else {
            console.log("pageBrideInit.js-->getPageInitParas:");
            return "";
        }
    }

    /**
     * 获取用户中心的用户信息；其中包含如下信息
     * sessionId：用户中心的sessionId
     * userId：用户中心的userId;已经base64编码
     * userName：用户中心的用户名;已经base64编码
     * nickName:用户中心的昵称;
     * palmId:用户的掌趣号;
     */
    function getUcenterUserInfo() {
        if (pageInitParas && pageInitParas.userData) {
            with (pageInitParas.userData) {
                var returnString = {
                    sessionId: (typeof(sessionId) == "undefined" || !sessionId) ? "" : sessionId,
                    userId: (typeof(oUser) == "undefined" || !oUser) ? "" : oUser,
                    userName: (typeof(userName) == "undefined" || !userName) ? "" : userName,
                    nickName: (typeof(nickName) == "undefined" || !nickName) ? "" : nickName,
                    palmId: (typeof(palmId) == "undefined" || !palmId) ? "" : palmId
                }
                var r_s = JSON.stringify(returnString);
                console.log("pageBrideInit.js-->getUcenterUserInfo:" + r_s);
                return r_s;
            }
        }
        console.log("pageBrideInit.js-->getUcenterUserInfo:");
        return "";
    }

    /**
     *    serverId:游戏服Id
     *    roleId:角色Id
     *    roleName:角色名称,
     *    version:游戏版本,
     *    resourceVersion:游戏资源版本
     */
    function getGameInfo() {
        var returnData = {
            gameName: null,
            serverId: null,
            roleId: null,
            roleName: null,
            version: null,
            resourceVersion: null
        };

        if (pageInitParas && pageInitParas.gameData) {
            returnData.serverId = (typeof(pageInitParas.gameData.oServer) == "undefined" || !pageInitParas.gameData.oServer) ? "" : pageInitParas.gameData.oServer;
            returnData.roleId = (typeof(pageInitParas.gameData.oRole) == "undefined" || !pageInitParas.gameData.oRole) ? "" : pageInitParas.gameData.oRole;
            returnData.roleName = (typeof(pageInitParas.gameData.oRoleName) == "undefined" || !pageInitParas.gameData.oRoleName) ? "" : pageInitParas.gameData.oRoleName;
            returnData.gameName = (typeof(pageInitParas.gameData.gameName) == "undefined" || !pageInitParas.gameData.gameName) ? "" : pageInitParas.gameData.gameName;
        }
        if (pageInitParas && pageInitParas.sdkData.version) {
            var _version = pageInitParas.sdkData.version;
            var _version_array = _version.split('|');
            if (_version_array.length >= 3) {
                returnData.version = _version_array[1];
                returnData.resourceVersion = _version_array[2];
            }
        }
        var r_s = JSON.stringify(returnData);
        console.log("pageBrideInit.js-->getGameInfo:" + r_s);
        return r_s;
    }

    /**
     * 设备信息；其中信息包含如下
     * device:设备信息串；mac|idfa|deviceUniqueId
     * mac:mac信息;
     * idfa:idfa信息;
     * deviceUniqueId;
     * deviceIM:6)    手机IMEI;
     * workNetType:网络类型(workNetType)：必填 0(未知网络，可能为网线) 1(WIFI) 2(移动网络);
     * networkSubType:手机网络子类型
     */
    function getDeviceInfo() {
        if (pageInitParas && pageInitParas.deviceData) {
            with (pageInitParas.deviceData) {
                var returnData =
                {
                    oUa: (typeof(oUa) == "undefined" || !oUa) ? "" : oUa,
                    device: (typeof(device) == "undefined" || !device) ? "" : device,
                    mac: (typeof(mac) == "undefined" || !mac) ? "" : mac,
                    idfa: (typeof(idfa) == "undefined" || !idfa) ? "" : idfa,
                    deviceUniqueId: (typeof(deviceUniqueId) == "undefined" || !deviceUniqueId) ? "" : deviceUniqueId,
                    deviceIM: (typeof(deviceIM) == "undefined" || !deviceIM) ? "" : deviceIM,
                    workNetType: (typeof(workNetType) == "undefined" || !workNetType) ? "" : workNetType,
                    networkSubType: (typeof(networkSubType) == "undefined" || !networkSubType) ? "" : networkSubType
                }
                var r_s = JSON.stringify(returnData);
                console.log("pageBrideInit.js-->getDeviceInfo:" + r_s);
                return r_s;
            }
        }
        console.log("pageBrideInit.js-->getDeviceInfo:");
        return "";
    }


    /**
     * pcode41:41位的平台特征串,
     * productId:8位产品Id,
     * operationLineId:11位联运方Id,
     * serviceId:19位联运产品Id,
     * channelId:16位推广渠道Id,
     * mainChannel:8位推广主渠道Id,
     * subChannel:8位推广子渠道Id,
     * deviceGroupId:4位机型组Id,
     * localeId:2位语言Id
     */
    function getPcodeInfo() {
        var returnData = {
            pcode41: null,
            productId: null,
            operationLineId: null,
            serviceId: null,
            channelId: null,
            mainChannel: null,
            subChannel: null,
            deviceGroupId: null,
            localeId: null
        };

        if (pageInitParas && pageInitParas.sdkData) {
            with (pageInitParas.sdkData) {
                if (oService && oChannel && deviceGroupId && localeId) {
                    returnData.pcode41 = oService + oChannel + deviceGroupId + localeId;
                    if (returnData.pcode41.length != 41) {
                        return returnData;
                    }
                    returnData.productId = oService.substr(0, 8);
                    returnData.operationLineId = oService.substr(8);
                    returnData.serviceId = oService;
                    returnData.channelId = oChannel;
                    returnData.mainChannel = oChannel.substr(0, 8);
                    returnData.subChannel = oChannel.substr(8);
                    returnData.deviceGroupId = deviceGroupId;
                    returnData.localeId = localeId;
                }
            }
        }
        var r_s = JSON.stringify(returnData);
        console.log("pageBrideInit.js-->getPcodeInfo:" + r_s);
        return r_s;
    }

    /**
     * 获取各种服务的请求地址
     *    ucenterEntryUrl:用户中心入口URL,
     *    ucenterCoreUrl:用户中心核心URL,
     *    bcenterUrl:计费中心URL,
     *    statisUrl:统计URL,
     *    gscFrontUrl:GSC前端地址
     */
    function getServiceUrl() {
        var returnData = {
            ucenterEntryUrl: null,
            ucenterCoreUrl: null,
            bcenterUrl: null,
            statisUrl: null,
            gscFrontUrl: null
        };
        if (pageInitParas && pageInitParas.sdkData) {
            with (pageInitParas.sdkData) {
                returnData.ucenterEntryUrl = (typeof(ucenterEntryUrl) == "undefined" || !ucenterEntryUrl) ? "" : ucenterEntryUrl;
                returnData.ucenterCoreUrl = (typeof(ucenterCoreUrl) == "undefined" || !ucenterCoreUrl) ? "" : ucenterCoreUrl;
                returnData.bcenterUrl = (typeof(bcenterUrl) == "undefined" || !bcenterUrl) ? "" : bcenterUrl;
                returnData.statisUrl = (typeof(statisUrl) == "undefined" || !statisUrl) ? "" : statisUrl;
                returnData.gscFrontUrl = (typeof(gscFrontUrl) == "undefined" || !gscFrontUrl) ? "" : gscFrontUrl;
            }
        }
        var r_s = JSON.stringify(returnData);
        console.log("pageBrideInit.js-->getServiceUrl:" + r_s);
        return r_s;
    }

    /**
     * 获取产品包的配置数据
     *    sdkLogSwitch:统计日志开关
     *    protocolSwitch:注册协议开关
     *    gameType:SDK产品类型;网游0 ，单机为1
     *    devicePlatformId:获取SDK平台类型 (0：安卓  1：IOS   2：wm)
     */
    function getConfigs() {
        var returnData = {
            sdkLogSwitch: null,
            protocolSwitch: null,
            gameType: null,
            devicePlatformId: null
        };
        if (pageInitParas && pageInitParas.sdkData) {
            with (pageInitParas.sdkData) {
                returnData.sdkLogSwitch = (typeof(sdkLogSwitch) == "undefined" || !sdkLogSwitch) ? "" : sdkLogSwitch;
                returnData.protocolSwitch = (typeof(protocolSwitch) == "undefined" || !protocolSwitch) ? "" : protocolSwitch;
                returnData.gameType = (typeof(gameType) == "undefined" || !gameType) ? "" : gameType;
                returnData.devicePlatformId = (typeof(devicePlatformId) == "undefined" || !devicePlatformId) ? "" : devicePlatformId;
            }
        }
        var r_s = JSON.stringify(returnData);
        console.log("pageBrideInit.js-->getConfigs:" + r_s);
        return r_s;
    }

    /**
     * 获取原来SDK请求接口时的Header信息；
     */
    function getSdkHeaders() {
        if (httpHeaders) {
            var r_s = JSON.stringify(httpHeaders);
            console.log("pageBrideInit.js-->getSdkHeaders:" + r_s);
            return r_s;
        } else {
            console.log("pageBrideInit.js-->getSdkHeaders:");
            return "";
        }
    }


    // --------------------------- SDK需要实现的接口----------------------------//


    function baseNativeCall(method, data, callback) {
        try {
            console.log("pageBrideInit.js-->native[" + method + "], data[" + JSON.stringify(data) + "]");
            window.WebViewJavascriptBridge.callHandler(method, data, function (responseData) {
                    console.log("pageBrideInit.js-->native[" + method + "], return data[" + JSON.stringify(responseData) + "]");
                    if (callback) {
                        callback(responseData);
                    }
                }
            );
        } catch (exception) {
            if (typeof console != 'undefined') {
                console.log("WebViewJavascriptBridge: WARNING: javascript handler threw.", exception);
            }
        }
    }

    /**
     * sdk加密接口
     * data:请求json数据串
     * callback:加密后的回调函数
     * return 加密结果数据
     */
    function invokeSdkEncryptData(data, callback) {
        baseNativeCall('invokeSdkEncryptData', data, callback);
    }


    /**
     * sdk解密接口
     * data:密文字符串
     * callback:解密后的回调函数
     * return 解密后的json格式的消息体
     */
    function invokeSdkDecodeData(data, callback) {
        baseNativeCall('invokeSdkDecodeData', data, callback);
    }

    /**
     * sdk关闭webview接口;
     * data:关闭当前webview后toast提示信息； 为空时表示不需要提示信息；
     */
    function invokeSdkCloseWebiew(data) {
        baseNativeCall('invokeSdkCloseWebiew', data, null);
    }

    /**
     * 本地toast提示信息接口
     * data:toast提示的信息；
     */
    function invokeSdkNativeToast(data) {
        baseNativeCall('invokeSdkNativeToast', data, null);
    }

    /**
     * sdk复制数据至剪贴板；
     * data:需要复制的内容
     * callback:复制完成后回调函数，回调结果为true|false
     * return true|false
     */
    function invokeSdkClipboardCopy(data) {
        baseNativeCall('invokeSdkClipboardCopy', data, null);
    }

    /**
     * sdk打开外部浏览器；
     * data:加载的Url
     * callback:打开完成后回调函数，回调结果为true|false
     * return true|false
     */
    function invokeSdkOpenBrowser(data, callback) {
        baseNativeCall('invokeSdkOpenBrowser', data, callback);
    }

    /**
     * 退出当前App；
     * data:加载的Url
     * callback:null；不需要回调
     */
    function invokeSdkQuitApp() {
        baseNativeCall('invokeSdkQuitApp', null, null);
    }

    /**
     * 登录成功后回调SKD，记录用户登录记录；
     * data:json结构，其中包括userName和password
     */
    function invokeSdkLoginSuccess(data) {
        baseNativeCall('invokeSdkLoginSuccess', data, null);
    }

    /**
     * 该接口主要提提供用户成功登录过的用户列表
     * callback:json结构；user数组，
     */
    function invokeSdkGetLoginedUsers(callback) {
        baseNativeCall('invokeSdkGetLoginedUsers', null, callback);
    }


    /**
     * 该接口主要在登录注册流程完成后通知SDK已经登录成功的用户
     * data:json结构；登录成功的用户信息，
     */
    function invokeSdkLoginFinished(data) {
        baseNativeCall('invokeSdkLoginFinished', data, null);
    }

    /**
     * 该接口主要提提供给页面用来获取版本更新信息；
     * callback:json结构；
     */
    function invokeSdkGameUpdateInfo(callback) {
        baseNativeCall('invokeSdkGameUpdateInfo', null, callback);
    }


    /**
     * 该接口主要提供给页面，进行删除用户登录记录；
     * data:json结构，其中包括userId
     * callback:true|false
     */
    function invokeSdkDelUser(data, callback) {
        baseNativeCall('invokeSdkDelUser', data, callback);
    }


    /**
     * 该接口主要提供给页面，获取当前登录的用户信息；
     * data:json结构，
     * callback:true|false
     */
    function invokeSdkGetCurrentUser(callback) {
        baseNativeCall('invokeSdkGetCurrentUser', null, callback);
    }

    /**
     * 该接口主要提供给页在版本更新页面，针对非强制更新情况设置“不再提示本版本”；
     * data:json结构，其中包括version和prompt
     */
    function invokeSdkSetUpdatePrompt(data) {
        baseNativeCall('invokeSdkSetUpdatePrompt', data, null);
    }


    /**
     * 该接口主要提提供给页面获取快登的用户信息（deviceId），进而进行快登操作
     * callback:json结构；包含deviceId
     */
    function invokeSdkGetFastLoginDeviceId(callback) {
        baseNativeCall('invokeSdkGetFastLoginDeviceId', null, callback);
    }


    /**
     * 用户中心升级账户成功回调；
     * data:；json数据；
     * callback:true|false
     */
    function invokeSdkUserUpgradeNotify(data, callback) {
        baseNativeCall('invokeSdkUserUpgradeNotify', data, callback);
    }


    /**
     * 用户中心绑定手机邮箱成功回调；
     * data:；json数据；
     * callback:true|false
     */
    function invokeSdkUserBindNotify(data, callback) {
        baseNativeCall('invokeSdkUserBindNotify', data, callback);
    }


    /**
     * 用户中心修改密码成功回调；
     * data:；json数据；
     * callback:true|false
     */
    function invokeSdkUserModifyPasswordNotify(data, callback) {
        baseNativeCall('invokeSdkUserModifyPasswordNotify', data, callback);
    }


    /**
     * 用户中心修改昵称成功回调；
     * data:；json数据；
     * callback:true|false
     */
    function invokeSdkUserModifyNickNameNotify(data, callback) {
        baseNativeCall('invokeSdkUserModifyNickNameNotify', data, callback);
    }


    /**
     * 该接口主要针对官网支付，调起本地第三方支付SDK的情况，如：支付宝安全支付；
     * data:；原跳转Url携带的锚点数据； 后续再补充含义
     */
    function invokeSdkOpenNativePay(data) {
        baseNativeCall('invokeSdkOpenNativePay', data, null);
    }

    /**
     * 获取当前下单的订单信息；该接口主要提提供给官网支付页面在进一步支付过程中展示订单信息
     * callback:json结构；下单的订单信息
     */
    function invokeSdkGetOrderInfo(callback) {
        baseNativeCall('invokeSdkGetOrderInfo', null, callback);
    }

    /**
     * 支付结果通知接口；该接口主要用在官网页面支付，支付完成后把结果通知给SDK；
     * data:；JSON结构，包括orderId和payResult
     */
    function invokeSdkPayResult(data) {
        baseNativeCall('invokeSdkPayResult', data, null);
    }

    /**
     * 调起微信支付；
     * data:；微信支付的mweb_url
     */
    function invokeSdkOpenWeChatH5Pay(data) {
        baseNativeCall('invokeSdkOpenWeChatH5Pay', data, null);
    }

    /**
     * SDK上传图片；
     * data:；JSON结构
     * callback:json结构
     */
    function invokeSdkUploadImg(data, callback) {
        baseNativeCall('invokeSdkUploadImg', data, callback);
    }

    /**
     * 页面主动获取登录前的提示信息；
     * callback:json结构
     */
    function invokeSdkGetPromptInfo(callback) {
        baseNativeCall('invokeSdkGetPromptInfo', null, callback);
    }

    /**
     * 页面触发更新事件；
     * data:json结构
     * callback:true|false
     */
    function invokeSdkDownloadGame(data, callback) {
        baseNativeCall('invokeSdkDownloadGame', data, callback);
    }

    /**
     * 页面完成激活码激活后通知SDK；
     * data:json结构
     */
    function invokeSdkActivateNotify(data) {
        baseNativeCall('invokeSdkActivateNotify', data, null);
    }


    /**
     * 获取激活码激活成功token；
     * callback:json结构
     */
    function invokeSdkGetActivateInfo(callback) {
        baseNativeCall('invokeSdkGetActivateInfo', null, callback);
    }

    /**
     * 页面在点击输入框的“完成”时自动关闭输入键盘
     * callback:true|false
     */
    function invokeSdkCloseKeyboard(callback) {
        baseNativeCall('invokeSdkCloseKeyboard', null, callback);
    }

    /**
     * 页面在点击输入框的“完成”时自动关闭输入键盘
     * callback:true|false
     */
    function invokeSdkUserLogin(data, callback) {
        baseNativeCall('invokeSdkUserLogin', data, callback);
    }

    /**
     * 页面完成解绑定手机或邮箱操作后回调SDK通知
     * callback:true|false
     */
    function invokeSdkUserUnBindNotify(data, callback) {
        baseNativeCall('invokeSdkUserUnBindNotify', data, callback);
    }


    // --------------------------- SDK需要实现的接口----------------------------//


    window.pageBridge = {
        pageInit: pageInit, // SDK --> Page
        pageBack: pageBack, // SDK --> Page
        applyCall: applyCall, // Page --> Page
        setPageBackCallBack: setPageBackCallBack, // Page --> Page

        getPageInitParasString: getPageInitParasString, // Page --> Page
        getPageInitParas: getPageInitParas, // Page --> Page
        getUcenterUserInfo: getUcenterUserInfo, // Page --> Page
        getGameInfo: getGameInfo, // Page --> Page
        getDeviceInfo: getDeviceInfo, // Page --> Page
        getPcodeInfo: getPcodeInfo, // Page --> Page
        getServiceUrl: getServiceUrl, // Page --> Page
        getConfigs: getConfigs, // Page --> Page
        getSdkHeaders: getSdkHeaders, // Page --> Page

        invokeSdkEncryptData: invokeSdkEncryptData, // Page --> SDK
        invokeSdkDecodeData: invokeSdkDecodeData, // Page --> SDK
        invokeSdkCloseWebiew: invokeSdkCloseWebiew, // Page --> SDK
        invokeSdkNativeToast: invokeSdkNativeToast, // Page --> SDK
        invokeSdkClipboardCopy: invokeSdkClipboardCopy, // Page --> SDK
        invokeSdkOpenBrowser: invokeSdkOpenBrowser, // Page --> SDK
        invokeSdkQuitApp: invokeSdkQuitApp, // Page --> SDK
        invokeSdkLoginSuccess: invokeSdkLoginSuccess, // Page --> SDK
        invokeSdkGetLoginedUsers: invokeSdkGetLoginedUsers, // Page --> SDK
        invokeSdkGameUpdateInfo: invokeSdkGameUpdateInfo, // Page --> SDK
        invokeSdkSetUpdatePrompt: invokeSdkSetUpdatePrompt, // Page --> SDK
        invokeSdkGetFastLoginDeviceId: invokeSdkGetFastLoginDeviceId, // Page --> SDK
        invokeSdkOpenNativePay: invokeSdkOpenNativePay,  // Page --> SDK
        invokeSdkGetOrderInfo: invokeSdkGetOrderInfo,  // Page --> SDK
        invokeSdkPayResult: invokeSdkPayResult,  // Page --> SDK
        invokeSdkDelUser: invokeSdkDelUser, // Page --> SDK
        invokeSdkLoginFinished: invokeSdkLoginFinished, // Page --> SDK
        invokeSdkUserUpgradeNotify: invokeSdkUserUpgradeNotify, // Page --> SDK
        invokeSdkUserBindNotify: invokeSdkUserBindNotify, // Page --> SDK
        invokeSdkUserModifyPasswordNotify: invokeSdkUserModifyPasswordNotify, // Page --> SDK
        invokeSdkUserModifyNickNameNotify: invokeSdkUserModifyNickNameNotify, // Page --> SDK
        invokeSdkGetCurrentUser: invokeSdkGetCurrentUser, // Page --> SDK
        invokeSdkOpenWeChatH5Pay: invokeSdkOpenWeChatH5Pay, // Page --> SDK
        invokeSdkUploadImg: invokeSdkUploadImg, // Page --> SDK
        invokeSdkGetPromptInfo: invokeSdkGetPromptInfo,  // Page --> SDK
        invokeSdkDownloadGame: invokeSdkDownloadGame, // Page --> SDK
        invokeSdkActivateNotify: invokeSdkActivateNotify, // Page --> SDK
        invokeSdkGetActivateInfo: invokeSdkGetActivateInfo, // Page --> SDK
        invokeSdkCloseKeyboard: invokeSdkCloseKeyboard, // Page --> SDK
        invokeSdkUserLogin: invokeSdkUserLogin,
        invokeSdkUserUnBindNotify: invokeSdkUserUnBindNotify
    };

    function connectWebViewJavascriptBridge(callback) {
        if (window.WebViewJavascriptBridge) {
            console.log("pageBrideInit.js-->connectWebViewJavascriptBridge direct");
            callback(WebViewJavascriptBridge)
        } else {
            console.log("pageBrideInit.js-->connectWebViewJavascriptBridge addEventListener");
            document.addEventListener(
                'WebViewJavascriptBridgeReady'
                , function () {
                    console.log("pageBrideInit.js-->connectWebViewJavascriptBridge calledEventListener begin");
                    callback(WebViewJavascriptBridge)
                    console.log("pageBrideInit.js-->connectWebViewJavascriptBridge calledEventListener end");
                },
                false
            );
        }
    };

    connectWebViewJavascriptBridge(function (bridge) {
            bridge.init(function (message, responseCallback) { // 该方法必须
                console.log("pageBrideInit.js-->connectWebViewJavascriptBridge-->init " + message);
                var data = {'Javascript Responds': '测试中文!'};
                console.log('JS responding with', data);
                responseCallback(data);
            });
            window.WebViewJavascriptBridge.registerHandler("pageInit", window.pageBridge.pageInit);
            window.WebViewJavascriptBridge.registerHandler("pageBack", window.pageBridge.pageBack);
        }
    );

    console.log("ddddddddddddddd");
    var WVJBIframe = document.createElement('iframe');
    WVJBIframe.style.display = 'none';
    WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
    document.documentElement.appendChild(WVJBIframe);
    setTimeout(function () {
        document.documentElement.removeChild(WVJBIframe)
    }, 0);

    console.log("pageBrideInit.js init success");

})();

function simulateSdkInit() {
    var json = document.getElementById('sdkInitSimulateId').value;
    window.pageBridge.pageInit(json, function () {
        alert("初始化成功");
    });
}

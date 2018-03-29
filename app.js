//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: {'userid':''},
    formDataUrl: "/QA4jp4.htm",
    responseUrl: "/QA4jp6.htm",
    loginUrl:"/login4j.htm",
    actionUrl: "/QA4jp5.htm",
    viewUrl:"/QA4j.htm",
    myviewUrl:"/QA5j.htm",
    registerUrl:"/QB01.htm",
    password_sendCode:"/QB.htm?action=send",
    password_getCode: "/QB.htm?action=get",
    password_reset: "/QB.htm?action=reset",
    //host:"http://192.169.253.25:8003/sggm",
     // host:"http://61.177.60.92:8003/sggm",
    host:"https://www.e9656.com/weixin",
    header: { 'Cookie': '' }
  },
  showToast: function (title, icon, duration){
    let _duration = duration == undefined ? 1500 : duration;
    let _icon = icon;
    wx.showToast({
      title: title,
      icon: _icon,
      duration: _duration
    });
  }
  ,
  upload_file: function (url, filePath, name, formData, success, fail) {
    console.log('a=' + filePath)
    let that=this;
    wx.showLoading({
      title: '处理中，请稍后',
      mask: true
    });
    wx.uploadFile({
      url: this.globalData.host + url,
      filePath: filePath,
      name: name,
      header: {
        'content-type': 'multipart/form-data',
        'Cookie': this.globalData.header.Cookie
      }, // 设置请求的 header
      formData: formData, // HTTP 请求中其他额外的 form data
      success: function (res) {
        wx.hideLoading();
        console.log(res);
        if (res.statusCode == 200 && !res.data.result_code) {
          if( typeof success == "function"){
            success(res);
          }else
          that.showToast("提交成功", "success");
        } else {
         if(typeof fail == "function")
          fail(res);
          else
          that.showToast("提交失败_S", "none");
        }
      },
      fail: function (res) {
        wx.hideLoading();
        if (typeof fail == "function")
         fail(res);
         else
          that.showToast("提交失败_F", "none");
      }
    })
  },
  requestApi: function (url, formData,success,fail,that_){
    let that=that_;
    wx.showLoading({
      title: '处理中，请稍后',
      mask:true
    });
    wx.request({
      url: url,
      method: "POST",
      dataType: "json",
      header: { 'content-type': 'application/x-www-form-urlencoded' ,
        'Cookie': this.globalData.header.Cookie
      },
      data: formData,
      success: function (res) {
        wx.hideLoading();
        var msg = res.data.msg;
        if (res.statusCode == 200 && !res.data.result_code) {
          if (res.data.status==-3){
            that.setData({
              searchLoadingComplete: true,
              searchLoading: false
            });
            wx.showModal({
              title: "提示",
              content: msg,
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  wx.redirectTo({
                    url: '../index/index',
                    success: function (e) {
                      console.log("redirectTo login");
                    }
                  });
                }
              }
            });

          }else{
            if (typeof success == "function")
              success(res);
            else
              that.showToast("提交成功", "success");
          }  
        } else {
          if(typeof fail == "function")
           fail(res);
           else
            that.showToast("提交失败", "none");
        }
      },
      fail: function (res) {
        wx.hideLoading();
        if (typeof fail == "function" )
        fail(res);
        else 
        that.showToast("提交失败", "none");
      }
    });
  }
})
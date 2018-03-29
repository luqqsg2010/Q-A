//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    disabled:true,
    opacity:0.4,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  userNameInput: function (e) {
    let username = e.detail.value;
    let opcity= username==""?0.4:1;
    let disabled = username == "" ? true : false;
    this.setData({
      userName: username,
      opacity:opcity,
      disabled: disabled
    })

  },
  passWdInput: function (e) {
    this.setData({
      userPassword: e.detail.value
    })
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    app.globalData.header.Cookie="";
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
   login: function (e) {
     let that=this;
     let userName = that.data.userName.trim();  
     let userPassword = that.data.userPassword;
     this.setData({
       disabled:true,
       loginLoading:true
       });
     wx.showLoading({
       title: '正在登录',
     })
     wx.request({
       url: app.globalData.host +app.globalData.loginUrl,
       method:"POST",
       dataType:"json",
       header: {'content-type':'application/x-www-form-urlencoded'},
       data:{
         username: userName,
         password: userPassword
       },
       success:function(e){
         let status=e.data.status;
         let msg =e.data.msg;
         let sessionId = e.data.sessionId;
         wx.hideLoading();
         if(status==0){
           app.globalData.userInfo.userid = userName;
          app.globalData.header.Cookie='JSESSIONID='+sessionId;
          console.log(msg);
          wx.switchTab({
            url: '../view/view',
            success:function(e){
              console.log("redirectTo view");
              console.log(app.globalData.userInfo.userid);
            }
          }); 
         }else
         {
           wx.showModal({
             title:"提示",
             content: msg,
             showCancel:false,
             success:function(res){
               if(res.confirm){
                 that.setData({
                   disabled: false,
                   loginLoading: false
                 });
               }
             }
           })
           console.log(msg);
         } 
       }
     })   
       }
      }
     );


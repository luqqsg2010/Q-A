// pages/form/form.js
const app = getApp();
var data_ = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    xt_list: data_.xz_list()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   this.setData({
     imgpath:"../view/images/upload.png",
     multipart:false
   })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
    bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },
    bindChooiceImage: function () {
      let _this = this;
      wx.showActionSheet({
        itemList: ['从相册中选择', '拍照'],
        itemColor: "#f7982a",
        success: function (res) {
          if (!res.cancel) {
            if (res.tapIndex == 0) {
              _this.chooseWxImage('album')
            } else if (res.tapIndex == 1) { 
              _this.chooseWxImage('camera')
            }
          }
        }
      });
    },
    chooseWxImage: function (type) {
      let _this = this;
      wx.chooseImage({
        sizeType: [ 'compressed'],
        sourceType: [type],
        success: function (res) {
          console.log(res.tempFilePaths[0]);        
          _this.setData({
            imgpath: res.tempFilePaths[0],
            multipart:true
          });
         // _this.drawImage(res); 压缩功能在开发工具中没法测，BUG？
        }
      })
    },
    drawImage:function(res){
      let _this = this;
      const ctx = wx.createCanvasContext('myCanvas');
      ctx.drawImage(res.tempFilePaths[0], 0, 0, 94, 96);
      app.showToast('图片处理中...','loading',1000);
      ctx.draw(false, wx.canvasToTempFilePath({
        canvasId: 'myCanvas',
        fileType: 'jpg',
        success: function success(res) {
          _this.setData({
            canvasImgUrl: res.tempFilePath
          });
          wx.hideToast();
        },
        fail: function fail(res) {
        },
        complete: function complete(e) {
        }
      }));
     // _this.canvasToTempFilePath();  
    },
    formSubmit:function(e) {
      let _this =this;
      var formData = {
        department: e.detail.value.department,
        contact: e.detail.value.contact,
        phone: e.detail.value.phone,
        xt: e.detail.value.xt,
        desc: e.detail.value.desc,
        userid: app.globalData.userInfo["userid"] 
      }
      console.log(formData)
      if (this.data.multipart){
        app.upload_file(app.globalData.formDataUrl, this.data.imgpath, 'file', formData,
          function (res) {
            console.log(res);
            _this.formReset(e);
          },
          function () {
          }, _this)
      }else{
        app.requestApi(app.globalData.host + app.globalData.formDataUrl, formData,
          function (e) {
            let status = e.data.status;
            let msg = e.data.msg;
            if (status == 0) {
              console.log(e);
              _this.formReset(e);
            }
          },
          function(e){

          }, _this
        );
      }
    },
    formReset:function(e){
      this.setData({
        department: "",
        contact: "",
        phone:"",
        xt:"",
        desc: "",
         imgpath: "../view/images/upload.png",
         multipart: false
      });
    }
})
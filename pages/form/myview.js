const app = getApp();
Page({
  data:{
    hidden: true
  },
  onLoad: function (option) {
    this.setData({
      title:option.title,
      keyword:option.id,
      filepath:option.filepath,
      cuser:option.cuser,
      imgpath: "../view/images/upload.png",
      stars: [0, 1, 2, 3, 4],
      normalSrc: '../view/images/no-star.png',
      selectedSrc: '../view/images/full-star.png',
      halfSrc: '../view/images/half-star.png',
      key: "",//评分
      loadpath: app.globalData.host + "/upload/",
      action:"a",
      bg_img : ""
    });
    let data =this.data;
    console.log(data);
    this.getData(data);
  }
,
  getData: function (data){
let that=this;
  app.requestApi(app.globalData.host + app.globalData.myviewUrl, data,
    function (e) {
      let status = e.data.status;
      let msg = e.data.msg;
      if(status>-1) {
        if (e.data.list[0]){
        if (e.data.list[0].code=="3")
        {
          let bg_img = "";
          let score=e.data.list[0].score;
          if (score < 2) {
            bg_img = "无语"
          } else if (score > 1.5 && score < 3) {
           // bg_img = "差"
            bg_img = "background-img:url('../view/images/hh_s.png');";
          } else if (score > 2.5 && score < 4) {
            bg_img = "background-img:url('../view/images/2.0.png');";
          } else if (score > 3.5 && score < 5) {
            bg_img = "好"
          } else if (score == 5) {
            bg_img = "非常好"
          }
          that.setData({
            d1:true,
            d2:true,
            bg_img: 's5'
          }
          )
        }}
        wx.showLoading({
          title: '加载完成',
          mask: true
        });
        that.setData({
          results: e.data.list
        })
      }else{
          wx.showLoading({
            title: '错误：' + msg,
            mask: true
          });
      }
      setTimeout(function () {
        wx.hideLoading()
      }, 500)
    },
    function (e) {
    },that
  ) 
},
  /**
    * 生命周期函数--监听页面初次渲染完成
    */
    
  onReady: function () {

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
      sizeType: ['compressed'],
      sourceType: [type],
      success: function (res) {
        _this.setData({
          imgpath: res.tempFilePaths[0],
          multipart: true
        });
        // _this.drawImage(res); 压缩功能在开发工具中没法测，BUG？
      }
    })
  },
  formSubmit: function (e) {
    let _this = this;
    var formData = {
      id: this.data.keyword,
      content: e.detail.value.content,
      userid: app.globalData.userInfo["userid"] ,
      cuser: this.data.cuser,
      action:"a",
      isadmin:"1"
    }
    console.log(formData)
    if (this.data.multipart) {
      app.upload_file(app.globalData.responseUrl, this.data.imgpath, 'file', formData,
        function (e) {
          let status = JSON.parse(e.data).status;
          let msg = JSON.parse(e.data).msg;
          if (status == 0) {
            msg = "提交成功";
            _this.formReset(e);
          } else if (status == -2){
            _this.setData({
              d1: true,
              d2: true
            })
          }
          app.showToast(msg, "none");
        },
        function (res) {
          app.showToast(res.data.msg,"none");
        })
    } else {
      app.requestApi(app.globalData.host + app.globalData.responseUrl, formData,
        function (e) {
          let status = e.data.status;
          let msg = e.data.msg;
          if (status == 0) {
            msg="提交成功";
            _this.formReset(e);
          }
          app.showToast(msg, "none");
        },
        function (e) {
          app.showToast(e.data.msg, "none");
        }, _this
      );
    }
  },
  formReset: function (e) {
    this.setData({
      content: "",
      imgpath: "../view/images/upload.png",
      multipart: false
    });
    let data = this.data;
    this.getData(data);
  },
  cleanContent:function(){
    this.setData({
      content: ""
    })
  },
  cleanLoad:function(){
    this.setData({
      imgpath: "../view/images/upload.png",
      multipart: false
    })
  },
  showImage:function(e){
    let url = this.data.loadpath + e.currentTarget.dataset.filepath;
    console.log(e.currentTarget)
    wx.previewImage({
      current: this.data.loadpath + e.currentTarget.dataset.filepath, // 当前显示图片的http链接
      urls:[url] // 需要预览的图片http链接列表
    })
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
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //上一个页面
    prevPage.setData(
      {
        open:true
      }
    )

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
  final:function(){
  this.setData({
    hidden:false
  })
  },
  selectLeft: function (e) {
    let key = e.currentTarget.dataset.key;
    let key2="";
    if (this.data.key == 0.5 && e.currentTarget.dataset.key == 0.5) {
      //只有一颗星的时候,再次点击,变为0颗
      key = 0;
    }
    if(key<2)
    {
      key2="无语"
    }else if(key>1.5&&key<3){
      key2 ="差"
    } else if (key >2.5 && key <4) {
      key2 = "一般"
    } else if (key >3.5 && key < 5) {
      key2 = "好"
    } else if (key==5) {
      key2 = "非常好"
    }
   // count = key
    this.setData({
      key: key,
      key2: "("+key2+")"
    })
  },
  //点击右边,整颗星
  selectRight: function (e) {
    var key = e.currentTarget.dataset.key;
    let key2 = "";
   // count = key
    if (key < 2) {
      key2 = "无语"
    } else if (key > 1.5 && key < 3) {
      key2 = "差"
    } else if (key > 2.5 && key < 4) {
      key2 = "一般"
    } else if (key > 3.5 && key < 5) {
      key2 = "好"
    } else if (key == 5) {
      key2 = "非常好"
    }
    this.setData({
      key: key,
      key2: "("+key2+")"
    })
  },
  cancel:function(){
    this.setData({
      hidden:true
    })
  },
  confirm:function(){
    this.setData({
      hidden: true,
      action:"u",
      score:this.data.key
    });
    let that = this;
    let data={
      action: "u",
      score: that.data.key,
      id: that.data.keyword
    };
    app.requestApi(app.globalData.host + app.globalData.responseUrl, data,
      function (e) {
        let status = e.data.status;
        let msg = e.data.msg;
        if (status>-1) {
          wx.showLoading({
            title: '提交完成',
            mask: true
          });
          that.setData({
            d1:true,
            d2:true
          })
        }else{
            wx.showLoading({
              title: '错误：' + msg,
              mask: true
            })
        }
        setTimeout(function () {
          wx.hideLoading()
        }, 800)
      },
      function (e) {
      }, that
    ) 
  }
});
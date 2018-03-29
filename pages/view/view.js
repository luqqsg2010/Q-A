const app = getApp();
// pages/view/view.js
var util = require('../../utils/util.js') ;
var lastIndex=-1;
Page({
 
  /**
   * 页面的初始数据
   */
  data: {
    searchKeyword: '',  //需要搜索的字符  
    searchSongList: [], //放置返回数据的数组  
    isFromSearch: true,   // 用于判断searchSongList数组是不是空数组，默认true，空的数组  
    searchPageNum: 1,   // 设置加载的第几次，默认是第一次  
    callbackcount: 10,      //返回数据的个数  
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
    searchLoadingComplete: false,  //“没有数据”的变量，默认false，隐藏  
    delBtnWidth:300,
    loadpath: app.globalData.host+"/upload/",
    open:true //防止多次点击
  },
  bindKeywordInput: function (e) {
    console.log("输入框事件")
    this.setData({
      searchKeyword: e.detail.value
    })
  },
  publicRequest:function(data,target){
    app.requestApi(app.globalData.host + app.globalData.actionUrl, data,
      function (e) {
        let status = e.data.status;
        let msg = e.data.msg;
        let size = e.data.size;
        if (size < 0) {
          wx.showLoading({
            title: '错误：' + msg,
            mask: true
          })
        } else if (size == 0) {
          wx.showLoading({
            title: '当前数据不存在',
            mask: true
          })
        }
        else {
          wx.showLoading({
            title: '处理成功',
            mask: true
          });
        }
        target.keywordSearch(e);
        setTimeout(function () {
          wx.hideLoading()
        }, 500)
      },
      function (e) {

      }, target
    )
  },
  delItem:function(e){
  let _this =this;
  let id=e.currentTarget.dataset.id;
  let data={
    action: "del",
    id: id,
    userid: app.globalData.userInfo["userid"]
  };
  this.publicRequest(data,_this);
}
   ,
  sign:function(e){
    let _this = this;
    let id = e.currentTarget.dataset.id;
    let status = e.currentTarget.dataset.status=="1"?"0":"1";
    let data = {
      action: "sign_"+status,
      id: id,
      userid: app.globalData.userInfo["userid"]
    };
    this.publicRequest(data, _this);
  },
  //点击搜索按钮，触发事件  
  keywordSearch: function (e) {
    this.setData({
      searchPageNum: 1,   //第一次加载，设置1 
      results: [],  //放置返回数据的数组,设为空  
      isFromSearch: true,  //第一次加载，设置true 
      searchLoading: true,  //把"上拉加载"的变量设为true，显示  
      searchLoadingComplete: false //把“没有数据”设为false，隐藏  
    })
    this.fetchSearchList();
  },
  //滚动到底部触发事件  
  searchScrollLower: function () {
    let that = this;
    if (that.data.searchLoading && !that.data.searchLoadingComplete) {
      that.setData({
        searchPageNum: that.data.searchPageNum + 1,  //每次触发上拉事件，把searchPageNum+1 
        isFromSearch: false  //触发到上拉事件，把isFromSearch设为为false 
      });
      that.fetchSearchList();
    }
  } ,
  fetchSearchList: function () {
    let that = this;
    let searchKeyword = that.data.searchKeyword,//输入框字符串作为参数  
      searchPageNum = that.data.searchPageNum,//把第几次加载次数作为参数  
      count = that.data.callbackcount; //返回数据的个数  
    app.requestApi(app.globalData.host + app.globalData.viewUrl, {
      keyword: searchKeyword,
      pagenum: searchPageNum,
      count: count,
      code: "0,1,2",
      userid:app.globalData.userInfo["userid"]
    }, 
    function (e) {
      let status = e.data.status;
      let msg = e.data.msg;
      let size = e.data.count;
      console.log(that.data.loadpath);
      if (status == 0 && size != 0) {
        let searchList = [];
        //如果isFromSearch是true从data中取出数据，否则先从原来的数据继续添加  
        that.data.isFromSearch ? searchList = e.data.list : searchList = that.data.results.concat(e.data.list);
        let searchLoading = size < count ? false : true;
        that.setData({
          results: searchList,
          searchLoading: searchLoading   //是否显示"上拉加载" 
        });
      } else if (status == 0 && size == 0) {
        that.setData({
          searchLoadingComplete: true,
          searchLoading: false
        });
        console.log("searchKeyword:" + searchKeyword + " 查不到记录");
      } 
    },
      "",that
    )
  }, 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.fetchSearchList();
    /*
    console.log(app.globalData.userInfo.username);
    this.setData(
      {
        banner: [
          { id: '1', name: 'OA问题',date:"2018-01-09",seq:"1659",img:""}, 
        { id: '2', name: '购销问题' ,date:"2018-01-12",seq:"1688",img:""},
        {id:'3',name:"HR问题",date:"2018-01-13",seq:"1899",img:""}
        ],
        user:app.globalData.userInfo.username
      }
    )
    */
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
  showImage :function(e){
    console.log("showImage" + e);
  },
  //手指刚放到屏幕触发
  touchS: function (e) {
    if (this.data.open==false) return;
    console.log("touchS" + e);
    //判断是否只有一个触摸点
    if (e.touches.length == 1) {
      var index = e.currentTarget.dataset.index;
      var list = this.data.results;
      if (lastIndex != -1 && lastIndex != index) {
        if (list[lastIndex])
        list[lastIndex].txtStyle = "left:0rpx";
      }
      this.setData({
        //记录触摸起始位置的X坐标
        startX: e.touches[0].clientX
      });
    }
  },
  //触摸时触发，手指在屏幕上每移动一次，触发一次
  touchM: function (e) {
    if (this.data.open == false) return;
    console.log("touchM:" + e);
    var that = this
    if (e.touches.length == 1) {
      //记录触摸点位置的X坐标
      var moveX = e.touches[0].clientX;
      //计算手指起始点的X坐标与当前触摸点的X坐标的差值
      var disX = that.data.startX - moveX;
      //delBtnWidth 为右侧按钮区域的宽度
      var delBtnWidth = that.data.delBtnWidth;
      var txtStyle = "";
      if (disX == 0 || disX < 0) {//如果移动距离小于等于0，文本层位置不变
        txtStyle = "left:0rpx";
      } else if (disX > 0) {//移动距离大于0，文本层left值等于手指移动距离
        txtStyle = "left:-" + disX + "rpx";
        if (disX >= delBtnWidth) {
          //控制手指移动距离最大值为删除按钮的宽度
          txtStyle = "left:-" + delBtnWidth + "rpx";
        }
      }
      //获取手指触摸的是哪一个item
      var index = e.currentTarget.dataset.index;
      var list = that.data.results;
      //将拼接好的样式设置到当前item中
      list[index].txtStyle = txtStyle;
      console.log( txtStyle);
      //更新列表的状态
      this.setData({
        results: list
      });
    }
  },
  touchE: function (e) {
    if (this.data.open == false) return;
    console.log("touchE" + e);
    var that = this
    if (e.changedTouches.length == 1) {
      //手指移动结束后触摸点位置的X坐标
      var endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离
      var disX = that.data.startX - endX;
      var delBtnWidth = that.data.delBtnWidth;
      var index = e.currentTarget.dataset.index;
      var list = that.data.results;
      if ((list[index].txtStyle == "left:0rpx" || list[index].txtStyle == undefined)&&disX==0){
        this.setData({
          open:false
        });
        wx.showLoading({
          title: '请稍后',
          mask: true
        });
          //单击跳转到信息回复页面
          wx.navigateTo({
            url: '../form/myview?title=' + list[index].description + "&id=" + list[index].id + "&cuser=" + list[index].userid + "&filepath=" + list[index].filepath,
          })
      }
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var txtStyle = disX > delBtnWidth / 3 ? "left:-" + delBtnWidth + "rpx" : "left:0rpx";
      //获取手指触摸的是哪一项
      console.log(txtStyle);
      lastIndex = index;
      list[index].txtStyle = txtStyle;
      //更新列表的状态
      that.setData({
        results: list
      });
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})
// pages/statistic/statistic.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  downSort: function (array) {
    for (let i = 1; i < array.length; i++) {
      for (let j = 0; j < array.length - i; j++) {
        if (parseInt(array[j].vote) < parseInt(array[j + 1].vote)) {
          let tempWork = array[j + 1].work;
          let tempVote = array[j + 1].vote;
          array[j + 1].work = array[j].work;
          array[j + 1].vote = array[j].vote;
          array[j].work = tempWork;
          array[j].vote = tempVote;
        }
      }
    }
    // for (let x in array) {
    //   console.log(array[x]);
    // }

    return array;
  },

  query: function () {
    let resultList = [];
    const db = wx.cloud.database();
    db.collection('work').get({
      success: res => {
        let queryResult = res.data;
        for (let x in queryResult) {
          let resultMap = {};
          resultMap["work"] = queryResult[x].work;
          resultMap["vote"] = queryResult[x].vote;
          resultList.push(resultMap);
        }

        let statisticList = [];
        for (let x in resultList) {
          let flag = false;
          for (let y in statisticList) {
            if (statisticList[y].work == resultList[x].work) {
              statisticList[y].vote = parseInt(statisticList[y].vote) + parseInt(resultList[x].vote);
              flag = true;
              break;
            }
          }
          if (!flag) {
            let statisticMap = {};
            statisticMap['work'] = resultList[x].work;
            statisticMap['vote'] = resultList[x].vote;
            statisticList.push(statisticMap);
          }
        }

        this.setData({
          workArray: this.downSort(statisticList)
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.query();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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

  }
})
// pages/vote/vote.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nameArray: ['肖永州', '吴琳', '赵玉梅', '肖亮宇'],
    groupArray: ['第一组', '第二组', '第三组', '第四组', '第五组', '第六组', '第七组', '第八组', '第九组', '第十组'],
    work1Array: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    work2Array: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    work3Array: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    work4Array: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    work5Array: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    work6Array: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    work7Array: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    work8Array: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    work9Array: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    work10Array: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    testArray: [{
        "work": "重点工作3",
        "vote": "30"
      },
      {
        "work": "重点工作5",
        "vote": "50"
      },
      {
        "work": "重点工作7",
        "vote": "70"
      },
      {
        "work": "重点工作9",
        "vote": "90"
      },
      {
        "work": "重点工作2",
        "vote": "20"
      },
      {
        "work": "重点工作1",
        "vote": "10"
      },
      {
        "work": "重点工作4",
        "vote": "40"
      },
      {
        "work": "重点工作6",
        "vote": "60"
      },
      {
        "work": "重点工作8",
        "vote": "80"
      },
      {
        "work": "重点工作10",
        "vote": "100"
      }
    ]
  },

  test: function () {
    this.downSort(this.data.testArray);
  },

  upSort:function(array){
    for (let i = 1; i < array.length; i++) {
      for (let j = 0; j < array.length - i; j++) {
        if (parseInt(array[j].vote) > parseInt(array[j + 1].vote)) {
          let tempWork = array[j + 1].work;
          let tempVote = array[j + 1].vote;
          array[j + 1].work = array[j].work;
          array[j + 1].vote = array[j].vote;
          array[j].work = tempWork;
          array[j].vote = tempVote;
        }
      }
    }
    
    for (let x in array) {
      console.log(array[x]);
    }
  },

  downSort:function(array){
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
    
    for (let x in array) {
      console.log(array[x]);
    }
  },

  vote: function () {
    if (wx.getStorageSync('name') == "") {
      wx.showToast({
        title: '请选择姓名',
        icon: 'none',
        duration: 2000,
        mask: true
      })
      return;
    }

    let name = this.data.nameArray[wx.getStorageSync('name')];

    if (wx.getStorageSync('group') == "") {
      wx.showToast({
        title: '请选择小组',
        icon: 'none',
        duration: 2000,
        mask: true
      })
      return;
    }

    let group = this.data.groupArray[wx.getStorageSync('group')];

    //查询
    this.query(name);
    //添加
    for (let i = 1; i <= 10; ++i) {
      this.addProcess(name, group, '重点工作' + i, 'work' + i);
    }
  },

  addProcess: function (name, group, work, workName) {
    if (wx.getStorageSync(workName) != "") {
      let vote = 0;
      vote = this.data.work1Array[wx.getStorageSync(workName)];
      vote = parseInt(vote);
      this.onAdd(name, group, work, vote);
    }
  },

  onAdd: function (name, group, work, vote) {
    const db = wx.cloud.database()
    db.collection('work').add({
      data: {
        group: group,
        name: name,
        work: work,
        vote: vote
      },
      success: res => {
        wx.showToast({
          title: '投票成功',
        })
        console.log(res._id + ":" + res.errMsg);
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '投票失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
  },

  delete: function (resultList) {
    for (let x in resultList) {
      const db = wx.cloud.database();
      db.collection('work').doc(resultList[x]).remove({
        success: res => {
          console.log(resultList[x] + ":" + res.errMsg);
        },
        fail: err => {
          console.error('[数据库]删除失败：', err)
        }
      })
    }
  },

  query: function (name) {
    let resultList = [];
    const db = wx.cloud.database();
    db.collection('work').where({
      name: name
    }).get({
      success: res => {
        let queryResult = res.data;
        for (let x in queryResult) {
          resultList.push(queryResult[x]._id);
        }
        this.delete(resultList);
      },
      fail: err => {
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },

  nameMethod: function (e) {
    wx.setStorageSync('name', e.detail.value);
    this.setData({
      name: this.data.nameArray[e.detail.value]
    })
  },

  groupMethod: function (e) {
    wx.setStorageSync('group', e.detail.value);
    this.setData({
      group: this.data.groupArray[e.detail.value]
    })
  },

  work1Method: function (e) {
    wx.setStorageSync('work1', e.detail.value);

    this.total();

    this.setData({
      work1: this.data.work1Array[e.detail.value]
    })
  },
  work2Method: function (e) {
    wx.setStorageSync('work2', e.detail.value);

    this.total();

    this.setData({
      work2: this.data.work2Array[e.detail.value]
    })
  },
  work3Method: function (e) {
    wx.setStorageSync('work3', e.detail.value);

    this.total();

    this.setData({
      work3: this.data.work3Array[e.detail.value]
    })
  },
  work4Method: function (e) {
    wx.setStorageSync('work4', e.detail.value);

    this.total();

    this.setData({
      work4: this.data.work4Array[e.detail.value]
    })
  },
  work5Method: function (e) {
    wx.setStorageSync('work5', e.detail.value);

    this.total();

    this.setData({
      work5: this.data.work5Array[e.detail.value]
    })
  },
  work6Method: function (e) {
    wx.setStorageSync('work6', e.detail.value);

    this.total();

    this.setData({
      work6: this.data.work6Array[e.detail.value]
    })
  },
  work7Method: function (e) {
    wx.setStorageSync('work7', e.detail.value);

    this.total();

    this.setData({
      work7: this.data.work7Array[e.detail.value]
    })
  },
  work8Method: function (e) {
    wx.setStorageSync('work8', e.detail.value);

    this.total();

    this.setData({
      work8: this.data.work8Array[e.detail.value]
    })
  },
  work9Method: function (e) {
    wx.setStorageSync('work9', e.detail.value);

    this.total();

    this.setData({
      work9: this.data.work9Array[e.detail.value]
    })
  },
  work10Method: function (e) {
    wx.setStorageSync('work10', e.detail.value);

    this.total();

    this.setData({
      work10: this.data.work10Array[e.detail.value]
    })
  },

  total: function () {

    let work1 = 0;
    if (wx.getStorageSync('work1') != "") {
      work1 = this.data.work1Array[wx.getStorageSync('work1')];
      work1 = parseInt(work1);
    }

    let work2 = 0;
    if (wx.getStorageSync('work2') != "") {
      work2 = this.data.work1Array[wx.getStorageSync('work2')];
      work2 = parseInt(work2);
    }


    let work3 = 0;
    if (wx.getStorageSync('work3') != "") {
      work3 = this.data.work1Array[wx.getStorageSync('work3')];
      work3 = parseInt(work3);
    }

    let work4 = 0;
    if (wx.getStorageSync('work4') != "") {
      work4 = this.data.work1Array[wx.getStorageSync('work4')];
      work4 = parseInt(work4);
    }

    let work5 = 0;
    if (wx.getStorageSync('work5') != "") {
      work5 = this.data.work1Array[wx.getStorageSync('work5')];
      work5 = parseInt(work5);
    }


    let work6 = 0;
    if (wx.getStorageSync('work6') != "") {
      work6 = this.data.work1Array[wx.getStorageSync('work6')];
      work6 = parseInt(work6);
    }

    let work7 = 0;
    if (wx.getStorageSync('work7') != "") {
      work7 = this.data.work1Array[wx.getStorageSync('work7')];
      work7 = parseInt(work7);
    }

    let work8 = 0;
    if (wx.getStorageSync('work8') != "") {
      work8 = this.data.work1Array[wx.getStorageSync('work8')];
      work8 = parseInt(work8);
    }

    let work9 = 0;
    if (wx.getStorageSync('work9') != "") {
      work9 = this.data.work1Array[wx.getStorageSync('work9')];
      work9 = parseInt(work9);
    }

    let work10 = 0;
    if (wx.getStorageSync('work10') != "") {
      work10 = this.data.work1Array[wx.getStorageSync('work10')];
      work10 = parseInt(work10);
    }

    let total = work1 + work2 + work3 + work4 + work5 + work6 + work7 + work8 + work9 + work10;
    this.setData({
      total: total
    })

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
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.total();

    this.setData({
      nameIndex: wx.getStorageSync('name'),
      groupIndex: wx.getStorageSync('group'),
      work1Index: wx.getStorageSync('work1'),
      work2Index: wx.getStorageSync('work2'),
      work3Index: wx.getStorageSync('work3'),
      work4Index: wx.getStorageSync('work4'),
      work5Index: wx.getStorageSync('work5'),
      work6Index: wx.getStorageSync('work6'),
      work7Index: wx.getStorageSync('work7'),
      work8Index: wx.getStorageSync('work8'),
      work9Index: wx.getStorageSync('work9'),
      work10Index: wx.getStorageSync('work10'),
      name: this.data.nameArray[wx.getStorageSync('name')],
      group: this.data.groupArray[wx.getStorageSync('group')],
      work1: this.data.work1Array[wx.getStorageSync('work1')],
      work2: this.data.work2Array[wx.getStorageSync('work2')],
      work3: this.data.work3Array[wx.getStorageSync('work3')],
      work4: this.data.work4Array[wx.getStorageSync('work4')],
      work5: this.data.work5Array[wx.getStorageSync('work5')],
      work6: this.data.work6Array[wx.getStorageSync('work6')],
      work7: this.data.work7Array[wx.getStorageSync('work7')],
      work8: this.data.work8Array[wx.getStorageSync('work8')],
      work9: this.data.work9Array[wx.getStorageSync('work9')],
      work10: this.data.work10Array[wx.getStorageSync('work10')],
    })
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
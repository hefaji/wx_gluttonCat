var util = require('../../common/common.js');
let URLINDEX=util.prefix();
Page({
  data:{
    actionSheetHidden1:true,
    actionSheetHidden2:true,
    proPhoto:[
      {
        "name": "5973751f8282",
        "url": "http://m.jiumaojia.com/site/products?id=24843",
        "img": "http://m.jiumaojia.com/upload/2017/03/16/20170316012527873.jpg"
      },
      {
        "name": "4eca65e563a88350",
        "url": "http://m.jiumaojia.com/site/products?id=24739",
        "img": "http://m.jiumaojia.com/upload/2017/03/16/20170316012527712.jpg"
      },
      {
        "name": "6392540d7b2c4e00",
        "url": "http://m.jiumaojia.com/site/products?id=25159",
        "img": "http://m.jiumaojia.com/upload/2017/03/16/20170316012527839.jpg"
      },
      {
        "name": "96905f62773c955c",
        "url": "http://m.jiumaojia.com/site/products?id=25147",
        "img": "http://m.jiumaojia.com/upload/2017/03/16/20170316012527995.jpg"
      },
      {
        "name": "166b3e65e5672c",
        "url": "http://m.jiumaojia.com/site/article_detail?id=233",
        "img": "http://m.jiumaojia.com/upload/2017/03/16/20170316012527314.jpg"
      }
    
    ],
    
    // 图文静态图片
    img6:URLINDEX+"/xinzeng/fuwu.png",
    img7:URLINDEX+"/xinzeng/authorization.jpg",
    img8:URLINDEX+"/jmj/icon/shuoming.png",
    img9:URLINDEX+"/jmj/product/zheng_icon.png",
    img10:URLINDEX+"/jmj/product/zhi_you.png",
    img11:URLINDEX+"/jmj/product/renbao.png",
    img12:URLINDEX+"/jmj/product/tongjia.png",
    
    //购物车相关
    styTop:"top:-60rpx",
    styHide:"top:0",
    buyNum:1,
    goodsDetail:{}
  },
  // 第一个弹窗
  action: function(){
      this.setData({
        actionSheetHidden1:false
      })
  },
  actionSheetChange:function(){
    this.setData({
        actionSheetHidden1:!this.data.actionSheetHidden1
      })
  },
  //第二个弹窗
  action2: function(e){
      var sta=e.target.dataset.buy;
      this.setData({
        actionSheetHidden2:false,
        buyy:sta
      })
  },
  actionSheet2Change:function(){
    this.setData({
        actionSheetHidden2:!this.data.actionSheetHidden2
      })
  },
  //购物处理函数
  reduce: function(){
    if(this.data.buyNum<=1){
      wx.showToast({
        title: '购买数量不能小于1件',
        duration: 1000
      })
    }else{
      this.setData({
        buyNum:--this.data.buyNum
      })
    }
  },
  add:function(){
    if(this.data.buyNum>=this.data.goodsDetail.store_nums){
      wx.showToast({
        title: '购买数量超出库存',
        duration: 1000
      })
    }else{
      this.setData({
        buyNum:++this.data.buyNum
      })
    }
  },
  buynow: function(){
    var self=this;
    buyNowFun(self);
  },
  joincar: function(){
    var self=this;
    joinCarFun(self);
  },
  grass: function(){
    var that=this;
    getGrass(that);
  },
  onLoad:function(options){
    var that=this;
    that.setData({
      id:options.id
    });
    wx.setNavigationBarTitle({
      title:options.title
    });
    getProductsDetail(that)
  }
})

function getProductsDetail(that){
  wx.request({
      url: util.pre()+'/apic/goods_detail',
      data:{
          id:that.data.id,
          token:util.code() 
      },
      header: {
          'Content-Type': 'application/json'
      },
      success: function(res) {
        
         that.setData({
           goodsDetail: {
             name: "一叶子面膜",
             price: 200.00,
             sell_count: 30023,
             kc: 3402,
             desc: "汇萃植物鲜活精萃与最新科技，为肌肤注入新鲜能量，肌肤满鲜赋活。汇萃植物鲜活精萃与最新科技，为肌肤注入新鲜能量，肌肤满鲜赋活。汇萃植物鲜活精萃与最新科技，为肌肤注入新鲜能量，肌肤满鲜赋活。汇萃植物鲜活精萃与最新科技，为肌肤注入新鲜能量，肌肤满鲜赋活。"
           }
           
        })
      } 
    }) 
}
function getGrass(that){
  wx.request({
      url: util.pre()+'/simple/favorite_add/_paramKey_/_paramVal_',
      data:{
          goods_id:that.data.goodsDetail.id,
					random:Math.random(),
          token:util.code()  
      },
      header: {
          'Content-Type': 'application/json'
      },
      success: function(res) {
        that.setData({
          isfavorite:!that.data.isfavorite
        })
      } 
    }) 
}
function buyNowFun(self)
		{ 
      let id=self.data.goodsDetail.id;
      let buyNums=self.data.buyNum;
      checkNum(self)
      wx.navigateTo({
        url: '../cart2/cart2?id='+168+'&num='+buyNums+'&type=goods'
      })  
		}
function joinCarFun(self){
    checkNum(self)
    wx.request({
      url: util.pre()+'/simple/joinCart/_paramKey_/_paramVal_?type=goods',
      data:{
          goods_id:self.data.goodsDetail.id,
					random:Math.random(),
          token:util.code(),
          goods_num:self.data.buyNum,
      },
      header: {
          'Content-Type': 'application/json'
      },
      success: function(res) {
          showCart(self);
      } 
    }) 
}
//前端检查是否能加入购物车
function checkNum(self){
       let id=self.data.goodsDetail.id;
      let storeNum=self.data.goodsDetail.store_nums;
      let buyNums=self.data.buyNum;
      if(storeNum<=0||storeNum<buyNums){
        wx.showModal({
          title: '提示',
          content: '商品库存不足',
          success: function(res) {
            if (res.confirm) {
              self.setData({
                actionSheetHidden2:true,
              })
            }
          }
        })
        return false;
      }
}
function showCart(self){
    wx.request({
      url: util.pre()+'/simple/showCart/_paramKey_/_paramVal_',
      data:{
          token:util.code(), 
          random:Math.random(),
      },
      header: {
          'Content-Type': 'application/json'
      },
      success: function(res) {
          wx.showModal({
              title: '加入购物车成功',
              content: '是否立即进入购物车',
              success: function(res) {
                self.setData({
                    actionSheetHidden2:true,
                  })
                if (res.confirm) {
                  //还要显示购物车。。。
                   wx.switchTab({
                      url: '../cart/cart'
                    })
                }
              }
            })
      } 
    }) 
}
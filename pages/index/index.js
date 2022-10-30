// index.js
var mqtt = require('../../utils/mqtt.min.js')
var client = null

Page({
  data: {
    temp: "21",
    humidity: '10',
    gap: '22',
    lsense: '100',
    text: "今天空气质量良好,出行请带好口罩",
    weather: '晴',
    region: ['广东省', '广州市', '从化区'],
    locationID: '101280101',
    getmessage: " ",
    switch1: false,
    switch2: false,
    firstShow: false,
    switch_led1: false,
    switch_led2: false,
    switch_led3: false,
    switch_led4: false,
    slider_value: 0,
    getinputtext: " "
  },
  onLoad() {
    this.connectmqtt()
  },
  openDialog() {
    var that = this;
    that.setData({
      firstShow: !that.data.firstShow
    })
  },
  close_obj() {
    var that = this;
    this.setData({
      firstShow: !that.data.firstShow,
    })
  },
  gettext: function (e) {
    console.log(e.detail.value)
    this.setData({
      getinputtext: e.detail.value
    })
  },
  getVerificationCode() {
    console.log("发送数据:" + this.data.getinputtext)
    client.publish('/iot/1879/chen/upload/', this.data.getinputtext)
    this.setData({
      getinputtext: " "
    })
  },

  connectmqtt: function () {
    var that = this
    const options = {
      conneceTimeout: 4000,
      clientId: 'chen' + Math.ceil(Math.random() * 10),
      port: '8084',
      username: '3071f580444edae15becd1c66714c780',
      password: '123456'
    }
    client = mqtt.connect('wxs://t.yoyolife.fun/mqtt', options)

    client.on('connect', (e) => {
      console.log('服务器连接成功')
      client.subscribe('/iot/1879/chen/sub/', {
        qos: 0
      }, function (err) {
        if (!err) {
          console.log('订阅成功')
        }
      })
    })
    //信息监听事件
    client.on('message', function (topic, message) {
      let rec_data={}
      rec_data=JSON.parse(message)
      console.log(message.toString())
      that.setData({
        //getmessage: message.toString(),
        temp:rec_data.temp,
        humidity: rec_data.humidity,
        gap:rec_data.gap,
        lsense: rec_data.lsense
      })
    })
    client.on('reconnect', (error) => {
      console.log('正在重新连接', error)
    })
    client.on('error', (error) => {
      console.log('连接失败', error)
    })
  },


  regionChange: function (e) {
    console.log("地区改变:", e.detail.value);
    this.setData({
      region: e.detail.value
    });
  },
  /*  getlocationID:function(){
   var that=this;
   wx.request({
   url: 'https://devapi.qweather.com/v2/city/lookup',
   data: {
     location:that.data.region[2],
     adm:that.data.region[0],
     key:'1d0b436602cb44b7bf2495fbaa6a8437'
   },
   success:function(res){
     console.log(res.data),
     that.data.locationID=res.data.location[0].id
     },
   })
   },
   getWeather:function(){
     var that=this;
     wx:request({
       url:'https://devapi.qweather.com/v7/weather/now',
       data:{
         location:that.data.locationID,
         ker:'1d0b436602cb44b7bf2495fbaa6a8437',
         gzip:'n',
       },
       success:function(res){
         console.log(res.data),
         that.setData({now:res.data.now})
       },
     })
   }, */
 /*  getTemp(event) {
    //console.log(event.detail.value)
    let value = event.detail.value
    this.setData({
      temp: value
    })
  }, */
  switch1Change(e) {
    console.log(e.detail.value)
    if (e.detail.value) {
      console.log("打开灯")
      client.publish('/iot/1879/chen/upload/led/', '{"target":"ledall","value":1}',function(err){
        if(!err)
          console.log("发送成功-打开所有灯")
        }
      )
      
    } else {
      console.log("关闭灯")
      client.publish('/iot/1879/chen/upload/led/', '{"target":"ledall","value":0}',function(err){
        if(!err)
          console.log("发送成功-打开所有灯")
        }
      )
    }
  },
  /* 四栈灯的控制 */
  switch_led1Change(e) {
    console.log(e.detail.value)
    if (e.detail.value) {
      console.log("打开LED1")
      this.setData({
        /*  switch1:false */
      })
    } else {
      console.log("关闭LED1")
      this.setData({
        /* switch1:true */
      })
    }
  },
  switch_led2Change(e) {
    console.log(e.detail.value)
    if (e.detail.value) {
      console.log("打开LED2")
      this.setData({
        /*  switch1:false */
      })
    } else {
      console.log("关闭LED2")
      this.setData({
        /* switch1:true */
      })
    }
  },
  switch_led3Change(e) {
    console.log(e.detail.value)
    if (e.detail.value) {
      console.log("打开LED3")
      this.setData({
        /*  switch1:false */
      })
    } else {
      console.log("关闭LED3")
      this.setData({
        /* switch1:true */
      })
    }
  },
  switch_led4Change(e) {
    console.log(e.detail.value)
    if (e.detail.value) {
      console.log("打开LED4")
      this.setData({
        /*  switch1:false */
      })
    } else {
      console.log("关闭LED4")
      this.setData({
        /* switch1:true */
      })
    }
  },
  switch2Change(e) {
    console.log(e.detail.value)
    if (e.detail.value) {
      console.log("打开警报")
      client.publish('/iot/1879/chen/upload/beep/', '0')
      this.setData({
        /*  switch1:false */
      })
    } else {
      console.log("关闭警报")
      client.publish('/iot/1879/chen/upload/beep/', '0')
      this.setData({
        /* switch1:true */
      })
    }
  }

})
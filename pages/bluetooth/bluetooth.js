var app = getApp();
var deviceId;
var i = 0;
var serviceId = [];
var characteristicId = [];
Page({
	data: {

	},
	onLoad: function () {
		wx.onBluetoothAdapterStateChange(function (res) {
			console.log('adapterState changed, now is', res)
		})
	},
	//打开适配器
	openadapter: function () {
		wx.openBluetoothAdapter({
			success: function (res) {
				console.log(res, "success")
			},
			fail: function (res) {
				console.log(res, "fail")
			},
		})
	},
	//关闭适配器
	closeadapter: function () {
		wx.closeBluetoothAdapter({
			success: function (res) {
				console.log(res, "success")
			},
			fail: function (res) {
				console.log(res, "fail")
			},
		})
	},
	//开始搜索
	opendiscovery: function () {
		wx.startBluetoothDevicesDiscovery({
			services: [],
			success: function (res) {
				console.log(res)
			},
			fail: function (res) {
				console.log(res, "fail")
			},
		})
	},
	//关闭搜索
	closediscovery: function () {
		wx.stopBluetoothDevicesDiscovery({
			success: function (res) {
				console.log(res)
			},
			fail: function (res) {
				console.log(res, "fail")
			},
		})
	},
	//获取蓝牙设备
	getdevice: function () {
		function ab2hex(buffer) {
			var hexArr = Array.prototype.map.call(
				new Uint8Array(buffer),
				function (bit) {
					return ('00' + bit.toString(16)).slice(-2)
				}
			)
			return hexArr.join('');
		}
		wx.getBluetoothDevices({
			success: function (res) {
				console.log(res)
				i = 0;
				while (res.devices[i]) {
					console.log(i);
					console.log(res.devices[i].name, res.devices[i].deviceId);
					if (res.devices[i].name == 'YahBoom_BL') {
						deviceId = res.devices[i].deviceId;
						console.log(deviceId);
					}
					i++;
				}
			}
		})
	},
	//获取已经连接设备
	getconnecteddevice: function () {
		wx.getConnectedBluetoothDevices({
			//services:[],
			success: function (res) {
				console.log(res)
			}
		})
	},
	//连接设备
	connecteddevice: function () {
		wx.createBLEConnection({
			deviceId: deviceId,
			success: function (res) {
				console.log(res);
			},
		})
	},
	//获取服务
	getservice: function () {
		wx.getBLEDeviceServices({
			deviceId: deviceId,
			success: function (res) {
				console.log(res.services);
				i = 0;
				while (res.services[i]) {
					serviceId[i] = res.services[i].uuid;
					console.log(serviceId[i]);
					i++;
				}
			},
		})
	},
	//获取特征值
	getcharacteristics: function () {
		wx.getBLEDeviceCharacteristics({
			deviceId: deviceId,
			serviceId: serviceId[0],
			success: function (res) {
				console.log('device getBLEDeviceCharacteristics:', res.characteristics)
			}
		})
		wx.getBLEDeviceCharacteristics({
			deviceId: deviceId,
			serviceId: serviceId[1],
			success: function (res) {
				i = 0;
				while (res.characteristics[i]) {
					characteristicId[i] = res.characteristics[i].uuid;
					console.log(characteristicId[i]);
					i++;
				}
			}
		})
	},
	//读取值
	startread: function () {
		wx.readBLECharacteristicValue({
			deviceId: deviceId,
			serviceId: serviceId[1],
			characteristicId: characteristicId[0],
			success: function (res) {
				console.log('readBLECharacteristicValue:', res.errCode)
			}
		})
	},
	//开始notify
	startnotify: function () {
		wx.notifyBLECharacteristicValueChange({
			state: true,
			deviceId: deviceId,
			serviceId: serviceId[1],
			characteristicId: characteristicId[0],
			success: function (res) {
				console.log('notifyBLECharacteristicValueChange success', res.errMsg)
			}
		})

		function ab2hex(buffer) {
			var hexArr = Array.prototype.map.call(
				new Uint8Array(buffer),
				function (bit) {
					return ('00' + bit.toString(16)).slice(-2)
				}
			)
			return hexArr.join('');
		}
		wx.onBLECharacteristicValueChange(function (res) {
			console.log('characteristic value comed:', ab2hex(res.value))
		})
	},
	//写数据
	startwrite: function () {
		let buffer = new ArrayBuffer(3)
		let dataView = new DataView(buffer)
		dataView.setUint8(1, 100)
		wx.writeBLECharacteristicValue({
			deviceId: deviceId,
			serviceId: serviceId[1],
			characteristicId: characteristicId[0],
			value: buffer,
			success: function (res) {
				console.log('writeBLECharacteristicValue success', res.errMsg)
			}
		})
	}



})
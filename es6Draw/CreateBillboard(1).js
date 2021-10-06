class DrawBillboard {
	constructor(arg) {
		this.objId = Number((new Date()).getTime() + "" + Number(Math.random() * 1000).toFixed(0));
		this.viewer = arg.viewer;
		this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
		this._position = null;
		this._billboard = null;
	}

	get billboard() {
		return this._billboard;
	}
	get position() {
		return this._position;
	}
	startCreate() {
		var $this = this;
		this.handler.setInputAction(function (evt) { //单机开始绘制
			var cartesian = $this.getCatesian3FromPX(evt.position);
			if (!cartesian) return;
			if(!Cesium.defined($this._billboard)){
				$this._billboard = $this.createBillboard(cartesian);
				$this.handler.destroy();
			}
		}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
	}
	createBillboard(cartesian) {
		var billboard = this.viewer.entities.add({
			position: cartesian,
			billboard: {
				image: 'img/mark4.png',
				scale: 1,
				horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
				verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
				heightReference:Cesium.HeightReference.CLAMP_TO_GROUND,
				disableDepthTestDistance:Number.MAX_VALUE
			}
		});
		billboard.objId = this.objId;
		return billboard;
	}
	destroy() {
		if (this.handler) {
			this.handler.destroy();
			this.handler = null;
		}
		if (this._billboard) {
			this.viewer.entities.remove(this._billboard);
			this._billboard = null;
		}
		this._position = null;
	}

	//将屏幕坐标转换为经纬度，并获取位置
	getCatesian3FromPX(px) {
		var cartesian;
		var ray = this.viewer.camera.getPickRay(px);
		if (!ray) return null;
		cartesian = this.viewer.scene.globe.pick(ray, this.viewer.scene);
		return cartesian;
	}
}
class DrawPolt {
    constructor(arg) {
        this.viewer = arg.viewer
        this._billboardArr = [];
        this._lineArr = [];
        this._gonArr = [];
        this.handler = null;
    }
    get billboardArr() {
        return this._billboardArr;
    }
    get polylineArr() {
        return this._lineArr;
    }
    get polygonArr() {
        return this._gonArr;
    }
    create(type) {
        if (!type) {
            console.warn("请选择类型！");
        }
        if (type == 1) { //绘制billboard
            var billboard = new DrawBillboard({
                viewer: this.viewer
            });
            billboard.startCreate();
            this._billboardArr.push(billboard);

        } else if (type == 2) { //绘制线
            var line = new DrawPolyline({
                viewer: this.viewer
            });
            line.startCreate();
            this._lineArr.push(line);
        } else { //绘制面
            var gon = new DrawPolygon({
                viewer: this.viewer
            });
            gon.startCreate();
            this._gonArr.push(gon);

        }
    }
    clearAll() {
        for (var i = 0; i < this._lineArr.length; i++) {
            var line = this._lineArr[i];
            line.destroy();
        }
        this._lineArr = [];
        for (var j = 0; j < this._gonArr.length; j++) {
            var gon = this._gonArr[j];
            gon.destroy();
        }
        this._gonArr = [];
        for (var k = 0; k < this._billboardArr.length; k++) {
            var billboard = this._billboardArr[k];
            billboard.destroy();
        }
        this._billboardArr = [];
    }
    clearOne() {
        if (!this.handler) {
            this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
        }
        var that = this;
        this.handler.setInputAction(function (evt) {
            var pick = that.viewer.scene.pick(evt.position);
            if (Cesium.defined(pick) && pick.id) {
                that.viewer.entities.remove(pick.id);
                that.handler.destroy();
                that.handler = null;
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }
}
function measureArea(viewer) {
    var viewer = this.viewer

    var isDraw = false;
    var positions = [];
    var polygon = null;
    var tempPoints = [];
    var handler = new Cesium.ScreenSpaceEventHandler(canvas);
    handler.setInputAction(function (movement) {
        //新增部分
        var position1;
        var cartographic;
        var ray = viewer.scene.camera.getPickRay(movement.endPosition);
        if (ray)
            position1 = viewer.scene.globe.pick(ray, viewer.scene);
        if (position1)
            cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(position1);
        if (cartographic) {
            //海拔
            var height = viewer.scene.globe.getHeight(cartographic);
            var point = Cesium.Cartesian3.fromDegrees(cartographic.longitude / Math.PI * 180, cartographic.latitude / Math.PI * 180, height);
            if (isDraw) {
          

                if (positions.length < 2) {
                    return;
                }
                if (!Cesium.defined(polygon)) {
                    positions.push(point);
                    polygon = new CreatePolygon(positions, Cesium);
                } else {
                    polygon.path.pop();
                    polygon.path.push(point);
                }
                if (positions.length >= 2) {
               
                }
            }
        }

    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    handler.setInputAction(function (movement) {
        isDraw = true;
        //新增部分
        var position1;
        var cartographic;
        var ray = viewer.scene.camera.getPickRay(movement.position);
        if (ray)
            position1 = viewer.scene.globe.pick(ray, viewer.scene);
        if (position1)
            cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(position1);
        var longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
        var latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
        var heightString = cartographic.height;
        tempPoints.push({ lon: longitudeString, lat: latitudeString ,hei:heightString});
        if (cartographic) {
            //海拔
            var height = viewer.scene.globe.getHeight(cartographic);
            var point = Cesium.Cartesian3.fromDegrees(cartographic.longitude / Math.PI * 180, cartographic.latitude / Math.PI * 180, height);
            if (isDraw) {
                positions.push(position1);
                var tmep = viewer.entities.add({
                    position: point,
                    point: {
                        show: true,
                        color: Cesium.Color.SKYBLUE,
                        pixelSize: 3,
                        outlineColor: Cesium.Color.YELLOW,
                        outlineWidth: 1
                    },
                });
            }
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    handler.setInputAction(function () {
        handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
        handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

        if (positions.length >= 2) {
            var label = getArea(tempPoints);
            // var label = String(countAreaInCartesian3(polygon.path));
            label = label.substr(0, label.indexOf(".", 0));
            var text;
            if (label.length < 6)
                text = label + "平方米";
            else {
                label = String(label / 1000000);
                label = label.substr(0, label.indexOf(".", 0) + 3);
                text = label + "平方公里"
            }
            var textArea = text;
            var lastpoint = viewer.entities.add({
                name: '多边形面积',
                position: polygon.path[polygon.path.length - 1],
                point: {
                    pixelSize: 5,
                    color: Cesium.Color.RED,
                    outlineColor: Cesium.Color.WHITE,
                    outlineWidth: 2,
                    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
                },
                label: {
                    text: textArea,
                    font: '18px sans-serif',
                    fillColor: Cesium.Color.GOLD,
                    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                    outlineWidth: 2,
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                    pixelOffset: new Cesium.Cartesian2(20, -40)
                }
            });
        }
        
        isDraw = false;
 

    }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

    var CreatePolygon = (function () {
        function _(positions, cesium) {
            if (!Cesium.defined(positions)) {
                throw new Cesium.DeveloperError('positions is required!');
            }
            if (positions.length < 3) {
                throw new Cesium.DeveloperError('positions 的长度必须大于等于3');
            }

            this.options = {
                polygon: {
                  
                    outline: true,
                    material: Cesium.Color.RED.withAlpha(0.4)
                }
            };
            this.path = positions;
            this.hierarchy = positions;
            this._init();
        }

        _.prototype._init = function () {
            var _self = this;
            var _update = function () {
                return _self.hierarchy;
            };
            //实时更新polygon.hierarchy
            this.options.polygon.hierarchy = new Cesium.CallbackProperty(_update, false);
            var oo = viewer.entities.add(this.options);
        };
        return _;
    })();

    //微元法求面积
    var countAreaInCartesian3 = function (ps) {
        var s = 0;
        for (var i = 0; i < ps.length; i++) {
            var p1 = ps[i];
            var p2;
            if (i < ps.length - 1)
                p2 = ps[i + 1];
            else
                p2 = ps[0];
            s += p1.x * p2.y - p2.x * p1.y;
        }
        return Math.abs(s);
    };
    var radiansPerDegree = Math.PI / 180.0;//角度转化为弧度(rad)
    var degreesPerRadian = 180.0 / Math.PI;//弧度转化为角度

    //计算多边形面积
    function getArea(points) {
        var res = 0;
        //拆分三角曲面
        for (var i = 0; i < points.length - 2; i++) {
            var j = (i + 1) % points.length;
            var k = (i + 2) % points.length;
            var totalAngle = Angle(points[i], points[j], points[k]);
            var dis_temp1 = distance(positions[i], positions[j]);
            var dis_temp2 = distance(positions[j], positions[k]);
            res += dis_temp1 * dis_temp2 * Math.abs(Math.sin(totalAngle)) ;
            console.log(res);
        }
        return res.toFixed(4);
    }

    /*角度*/
    function Angle(p1, p2, p3) {
        var bearing21 = Bearing(p2, p1);
        var bearing23 = Bearing(p2, p3);
        var angle = bearing21 - bearing23;
        if (angle < 0) {
            angle += 360;
        }
        return angle;
    }
    /*方向*/
    function Bearing(from, to) {
        var lat1 = from.lat * radiansPerDegree;
        var lon1 = from.lon * radiansPerDegree;
        var lat2 = to.lat * radiansPerDegree;
        var lon2 = to.lon * radiansPerDegree;
        var angle = -Math.atan2(Math.sin(lon1 - lon2) * Math.cos(lat2), Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon1 - lon2));
        if (angle < 0) {
            angle += Math.PI * 2.0;
        }
        angle = angle * degreesPerRadian;//角度
        return angle;
    }

    var PolygonPrimitive = (function(){
        function _(positions){
            this.options = {
                name:'多边形',
                polygon : {
                    hierarchy : [],
                    // perPositionHeight : true,
                    material : Cesium.Color.GREEN.withAlpha(0.5),
                    // heightReference:20000
                }
            };

            this.hierarchy = positions;
            this._init();
        }

        _.prototype._init = function(){
            var _self = this;
            var _update = function(){
                return _self.hierarchy;
            };
            //实时更新polygon.hierarchy
            this.options.polygon.hierarchy = new Cesium.CallbackProperty(_update,false);
            viewer.entities.add(this.options);
        };

        return _;
    })();

    function distance(point1,point2){
        var point1cartographic = Cesium.Cartographic.fromCartesian(point1);
        var point2cartographic = Cesium.Cartographic.fromCartesian(point2);
        /**根据经纬度计算出距离**/
        var geodesic = new Cesium.EllipsoidGeodesic();
        geodesic.setEndPoints(point1cartographic, point2cartographic);
        var s = geodesic.surfaceDistance;
        //console.log(Math.sqrt(Math.pow(distance, 2) + Math.pow(endheight, 2)));
        //返回两点之间的距离
        s = Math.sqrt(Math.pow(s, 2) + Math.pow(point2cartographic.height - point1cartographic.height, 2));
        return s;
    }

}

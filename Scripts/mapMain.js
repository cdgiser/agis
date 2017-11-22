var map_google;
var map_baidu;
var map_gaode;
var map_qq;

var map_bing;
var map_tianditu;
var map_sogou;
var Point = function (lat, lng) {
    this.lat = lat;
    this.lng = lng;
}
Point.prototype.toGoogle = function () { return new google.maps.LatLng(this.lat, this.lng); };
Point.prototype.toBaidu = function () { return new BMap.Point(this.lng+0.0065, this.lat+0.0060); };
Point.prototype.toGaode = function () { return new AMap.LngLat(this.lng, this.lat); };
Point.prototype.toQQ = function () { return new qq.maps.LatLng(this.lat, this.lng); };

Point.prototype.toBing = function () { return new Microsoft.Maps.Location(this.lat , this.lng ); };
Point.prototype.toSoGou = function () { return new sogou.maps.LatLng(this.lat+0.001, this.lng - 0.0065); };
Point.prototype.toTianDiTu = function () { return new T.LngLat(this.lng - 0.0065, this.lat + 0.001); };

var init_point = new Point(34.76, 113.65); 
var init_level = 15;
var google_ele;//高程
function init_event() {
    map_google.addListener("drag", extent_changed);
    map_google.addListener("zoom_changed", extent_changed);
}

function displayLocationElevation(location, elevator) {
    var eleRes = "";
    elevator.getElevationForLocations({
        'locations': [location]
    }, function (results, status) {
        if (status === 'OK') {
            // Retrieve the first result
            if (results[0]) {
                $(".MapEle").html('高程为：' + results[0].elevation.toFixed(2) + '米');
            } else {
                $(".MapEle").html = '无高程信息！';
            }
        } else {
            $(".MapEle").html = '获取高程失败: ' + status;
        }
        return eleRes;
    });
}

function extent_changed(event) {
    var google_level = map_google.getZoom();
    var google_latlng = map_google.getCenter();
    var center = new Point(google_latlng.lat(), google_latlng.lng());

    map_baidu.centerAndZoom(center.toBaidu(), google_level + 1);
    map_gaode.setZoomAndCenter(google_level, center.toGaode());
    map_qq.zoomTo(google_level); map_qq.setCenter(center.toQQ());

    map_tianditu.centerAndZoom(center.toTianDiTu(), google_level);
    map_sogou.setCenter(center.toSoGou(), google_level);
    map_bing.setView({ center: center.toBing(), zoom: google_level });

    displayLocationElevation(center, google_ele);
    $(".MapCoord").html("google地图<br/>地图级别：" + google_level + "<br/>中心点坐标：<br/>经度：" + center.lng + "<br/>纬度：" + center.lat +
    "<br/>东经：" + coord_convert(center.lng) + "E<br/>北纬：" + coord_convert(center.lat) + "N<br/>");
}

//经纬度 十进制转为度分秒
function coord_convert(x) {
    var xInt = Math.floor(x);//度
    var s1 = x - xInt;//坐标小数部分
    var xMinut = Math.floor(s1 * 60);//分
    var s1Int = Math.floor(s1);
    var s2 = s1 - s1Int;
    var xSecond = (s2 * 60).toFixed(2);  //秒
    return xInt + "°" + xMinut+ "′" +xSecond+ "″";
}

function init_baidu() {
    map_baidu = new BMap.Map("baidu");    // 创建Map实例
    map_baidu.centerAndZoom(new BMap.Point(113.65, 34.76), 11);  // 初始化地图,设置中心点坐标和地图级别
    map_baidu.setCurrentCity("北京");          // 设置地图显示的城市 此项是必须设置的
    map_baidu.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
    map_baidu.addControl(new BMap.MapTypeControl({ anchor: BMAP_ANCHOR_TOP_LEFT }));
}

function init_gaode() {
     map_gaode = new AMap.Map('gaode', {
        resizeEnable: true,
        zoom: 11,
        center: [116.397428, 39.90923]
    });
}

function init_qq() {
    map_qq = new qq.maps.Map(document.getElementById("qq"), {// 地图的中心地理坐标。
    center: new qq.maps.LatLng(39.916527, 116.397128)
});
}


function init_bing() {
      map_bing = new Microsoft.Maps.Map('#bing', {
          credentials: '4LvGfLfFAPIh6UOpzoop~u4K6PYrcVvRdaaqQ11-mYw~AuqQZT9Nu0bW832qNg66FEP4k-Z9gtiVG0iFUXnQWeQe4BoaM01bnn_KMXGUzVke'
    });
}

function init_tianditu() {
    map_tianditu = new T.Map('tianditu');
    map_tianditu.centerAndZoom(new T.LngLat(116.40769, 39.89945), 12);
}

function init_sogou() {
     map_sogou = new sogou.maps.Map(document.getElementById("sogou"), {mapControlType:5});
 }
 
function init_google() {
     map_google = new google.maps.Map(document.getElementById('google'), {
         center: { lat: 34.76, lng: 113.65 },
         zoom: 8
     });
     google_ele= new google.maps.ElevationService;
 }



   


<template>
    <div class="allHeight">
      <div id="allmap" style="width:100%; height:100%;z-index: 10;position: relative;">
        <div>
          <el-checkbox v-model="btn.checkList.checked" @change="changeLayer">备选项</el-checkbox>
        </div>
      </div>
    </div>
</template>

<script>
    import './lib'
    export default {
        name: "mapGL",
        data: () => (
            {
              viewer:'',          //地图对象
              layer:{
                  imgMap:'',      //影像服务图层
                  provider:'',    //地形服务图层
                  wtfs:'',        //地名图层
                  iboMap:'',      //国界图层
              },
              collectionObj:{       //管理集合
                areaLayer:''
              },
              //按钮
              btn:{
                 checkList:{
                     checked:true
                 }
              },
              //绘制
              drawMapAbout:{
                  location:{                      //记录点击位置参数
                      latitude: 0,                //经度
                      longitude: 0,               //纬度
                      height: 0,                  //相机高度
                      endPosition: null,          //上一个结束点
                      cartesian : null            //地图坐标
                  },
                  floatingPointArr:[],               //绘制点合集
                  activePolygon:'',               //当前多边形
                  activeShapePoints:[],           //当前形状点集合
                  shapeBox:''                     //多边形容器
              }
            }
        ),
        methods: {
          initView(){
              var _this = this;
              var token = 'ea2d3f01d758023a742ebaba871d58cb';
// 服务域名
              var tdtUrl = 'https://t{s}.tianditu.gov.cn/';
// 服务负载子域
              var subdomains=['0','1','2','3','4','5','6','7'];
              Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwMzFkZDhjNy03NWZhLTQ3MzctYWU5Yi04MjE1OGUyZDJmN2EiLCJpZCI6Mjc0NzgsInNjb3BlcyI6WyJhc2wiLCJhc3IiLCJhc3ciLCJnYyIsInByIl0sImlhdCI6MTU4OTU0NzQ1OH0.bi3bMrT0P08v7sFji2sENn1tSXtQnsaT5GSG-9USgSI'
// cesium 初始化
              var viewer = new Cesium.Viewer('allmap', {
                  // 需要进行可视化的数据源的集合
                  animation: false, // 是否显示动画控件
                  shouldAnimate: true,
                  homeButton: false, // 是否显示Home按钮
                  fullscreenButton: false, // 是否显示全屏按钮
                  baseLayerPicker: false, // 是否显示图层选择控件
                  geocoder: false, // 是否显示地名查找控件
                  timeline: false, // 是否显示时间线控件
                  sceneModePicker: false, // 是否显示投影方式控件
                  navigationHelpButton: false, // 是否显示帮助信息控件
                  infoBox: false, // 是否显示点击要素之后显示的信息
                  requestRenderMode: true, // 启用请求渲染模式
                  scene3DOnly: false, // 每个几何实例将只能以3D渲染以节省GPU内存
                  sceneMode: 3, // 初始场景模式 1 2D模式 2 2D循环模式 3 3D模式  Cesium.SceneMode
                  fullscreenElement: document.body, // 全屏时渲染的HTML元素 暂时没发现用处
                  // imageryProvider: new Cesium.WebMapTileServiceImageryProvider({
                  //     url: "http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=ea2d3f01d758023a742ebaba871d58cb",
                  //     layer: "tdtBasicLayer",
                  //     style: "default",
                  //     format: "image/jpeg",
                  //     tileMatrixSetID: "GoogleMapsCompatible",
                  //     show: false
                  // })
              })
              viewer.scene.screenSpaceCameraController.zoomEventTypes = [Cesium.CameraEventType.WHEEL, Cesium.CameraEventType.PINCH];
              viewer.scene.screenSpaceCameraController.tiltEventTypes = [Cesium.CameraEventType.PINCH, Cesium.CameraEventType.RIGHT_DRAG];
              // // 去除版权信息
              viewer._cesiumWidget._creditContainer.style.display = 'none'
// 叠加影像服务
              _this.layer.imgMap = new Cesium.UrlTemplateImageryProvider({
                  url: tdtUrl + 'DataServer?T=img_w&x={x}&y={y}&l={z}&tk=' + token,
                  subdomains: subdomains,
                  tilingScheme : new Cesium.WebMercatorTilingScheme(),
                  maximumLevel : 18
              });
              viewer.imageryLayers.addImageryProvider(_this.layer.imgMap);

// 叠加国界服务
              _this.layer.iboMap = new Cesium.UrlTemplateImageryProvider({
                  url: tdtUrl + 'DataServer?T=ibo_w&x={x}&y={y}&l={z}&tk=' + token,
                  subdomains: subdomains,
                  tilingScheme : new Cesium.WebMercatorTilingScheme(),
                  maximumLevel : 10
              });
              viewer.imageryLayers.addImageryProvider(_this.layer.iboMap);


// 叠加地形服务
              var terrainUrls = new Array();

              for (var i = 0; i < subdomains.length; i++){
                  var url = tdtUrl.replace('{s}', subdomains[i]) + 'mapservice/swdx?tk=' + token;
                  terrainUrls.push(url);
              }

              _this.layer.provider = new Cesium.GeoTerrainProvider({
                  urls: terrainUrls
              });

              viewer.terrainProvider = _this.layer.provider;

// 将三维球定位到中国
              viewer.camera.flyTo({
                  destination: Cesium.Cartesian3.fromDegrees(103.84, 31.15, 17850000),
                  orientation: {
                      heading :  Cesium.Math.toRadians(348.4202942851978),
                      pitch : Cesium.Math.toRadians(-89.74026687972041),
                      roll : Cesium.Math.toRadians(0),
                  },
                  complete:function callback() {
                      _this.zooIntarget(107.5686474380106,30.236903580495046,1280000)
                  }
              });
// 叠加三维地名服务
              _this.layer.wtfs = new Cesium.GeoWTFS({
                  viewer,
                  subdomains:subdomains,
                  metadata:{
                      boundBox: {
                          minX: -180,
                          minY: -90,
                          maxX: 180,
                          maxY: 90
                      },
                      minLevel: 1,
                      maxLevel: 20
                  },
                  aotuCollide: true, //是否开启避让
                  collisionPadding: [5, 10, 8, 5], //开启避让时，标注碰撞增加内边距，上、右、下、左
                  serverFirstStyle: true, //服务端样式优先
                  labelGraphics: {
                      font:"28px sans-serif",
                      fontSize: 28,
                      fillColor:Cesium.Color.WHITE,
                      scale: 0.5,
                      outlineColor:Cesium.Color.BLACK,
                      outlineWidth: 5,
                      style:Cesium.LabelStyle.FILL_AND_OUTLINE,
                      showBackground:false,
                      backgroundColor:Cesium.Color.RED,
                      backgroundPadding:new Cesium.Cartesian2(10, 10),
                      horizontalOrigin:Cesium.HorizontalOrigin.MIDDLE,
                      verticalOrigin:Cesium.VerticalOrigin.TOP,
                      eyeOffset:Cesium.Cartesian3.ZERO,
                      pixelOffset:new Cesium.Cartesian2(0, 8)
                  },
                  billboardGraphics: {
                      horizontalOrigin:Cesium.HorizontalOrigin.CENTER,
                      verticalOrigin:Cesium.VerticalOrigin.CENTER,
                      eyeOffset:Cesium.Cartesian3.ZERO,
                      pixelOffset:Cesium.Cartesian2.ZERO,
                      alignedAxis:Cesium.Cartesian3.ZERO,
                      color:Cesium.Color.WHITE,
                      rotation:0,
                      scale:1,
                      width:18,
                      height:18
                  }
              });
              //三维地名服务，使用wtfs服务
              _this.layer.wtfs.getTileUrl = function(){
                  return tdtUrl + 'mapservice/GetTiles?lxys={z},{x},{y}&tk='+ token;
              }

              _this.layer.wtfs.getIcoUrl = function(){
                  return tdtUrl + 'mapservice/GetIcon?id={id}&tk='+ token;
              }
              _this.layer.wtfs.initTDT([{"x":6,"y":1,"level":2,"boundBox":{"minX":90,"minY":0,"maxX":135,"maxY":45}},{"x":7,"y":1,"level":2,"boundBox":{"minX":135,"minY":0,"maxX":180,"maxY":45}},{"x":6,"y":0,"level":2,"boundBox":{"minX":90,"minY":45,"maxX":135,"maxY":90}},{"x":7,"y":0,"level":2,"boundBox":{"minX":135,"minY":45,"maxX":180,"maxY":90}},{"x":5,"y":1,"level":2,"boundBox":{"minX":45,"minY":0,"maxX":90,"maxY":45}},{"x":4,"y":1,"level":2,"boundBox":{"minX":0,"minY":0,"maxX":45,"maxY":45}},{"x":5,"y":0,"level":2,"boundBox":{"minX":45,"minY":45,"maxX":90,"maxY":90}},{"x":4,"y":0,"level":2,"boundBox":{"minX":0,"minY":45,"maxX":45,"maxY":90}},{"x":6,"y":2,"level":2,"boundBox":{"minX":90,"minY":-45,"maxX":135,"maxY":0}},{"x":6,"y":3,"level":2,"boundBox":{"minX":90,"minY":-90,"maxX":135,"maxY":-45}},{"x":7,"y":2,"level":2,"boundBox":{"minX":135,"minY":-45,"maxX":180,"maxY":0}},{"x":5,"y":2,"level":2,"boundBox":{"minX":45,"minY":-45,"maxX":90,"maxY":0}},{"x":4,"y":2,"level":2,"boundBox":{"minX":0,"minY":-45,"maxX":45,"maxY":0}},{"x":3,"y":1,"level":2,"boundBox":{"minX":-45,"minY":0,"maxX":0,"maxY":45}},{"x":3,"y":0,"level":2,"boundBox":{"minX":-45,"minY":45,"maxX":0,"maxY":90}},{"x":2,"y":0,"level":2,"boundBox":{"minX":-90,"minY":45,"maxX":-45,"maxY":90}},{"x":0,"y":1,"level":2,"boundBox":{"minX":-180,"minY":0,"maxX":-135,"maxY":45}},{"x":1,"y":0,"level":2,"boundBox":{"minX":-135,"minY":45,"maxX":-90,"maxY":90}},{"x":0,"y":0,"level":2,"boundBox":{"minX":-180,"minY":45,"maxX":-135,"maxY":90}}]);
              //存储容器对象
              _this.viewer =viewer;
          },
          //添加点击事件
          addEventListen(){
              let _this = this;
              let viewer = _this.viewer;
              let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
              //鼠标单击点击事件
              handler.setInputAction(function(click) {
                  // 处理鼠标按下事件，获取鼠标当前位置
                  var feature = viewer.scene.pick(click.position);
                  var lnglatObj = _this.getLongLan(click.position);
                  //选中某模型
                  if (feature && feature instanceof Cesium.Cesium3DTileFeature) {
                      console.log(feature);
                  }
              }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
          },
          //屏幕XY获取经纬度
          getLongLan(position){
              //屏幕坐标转换为世界坐标
              let _this = this;
              let pick = new  Cesium.Cartesian2(position.x, position.y)
              let cartesian = _this.viewer.scene.globe.pick(_this.viewer.camera.getPickRay(pick), _this.viewer.scene)
              //世界坐标转换为经纬度
              let ellipsoid = _this.viewer.scene.globe.ellipsoid
              if(cartesian === undefined){
                  return '';
              }else{
                  let cartesian3 = new Cesium.Cartesian3(cartesian.x, cartesian.y, cartesian.z)
                  let cartographic = ellipsoid.cartesianToCartographic(cartesian3)
                  let lat = Cesium.Math.toDegrees(cartographic.latitude)   //这是纬度
                  let lng = Cesium.Math.toDegrees(cartographic.longitude)  //这是经度
                  return {
                      lng:lng,
                      lat:lat
                  }
              }
          },
          //镜头切换方法 lng为经度,lat为维度,height为相机高度
          zooIntarget(lng,lat,height){
              // 镜头切换
              this.viewer.camera.flyTo({
                  destination: Cesium.Cartesian3.fromDegrees(lng, lat, height),
                  duration: 1.0
              });
          },
          addLayer(){
              let _this = this;
              var areaLayer = new Cesium.CustomDataSource("areaLayer");    //定义管理集合
              _this.viewer.dataSources.add(areaLayer);
              _this.collectionObj.areaLayer = areaLayer
              var citizensBankPark = new Cesium.Entity( {
                  name : '风机设备',
                  code:"123456789",
                  position : Cesium.Cartesian3.fromDegrees( 107.5686474380106,30.236903580495046),
                  point : { //点
                      pixelSize : 1,
                      color : Cesium.Color.RED,
                      outlineColor : Cesium.Color.WHITE,
                      outlineWidth : 2
                  },
                  label : { //文字标签
                      text : '风机设备',
                      font : '10pt monospace',
                      fillColor:"#000",
                      style : Cesium.LabelStyle.FILL,
                      outlineWidth : 2,
                      verticalOrigin : Cesium.VerticalOrigin.BOTTOM, //垂直方向以底部来计算标签的位置
                      pixelOffset : new Cesium.Cartesian2( 0, -9 )   //偏移量
                  },
                  billboard : { //图标
                      image  : '../images/label/wood.jpg',
                      width : 16,
                      height : 16
                  }
              } );
              _this.collectionObj.areaLayer.entities.add(citizensBankPark);
          },
          changeLayer:function (val) {
              let _this = this;
                if(val){
                    _this.collectionObj.areaLayer.entities.show = true;
                }else {
                    _this.collectionObj.areaLayer.entities.show = false;
                }
            },
            //绘制相关方法
            drawArea(){
                let _this = this;
                let viewer = _this.viewer
                var location = _this.drawMapAbout.location;
                //双击鼠标左键清除默认事件
                viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
                var handler = new Cesium.ScreenSpaceEventHandler(_this.viewer.scene.canvas);
                handler.setInputAction(function(click) {
                    if(Cesium.defined(location.cartesian)){
                        var cartesian = location.cartesian;
                        floatingPointArr.push( _this.createPoint(cartesian))              //绘制点击的点\
                    }
                },Cesium.ScreenSpaceEventType.LEFT_CLICK);
            },
            //画面
            drawPolygon:function(callback){
                var _this = this;
                var PolygonPrimitive = (function () {                                     //创建自执行函数PolygonPrimitive
                    function _(positions) {                                               //传入positions
                        this.options = {
                            name: '多边形',
                            polygon: {
                                hierarchy: [],
                                perPositionHeight: true,
                                material: Cesium.Color.RED.withAlpha(0.4)
                            }
                        };
                        this.hierarchy = positions;
                        this._init();
                    }
                    _.prototype._init = function () {
                        var _self = this;
                        console.log(_self)
                        var _update = function () {
                            return _self.hierarchy;
                        };
                        //实时更新polygon.hierarchy
                        this.options.polygon.hierarchy = new Cesium.CallbackProperty(_update, false);
                        _this.viewer.entities.add(this.options);
                    };
                    return _;
                })();
                var handler = new Cesium.ScreenSpaceEventHandler(_this.viewer.scene.canvas);
                var positions = [];
                var poly = undefined;

                //鼠标单击画点
                handler.setInputAction(function (movement) {
                    var cartesian = _this.viewer.scene.camera.pickEllipsoid(movement.position, _this.viewer.scene.globe.ellipsoid);
                    //双击鼠标左键清除默认事件
                    _this.viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
                    if (positions.length == 0) {
                        positions.push(cartesian.clone());
                    }
                    positions.push(cartesian);
                    //绘制点击点
                    _this.createPoint(cartesian);
                }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
                //鼠标移动
                handler.setInputAction(function (movement) {
                    var cartesian = _this.viewer.scene.camera.pickEllipsoid(movement.endPosition, _this.viewer.scene.globe.ellipsoid);
                    if (positions.length >= 2) {
                        if (!Cesium.defined(poly)) {
                            poly = new PolygonPrimitive(positions);
                        } else {
                            if(cartesian != undefined){
                                positions.pop();
                                cartesian.y += (1 + Math.random());
                                positions.push(cartesian);
                            }
                        }
                    }
                }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
                //鼠标右键单击结束绘制
                handler.setInputAction(function (movement) {
                    //绘制点击点
                    _this.createPoint(movement.position,1);
                    handler.destroy();
                    callback(positions);
                }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
            },
            //实时添加点         参数1为传入的坐标对象 参数2为传入的转换点类型  不传为ws_84 传入1为屏幕坐标
            createPoint(positionData,type){
              var _this = this;
              var positionObj;
              if(type==1){
                  positionObj = _this.getLongLan(positionData);
              }else{
                  positionObj = _this.Cartesian3_to_WGS84(positionData);
              }
              let lat = positionObj.lat;
              let lng = positionObj.lng;
              var point = _this.viewer.entities.add({
                    position: Cesium.Cartesian3.fromDegrees(lng,
                        lat
                    ),
                    point: {
                        color: Cesium.Color.WHITE,
                        pixelSize: 10,
                        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
                    }
                });
                return point;
            },
            //笛卡尔坐标系转WGS84坐标系
            Cartesian3_to_WGS84: function (point) {
                var cartesian33 = new Cesium.Cartesian3(point.x, point.y, point.z);
                var cartographic = Cesium.Cartographic.fromCartesian(cartesian33);
                var lat = Cesium.Math.toDegrees(cartographic.latitude);
                var lng = Cesium.Math.toDegrees(cartographic.longitude);
                var alt = cartographic.height;
                return {lat: lat, lng: lng, alt: alt};
            },
            //WGS84坐标系转笛卡尔坐标系
            WGS84_to_Cartesian3: function (point) {
                var car33 = Cesium.Cartesian3.fromDegrees(point.lng, point.lat, point.alt);
                var x = car33.x;
                var y = car33.y;
                var z = car33.z;
                return {x: x, y: y, z: z};
            }
        },
        mounted() {
            let _this = this;
            //初始化地图控件
            _this.initView();
            //添加事件监听
            //_this.addEventListen()
            //添加图层
            _this.addLayer()
            _this.collectionObj.areaLayer.entities.show = false;
            _this.drawPolygon(function (positions) {
                var wgs84_positions = [];
                for(var i=0; i<positions.length; i++){
                    var wgs84_point = _this.Cartesian3_to_WGS84({
                        x: positions[i].x,
                        y: positions[i].y,
                        z: positions[i].z
                    });
                    wgs84_positions.push(wgs84_point);
                }
            })
        }
    }
</script>
//销毁左键监听
<!--handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);-->
<!--handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);-->
<!--handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);-->
<!--handler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);-->
<style scoped>

</style>

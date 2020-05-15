
<template>
    <div class="allHeight">
      <div id="allmap" style="width:100%; height:100%;"></div>
    </div>
</template>

<script>
    import "@cesium/Widgets/widgets.css"
    export default {
        name: "mapGL",
        data: () => (
            {

            }
        ),
        methods: {

        },
        mounted() {
            var _this = this;
            // 服务域名
            var tdtUrl = 'https://t{s}.tianditu.gov.cn/';
            //申请的秘钥
            var token = 'ea2d3f01d758023a742ebaba871d58cb';
            // 服务负载子域
            var subdomains=['0','1','2','3','4','5','6','7'];
            // // 创建viewer实例
            this.viewer = new Cesium.Viewer('allmap', {
                // 需要进行可视化的数据源的集合
                animation: false, // 是否显示动画控件
                shouldAnimate: true,
                homeButton: false, // 是否显示Home按钮
                fullscreenButton: false, // 是否显示全屏按钮
                baseLayerPicker: true, // 是否显示图层选择控件
                geocoder: false, // 是否显示地名查找控件
                timeline: false, // 是否显示时间线控件
                sceneModePicker: true, // 是否显示投影方式控件
                navigationHelpButton: false, // 是否显示帮助信息控件
                infoBox: false, // 是否显示点击要素之后显示的信息
                requestRenderMode: true, // 启用请求渲染模式
                scene3DOnly: false, // 每个几何实例将只能以3D渲染以节省GPU内存
                sceneMode: 3, // 初始场景模式 1 2D模式 2 2D循环模式 3 3D模式  Cesium.SceneMode
                fullscreenElement: document.body // 全屏时渲染的HTML元素 暂时没发现用处
            })
            var viewer = this.viewer;
            // 去除版权信息
            this.viewer._cesiumWidget._creditContainer.style.display = 'none'
            // Cesium3DTileset用来实现大范围的模型场景数据的加载应用
            // 三维倾斜模型、人工建模、BIM模型等等，都可以转换成3DTiles
            this.tileset = this.viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
                url: '../static/Cesium/Assets/Model/Model.json', // 数据路径
                dynamicScreenSpaceError: true,
                cullWithChildrenBounds: false,
                // 当skipLevelOfDetail为true，是一个常量，用于定义加载切片时要跳过的最小级别数。
                skipLevels: 0,
                maximumScreenSpaceError: 0 // 最大的屏幕空间误差
                // maximumNumberOfLoadedTiles: 1000,  //最大加载瓦片个数
            }))
            // 叠加影像服务
            var imgMap = new Cesium.UrlTemplateImageryProvider({
                url: tdtUrl + 'DataServer?T=img_w&x={x}&y={y}&l={z}&tk=' + token,
                subdomains: subdomains,
                tilingScheme : new Cesium.WebMercatorTilingScheme(),
                maximumLevel : 18
            });
            viewer.imageryLayers.addImageryProvider(imgMap);

            // 叠加国界服务
            var iboMap = new Cesium.UrlTemplateImageryProvider({
                url: tdtUrl + 'DataServer?T=ibo_w&x={x}&y={y}&l={z}&tk=' + token,
                subdomains: subdomains,
                tilingScheme : new Cesium.WebMercatorTilingScheme(),
                maximumLevel : 10
            });
            viewer.imageryLayers.addImageryProvider(iboMap);

            // 叠加地形服务
            var terrainUrls = new Array();

            for (var i = 0; i < subdomains.length; i++){
                var url = tdtUrl.replace('{s}', subdomains[i]) + 'mapservice/swdx?tk=' + token;
                terrainUrls.push(url);
            }

            var provider = new Cesium.GeoTerrainProvider({
                urls: terrainUrls
            });

            viewer.terrainProvider = provider;

            // 将三维球定位到中国
            viewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(103.84, 31.15, 17850000),
                orientation: {
                    heading :  Cesium.Math.toRadians(348.4202942851978),
                    pitch : Cesium.Math.toRadians(-89.74026687972041),
                    roll : Cesium.Math.toRadians(0)
                },
                complete:function callback() {
                    // 定位完成之后的回调函数
                }
            });
            this.viewer.zoomTo(this.tileset)
            // 叠加三维地名服务
            var wtfs = new Cesium.GeoWTFS({
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
            wtfs.getTileUrl = function(){
                return tdtUrl + 'mapservice/GetTiles?lxys={z},{x},{y}&tk='+token;
            }

            wtfs.initTDT([{"x":6,"y":1,"level":2,"boundBox":{"minX":90,"minY":0,"maxX":135,"maxY":45}},{"x":7,"y":1,"level":2,"boundBox":{"minX":135,"minY":0,"maxX":180,"maxY":45}},{"x":6,"y":0,"level":2,"boundBox":{"minX":90,"minY":45,"maxX":135,"maxY":90}},{"x":7,"y":0,"level":2,"boundBox":{"minX":135,"minY":45,"maxX":180,"maxY":90}},{"x":5,"y":1,"level":2,"boundBox":{"minX":45,"minY":0,"maxX":90,"maxY":45}},{"x":4,"y":1,"level":2,"boundBox":{"minX":0,"minY":0,"maxX":45,"maxY":45}},{"x":5,"y":0,"level":2,"boundBox":{"minX":45,"minY":45,"maxX":90,"maxY":90}},{"x":4,"y":0,"level":2,"boundBox":{"minX":0,"minY":45,"maxX":45,"maxY":90}},{"x":6,"y":2,"level":2,"boundBox":{"minX":90,"minY":-45,"maxX":135,"maxY":0}},{"x":6,"y":3,"level":2,"boundBox":{"minX":90,"minY":-90,"maxX":135,"maxY":-45}},{"x":7,"y":2,"level":2,"boundBox":{"minX":135,"minY":-45,"maxX":180,"maxY":0}},{"x":5,"y":2,"level":2,"boundBox":{"minX":45,"minY":-45,"maxX":90,"maxY":0}},{"x":4,"y":2,"level":2,"boundBox":{"minX":0,"minY":-45,"maxX":45,"maxY":0}},{"x":3,"y":1,"level":2,"boundBox":{"minX":-45,"minY":0,"maxX":0,"maxY":45}},{"x":3,"y":0,"level":2,"boundBox":{"minX":-45,"minY":45,"maxX":0,"maxY":90}},{"x":2,"y":0,"level":2,"boundBox":{"minX":-90,"minY":45,"maxX":-45,"maxY":90}},{"x":0,"y":1,"level":2,"boundBox":{"minX":-180,"minY":0,"maxX":-135,"maxY":45}},{"x":1,"y":0,"level":2,"boundBox":{"minX":-135,"minY":45,"maxX":-90,"maxY":90}},{"x":0,"y":0,"level":2,"boundBox":{"minX":-180,"minY":45,"maxX":-135,"maxY":90}}]);
        }
    }
</script>

<style scoped>

</style>


<template>
    <div class="allHeight">
      <div id="allmap" style="width:100%; height:100%;"></div>
    </div>
</template>

<script>
    export default {
        name: "mapGL",
        data: () => (
            {

            }
        ),
        methods: {

        },
        mounted() {
            // GL版命名空间为BMapGL
            // 按住鼠标右键，修改倾斜角和角度
            var map = new BMapGL.Map('allmap')    // 创建Map实例
            map.setMapType(BMAP_EARTH_MAP);   //设置为地球模式
            map.centerAndZoom(new BMapGL.Point(116.280190, 40.049191), 11)  // 初始化地图,设置中心点坐标和地图级别
            map.enableScrollWheelZoom(true)     // 开启鼠标滚轮缩放
            map.setHeading(64.5)
            map.setTilt(73)

            var marker = new BMapGL.Marker(new BMapGL.Point(116.280190, 40.049191)) // 创建点
            map.addOverlay(marker)
        }
    }
</script>

<style scoped>

</style>

<template>
  <div id="mainDiv">
    <div id="cesiumContainer">
      <CesiumViewer v-if="viewer" :viewer="viewer"></CesiumViewer>
    </div>
  </div>
</template>

<script>
    import "cesium/Source/Widgets/widgets.css";

    import CesiumViewer from './mapGln.vue'

    export default {
        name: 'MainViewer',
        components:{CesiumViewer},
        data () {
            return {
                viewer:''
            }
        },
        mounted:function(){
            //创建viewer实例
            Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwMzFkZDhjNy03NWZhLTQ3MzctYWU5Yi04MjE1OGUyZDJmN2EiLCJpZCI6Mjc0NzgsInNjb3BlcyI6WyJhc2wiLCJhc3IiLCJhc3ciLCJnYyIsInByIl0sImlhdCI6MTU4OTU0NzQ1OH0.bi3bMrT0P08v7sFji2sENn1tSXtQnsaT5GSG-9USgSI'
            this.viewer = new Cesium.Viewer('cesiumContainer',{
                animation: false,
                baseLayerPicker: false,
                fullscreenButton: false,
                geocoder: false,
                homeButton: false,
                sceneModePicker: false,
                selectionIndicator: false,
                timeline: false,
                navigationHelpButton: false,
                infoBox: false,
                navigationInstructionsInitiallyVisible: false
            });
            this.viewer._cesiumWidget._creditContainer.style.display = "none";  //去掉logo
        }
    }
</script>


<style scoped>
  #mainDiv{
    width:100%;
    height:100%;
  }
  #cesiumContainer{
    width:100%;
    height:100%;
  }
</style>

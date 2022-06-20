<template>
    <div class="wrapper">
        <app-header></app-header>
        <SideBar></SideBar>
        <div id="BoxName" class="BoxName">
          <!-- <Box v-loading.body.lock="loading" element-loading-text="拼命加载中"> -->
          <router-view></router-view>
          <!-- </Box> -->
          <!--断网提示-->
          <div id="BrokenNetwork" class="BrokenNetwork">
            <img src="../assets/img/BrokenNetwork.png" alt="">
            <button @click="BrokenNetworkReload" class="BrokenNetworkBtn">重新加载</button>
          </div>
        </div>

    </div>
</template>
<script>
    import appHeader from '../components/Header.vue';
    import SideBar from '../components/Side.vue';
    import Box from '../components/Box.vue';
    export default {
        name: 'index',
        components: { appHeader,SideBar,Box },
        data () {
            return {
            }
        },
        created(){
            let _t=this;
            this.$api.post('/bussiness/manage/personData',{
              userId:localStorage.getItem('id')
            },function(res){
              _t.$store.commit("getProject",res.body)
            },function(e){

            });
        },
        methods:{
          BrokenNetworkReload(){
            window.location.reload();
          }
        }
    }
</script>
<style scoped>
    .wrapper{
        height:100%;
        box-sizing:border-box;
        padding-top:55px;
    }
    .BoxName {
      position: relative;
      height: 100%;
      margin-left: 205px;
      background-color: #fff;
    }

    .BrokenNetwork {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      width: 147px;
      height: 140px;
      margin: 0 auto;
      margin-top: 200px;
      z-index: 1001;
      display: none;
      text-align: center;
    }

    .BrokenNetwork img {
      width: 100%;
      height: 84px;
    }

    .BrokenNetwork .BrokenNetworkBtn {
      width: 80px;
      height: 35px;
      border-radius: 5px;
      background-color: #F97B00;
      color: #fff;
      font-size: 14px;
      border: none;
      outline: none;
      margin-top: 20px;
    }
</style>

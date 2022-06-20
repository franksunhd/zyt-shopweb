<template>
  <div class="app-side">
    <el-menu :default-active="current" :router="true" :unique-opened="true" class="el-menu-demo">
      <el-submenu v-for="(item,index) in data" :index="item.id" :key="index">
        <template slot="title"><i class="icon-top"></i><span >{{item.label}}</span></template>
        <template v-for="(i,index2) in item.children" >
          <el-menu-item v-if="(Number(isShowAdminBut)===3200) && (i.label === '账户管理')" :key="index2" :index="i.router"><i class="icon-item"></i>{{i.label}}</el-menu-item>
          <el-menu-item v-if="i.label !== '账户管理'" :key="index2" :index="i.router"><i class="icon-item"></i>{{i.label}}</el-menu-item>
        </template>
      </el-submenu>
    </el-menu>
  </div>
</template>
<script>
  export default {
    name: 'app-side',
    data() {
      return {
        data: [
          {
          id:'1',
          label: '首页',
          children: [{
            id:'1-1',
            label: '首页',
            router:'/manage/home'
          }]
          },
          {
            id:'2',
            label:'工人钱包管理',
            children:[
              {
                id:'2-1',
                label: '工人充值',
                router:'/manage/WorkerRecharge'
              },
              {
                id:'2-2',
                label: '工人退款',
                router:'/manage/WorkerRefund'
              },
              {
                id:'2-3',
                label: '余额查询',
                router:'/manage/Balance'
              },
              {
                id:'2-4',
                label: '交易明细',
                router:'/manage/tradeDetail'
              }
            ]
          }
        ],
        isShowAdminBut:localStorage.getItem('adminStatus'),
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      };
    },
    methods: {

    },
    computed:{
      current(){
        var arr=this.$route.path.split('/');
        if(arr.length>3){
          arr.pop();
          return arr.join("/");
        }else{
          return this.$route.path
        }
      }
    },
    created(){
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  .el-submenu.is-active{
    background:url(../assets/img/sidebac.png) no-repeat;
  }
  .el-submenu.is-active .icon-top{
    background: url(../assets/img/icon1-hover.png)no-repeat center;
  }
  .el-submenu.is-active span{
    color:#fc9b0e !important;
  }
  .app-side{
    width:200px;
    background-color:#282623;
    position:absolute;
    left:0;
    top:53px;
    bottom:0;
    overflow:auto;
    z-index: 2;
  }
  .el-submenu__title{
    font-size:16px;
  }
  .el-menu,
  .el-submenu .el-menu{
    /*background:transparent;*/
    background: #282623;
  }
  .el-menu-item, .el-submenu__title{
    color:#fff;
  }
  .el-submenu__title:hover,.el-submenu__title:active,.el-submenu__title:visited,.el-submenu__title:focus{
    background:url(../assets/img/sidebac.png) no-repeat center;
    color:#fc9b0e;
  }
  .el-submenu .el-menu-item:hover{
    background: url(../assets/img/sidebacer.png) no-repeat center;
    color:#fc9b0e;
  }
  .el-menu--horizontal.el-menu--dark .el-submenu .el-menu-item.is-active, .el-menu-item.is-active{
    /*background: url(../assets/img/sidebacer.png) no-repeat center;*/
    color:#fc9b0e;
  }
  .el-menu--horizontal.el-menu--dark .el-submenu .el-menu-item.is-active i.icon-item, .el-menu-item.is-active i.icon-item{
    background: url(../assets/img/icon2-hover.png)no-repeat center;
  }
  .icon-top{
    display:inline-block;
    vertical-align:middle;
    margin-right:10px;
    margin-top:-1px;
    width:17px;
    height:17px;
    border:none;
    background:url(../assets/img/icon-2.png) no-repeat center;
    -ms-transform:none;
    transform:none;
  }
  .icon-item{
    display:inline-block;
    vertical-align:middle;
    margin-top:-1px;
    margin-right:5px;
    width:10px;
    height:10px;
    /*background:url(../assets/img/icon-3.png) no-repeat center;*/
  }
  .el-submenu__title:hover .icon-top{
    background-image:url(../assets/img/icon1-hover.png);
  }
  /*.icon-item:hover,.icon-item:active{*/
    /*background: url(../assets/img/icon2-hover.png)no-repeat center;*/
  /*}*/
  /*.el-submenu .el-menu-item:hover i.icon-item, .el-submenu__title:hover i.icon-item{*/
    /*background: url(../assets/img/icon2-hover.png)no-repeat center;*/
  /*}*/
  /*定义滚动条宽高及背景，宽高分别对应横竖滚动条的尺寸*/
  .app-side::-webkit-scrollbar{
    width: 6px;
    height: 6px;
    background-color: #f5f5f5;
  }
  /*定义滚动条的轨道，内阴影及圆角*/
  .app-side::-webkit-scrollbar-track{
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
    box-shadow: inset 0 0 6px rgba(0,0,0,.3);
    border-radius: 5px;
    background-color: #f5f5f5;
  }
  /*定义滑块，内阴影及圆角*/
  .app-side::-webkit-scrollbar-thumb{
    /*width: 10px;*/
    height: 20px;
    border-radius: 5px;
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
    box-shadow: inset 0 0 6px rgba(0,0,0,.3);
    background-color: #555;
  }
  .el-submenu .el-menu-item{
    height:50px;
    line-height:50px;
  }
  .el-submenu__title{
    height:50px;
    line-height:50px;
  }
  .el-submenu__icon-arrow{
    display:none;
  }
  .el-icon-arrow-down{
    display:none;
  }
  .el-submenu__icon-arrow{
    width:100%;
    height:100%;
    background: red;
  }
  .activeOpen{
    display: block;
    z-index:9999999;
  }
</style>

<template>
  <div class="header">
    <div class="user">
        <span class="link" style="cursor: default;">
          <img src="../assets/img/ren-4.png" class="avatar">
          <em v-cloak>{{mobile}}</em>
        </span>
        <a href="javascript:;" @click="loginOut()" class="login-out">退出</a>
    </div>
    <img src="../assets/img/logo.png" class="logo">
    <div class="project-name" v-cloak>{{proName}}</div>
    <div class="project-number" v-cloak >({{'M'+proNumber}})&nbsp;商户管理平台</div>
  </div>
</template>

<script>
export default {
  name: 'app-header',
  data () {
    return {
      tokenID:this.getCookie('session'),
      userId:this.getCookie('userId'),
      changeAccount:false,
      changeAccountList:[],
      noAdministrator:false,
      projectNumberShow:false
    }
  },
  methods:{
//    toInfo(){
//      this.$router.push({ path: '/manage/info' });
//    },
    userError(t){
      t.$alert('用户登录超时，请重新登录', '温馨提示', {
        confirmButtonText: '确定',
        type: 'warning',
        callback: action => {
          t.overtime=true;
          t.delCookie('session');
          t.delCookie('userID');
          t.$router.replace({ path: '/login' });
        }
      });
    },
    handleSelect(index){
       window.localStorage.setItem('project',index);
       window.location.reload();
    },
    loginOut(){
      let token=this.getCookie('sh_session');
      let userId=this.getCookie('sh_userId');
      let _t=this;
      this.$confirm('您确定要退出系统吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _t.$api.post('/bussiness/manage/logout',{tokenID:_t.getCookie('sh_session'),userId:_t.getCookie('sh_userId')},function(res){
            _t.delCookie('sh_session');
				    _t.delCookie('sh_userId');
            localStorage.removeItem('userName')
            _t.$router.replace({ path: '/login' });
          },function(e){
            switch (e.errorcode){
              case "TOKEN_NOT_EXIST":
                _t.userError(_t);
                break;
              case "TOKEN_CHANGE":
                    localStorage.removeItem('userName')
                    _t.$router.replace({ path: '/login' });
                break;
              default:
                break;
            }

          });
        }).catch(() => {

        });
    }
  },
  created(){
    let  _t = this;
  },
  computed:{
    proName(){
      return this.$store.state.projectInfo.restaurantName
    },
    proNumber(){
      return this.$store.state.projectInfo.shopno
    },
    mobile(){
      return this.$store.state.projectInfo.userName
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.header{
  height:50px;
  background-color:#fff;
  box-sizing:border-box;
  padding:0 20px;
  line-height:50px;
  position:fixed;
  left:0;
  top:0;
  width:100%;
  z-index:2;
  box-shadow:0 1px 3px #e3e5e6;
  white-space: nowrap;
}
.logo{
  margin:0;
  vertical-align:middle;
  border:none;
}
.theadTitle{
  color:#333;
  font-weight: bold;
}
.project-name{
  font-size:15px;
  color:#333;
  /* font-weight:bold; */
  font-family: "Microsoft YaHei";
  display:inline-block;
  vertical-align:middle;
  margin-left:60px;
  *display:inline;
  *zoom:1;

  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.project-number{
  font-size:15px;
  color:#333;
  display:inline-block;
  vertical-align:middle;
  line-height:50px;
  font-family: "Microsoft YaHei";
  height:50px;
  margin-left:5px;
  *display:inline;
  *zoom:1;
}
.link{
  cursor: pointer;
}
.user{
  float:right;
  font-size:14px;
  color:#333;
}
.avatar{
  vertical-align:middle;
  border:none;
}
.user em{
  font-style:normal;
  margin-left:10px;
}
.login-out{
  color:#333;
  margin-left:20px;
  text-decoration:none;
}
.login-out:hover{
  color:#fd8125;
}
  .el-menu-demo{
    background: none;
    color:red;
    display: inline-block;
  }

.el-menu--horizontal .el-submenu{
  float: none;
}

</style>
<style>
   /*.el-message-box__wrapper .el-message-box__btns button:nth-child(2){*/
    /*margin-right:10px;*/
    /*margin-left:0 ;*/
  /*}*/
 .header .changeAdmin .el-submenu .el-menu--horizontal .el-submenu .el-submenu__title{
    height:50px !important;
    line-height:50px !important;
    border-bottom:0 none;
  }
 /*.header .app-btn-default, .el-button{*/
   /*float: right;*/
 /*}*/
.header .changeAdmin div.el-submenu__title{
   color:#fb8125 !important;
    font-size: 12px;
    font-family: "Microsoft YaHei";
 }
 .header .changeAdmin .el-submenu .el-menu-item:hover, .el-submenu__title:hover,
 .header .changeAdmin .el-submenu .el-menu-item:active, .el-submenu__title:active,
 .header .changeAdmin .el-submenu .el-menu-item:visited, .el-submenu__title:visited,
 .header .changeAdmin .el-submenu .el-menu-item:focus, .el-submenu__title:focus
 {
   background: none !important;
   border-bottom:0 none !important;
 }
 .header .changeAdmin i.el-submenu__icon-arrow{
    background: url(../assets/iarrow.png) no-repeat center;
    display: inline-block;
  }
 .header .changeAdmin .el-icon-caret-bottom:before{
   content:''
 }
 .header .changeAdmin .el-submenu__icon-arrow{width:20px;height:20px;
   display: inline-block;}
 .el-menu--horizontal .el-submenu>.el-menu li{color:#333 !important;font-size: 14px;}
 .el-menu--horizontal .el-submenu>.el-menu li:hover{color:#fb8125 !important;}
 .header .changeAdmin .el-submenu.is-active{background: 0 none;}
 .el-menu--horizontal>.el-menu-item:hover, .el-menu--horizontal>.el-submenu.is-active .el-submenu__title, .el-menu--horizontal>.el-submenu:hover .el-submenu__title{border:0 none;}
 .header .changeAdmin .el-menu--horizontal.el-menu--dark .el-submenu .el-menu-item.is-active, .el-menu-item.is-active{background: 0 none;}
 .header .changeAdmin .el-menu--horizontal .el-submenu>.el-menu li:hover,.header .changeAdmin .el-menu--horizontal .el-submenu>.el-menu li:focus,.header .changeAdmin .el-menu--horizontal .el-submenu>.el-menu li.is-active{
   background: 0 none !important;
   border:0 none !important;
 }
  .header .changeAdmin  .el-menu-item.is-active{background: 0 none !important;}
 .el-menu--horizontal .el-menu-item{border-bottom:0 none !important;}
  /*.header .el-menu{width:380px;}*/
 .header .noAdministrator{
   color:#1E1C1C;
   font-size: 14px;
   line-height:50px;
   display: inline-block;
   vertical-align: middle;
 }
 .header .el-menu--horizontal .el-submenu>.el-menu{top:51px !important;left:-50% !important;max-width: 300px;}
</style>

<template>
  <div id="LoginBox" class="wrap regist_forgetPwd">
    <div class="login-content">
      <div class="login-box">
        <div class="errortips" v-show="resultError">
          <img src="../assets/img/errormag.png" alt=""><span v-text="resulttip"></span>
        </div>
        <div class="errortipsCertification" v-show="resultErrorCertification">
          <img src="../assets/img/errormag.png" alt=""><span v-text="resulttipCertification"></span>
        </div>
        <p><img src="../assets/img/login-logo.png" alt=""></p>
        <p class="welcome">诸英台商户管理平台</p>
        <form autocomplete="off">
          <input style="visibility: hidden;display: none;" type="text" name="user" class="input user" v-model="shopno" >
          <input style="visibility: hidden;display: none;" type="password" name="pwd" class="input pass" v-model="password" >
          <div autocomplete="off" class="input-num" :class="{'error':resultError}" prop="shopno">
            <input autocomplete="off" ref="shopno" class="input user" name="user"
                   v-model='shopno' placeholder="商户号" @focus="focus()" @change="change()" :maxlength="10"   @blur="shopnoBlur()"
            >
            <img v-if='shopno != "" ' class='del' @click='delText(1)' src='../assets/img/del.png' />
          </div>
          <div autocomplete="off" class="input-num inputPsd">
            <input autocomplete="off" ref="password" type="password" name="pwd" class="input pass"   @input="keyPressDown" @keypress="DownPress"
                   v-model='password' placeholder="密码" @change="change()" :maxlength="20" @focus="focus()" @keydown="blur" />
            <img src="../assets/dressDown.png" alt="" class="dressDown" v-if="dressDown">
            <img  v-if='password.length>0' class='del'  @click='delText(2)'  src='../assets/img/del.png' />
          </div>
          <div class="login-btn">
            <button class="login-button" type="submit" @click="loign($event)" ><span>登&nbsp;录</span></button>
          </div>
        </form>
      </div>
    </div>
    <!--断网提示-->
    <div id="BrokenNetwork1">
      <div class="BrokenNetwork">
        <p style="color: #fff;font-size: 14px;">加载失败，请重新加载</p>
        <button @click="BrokenNetworkReload" class="BrokenNetworkBtn">重新加载</button>
      </div>
    </div>
  </div>
</template>
<script>
  import md5 from 'js-md5';
  import { MessageBox } from 'element-ui';
  import ElForm from "../../node_modules/element-ui/packages/form/src/form.vue";
  export default {
    name: 'login',
    components : {
      ElForm,
      md5,MessageBox},
    data () {
      return {
        isLogining:false,
        shopno:'',
        lastshopno:'',
        password:'',
        resultError:false,
        resultErrorCertification:false,
        resulttip:'',
        resulttipCertification:'',
        haha:'',
        errorCount:this.getCookie('error')||0,
        dressDown:false
      }
    },
//    beforeMount(){
//      let _t = this;
//      if(_t.$refs.shopno.value !== '' &&  _t.$refs.password.value!== '')
//        _t.isLogining = false
//
//    },
    created(){
      if(localStorage.getItem('userName') =='' || localStorage.getItem('userName') == undefined  ||
        window.sessionStorage.getItem('is-login-now') == undefined || window.sessionStorage.getItem('is-login-now') == null){
        this.shopno = ''
      }else{
        this.shopno = localStorage.getItem('userName')
      }



    },

    mounted(){
      let _t = this;
      if(this.shopno <=4 || this.password <=4){
        document.querySelector('.input-num').style.marginBottom= '30px'
      }
    },
    methods:{
      BrokenNetworkReload(){
        window.location.reload();
      },
      keyPressDown(e){
        if(!e.target.value){
          this.dressDown = false
        }
      },
      DownPress(e){
        var e = event||window.event;var o = e.target||e.srcElement;var keyCode  =  e.keyCode||e.which;var isShift  =  e.shiftKey ||(keyCode  ==   16 ) || false ;
        if (((keyCode >=   65   &&  keyCode  <=   90)  &&   !isShift) || ((keyCode >=   97   &&  keyCode  <=   122 )  &&  isShift)){
          this.dressDown = true;
        }else{
          this.dressDown = false;
        }
      },
      focus(){
        this.resultError=false;
        this.resultErrorCertification = false;
//        if(this.shopno === '' || this.password === ''){
//          this.isLogining = true
//        }
        document.querySelector('.input-num').style.marginBottom= '30px'
      },
      blur(){
//        if(this.shopno !=='' && this.password !== ''){
//          this.isLogining = false
//        }
//        if(this.shopno <=4 || this.password <=4){
//          this.isLogining = true
//        }
      },
      change(){
        if(this.shopno <=4 || this.password <=4){
//          this.isLogining = true
          document.querySelector('.input-num').style.marginBottom= '30px'
        }
      },
      delText(type){
        if(type==1){
          this.shopno='';
        }else{
          this.password='';
        }
        this.dressDown = false
      },
      loign(event){
        event.preventDefault();
        if(this.lastshopno!==''&&this.lastshopno!==this.shopno){
          this.resulttip='请输入商户号或密码';
          this.errorCount=0;
          this.resultError=false;
          this.resultErrorCertification = false
//          this.isLogining=true;
        }
        if(this.errorCount>=5){
          this.resulttip='密码输入错误超过5次，账户被锁定';
          this.resultError=true;
          this.resultErrorCertification = false
          this.lastshopno=this.shopno;
          return;
        }
        if(this.shopno!==''&&this.password!==''){
          this.resultError=false;
          this.resultErrorCertification = false
          this.toLogin();
        }else{
          this.resulttip='请输入商户号或密码';
          this.resultError=true;
          this.resultErrorCertification = false
//          this.isLogining=true;
        }
      },
      shopnoBlur(){
        if(this.shopno.length<7 && this.shopno.length>=1){
          this.resultError = true;
          this.resultErrorCertification = false
          this.resulttip='商户号输入错误，请重新输入';
        }
      },
      toLogin(){
//        this.isLogining=true;
        let u=this.shopno;
        let p= md5( this.password ).toUpperCase();
        let _t=this;
        document.querySelector('.input-num').style.marginBottom= '30px'
        document.querySelector('.errortipsCertification').style.top = '180px'
        this.$api.post('/bussiness/manage/login',{
          shopno:u,
          password:p
        },function(res){
          _t.setCookie('mobile',res.body.mobile,1);
          _t.setCookie('id',res.body.id,1);
          localStorage.setItem('mobile',res.body.mobile)
          localStorage.setItem('id',res.body.id)
          window.sessionStorage.setItem('is-login-now','1')
          if(sessionStorage.getItem('is-login-now')){
            localStorage.setItem("userName",_t.shopno)
          }else{
            localStorage.removeItem('userName')
          }
          _t.$router.replace({ path: '/chatMessage' });
        },function(e){
//          _t.isLogining=true;
          switch(e.errorcode){
            case "USER_NOT_EXIST":
              _t.resulttip='用户不存在';
              _t.resultError=true;
              _t.resultErrorCertification = false
              _t.shopno='';
              _t.password='';
              break;
            case "PASSWORD_ERROR":
              _t.errorCount=parseInt(e.body.num);
              _t.setCookie('error',e.body.num,1);
              _t.resulttip='密码不正确，请重新输入';
              _t.resultError=true;
              _t.resultErrorCertification = false
              _t.password='';
              if(_t.errorCount >= 3){
                _t.resulttip = `您的账号已经输错${_t.errorCount}次，5次错误将被锁定`;
              }
              break;
            case "PASSWORD_ERROR_LOCK":
              _t.resulttip='密码输入错误超过5次，账户被锁定';
              _t.resultError=true;
              _t.resultErrorCertification = false
              _t.shopno='';
              _t.password='';
              break;
            case "NOT_CERTIFICATION":
              localStorage.setItem('shopno',_t.shopno)
              _t.resulttipCertification='您尚未进行实名认证，请先在APP端完成实名认证';
              _t.resultErrorCertification=true;
              document.querySelector('.input-num').style.marginBottom= '46px'
              document.querySelector('.errortipsCertification').style.top = '184px'
              break;
            case "SEND_CODE_ERROR":
              _t.resulttip='发送验证码失败';
              _t.resultError=true;
              _t.resultErrorCertification = false
              _t.shopno='';
              _t.password='';
            default:
              _t.resulttip='密码不正确，请重新输入';
              _t.resultError=true;
              _t.resultErrorCertification = false
              _t.password='';
              break;
              if(e.body.num == 3){
                _t.resulttip = '已经输错3次，5次将被锁定'
                _t.resultError=true;
                _t.resultErrorCertification = false

              }
          }
        })
      },
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .regist_link{
    color:#fff;
    font-size: 14px;
  }
  .w1180{
    min-width: 0;
  }

  #LoginBox {
    position: relative;
  }

  #BrokenNetwork1 {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 11;
    background-color: rgba(0,0,0,0.8);
    display: none;
  }


  .BrokenNetwork {
    width: 147px;
    height: 140px;
    margin: 0 auto;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
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
    background-color: #fb8125;
    color: #fff;
    font-size: 14px;
    border: none;
    outline: none;
    margin-top: 20px;
  }

  .login-box form{
    padding:0 8px;
  }
  .com-header{
    position: fixed;
    width: 100%;
    left: 0;
    top: 0;
  }

  .login-content{
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: url(../assets/img/login-bg.jpg) no-repeat center center;
    background-size: cover;
    padding-top: 40px;
  }
  .login-box{
    width: 350px;
    background: #fff;
    border-radius: 3px;
    height: 374px;
    text-align: center;
    padding: 32px 25px 50px;
    position:fixed;
    left:50%;
    top:50%;
    margin-left:-175px;
    margin-top:-180px;
    background: url(../assets/img/login-cont.png) no-repeat center center;
  }
  .login-t{
    font-size: 22px;
    color: #3e4956;
    line-height: 1;
  }
  .login-box p.welcome{
    color: #333;
    font-size: 16px;
    text-align:center;
    margin:13px 0 37px;
  }
  .input-num{
    width: 100%;
    position: relative;
    margin-bottom: 30px;
    text-align: left;
  }
  .input-num4{
    margin-bottom:40px;
  }
  .del{
    position:absolute;
    right:12px;
    top:11px;
    cursor:pointer;
    z-index:10;
  }
  .input-num.login-margin{
    margin-bottom: 20px;
  }

  .input-num input{
    width: 100%;
    border: 1px solid #837b75;
    height: 40px;
    box-sizing: border-box;
    position: relative;
    z-index: 4;
    font-size: 14px;
    padding:8px 0 8px 44px;
    color:#333;
  }
  .input-num .user{
    background:url('../assets/img/user.png') no-repeat 12px 10px transparent;
  }
  .input-num .pass{
    background:url('../assets/img/password.png') no-repeat 12px 10px transparent;
  }
  .input-num input::-webkit-input-placeholder {
    color:#999;
  }
  .input-num input:-moz-placeholder {
    color:#fff;
  }
  .login-btn{
    margin-top:30px;
  }
  .input-num input:focus{
    border:1px solid #f90;
  }
  .login-button[disabled]{
    background: #B8B7B7;
    opacity: 1 !important;
    color:#DCDCDC;
  }
  .input-num .el-input .el-input__inner:hover{
    border:1px solid #f90;
  }
  .input-num.error .input{
    border: 1px solid #f00;
  }

  .input-num.show .input{
    border: 1px solid #f00;
  }
  .errortips{
    color: #ff5c5c;
    width: 100%;
    text-align: left;
    padding-left: 38px;
    position: absolute;
    top: 180px;
    left: 11%;
    font-size: 13px;
  }
  .errortips img{
    margin-right:6px;
  }
  .errortips span{
    vertical-align: middle;
    color:#E31414;
  }
  .errortipsCertification{
    color: #ff5c5c;
    width: 80%;
    text-align: left;
    padding-left: 9px;
    position: absolute;
    top: 180px;
    left: 11%;
    font-size: 13px;
    line-height:18px;
  }
  .errortipsCertification img{
    margin-right:6px;
    float: left;
    margin-top:3px;
  }
  .errortipsCertification span{
    vertical-align: middle;
    color:#E31414;
    display: inline-block;
    float: left;
    width:92%;
  }
  .show{
    display: block;
  }

  .login-button{
    display:block;
    width: 100%;
    height: 40px;
    line-height: 40px;
    box-sizing: border-box;
    background: #ff9000;
    border: none;
    outline: none;
    padding: 0;
    border-radius:5px;
    color: #fff;
    font-size: 16px;
    margin-bottom:15px;
  }
  .login-button[disabled]{
    pointer-events:none;
    opacity:0.3;
  }
  .login-button:hover{
    background: #feb454;
  }
  .login-button:active{
    background: #f67a00;
  }
  /*log-on*/
  .log-on{
    text-align: right;
    font-family: "Microsoft YaHei";
  }
  .log-on span{
    color:#fff;
    font-size:14px;
    cursor: pointer;
  }
  .log-on span:nth-child(2){
    padding:0 2px;
  }
</style>
<style>
  .regist_forgetPwd .xixi{
    margin-bottom:40px;
  }
  /*.regist_forgetPwd .input-num .user{border:1px solid #837b75;}*/
  /*.regist_forgetPwd .user .el-input__inner{border:0 none !important;}*/
  .regist_forgetPwd .login-on{
    text-align: right;
  }



  .regist_forgetPwd .login-on span{
    color:#fff;
    font-size: 14px;
    cursor: pointer;
    border-right:1px solid #fff;
    padding:0 8px 0 5px;
  }
  .regist_forgetPwd .login-on span:last-child{
    border:0 none;
  }
  .regist_forgetPwd .user .el-input__inner{
    background-color: inherit;
    border: 1px solid #837b75;
    height: 40px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    position: relative;
    z-index: 4;
    font-size: 14px;
    padding: 8px 0 8px 44px;
    color:#333;
    border-radius: 0 !important;
  }
  .regist_forgetPwd .user .el-input__inner:focus{
    border:1px solid  #feb454;
  }
  .regist_forgetPwd .user .el-input__inner::-webkit-input-placeholder{color:#999 !important;font-size: 14px;}
  .dressDown{
    position:absolute;
    right:13%;
    top:33%;
    cursor:pointer;
    z-index:10;
  }
</style>


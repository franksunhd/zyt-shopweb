<template>
  <div id="homeCenter" class='homeCenter safeSuggestBox'>
    <div class='homeMagin'>
      <div class="safeSuggest">
        <p>为了您的资金安全，请输入短信验证码进行验证：</p>
      </div>
      <div class="wrap">
        <el-form :model="safeSuggest"  :rules="rules" ref="safeSuggest"  class="ruleForm2">
          <el-form-item label="短信验证码已发送至手机  ： "  class="sendMessageItem">
            <span class="mobile">{{safeSuggest.mobile|formatPhone}}</span>
          </el-form-item>
          <el-form-item label="短信验证码" prop="identifyCode" class="p_security_code">
            <el-input v-model="safeSuggest.identifyCode" placeholder="请输入短信验证码" :maxlength="4"   autofocus="autofocus"
                      @keydown.native="keydowm" @focus="focus()" @input="change()" @keypress.native="keypress($event)" ></el-input>
            <el-button @click="sendMessage" :disabled="disabled" style="margin-left: 10px;" type="primary" class="btnTexta">{{btnText}}</el-button>
          </el-form-item>
          <span class="messageError" v-show="messageError">短信验证码错误</span>
          <span class="messageInvalid" v-show="messageInvalid">短信验证码无效</span>
          <el-form-item class="comInHomeMain">
            <el-button type="primary" @click="submitForm('safeSuggest')" class="handleSure" :disabled="comeInHome">进入首页</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!--断网提示-->
    <div id="BrokenNetwork1">
      <div class="BrokenNetwork">
        <img src="../../assets/img/BrokenNetwork.png" alt="">
        <button @click="BrokenNetworkReload" class="BrokenNetworkBtn">重新加载</button>
      </div>
    </div>
  </div>
</template>
<script>
  import md5 from 'js-md5';
  import Box from '../../components/Box';
  export default {
    name: 'chatMessage',
    components: {md5,Box },
    props: {
      interval:{
        type:Number,
        default:60
      }
    },
    data () {
      let checkidentifyCode = (rule,value,callback) => {
        if(value){
          if(!Number(value)){
            return callback(new Error('验证码必须为数字'))
          }else{
            callback()
          }
        }else{
          callback()
        }
      }
      return{
        safeSuggest: {
          mobile: '',
          identifyCode:''
        },
        disabled:false,
        Verification:'',
        comeInHome:true,
        timer:null,
        counter: this.interval,
        messageError:false,
        messageInvalid:false,
//        userId:this.getCookie('userId'),
//        tokenID:this.getCookie('session'),
        rules:{
          identifyCode:[
            {required:true,message:'请输入短信验证码',trigger:'change'},
            {validator:checkidentifyCode,message:'',trigger:'blur'}
          ]
        }
      }
    },
    mounted(){
    },

    methods:{
      BrokenNetworkReload(){
        window.location.reload();
      },
      userError(t) {
        t.$alert('用户登录超时，请重新登录', '提示', {
          confirmButtonText: '确定',
          type: 'warning',
          callback: action => {
            t.delCookie('session');
            t.delCookie('userID');
            t.$router.replace({path: '/login'});
          }
        });
      },

      keydowm(){
        if(this.safeSuggest.identifyCode !== ''){
          this.comeInHome = false
        }
        if(this.safeSuggest.identifyCode <= 4){
          this.comeInHome = true
        }

      },
      change(){
        if(this.safeSuggest.identifyCode != '')
        {
          this.comeInHome = false
        }else{
          this.comeInHome = true
        }
      },
      focus(){
        this.messageError = false
        this.messageInvalid = false
        if(this.safeSuggest.identifyCode !== ''){
          document.querySelector('.safeSuggestBox .p_security_code .el-input input.el-input__inner').style.border='1px solid #333'
        }
      },
      keypress(ev){
        let e = ev || window.event;
        let charCode = ev.keyCode;
        if(!/\d/.test(String.fromCharCode(charCode)) && charCode > 8){
          e.preventDefault(ev);
        }

      },
//      beforeCreate(){
//        this.$store.commit("setLoading",true)
//      },
      sendMessage(){
          let _t = this;
          _t.$api.post('/bussiness/manage/sendLoginCode',{
            id:sessionStorage.getItem('id')
          },function(res){
            _t.disabled = true
            _t.timer = setInterval( () => {
              _t.counter--;
            },1000)
          },function(e){

          })
      },
      submitForm(formName) {
        let  _t = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            _t.disabled = true
            _t.$api.post('/bussiness/manage/valLoginCode',{
              'mobile':_t.safeSuggest.mobile,
              'code':_t.safeSuggest.identifyCode,
              id: localStorage.getItem('id')
            },function(res){
              _t.timer = setInterval( () => {
                _t.counter--;
              },1000)
              _t.setCookie('sh_session',res.body.tokenID)
              _t.setCookie('sh_userId',res.body.userId)
              _t.$router.push({name:'home'})
            },function(e){
              switch (e.errorcode){
                case 'SEND_CODE_INVALID ':
                  _t.messageInvalid = true
                  break;
                case 'CODE_ERROR':
                 _t.messageError = true
                  break;
                case "TOKEN_NOT_EXIST":
                  _t.userError(_t);
                  break;
                case "TOKEN_CHANGE":
                  _t.$alert('您的账号已在其他设备登录','温馨提示',{
                    confirmButtonText: '确定',
                    type: 'warning',
                    callback:action => {
                      localStorage.getItem('userName')
                      _t.$router.replace({ path: '/login' });
                    }
                  })
                  break;
                default:
                  break;
              }
            })
          } else {
            return false;
          }
        });
      },

    },
    created(){
      if( !window.sessionStorage.getItem('is-login-now')){
        return this.$router.replace({path: '/login'});
      }
      if(this.$route.params.mobile){

        this.safeSuggest.mobile = this.$route.params.mobile
      }else{
        this.safeSuggest.mobile =localStorage.getItem('mobile')
      }
      this.$watch('safeSuggest.identifyCode', function (newVal, oldVal) {
        this.$nextTick( () => {
          this.safeSuggest.identifyCode = this.safeSuggest.identifyCode.replace(/[^\d|\.]/g,'')
        })
      })


      this.disabled = true
      this.timer = setInterval( () => {
        this.counter--;
      },1000)


    },
    computed: {
      btnText(){
        if(!this.disabled){
          return '重新获取';
        }
        return this.counter + 's'
      }
    },
    watch: {
      counter(val) {
        if (val == 0) {
          clearInterval(this.timer);
          this.disabled = false;
          this.counter = this.interval;
        }
      }
    },
    filters:{
      formatPhone(phone){
        let a = /(\d{3})\d{4}(\d{4})/;
        let str = String(phone);
        return str.replace(a,'$1****$2')
      }
    }
  }
</script>
<style scoped>
  .safeSuggest{margin:7px 0 7px;}
  .safeSuggest p{color:#333;font-size: 14px;}
  .ruleForm2{position: relative;}
  .homeCenter {
    height: 100%;
    overflow: auto;
    background: #fff;
  }
  .homeMagin {
    background-color: #fff;
    padding-bottom:150px;
    width:430px;
    margin:45px auto;
  }
  #homeCenter {
    position: relative;
  }

  #BrokenNetwork1 {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 11;
    background-color: rgba(0,0,0,0.5);
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

  span.fresh-btn{
    color:#35b1f1;
    font-size: 14px;
    font-family:"Microsoft YaHei";
    cursor: default;
  }
</style>
<style>
  .safeSuggestBox .el-input__inner:focus{
    border:1px solid #FF9000;
  }
  .safeSuggestBox input::-webkit-input-placeholder {
    color:#999;
    font-size: 14px;
  }
  /*.safeSuggestBox .p_security_code button.btnTexta,.comInHomeMain button.handleSure{*/
    /*float: none !important;*/
  /*}*/
  .safeSuggestBox .btnTexta{
    padding:0;
    width:80px;
    text-align: center;
  }
  .safeSuggestBox .el-button.is-disabled, .el-button.is-disabled:focus, .el-button.is-disabled:hover{
    color: #333 !important;
    font-size: 14px;
    background: #eee;
    border: 1px solid #eee;
  }
  .safeSuggestBox .el-form-item__error{left:23.5%;}
  .safeSuggestBox .el-input__inner{border-color:#D6D6D6;}
  .safeSuggestBox .el-tabs__item.is-active{
    background: #FDA322;
    color:#fff;
    border:1px solid  #FDA322;
  }
  .safeSuggestBox .mobile{
    color:#333;
    font-size: 14px;
    font-weight: bold;
  }
  .safeSuggestBox div.el-tabs__active-bar{
    background: none;
  }
  .safeSuggestBox div.el-tabs__item{
    width:260px !important;
    text-align: center;
    border:1px solid #ADADAD;
    color:#333;
    font-family: "Microsoft YaHei";
    font-size: 14px;
  }
  .safeSuggestBox div.el-tabs__item:first-child{
    border-right:0 none;
  }

  .safeSuggestBox .el-tabs__header{
    border:0 none;
  }
  .safeSuggestBox .labelfade{
    width:300px;
  }


  .safeSuggestBox .wrapper{
    padding-top:0!important;
  }
  .safeSuggestBox .zyt-manageInformation{
    border-left:3px solid #FDA322;
    padding-left:8px;
    margin-top:28px;
    font-size: 14px;
    color:#121212;
    font-weight: 500;
  }
  .safeSuggestBox .ruleForm{
    width:420px;
    margin:0 auto;
  }
  .safeSuggestBox .verify-code{
    width:50px;
    height:50px;
    display: inline-block;
    float: right;
  }
  .safeSuggestBox .verify-code img{width:100%;height:100%;display: inline-block;}
  .safeSuggestBox .verifyInput{
    width:150px;
  }

  .safeSuggestBox .z_verificationInput{
    width:230px;
  }


  /*默认文字样式*/
  .safeSuggestBox .el-input__inner{
    color:#333;
    font-size: 14px;
  }

  /*输入完后的监测*/
  [class*=" el-icon-"], [class^=el-icon-]{
    font-size: 0;
  }
  .safeSuggestBox .el-input input{
    width:230px !important;
  }
  .safeSuggestBox .verificationCode  input{width:150px !important;}
  .safeSuggestBox .p_security_code  .el-input input.el-input__inner{width:150px !important;}
  .safeSuggestBox .p_security_code  .el-button{border-radius: 0 !important;}
  .safeSuggestBox .verificationCode div div.el-input{width:150px !important;}
  .safeSuggestBox .p_security_code div.el-form-item__content div.el-input{width:150px !important;}
  img.image-code{width:70px;height:35px;}
  .safeSuggestBox .el-form-item__content{line-height:39px;padding-left:21%;}
  .safeSuggestBox .el-tab-pane{width:520px;margin:0 auto;}
  .safeSuggestBox .freshBtn{font-size: 13px;font-family: "Microsoft YaHei";color:#35b1f1;}
  .safeSuggestBox .verificationCode  .el-form-item__content span{padding-left:8px;}
  .safeSuggestBox .handleSure{width:auto;height:35px;margin-top:10px;padding:10px 21px !important;}
  .el-tabs__content{overflow: visible !important;}
  .safeSuggestBox .verificationCode div.el-form-item__content span.imagefreshBtn{vertical-align: middle;}
  .safeSuggestBox .el-form-item__label{padding:13px 0 13px 0;color:#333;font-size: 14px;}
  .safeSuggestBox .comInHomeMain{
    margin-top:5px;
  }
  .safeSuggestBox .comInHomeMain .is-disabled,
  .changemobile .comInHomeMain .is-disabled:hover{
    color:#DCDCDC !important;
    font-size: 14px;
    background: #b8b7b7;
    border:1px solid #b8b7b7;
  }
  /*新项目入驻*/
  /*项目信息*/
  .New_project_information,.New_project_personal{overflow: hidden;width:800px;height:auto;}
  .New_project_information li,.New_project_personal li{
    float: left;width:100%;}
  .New_project_information li span,.New_project_personal li>span {font-size: 14px;color:#121212;font-family: "Microsoft YaHei";
    font-weight: bold;display: inline-block;border-left:3px solid #FF9000;padding-left:8px;}
  ul li.line{font-size: 14px;font-weight: bold;color:#FF9000;margin-right:10px;}
  .safeSuggestBox .proviceInput .el-form-item__content input.el-input__inner{width:100px !important;}
  .safeSuggestBox #Detailed_address,.safeSuggestBox #Detailed_address input{width:200px !important;}
  .safeSuggestBox .Segmentingline{border:1px solid #eee;margin-bottom:20px;}
  .safeSuggestBox .New_project_personal .imagefreshBtn,.safeSuggestBox .New_project_personal .freshBtn{border:0 none;}
  .safeSuggestBox .el-form-item{margin-bottom:18px !important;}
  .safeSuggestBox .verificationCode .el-form-item__content span.imagefreshBtn{height:35px;display: inline-block;}
  .safeSuggestBox .activeName1{margin-left:60px;}
  .safeSuggestBox .activeName2{margin-left:60px;}

  .safeSuggestBox  ul li{
    float:left;
    font-size:16px;
    color:#666;
    line-height:20px;
    margin-right:5px;
  }
  .safeSuggestBox  ul li img{margin:0 15px;}
  .safeSuggestBox ul li{
    font-family: "Microsoft YaHei";
    font-size: 14px;
    color:#666;
  }
  .safeSuggestBox ul li span{
    font-size: 14px;
    text-align: center;
    vertical-align: middle;
    margin-right: 8px;
    line-height: 12px;
  }
  .safeSuggestBox ul li:nth-child(2){font-weight: bold;}
  .safeSuggestBox .sendMessage{padding:10px 6px;}
  .safeSuggestBox .containerHead,.safeSuggestBox .containerHead ul{overflow: hidden;}
  .safeSuggestBox .sendMessageItem{margin-bottom:2px !important;}
  .safeSuggestBox .messageError,.safeSuggestBox .messageInvalid{
    color: #ff4949;
    font-size: 12px;
    line-height: 1;
    padding-top: 4px;
    position: absolute;
    bottom: 50px;
    left: 24%;
    transition: all 3s;-moz-transition: all 3s;-webkit-transition: all 3s;-ms-transition:all 3s;
  }
</style>

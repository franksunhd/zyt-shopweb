<template>
  <Box>
    <div id="homeCenter2" class='homeCenter workerRefund'>
      <div class='homeMagin'>
          <div class="wrap" >
            <el-form :model="workerRefund"  :rules="rules" ref="workerRefund" class="ruleForm2">
              <div class="Container">
                <el-form-item label="手环编号" prop="mobile">
                  <el-input v-model="workerRefund.mobile" placeholder="" :maxlength="12"@change="valueChange" autofocus="autofocus" @keypress.native="keypress($event)" @focus="focus()"></el-input>
                  <el-button type="primary" @click="submitForm('workerRefund')" class="search handleSearch">查询</el-button>
                </el-form-item>
                <span v-show="checkUp" class="checkUp">请检查输入的手环编号</span>
                <span v-show="isLocking" class="isLocking">该手环已锁定</span>
                <span v-show="isWidthdraw" class="isWidthdraw">该手环已注销</span>
                <span v-show="notActive" class="notActive">该手环尚未激活，请激活后再进行退款</span>
                <span v-show="isLoss" class="isLoss">该手环已挂失</span>
              </div>
              <div class="rechargebg">
                <img src="../../assets/rechargebg.png" alt="">
                <div class="defaultContainer">
                  <div class="defaultImg">
                    <img src="../../assets/defaultImg.png" alt="" v-show="defaultShow" style="border:1px solid transparent;">
                    <img v-bind:src="imgUrl+workerRefund.phone"  alt=""  v-show="loadingShow" class="loadingShow">
                    <div class="defaultData">
                      <p>姓　　名：<span>{{workerRefund.name?workerRefund.name:'-- --'}}</span></p>
                      <p>手环编号：<span>{{workerRefund.jobno?workerRefund.jobno:'-- --'}}</span></p>
                      <p>钱包余额：<span>{{(typeof  workerRefund.balance === 'number'||workerRefund.balance)?workerRefund.balance:'-- --'}}</span></p>
                    </div>
                  </div>
                  <div class="loading"><img src="../../assets/loading.gif" alt="" v-if="loading"></div>
                </div>
              </div>
              <div class="DataList" v-if="fadeIn" >
                <el-form-item label="退款金额" prop="money">
                  <el-input v-model="workerRefund.money" placeholder=""  @blur="checkIsNumber(workerRefund.money,'0')" class="signOutInput" @change="valueChange" autofocus="autofocus" @focus="focus()" ></el-input>
                  <el-button type="primary" @click="AllRefund()" class="handleSure allsignOut handleSearch">全部退理</el-button>
                </el-form-item>
                <span v-show="moneyisRight" class="moneyisRight">金额输入不正确，请重新输入</span>
                <span v-show="RechargeLimit" class="RechargeLimit">余额不足</span>
                <span v-show="compare" class="compare">退款余额超过钱包余额</span>
                <span v-show="NotZero" class="NotZero">退款金额不能为0</span>
                <span v-show="negative" class="negative">退款金额不能为负</span>
                <el-form-item>
                  <el-button type="primary" @click="Refund('workerRefund')" class="refund">退款</el-button>
                </el-form-item>
              </div>
            </el-form>
          </div>
        </div>
      </div>
  </Box>
</template>
<script>
  import md5 from 'js-md5';
  import appHeader from '../../components/Header.vue';
  import SideBar from '../../components/Side.vue';
  import Box from '../../components/Box';
  export default {
    name: 'WorkerRefund',
    components: {appHeader,SideBar,md5,Box },
    data () {
      return{
        imgUrl:this.$config.config_img_server(),
        workerRefund: {
          mobile: '',
          name:'',
          jobno:'',
          id:'',
          phone:'',
          money:'',
          balance:'',
          worker:''
        },
        checkUp:false,
        isLocking:false,
        num:0,
        isWidthdraw:false,
        notActive:false,
        isLoss:false,

        disabled:false,
        Verification:'',
        loading:false,
        fadeIn:false,
        defaultShow:true,
        loadingShow:false,
        moneyisRight:false,
        RechargeLimit:false,
        compare:false,
        NotZero:false,
        negative:false,
        userId:this.getCookie('sh_userId'),
        tokenID:this.getCookie('sh_session'),
        rules:{
          mobile:[
            {required:true,message:'请输入手环编号',trigger:'change'}
          ],
          money:[
            {required:true,message:'请输入退款金额',trigger:'change'}
          ]
        }
      }
    },
    mounted(){
      document.getElementById('BrokenNetwork').style.display = 'none';
    },

    methods:{
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
      focus(){
        this.moneyisRight = false
        this.checkUp = false,
        this.isLocking = false,
        this.isWidthdraw = false,
        this.notActive = false,
        this.isLoss = false,
        this.RechargeLimit = false,
        this.compare = false,
        this.NotZero = false,
        this.negative = false
      },
      checkIsNumber(val){
          let _t = this;
          if(_t.workerRefund.money === ''){

          }else{
            if(_t.isNumber(val) && _t.workerRefund.money !== ''){
              _t.workerRefund.money = _t.workerRefund.money
            }else{
              _t.moneyisRight = true
              document.querySelector('.el-form-item__error').innerHTML=''
            }
          }
      },
      isNumber(val){
        let  reg = new RegExp('^[0-9]+.?[0-9]*$')
        return reg.test(val)
      },
      AllRefund(){
        let  _t = this;
        if(_t.workerRefund.money === '') {
          _t.workerRefund.money = _t.workerRefund.balance
        }
      },
      Refund(formName){
          let  _t = this;
          if(_t.workerRefund.money > _t.workerRefund.balance){
              _t.compare = true
          } else if
          (_t.workerRefund.money === '0' || _t.workerRefund.money === 0 || _t.workerRefund.money === '0.0' || _t.workerRefund.money === 0.0
            || _t.workerRefund.money === '0.00' || _t.workerRefund.money === 0.00
          ){
              _t.NotZero = true
          }else{
            const moneySure = (_t.workerRefund.money).replace(/\b(0+)/gi,'')
            _t.$refs[formName].validate((valid) => {
              if (valid) {
                this.$confirm('本次退款金额为'+moneySure+'，请再次确认', '温馨提示',{
                  confirmButtonText: '确定',
                  type: 'warning',
                }).then( () => {
                  _t.$api.post('/bussiness/manage/workerRefund',{
                    userId:_t.userId,
                    tokenID:_t.tokenID,
                    worker:_t.workerRefund.worker,
                    money:_t.workerRefund.money
                  },function(res){
                    _t.$alert('退款成功，退款金额为'+moneySure+'元','温馨提示',{
                      confirmButtonText: '确定',
                      type: 'warning',
                      callback:action => {
                        window.location.reload()
                      }
                    })
                  },function(e){
                    switch (e.errorcode){
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
                }).catch( () =>{
                })
              }
            })
          }


      },
      valueChange(){
        if(this.workerRefund.mobile  === ''){
          this.fadeIn = false
//          window.location.reload()
        }
      },
      keypress(ev){
        var e = ev || window.event;
        var charCode = ev.keyCode;
        if(!/\d/.test(String.fromCharCode(charCode)) && charCode > 8){
          e.preventDefault(ev);
        }
      },

      submitForm(formName) {
        let _t = this;
        _t.loading = true;
        setTimeout(() => {
          _t.$api.post('/bussiness/manage/workerInfoByBundno', {
            userId: _t.userId,
            tokenID: _t.tokenID,
            bundno: _t.workerRefund.mobile
          }, function (res) {
            _t.loading = false;
            _t.defaultShow = false;
            _t.loadingShow = true;
            _t.workerRefund.name = res.body.name
            _t.workerRefund.phone = res.body.url
            _t.workerRefund.jobno = res.body.serialno
            _t.workerRefund.balance = res.body.balance
            _t.workerRefund.worker = res.body.worker
            if (_t.workerRefund.name === '' || _t.workerRefund.name === undefined) {
              _t.fadeIn = false
            } else {
              _t.fadeIn = true
            }
          }, function (e) {
            _t.loading = false
            switch (e.errorcode) {
              case "BUND_NOT_EXIST":
                _t.checkUp = true
                break;
              case "BUND_LOCK":
                _t.isLocking = true
                break;
              case "BUND_CANCEL":
                _t.isWidthdraw = true
                break;
              case "BUND_NOT_AVAILABLE":
                _t.notActive = true
                break;
              case "BUND_REPORT":
                _t.isLoss = true
                break;
              case "TOKEN_NOT_EXIST":
                _t.userError(_t);
                break;
              case "TOKEN_CHANGE":
                _t.$alert('您的账号已在其他设备登录', '温馨提示', {
                  confirmButtonText: '确定',
                  type: 'warning',
                  callback: action => {
                    localStorage.getItem('userName')
                    _t.$router.replace({path: '/login'});
                  }
                })
                break;
              default:
                break
            }
          })
        }, 2000);
      },
    },
    created(){

      this.$watch('workerRefund.mobile', function (newVal, oldVal) {
        this.$nextTick( () => {
          this.workerRefund.mobile = this.workerRefund.mobile.replace(/[^\d|\.]/g,'')
        })
      })

      this.$watch('workerRefund.money', function (newVal, oldVal) {
        this.$nextTick( () => {
          this.workerRefund.money = this.workerRefund.money.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')
          this.workerRefund.money = this.workerRefund.money.replace(/[^\d|\.]/g,'')
        })
      })
    },
    beforeCreate(){
      this.$store.commit("setLoading",false);
    },
  }
</script>
<style scoped>
  .homeCenter {
    height: 100%;
    overflow: auto;
    background: #fff;
  }
  .homeMagin {
    background-color: #fff;
    padding-bottom:150px;
    width:300px;
    margin:25px auto 0;
  }
  span.fresh-btn{
    color:#35b1f1;
    font-size: 14px;
    font-family:"Microsoft YaHei";
    cursor: default;
  }
  .loading{
    text-align: center;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -16px;
    margin-top: -16px;
  }
  .el-input, .el-input__inner{width:auto !important;color:#333 !important;font-size: 14px !important;}

</style>
<style>
  .workerRefund .el-form-item__label{
    color:#333 !important;
    font-size: 14px;
  }
  .workerRefund .handleSearch{
    float: right;}
  .workerRefund .refund{
    float: none !important;
    padding:10px 25px !important;
  }
   /*.el-message-box__btns{*/
    /*width:200px;*/
    /*padding:0;*/
  /*}*/
  /*.el-message-box__wrapper .el-message-box__btns button:nth-child(2){*/
    /*margin-right:35px;*/
  /*}*/
  .workerRefund .refund{
    margin-left:25%;
  }
  .workerRefund .signOutInput input{
    margin-right:20px !important;
  }
  .workerRefund .allsignOut{
    padding:0 !important;
    float: none !important;
  }
  .workerRefund .Container{
    position: relative;
  }
  .workerRefund .loadingShow{
    border:1px solid #FFC579;
  }
  .workerRefund .el-tabs__item.is-active{
    background: #FDA322;
    color:#fff;
    border:1px solid  #FDA322;
  }
  .workerRefund .el-form-item__error{left:29%;}
  .workerRefund .rechargebg{text-align: center;position: relative;}
  .workerRefund .rechargebg img{
    width:282px;
    height:182px;
    display: inline-block;
  }
  .workerRefund div.defaultContainer div{
    float: left;
  }

  .workerRefund div.defaultData p{
    color:#333;
    font-size: 13px;
    line-height:27px;
  }
  .workerRefund div.defaultData p span{
    width: 95px;
    border-bottom: 1px solid #adadad;
    height: 20px;
    display: inline-block;
    color:#333;
    font-size: 13px;
    text-align: left;
    text-indent: 10px;
    line-height: 20px;
  }
  .workerRefund div.defaultData{
    float: right !important;
    margin:0 0 0 10px;
  }
  .workerRefund div.defaultImg {
    position: absolute;
    top: 68px;
    left: 25px;
  }
  .workerRefund div.defaultImg img{
    width:72px;
    height:89px;
    display: inline-block;
  }
  .workerRefund div.el-tabs__active-bar{
    background: none;
  }
  .workerRefund div.el-tabs__item{
    width:260px !important;
    text-align: center;
    border:1px solid #ADADAD;
    color:#333;
    font-family: "Microsoft YaHei";
    font-size: 14px;
  }
  .workerRefund div.el-tabs__item:first-child{
    border-right:0 none;
  }
  .workerRefund .el-tabs__nav div:nth-child(2)   span span{
    display: inline-block;
    width:13px;
    height:14px;
    padding-right:30px;
    vertical-align: middle;
  }
  .workerRefund .el-tabs__item:nth-child(2).is-active span span{
    vertical-align: middle;
  }

  .workerRefund .el-tabs__header{
    border:0 none;
  }
  .workerRefund .labelfade{
    width:300px;
  }


  .workerRefund .wrapper{
    padding-top:0!important;
  }
  .workerRefund .zyt-manageInformation{
    border-left:3px solid #FDA322;
    padding-left:8px;
    margin-top:28px;
    font-size: 14px;
    color:#121212;
    font-weight: 500;
  }
  .workerRefund .ruleForm{
    width:420px;
    margin:0 auto;
  }
  .workerRefund .verify-code{
    width:50px;
    height:50px;
    display: inline-block;
    float: right;
  }
  .workerRefund .verify-code img{width:100%;height:100%;display: inline-block;}
  .workerRefund .verifyInput{
    width:150px;
  }

  .workerRefund .z_verificationInput{
    width:230px;
  }

  /*输入完后的监测*/
  [class*=" el-icon-"], [class^=el-icon-]{
    font-size: 0;
  }
  .workerRefund .el-input input{
    width:112px !important;
    margin-right:30px;
  }
  .workerRefund .verificationCode  input{width:150px !important;}
  .workerRefund .p_security_code  .el-input input.el-input__inner{width:150px !important;}
  .workerRefund .el-input__inner{color:#333;font-size: 14px;}
  .workerRefund .verificationCode div div.el-input{width:150px !important;}
  .workerRefund .p_security_code div.el-form-item__content div.el-input{width:150px !important;}
  .workerRefund .el-input{display: inline-block;}
  /*.workerRefund .el-input, .el-input__inner{width:auto !important;color:#333;font-size: 14px;}*/
  img.image-code{width:70px;height:35px;}
  .workerRefund .el-tab-pane{width:520px;margin:0 auto;}
  .workerRefund .freshBtn{font-size: 13px;font-family: "Microsoft YaHei";color:#35b1f1;}
  .workerRefund .verificationCode  .el-form-item__content span{padding-left:8px;}
  .workerRefund .handleSure{
    border:0 none;
    background: 0 none;
    color:#00baff;

  }
  .workerRefund .search{padding:10px 25px;}
  .workerRefund .handleSure:hover,.workerRefund .handleSure:active,.workerRefund .handleSure:visited,.workerRefund .handleSure:focus{
    border:0 none;
    background: 0 none;
    color:#34c5fb;
  }
  .el-tabs__content{overflow: visible !important;}
  .workerRefund .verificationCode div.el-form-item__content span.imagefreshBtn{vertical-align: middle;}

  /*新项目入驻*/
  /*项目信息*/
  .workerRefund .New_project_information,.New_project_personal{overflow: hidden;width:800px;height:auto;}
  .workerRefund .New_project_information li,.New_project_personal li{
    float: left;width:100%;}
  .workerRefund .New_project_information li span,.New_project_personal li>span {font-size: 14px;color:#121212;font-family: "Microsoft YaHei";
    font-weight: bold;display: inline-block;border-left:3px solid #FF9000;padding-left:8px;}
  .workerRefund ul li.line{font-size: 14px;font-weight: bold;color:#FF9000;margin-right:10px;}
  .workerRefund #Detailed_address,.workerRefund #Detailed_address input{width:200px !important;}
  .workerRefund .Segmentingline{border:1px solid #eee;margin-bottom:20px;}
  .workerRefund .New_project_personal .imagefreshBtn,.workerRefund .New_project_personal .freshBtn{border:0 none;}
  .workerRefund .el-form-item{margin-bottom:18px !important;margin-top:20px;}
  .workerRefund .verificationCode .el-form-item__content span.imagefreshBtn{height:35px;display: inline-block;}
  .workerRefund .activeName1{margin-left:60px;}
  .workerRefund .activeName2{margin-left:60px;}

  .workerRefund  ul li{
    float:left;
    font-size:16px;
    color:#666;
    line-height:20px;
    margin-right:5px;
  }
  .workerRefund  ul li img{margin:0 15px;}
  .workerRefund ul li{
    font-family: "Microsoft YaHei";
    font-size: 14px;
    color:#333;
    font-weight: bold;
  }
  .workerRefund .DataList {
    position: relative;
  }
  .workerRefund .DataList ul li{
    font-weight: 500;
    float: none;
    line-height: 30px;
  }
  .workerRefund .DataList ul li button{
    border:0 none;
    outline: 0 none;
    background: #FF9000;
    padding:3px 18px;
    border-radius: 5px;
    color:#fff;
    margin-top:10px;
  }
  .workerRefund .DataList ul li:nth-child(2){
    font-weight: 500;
  }
  .workerRefund ul li span{
    font-size: 14px;
    text-align: center;
    vertical-align: middle;
    margin-right: 8px;
    line-height: 12px;
  }
  .workerRefund  .moneyisRight,.workerRefund .RechargeLimit,.workerRefund .checkUp,
  .workerRefund .isLocking,.workerRefund .isWidthdraw,.workerRefund .notActive,
  .workerRefund .isLoss,.workerRefund .compare,.workerRefund .NotZero,.workerRefund .negative{
    color: #ff4949;
    font-size: 12px;
    line-height: 1;
    padding-top: 4px;
    position: absolute;
    top: 37px;
    left: 29%;
    transition: all 3s;-moz-transition: all 3s;-webkit-transition: all 3s;-ms-transition:all 3s;
  }
  .workerRefund .checkUp,.workerRefund .isLocking,.workerRefund .isWidthdraw,
  .workerRefund .notActive,.workerRefund .isLoss,.workerRefund .compare,.workerRefund .NotZero,.workerRefund .negative{
    top:35px;
  }
  .workerRefund ul li .el-button span{margin-right:0;}
  .workerRefund ul li:nth-child(2){font-weight: bold;}
  .workerRefund .containerHead,.workerRefund .containerHead ul{overflow: hidden;}
  .workerRefund .is-disabled,.workerRefund .is-disabled:hover{color:#333 !important;background: #eee;border:1px solid #eee;}
  .workerRefund .el-message-box__message{
    margin-left: 50px;
  }
  .workerRefund .loading img{
    width:32px;
    height:32px;
    display: inline-block;
  }
</style>

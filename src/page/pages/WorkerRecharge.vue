<template>
  <Box>
    <div id="homeCenter1" class='homeCenter workerRecharge'>
      <div class='homeMagin'>
          <div class="wrap" >
            <el-form :model="workerRecharge"  :rules="rules" ref="workerRecharge" class="ruleForm2">
              <div class="Container">
                <el-form-item label="手环编号" prop="mobile">
                  <el-input v-model="workerRecharge.mobile" placeholder="" :maxlength="12"
                            @change="valueChange" autofocus="autofocus" @keypress.native="keypress($event)" @focus="focus()"></el-input>
                  <el-button type="primary" @click="submitForm('workerRecharge')" class="handleSure handleSearch">查询</el-button>
                </el-form-item>
                <span v-show="checkUp" class="checkUp">请检查输入的手环编号</span>
                <span v-show="isLocking" class="isLocking">该手环已锁定</span>
                <span v-show="isWidthdraw" class="isWidthdraw">该手环已注销</span>
                <span v-show="notActive" class="notActive">该手环尚未激活，请激活后再进行充值</span>
                <span v-show="isLoss" class="isLoss">该手环已挂失</span>
              </div>
              <div class="rechargebg">
                <img src="../../assets/rechargebg.png" alt="">
                <div class="defaultContainer">
                  <div class="defaultImg">
                    <img src="../../assets/defaultImg.png" alt="" v-show="defaultShow" style="border:1px solid transparent;">
                    <img v-bind:src="imgUrl+workerRecharge.phone"  alt=""  v-show="loadingShow" class="loadingShow">
                    <div class="defaultData">
                      <p>姓　　名：<span>{{workerRecharge.name?workerRecharge.name:'-- --'}}</span></p>
                      <p>手环编号：<span>{{workerRecharge.jobno?workerRecharge.jobno:'-- --'}}</span></p>
                    </div>
                  </div>
                  <div class="loading"><img src="../../assets/loading.gif" alt="" v-if="loading"></div>
                </div>
              </div>
              <div class="DataList" v-if="fadeIn" >
                <el-form-item label="充值金额" prop="money">
                  <el-input v-model="workerRecharge.money" placeholder=""  @blur="checkIsNumber(workerRecharge.money,'0')"
                            @change="valueChange" autofocus="autofocus" @focus="focus()" ></el-input>
                  <el-button type="primary" @click="Recharge('workerRecharge')" class="handleSure handleSearch">充值</el-button>
                </el-form-item>
                <span v-show="moneyisRight" class="moneyisRight">金额输入不正确，请重新输入</span>
                <span v-show="RechargeLimit" class="RechargeLimit">最多可充值1000</span>
                <span v-show="NotZero" class="NotZero">充值金额不能为0</span>
              </div>
            </el-form>
          </div>
      </div>
    </div>
  </Box>
</template>
<script>
  import md5 from 'js-md5'
  import appHeader from '../../components/Header'
  import SideBar from '../../components/Side';
  import Box from '../../components/Box';
  export default {
    name: 'WorkerRecharge',
    components: {appHeader,SideBar, md5,Box},
    data() {
      return {
        imgUrl:this.$config.config_img_server(),
        workerRecharge: {
          mobile: '',
          name: '',
          jobno: '',
          id: '',
          phone: '',
          money: '',
          worker: ''
        },
        checkUp: false,
        isLocking: false,
        isWidthdraw: false,
        notActive: false,
        isLoss: false,
        disabled: false,
        Verification: '',
        loading: false,
        fadeIn: false,
        defaultShow: true,
        loadingShow: false,
        moneyisRight: false,
        RechargeLimit: false,
        NotZero: false,
        userId: this.getCookie('sh_userId'),
        tokenID: this.getCookie('sh_session'),
        rules: {
          mobile: [
            {required: true, message: '请输入手环编号', trigger: 'change'}
          ],
          money: [
            {required: true, message: '请输入充值金额', trigger: 'change'}
          ]
        }
      }
    },
    beforeCreate(){
      this.$store.commit("setLoading",false);
    },
    mounted(){
      document.getElementById('BrokenNetwork').style.display = 'none';
    },
    created() {
      this.$watch('workerRecharge.mobile', function (newVal, oldVal) {
        this.$nextTick(() => {
          this.workerRecharge.mobile = this.workerRecharge.mobile.replace(/[^\d|\.]/g, '')
        })
      })

      this.$watch('workerRecharge.money', function (newVal, oldVal) {
        this.$nextTick(() => {
          this.workerRecharge.money = this.workerRecharge.money.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
          this.workerRecharge.money = this.workerRecharge.money.replace(/[^\d|\.]/g, '')
        })
      })
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

      focus() {
        this.moneyisRight = false
        this.checkUp = false
        this.isLocking = false
        this.isWidthdraw = false
        this.notActive = false
        this.isLoss = false
        this.RechargeLimit = false
        this.NotZero = false
      },
      blur() {
        this.moneyisRight = false
      },
      checkIsNumber(val) {
        let _t = this;
        _t.moneyisRight = false
        if (_t.workerRecharge.money === '') {

        } else {
          if (_t.isNumber(val)) {
            _t.workerRecharge.money = _t.workerRecharge.money
          } else {
            _t.moneyisRight = true
            document.querySelector('.el-form-item__error').innerHTML = ''
          }
        }
      },
      isNumber(val) {
        let reg = new RegExp('^[0-9]+.?[0-9]*$');
        return reg.test(val)
      },
      Recharge(formName) {
        let _t = this;
        if (_t.workerRecharge.money > 1000) {
          _t.RechargeLimit = true
        } else if (_t.workerRecharge.money === '0' || _t.workerRecharge.money === 0 || _t.workerRecharge.money === '0.0' || _t.workerRecharge.money === 0.0 || _t.workerRecharge.money === '0.00' || _t.workerRecharge.money === 0.00) {
          _t.NotZero = true
        }
        else {
          const moneySure = (_t.workerRecharge.money).replace(/\b(0+)/gi, '')
          _t.$refs[formName].validate((valid) => {
            if (valid) {
              this.$confirm('本次充值金额为' + moneySure + '，请再次确认', '温馨提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
              }).then(() => {
                _t.$api.post('/bussiness/manage/workerRecharge', {
                  userId: _t.userId,
                  tokenID: _t.tokenID,
                  worker: _t.workerRecharge.worker,
                  money: _t.workerRecharge.money
                }, function (res) {
                  _t.$alert('充值成功，充值金额为' + moneySure + '元', '温馨提示', {
                    confirmButtonText: '确定',
                    type: 'warning',
                    callback: action => {
                      window.location.reload()
                    }
                  })
                }, function (e) {
                  switch (e.errorcode) {
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
                      break;
                  }
                })
              }).catch(() => {

              })
            }
          })
        }
      },
      valueChange() {
        let _t = this;
        if (this.workerRecharge.mobile === '') {
          this.fadeIn = false
//          window.location.reload()
        }
      },
      keypress(ev) {
        var e = ev || window.event;
        var charCode = ev.keyCode;
        if (!/\d/.test(String.fromCharCode(charCode)) && charCode > 8) {
          e.preventDefault(ev);
        }
      },

      submitForm: function (formName) {
        let _t = this;
        _t.loading = true;
        setTimeout(() => {
          _t.$api.post('/bussiness/manage/workerInfoByBundno', {
            userId: _t.userId,
            tokenID: _t.tokenID,
            bundno: _t.workerRecharge.mobile
          }, function (res) {
            _t.loading = false;
            _t.defaultShow = false;
            _t.loadingShow = true
            _t.workerRecharge.name = res.body.name
            _t.workerRecharge.phone = res.body.url
            _t.workerRecharge.jobno = res.body.serialno
            _t.workerRecharge.worker = res.body.worker
            if (_t.workerRecharge.name === '' || _t.workerRecharge.name === undefined) {
              _t.fadeIn = false
            } else {
              _t.fadeIn = true
            }
//                _t.show1 = true
//                _t.show2 = true
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
        }, 2000)
//          } else {
//            return false;
//          }
//        });
      }
    }
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
  .workerRecharge .el-form-item__label{
    color:#333 !important;
    font-size: 14px;
  }
  .workerRecharge .el-message-box__btns {
    padding-bottom: 15px;
    overflow: hidden;
    text-align: center;
    width: 50%;
    margin: 0 auto;
  }
  .workerRecharge .el-message-box__btns{
    text-align: center !important;
  }
  .workerRecharge .Container{
    position: relative;
  }
  .workerRecharge .loadingShow{
    border:1px solid #FFC579;
  }
  .workerRecharge .el-tabs__item.is-active{
    background: #FDA322;
    color:#fff;
    border:1px solid  #FDA322;
  }
  .workerRecharge .el-form-item__error{left:29%;}
  .workerRecharge .rechargebg{text-align: center;position: relative;}
  .workerRecharge .rechargebg img{
    width:282px;
    height:182px;
    display: inline-block;
  }
  .workerRecharge div.defaultContainer div{
    float: left;
  }
  .workerRecharge .el-input__inner{color:#333;font-size: 14px;}
  .workerRecharge div.defaultData p{
    color:#333;
    font-size: 13px;
  }
  .workerRecharge div.defaultData p span{
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
  .workerRecharge div.defaultData p:nth-child(1){
    margin-bottom:6px;
  }
  .workerRecharge div.defaultData{
    float: right !important;
    margin:15px 0 0 10px;
  }
  .workerRecharge div.defaultImg {
    position: absolute;
    top: 68px;
    left: 25px;
  }
  .workerRecharge div.defaultImg img{
    width:72px;
    height:89px;
    display: inline-block;
  }
  .workerRecharge div.el-tabs__active-bar{
    background: none;
  }
  .workerRecharge div.el-tabs__item{
    width:260px !important;
    text-align: center;
    border:1px solid #ADADAD;
    color:#333;
    font-family: "Microsoft YaHei";
    font-size: 14px;
  }
  .workerRecharge div.el-tabs__item:first-child{
    border-right:0 none;
  }
  .workerRecharge .el-tabs__nav div:nth-child(2)   span span{
    display: inline-block;
    width:13px;
    height:14px;
    padding-right:30px;
    vertical-align: middle;
  }
  .workerRecharge .el-tabs__item:nth-child(2).is-active span span{
    vertical-align: middle;
  }
  .workerRecharge .el-tabs__nav div:nth-child(3)   span span{
    display: inline-block;
    width:15px;
    height:16px;
    padding-right:30px;
    vertical-align: middle;
  }
  .workerRecharge .el-tabs__item:nth-child(3).is-active span span{
    vertical-align: middle;
  }
  .workerRecharge .el-tabs__header{
    border:0 none;
  }
  .workerRecharge .labelfade{
    width:300px;
  }


  .workerRecharge .wrapper{
    padding-top:0!important;
  }
  .workerRecharge .zyt-manageInformation{
    border-left:3px solid #FDA322;
    padding-left:8px;
    margin-top:28px;
    font-size: 14px;
    color:#121212;
    font-weight: 500;
  }
  .workerRecharge .ruleForm{
    width:420px;
    margin:0 auto;
  }
  .workerRecharge .verify-code{
    width:50px;
    height:50px;
    display: inline-block;
    float: right;
  }
  .workerRecharge .verify-code img{width:100%;height:100%;display: inline-block;}
  .workerRecharge .verifyInput{
    width:150px;
  }

  .workerRecharge .z_verificationInput{
    width:230px;
  }
  /*输入完后的监测*/
  [class*=" el-icon-"], [class^=el-icon-]{
    font-size: 0;
  }
  .workerRecharge .el-input input{
    width:112px !important;
    margin-right:30px;
  }
  .workerRecharge .verificationCode  input{width:150px !important;}
  .workerRecharge .p_security_code  .el-input input.el-input__inner{width:150px !important;color:#333;font-size: 14px;}
  .workerRecharge .verificationCode div div.el-input{width:150px !important;}
  .workerRecharge .p_security_code div.el-form-item__content div.el-input{width:150px !important;}
  .workerRecharge .el-input{display: inline-block;}
  /*.workerRecharge .el-input, .el-input__inner{width:auto !important;color:#333;font-size: 14px;}*/
  img.image-code{width:70px;height:35px;}
  .workerRecharge .el-tab-pane{width:520px;margin:0 auto;}
  .workerRecharge .freshBtn{font-size: 13px;font-family: "Microsoft YaHei";color:#35b1f1;}
  .workerRecharge .verificationCode  .el-form-item__content span{padding-left:8px;}
  .workerRecharge .handleSure{width:auto;height:35px;padding:10px 25px;}
  .workerRecharge .handleSearch{
    float: right;}
  .el-tabs__content{overflow: visible !important;}
  .workerRecharge .verificationCode div.el-form-item__content span.imagefreshBtn{vertical-align: middle;}

  /*新项目入驻*/
  /*项目信息*/
  .workerRecharge .New_project_information,.New_project_personal{overflow: hidden;width:800px;height:auto;}
  .workerRecharge .New_project_information li,.New_project_personal li{
    float: left;width:100%;}
  .workerRecharge .New_project_information li span,.New_project_personal li>span {font-size: 14px;color:#121212;font-family: "Microsoft YaHei";
    font-weight: bold;display: inline-block;border-left:3px solid #FF9000;padding-left:8px;}
  .workerRecharge ul li.line{font-size: 14px;font-weight: bold;color:#FF9000;margin-right:10px;}
  .workerRecharge #Detailed_address,.workerRecharge #Detailed_address input{width:200px !important;}
  .workerRecharge .Segmentingline{border:1px solid #eee;margin-bottom:20px;}
  .workerRecharge .New_project_personal .imagefreshBtn,.workerRecharge .New_project_personal .freshBtn{border:0 none;}
  .workerRecharge .el-form-item{margin-bottom:18px !important;margin-top:20px;}
  .workerRecharge .verificationCode .el-form-item__content span.imagefreshBtn{height:35px;display: inline-block;}
  .workerRecharge .activeName1{margin-left:60px;}
  .workerRecharge .activeName2{margin-left:60px;}

  .workerRecharge  ul li{
    float:left;
    font-size:16px;
    color:#666;
    line-height:20px;
    margin-right:5px;
  }
  .workerRecharge  ul li img{margin:0 15px;}
  .workerRecharge ul li{
    font-family: "Microsoft YaHei";
    font-size: 14px;
    color:#333;
    font-weight: bold;
  }
  .workerRecharge .DataList .el-form-item{
    margin-top:30px;
  }
  .workerRecharge .DataList {
    position: relative;
  }
  .workerRecharge .DataList ul li{
    font-weight: 500;
    float: none;
    line-height: 30px;
  }
  .workerRecharge .DataList ul li button{
    border:0 none;
    outline: 0 none;
    background: #FF9000;
    padding:3px 18px;
    border-radius: 5px;
    color:#fff;
    margin-top:10px;
  }
  .workerRecharge .DataList ul li:nth-child(2){
    font-weight: 500;
    float: left;
  }

  .workerRecharge ul li span{
    font-size: 14px;
    text-align: center;
    vertical-align: middle;
    margin-right: 8px;
    line-height: 12px;
  }
  .workerRecharge  .moneyisRight,.workerRecharge .RechargeLimit,.workerRecharge .NotZero,.workerRecharge .checkUp,.workerRecharge .isLocking,.workerRecharge .isWidthdraw,.workerRecharge .notActive,.workerRecharge .isLoss{
    color: #ff4949;
    font-size: 12px;
    line-height: 1;
    padding-top: 4px;
    position: absolute;
    bottom: -16px;
    left: 29%;
    transition: all 3s;-moz-transition: all 3s;-webkit-transition: all 3s;-ms-transition:all 3s;
  }
  .workerRecharge .checkUp,.workerRecharge .isLocking,.workerRecharge .isWidthdraw,.workerRecharge .notActive,.workerRecharge .isLoss{
    bottom:-14px;
  }
  .workerRecharge ul li .el-button span{margin-right:0;}
  .workerRecharge ul li:nth-child(2){font-weight: bold;}
  .workerRecharge .containerHead,.workerRecharge .containerHead ul{overflow: hidden;}
  .workerRecharge .is-disabled,.workerRecharge .is-disabled:hover{color:#333 !important;background: #eee;border:1px solid #eee;}
  .workerRecharge .loading img{
    width:32px;
    height:32px;
    display: inline-block;
  }
</style>

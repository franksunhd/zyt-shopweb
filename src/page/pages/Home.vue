<template>
  <Box>
    <div class='homeCenter HomeContainer'>
      <div class='homeMagin'>
        <div class="topHeight"></div>
        <div class="workman-total">
          <div class="padding">
            <div name="first">
              <div class='thead'>
                <img src='../../assets/img/left.png' />
                <span class='theadTitle'>充值总计</span>
                <img src='../../assets/img/right.png' />
              </div>
              <div class="total">
                <div class='overflow'>
                  <div class="t-head marginRight">
                    <img class='t-headList' src='../../assets/img/countLeft.png' />
                    <span class="countTag countTagLeft"><img src="../../assets/img/tag.png" alt="">余额 > 0 人数 </span>
                    <div class="countLeftContainer">
                      <span class="count countLeft"><span class="countNum"> {{balance.num}} </span></span>
                    </div>
                  </div>
                  <div class="t-head">
                    <img class='t-headList' src='../../assets/img/countRight.png' />
                    <span class="countTag countTagLeft"><img src="../../assets/img/tag.png" alt="">总余额 </span>
                    <div class="countRightContainer">
                      <span class="count countRight"><span class="countNum">{{balance.money}}</span></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="middleMain">
          <div>
            <div class='thead'>
              <img src='../../assets/img/left.png' />
              <span class='theadTitle'>今日操作统计</span>
              <img src='../../assets/img/right.png' />
            </div>
            <div class="middle">
              <img src="../../assets/img/countPicture.png" alt="">
            </div>
            <div class="tableMain">
              <div class="tableContainer">
                <table class="table table-bordered">
                  <tr class='tableSort'>
                    <td class="count-head" style="text-align: center"></td>
                    <td class="count-head" style="text-align: center">人数</td>
                    <td class="count-head" style="text-align: center">金额</td>
                  </tr>
                  <!--<tr >-->
                  <!--<td colspan="3" class="table-innerwrap">-->
                  <!--<table class="table table-bordered">-->
                  <!--<tr>-->
                  <!--<td>{{team.numLabor}}</td>-->
                  <!--<td>{{parseFloat((team.numLabor/workTypeLabor.num*100).toFixed(2))}}%</td>-->
                  <!--</tr>-->
                  <!--<tr v-for="(t,index) in team.team"  :key="index">-->
                  <!--<td class="text-right">{{t.num}}</td>-->
                  <!--<td class="text-right">{{parseFloat((t.num / team.numLabor*100).toFixed(2))}}%</td>-->
                  <!--</tr>-->
                  <!--</table>-->
                  <!--</td>-->
                  <!--</tr>-->
                  <tr class="summation" >
                    <td class="reCharge">充值</td>
                    <td>{{tableData.num}}</td>
                    <td>{{tableData.money}}</td>
                  </tr>
                  <tr class="summation">
                    <td class="refund">退款</td>
                    <td>{{tableData2.num}}</td>
                    <td >{{tableData2.money}}</td>
                  </tr>
                </table>
                <div class="tablelinearMain"><div class="tablelinear"></div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class='imgContainer'>
        <p>Copyright©2017诸英台54zyt.com版权所有</p>
      </div>
    </div>
  </Box>
</template>
<script>
  import appHeader from '../../components/Header.vue';
  import SideBar from '../../components/Side.vue';
  import Box from '../../components/Box';
  export default {
    name: 'home',
    components: { appHeader,SideBar,Box },
    data () {
      return{
        overtime:false,
        tokenID:this.getCookie('sh_session'),
        userId:this.getCookie('sh_userId'),
        balance:{
          num :0,
          money:0,
        },
        tableData:{
          num:0,
          money:0
        },
        tableData2:{
          num:0,
          money:0
        }
      }
    },
    created(){
      this.$store.commit("setLoading",true);
      let _t=this;
      _t.getData()

    },
    methods:{
      getData(){
        let _t = this;
        _t.$api.post('/bussiness/manage/homePage',{
          userId:_t.userId,
          tokenID:_t.tokenID
        },function (res) {
          _t.$store.commit("setLoading",false);
          _t.balance = res.body.all;
          _t.tableData = res.body.recharge
          _t.tableData2 = res.body.withdraw
        })
      },

      userError(t){
        if(t.overtime) return;
        t.$alert('用户登录超时，请重新登录', '提示', {
          confirmButtonText: '确定',
          type: 'warning',
          callback: action => {
            t.overtime=true;
            t.delCookie('session');
            t.delCookie('userID');
            t.$router.replace({ path: '/login' });
          }
        });
      }
    },
    filters:{
      percent(value){
        if(!value) return '';
        return parseFloat(value).toFixed(4)*100+"%";
      }
    },
    beforeCreate(){

    },
  }
</script>
<style scoped>
  .tablelinearMain{position: absolute;left:0;top:0;}
  .tablelinear{
    position:relative;
    width:120px;
    height:48px;
    box-sizing:border-box;
    line-height:48px;
    text-indent:5px;
    background:
      linear-gradient(20.8deg, transparent 49.5%, #eee 49.5%, #eee 49.5%, transparent 50.5%);
  }
  .imgContainer {
    height: 100px;
    margin-top: 20px;
  }

  .imgContainer p {
    text-align: center;
    color:#666;
    font-size: 15px;
    padding-top: 34px;
    font-family: "Microsoft YaHei";
  }
  .icon-more{
    float: right;
    margin-right: 45px;
  }
  .theadImg {
    width: 267px;
    position: absolute;
    left: 0;
    top: 0;
  }

  .theadPra {
    position: absolute;
    left: 0;
    width: 267px;
    text-align: center;
    bottom: 25px;
    font-weight: bold;
    font-family: "Microsoft YaHei";
    font-size: 14px;
    color:#333;
  }

  .totalProSort {
    font-size: 16px;
    float: left;
  }

  .totalProImg {
    float: left;
    margin-top: 23px;
  }

  .totalProperty {
    overflow: hidden;
    width: 480px;
    margin: 0 auto;
  }

  .workmanTotalCenter {
    width: 630px;
    margin:48px auto 0;
  }

  .overflow {
    overflow: hidden;
  }

  .t-headPra {
    position: absolute;
    left: 0;
    width: 267px;
    text-align: center;
    bottom: 25px;
  }

  .t-headList {
    width: 267px;
    position: absolute;
    left: 0;
    top: 0;
  }

  .marginRight {
    margin-right: 8px;
    margin-left:6px;
  }



  .theadTitle {
    margin: 0 10px;
    font-size: 15px;
    color:#4E4E4E;
    font-weight: bold;
    font-family:"Microsoft YaHei";
  }

  .wrapper {
    height: 100%;
    box-sizing: border-box;
    padding-top: 60px;
    background: #fff;
  }

  .wrapperContainer {
    position: relative;
    z-index: 1;
    background: #fff;
    height: 100%
  }

  .workman-total {
    margin-bottom: 20px;
  }

  .tabactive {
    background: #fda322;
    color: #fff;
  }

  .total {
    border: none;
    text-align: center;
    font-size: 14px;
    max-width: 1039px;
    margin: 20px auto 0;
  }
  .total-item{
    display: inline-block;
    vertical-align: top;
    *display: inline;
    *zoom:1;
    margin: 0 20px 20px;
  }
  .total-item .t-head{
    float: none;
  }
  .table-wrap {
    display: inline-block;
  }

  .t-head {
    position: relative;
    width: 267px;
    height: 168px;
    padding: 0;
    float: left;
  }

  .t-txt {
    padding: 8px;
    border: none;
    height: 48px;
    line-height: 48px;
    float: left;
    color:#FC990C;
    font-weight: bold;
  }

  .t-txt .num {
    font-size: 20px;
    font-family:Helvetica;
    color:#FF830A;
    font-weight: bold;
  }
  .t-txt  span:nth-child(2){
    margin-left:3px;
  }

  .table-innerwrap {
    padding: 0;
    border-bottom: 0;
  }
  .table-innerwrap td td{
    color:#848484;

  }
  .table-innerwrap td {
    border-top: 0;
    border-left: 0;
    border-bottom: 0;
    color:#848484;
    padding-left: 15px;
  }
  .table .summation td{width:120px;}
  .table .summation td:nth-child(2){width:119.5px;}
  .table-innerwrap td:last-child {
    border-right: 0;
  }
  .table-bordered td, .table-bordered th{border:1px solid #eee;}
  .table-bordered td:nth-child(1){
    position: relative;
  }
  .table-innerwrap .table {
    border: 0;
    margin-bottom: 0;
    table-layout: fixed;
  }

  .dismiss {
    display: none;
  }

  .selected .dismiss {
    display: table-row;
  }

  .workman-total {
    width: 550px;
    margin: 0 auto;
  }
  .t-head img{width:100%;height:100%;display: inline-block;}
  .dismiss td {
    padding-right: 10px;
  }

  /*.summation {*/
  /*background: #f2f2f2;*/
  /*}*/
  tr.dismiss{
    background: #fbfbfb;
  }
  .summation td,
  .dismiss td {
    border-top: 1px solid #ddd;
  }
  .table-innerwrap td:nth-child(1){
    padding-left: 36px;
  }
  .table-innerwrap td:nth-child(2),.table-innerwrap td:nth-child(3){
    padding-left: 80px;
  }
  .upper {
    color: #f00;
    font-size: 16px;
    margin-left: 5px;
  }

  .cur {
    cursor: pointer;
  }

  .floatLeft {
    float: left;
  }

</style>
<style scoped>
  .summation td{color:#FB8125;font-size: 14px;text-align: left;}
  .summation td:nth-child(2){padding-left:35px;}
  .summation td:nth-child(3){padding-left:30px;}
  .reCharge,.refund{font-size: 14px;color:#000 !important;padding-left:46px;}
  .el-tabs__item {
    font-size: 16px;
    color: #666;
  }

  .el-tabs__item.is-active {
    color: #fd8125;
    font-weight: bold;
  }

  .el-tabs--card>.el-tabs__header .el-tabs__item.is-active {
    border-top: 2px solid #fd8125;
    border-radius: 0;
  }

  .homeCenter {
    height: 100%;
    overflow: auto;
    background: #fff;
  }
  .homeMagin {
    background-color: #fff;
    padding-bottom:80px;
    border-bottom:2px solid #F3F5F6;
  }
  .thead {
    text-align: center;
    /*padding-top:32px;*/
  }
  .tab {
    width: 140px;
    height: 50px;
    border: 1px solid #ffdcb7;
    font-size: 16px;
    text-align: center;
    line-height: 50px;
    float: left;
    cursor: pointer;
  }
  .tableSort{
    font-family: "Microsoft YaHei";
    font-size: 14px;
  }
  .middleMain{margin-top:35px;}
  /*.count{position: absolute;bottom:20px;}*/
  .count{width:100%;text-align: center;}
  .count .countNum{font-size: 18px;color:#DD1611;font-weight: bold;}
  .countTag{position: absolute;top:18px;left:25px;}
  .countTag img{width:5px;height:5px;display: inline-block;vertical-align: middle;margin-right:10px;}
  .middle{text-align:center;margin:10px 0 20px;}
  .tableContainer{text-align: center;width:360px;margin:0 auto;position: relative;}
  .count-head{font-size: 14px;color:#000;}
  .countRightContainer,.countLeftContainer{
    position: absolute;
    bottom: 23px;
    width: 100%;
  }
   .el-message-box__btns button:nth-child(2){
    margin-right:10px !important;
    margin-left:0;
  }
   .app-btn-default, .el-button{
    float: right;
  }
</style>


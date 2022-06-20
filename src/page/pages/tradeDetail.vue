<template>
  <Box class="tradeDetailContainer">
    <div class="attend">
      <div class="topHeight"></div>
      <div class="search-panel">
        <el-form :inline="true" :model="options" class="demo-form-inline">
          <el-form-item label="姓名">
            <el-input v-model.trim="options.name" placeholder="" class="inputName"></el-input>
          </el-form-item>
          <el-form-item label="手环编号">
            <el-input class="layout-Rings layout-labor" v-model="options.bundno"></el-input>
          </el-form-item>
          <el-form-item label="交易类型">
            <el-select clearable v-model="options.status" placeholder="请选择" class="layout-labor">
              <el-option :label="i.tname" :value="i.id" v-for="i in statusList"
                         :key="i.id"></el-option>
            </el-select>
          </el-form-item>
          <br>
          <el-form-item>
            <el-button type="primary" @click="getData" class="query">查询</el-button>
          </el-form-item>
        </el-form>
        <div class="table-wrap">
          <el-table border :data="tableData" empty-text="尚无任何资金交易">
            <el-table-column label="序号" align="left" width="65" header-align="center" >
              <template slot-scope="scope">
                    <span>{{(currentPage-1)*options.num+scope.row.xuhao}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="姓名" align="left" width="90" header-align="center">
            </el-table-column>
            <el-table-column label="手环编号" align="center" prop="serialno" width="110" header-align="center">
            </el-table-column>
            <el-table-column prop="typeValue" label="交易类型" align="center" width="70" header-align="center"></el-table-column>
            <el-table-column  label="交易金额" align="left" width="100" header-align="center">
              <template slot-scope="scope">
                {{parseFloat(scope.row.amount).toFixed(2)}}
              </template>
            </el-table-column>
            <el-table-column prop="tradeDate" label="交易时间" align="center" width="160" header-align="center">
              <template slot-scope="scope">
                    {{scope.row.tradeDate | formatTime}}
              </template>
            </el-table-column>
            <el-table-column  label="交易前余额" align="left" width="100" header-align="center">
                  <template slot-scope="scope">
                        {{parseFloat(scope.row.beforeBalance).toFixed(2)}}
                  </template>
            </el-table-column>
            <el-table-column  label="交易后余额" align="left" width="101" header-align="center">
                  <template slot-scope="scope">
                    {{parseFloat(scope.row.afterBalance).toFixed(2)}}
                  </template>
            </el-table-column>
          </el-table>
          <div class="paging">
            <el-pagination @current-change="handleCurrentChange"
                           @size-change="handleSizeChange"
                           :current-page="currentPage"
                           :page-size="options.num"
                           :page-sizes="[10, 20, 30, 40]"
                           layout="total,sizes,prev, pager, next"
                           :total="total">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
  </Box>
</template>
<script>
  import Box from '../../components/Box';
  import {formatDate} from '../../assets/js/date.js';
  export default {
    name: 'tradeDetail',
    components: {Box},
    data() {
      return {
        options: {
          name: '',
          bundno:'',
          type:'',
          num: 10,
          start: 0,
        },
        tokenID: this.getCookie("sh_session"),
        userId: this.getCookie('sh_userId'),
        currentPage: 1,
        total: 10,
        tableData: [],
        statusList:[
          {id:18,tname:'充值'},
          {id:19,tname:'退款'},
          {id:1,tname:'消费'}
        ]
      }
    },
    methods: {
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
      // 获取数据
      getData() {
        let _t = this;
        _t.$api.post('/bussiness/manage/tradeDetail',{
            userId:_t.userId,
            tokenID:_t.tokenID,
            bundno:_t.options.bundno,
            name:_t.options.name,
            type:_t.options.status,
            start:_t.options.start,
            num:_t.options.num
        },function(res){
          _t.$store.commit("setLoading", false);
          _t.tableData = res.body.detail
          for (let i = 0; i < res.body.detail.length; i++) {
            res.body.detail[i].xuhao = i + 1
          }

          _t.total = res.body.num;
        },function(e){
            switch(e.errorcode){
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

      },
      handleCurrentChange(currentPage) {
        this.currentPage = currentPage;
        this.options.start = (currentPage - 1) * this.options.num;
        this.getData();
      },
      handleSizeChange(size) {
        this.options.num = size;
        this.options.start = (this.currentPage-1) * size;
        this.getData();
      }
    },

    created() {
      this.getData();
    },
    beforeCreate() {
      this.$store.commit("setLoading", true);
    },
    filters:{
      formatTime(time) {
        if (time == "" || time == undefined) return "";
        var date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss');
      }
    }
  }
</script>
<style scoped>
  .table-wrap {
    display: inline-block;
  }

  .el-form {
    width: auto;
  }
  .query{
    padding:10px 25px;
  }
  .el-form--inline .el-form-item{
    margin-right:40px;
  }
  .topHeight{
    height:25px;
  }
</style>
<style>
  .tradeDetailContainer   tbody tr td div{color:#333 !important;font-size: 14px;}
  .tradeDetailContainer .el-table th, .el-table__footer-wrapper thead div, .el-table__header-wrapper thead div{
    background:none !important;
  }
  .tradeDetailContainer .el-table--border td, .el-table--border th{
    border-bottom:1px solid #F5F5F5;
    border-right:1px solid #F5F5F5;
  }
  .tradeDetailContainer .el-table--border th, .el-table__fixed-right-patch{
    border-bottom:1px solid #f5f5f5;
  }
  .tradeDetailContainer .el-form-item__content{
    line-height:20px;
  }
  .tradeDetailContainer .el-form-item{
    margin-bottom:20px;
  }
  .tradeDetailContainer .el-form-item__label{
    color:#333;
    font-size: 14px;
  }
  .tradeDetailContainer .inputName input.el-input__inner,.tradeDetailContainer .layout-Rings input.el-input__inner,.tradeDetailContainer .layout-labor input.el-input__inner{
    width:128px;
    color:#333;
    font-size: 14px;
  }
  .tradeDetailContainer input.el-input__inner::-webkit-input-placeholder{
    color:#999;
    font-size: 14px;
  }
  .tradeDetailContainer .el-table {
    border-top: 2px solid #ff9904;
    border-right:0 none !important;
    width:798px;
  }
  .tradeDetailContainer .box-wrap {
    text-align: center;
  }

  .tradeDetailContainer form.el-form {
    text-align: left;
  }

  .tradeDetailContainer .el-table .cell, .el-table th>div{
    color:#333;
    font-size: 14px;
  }
   thead  .cell{
    padding:0 !important;
  }

  .tradeDetailContainer .search-panel {
    display: inline-block;
  }

  .tradeDetailContainer .el-table__body-wrapper tbody tr td:nth-child(1){padding:0 10px;}
  .tradeDetailContainer .el-table__body-wrapper tbody tr td:nth-child(2){padding:0 5px;}
  .tradeDetailContainer .el-table__body-wrapper tbody tr td:nth-child(3){padding:0 6px;}
  .tradeDetailContainer .el-table__body-wrapper tbody tr td:nth-child(4){padding:0 10px;}
  .tradeDetailContainer .el-table__body-wrapper tbody tr td:nth-child(5){padding:0 6px;}
  .tradeDetailContainer .el-table__body-wrapper tbody tr td:nth-child(6){padding:0 3px !important;}
  .tradeDetailContainer .el-table__body-wrapper tbody tr td:nth-child(7){padding:0 5px;}
  .tradeDetailContainer .el-table__body-wrapper tbody tr td:nth-child(8){padding:0 6px;}
</style>

<template>
  <Box class="BalanceContainer">
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
          <el-form-item>
            <el-button type="primary" @click="getData" class="query">查询</el-button>
          </el-form-item>
        </el-form>
        <div class="table-wrap">
          <el-table  :data="tableData" empty-text="尚无工人进行充值">
            <!--<el-table-column  label="序号" align="left" width="50" header-align="center" prop="id">-->
            <!--<template scope="scope">-->
            <!--<span>{{(currentPage-1)*options.num+scope.$index+1}}</span>-->
            <!--</template>-->
            <!--</el-table-column>-->
            <el-table-column label="序号" align="left" width="90" header-align="center" >
              <template slot-scope="scope">
                    <span>{{(currentPage-1)*options.num+scope.row.xuhao}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="姓名" align="left" width="120" header-align="center">
            </el-table-column>
            <el-table-column label="手环编号" align="left" prop="serialno" width="150" header-align="center">
            </el-table-column>
            <el-table-column  label="钱包余额" align="left" width="150" header-align="center">
              <template slot-scope="scope">
                  {{parseFloat(scope.row.balance).toFixed(2)}}
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
  export default {
    name: 'Balance',
    components: {Box},
    data() {
      return {
        options: {
          name: '',
          bundno:'',
          num: 10,
          start: 0,
        },
        tokenID: this.getCookie("sh_session"),
        userId: this.getCookie('sh_userId'),
        currentPage: 1,
        total: 10,
        tableData: []
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
        _t.$api.post('/bussiness/manage/searchBalance',{
            userId:_t.userId,
            tokenID:_t.tokenID,
            bundno:_t.options.bundno,
            name:_t.options.name,
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
    padding:10px 24px;
  }
  .el-form--inline .el-form-item{
    margin-right:40px;
  }
  .el-form--inline .el-form-item:last-child{margin-right:0;}
  .topHeight{
    height:25px;
  }
</style>
<style>

  .BalanceContainer .el-table th, .el-table__footer-wrapper thead div, .el-table__header-wrapper thead div{
    background:none !important;
  }
  .BalanceContainer   .el-table--enable-row-transition .el-table__body td,.BalanceContainer .el-table th{
    border-right:1px solid #f5f5f5;
  }
  .BalanceContainer   .el-table--enable-row-transition .el-table__body td:last-child,.BalanceContainer .el-table th:last-child{
    border-right:0 none;
  }
  .BalanceContainer  .el-table td, .el-table th.is-leaf{border-bottom:1px solid #f5f5f5 !important;}
  .BalanceContainer  .el-table td:last-child, .el-table th.is-leaf:last-child{border-bottom:1px solid #f5f5f5 !important;}
  .BalanceContainer   tbody tr td div{color:#333 !important;font-size: 14px;}
  .BalanceContainer .el-table--border td, .el-table--border th{
    border-bottom:1px solid #F5F5F5;
    border-right:1px solid #F5F5F5;
  }
  .BalanceContainer .el-table--border th, .el-table__fixed-right-patch{
    border-bottom:1px solid #f5f5f5;
  }
  .BalanceContainer .el-form-item__content{
    line-height:20px;
  }
  .BalanceContainer .el-form-item{
    margin-bottom:20px;
  }
  .BalanceContainer .el-form-item__label{
    color:#333;
    font-size: 14px;
  }
  .BalanceContainer input.el-input__inner::-webkit-input-placeholder{
    color:#999;
    font-size: 14px;
  }

  .BalanceContainer .el-table {
    border:1px solid #f5f5f5;
    border-top: 2px solid #ff9904;
    border-right:0 none !important;
    width:512px;
    border-bottom:0 none;
    border-left:1px solid #dfe6ec;
  }
  .BalanceContainer .box-wrap {
    text-align: center;
  }

  .BalanceContainer form.el-form {
    text-align: left;
  }

  .BalanceContainer .search-panel {
    display: inline-block;
  }
  .BalanceContainer .inputName input.el-input__inner,.BalanceContainer .layout-Rings input.el-input__inner{
    width:122px;
    color:#333;
    font-size: 14px;
  }
  .BalanceContainer .el-table__body-wrapper tbody tr td:nth-child(1){padding:0 20px;}
  .BalanceContainer .el-table__body-wrapper tbody tr td:nth-child(2){padding:0 14px;}
  .BalanceContainer .el-table__body-wrapper tbody tr td:nth-child(3){padding:0 21px;}
  .BalanceContainer .el-table__body-wrapper tbody tr td:nth-child(4){padding:0 22px;}
</style>

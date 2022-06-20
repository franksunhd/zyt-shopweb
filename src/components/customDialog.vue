<template>
<div>
    <el-dialog title="提示" :visible.sync="updatepwd" size="tiny" top="25%" :before-close="closeUpdate">
      <span>修改成功</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="closeUpdate">确 定</el-button>
      </span>
    </el-dialog>
</div>
</template>
<script>
    export default {
        name:'dialogs',
        data(){
            return{

            }
        },
        methods:{
            handleClose(){},
            closeUpdate(){
                this.$store.commit('updatepwd');
                this.$router.push({ path: '/manage/info' });
            }
        },
        computed:{
            updatepwd:{
                get(){
                    return this.$store.state.updatepwdVisible;
                },
                set(value){

                }
            }
        }
    }
</script>

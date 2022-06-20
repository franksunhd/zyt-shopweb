<template>
    <!--项目资料--登录-->
    <Box>
        <div class="user-info">
            <table class="user">
                <tr>
                    <td class="text-right">项目名称：</td>
                    <td>{{projectName}}</td>
                </tr>
                <tr>
                    <td class="text-right">项目编号：</td>
                    <td>{{projectId}}</td>
                </tr>
                <tr>
                    <td class="text-right">项目总包：</td>
                    <td>{{projectContractor}}</td>
                </tr>
                <tr>
                    <td class="text-right">用户名：</td>
                    <td>{{username}}</td>
                </tr>
                <tr>
                    <td class="text-right">登录密码：</td>
                    <td>{{!pwdstatus?'已设置':'未设置'}}
                        <router-link to="/manage/info/updatepwd" class="change-pwd">修改</router-link>
                    </td>
                </tr>
            </table>
        </div>
    </Box>
</template>
<script>
import Box from '../../components/Box';
    export default {
        name:'infoNe',
        components:{Box},
        data(){
            return{
                projectInfo:{}
            }
        },

        created(){
            this.projectInfo=this.$store.state.projectInfo;
            this.$store.commit("setLoading",false);
        },
        mounted(){
        },
        computed:{
            projectContractor(){
                return this.$store.state.projectInfo.projectContractor;
            },
            projectName(){
                    return this.projectInfo.projectName;
            },
             projectId:{
                 get(){
                     return this.projectInfo.projectId;
                 },
                 set(){

                 }
             },
            username:{
                get(){
                    return this.projectInfo.userName;
                },
                set(){

                }
            },
            pwdstatus:{
                get(){
                    return this.projectInfo.pwdstatus;
                },
                set(){

                }
            }

        }
    }
</script>
<style scoped>
.user {
    border-collapse: collapse;
}

.user td {
    padding: 0;
    font-size: 14px;
    color: #333;
    height: 48px;
}

.user td:last-child {
    padding-left: 10px;
}

.change-pwd {
    color: #fd8125;
    text-decoration: none;
    margin-left: 10px;
}

.change-pwd:hover {
    text-decoration: underline;
}
</style>

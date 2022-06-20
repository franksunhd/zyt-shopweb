<template>
    <div id="appMain" class="app-main" v-loading.body.lock="loading" element-loading-text="拼命加载中">
        <!--<h2 class="box-title">-->
            <!--<span class="title-name">{{currentPage}}</span>-->
            <!--<span class="crumbs"><a href="" class="topmenu">{{crumbs}}</a>&gt;<span class="submenu">{{currentPage}}</span></span>-->
        <!--</h2> -->
         <div class="box-wrap">
            <slot></slot>
        </div>
    </div>
</template>
<script>
    export default {
        name:'box',
        data(){
            return{

            }
        },
        props:['currentPage','crumbs'],
        computed:{
            loading(){
                return this.$store.state.loading
            }
        }
    }
</script>
<style>
    .app-main {
        height: 100%;
        box-sizing: border-box;
        overflow: auto;
        overflow-x: hidden;
        position: relative;
    }

    .box-title {
        height: 60px;
        margin: 0;
        line-height: 60px;
    }

    .title-name {
        font-size: 24px;
        display: inline-block;
        height: 26px;
        line-height: 26px;
        vertical-align: middle;
        padding-left: 7px;
        border-left: 5px solid #fe8125;
    }

    .box-title .crumbs {
        font-size: 14px;
        float: right;
    }

    .crumbs .topmenu {
        color: #999;
        text-decoration: none;
    }

    .crumbs .topmenu:hover {
        color: #333;
        text-decoration: underline;
    }

    .crumbs .submenu {
        color: #333;
    }

    .box-wrap {
        background-color: #fff;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
        padding: 20px;
        min-height: 95%;
        padding-top:0;
    }
</style>

import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/page/index'
import Login from '@/page/login.vue'
const Home = () => import ('@/page/pages/Home');
const chatMessage =() => import('@/page/pages/chatMessage')
const WorkerRecharge =() => import('@/page/pages/WorkerRecharge')
const WorkerRefund =() => import('@/page/pages/WorkerRefund')
const Balance =() => import('@/page/pages/Balance')
const tradeDetail =() => import('@/page/pages/tradeDetail')
Vue.use(Router)
export default new Router({
    routes: [
          {path: "/", redirect: "/manage/home"},
          {path: "/manage", redirect: "/manage/home" },
          {path: '/manage', name: 'index', component: Index,
              children: [
                  { path: "/manage/home", name: 'home', component: Home},
                  { path: "/manage/chatMessage", name: 'chatMessage', component: chatMessage },
                  { path: "/manage/WorkerRecharge", name: 'WorkerRecharge', component: WorkerRecharge },
                  { path: "/manage/WorkerRefund", name: 'WorkerRefund', component: WorkerRefund },
                  { path: "/manage/Balance", name: 'Balance', component: Balance },
                  { path: "/manage/tradeDetail", name: 'tradeDetail', component: tradeDetail }
              ]
          },
          { path: '/login',  name: 'login',  component: Login },
          { path: "/chatMessage", name: 'chatMessage', component: chatMessage }
    ]
})

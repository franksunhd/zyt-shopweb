// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import {
    Dialog,
    Button,
    Menu,
    Submenu,
    MenuItem,
    Input,
    Checkbox,
    CheckboxGroup,
    Select,
    Option,
    Steps,
    Step,
    Form,
    FormItem,
    Row,
    Radio,
    Upload,
    RadioGroup,
    RadioButton,
    InputNumber,
    Col,
    Tag,
    Tabs,
    TabPane,
    Table,
    TableColumn,
    Carousel,
    DatePicker,
    TimePicker,
    Transfer,
    TimeSelect,
    Message,
    Pagination,
    MessageBox,
    Loading,
    Scrollbar
} from 'element-ui';
import router from './router'
import './assets/css/base.css'
import './assets/css/common.css'
import api from './config/api.js'
import config from './config/config.js'
import 'babel-polyfill'
Vue.use(Vuex);
Vue.use(Dialog);
Vue.use(Button);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(Input);
Vue.use(InputNumber);
Vue.use(Checkbox);
Vue.use(CheckboxGroup);
Vue.use(Select);
Vue.use(Option);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Row);
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(RadioButton)
Vue.use(Col);
Vue.use(Tag);
Vue.use(Upload);
Vue.use(Steps);
Vue.use(Step);
Vue.use(Transfer);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Table);
Vue.use(Carousel);
Vue.use(TableColumn);
Vue.use(DatePicker);
Vue.use(TimePicker);
Vue.use(TimeSelect);
Vue.use(Pagination);
Vue.use(Loading.directive);
Vue.use(Scrollbar);
Vue.prototype.$msgbox = MessageBox
Vue.prototype.$message = Message
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$prompt = MessageBox.prompt
Vue.prototype.$confirm = MessageBox.confirm

Vue.config.productionTip = false
Vue.prototype.$api = api;
Vue.prototype.$config = config;//全局配置定义


Vue.prototype.setCookie = (c_name, value, expiredays) => {
        var exdate = new Date();　　　　
        exdate.setDate(exdate.getDate() + expiredays);　　　　
        document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
    }
    //获取cookie、
function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return (arr[2]);
    else
        return null;
}
Vue.prototype.getCookie = getCookie;

//删除cookie
Vue.prototype.delCookie = (name) => {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = getCookie(name);
        if (cval != null)
            document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
    }
    /* eslint-disable no-new */
const store = new Vuex.Store({
    state: {
        projectInfo: {
          restaurantName: '',
          userName: '',
          shopno: ''
        },

        loading: false,
    },
    mutations: {
        getProject(state, json) {
            for (var key in json) {
                state.projectInfo[key] = json[key];
            }
        },
        setLoading(state, value) {
            state.loading = value;
        }
        // setCreateTime(state, time) {
        //     state.createTime = time;
        // }
    }
});

new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: { App },
    watch: {
        "$route": 'checkLogin'
    },
    created() {
      /// window.sessionStorage.setItem('is-login-now','')
    },
    methods: {
        checkLogin() {
          if (!this.getCookie('mobile') ||
            ((!window.sessionStorage.getItem('id') || !window.sessionStorage.getItem('mobile')) && !window.sessionStorage.getItem('is-login-now'))) {
                this.$router.replace('/login');
            } else {
            }
        }
    }
})
window.console = window.console || (function() {
    var c = {};
    c.log = c.warn = c.debug = c.info = c.error = c.time = c.dir = c.profile = c.clear = c.exception = c.trace = c.assert = function() {};
    return c;
})();

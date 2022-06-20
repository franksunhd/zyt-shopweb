import axios from 'axios';
var root = "http://192.168.1.114:8380/zyt-http/"
// var root = "http://192.168.1.114:8280/zyt-http/"
// axios.defaults.headers.post['content-Type'] = 'application/json;charset=utf-8';

function toType(obj) {
  return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}
// 参数过滤函数
function filterNull(o) {
  for (var key in o) {
    if (o[key] === null) {
      delete o[key]
    }
    if (toType(o[key]) === 'string') {
      o[key] = o[key].trim()
    } else if (toType(o[key]) === 'object') {
      o[key] = filterNull(o[key])
    } else if (toType(o[key]) === 'array') {
      o[key] = filterNull(o[key])
    }
  }
  return o
}

var flag = 0;
var flag1 = 0;
function apiAxios(method, url, params, success, failure) {
  // 还原成白底的

  if (document.getElementById('appMain')) {
    document.getElementById('BrokenNetwork').style.display = 'none';
  }

  if (document.getElementById('homeCenter1')) {
    document.getElementById('BrokenNetwork').style.display = 'none';
  }

  if (document.getElementById('homeCenter2')) {
    document.getElementById('BrokenNetwork').style.display = 'none';
  }

  // 登录页
  if (document.getElementById('BrokenNetwork1')) {
    document.getElementById('BrokenNetwork1').style.display = 'none';
  }


  if (params) {
    params = filterNull(params)
  }
  axios({
    method: method,
    url: url,
    data: method === 'POST' || method === 'PUT' ? params : null,
    params: method === 'GET' || method === 'DELETE' ? params : null,
    baseURL: root,
    withCredentials: false,
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    }
  })
    .then(function(res) {
      if (res.data.errorcode == 0) {
        if (success) {
          success(res.data)
        }
      } else {
        if (failure) {
          failure(res.data)
        } else {
          window.alert('error: ' + JSON.stringify(res.data))
        }
      }
    })
    .catch(function(err) {
      flag++;
      flag1++;

      // 蒙版的
      if (document.querySelector('.el-loading-mask')) {
        document.getElementsByClassName('el-loading-mask')[0].innerHTML = '';
      }
      if (document.getElementById('homeCenter1')) {
        if (flag > 1) {
          document.getElementById('homeCenter1').style.visibility = 'hidden';
          document.getElementById('BrokenNetwork').style.display = 'block';
        } else {
          document.getElementById('BrokenNetwork').style.display = 'none';
        }
        return;
      }

      if (document.getElementById('homeCenter2')) {
        if (flag1 > 1) {
          document.getElementById('homeCenter2').style.visibility = 'hidden';
          document.getElementById('BrokenNetwork').style.display = 'block';
        } else {
          document.getElementById('BrokenNetwork').style.display = 'none';
        }
        return;
      }

      // 有 Box 的页面
      if (document.getElementById('appMain')) {
        document.getElementById('appMain').innerHTML = '';
        document.getElementById('appMain').removeAttribute('element-loading-text');
        if (document.querySelector('.el-loading-mask')) {
          document.getElementsByClassName('el-loading-mask')[0].innerHTML = '';
        }
        document.getElementById('BrokenNetwork').style.display = 'block';
      }

      // 登录页
      if (document.getElementById('BrokenNetwork1')) {
        document.getElementById('BrokenNetwork1').style.display = 'block';
        return;
      }


      return;
      let res = err.response
      // if (err) {
      //     window.alert('api error, HTTP CODE: ' + res.status)
      //     return
      // }
    })
}

// 返回在vue模板中的调用接口
export default {
  get: function(url, params, success, failure) {
    return apiAxios('GET', url, params, success, failure)
  },
  post: function(url, params, success, failure) {
    return apiAxios('POST', url, params, success, failure)
  },
  put: function(url, params, success, failure) {
    return apiAxios('PUT', url, params, success, failure)
  },
  delete: function(url, params, success, failure) {
    return apiAxios('DELETE', url, params, success, failure)
  }
}





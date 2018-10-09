// Cxiao
const express = require('express');
const Encrypt = require('./crypto.js');
const http = require('http');

const app = express();
const dir = "/v1";
let cookie = null;

const server = app.listen(3000, () => {
  console.log("服务启动...")
})

//创建请求
function createWebAPIRequest (path, data, c, response, method) {
  method = method ? method : "POST";
  let music_req = '';
  const cryptoreq = Encrypt(data);
  const http_client = http.request({
    hostname: 'music.163.com',
    method: method,
    path: path,
    headers: {
      'Accept': '*/*',
      'Accept-Language': 'zh-CN,zh;q=0.8,gl;q=0.6,zh-TW;q=0.4',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Refer': 'http://music.163.com',
      'Host': 'music.163.com',
      'Cookie': cookie,
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/602.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/602.1'
    }
  }, (res) => {
    res.on('err', () => {
      response.status(502).send('fetch error');
    })
    res.setEncoding('utf8');
    if (res.statusCode != 200) {
      createWebAPIRequest(path, data, c, response, medthod);
      return;
    } else {
      res.on('data', (chunk) => {
        music_req += chunk
      });
      res.on('end', () => {
        if (music_req == '') {
          createWebAPIRequest(path, data, c, response, method);
          return;
        }
        if (res.headers['set-cookie']) {
          cookie = baseCookie + ';' + res.headers['set-cookie'];
          response.send({
            code: 200,
            i: JSON.parse(music_req)
          });
          user = JSON.parse(music_req);
          return;
        }
        response.send(music_req);
      })
    }
  });
  http_client.write('params=' + cryptoreq.params + '&encSecKey=' + cryptoreq.encSecKey);
  http_client.end();
}

// 手机登录
app.get(dir + '/login/cellphone', (request, response) => {
  const phone = request.query.phone;
  const md5sum = crypto.createHash('md5');
  md5sum.update(request.query.password);
  const data = {
    'username': phone,
    'password': md5sum.digest('hex'),
    'rememberLogin': 'true'
  };
  createWebAPIRequest('/weapi/login/cellphone', data, null, response);
})

// 邮箱登录
app.get(dir + '/login', (request, response) => {
  const email = request.query.email;
  const md5sum = crypto.createHash('md5');
  md5sum.update(request.query.password);
  const data = {
    'username': email,
    'password': md5sum.digest('hex'),
    'rememberLogin': 'true'
  };
  createWebAPIRequest('/weapi/login', data, null, response);
})

// 登录信息刷新
app.get(dir + '/login/refresh', (request, response) => {
  const cookie = request.get('Cookie') ? request.get('Cookie') : (request.query.cookie ? request.query.cookie : '');
  let csrf = "";
  for (let i in cookie) {
    if (cookie[i].name == '__csrf') {
      csrf = cookie.value;
    }
  }
  csrf = request.query.t
  const data = {
    "csrf_token": csrf
  };
  createWebAPIRequest('/weapi/login/token/refresh?csrf_token' + csrf, data, cookie, response);
})

// banner - 请求数据为空
app.get(dir + '/banner', (request, response) => {
  const cookie = request.get('Cookie') ? request.get('Cookie') : (request.query.cookie ? request.query.cookie : '');
  const data = {
    "csrf_token": ""
  }
  createWebAPIRequest('/api/v2/banner/get', data, cookie, response, 'GET');
})

// 歌单类型列表
app.get(dir + '/playlist/catlist', (request, response) => {
  const cookie = request.get('Cookie') ? request.get('Cookie') : (request.query.cookie ? request.query.cookie : '');
  const data = {
    "csrf_token": ""
  };
  createWebAPIRequest('/weapi/playlist/catalogue', data, cookie, response);
})

// 歌单热门类型列表
app.get(dir + '/playlist/hot', (request, response) => {
  const cookie = request.get('Cookie') ? request.get('Cookie') : (request.query.cookie ? request.query.cookie : '');
  const data = {};
  createWebAPIRequest('/api/playlist/hottags', data, cookie, response);
})

// 推荐新音乐
app.get(dir + '/personalized/newsong', (request, response) => {
  const cookie = request.get('Cookie') ? request.get('Cookie') : (request.query.cookie ? request.query.cookie : '');
  const data = {
    type: "recommend"
  };
  createWebAPIRequest('/api/personalized/playlist', data, cookie, response);
})

// 推荐歌单
app.get(dir + '/personalized', (request, response) => {
  const cookie = request.get('Cookie') ? request.get('Cookie') : (request.query.cookie ? request.query.cookie : '');
  const data = {};
  createWebAPIRequest('/api/personalized/playlist', data, cookie, response);
})

// 推荐mv
app.get(dir + '/personalized/mv', (request, response) => {
  const cookie = request.get('Cookie') ? request.get('Cookie') : (request.query.cookie ? request.query.cookie : '');
  const data = {};
  createWebAPIRequest('/api/personalized/mv', data, cookie, response);
})

// 独家放送
app.get(dir + '/personalized/privatecontent', (request, response) => {
  const cookie = request.get('Cookie') ? request.get('Cookie') : (request.query.cookie ? request.query.cookie : '');
  const data = {};
  createWebAPIRequest('/api/personalized/privatecontent', data, cookie, response);
})

//推荐dj
app.get(dir + '/personalized/djprogram', (request, response) => {
  const cookie = request.get('Cookie') ? request.get('Cookie') : (request.query.cookie ? request.query.cookie : '');
  const data = {};
  createWebAPIRequest('/api/personalized/djprogram', data, cookie, response);
})

// 推荐top
app.get(dir + '/personalized/topic', (request, response) => {
  const cookie = request.get('Cookie') ? request.get('Cookie') : (request.query.cookie ? request.query.cookie : '');
  const data = {};
  createWebAPIRequest('/weapi/personalized/topic', data, cookie, response);
})

// 每日推荐歌曲
app.get(dir + '/recommend/songs', (request, response) => {
  const cookie = request.get('Cookie') ? request.get('Cookie') : (request.query.cookie ? request.query.cookie : '');
  const data = {
    "offset": 0,
    "total": true,
    "limit": 20,
    "csrf_token": ""
  };
  createWebAPIRequest('/weapi/v1/discovery/recommend/songs', data, cookie, response);
})

// 取消推荐
app.get(dir + '/recommend/dislike', (request, response) => {
  const cookie = request.get('Cookie') ? request.get('Cookie') : (request.query.cookie ? request.query.cookie : '');
  const data = {
    "resId": request.query.id,
    "resType": request.query.type,
    "alg": request.query.alg, // 'itembased2'
    "csrf_token": ""
  };
  createWebAPIRequest('/weapi/discovery/recommend/dislike', data, cookie, response);
})

// 每日推荐歌单
app.get(dir + '/recommend/resource', (request, response) => {
  const cookie = request.get('Cookie') ? request.get('Cookie') : (request.query.cookie ? request.query.cookie : '');
  const data = {
    "offset": 0,
    "limit": 20,
    "total": "True",
    "csrf_token": ""
  };
  createWebAPIRequest('/weapi/discovery/recommend/resource', data, cookie, response);
})

// 收藏歌曲到歌单，从歌单删除歌曲 op=del, add; pid = 歌单id, tracks = 歌曲id
app.get(dir + '/playlist/tracks', function(request, response) {
	var op = request.query.op
	var pid = request.query.pid;
	var tracks = request.query.tracks;
	var cookie = request.get('Cookie') ? request.get('Cookie') : (request.query.cookie ? request.query.cookie : '');
	var data = {
		"op": op,
		"pid": pid,
		"tracks": tracks,
		"trackIds": JSON.stringify([tracks]),
		"csrf_token": "",
	};
	createWebAPIRequest('/weapi/playlist/manipulate/tracks', data, cookie, response)
});

// 搜索
app.get(dir + '/search', function(request, response) {
	var keywords = request.query.keywords || '';
	var type = request.query.type || 1;
	var offset = request.query.offset || '0';
	var limit = request.query.limit || 20;
	var cookie = request.get('Cookie') ? request.get('Cookie') : (request.query.cookie ? request.query.cookie : '');
	var data = {
		"s": keywords,
		"offset": offset,
		"limit": limit,
		"type": type
	};
	createWebAPIRequest('/weapi/cloudsearch/get/web', data, cookie, response)
});

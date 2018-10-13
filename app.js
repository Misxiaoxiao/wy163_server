// Cxiao
const express = require('express');
const apicache = require('apicache');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const { completeCookie } = require('./util/init');
const { createWebAPIRequest, request } = require('./util/util')

const app = express();
const cache = apicache.middleware;
const port = process.env.PORT || 3000;
// 因为这几个文件对外所注册的路由 和 其他文件对外注册的路由规则不一样, 所以专门写个MAP对这些文件做特殊处理
const UnusualRouteFileMap = {
  // key 为文件名, value 为对外注册的路由
  'daily_signin.js': '/daily_signin',
  'fm_trash.js': '/fm_trash',
  'personal_fm.js': '/personal_fm'
}

const onlyStatus200 = (req, res) => res.statusCode === 200;
// 简化 路由 导出方式, 由这里统一对 router 目录中导出的路由做包装, 路由实际对应的文件只专注做它该做的事情, 不用重复写样板代码
const Wrap = fn => (req, res) => fn(req, res, createWebAPIRequest, request);

// 监测版本信息 需要npm发布
// exec('npm info wy163_server version', (err, stdout, stderr) => {
//   if (err) {
//     console.log(err);
//     return;
//   }
//   const onlinePackageVersion = stdout.trim();
//   const package = require('./package.json');
//   if (package.version < onlinePackageVersion) {
//     console.log(
//       '最新版:Version:' +
//       onlinePackageVersion +
//         ',当前版本:' +
//         package.version +
//         ',请及时更新'
//     )
//   }
// })

// 跨域设置
app.all('*', (req, res, next) => {
  if (req.path !== '/' && !req.path.includes('.')) {
    res.header('Access-Control-Allow-Credentials', true);
    // 这里获取 origin 请求头 而不是用 *
    res.header('Access-Control-Allow-Origin', req.headers['origin'] || '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With')
    res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
    res.header('Content-Type', 'application/json;charset=utf-8')
  }
  next();
})

app.use(cache('2 minutes', onlyStatus200));

app.use(express.static(path.resolve(__dirname, 'public')));

app.use((req, res, next) => {
  const proxy = req.query.proxy;
  if (proxy) {
    req.headers.cookie += `__proxy__${proxy}`;
  }
  next();
})

// 补全缺失的cookie
app.use((req, res, next) => {
  const cookie = completeCookie(req.headers.cookie);
  req.headers.cookie = cookie.map(x => x[0]).concat(req.headers.cookie || []).join('; ');
  res.append('Set-Cookie', cookie.map(x => (x.concat('Path=/').join('; '))));
  next();
})

// 同步读取 router 目录中的js文件, 根据命名规则, 自动注册路由
fs.readdirSync(path.resolve(__dirname, 'router'))
  .reverse()
  .forEach(file => {
    if (/\.js$/i.test(file) === false) {
      return;
    }

    let route;

    if (typeof UnusualRouteFileMap[file] !== 'undefined') {
      route = UnusualRouteFileMap[file];
    } else {
      route = '/' + file.replace(/\.js$/i, '')
                        .replace(/_/g, '/')
    }
    app.use(route, Wrap(require('./router/' + file)));
  })

// 注册请求服务
app.server = app.listen(port, () => {
  console.log(`server running @ http://localhost:${port}`);
})

module.export = app;

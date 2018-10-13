const crypto = require('crypto');

//邮箱登录 此接口被和谐了 待调整
module.exports = (req, res, createWebAPIRequest, request) => {
  const email = req.query.email;
  const cookie = req.get('Cookie') ? req.get('Cookie') : '';
  const md5sum = crypto.createHash('md5');
  md5sum.update(req.query.password);
  const data = {
    username: email,
    password: md5sum.digest('hex'),
    rememberLogin: 'true'
  }
  console.log(email, req.query.password);

  createWebAPIRequest(
    'music.163.com',
    '/weapi/login',
    'POST',
    data,cookie,
    (music_req, cookie) => {
      res.append('Set-Cookie', cookie);
      res.send(music_req);
    },
    err => res.status(502).send('fetch error')
  )
}

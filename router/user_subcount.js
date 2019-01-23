// 获取用户信息 , 歌单，收藏，mv, dj 数量
// 更新用户信息
module.export = (req, res, createWebAPIRequest, request) => {
  const cookie = req.get('Cookie') ? req.get('Cookie') : '';
  const data = {
    csrf_token: ''
  };
  createWebAPIRequest(
    "music.163.com",
    "/weapi/subcount",
    "POST",
    data,
    cookie,
    music_req => res.send(music_req),
    err => res.status(502).send("fetch error")
  )
}

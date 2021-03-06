// 新歌速递
module.exports = (req, res, createWebAPIRequest, request) => {
  const cookie = req.get("Cookie") ? req.get("Cookie") : "";
  const data = {
    csrf_token: "",
    areaId: req.query.type || 0,
    // limit: req.query.limit || 100,
    // offset: req.query.offset || 0,
    total: true,
  };
  createWebAPIRequest(
    "music.163.com",
    "/weapi/v1/discovery/new/songs",
    "POST",
    data,
    cookie,
    music_req => {
      res.send(music_req);
    },
    err => res.status(502).send("fetch error")
  );
};

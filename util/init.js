// 随机字符串
const randomString = (pattern, length) => {
  return Array.apply(null, {length: length}).map(() => (pattern[Math.floor(Math.random() * pattern.length)])).join('');
}

const completeCookie = (cookie) => {
  let origin = (cookie || '').split(/;\s*/).map(element => (element.split('=')[0])),
      extra = [],
      now = (new Date).getTime();
  
  if (!origin.includes('JSESSIONID-WYYY')) {
    const expire = new Date(now + 1800000); // 30 minutes
    const jessionid = randomString('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKMNOPQRSTUVWXYZ\\/+', 176) + ':' + expire.getTime();
    extra.push(['JSESSIONID-WYYY=' + jessionid, 'Expires=' + expire.toGMTString()]);
  }
  if (!origin.includes('_iuqxldmzr_')) {
    const expire = new Date(now + 157680000000) // 5 years
    extra.push(['_iuqxldmzr_=32', 'Expires=' + expire.toGMTString()]);
  }
  if ((!origin.includes('_ntes_nnid')) || (!origin.includes('_ntes_nuid'))) {
    const expire = new Date(now + 3153600000000) // 100 years
    const nnid = randomString('0123456789abcdefghijklmnopqrstuvwxyz', 32) + ',' + now;
    extra.push(['_ntes_nnid=' + nnid, 'Expires=' + expire.toGMTString()]);
    extra.push(['_ntes_nuid=' + nnid.slice(0, 32), 'Expires=' + expire.toGMTString()]);
  }
  return extra;
}

module.exports = {
  completeCookie
}

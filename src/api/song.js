import {
  jsonp
} from 'common/js/jsonp'

function getSongUrl(songList) {
  if (!songList) {
    return
  }
  songList.forEach(song => {
    if (song.mid && song.url) {
      getSongKey(song.mid).then(res => {
        const vkey = res.data.items[0].vkey
        song.url = song.url.replace('__vkey__', vkey)
      })
    }
  })
}

function getSongKey(songmid) {
  // 获取歌曲的 vkey 以拼接音乐的 url
  const url = 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg'
  const data = Object.assign({}, {
    callback: 'musicJsonCallback',
    loginUin: 3051522991,
    format: 'jsonp',
    platform: 'yqq',
    cid: 205361747,
    uin: 3051522991,
    guid: 5931742855,
    songmid: songmid,
    filename: `C400${songmid}.m4a`
  })
  return jsonp(url, data)
}

export {
  getSongUrl
}

import {
  commonParams
} from './config'
import axios from 'axios'
// import {
//   ERR_OK
// } from 'api/config'
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

function getLyric(mid) {
  const url = '/api/getLyric'
  const data = Object.assign({}, commonParams, {
    songmid: mid,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    categoryId: 10000000,
    pcachetime: +new Date(),
    format: 'json'
  })

  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}

export {
  getSongUrl,
  getLyric
}

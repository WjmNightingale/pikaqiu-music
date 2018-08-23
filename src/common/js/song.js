import { getLyric } from 'api/song'
import { ERR_OK } from 'api/config'

import { Base64 } from 'js-base64'
class Song {
  constructor({ id, mid, singer, name, album, duration, img, url }) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.img = img
    this.url = url
  }
  getLyric() {
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }
    return new Promise((resolve, reject) => {
      getLyric(this.mid).then(
        res => {
          if (res.retcode === ERR_OK) {
            console.log(Base64.decode)
            this.lyric = Base64.decode(res.lyric)
            resolve(this.lyric)
          } else {
            console.log('歌词获取失败')
            this.lyric = 'No lyric'
          }
        },
        err => {
          reject(err)
        }
      )
    })
  }
}

function createSong(musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    img: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${
      musicData.albummid
    }.jpg?max_age=2592000`,
    url: `http://dl.stream.qqmusic.qq.com/C400${
      musicData.songmid
    }.m4a?vkey=__vkey__&guid=5931742855&fromtag=38`
  })
}

function filterSinger(singer) {
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach(s => {
    ret.push(s.name)
  })
  return ret.join('/')
}
export { createSong }

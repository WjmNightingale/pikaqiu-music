import {
  commonParams,
  options
} from './config'
import {
  jsonp
} from 'common/js/jsonp'
// import axios from 'axios'

function getTopList() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'
  const data = Object.assign({}, commonParams, {
    uin: 0,
    needNewCode: 1,
    platform: 'h5'
  })
  return jsonp(url, data, options)
}

function getMusicList(topid) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'
  const data = Object.assign({}, commonParams, {
    topid,
    uin: 0,
    tpl: 3,
    page: 'detail',
    type: 'top',
    needNewCode: 1,
    platform: 'h5'
  })
  return jsonp(url, data, options)
}
export {
  getTopList,
  getMusicList
}

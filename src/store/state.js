import {
  playMode
} from 'common/js/config'

import {
  loadSearch
} from 'common/js/cache'

// 基础数据

const state = {
  singer: {},
  disc: {},
  topList: {},
  // 是否正在播放
  playing: false,
  // 是否全凭
  fullScreen: false,
  // 播放列表
  playList: [],
  // 顺序播放
  sequenceList: [],
  // 播放模式
  mode: playMode.sequence,
  // 当前播放歌曲的索引
  currentIndex: -1,
  // 搜索历史
  searchHistory: loadSearch()
}

export default state

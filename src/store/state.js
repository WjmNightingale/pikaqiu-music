import {
  playMode
} from 'common/js/config'

// 基础数据

const state = {
  singer: {},
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
  currentIndex: -1
}

export default state

// 定义数据在mutation后如何获取
const singer = state => state.singer

const disc = state => state.disc

const topList = state => state.topList

const playing = state => state.playing

const fullScreen = state => state.fullScreen

const playList = state => state.playList

const sequenceList = state => state.sequenceList

const mode = state => state.mode

const currentIndex = state => state.currentIndex

const currentSong = (state) => {
  return state.playList[state.currentIndex] || {}
}

const searchHistory = (state) => {
  return state.searchHistory
}

const playHistory = (state) => {
  return state.playHistory
}

const favoriteList = (state) => {
  return state.favoriteList
}

export {
  singer,
  disc,
  topList,
  playing,
  fullScreen,
  playList,
  sequenceList,
  mode,
  currentIndex,
  currentSong,
  playHistory,
  searchHistory,
  favoriteList
}

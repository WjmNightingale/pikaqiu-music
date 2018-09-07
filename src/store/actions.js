import * as types from './mutation-types'
import {
  playMode
} from 'common/js/config'
import {
  shuffle
} from 'common/js/util'
import {
  saveSearch,
  deleteSearch,
  clearSearch,
  savePlay,
  saveFavorite,
  deleteFavorite
} from 'common/js/cache'

function findIndex(list, currentSong) {
  return list.findIndex(item => item.id === currentSong.id)
}

const selectPlay = function ({
  commit,
  state
}, {
  list,
  index
}) {
  // updateList -- 需要更新的播放列表
  // updateIndex -- 需要更新的 currentIndex
  let updateList, updateIndex
  if (state.mode === playMode.random) {
    // 如果是随机播放
    updateList = shuffle(list)
    updateIndex = findIndex(updateList, list[index])
  } else {
    // 非随机播放
    updateList = list
    updateIndex = index
  }
  commit(types.SET_SEQUENCE_LIST, list)
  commit(types.SET_PLAY_LIST, updateList)
  commit(types.SET_CURRENT_INDEX, updateIndex)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

const randomPlay = function ({
  commit
}, {
  list
}) {
  commit(types.SET_MODE, playMode.random)
  commit(types.SET_SEQUENCE_LIST, list)
  let randomList = shuffle(list)
  commit(types.SET_PLAY_LIST, randomList)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

const insertSong = function ({
  commit,
  state
}, song) {
  // array.slice()会返回一个数组副本
  // Array.prototype.slice()
  // 该方法返回一个从开始到结束（不包括结束）选择的数组的一部分浅拷贝到一个新数组对象。且原始数组不会被修改。
  let playList = state.playList.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  // 记录当前歌曲
  let currentSong = playList[currentIndex]
  // 查找待插入的歌曲是否存在于已有歌曲的列表当中
  // 并返回这个索引值
  let fpIndex = findIndex(playList, song)
  // 将歌曲插入
  currentIndex += 1
  // 当前索引的位置插入
  playList.splice(currentIndex, 0, song)
  //  更改playList 如果包含这首歌
  if (fpIndex > -1) {
    // 插入歌曲的当前索引 大于已存在的歌曲的索引(两首歌是一样的)
    // ['1','3','4'] => ['1','3','4','3'] => ['1','4','3']
    if (currentIndex > fpIndex) {
      playList.splice(fpIndex, 1)
      currentIndex--
    } else {
      // ['1','3','4'] => ['1','4','3','4'] => ['1','4','3']
      playList.splice(fpIndex + 1, 1)
    }
  }
  // 更改sequenceList
  let currentSIndex = findIndex(sequenceList, currentSong) + 1
  let fsIndex = findIndex(sequenceList, song)
  sequenceList.splice(currentSIndex, 0, song)
  // 如果包含这首歌
  if (fsIndex > -1) {
    if (currentSIndex > fsIndex) {
      sequenceList.splice(fsIndex, 1)
    } else {
      sequenceList.splice(fsIndex + 1, 1)
    }
  }

  commit(types.SET_PLAY_LIST, playList)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

// 歌曲相关
const deleteSong = function ({
  commit,
  state
}, song) {
  let playList = state.playList.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  let fpIndex = findIndex(playList, song)
  playList.splice(fpIndex, 1)
  let fsIndex = findIndex(sequenceList, song)
  sequenceList.splice(fsIndex, 1)
  if (currentIndex > fpIndex || currentIndex === playList.length) {
    currentIndex--
  }

  commit(types.SET_PLAY_LIST, playList)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)

  if (!playList.length) {
    commit(types.SET_PLAYING_STATE, false)
  } else {
    commit(types.SET_PLAYING_STATE, true)
  }
}

// 歌曲列表相关
const deleteSongList = function ({
  commit
}) {
  commit(types.SET_CURRENT_INDEX, -1)
  commit(types.SET_PLAY_LIST, [])
  commit(types.SET_SEQUENCE_LIST, [])
  commit(types.SET_PLAYING_STATE, false)
}

// 搜索历史相关
const saveSearchHistory = function ({
  commit
}, query) {
  commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}

const deleteSearchHistory = function ({
  commit
}, query) {
  commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
}

const clearSearchHistory = function ({
  commit
}) {
  commit(types.SET_SEARCH_HISTORY, clearSearch())
}

// 播放历史相关
const savePlayHistory = function ({
  commit
}, song) {
  commit(types.SET_PLAY_HISTORY, savePlay(song))
}

// 喜欢相关

const saveFavoriteList = function ({
  commit
}, song) {
  commit(types.SET_FAVORITE_LIST, saveFavorite(song))
}

const deleteFavoriteList = function ({
  commit
}, song) {
  commit(types.SET_FAVORITE_LIST, deleteFavorite(song))
}

export {
  selectPlay,
  randomPlay,
  insertSong,
  deleteSong,
  deleteSongList,
  saveSearchHistory,
  deleteSearchHistory,
  clearSearchHistory,
  savePlayHistory,
  saveFavoriteList,
  deleteFavoriteList
}

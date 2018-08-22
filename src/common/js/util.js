function shuffle(arr) {
  // 打乱数组
  for (let i = 0; i < arr.length; i++) {
    let j = getRandomInt(0, i)
    let tmp = arr[i]
    arr[i] = arr[j]
    arr[j] = tmp
  }
  return arr
}

function getRandomInt(min, max) {
  // 返回一个 (min, max] 区间的随机数，包括 max
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export {
  shuffle
}

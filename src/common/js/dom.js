function addClass(el, className) {
  if (hasClass(el, className)) {
    return
  }
}

function hasClass(el, className) {
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el.className)
}

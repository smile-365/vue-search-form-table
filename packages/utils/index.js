export const cloneDeep = (source) => {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

// 防抖
export function debounce(fn, delay) {
  let timer = null
  let delays =  delay || 200
  // 使用闭包，保证每次使用的定时器是同一个
  return function(...args) {
    clearTimeout(timer)
    timer = setTimeout(()=>{
      fn.apply(this, args)
      // 结束之后清除定时器
      clearTimeout(timer)
      timer = null
    }, delays)
  }
}

export function throttle(fn, delay){
  let timer = null
  let delays =  delay || 200
  return function(...args) {
    if(!timer) {
      timer = setTimeout(() => {
        clearTimeout(timer)
        timer = null
      }, delays)
      fn.apply(this, args)
    }
  }
}
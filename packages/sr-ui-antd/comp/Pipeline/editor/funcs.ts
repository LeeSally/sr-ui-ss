/**
   * Clone object using JSON.parse method
   * @param {any} raw
   */
const cloneObject = (raw: any) => {
  if (raw === undefined) return

  try {
    const clonedObj = JSON.parse(JSON.stringify(raw))
    return clonedObj
  } catch (error) {
    console.error('[Error] JSON parse', raw, error)
    return
  }
}

export {
  cloneObject
}
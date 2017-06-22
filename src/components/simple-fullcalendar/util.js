function getDurationsDays (startTime, endTime) {
  if (!startTime || !endTime) return -1
  let startDays = _getDays(startTime)
  let endDays = _getDays(endTime)

  if (startDays > endDays) return -1
  return endDays - startDays + 1
}

function getTime (time) {
  return new Date(time).getTime()
}

function _getDays (time) {
  let ms = new Date(time).getTime()
  return ms / (1000 * 60 * 60 * 24)
}

export {
  getDurationsDays,
  getTime
}

const hash = function(str, seed = 0) {
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1>>>16), 2246822507) ^ Math.imul(h2 ^ (h2>>>13), 3266489909);
    h2 = Math.imul(h2 ^ (h2>>>16), 2246822507) ^ Math.imul(h1 ^ (h1>>>13), 3266489909);
    return 4294967296 * (2097151 & h2) + (h1>>>0);
  };
  
  function mulberry32(a) {
    return function() {
      var t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
  }

var debug = false

const offsetFromDate = new Date("27 August 2023")
const msOffset = getTodaysDate() - offsetFromDate
const dayOffset = Math.floor(msOffset / 1000 / 60 / 60 / 24)

var targetSong //Object containing information on current song
var formattedLyrics = []
var repeatChorus = false

function getTodaysDate() {
  if (debug) {
    return new Date("31 August 2023")
  } else {
    return new Date()
  }
}

async function retrieveSong(name) {
    var song = await fetch(`songs/${name}.song`)
    var data = await song.json()
    return data
}

function getStringFromDate(date) {
  return`${date.getUTCDate()}/${date.getUTCMonth()}/${date.getUTCFullYear()}`
}

function loadCurrentGame() {

  let current = JSON.parse(window.localStorage.getItem("current"))
  if (current) {
    if (current.date == getStringFromDate(getTodaysDate())) {
      return current
    } else {
      return null
    }
  } else {
    firstTime()
    return null
  }
}

function retrieveStats() {
  let stats = window.localStorage.getItem("stats")
  if (stats) {
    stats = JSON.parse(stats)
    return stats
  }
}

function saveFinishedGame(gameStats) {

  let stats = window.localStorage.getItem("stats")

  if (!stats) {
    stats = {}
  } else {
    stats = JSON.parse(stats)
  }

  if (!Object.keys(stats).includes(getStringFromDate(getTodaysDate()))) {
    stats[getStringFromDate(getTodaysDate())] = gameStats
    window.localStorage.setItem("stats", JSON.stringify(stats))
  } else {
    console.log("Already Saved Today's Game")
  }

}


function saveCurrentGame(startTime, words, endTime=undefined) {

  let current = {
    date:getStringFromDate(getTodaysDate()),
    start:startTime,
    endTime:endTime,
    words:words,
  }

  window.localStorage.setItem("current", JSON.stringify(current))

}

function firstTime() {
  let current = {date:getTodaysDate()}
  window.localStorage.setItem("current", JSON.stringify(current))
  window.localStorage.setItem("stats", JSON.stringify({}))
}

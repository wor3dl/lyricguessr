const lyricContainer = document.getElementById("lyric-container")
const inputField = document.getElementById("input-container")
const lyricInput = document.getElementById("lyric-input")

var alertContainer = document.getElementById("alert-container")

var lyrics = []
var unpunctuatedLyrics = []
var unpunctuatedLyricsOriginal = []
var lastGuess = []

var startTime
var endTime
var correctWords = []
var correctCount = 0
var timeUpdateInterval
var fullSongName = songList[dayOffset]

//Everything inside here is executed after the target song has been loaded
retrieveSong(fullSongName).then(data => {

    targetSong = data

    document.getElementById("song-name").innerText = targetSong.title
    document.getElementById("song-artist").innerText = targetSong.artist
    document.getElementById("thumbnail").src = targetSong.albumArt
        
    for (let header of Object.keys(targetSong.lyrics)) {
        lyrics = lyrics.concat(targetSong.lyrics[header].lyrics)
    }

    lyrics.forEach(function(lyric) {
        createLyric(lyric)
        unpunctuatedLyrics.push(lyric.replaceAll(/[^A-Za-z]/g, "").toLowerCase())
        unpunctuatedLyricsOriginal.push(lyric.replaceAll(/[^A-Za-z]/g, "").toLowerCase())
    })
    // let lyricDOM = document.createElement("fakelyric")
    // lyricDOM.innerHTML = ""
    // lyricContainer.appendChild(lyricDOM)

    for (let i = 0; i < 5; i++) {
        UnhideLyric(unpunctuatedLyrics[i])
    }
    UnhideLyric("")
    lastGuess.forEach((element) => {
        element.classList.add("correct")
    })

    //Retrieving Current Game

    var current = loadCurrentGame()

    if (current) {
  
      correctWords = current.words
      startTime = current.start
  
      for (let word of correctWords) {
          UnhideLyric(word)
      }

      if (current.endTime) {
        endTime = current.endTime
        endGame()
      } else {
        timeUpdateInterval = setInterval(updateTime, 500)
      }
  
    } else {
        //Run shit here for the first time the game is opened this day
    }

    document.getElementById("total").innerText = getTotalLyrics()
    
})

function getEndTime() {
    if (endTime) {
        return endTime
    } else {
        return (new Date()).getTime()
    }

}

function getTimeString(milliseconds) {
    if (!milliseconds || milliseconds == 0) {
        return "00:00"
    }
    let passedTime = milliseconds
    let hours = Math.floor(passedTime/1000/60/60)
    let minutes = Math.floor(passedTime/1000/60)-(hours*60)
    let seconds = Math.floor(passedTime/1000) - (hours*60*60) - (minutes*60)
    return (hours > 0 ? hours.toString().padStart(2, "0")+":" : "") + minutes.toString().padStart(2, "0")+":" + seconds.toString().padStart(2, "0")
}

function updateTime() {
    if (!startTime) return
    let text = getTimeString(getEndTime()-startTime)
    document.getElementById("time").innerHTML = text
}

function createLyric(lyric) {
    let lyricDOM = document.createElement("lyric")
    lyricDOM.innerHTML = lyric
    lyricContainer.appendChild(lyricDOM)
}

function UnhideLyric(lyric) {
    lastGuess.forEach((element) => {
        element.classList.remove("just-correct")
        
    })
    while (unpunctuatedLyrics.indexOf(lyric) != -1) {
        let index = unpunctuatedLyrics.indexOf(lyric)
        unpunctuatedLyrics[index] = null
        lyricContainer.children[index].classList.add("correct")
        lastGuess.push(lyricContainer.children[index])
        if (!(lyric === "")) {
            lyricContainer.children[index].classList.add("just-correct")
            correctCount += 1
            if (correctCount >= unpunctuatedLyrics.length) {
                endGame()
            }
        }
    }
    document.getElementById("correct").innerHTML = correctCount.toString()

}

SubmitGuess = function() {
    let inputString = lyricInput.value.replaceAll(/[^A-Za-z]/g, "").toLowerCase()
    if (unpunctuatedLyrics.includes(inputString)) {
        UnhideLyric(inputString)
        GuessFlash("green")
        correctWords.push(inputString)
        saveCurrentGame(startTime, correctWords)

        if (!timeUpdateInterval) {
            timeUpdateInterval = setInterval(updateTime, 500)
            startTime = (new Date()).getTime()
        }

    } else {
        if (unpunctuatedLyricsOriginal.includes(inputString)) {
            GuessFlash("orange")
        } else {
            GuessFlash("red")
        }
    }
    lyricInput.value = ""
}

GuessFlash = function(colour) {
    lyricInput.style = `background-color: ${colour}`
    setTimeout(() => {lyricInput.style = "background-color: transparent"}, 75)
}

document.onkeydown = function(keyPressed) {

    lyricInput.focus()

    if (keyPressed.key == "Enter" || keyPressed.key == " ") {
        SubmitGuess()
    }
}

inputField.oninput = function() {
    let inputString = lyricInput.value = lyricInput.value.replaceAll(/[^A-Za-z]/g, "").toLowerCase()
    if (inputString == "") {
        lyricInput.style = `background-color: transparent`
        return
    }
    if (unpunctuatedLyrics.includes(inputString)) {
        lyricInput.style = `background-color: green`
    } else {
        if (unpunctuatedLyricsOriginal.includes(inputString)) {
            lyricInput.style = `background-color: orange`
        } else {
            lyricInput.style = `background-color: red`
        }
    }
}

function showAlert(message, colour = "", duration = 1000) {
    const alert = document.createElement("div")
    alert.textContent = message
    alert.classList.add("alert")
    alertContainer.appendChild(alert)
    if (duration == null) return
  
    setTimeout(() => {
      alert.classList.add("hide")
      alert.addEventListener("transitionend", () => {
        alert.remove()
      })
    }, duration)
  }
  
function getOverflowPercent() {
    return document.getElementById("song-name").scrollWidth/document.getElementById("song-name").offsetWidth
}

function getTotalLyrics() {
    let count = 0
    unpunctuatedLyricsOriginal.forEach(function(element) {
        if (element != "") {count++}
    })
    return count
}

function endGame() {

    for (let lyric of lyricContainer.children) {
        if (lyric.classList.contains("correct")) {
            lyric.classList.add("just-correct")
        } else {
            lyric.classList.add("missed")
        }
    }


    if (!endTime) endTime = (new Date()).getTime()
    saveCurrentGame(startTime, correctWords, endTime)
    document.getElementById("stop-confirmation").style.display = "none"
    document.getElementById("lyric-container").style.display = "none"
    document.getElementById("lyric-container").style.paddingTop = "0px"
    document.getElementById("input-container").style.display = "none"
    document.getElementById("privacy").style.display = "flex"
    document.getElementById("end-screen").style.display = "flex"
    document.getElementById("percent-text").innerHTML = Math.round((correctCount/getTotalLyrics())*100).toString()+"%"
    document.getElementById("correct-end").innerHTML = correctCount.toString()
    document.getElementById("total-end").innerHTML = getTotalLyrics()
    document.getElementById("stop").style.display = "none"
    document.getElementById("time-end").innerHTML = getTimeString(getEndTime()-startTime)
    //This doesn't really make sense as you don't type all of these words but i needed to pad out the stats
    document.getElementById("wpm-end").innerHTML = startTime != undefined ? correctCount/(Math.round(((getEndTime()-startTime)/1000)/6)/10).toString()+" wpm" : 0 + " wpm"

    clearInterval(timeUpdateInterval)

    let stats = {
        correct:correctCount,
        total:unpunctuatedLyrics.length,
        time:(new Date()).getTime()-startTime,
        song:fullSongName,
    }

    saveFinishedGame(stats)
    calculateAllTimeStats()

}

function lyricsClicked() {
    document.getElementById("lyric-container").style.display = "flex"
    document.getElementById("lyrics-button").classList.add("selected")
    document.getElementById("today").style.display = "none"
    document.getElementById("today-button").classList.remove("selected")
    document.getElementById("all-time").style.display = "none"
    document.getElementById("all-time-button").classList.remove("selected")
}

function todayClicked() {
    document.getElementById("today").style.display = "flex"
    document.getElementById("today-button").classList.add("selected")
    document.getElementById("all-time").style.display = "none"
    document.getElementById("all-time-button").classList.remove("selected")
    document.getElementById("lyric-container").style.display = "none"
    document.getElementById("lyrics-button").classList.remove("selected")


}

function allTimeClicked() {
    document.getElementById("today").style.display = "none"
    document.getElementById("today-button").classList.remove("selected")
    document.getElementById("all-time").style.display = "flex"
    document.getElementById("all-time-button").classList.add("selected")
    document.getElementById("lyric-container").style.display = "none"
    document.getElementById("lyrics-button").classList.remove("selected")

}

function continueGame() {
    document.getElementById("stop-confirmation").style.display = "none"
}

function stopClicked() {
    document.getElementById("stop-confirmation").style.display = "flex"
}

function openSettings() {
    document.getElementById("settings").style.display = "flex"
}

function exitSettings() {
    document.getElementById("settings").style.display = "none"
}

function calculateAllTimeStats() {

    let stats = retrieveStats()

    let best = {song:undefined, correct:0, time:999999999999}
    
    for (let day of Object.keys(stats)) {
        if (!best.song) {
            best.song = stats[day].song
            best.correct = stats[day].correct/stats[day].total
            best.time = stats[day].time
            continue
        }
        if (stats[day].correct/stats[day].total > best.correct) {
            best.song = stats[day].song
            best.correct = stats[day].correct/stats[day].total
            best.time = stats[day].time

        } else if (stats[day].correct/stats[day].total == best.correct && stats[day].time < best.time) {
            best.song = stats[day].song
            best.correct = stats[day].correct/stats[day].total
            best.time = stats[day].time
        }
    }
    retrieveSong(best.song).then(data => {
        document.getElementById("best-thumbnail").src = data.albumArt
        document.getElementById("best-title").innerHTML = data.title
        document.getElementById("best-artist").innerHTML = data.artist
        document.getElementById("best-percent").innerHTML = Math.round(best.correct*100).toString()+"%"
        document.getElementById("best-time").innerHTML = getTimeString(best.time)
    })
    

}

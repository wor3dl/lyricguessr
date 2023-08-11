const lyricContainer = document.getElementById("lyric-container")
const inputField = document.getElementById("input-container")
const lyricInput = document.getElementById("lyric-input")

var alertContainer = document.getElementById("alert-container")

var lyrics = []
var unpunctuatedLyrics = []
var unpunctuatedLyricsOriginal = []
var lastGuess = []

var startTime
var currentTime = "00:00:00"
var correctWords = []

//Everything inside here is executed after the target song has been loaded
retrieveSong(songList[dayOffset]).then(data => {

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

    UnhideLyric("")
    lastGuess.forEach((element) => {
        element.style = "color: white"
    })

    //Retrieving Current Game

    var current = loadCurrentGame()

    if (current) {
  
      correctWords = current.words
      startTime = current.start
  
      for (let word of correctWords) {
          UnhideLyric(word)
      }
  
    } else {
      startTime = getStringFromTime(new Date())
    }

    document.getElementById("total").innerText = unpunctuatedLyrics.length


    
})

function createLyric(lyric) {
    let lyricDOM = document.createElement("lyric")
    lyricDOM.innerHTML = lyric
    lyricContainer.appendChild(lyricDOM)
}

function UnhideLyric(lyric) {
    lastGuess.forEach((element) => {
        element.style = "color: white"
    })
    while (unpunctuatedLyrics.indexOf(lyric) != -1) {
        let index = unpunctuatedLyrics.indexOf(lyric)
        unpunctuatedLyrics[index] = null
        lyricContainer.children[index].style = "color: white; background-color: green"
        lastGuess.push(lyricContainer.children[index])
    }
}

SubmitGuess = function() {
    let inputString = lyricInput.value.replaceAll(/[^A-Za-z]/g, "").toLowerCase()
    if (unpunctuatedLyrics.includes(inputString)) {
        UnhideLyric(inputString)
        GuessFlash("green")
        correctWords.push(inputString)
        saveCurrentGame(startTime, correctWords)
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

    if (keyPressed.key == "Enter") {
        SubmitGuess()
    }
}

inputField.oninput = function() {
    let inputString = lyricInput.value.replaceAll(/[^A-Za-z]/g, "").toLowerCase()
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
  


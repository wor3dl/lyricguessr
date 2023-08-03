const lyricContainer = document.getElementById("lyric-container")
const inputField = document.getElementById("input-container")
const lyricInput = document.getElementById("lyric-input")

// var lyrics = targetSong.lyrics.split(" ")
var lyrics = ["a", "b", "jamO'#'n123A", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", ]
var unpunctuatedLyrics = []

lyrics.forEach(function(lyric) {
    createLyric(lyric)
    unpunctuatedLyrics.push(lyric.replaceAll(/[^A-Za-z]/g, "").toLowerCase())
})

function createLyric(lyric) {
    let lyricDOM = document.createElement("lyric")
    lyricDOM.innerHTML = lyric
    lyricContainer.appendChild(lyricDOM)
}

function UnhideLyric(lyric) {
    while (unpunctuatedLyrics.indexOf(lyric) != -1) {
        let index = unpunctuatedLyrics.indexOf(lyric)
        unpunctuatedLyrics[index] = null
        lyricContainer.children[index].style = "color: white"
    }
}

// lyricInput.oninput = function(input) {
//     let inputString = lyricInput.value.replaceAll(/[^A-Za-z]/g, "").toLowerCase()
//     UnhideLyric(inputString)
//     console.log(inputString)
//     console.log(input)
// }

SubmitGuess = function() {
    let inputString = lyricInput.value.replaceAll(/[^A-Za-z]/g, "").toLowerCase()
    if (unpunctuatedLyrics.includes(inputString)) {
        UnhideLyric(inputString)
        GuessFlash("green")
    } else {
        GuessFlash("red")
    }
    lyricInput.value = ""
}

GuessFlash = function(colour) {
    lyricInput.style = `background-color: ${colour}`
    setTimeout(() => {lyricInput.style = "background-color: transparent"}, 75)
}

document.onkeydown = function(keyPressed) {
    if (keyPressed.key == "Enter") {
        SubmitGuess()
    }
}

// window.onload = () => {lyricInput.oninput()}
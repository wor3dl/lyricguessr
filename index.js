const lyricContainer = document.getElementById("lyric-container")
const inputField = document.getElementById("input-container")
const lyricInput = document.getElementById("lyric-input")

//var lyrics = ["a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", "a", "b", "jamona", ]
var lyrics = []
var unpunctuatedLyrics = []

//Everything inside here is executed after the target song has been loaded
retrieveSong(songList[dayOffset]).then(data => {

    targetSong = data
        
    for (let header of Object.keys(targetSong.lyrics)) {
        lyrics = lyrics.concat(targetSong.lyrics[header].lyrics)
    }

    lyrics.forEach(function(lyric) {
        createLyric(lyric)
        unpunctuatedLyrics.push(lyric.replaceAll(/[^A-Za-z]/g, ""))
    })

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

lyricInput.oninput = function() {
    let inputString = lyricInput.value.replaceAll(/[^A-Za-z]/g, "")
    UnhideLyric(inputString)
    console.log(inputString)
}

window.onload = () => {lyricInput.oninput()}
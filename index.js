const inputField = document.getElementById("input-container")
const lyricInput = document.getElementById("lyric-input")

lyricInput.oninput = function() {
    console.log(lyricInput.value)
}
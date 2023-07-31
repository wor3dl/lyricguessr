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

const offsetFromDate = new Date("31 Jul 2023")
const msOffset = new Date("1 August 2023") - offsetFromDate // should be this --> const msOffset = Date.now() - offsetFromDate
const dayOffset = Math.floor(msOffset / 1000 / 60 / 60 / 24)

var targetSong //Object containing information on current song
var formattedLyrics = []
var repeatChorus = false

async function retrieveSong(name) {
    var song = await fetch(`songs/${name}.song`)
    var data = await song.json()
    return data
}

retrieveSong(songList[dayOffset]).then(data => {
    targetSong = data
    formattedLyrics = formatLyrics(targetSong.lyrics)
    console.log(formattedLyrics)
})

var removableStrings = []
var specialStrings = ["...", ".", "#", ",", "!", "?", `"`]

function formatLyrics(lyrics) {
    let block = lyrics
    block = block.replaceAll("\n", " ")

    //Split Headers from Lyrics

    headerSplit = []

    while(true) {

        let start = block.indexOf("[", 0)
        
        if (start == -1) {
            headerSplit.push({type:"lyric", text:block})
            break
        }
        
        let end = block.indexOf("]", start)
        let header = block.substring(start, end+1)
        let part1 = block.substring(0, start)
        let part2 = block.substring(end+1, block.length)
        headerSplit.push({type:"lyric", text:part1})
        headerSplit.push({type:"header", text:header})
        block = part2
    }

    var parentedLyrics = []

    for (let b = 0; b < headerSplit.length; b++) {

        let block = headerSplit[b]

        if (block.type == "header") {

            let header = {header:block.text, lyrics:[]}

            if (!(b == headerSplit.length-1)) {

                if (headerSplit[b+1].type == "lyric") {

                    let lyrics = headerSplit[b+1].text

                    for (word of lyrics.split(" ")) {

                        if (/\S/.test(word)) {
                            
                            let done = false

                            for (remove of removableStrings) {
                                word = word.replace(remove, "")
                            }

                            for (special of specialStrings) {

                                if (word.includes(special)) {
                                    let indexSpecial = word.indexOf(special)
                                    let stripped = word.replace(special, "")
                                    done = true
                                    if (indexSpecial <= 0) {
                                        header.lyrics.push(special)
                                        header.lyrics.push(stripped)
                                    } else {
                                        header.lyrics.push(stripped)
                                        header.lyrics.push(special)
                                    }
                                    break
                                }
                            }
                            if (!done) header.lyrics.push(word)
                        }
                    }
                }
            }
            parentedLyrics.push(header)
        }
    }

    return parentedLyrics

}
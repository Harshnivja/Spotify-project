console.log("Lets start writing javascript");

let CurrentSong = new Audio();
let songs;
let currFolder;

async function getsongs(folder) {

  currFolder = folder;
  let a = await fetch(`http://127.0.0.1:3000/${folder}/`)
  let response = await a.text()
  // console.log(response);
  let div = document.createElement("div")
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  // console.log(as);
  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`${folder}`)[1])
    }
  }


  let songUl = document.querySelector(".songlist").getElementsByTagName("ul")[0]
  songUl.innerHTML = ""
  for (const song of songs) {

    songUl.innerHTML = songUl.innerHTML + `<li>
                            <img class="invert" src="music.svg" alt="">
                            <div class="songinfo">
                                <div>${song.replaceAll("%20", " ")}</div>
                                <div>Harry</div>
                            </div>
                            <div class="playnow">
                                <span>PlayNow</span>
                                <img class="invert" src="play.svg" alt="">
                            </div>
                        </li>`
  }



  Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach((e) => {
    e.addEventListener("click", () => {
      console.log(e.querySelector(".songinfo").firstElementChild.innerHTML);
      playMusic(e.querySelector(".songinfo").firstElementChild.innerHTML.trim());
    }
    )
  }
  )

  return songs;

}



function playMusic(track, pause = false) {

  CurrentSong.src = `/${currFolder}/` + track;
  if (!pause) {
    CurrentSong.play();
  }

  document.querySelector(".playbar").style.opacity = 1;
  play.src = "pause.svg"
  document.querySelector(".Songinfo").innerHTML = decodeURI(track);
  document.querySelector(".Songtime").innerHTML = "00:00 / 00:00";
}

function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
}

async function displayAlbums() {
  let a = await fetch(`/songs/`)
  let response = await a.text()
  // console.log(response);
  let div = document.createElement("div")
  div.innerHTML = response;
  // console.log(div);
  let anchors = div.getElementsByTagName("a")
  let cardContainer = document.querySelector(".cardContainer")
  // console.log(anchors);
  let array = Array.from(anchors)

  for (let index = 0; index < array.length; index++) {
    const e = array[index];


    if (e.href.includes("/songs")) {

      let folder = e.href.split("/").splice(-2)[0];
      // get the meta data of the folder

      let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`)
      let response = await a.json()
      // console.log(response);

      cardContainer.innerHTML = cardContainer.innerHTML + ` <div data-folder = "${folder}" class="card">
                        <div class="play-button">
                            <div class="play-icon"></div>
                        </div>
                        <img src="/songs/${folder}/cover.jpg" alt="">
                        <h3>${response.title}</h3>
                        <p>${response.description}</p>
                    </div>`
    }
  }


  // load the playlist whenever card is clicked

  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    e.addEventListener("click", async item => {
      // console.log(item,item.currentTarget.dataset);
      songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)
      playMusic(songs[0]);

    })
  }
  )

}




async function main() {
  await getsongs("songs/Atif")
  playMusic(songs[0], true)
  play.src = "play.svg";

  // console.log(songs);

  // Display all the albums on the page

   await displayAlbums()

  // Attach an event listener to play pause and next

  play.addEventListener("click", () => {
    if (CurrentSong.paused) {
      CurrentSong.play();
      play.src = "pause.svg"
    }
    else {
      CurrentSong.pause();
      play.src = "play.svg"
    }
  }
  )

  // attach an event listener to timeupdate

  CurrentSong.addEventListener("timeupdate", () => {
    document.querySelector(".Songtime").innerHTML = `${secondsToMinutesSeconds(CurrentSong.currentTime)} / ${secondsToMinutesSeconds(CurrentSong.duration)}`
    document.querySelector(".circle").style.left = (CurrentSong.currentTime / CurrentSong.duration) * 100 + "%";
  }
  )

  // attach an event listener for seekbar

  document.querySelector(".seekbar").addEventListener("click", (e) => {

    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    CurrentSong.currentTime = ((CurrentSong.duration) * percent) / 100;

  }
  )

  // event listener for hamberger

  document.querySelector(".hamberger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  }
  )

  // event listener for close


  document.querySelector(".Close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
  }
  )

  // Add event listener for Previous button

prev.addEventListener("click", () => {
  CurrentSong.pause();
  console.log("prev click");

  // Get the current song's index
  let currentSongName = CurrentSong.src.split("/").pop();  // Extract just the song file name
  let index = songs.findIndex(song => song.split("/").pop() === currentSongName); // Compare filenames

  if (index > 0) {
    playMusic(songs[index - 1]);  // Play the previous song
  }
});

// Add event listener for Next button

next.addEventListener("click", () => {
  CurrentSong.pause();
  console.log("next click");

  // Get the current song's index
  let currentSongName = CurrentSong.src.split("/").pop();  // Extract just the song file name
  let index = songs.findIndex(song => song.split("/").pop() === currentSongName); // Compare filenames

  if (index < songs.length - 1) {
    playMusic(songs[index + 1]);  // Play the next song
  }
});


  // add event to volume

  document.querySelector(".volume").getElementsByTagName("input")[0].addEventListener("change", (e) => {
    // console.log(e,e.target,e.target.value);
    CurrentSong.volume = parseInt(e.target.value) / 100;
  }
  )




}

main()
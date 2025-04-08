document.addEventListener('DOMContentLoaded', () => {
    //enter your clientid here
    //enter your  client secret here
    let accessToken = '';

    const menuOpen = document.getElementById('menu-open');
    const menuClose = document.getElementById('menu-close');
    const sidebar = document.querySelector('.container .sidebar');
    const audioPlayer = document.getElementById('audio-player');
    const audioSource = document.getElementById('audio-source');
    const playPauseButton = document.querySelector('.player-actions .bx.bxs-right-arrow');
    const nextButton = document.querySelector('.player-actions .bx.bx-last-page');
    const prevButton = document.querySelector('.player-actions .bx.bx-first-page');
    const repeatButton = document.querySelector('.player-actions .bx.bx-repeat');
    const shuffleButton = document.querySelector('.player-actions .bx.bx-transfer-alt');
    const progressBar = document.querySelector('.progress .active-line');
    const progressContainer = document.querySelector('.progress');
    const searchInput = document.getElementById('search-input');
    let currentSongIndex = 0;
    let isPlaying = false;
    let isRepeat = false;
    let isShuffle = false;
    let songs = [];

    async function getAccessToken() {
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
            },
            body: 'grant_type=client_credentials'
        });
        const data = await response.json();
        return data.access_token;
    }

    async function searchTracks(query) {
        const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        });
        const searchData = await response.json();
        return searchData.tracks.items;
    }

    async function init() {
        accessToken = await getAccessToken();
    }

    function playSong(index) {
        currentSongIndex = index;
        audioSource.src = songs[index].preview_url;
        audioPlayer.load();
        audioPlayer.play();
        isPlaying = true;
        updatePlayPauseButton();
    }

    function togglePlayPause() {
        if (isPlaying) {
            audioPlayer.pause();
        } else {
            audioPlayer.play();
        }
        isPlaying = !isPlaying;
        updatePlayPauseButton();
    }

    function updatePlayPauseButton() {
        if (isPlaying) {
            playPauseButton.classList.replace('bxs-right-arrow', 'bxs-pause');
        } else {
            playPauseButton.classList.replace('bxs-pause', 'bxs-right-arrow');
        }
    }

    function nextSong() {
        if (isShuffle) {
            currentSongIndex = Math.floor(Math.random() * songs.length);
        } else {
            currentSongIndex = (currentSongIndex + 1) % songs.length;
        }
        playSong(currentSongIndex);
    }

    function prevSong() {
        currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
        playSong(currentSongIndex);
    }

    function toggleRepeat() {
        isRepeat = !isRepeat;
        repeatButton.classList.toggle('active', isRepeat);
    }

    function toggleShuffle() {
        isShuffle = !isShuffle;
        shuffleButton.classList.toggle('active', isShuffle);
    }

    function updateProgress() {
        const progressPercent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressBar.style.width = `${progressPercent}%`;
    }

    function setProgress(e) {
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const duration = audioPlayer.duration;
        audioPlayer.currentTime = (clickX / width) * duration;
    }

    async function searchSongs() {
        const query = searchInput.value.toLowerCase();
        songs = await searchTracks(query);
        const itemsContainer = document.querySelector('.music-list .items');
        itemsContainer.innerHTML = '';
        songs.forEach((song, index) => {
            const item = document.createElement('div');
            item.classList.add('item');
            item.innerHTML = `
                <div class="info">
                    <p>${index + 1}</p>
                    <img src="${song.album.images[0].url}">
                    <div class="details">
                        <h5>${song.name}</h5>
                        <p>${song.artists[0].name}</p>
                    </div>
                </div>
                <div class="actions">
                    <p>${(song.duration_ms / 60000).toFixed(2)}</p>
                    <div class="icon">
                        <i class='bx bxs-right-arrow play-button' data-song-index="${index}"></i>
                    </div>
                    <i class='bx bxs-plus-square'></i>
                </div>
            `;
            itemsContainer.appendChild(item);
        });

        document.querySelectorAll('.play-button').forEach(button => {
            button.addEventListener('click', () => {
                const songIndex = button.getAttribute('data-song-index');
                playSong(songIndex);
            });
        });
    }

    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('ended', () => {
        if (isRepeat) {
            playSong(currentSongIndex);
        } else {
            nextSong();
        }
    });

    progressContainer.addEventListener('click', setProgress);

    playPauseButton.addEventListener('click', togglePlayPause);
    nextButton.addEventListener('click', nextSong);
    prevButton.addEventListener('click', prevSong);
    repeatButton.addEventListener('click', toggleRepeat);
    shuffleButton.addEventListener('click', toggleShuffle);
    searchInput.addEventListener('input', searchSongs);

    init();
});/*
window.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.name) {
      document.getElementById("usernameDisplay").textContent = `Welcome, ${user}`;
    }
  }); */

  const user = JSON.parse(localStorage.getItem("user")); 
  const user1=JSON.parse(localStorage.getItem('user1')) 
        document.getElementById("usernameDisplay").textContent = `Welcome, ${user1.name}`;
  if (!user) {
    // Not logged in — redirect
    window.location.href = "login.html";
  }

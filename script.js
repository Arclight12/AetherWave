const searchInput = document.getElementById('search-input');
const audioPlayer = document.getElementById('audio-player');
const audioSource = document.getElementById('audio-source');
let songs = [];

let accessToken;

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
    const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=4`, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }
    });
    const searchData = await response.json();
    return searchData.tracks.items;
}

// This function will be used to play a song when clicked
function playTrack(previewUrl) {
    if (previewUrl) {
        audioSource.src = previewUrl;  // Set the source to the preview URL
        audioPlayer.load();            // Load the song
        audioPlayer.play();            // Play the song
    }
}

async function searchSongs() {
    const query = searchInput.value.trim();
    if (!query) return;

    songs = await searchTracks(query);
    const itemsContainer = document.querySelector('.music-list .items');
    itemsContainer.innerHTML = '';

    songs.forEach((song, index) => {
        const item = document.createElement('div');
        item.classList.add('item');
        item.innerHTML = `
            <div class="info">
                <p>${index + 1}</p>
                <img src="${song.album.images[0]?.url || ''}">
                <div class="details">
                    <h5>${song.name}</h5>
                    <p>${song.artists[0].name}</p>
                </div>
            </div>
            <div class="actions">
                <p>${(song.duration_ms / 60000).toFixed(2)} min</p>
                ${song.preview_url ? 
                    `<button class="play-preview" data-url="${song.preview_url}">▶</button>` : 
                    `<span style="color:white;">No Preview</span>`}
                  
            </div>
        `;
        itemsContainer.appendChild(item);
    });

    // Add play preview click listener
    document.querySelectorAll('.play-preview').forEach(button => {
        button.addEventListener('click', () => {
            const previewUrl = button.getAttribute('data-url');
            playTrack(previewUrl); // Play the preview when the button is clicked
        });
    });
}

searchInput.addEventListener('input', searchSongs);

async function init() {
    accessToken = await getAccessToken();
}

init();

  
     /*
window.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.name) {
      document.getElementById("usernameDisplay").textContent = `Welcome, ${user}`;
    }
  }); */

  const user = JSON.parse(localStorage.getItem("user")); 
  const user1=JSON.parse(localStorage.getItem('user1')) 
        document.getElementById("usernameDisplay").textContent = `Welcome, ${user1.name}!`;
  if (!user) {
    // Not logged in — redirect
    window.location.href = "login.html";
  }

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

// Retrieve user data from localStorage
const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
    // Redirect to login if user data is not found
    window.location.href = "login.html";
} else {
    // Display username in the sidebar
    document.getElementById("usernameDisplay").textContent = `Welcome, ${user.username || "Guest"}!`;
    document.getElementById("name").textContent = user.username || "Guest";
}

// Open profile popup when the "Profile" menu item is clicked
document.getElementById("profileMenuItem").addEventListener("click", (event) => {
    event.preventDefault(); // Prevent default link behavior

    // Set profile info in the popup
    document.getElementById("profileImage").src = user.photo || "assets/default-image.jpg"; // Fallback image
    document.getElementById("profileName").textContent = user.name || "John Doe";
    document.getElementById("profileUsername").textContent = user.username || "johndoe123";
    document.getElementById("profileEmail").textContent = user.email || "johndoe@email.com";
    document.getElementById("profileFollowers").textContent = user.followers || "0";

    // Show the profile popup and overlay
    document.getElementById("profilePopup").classList.add("show");
    document.querySelector(".popup-overlay").style.display = "block";
});

// Close the profile popup when the close button is clicked
document.getElementById("closePopup").addEventListener("click", () => {
    // Hide the profile popup and overlay
    document.getElementById("profilePopup").style.display = "none";
    document.querySelector(".popup-overlay").style.display = "none";
});
// Function for artist search

// Open the album popup when the album link is clicked
document.getElementById("albumLink").addEventListener("click", (event) => {
    event.preventDefault(); // Prevent default link behavior

    // Show the popup and overlay
    document.getElementById("popupBox").classList.add("show");
    document.querySelector(".pop-overlay").classList.add("show");
});

// Close the popup when the close button is clicked
document.getElementById("closePopup").addEventListener("click", () => {
    document.getElementById("popupBox").classList.remove("show");
    document.querySelector(".pop-overlay").classList.remove("show");
});

// Close the popup when clicking on the overlay
document.querySelector(".pop-overlay").addEventListener("click", () => {
    document.getElementById("popupBox").classList.remove("show");
    document.querySelector(".pop-overlay").classList.remove("show");
});


function searchAlbum() {
    // Get the value entered in the search input
    const searchInput = document.getElementById("albumSearch").value.trim();

    // Check if the input is empty
    if (!searchInput) {
        alert("Please enter an artist's name.");
        return;
    }

    // Redirect to album.html with the artist's name as a query parameter
    window.location.href = `album.html?artist=${encodeURIComponent(searchInput)}`;
}


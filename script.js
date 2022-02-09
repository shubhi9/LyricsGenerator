var text = document.querySelector(".input");
var btn = document.querySelector(".button");
var output = document.querySelector(".display");

var api = "https://api.lyrics.ovh";

async function song(term) {
   const res = await fetch(`${api}/suggest/${term}`);
   const data = await res.json();
   console.log(data);
   showData(data);
}

function showData(data) {
   result.innerHTML = `0
     <ul class="songs">
       ${data.data
         .map(
           song => `<li>
       <span class="list"><strong>${song.artist.name}</strong> - ${song.title}</span>
       <button class="btn" data-artist="${song.artist.name}" data-songtitle="${song.title}">Get Lyrics</button>
     </li>`
         )
         .join('')}
     </ul>
   `;
 
   if (data.prev || data.next) {
     more.innerHTML = `
       ${
         data.prev
           ? `<button class="btn" onclick="getMoreSongs('${data.prev}')">Prev</button>`
           : ''
       }
       ${
         data.next
           ? `<button class="btn" onclick="getMoreSongs('${data.next}')">Next</button>`
           : ''
       }
     `;
   } else {
     more.innerHTML = '';
   }
 }
 
 async function getLyrics(artist, songTitle) {
   const res = await fetch(`${api}/v1/${artist}/${songTitle}`);
   const data = await res.json();
 
    if (data.error) {
         result.innerHTML = data.error;
    } else {
         const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>');
 
         result.innerHTML = `
             <h2><strong>${artist}</strong> - ${songTitle}</h2>
             <span>${lyrics}</span>
         `;
   }
 
   more.innerHTML = '';
 }
 

result.addEventListener('click', e => {
   const clickedEl = e.target;

   if (clickedEl.tagName === 'BUTTON') {
      const artist = clickedEl.getAttribute('data-artist');
      const songTitle = clickedEl.getAttribute('data-songtitle');

      getLyrics(artist, songTitle);
   }
});

btn.addEventListener('click', e => {
   e.preventDefault();

   const searchTerm = text.value.trim();

   if (!searchTerm) {
      alert('Please type in a search term');
   } else {
      song(searchTerm);
   }
});


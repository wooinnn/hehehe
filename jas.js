function showGreg() {
  var btn = document.getElementById('gregButton');
  var img = document.getElementById('gregPic');
  var title = document.getElementById('mainTitle');
  var text = document.getElementById('mainText');
  
  // Hide greg2.jpg when clicked
  var greg2 = document.getElementById('greg2Img');
  greg2.style.display = 'none';
  var maintitle = document.getElementById('mainTitle');
  maintitle.style.display= 'none';
  var music = document.getElementById('gregMusic');
var playPromise = music.play();

if (playPromise !== undefined) {
  playPromise.then(_ => {
    // Audio automatically started playing!
  }).catch(error => {
    // Auto-play was prevented or failed
    console.log("Playback blocked or failed");
  });
}


  // 1. Stop the button's circle animation
  btn.classList.remove('orbit-animation');

  // 2. Change page colors
  document.body.style.backgroundColor = "#ff0000"; 
  title.style.color = "#00ff00"; 
  text.style.color = "#ffff00"; 
  
  btn.style.backgroundColor = "#ff6600"; 
  btn.style.color = "#ff00ff"; 
  btn.style.fontWeight = "bold";

  // 3. Unhide Greg's picture and start its circle animation
  img.hidden = false;
  img.classList.remove('orbit-animation');
  void img.offsetWidth; 
  img.classList.add('orbit-animation');
}
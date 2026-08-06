function showGreg() {
  var btn = document.getElementById('gregButton');
  var img = document.getElementById('gregPic');
  var title = document.getElementById('mainTitle');
  var text = document.getElementById('mainText');
  
  
  var greg2 = document.getElementById('greg2Img');
  greg2.style.display = 'none';
  var maintitle = document.getElementById('mainTitle');
  maintitle.style.display= 'none';
  var music = document.getElementById('gregMusic');
var playPromise = music.play();

if (playPromise !== undefined) {
  playPromise.then(_ => {
    
  }).catch(error => {
    
    console.log("Playback blocked or failed");
  });
}


  
  btn.classList.remove('orbit-animation');

 
  document.body.style.backgroundColor = "#ff0000"; 
  title.style.color = "#00ff00"; 
  text.style.color = "#ffff00"; 
  
  btn.style.backgroundColor = "#ff6600"; 
  btn.style.color = "#8f19df"; 
  btn.style.fontWeight = "bold";

  
  img.hidden = false;
  img.classList.remove('orbit-animation');
  void img.offsetWidth; 
  img.classList.add('orbit-animation');
}
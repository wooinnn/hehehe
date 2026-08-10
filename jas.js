var firstSelection = null;
function startGame() {
    // Hide start screen and show puzzle screen
    document.getElementById("startScreen").style.display = "none";
    document.getElementById("puzzleScreen").style.display = "block";
}

function exitGame() {
    // Closes window or redirects/displays a goodbye message
    window.close();
    alert("Thanks for playing! You can now close this tab.");
}
function selectCard(cardElement, cardType) {
    cardElement.style.border = "3px solid gold";

    if (firstSelection === null) {
        firstSelection = { element: cardElement, type: cardType };
    } else {
        var secondSelection = { element: cardElement, type: cardType };

        if (firstSelection.type === secondSelection.type && firstSelection.element !== secondSelection.element) {
            document.getElementById("puzzleMsg").style.color = "green";
            document.getElementById("puzzleMsg").innerText = "Match found! Entering the party...";
            
            setTimeout(function() {
                document.getElementById("puzzleScreen").style.display = "none";
                document.getElementById("partyScreen").style.display = "flex";
            }, 1000);

        } else {
            document.getElementById("puzzleMsg").style.color = "red";
            document.getElementById("puzzleMsg").innerText = "Wrong match! Try again.";
            
            var prevCard = firstSelection.element;
            setTimeout(function() {
                prevCard.style.border = "3px solid #333";
                secondSelection.element.style.border = "3px solid #333";
            }, 500);
        }
        firstSelection = null;
    }
}

function showGreg() {
    var btn = document.getElementById('gregButton');
    var img = document.getElementById('gregPic');
    var title = document.getElementById('mainTitle');
    var text = document.getElementById('mainText');
    var greg2 = document.getElementById('greg2Img');
    var partyScreen = document.getElementById('partyScreen');

    greg2.style.display = 'none';
    title.style.display = 'none';
    
    var music = document.getElementById('gregMusic');
    var playPromise = music.play();

    if (playPromise !== undefined) {
        playPromise.then(_ => {}).catch(error => {
            console.log("Playback blocked or failed");
        });
    }

    const messages = [
        "Lahat kau nakapasa ako lang BAGSAK!!",
        "Walang Greg dito, baka nasa kusina.",
        "Error 404: Greg not found (he's eating)",
        "Miss mo si greg noh",
        "Gusto mo ba si Greg? Click mo na!"
    ];

    const randomIndex = Math.floor(Math.random() * messages.length);
    btn.innerText = messages[randomIndex];

    // Party Light Flash Effect (applied to partyScreen background for visibility)
    const partyColors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff"];
    setInterval(function() {
        var randomColor = partyColors[Math.floor(Math.random() * partyColors.length)];
        partyScreen.style.backgroundColor = randomColor;
    }, 2);

    title.style.color = "#ffffff";
    text.style.color = "#ffffff";

    btn.style.backgroundColor = "#ff6600";
    btn.style.color = "#8f19df";
    btn.style.fontWeight = "bold";

    img.style.display = "block"; 
}
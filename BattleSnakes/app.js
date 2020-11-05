const canvas = document.getElementById('tron');
const context = canvas.getContext('2d');
var unit = 8; //default is 15

//removes the READY text by clearing the foreground canvas
function clearReadyText(){
	var canvas = document.getElementById("xx");
	var ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

//TODO: try and break out some of the functions so a monolith func is avoided
function run(){
  class Player {
    constructor(x, y, color, rc, wins) {
    this.color = color || '#fff';
    this.dead = false;
    this.direction = '';
    this.key = '';
    this.x = x;
    this.y = y;
    this.startX = x;
    this.startY = y;
			
		wins = 0;	
		this.winsCount = wins; 	
    rc = 0;
    this.readyCheck = rc;
			
    this.constructor.counter = (this.constructor.counter || 0) + 1;
    this._id = this.constructor.counter;
    Player.allInstances.push(this);
    };
  };
  Player.allInstances = [];
	
  //handling players start position, color and number of players
	//TODO: get rid of repetetive code
	var p1 = new Player(unit * 40, unit * 25, '#75A4FF');
	var p2 = new Player(unit * 55, unit * 25, '#FF5050');
  var ele = document.getElementsByName('players')  
  for(i = 0; i < ele.length; i++) {
    if(ele[i].checked){ 
      if(ele[i].value == "3players") var x = 3;
      else if(ele[i].value == "4players") var x = 4;
			else{ var x = 2; }
    }
  }
  var showP3 = document.getElementById('player3');
  var showP4 = document.getElementById('player4');
	var P3Wins = document.getElementById('3');
	var P4Wins = document.getElementById('4');
	
  if(x==3){
    var p3 = new Player(unit * 55, unit * 35, 'yellow');
    showP3.style.display = "inline-block";
		P3Wins.style.display = "inline-block";
  }else if(x==4){
    var p3 = new Player(unit * 55, unit * 35, 'yellow');
    var p4 = new Player(unit * 40, unit * 35, 'green');
    showP3.style.display = "inline-block";
    showP4.style.display = "inline-block";
    P3Wins.style.display = "inline-block";
    P4Wins.style.display = "inline-block";
		
  }else{

	}//////////////////////////////////////////////////////
 
  //handle speed select
	//the value is units that affects the setInterval method below
  var speed = document.getElementsByName('speed')
  for(i = 0; i < speed.length; i++) {
    if(speed[i].checked){
      if(speed[i].value == "slow") var z = 75;
      else if(speed[i].value == "normal") var z = 50;
      else if(speed[i].value == "fast") var z = 25;
    }
  }///////////////////////////////////////////////////////
	
  function setKey(key, player, up, right, down, left) {
    function showReadyText(){
      if(player.readyCheck < 1){
        player.readyCheck++;
        if(player.readyCheck == 1) {
					var canvas = document.getElementById("xx");
					var ctx = canvas.getContext("2d");
					ctx.font = "25px Bungee";
					ctx.fillStyle = player.color;
					ctx.textAlign = "center";
					ctx.fillText("Ready", player.startX + 10, player.startY - 20);
				};
      }
    }//showReadyText END
		
    switch (key) {
      case up: if (player.direction !== 'DOWN') { player.key = 'UP'; showReadyText(); };
        break;
      case right: if (player.direction !== 'LEFT') { player.key = 'RIGHT'; showReadyText(); };
        break;
      case down: if (player.direction !== 'UP') { player.key = 'DOWN'; showReadyText(); };
        break;
      case left: if (player.direction !== 'RIGHT') { player.key = 'LEFT'; showReadyText(); };
        break;
      default: break;
    };
  };

  function handleKeyPress(event) {
    let key = event.keyCode;
    if (key === 37 || key === 38 || key === 39 || key === 40) event.preventDefault();
    setKey(key, p1, 87, 68, 83, 65); // WASD 87, 68, 83, 65
    setKey(key, p2, 38, 39, 40, 37); // arrow keys 38, 39, 40, 37
    setKey(key, p3, 73, 76, 75, 74); // ILKJ 73, 76, 75, 74 
    setKey(key, p4, 101, 99, 98, 97); // numpad 5123 101, 99, 98, 97
  };

  document.addEventListener('keydown', handleKeyPress);

  function getPlayableCells(canvas, unit) {
    let playableCells = new Set();
    for (let i = 0; i < canvas.width / unit; i++) {
      for (let j = 0; j < canvas.height / unit; j++) {
        playableCells.add(`${i * unit}x${j * unit}y`);
      };
    };
    return playableCells;
  };

  let playableCells = getPlayableCells(canvas, unit);

  function drawBackground() {
    context.strokeStyle = '#001900';
    for (let i = 0; i <= canvas.width / unit + 2; i += 2) {
      for (let j = 0; j <= canvas.height / unit + 2; j += 2) {
        context.strokeRect(0, 0, unit * i, unit * j);
      };
    };
    context.strokeStyle = '#000000';
    context.lineWidth = 2;
    for (let i = 1; i <= canvas.width / unit; i += 2) {
      for (let j = 1; j <= canvas.height / unit; j += 2) {
        context.strokeRect(0, 0, unit * i, unit * j);
      };
    };
    context.lineWidth = 1;
  };

  drawBackground();

  function drawStartingPositions(players) {
    players.forEach(p => {
      context.fillStyle = p.color;
      context.fillRect(p.x, p.y, unit, unit);
      context.strokeStyle = 'black';
      context.strokeRect(p.x, p.y, unit, unit);
    });
  };

  drawStartingPositions(Player.allInstances);

  let outcome, winnerColor, playerCount = Player.allInstances.length;
	
  function draw() {
    if (Player.allInstances.filter(p => !p.key).length === 0) {
      setTimeout(clearReadyText, 200);
      if (playerCount === 1) {
        const alivePlayers = Player.allInstances.filter(p => p.dead === false);
        outcome = `Player ${alivePlayers[0]._id} wins!`;
        winnerColor = alivePlayers[0].color;
				
				//increments the the win counter
				alivePlayers[0].winsCount++;
				var winCount = alivePlayers[0].winsCount;
				$('.winContainer').each( function(index){
					if ($(this).attr("id") == alivePlayers[0]._id) $(this).children().text(winCount);
				});///////////////////////////////////////
      } else if (playerCount === 0) outcome = 'Draw!';
      
      if (outcome) {
        createResultsScreen(winnerColor);
        clearInterval(game);
      };

      Player.allInstances.forEach(p => {
        if (p.key) {
          p.direction = p.key;
          context.fillStyle = p.color;
          context.fillRect(p.x, p.y, unit, unit);
          context.strokeStyle = 'black';
          context.strokeRect(p.x, p.y, unit, unit);

          if (!playableCells.has(`${p.x}x${p.y}y`) && p.dead === false) {
            p.dead = true;
            p.direction = '';
            playerCount -= 1;
          }

          playableCells.delete(`${p.x}x${p.y}y`);

          if (!p.dead) {
            if (p.direction === "LEFT") p.x -= unit;
            if (p.direction === "UP") p.y -= unit;
            if (p.direction === "RIGHT") p.x += unit;
            if (p.direction === "DOWN") p.y += unit;
          };
        };
      });
    }
  }//DRAW function End
  let game = setInterval(draw, z);

  function createResultsScreen(color) {
    const resultNode = document.createElement('div');
    resultNode.id = 'result';
    resultNode.style.color = color || '#fff';
    resultNode.style.position = 'fixed';
    resultNode.style.top = 0;
    resultNode.style.display = 'grid';
    resultNode.style.gridTemplateColumns = '1fr';
    resultNode.style.width = '100%';
    resultNode.style.height = '100vh';
    resultNode.style.justifyContent = 'center';
    resultNode.style.alignItems = 'center';
    resultNode.style.background = '#00000088'

    const resultText = document.createElement('h1');
    resultText.innerText = outcome;
    resultText.style.fontFamily = 'Bungee, cursive';
    resultText.style.textTransform = 'uppercase';

    const replayButton = document.createElement('button');
    replayButton.innerText = 'Replay (Enter)';
    replayButton.style.fontFamily = 'Bungee, cursive';
    replayButton.style.textTransform = 'uppercase';
    replayButton.style.padding = '10px 30px';
    replayButton.style.fontSize = '1.2rem';
    replayButton.style.margin = '0 auto';
    replayButton.style.cursor = 'pointer';
    replayButton.onclick = resetGame;

    resultNode.appendChild(resultText);
    resultNode.appendChild(replayButton);
    document.querySelector('body').appendChild(resultNode);

    document.addEventListener('keydown', (e) => {
      let key = event.keyCode;
      if (key == 13 || key == 32 || key == 27 || key == 82) resetGame();
    });
  };

function resetGame() {
  // Remove the results node
  const result = document.getElementById('result');
  if (result) result.remove();
  // Remove background then re-draw it
  context.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();
  // Reset playableCells
  playableCells = getPlayableCells(canvas, unit);
  // Reset players
  Player.allInstances.forEach(p => {
    p.x = p.startX;
    p.y = p.startY;
    p.dead = false;
    p.direction = '';
    p.key = '';
		p.readyCheck = 0;
  });
  playerCount = Player.allInstances.length;
  drawStartingPositions(Player.allInstances);
  // Reset outcome
  outcome = '';
  winnerColor = '';
  // Ensure draw() has stopped, then re-trigger it
  clearInterval(game);
  game = setInterval(draw, z);
};

document.querySelector('#play-btn').addEventListener('click', () => {
  document.querySelector('#play-btn').style.display = 'none';
});
  
}//function test END

 
  
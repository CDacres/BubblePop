particlesJS.load('particles-js', 'assets/particles.json', function() {
  console.log('callback - particles.js config loaded');
});

$(function () {

	//Array storing all possible questions
	var allquestions = [
		['How many in a baker\'s dozen?','13'],
		['What is the legal drinking age in the UK','18'],
		['How many years in a quarter of a century?','25'],
		['How many violins in a string quartet?','2'],
		['How many stairs are there in a bungalow?','0'],
		['What is the highest possible score in Blackjack?','21'],
		['How many letters are there in the alphabet?','26'],
		['How many counties are there in England?','48'],
		['What is the character limit on twitter?','140'],
		['How many Pokemon are there in generation 1?','151'],
		['Which year did Busted travel to?','3000'],
		['How many houses are there at Hogwarts?','4'],
		['How many millilitres in a pint?','568'],
		['How many Dalmations were in Disney\'s famous film?','101'],
		['What is the value of the imaginary number i, squared?','-1'],
		['What is absoulte zero in celcius?','-273'],
		['How many miles would the Proclaimers walk?','500'],
		['What\'s the loneliest number?','1'],
		['How many arms and tentacles does a squid have?','10'],
		['How many players are there in a standard football team?','11'],
		['How many years is a diamond anniversary?','60'],
		['How many colours are there in the rainbow?','7'],
		['How many cards are there in a standard deck?','52'],
		['When was the battle of Hastings?','1066'],
		['How many minutes are there in a day?','1440'],
		['According to Blink-182, no one likes you when you\'re?','23'],
		['A googol is 1 followed how many zeros?','100'],
		['How many lives does a cat supposedly have?','9'],
		['How many yards are there in a mile?','1760'],
		['How many times has London hosted the modern Olympic Games?','3'],
		['How many bones are there in an adult human body?','206'],
		['What\'s the answer to the ultimate question?','42'],
		['How many sonnets did Shakespeare write?','154'],
		['How many carats is pure gold?','24'],
		['Phileas Fogg travelled around the world in how many days?','80'],
		['How many Spartans fought the Persian army?','300'],
		['What\'s the title of the famous book by George Orwell?','1984'],
		['Hal 9000 is an antagonist in which film?','2001'],
		['How many years did Rip Van Winkle sleep for?','20'],
		['How many wives did Henry VIII have?','6'],
		['The famous US Highway is called Route what?','66'],
		['How many pieces are in a game of chess?','32'],
		['How many rounds are in a professional boxing match?','12'],
		['How many planets are there in the solar system?','8'],
		['How many keys are there on a full-sized piano?','88'],
		['How many kilograms are there in a tonne?','1000']
	];

	//Creates randomly shuffled array of all questions.
	var shuffledQuestions = shuffleArray(allquestions);
	var speedModifier = 0.1;
	var turn = 1;
	var lives = 3;
	var starfishSeen = false;
	var qa = shuffledQuestions.slice(0,10);
	var extraQ = shuffledQuestions.slice(10,15);
	answerSetup();
	extraAnswerSetup();
	$('#question').html(qa[0][0]);
	$('#lives').html(lives);

	$('#start').click(function (event) {
		playSound('sounds/bubbles-start.mp3');
		$('#menu').hide();
		$('#maingame').show();
		Clock.start();
	});

	var $bubble = $('.bubble');
	$bubble.click(function (event) {
		var $this = $(this);
		//If value of bubble is equal to value of turn...
		if (parseInt($this.attr('value')) === turn) {
			playSound('sounds/pop-sound.mp3');
			//Stops animation on bubble before removing it.
			$this.stop();
			$this.remove();
			//Increases speed modifier, speeding up remaining bubbles.
			speedModifier += 0.04;
			addStarfish();
			turn ++;
			if (checkWin()) {
				displayWin();
			} else {
				//Changes question displayed to next question in array.
				$('#question').html(qa[turn-1][0]);
			}
		} else {
			playSound('sounds/error.mp3');
			$this.css('background-color', '#ff5900');
			setTimeout(function () {
                $this.css('background-color', '#e3f0fc');
            }, 200);
			lives --;
			checkLives();
			checkLose();
			addBubbles();
		}
	});

	// When starfish clicked, turns bubble with current answer green for .75 seconds and hides starfish.
	var $starfish = $('#starfish');
	$starfish.click(function (event) {
		var $this = $(this);
		playSound('sounds/waterblub.mp3');
		$currentBubble = $('#bubble' + turn);
		$currentBubble.css('background-color', '#00ffa1');
		setTimeout(function () {
            $currentBubble.css('background-color', '#e3f0fc');
        }, 750);
		$this.hide();
	});

    $('.bubble').each(function() {
        animateDiv($(this));
    });

    $('.fish').each(function() {
        animateDiv($(this));
    });

    var $restart = $('.restart')
    $restart.click(function (event) {
		location.reload();
	});

    //Shuffles array using Durstenfeld shuffle algorithm method of Fisher-Yates shuffle. Picks one random element for each original array element, and then excludes it from the next draw. 
    function shuffleArray(array) {
	    for (var i = array.length - 1; i > 0; i--) {
	        var j = Math.floor(Math.random() * (i + 1));
	        var temp = array[i];
	        array[i] = array[j];
	        array[j] = temp;
	    }
    	return array;
	}
	
	// Generates new random position for bubbles, (which will keep them within confines of container).
	function makeNewPosition($container) {
	    $container = ($container || $(window))
	    var h = $container.height() - 80;
	    var w = $container.width() - 80;
	    var nh = Math.floor(Math.random() * h);
	    var nw = Math.floor(Math.random() * w);
	    return [nh, nw];
	}

	//Calculates how quickly bubbles will move to next position.
	function calcSpeed(prev, next) {
	    var x = Math.abs(prev[1] - next[1]);
	    var y = Math.abs(prev[0] - next[0]);
	    var greatest = x > y ? x : y;
	    var speed = Math.ceil(greatest / speedModifier);
	    return speed;
	}

	// Animation function, combining new random location with speed of movement. Recursive function so animation doesn't stop.
	function animateDiv($target) {
	    var newq = makeNewPosition($target.parent());
	    var oldq = $target.offset();
	    var speed = calcSpeed([oldq.top, oldq.left], newq);
	    $target.animate({
	        top: newq[0],
	        left: newq[1]
	    }, speed, function() {
	        animateDiv($target);
	    });
	}

	// Clock variable
	var Clock = {
	totalSeconds: 0,

		//Start function (specific to clock), which outputs time from start to timer display.
		start: function () {
			var self = this;
			function pad(val) { return val > 9 ? val : "0" + val; }
		    this.interval = setInterval(function () {
		    self.totalSeconds += 1;
		    $('#min').html(pad(Math.floor(self.totalSeconds / 60 % 60)));
		    $('#sec').html(pad(parseInt(self.totalSeconds % 60)));
	    	}, 1000);
	  	},

	  	// Stop function within clock variable.
	    stop: function () {
    		clearInterval(this.interval);
    		delete this.interval;
  		}
	};

	//Assigns answers stored in qa array to html of bubbles.
	function answerSetup () {
		for (var i = 1; i <= qa.length; i++) {
			$('#bubble' + i).html(qa[i-1][1]);
		}
	}

	//Assigns answers stored in extraQ array to html of hidden extra bubbles.
	function extraAnswerSetup () {
		for (var i = 1; i <= extraQ.length; i++) {
			$('#bubble' + (10+i)).html(extraQ[i-1][1]);
		}
	}

	//Checks to see if turns (which is increased before calling), has exceeded number of questions & answers.
	function checkWin () {
		if (turn > qa.length) {
			return true;
		}
	}

	//Hides main game and shows win screen, showing final time.
	function displayWin () {
		Clock.stop();
		getFinalTime('win');
		playSound('sounds/success.mp3');
		$('#maingame').hide();
		$('#win').show();
	}

	//If lives reach zero, hides main game and shows lose screen, showing final time.
	function checkLose () {
		if (lives === 0) {
			Clock.stop();
			getFinalTime('lose');
			$('#maingame').hide();
			$('#lose').show();
		}
	}


	//Play sound function for calling & playing short audio.
	function playSound(path) {
		var sound = document.createElement('audio');
		sound.setAttribute('src', path);
		sound.play();
	}

	// If number of lives drops, display hides one of the life icons.
	function checkLives () {
		switch(lives) {
			case 3:
				$('#life1, #life2, #life3').show();
				break;
			case 2:
				$('#life3').hide();
				break;
			case 1:
				$('#life2').hide();
				break;
			case 0:
				$('#life1').hide();
		}
	}

	//Gets time at win/lose and outputs to win/lose screen.
	function getFinalTime(winLose) {
		$('#' + winLose + 'min').html($('#min').html());
		$('#' + winLose + 'sec').html($('#sec').html());
	}

	//If wrong bubble is clicked (which reduces lives), shows extra question bubbles, and adds extra questions to main question array.
	function addBubbles() {
		switch(lives) {
			case 2:
				$('#bubble11').show();
				$('#bubble12').show();
				qa = qa.concat(extraQ.slice(0,2));
				break;
			case 1:
				$('#bubble13').show();
				$('#bubble14').show();
				qa = qa.concat(extraQ.slice(2,4));
		}
	}

	//If starfish hasn't already appeared, run function to make it possibly show. Proability of appearing based on turn #.
	function addStarfish () {
		if (starfishSeen === false) {
			if (turn <= 3 ) {
				var randomNum = Math.floor(Math.random() * 3);
				if (randomNum === 0) {
					$('#starfish').show();
				}
			} else if (turn <= 6) {
				var randomNum = Math.floor(Math.random() * 5);
				if (randomNum === 0) {
					$('#starfish').show();
				}
			} else if (turn <= 9) {
				var randomNum = Math.floor(Math.random() * 8);
				if (randomNum === 0) {
					$('#starfish').show();
				}
			} else {
				var randomNum = Math.floor(Math.random() * 10);
				if (randomNum === 0) {
					$('#starfish').show();
				}
			}
			starfishSeen = true;
		} 
	}

});
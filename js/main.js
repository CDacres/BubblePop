$(function () {

	var allquestions = [
		['How many in a baker\'s dozen?','13'],
		['What is the legal drinking age in the UK','18'],
		['How many years in a quarter of a century?','25'],
		['How many violins in a string quartet?','2'],
		['How many stairs are there in a bungalow?','0'],
		['What is the highest possible score in Blackjack?','21'],
		['How many leeters are there in the alphabet?','26'],
		['How many counties are there in England?','48'],
		['What is the character limit on twitter?','140'],
		['How many Pokemon are there in generation 1?','151'],
		['Which year did Busted travel to?','3000'],
		['How many houses are there at Hogwarts?','4'],
		['How many millilitres in a pint?','568'],
		['How many Dalmations were in Disney\'s famous film?','101'],
		['What is the value of the imaginary number i, squared?','-1'],
		['What is absoulte zero in celcius?','-273']
	];
	var shuffledQuestions = shuffleArray(allquestions);
	var $bubble = $('.bubble');
	var speedModifier = 0.1;		//Taken from inside calcspeed
	var turn = 1;
	var lives = 3;
	var qa = shuffledQuestions.slice(0,5);
	answerSetup();
	$('#question').html(qa[0][0]);
	$('#lives').html(lives);

	$('#start').click(function (event) {
		playSound('sounds/bubbles-start.mp3');
		$('#menu').hide();
		$('#maingame').show();
		Clock.start();
	});

	$bubble.click(function (event) {
		var $this = $(this);
		if (parseInt($this.attr('value')) === turn) {
			playSound('sounds/pop-sound.mp3');
			$this.stop();
			$this.remove();
			speedModifier += 0.05;
			turn ++;
			if (checkWin()) {
				displayWin();
			} else {
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
		}
	});
    
    $('.bubble').each(function() {
        animateDiv($(this));
    });

    function shuffleArray(array) {
	    for (var i = array.length - 1; i > 0; i--) {
	        var j = Math.floor(Math.random() * (i + 1));
	        var temp = array[i];
	        array[i] = array[j];
	        array[j] = temp;
	    }
    	return array;
	}
	
	function makeNewPosition($container) {

	    $container = ($container || $(window))
	    
	    var h = $container.height() - 80;
	    var w = $container.width() - 80;

	    var nh = Math.floor(Math.random() * h);
	    var nw = Math.floor(Math.random() * w);

	    return [nh, nw];
	}

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

	function calcSpeed(prev, next) {

	    var x = Math.abs(prev[1] - next[1]);
	    var y = Math.abs(prev[0] - next[0]);

	    var greatest = x > y ? x : y;
	    var speed = Math.ceil(greatest / speedModifier);

	    return speed;
	}

	var Clock = {
	totalSeconds: 0,

		start: function () {
			var self = this;
			function pad(val) { return val > 9 ? val : "0" + val; }
		    this.interval = setInterval(function () {
		    self.totalSeconds += 1;
		    $("#min").html(pad(Math.floor(self.totalSeconds / 60 % 60)));
		    $("#sec").html(pad(parseInt(self.totalSeconds % 60)));
	    	}, 1000);
	  	},

	    stop: function () {
    		clearInterval(this.interval);
    		delete this.interval;
  		}
	};

	function answerSetup () {
		for (var i = 1; i <= qa.length; i++) {
			$('#bubble' + i).html(qa[i-1][1]);
		}
	}

	function checkWin () {
		if (turn > qa.length) {
			return true;
		}
	}

	function displayWin () {
		Clock.stop();
		playSound('sounds/success.mp3');
		$('#maingame').hide();
		$('#win').show();
	}

	function checkLose () {
		if (lives === 0) {
			Clock.stop();
			$('#maingame').hide();
			$('#lose').show();
		}
	}

	function playSound(path) {
		var sound = document.createElement('audio');
		sound.setAttribute('src', path);
		sound.play();
	}

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

});
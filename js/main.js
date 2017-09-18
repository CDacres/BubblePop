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
	];

	var $bubble = $('.bubble');
	var speedModifier = 0.1;		//Taken from inside calcspeed
	var turn = 1;
	var lives = 3;
	var qa = [
		['Question 1','Answer 1'],
		['Question 2','Answer 2'],
		['Question 3','Answer 3'],
		['Question 4','Answer 4'],
		['Question 5','Answer 5']
	];
	answerSetup();
	$('#question').html(qa[0][0]);
	$('#lives').html(lives);

	$('#start').click(function (event) {
		playSound('sounds/bubbles-start.mp3')
		$('#menu').hide();
		$('#maingame').show();
		Clock.start();
	});

	$bubble.click(function (event) {
		var $this = $(this);
		if (parseInt($this.attr('value')) === turn) {
			playSound('sounds/pop-sound.mp3')
			$this.stop();
			$this.remove();
			speedModifier += 0.05;
			turn ++;
			checkWin ();
			$('#question').html(qa[turn-1][0]);
		} else {
			console.log('Wrong Bubble');
			lives --;
			checkLives();
			checkLose();
		}
	});
    
    $('.bubble').each(function() {
        animateDiv($(this));
    });

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
			Clock.stop();
			alert('You Win!');
		}
	}

	function checkLose () {
		if (lives === 0) {
			Clock.stop();
			alert('You Lose!');
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
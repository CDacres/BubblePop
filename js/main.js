$(function () {

	var $bubble = $('.bubble');

	$('#start').click(function (event) {
		// playStart();
		$('#menu').hide();
		$('#maingame').show();
		Clock.start();
	});

	$bubble.click(function (event) {
		// playPop();
		$(this).remove();
	});
    
    $('.bubble').each(function() {
        animateDiv(this.id);
    });

	function makeNewPosition($container) {

	    $container = ($container || $(window))
	    
	    var h = $container.height() - 80;
	    var w = $container.width() - 80;

	    var nh = Math.floor(Math.random() * h);
	    var nw = Math.floor(Math.random() * w);

	    return [nh, nw];
	}

	function animateDiv(targetid) {
	    
	    var $target = $('#' + targetid);
	    var newq = makeNewPosition($target.parent());
	    var oldq = $target.offset();
	    var speed = calcSpeed([oldq.top, oldq.left], newq);

	    $('#' + targetid).animate({
	        top: newq[0],
	        left: newq[1]
	    }, speed, function() {
	        animateDiv(targetid);
	    });
	}

	function calcSpeed(prev, next) {

	    var x = Math.abs(prev[1] - next[1]);
	    var y = Math.abs(prev[0] - next[0]);

	    var greatest = x > y ? x : y;
	    var speedModifier = 0.1;
	    var speed = Math.ceil(greatest / speedModifier);

	    return speed;
	}

	function playPop() {
		var $pop = $('#pop');
        $pop.play();
    }

  //   function playStart() {
		// var $start = $('#start');
		// $start.play();
  //   }

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
	  }
	};


});
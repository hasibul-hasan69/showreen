$(document).ready(function () {
    let userName;
    let userNameH1;
    $(".sec-enter-name-btn").click(function () {
      if (document.getElementById("sec-enter-name-input").value === "") {
        alert("name cannot be empty");
      } else {
        $(".enter-name-section").fadeOut("slow");
        userName = document.getElementById("sec-enter-name-input").value;
        userNameH1 = document.getElementById("user-name-h1");
        userNameH1.innerHTML = userName;
      }
    });
    console.log(userName);
    // let dataText = "HELLO, *" + userName + "* HAVE SEND A SPECIAL GIFT FOR YOU, *open this, enter your name, and see magic!* and don't forget *" + userName + "* is the first one doing this-->";
    // $(".whatsapp").attr("data-text") = dataText;
  
    /* --whatsapp share-*/
    var isMobile = {
      Android: function () {
        return navigator.userAgent.match(/Android/i);
      },
      BlackBerry: function () {
        return navigator.userAgent.match(/BlackBerry/i);
      },
      iOS: function () {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
      },
      Opera: function () {
        return navigator.userAgent.match(/Opera Mini/i);
      },
      Windows: function () {
        return navigator.userAgent.match(/IEMobile/i);
      },
      any: function () {
        return (
          isMobile.Android() ||
          isMobile.BlackBerry() ||
          isMobile.iOS() ||
          isMobile.Opera() ||
          isMobile.Windows()
        );
      }
    };
    $(document).on("click", ".whatsapp", function () {
      if (isMobile.any()) {
        var text =
          "HELLO, *" +
          userName +
          "* HAVE SEND A SPECIAL GIFT FOR YOU, *open this, enter your name, and see magic!* and don't forget *" +
          userName +
          "* is the first one doing this-->";
        var url = $(this).attr("data-link");
        var message = encodeURIComponent(text) + " - " + encodeURIComponent(url);
        var whatsapp_url = "whatsapp://send?text=" + message;
        window.location.href = whatsapp_url;
      } else {
        alert("Please share this article in mobile device");
      }
    });
  });
  
  // function test(){
  //     var userName = document.getElementById("sec-enter-name-input").value;
  //     console.log(userName);
  // }
  

  var time = 0;
function Gravity(id){
  var that = this;
  var element = document.getElementById(id);
  var text = element.textContent;
  var arr = text.split('');

  this.animate = true;
  this.floating = true;
  this.resetTime = 0;

  this.positionType = getComputedStyle(element).position;

  this.lerp = function (e,t,i){
    return(1-i)*e+i*t;
  }
  this.checkBound = function(){
    if (element.hasAttribute("data-bound")) {
      return element.dataset.bound === "true";
    }
  }

  this.useBound = this.checkBound();
  this.colors = [
      '#f44336','#e91e63','#9c27b0',
      '#673ab7','#3f51b5','#2196f3',
      '#03a9f4','#00bcd4','#009688',
      '#4caf50','#8bc34a','#cddc39',
      '#ffeb3b','#ffc107','#ff9800',
      '#ff5722','#795548','#9e9e9e',
      '#607d8b'
  ];

  this.randomColor = function(){
    var randNum = Math.floor(Math.random() * this.colors.length);
    return this.colors[randNum];
  }

  this.bounds = this.useBound ? {
    min : {
      x : element.offsetLeft,
      y : element.offsetTop 
    },
    max : {
      x : element.offsetLeft + element.offsetWidth,
      y : element.offsetTop + element.offsetHeight
    }
  } : {
    min : {
      x : 0,
      y : 0
    },
    max : {
      x : window.innerWidth,
      y : window.innerHeight
    }
  }

  this.pointInCircle = function(point, target, radius) {
    var distsq = (point.x - target.x) * (point.x - target.x) + (point.y - target.y) * (point.y - target.y);
    return [distsq <= radius * radius, distsq];
  }

  function createSpan(text,pos){
    var span = document.createElement('span');
        span.innerHTML = text;
        span.style.position = "relative";
        span.style.display = "inline-block";
        span.style.minWidth = "10px";
        span.style.color = that.randomColor();
        span._own = {
          pos : {
            x : 0,
            y : 0
          },
          vel : {
            x : -0.5 + Math.random(),
            y : -0.5 + Math.random()
          },
          speed : {
            x : 1,
            y : 1
          },
          dir : {
            x : 1,
            y : 1
          }
        }
    return span;
  }
  this.textSpans = [];

  element.innerHTML = '';

  arr.forEach(function(t,i){
    var el = createSpan(t,{
      x : 0,
      y : 0
    });
    element.appendChild(el);
    that.textSpans.push(el);
  });

  this.getDim = function(){

    this.textSpans.forEach(function(t,i){
      var offset = {
        x : 0,
        y : 0
      }
      if(that.positionType === 'relative' || that.positionType === 'absolute'){
        offset.x = element.offsetLeft
        offset.y = element.offsetTop
      }
      t._own.real = {
        x : offset.x +t.offsetLeft,
        y : offset.y +t.offsetTop
      },
      t._own.size = {
        x : t.offsetWidth,
        y : t.offsetHeight
      }

    });

  };

  this.getDim();

  this.floatText = function(){
    this.textSpans.forEach(function(t,i){
      
      if(t._own.pos.x + t._own.real.x < that.bounds.min.x || t._own.pos.x + t._own.real.x + t._own.size.x > that.bounds.max.x){
        t._own.dir.x *= -1;
      }
      if(t._own.pos.y + t._own.real.y < that.bounds.min.y || t._own.pos.y + t._own.real.y + t._own.size.y > that.bounds.max.y){
        t._own.dir.y *= -1;
      }
      t._own.pos.x += (t._own.vel.x * t._own.speed.x) * t._own.dir.x;
      t._own.pos.y += (t._own.vel.y * t._own.speed.y) * t._own.dir.y;
      t.style.transform = 'translateX('+ t._own.pos.x +'px) translateY('+ t._own.pos.y +'px)';
    
    });
  }
  this.update = function(){
    if(this.animate){
      if(this.floating){
        this.floatText();
      }else{
        this.floatBackwards();
      }
    }
  }

  this.floatBackwards = function(){
    this.textSpans.forEach(function(t,i){
      
      var x = that.lerp(t._own.pos.x,0, that.resetTime / 10);
      var y = that.lerp(t._own.pos.y,0, that.resetTime / 10);
     
      t.style.transform = 'translateX('+ x +'px) translateY('+ y +'px)';
    
    });

    if(this.resetTime===10){
      this.animate = false;
      this.resetTime = 0;
    }
    this.resetTime++;
  }
  this.reset = function(){
    this.floating = false;
  }
  this.restart = function(){
    this.textSpans.forEach(function(t,i){
      t._own.pos.x = 0;
      t._own.pos.y = 0;
    });
    this.floating = true;
    this.animate = true;
  }
  
  window.onresize = function(){
    that.getDim();
  }
  
}

var paragraph = new Gravity('text');
var gravity = new Gravity('reset');

var button = document.getElementById('reset');
button.addEventListener('click',function(){
  if(gravity.animate){
    gravity.reset();
    paragraph.reset();
  }else{
    gravity.restart();
    paragraph.restart();
  }
});

var render = function (time) { 
  requestAnimationFrame( render );

  animation(time);
};

//__________ animation

function animation(time){
  paragraph.update();
  gravity.update();
};

//__________

render(time);















// dropppppppppppppp

// Falling rain simulation using 2D canvas
// - vanilla JS, no frameworks
// - framerate independent physics
// - slow-mo / fast-forward support via demo.speed
// - supports high-DPI screens
// - falling rain particles are drawn as vector lines
// - splash particles are lazily pre-rendered so gradients aren't computed each frame
// - all particles make use of object pooling to further boost performance

// initialize
document.addEventListener("DOMContentLoaded", function() {
	demo.init();
	window.addEventListener('resize', demo.resize);
});

// demo namespace
var demo = {
	// CUSTOMIZABLE PROPERTIES
	// - physics speed multiplier: allows slowing down or speeding up simulation
	speed: 1,
	// - color of particles
	color: {
		r: '80',
		g: '175',
		b: '255',
		a: '0.5'
	},
	
	// END CUSTOMIZATION
	// whether demo is running
	started: false,
	// canvas and associated context references
	canvas: null,
	ctx: null,
	// viewport dimensions (DIPs)
	width: 0,
	height: 0,
	// devicePixelRatio alias (should only be used for rendering, physics shouldn't care)
	dpr: window.devicePixelRatio || 1,
	// time since last drop
	drop_time: 0,
	// ideal time between drops (changed with mouse/finger)
	drop_delay: 25,
	// wind applied to rain (changed with mouse/finger)
	wind: 4,
	// color of rain (set in init)
	rain_color: null,
	rain_color_clear: null,
	// rain particles
	rain: [],
	rain_pool: [],
	// rain droplet (splash) particles
	drops: [],
	drop_pool: []
};

// demo initialization (should only run once)
demo.init = function() {
	if (!demo.started) {
		demo.started = true;
		demo.canvas = document.getElementById('canvas');
		demo.ctx = demo.canvas.getContext('2d');
		var c = demo.color;
		demo.rain_color = 'rgba(' + c.r + ',' + c.g + ',' + c.b + ',' + c.a + ')';
		demo.rain_color_clear = 'rgba(' + c.r + ',' + c.g + ',' + c.b + ',0)';
		demo.resize();
		Ticker.addListener(demo.step);
		
		// 
		const gui = new dat.GUI();
		gui.add(demo, 'speed', 0.2, 2);
		
		// fade out instructions after a few seconds
		var instructions = document.getElementById('instructions');
		setTimeout(function() {
			instructions.style.opacity = 0;
			setTimeout(function(){
				instructions.parentNode.removeChild(instructions);
			}, 2000);
		}, 4000);
	}
}

// (re)size canvas (clears all particles)
demo.resize = function() {
	// localize common references
	var rain = demo.rain;
	var drops = demo.drops;
	// recycle particles
	for (var i = rain.length - 1; i >= 0; i--) {
			rain.pop().recycle();
	}
	for (var i = drops.length - 1; i >= 0; i--) {
			drops.pop().recycle();
	}
	// resize
	demo.width = window.innerWidth;
	demo.height = window.innerHeight;
	demo.canvas.width = demo.width * demo.dpr;
	demo.canvas.height = demo.height * demo.dpr;
}

demo.step = function(time, lag) {
	// localize common references
	var demo = window.demo;
	var speed = demo.speed;
	var width = demo.width;
	var height = demo.height;
	var wind = demo.wind;
	var rain = demo.rain;
	var rain_pool = demo.rain_pool;
	var drops = demo.drops;
	var drop_pool = demo.drop_pool;
	
	// multiplier for physics
	var multiplier = speed * lag;
	
	// spawn drops
	demo.drop_time += time * speed;
	while (demo.drop_time > demo.drop_delay) {
		demo.drop_time -= demo.drop_delay;
		var new_rain = rain_pool.pop() || new Rain();
		new_rain.init();
		var wind_expand = Math.abs(height / new_rain.speed * wind); // expand spawn width as wind increases
		var spawn_x = Math.random() * (width + wind_expand);
		if (wind > 0) spawn_x -= wind_expand;
		new_rain.x = spawn_x;
		rain.push(new_rain);
	}
	
	// rain physics
	for (var i = rain.length - 1; i >= 0; i--) {
		var r = rain[i];
		r.y += r.speed * r.z * multiplier;
		r.x += r.z * wind * multiplier;
		// remove rain when out of view
		if (r.y > height) {
			// if rain reached bottom of view, show a splash
			r.splash();
		}
		// recycle rain
		if (r.y > height + Rain.height * r.z || (wind < 0 && r.x < wind) || (wind > 0 && r.x > width + wind)) {
			r.recycle();
			rain.splice(i, 1);
		}
	}
	
	// splash drop physics
	var drop_max_speed = Drop.max_speed;
	for (var i = drops.length - 1; i >= 0; i--) {
		var d = drops[i];
		d.x += d.speed_x * multiplier;
		d.y += d.speed_y * multiplier;
		// apply gravity - magic number 0.3 represents a faked gravity constant
		d.speed_y += 0.3 * multiplier;
		// apply wind (but scale back the force)
		d.speed_x += wind / 25 * multiplier;
		if (d.speed_x < -drop_max_speed) {
			d.speed_x = -drop_max_speed;
		}else if (d.speed_x > drop_max_speed) {
			d.speed_x = drop_max_speed;
		}
		// recycle
		if (d.y > height + d.radius) {
			d.recycle();
			drops.splice(i, 1);
		}
	}
	
	demo.draw();
}

demo.draw = function() {
	// localize common references
	var demo = window.demo;
	var width = demo.width;
	var height = demo.height;
	var dpr = demo.dpr;
	var rain = demo.rain;
	var drops = demo.drops;
	var ctx = demo.ctx;
	
	// start fresh
	ctx.clearRect(0, 0, width*dpr, height*dpr);
	
	// draw rain (trace all paths first, then stroke once)
	ctx.beginPath();
	var rain_height = Rain.height * dpr;
	for (var i = rain.length - 1; i >= 0; i--) {
		var r = rain[i];
		var real_x = r.x * dpr;
		var real_y = r.y * dpr;
		ctx.moveTo(real_x, real_y);
		// magic number 1.5 compensates for lack of trig in drawing angled rain
		ctx.lineTo(real_x - demo.wind * r.z * dpr * 1.5, real_y - rain_height * r.z);
	}
	ctx.lineWidth = Rain.width * dpr;
	ctx.strokeStyle = demo.rain_color;
	ctx.stroke();
	
	// draw splash drops (just copy pre-rendered canvas)
	for (var i = drops.length - 1; i >= 0; i--) {
		var d = drops[i];
		var real_x = d.x * dpr - d.radius;
		var real_y = d.y * dpr - d.radius;
		ctx.drawImage(d.canvas, real_x, real_y);
	}
}


// Rain definition
function Rain() {
	this.x = 0;
	this.y = 0;
	this.z = 0;
	this.speed = 25;
	this.splashed = false;
}
Rain.width = 2;
Rain.height = 40;
Rain.prototype.init = function() {
	this.y = Math.random() * -100;
	this.z = Math.random() * 0.5 + 0.5;
	this.splashed = false;
}
Rain.prototype.recycle = function() {
	demo.rain_pool.push(this);
}
// recycle rain particle and create a burst of droplets
Rain.prototype.splash = function() {
	if (!this.splashed) {
		this.splashed = true;
		var drops = demo.drops;
		var drop_pool = demo.drop_pool;

		for (var i=0; i<16; i++) {
			var drop = drop_pool.pop() || new Drop();
			drops.push(drop);
			drop.init(this.x);
		}
	}
}


// Droplet definition
function Drop() {
	this.x = 0;
	this.y = 0;
	this.radius = Math.round(Math.random() * 2 + 1) * demo.dpr;
	this.speed_x = 0;
	this.speed_y = 0;
	this.canvas = document.createElement('canvas');
	this.ctx = this.canvas.getContext('2d');
	
	// render once and cache
	var diameter = this.radius * 2;
	this.canvas.width = diameter;
	this.canvas.height = diameter;

	var grd = this.ctx.createRadialGradient(this.radius, this.radius , 1, this.radius, this.radius, this.radius);
	grd.addColorStop(0, demo.rain_color);
	grd.addColorStop(1, demo.rain_color_clear);
	this.ctx.fillStyle = grd;
	this.ctx.fillRect(0, 0, diameter, diameter);
}

Drop.max_speed = 5;

Drop.prototype.init = function(x) {
	this.x = x;
	this.y = demo.height;
	var angle = Math.random() * Math.PI - (Math.PI * 0.5);
	var speed = Math.random() * Drop.max_speed;
	this.speed_x = Math.sin(angle) * speed;
	this.speed_y = -Math.cos(angle) * speed;
}
Drop.prototype.recycle = function() {
	demo.drop_pool.push(this);
}




// handle interaction
demo.mouseHandler = function(evt) {
	demo.updateCursor(evt.clientX, evt.clientY);
}
demo.touchHandler = function(evt) {
	evt.preventDefault();
	var touch = evt.touches[0];
	demo.updateCursor(touch.clientX, touch.clientY);
}
demo.updateCursor = function(x, y) {
	x /= demo.width;
	y /= demo.height;
	var y_inverse = (1 - y);
	
	demo.drop_delay = y_inverse*y_inverse*y_inverse * 100 + 2;
	demo.wind = (x - 0.5) * 50;
}

document.addEventListener('mousemove', demo.mouseHandler);
document.addEventListener('touchstart', demo.touchHandler);
document.addEventListener('touchmove', demo.touchHandler);



// Frame ticker helper module
var Ticker = (function(){
	var PUBLIC_API = {};

	// public
	// will call function reference repeatedly once registered, passing elapsed time and a lag multiplier as parameters
	PUBLIC_API.addListener = function addListener(fn) {
		if (typeof fn !== 'function') throw('Ticker.addListener() requires a function reference passed in.');

		listeners.push(fn);

		// start frame-loop lazily
		if (!started) {
			started = true;
			queueFrame();
		}
	};

	// private
	var started = false;
	var last_timestamp = 0;
	var listeners = [];
	// queue up a new frame (calls frameHandler)
	function queueFrame() {
		if (window.requestAnimationFrame) {
			requestAnimationFrame(frameHandler);
		} else {
			webkitRequestAnimationFrame(frameHandler);
		}
	}
	function frameHandler(timestamp) {
		var frame_time = timestamp - last_timestamp;
		last_timestamp = timestamp;
		// make sure negative time isn't reported (first frame can be whacky)
		if (frame_time < 0) {
			frame_time = 17;
		}
		// - cap minimum framerate to 15fps[~68ms] (assuming 60fps[~17ms] as 'normal')
		else if (frame_time > 68) {
			frame_time = 68;
		}

		// fire custom listeners
		for (var i = 0, len = listeners.length; i < len; i++) {
			listeners[i].call(window, frame_time, frame_time / 16.67);
		}
		
		// always queue another frame
		queueFrame();
	}

	return PUBLIC_API;
}());



// {/* <script>
// function myFunction() {
//   var x = document.getElementById("myAudio").autoplay;
  
// }
// </script> */}



let context, analyser, dataArray;
const circleLow = document.getElementById('lowCircle');
const circleMedium = document.getElementById('mediumCircle');
const circleHigh = document.getElementById('highCircle');

const audio = document.getElementById('audio');
audio.crossOrigin = "anonymous";

const plate = document.getElementById('plate');

const togglePlayer = () => {
	if(!context){
		preparation();
	}
	if(audio.paused){
		playAudio();
	} else {
		pauseAudio();
	}
}

const playAudio = () => {
	audio.play();
	loop();
	plate.style.animationPlayState = 'running';
}

const pauseAudio = () => {
	audio.pause();
	plate.style.animationPlayState = 'paused';
}

const preparation = () => {
	context = new AudioContext();
	analyser = context.createAnalyser();
	const src = context.createMediaElementSource(audio);
	src.connect(analyser);
	analyser.connect(context.destination);
	loop();
}

const loop = () => {
	if(audio.paused){
		return;
	}

	window.requestAnimationFrame(loop);

	dataArray = new Uint8Array(analyser.frequencyBinCount);
	analyser.getByteFrequencyData(dataArray);

	changeCircles(circleLow, 20);
	changeCircles(circleMedium, 40);
	changeCircles(circleHigh, 60);

	setTimeout(() => {
		resetBorder(circleLow, circleMedium, circleHigh);
	}, 200);
}

const changeCircles = (circle, frequency) => {
	circle.style.height = `calc(50% + ${dataArray[frequency]}px)`;
	circle.style.backgroundColor = `rgba(${dataArray[frequency] / 2}, 58, 183, .55)`;
	// circle.style.transform = `translate(-${dataArray[frequency]}px, -${dataArray[frequency]}px)`;
	circle.style.borderRadius = generateBorderRadius();
}

const resetBorder = (...circles) =>{
	circles.forEach(circle => circle.style.borderRadius = '50%');
}

const generateBorderRadius = () => {
	const randomizeAngle = () => Math.floor(Math.random() * (85 - 15) + 15);

	const top = randomizeAngle();
	const bottom = randomizeAngle();
	const left = randomizeAngle();
	const right = randomizeAngle();

	return `${top}% ${100-top}% ${bottom}% ${100-bottom}% / ${left}% ${right}% ${100-right}% ${100-left}%`;
}

plate.addEventListener('click', togglePlayer);


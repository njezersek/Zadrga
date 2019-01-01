class Zipper{
	constructor(){
		let c = this.c = document.createElement("canvas");
		c.style.position = "fixed";
		c.style.left = "0";
		c.style.top = "0";
		document.body.insertBefore(c, document.body.firstChild);
		this.ctx = c.getContext("2d");
		//tooth canvas
		this.toothc = document.createElement("canvas");
		this.toothctx = this.toothc.getContext("2d");
		//slider canvas
		this.sliderc = document.createElement("canvas");
		this.sliderctx = this.sliderc.getContext("2d");
		// round rect
		let roundRect = function (x, y, w, h, r) {
			if (w < 2 * r) r = w / 2;
			if (h < 2 * r) r = h / 2;
			//this.beginPath();
			this.moveTo(x+r, y);
			this.arcTo(x+w, y,   x+w, y+h, r);
			this.arcTo(x+w, y+h, x,   y+h, r);
			this.arcTo(x,   y+h, x,   y,   r);
			this.arcTo(x,   y,   x+w, y,   r);

			this.closePath();
			return this;
		}
		this.sliderctx.roundRect = roundRect;

		this.w = 0;
		this.h = 0;
		this.size = 50;
		this.position = 0;
		this.targetPosition = 0;
		this.running = true;


		// event listeners
		if (c.addEventListener){
				// IE9, Chrome, Safari, Opera
				c.addEventListener("mousewheel", (e)=>this.mousewheel(e), false);
				// Firefox
				c.addEventListener("DOMMouseScroll", (e)=>this.mousewheel(e), false);
		}// IE 6/7/8
		else{
				c.attachEvent("onmousewheel", (e)=>this.mousewheel(e));
		}
		window.addEventListener("resize", (e)=>this.resize());
		c.addEventListener("touchmove", (e)=>this.touchmove(e), false);

		this.resize();
		this.animation();
	}

	tooth(x, y, angle){
		let ctx = this.ctx;
		let size = this.size;

		let r = Math.sqrt((size*size)/8);
		let sqrt = Math.sqrt(2*r*r);

		ctx.save();
		ctx.translate(x,y);
		ctx.rotate(-angle+Math.PI);
		ctx.drawImage(this.toothc,-size/2-sqrt,-r-size/2-sqrt/2);
		ctx.restore();
	}

	renderTooth(){
		let c = this.toothc;
		let ctx = this.toothctx;
		let w = this.w;
		let h = this.h;
		let size = this.size;
		let position = this.position;

		// resize
		c.width = size*2;
		c.height = size*2.5;

		ctx.clearRect(0, 0, c.width, c.height);

		let r = Math.sqrt((size*size)/8);
		ctx.fillStyle = "#eee";
		ctx.shadowBlur = size/2;
		ctx.shadowColor = 'rgba(0,0,0,0.2)';

		ctx.beginPath();
		let sqrt = Math.sqrt(2*r*r);
		ctx.moveTo(size/2, 					size/2 + r +sqrt+2*r);
		ctx.arc(size/2, 						size/2 + r +sqrt, 		r, Math.PI/2, -Math.PI/4, true);
		ctx.arc(size/2 + sqrt, 			size/2 + r +0,			 	r, Math.PI-Math.PI/4, Math.PI*2+Math.PI/4); // bunkica na koncu
		ctx.arc(size/2 +sqrt*2, 		size/2 + r +sqrt, 		r, Math.PI+Math.PI/4, Math.PI/2, true);
		ctx.lineTo(size/2 +sqrt*2, 	size/2 + r +sqrt+2*r);
		ctx.closePath();
		ctx.fill();
	}

	slider(){
		let ctx = this.ctx;
		let w = this.w;
		let h = this.h;
		let size = this.size;
		let position = this.position;

		ctx.drawImage(this.sliderc, w/2-size*2.5, position-size*4.5)
	}

	renderSlider(){
		let c = this.sliderc;
		let ctx = this.sliderctx;
		let w = this.w;
		let h = this.h;
		let size = this.size;
		let position = this.position;

		// resize
		c.width = size*5;
		c.height = size*8;

		ctx.clearRect(0, 0, c.width, c.height);
		//narisi colnicek
		ctx.fillStyle = "#eee";
		ctx.shadowBlur = size/2;
		ctx.shadowColor = 'rgba(0,0,0,0.2)';
		ctx.shadowColor = 'rgba(0,0,0,0.2)';
		ctx.beginPath();
		ctx.moveTo(size*2.5, size*0.5); // w/2, position-size*4
		ctx.lineTo(size*4.5, size*1.2); // w/2+size*2, position-size*3.3
		ctx.lineTo(size*4, size*4.5);		// w/2+size*1.5, position
		ctx.lineTo(size*1, size*4.5);		// w/2-size*1.5, position
		ctx.lineTo(size*0.5, size*1.4);
		ctx.closePath();
		ctx.fill();

		//rocaj colnicka
		ctx.beginPath();
		ctx.roundRect(size*2.5-size*.6, size*4.5-size*1.4, size*1.2, size*1.5,size/4);
		ctx.roundRect(size*2.5-size*1.2, size*4.5-size*2, size*2.4, size*5,size/2);
		ctx.closePath();
		ctx.fill("evenodd");

		//
		ctx.beginPath();
		ctx.roundRect(size*2.5-size*.3, size*4.5-size*3.5, size*.6, size*3, size/2);
		ctx.closePath();
		ctx.fill();
	}

	render(){
		let ctx = this.ctx;
		let w = this.w;
		let h = this.h;
		let size = this.size;
		let position = this.position;

		ctx.clearRect(0,0,w,h);

		// pobarvaj ozadje
		ctx.fillStyle = "#2bcbba"
		ctx.shadowBlur = 0;
		ctx.shadowColor = 'rgba(0,0,0,0)';
		let margin = Math.sqrt(4*(size*size)/8);
		ctx.beginPath();
		ctx.arc(0, position, w/2-margin, Math.PI, 2*Math.PI);
		ctx.arc(w, position, w/2-margin, Math.PI, 2*Math.PI);
		ctx.rect(0,position, w, h-position);
		ctx.fill();

		// narisi zobcke zadrge na ravnem delu
		let n = Math.ceil((h-position)/size); // koliko zobckov je na ravnem delu
		for(let i=0; i<n; i++){
			this.tooth(w/2, h - size*i, Math.PI/2);// leva stran
			this.tooth(w/2, h - size*(i+.5), -Math.PI/2);//desna stran
		}

		// narisi zobcke zadrge na kroznem delu
		let clx = 0;					// center levega kroga
		let cly = position;		// -
		let crx = w;					// center desnega kroga
		let cry = position;		// -
		let r = w/2;					// radij kroga
		let offeset = n*size - (h-position);
		let angleOffset = offeset/r;
		n = (Math.PI*r)/size;	// število zobckov
		for(let i=0; i<n; i++){
			//leva stran
			let angle = Math.PI/2+(Math.PI/n)*i + angleOffset;
			let sin = Math.sin(angle);
			let cos = Math.cos(angle);
			this.tooth(sin*(r)+clx, cos*(r)+cly, angle);
			//desna stran
			angle = Math.PI/2+(Math.PI/n)*(i+.5) + angleOffset;
			sin = Math.sin(-angle);
			cos = Math.cos(-angle);
			this.tooth(sin*(r)+crx, cos*(r)+cry, -angle);
		}

		// narisi colnicek
		this.slider();
	}

	animation(){
		this.position += Math.floor((this.targetPosition-this.position)/10);
		if(this.position < (this.h+this.w/2)){
			this.c.style.display = "block";
			this.render();
		}
		else{
			this.c.style.display = "none";
			this.running = false;
		}

		if(this.running){
			requestAnimationFrame(()=>this.animation());
		}
	}


	// EVENT HANDLERS

	mousewheel(e){
		e = window.event || e; // old IE support
		let delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
		this.targetPosition += -delta*100;
	}

	touchmove(e){
		if(this.position > this.h-100){
			this.targetPosition = this.h+this.w;
		}
		else{
			this.position = this.targetPosition = e.touches[0].clientY;
		}
	}

	resize(){
		this.w = this.c.width = window.innerWidth;
		this.h = this.c.height = window.innerHeight;
		this.size = Math.min(this.w,this.h)/20;
		this.renderTooth();
		this.renderSlider();
		this.render();
	}
}

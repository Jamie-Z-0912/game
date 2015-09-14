var memory;
null == memory && (memory = {});
var game;
null == game && (game = {});

// 计时器
var ms = 0;
var timeState = 0;

(function () {
	Array.prototype.indexOf = function (a) {
		for (var b = 0; b < this.length; b++) {
			if (this[b] == a) {
				return b;
			}
		}
		return -1;
	};
	Array.prototype.remove = function (a) {
		a = this.indexOf(a);
		-1 < a && this.splice(a, 1);
	};
	Array.prototype.shuffle = function () {
		for (var a = this.length, b = 0; b < a; b++) {
			var c = Math.randomInt(a - b);
			this.push(this[c]);
			this.splice(c, 1);
		}
		// console.log(this);
	};
	Array.prototype.clear = function () {
		this.length = 0;
	};
	Math.randomInt = function (a) {
		return parseInt(Math.random() * a);
	};
})();
(function () {
	game.qp_a = function (a) {
		return game.queue.getResult(a);
	};
	game.qp_b = function (a, b) {
		a = a * W / 4 + W / 8 + 2 * a;
		b = b * W / 4 + W / 8 + 4 * (b + 3);
		return [a, b];
	};
	game.qp_c = function (a) {
		if (2 <= game.arrOpenedCard.length) {
			for (; 0 < game.arrOpenedCard.length; ) {
				game.arrOpenedCard.pop().close();
			}
		}
		game.arrOpenedCard.push(a);
	};
	game.qp_d = function (a) {
		1 == game.arrOpenedCard.length && a.cid == game.arrOpenedCard[0].cid ? (a.dismiss(function () {
			game.score += 1;
			createjs.Sound.play("bonus", !0);
			// console.log(game.score)
			if(game.score == 2){
			// if(game.score == 6){
				timeState = 0;
				ms = 0;
	            game.qp_h(true);
			}
			0 >= game.gv.getNumChildren() && (game.qp_e(), game.score += 5);
		}), game.arrOpenedCard.pop().dismiss()) : game.qp_c(a);
	};
	game.qp_e = function () {
		game.arrOpenedCard = [];
		game.gv.clearCard();
		game.gv.mouseChildren = !0;
		// 生成成对的卡片
		for (var a = [], b = 0; 6 > b; b++) {
			a[2 * b] = a[2 * b + 1] = b % 4 + 1;
		}
		a.shuffle();
		// alert(a.length);
		game.gv.setupCard(a);
	};
	game.qp_f = function () {
		game.countDown = memory.qp_g;
		game.score = 0;
		game.gv.clearCard();
		game.view.ready(function () {
			game.qp_e();
			var s_time = new Date().getTime();
				// console.log(s_time)

			game.interval = setInterval(function () {
				var cur_time = new Date().getTime();
				var num = (cur_time - s_time)/1000;
				game.countDown = (memory.qp_g - num).toFixed(2);
				0 >= game.countDown && game.qp_h(false);
			}, 100);
		});
		
	};
	game.qp_h = function (result) {
		clearInterval(game.interval);
		game.gv.mouseChildren = !1;
		game.view.addChild(new memory.Qp_i(result));
		// alert(game.countDown);
		// score = game.score;
		score = ( memory.qp_g - game.countDown ).toFixed(2);
		onNewScore(score);
	};

})();
(function () {
	// memory.qp_j = 4;//列数
	// memory.qp_k = 5;//行数
	memory.qp_j = 4;//列数
	memory.qp_k = 3;
	// memory.qp_g = 60;
	memory.qp_g = 30;
	var start = false;

	memory.Qp_l = function () {
		this.initialize();
		this.x = this.y = 0;
		this.addChild(new createjs.Bitmap(game.qp_a("bg")));
		var par = this;

		var a = new createjs.Bitmap;
		a.regX = 290;
		a.regY = 80;
		a.x = 320;
		a.y = 450;
		this.ready = function (b) {
			var loadbg = new createjs.Bitmap;
			loadbg.image = game.qp_a("loadBg");
			loadbg.x = 320;
			loadbg.y = 300;
			loadbg.regX = loadbg.getBounds().width / 2;
			loadbg.regY = loadbg.getBounds().height / 2;

			var loading = new createjs.Bitmap;
			loading.image = game.qp_a("loading");
			loading.x = 320;
			loading.y = 300; 
			loading.regX = loading.getBounds().width / 2;
			loading.regY = loading.getBounds().height / 2;

			var loadfram =  new createjs.Bitmap;
			loadfram.image = game.qp_a("loadFram");
			loadfram.x = 320;
			loadfram.y = 216;
			loadfram.regX = loadfram.getBounds().width / 2;
			loadfram.regY = loadfram.getBounds().height / 2;

			par.addChild(loadbg, loading, loadfram);

			var loadtxt = new createjs.Bitmap;
			loadtxt.image = game.qp_a("loadTxt");
			loadtxt.x = 320;
			loadtxt.regX = loadtxt.getBounds().width / 2;
			loadtxt.regY = loadtxt.getBounds().height / 2;

			var e =  new createjs.Text( memory.qp_g + "s", "bold 20px Arial", "#fff");
			e.x = 430; 
			e.regX = e.getBounds().width / 2;
			e.regY = e.getBounds().height / 2;

			loadtxt.y = e.y = 300;

			this.addChild(loadtxt, e);

			var l = new createjs.Shape, k = this.getBounds();
			l.graphics.beginFill("#000").drawRect(k.x, k.y, k.width, k.height);
			l.alpha = 0.6;
			par.addChild(l);


			a.image = game.qp_a("go3");
			this.addChild(a);
			a.scaleX = a.scaleY = 3;
			a.regX = a.getBounds().width / 2;
			a.regY = a.getBounds().height / 2;
			a.alpha = 0;
			createjs.Tween.get(a).to({alpha:1, scaleX:1, scaleY:1}, 300).to({}, 500).call(function () {
				a.image = game.qp_a("go2");
				a.regX = a.getBounds().width / 2;
				a.regY = a.getBounds().height / 2;
				createjs.Tween.get(a).to({alpha:1, scaleX:1, scaleY:1}, 300).to({}, 500).call(function () {
					a.image = game.qp_a("go1");
					a.regX = a.getBounds().width / 2;
					a.regY = a.getBounds().height / 2;
					createjs.Tween.get(a).to({scaleX:1}, 300).to({alpha:0}, 200).call(function () {
						a.parent.removeChild(a);
						par.removeChild(l);
						var t = memory.qp_g * 1000;
						createjs.Tween.get(loading, { loop: false })
							.to({ x: -200}, t , createjs.Ease.getPowInOut(1));
						createjs.Ticker.setFPS(60);
						createjs.Ticker.addEventListener("tick", stage);
						par.on("tick", function () {
							e.text = game.countDown + "s";
						});
						b();
					});
				});
			});
		};

	};
	memory.Qp_m = function () {
		this.initialize();
		this.x = W / 2;
		this.y = H / 2;
		this.regX = W / 2;
		this.regY = H / 12;
		this.scaleX = 0.9; //卡片区域
		this.scaleY = 0.99; //卡片区域
		// alert(W+"W:H"+H);

		this.setupCard = function (a) {
			console.log(a) //卡片id
			// console.log(memory)
			for (var b = 0; b < a.length; b++) {
				var c = parseInt(b / memory.qp_k), c = new memory.Qp_n(c, b % memory.qp_k, a[b]);
				this.addChild(c);
			}
		};
		this.clearCard = function () {
			this.removeAllChildren();
		};
	};
	memory.Qp_o = function () {
		this.initialize();

		// var loadtxt = new createjs.Bitmap;
		// loadtxt.image = game.qp_a("loadTxt");
		// loadtxt.x = 320;
		// loadtxt.regX = loadtxt.getBounds().width / 2;
		// loadtxt.regY = loadtxt.getBounds().height / 2;

		// var e =  new createjs.Text( memory.qp_g + "s", "bold 20px Arial", "#fff");
		// e.x = 430; 
		// e.regX = e.getBounds().width / 2;
		// e.regY = e.getBounds().height / 2;

		// loadtxt.y = e.y = 300;

		// this.addChild(loadtxt, e);

		// this.on("tick", function () {
		// 	// a.text = game.score;
		// 	e.text = game.countDown + "s";
		// });
	};
	memory.Qp_n = function (a, b, c) {
		this.initialize();
		this.x = game.qp_b(a, b)[0];
		this.y = game.qp_b(a, b)[1];
		// this.scaleX = this.scaleY = this.initScale = 150 / 130;
		this.scaleX = this.initScale = 150 / 130;
		this.scaleY = this.scaleX * 130 / 169;
		this.cid = c;
		this.mouseChildren = !1;
		a = new createjs.Bitmap(game.qp_a(c));
		a.name = "bm";
		var d = new createjs.Bitmap(game.qp_a("back"));
		d.name = "back";
		var e = new createjs.Shape;
		e.name = "frame";
		e.graphics.drawRect(8, 8, a.getBounds().width + 2, a.getBounds().height + 2).endFill();
		// e.graphics.beginFill("#888888").drawRect(8, 8, a.getBounds().width + 2, a.getBounds().height + 2).endFill();
		// e.graphics.beginStroke("#888888").setStrokeStyle(10).drawRect(2, 2, a.getBounds().width - 2, a.getBounds().height - 2).endStroke();
		e.graphics.setStrokeStyle(10).drawRect(2, 2, a.getBounds().width - 2, a.getBounds().height - 2).endStroke();
		e.visible = !1;
		this.regX = d.getBounds().width / 2;
		this.regY = d.getBounds().height / 2;
		this.addChild(e, a, d);
		this.onClick(function (a) {
			a.target.open();
		});
		this.open = function () {
			d.visible && (this.mouseEnabled = !1, createjs.Tween.get(this).to({scaleX:0}, 50).call(function () {
				d.visible = !1;
				e.visible = !0;
				createjs.Tween.get(this).to({scaleX:this.initScale}, 50).call(function () {
					game.qp_d(this);
					this.mouseEnabled = !0;
				});
			}), createjs.Sound.play("flip", !0));
		};
		this.close = function () {
			d.visible || (this.mouseEnabled = !1, createjs.Tween.get(this).to({scaleX:0}, 50).call(function () {
				d.visible = !0;
				e.visible = !1;
				createjs.Tween.get(this).to({scaleX:this.initScale}, 50).call(function () {
					this.mouseEnabled = !0;
				});
			}));
		};
		this.dismiss = function (a) {
			createjs.Tween.get(this).wait(200).to({rotation:1080, scaleX:0, scaleY:0}, 100).call(function () {
				this.parent.removeChild(this);
				a && a();
			});
		};
	};
	memory.Qp_i = function (result) {
		// alert(result);
		this.initialize();
		this.setBounds(0, 0, W, H);
		var panel = new createjs.Bitmap;
		panel.x = 320;
		panel.y = 450;
		panel.image = game.qp_a("panel");
		panel.regX = panel.getBounds().width / 2;
		panel.regY = panel.getBounds().height / 2;

		var tit = new createjs.Bitmap;
		tit.x = 320;
		tit.y = 185;
		result ? tit.image = game.qp_a("succesT") : tit.image = game.qp_a("fairT");
		tit.regX = tit.getBounds().width / 2;
		tit.regY = tit.getBounds().height / 2;

		var l = new createjs.Shape, k = this.getBounds();
		l.graphics.beginFill("#000").drawRect(k.x, k.y, k.width, k.height);
		l.alpha = 0.77;
		// this.addChild(l, a, b, c, d, e, f, g, h);
		this.addChild(l, panel, tit);

		var a, b, c, d, e, f, g, btn_replay, btn_share;
		if(result){
			a = new createjs.Text(( memory.qp_g - game.countDown ).toFixed(2) + "s", "normal 40px Arial", "#f11d68");
			b = new createjs.Text("完成游戏", "normal 40px Arial", "#2a2a2a");
			a.x = 226;
			b.x = 368;
			a.y = b.y = 302;
			a.regX = a.getBounds().width / 2;
			b.regX = b.getBounds().width / 2;
			a.regY = b.regY = a.getBounds().height / 2;

			c = new createjs.Text("你打败了全国", "normal 40px Arial", "#2a2a2a");
			d = new createjs.Text("88%", "normal 40px Arial", "#f11d68");
			e = new createjs.Text("的选手", "normal 40px Arial", "#2a2a2a");
			c.x = 200;
			d.x = 384;
			e.x = 500;
			c.y = d.y = e.y = 364;
			c.regX = c.getBounds().width / 2;
			d.regX = d.getBounds().width / 2;
			e.regX = e.getBounds().width / 2;
			c.regY = d.regY = e.regY = c.getBounds().height / 2;

			f = new createjs.Text("奖励冰饮兑换券一张", "bold 40px Arial", "#ff5a00");
			f.x = 320;
			f.y = 470;
			f.regX = f.getBounds().width / 2;
			f.regY = f.getBounds().height / 2;

			btn_share = new createjs.Bitmap;
			btn_share.x = 320;
			btn_share.y = 580;
			btn_share.image = game.qp_a("sharebtn");
			btn_share.regX = btn_share.getBounds().width / 2;
			btn_share.regY = btn_share.getBounds().height / 2;

			this.addChild(a, b, c, d, e, f, btn_share);
			btn_share.onClick(function (a) {
				dp_share();
			});
		}else{
			a = new createjs.Text("游戏结束！", "bold 46px Arial", "#ff5a00");
			a.x=320;
			a.y=340;
			a.regX = a.getBounds().width / 2;
			a.regY = a.getBounds().height / 2;

			b = new createjs.Text("时间已到，再接再厉哦！", "normal 40px Arial", "#2a2a2a");
			b.x=320;
			b.y=420;
			b.regX = b.getBounds().width / 2;
			b.regY = b.getBounds().height / 2;

			btn_replay = new createjs.Bitmap;
			btn_replay.x = 320;
			btn_replay.y = 560;
			btn_replay.image = game.qp_a("fReplay");
			btn_replay.regX = btn_replay.getBounds().width / 2;
			btn_replay.regY = btn_replay.getBounds().height / 2;

			this.addChild(a, b, btn_replay);

			btn_replay.onClick(function (a) {
				game.view.removeChild(a.target.parent);
				game.qp_f();
			});
		}

		// btn1.onClick(function (a) {
		// 	goHome();
		// });
	};
	memory.Qp_m.prototype = new createjs.Container;
	memory.Qp_o.prototype = new createjs.Container;
	memory.Qp_n.prototype = new createjs.Container;
	memory.Qp_i.prototype = new createjs.Container;
	memory.Qp_l.prototype = new createjs.Container;
	createjs.DisplayObject.prototype.onClick = function (a) {
		this.on("click", function (b) {
			createjs.Touch.isSupported() && b.nativeEvent.constructor == MouseEvent || a(b);
		});
	};
})();
var queue;
function loadResource() {
	SCREEN_SHOW_ALL = !0;
	H = 1000;
	var a = new ProgressBar(0.8 * W, 40);
	a.regX = a.w / 2;
	a.regY = a.h / 2;
	a.x = W / 2;
	a.y = H / 2;
	// alert('a.regX:'+a.regX+',a.regY:'+a.regY+',a.x:'+a.x+',a.y:'+a.y);

	stage.addChild(a);
	queue = game.queue = new createjs.LoadQueue(!1);
	queue.setMaxConnections(30);
	loadGameData();
	queue.on("complete", setup, null, !0);
	// queue.loadManifest({path:RES_DIR + "img/", manifest:[{src:"1.png", id:"1"}, {src:"2.png", id:"2"}, {src:"3.png", id:"3"}, {src:"4.png", id:"4"}, {src:"5.jpg", id:"5"}, {src:"6.jpg", id:"6"}, {src:"frame.png", id:"frame"}, {src:"back.png", id:"back"}, {src:"ready.png", id:"ready"}, {src:"go1.png", id:"go"}, {src:"bg.jpg", id:"bg"}, {src:"topline.png", id:"topline"}, {src:"bestscore.png", id:"bestscore"}, {src:"curscore.png", id:"curscore"}, {src:"gameover.png", id:"gameover"}, {src:"replaybtn.png", id:"replaybtn"}, {src:"sharebtn.png", id:"sharebtn"}, {src:"toplistbtn.png", id:"toplistbtn"}]}, !1);
	queue.loadManifest({path:RES_DIR + "img/", manifest:[{src:"1.png", id:"1"}, {src:"2.png", id:"2"}, {src:"3.png", id:"3"}, {src:"4.png", id:"4"}, {src:"frame.png", id:"frame"}, {src:"back.png", id:"back"}, {src:"bg.jpg", id:"bg"}, {src:"go1.png", id:"go1"}, {src:"go2.png", id:"go2"}, {src:"go3.png", id:"go3"}, {src:"loading.png", id:"loading"}, {src:"loading-txt.png", id:"loadTxt"}, {src:"loading-bg.png", id:"loadBg"}, {src:"loading-fram.png", id:"loadFram"}, {src:"panelbg.png", id:"panel"},{src:"success-t.png", id:"succesT"} , {src:"fair-t.png", id:"fairT"} ,{src:"f-replay.png", id:"fReplay"}, {src:"share.png", id:"sharebtn"}, {src:"toplistbtn.png", id:"toplistbtn"}]}, !1);
	USE_NATIVE_SOUND || (IS_NATIVE_ANDROID ? (createjs.Sound.registMySound("flip", 0), createjs.Sound.registMySound("bonus", 2), createjs.Sound.registMySound("silenttail", 4), queue.loadFile({id:"sound", src:RES_DIR + "audio/all.mp3"})) : (createjs.Sound.alternateExtensions = ["ogg"], queue.installPlugin(createjs.Sound), queue.loadManifest({path:RES_DIR + "audio/", manifest:[{src:"flip.mp3", id:"flip"}, {src:"bonus.mp3", id:"bonus"}]}, !1)));
	a.forQueue(queue);
	queue.load();
}
function setup() {
	game.view = new memory.Qp_l; //3,2,1开始
	game.gv = new memory.Qp_m;
	game.sv = new memory.Qp_o;
	game.view.addChild(game.gv, game.sv);

	stage.addChild(game.view);


	game.qp_f();
}


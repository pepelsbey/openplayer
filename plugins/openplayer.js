var openplayer = function (media, options) {
	if(typeof media == 'undefined') {
		return;
	}
	this.options = {
		width : 400
	}	
	this.media = media;
	this.support = this.tests();
	this.ui();
	this.events();
	this.actions();
	this.buttons();
	return this;
};

// UI 
openplayer.prototype.ui = function(media) {
	var _this = this.ui;
	var options = this.options;
	
	var dress = function (node) {
		var parent_node = node.parentNode;
		var node_width = getAttr(node,'width') || options.width;
		addClass(node,'o-player-media');
		// Вставляем node в div.o-player
		var o_player = createElement('div');
			setStyle(o_player,'width', node_width+'px')
			addClass(o_player, 'o-player' + (node.nodeName == 'VIDEO' ? ' o-player-video' : ' o-player-audio'));
			insertAfter(parent_node, o_player, node);
		// Вставляет div.o-player-frame
		var o_player_frame = createElement('div');
			addClass(o_player_frame, 'o-player-frame');
			injectNode(o_player, o_player_frame);
			injectNode(o_player_frame,node);
		// Вставляем кнопку div.o-player-start
		var o_button_start = createElement('div');
			addClass(o_button_start,'o-player-button o-player-start');
			injectNode(o_player_frame, o_button_start);
		// Вставляем div.o-player-spinner
		var o_player_spinner = createElement('div');
			addClass(o_player_spinner,'o-player-spinner');
			injectNode(o_player_frame, o_player_spinner);	
		// Вставляем панель управления div.o-player-controls
		var o_player_controls = createElement('div');
			addClass(o_player_controls,'o-player-controls');
			injectNode(o_player_frame, o_player_controls);
		// Грязно, но лень вставлять по одному
			o_player_controls.innerHTML = '<div class="o-player-button o-player-playback"></div><div class="o-player-bar o-player-seeker o-player-seeker-short"><div class="o-player-label o-player-label-current">00:00</div><div class="o-player-bar o-player-loaded" style="width:0%"></div><div class="o-player-bar o-player-played" style="width:0%"><div class="o-player-button o-player-knob"></div></div><div class="o-player-label o-player-label-remain">00:00</div></div><div class="o-player-button o-player-volume o-player-volume-100"></div><div class="o-player-bar o-player-seeker o-player-level"><div class="o-player-bar o-player-loaded" style="width:100%"><div class="o-player-button o-player-knob"></div></div></div><div class="o-player-button o-player-fit"></div><div class="o-player-button o-player-mode"></div>';
	}

	this.media.controls = false;
	dress(this.media);
};

// ACTIONS
openplayer.prototype.actions = function() {
	var frame_node = this.media.parentNode;
	var current_media = false;
	var _this = this;

	this.actions.play = function(e) {
		var media = _this.media;
		if(hasClass(frame_node.parentNode,'o-player-'+media.nodeName.toLowerCase()+'-playing')) {
			media.pause();
		}else{
			media.play();
		}
	};
	this.actions.seek = function(media, pct) {
		var time = fromPct(pct,media.duration);
		media.currentTime = time;
	}
	this.actions.volume = function(media, pct) {
		var volume = fromPct(pct,1);
		//console.log(volume);
		media.volume = volume;
	}
	this.actions.slider = function(e) {
		var seeker = e.target.parentNode.parentNode;
		var played = e.target.parentNode;
		var freeze = 0;
		var knob_width = getOffset(e.target).width;
		var seeker_width = getOffset(seeker).width;
		var dragmenot = function(e) {
			var played_width = getOffset(played).width;
			if((hasClass(e.target, 'o-player-seeker') || hasClass(e.target, 'o-player-played') || hasClass(e.target, 'o-player-knob'))) {
				if(hasClass(e.target, 'o-player-knob')) {
					var w = (e.layerX+played_width)-knob_width;
				}else{
					var w = e.layerX;
				}
				if(seeker_width >= w) {
					setStyle(played,'width',w+'px');
				}
			}
		};
		var cleanevents = function(e) {
			var pct = Math.round(100*getOffset(played).width/seeker_width);
			if(hasClass(seeker,'o-player-level')) { // Volume
				_this.actions.volume(_this.media, pct);
			}else{
				_this.actions.seek(_this.media, pct);
			}
			removeEvent(document,'mousemove', dragmenot);
			removeEvent(document,'mouseup', cleanevents);
		};
		addEvent(document,'mousemove', dragmenot);
		addEvent(document,'mouseup', cleanevents);
	};
	this.actions.position = function(e) {
		if(hasClass(e.target, 'o-player-seeker') || hasClass(e.target,'o-player-played')) {
			var w = 0;
			if(hasClass(e.target,'o-player-played')) {
				w = getOffset(e.target.parentNode).width;
			}else{
				w = getOffset(e.target).width
			}
			var p = Math.round(100*e.layerX/w);
			_this.actions.seek(_this.media, p);
		}
	};
	this.actions.sound = function(e) {

		if(hasClass(e.target, 'o-player-seeker') || hasClass(e.target,'o-player-loaded')) {
			var w = 0;
			if(hasClass(e.target,'o-player-loaded')) {
				w = getOffset(e.target.parentNode).width;
			}else{
				w = getOffset(e.target).width
			}
			var p = Math.round(100*e.layerX/w);
			_this.actions.volume(_this.media,p);
		}
	};
	this.actions.mute = function(e) {
		var media = _this.media;
		media.muted = !media.muted;
	};
	function fittoscreen (resize) {
		var media = _this.media;
		var window_size = getSize(window);

		if(hasClass(document.body,'o-player-body') && !resize) {
			removeClass(document.body,'o-player-body');
			removeClass(frame_node.parentNode,'o-player-video-fullscreen');
		}else{
			addClass(document.body,'o-player-body');
			addClass(frame_node.parentNode,'o-player-video-fullscreen');
			var media_size = getSize(media);
			
			if(media_size.width == window_size.width && media_size.height <= window_size.height) {
				var top = (window_size.height-media_size.height)/2;
				addClass(frame_node.parentNode,'o-player-video-fullscreen-horizontal');
				setStyle(media,'top',top+'px');
			}else if (media_size.width <= window_size.width && media_size.height == window_size.height){
				var left = (window_size.width-media_size.width)/2;
				addClass(frame_node.parentNode,'o-player-video-fullscreen-vertical');
				setStyle(media,'left',left+'px');
			}
		}
		
	};
	this.actions.fullscreen = function(e) {
		var media = _this.media;
		if('webkitEnterFullScreen' in media) {
			try {
			    media.webkitEnterFullScreen()
			} catch(err) {
			  	fittoscreen(0);
			}
		}else{
			fittoscreen(0);
		}
	};
	this.actions.resize = function(e) {
		fittoscreen(1);
	};
	
};
// TESTS
openplayer.prototype.tests = function() {
	// These tests evaluate support of the video/audio elements, as well as
    // testing what types of content they support.
    //
    // We're using the Boolean constructor here, so that we can extend the value
    // e.g.  Modernizr.video     // true
    //       Modernizr.video.ogg // 'probably'
    //
    // Codec values from : http://github.com/NielsLeenheer/html5test/blob/9106a8/index.html#L845
    //                     thx to NielsLeenheer and zcorpan
    
    // Note: in FF 3.5.1 and 3.5.0, "no" was a return value instead of empty string.
    // Modernizr does not normalize for that.
	var doc = document;
	this.tests.audio = function() {
		var elem = doc.createElement('audio'),
            bool = !!elem.canPlayType;
        
        if (bool){  
            bool      = new Boolean(bool);  
            bool.ogg  = elem.canPlayType('audio/ogg; codecs="vorbis"');
            bool.mp3  = elem.canPlayType('audio/mpeg;');
            
            // Mimetypes accepted: 
            //   https://developer.mozilla.org/En/Media_formats_supported_by_the_audio_and_video_elements
            //   http://bit.ly/iphoneoscodecs
            bool.wav  = elem.canPlayType('audio/wav; codecs="1"');
            bool.m4a  = elem.canPlayType('audio/x-m4a;') || elem.canPlayType('audio/aac;');
        }
        return bool;
	};
	this.tests.video = function() {
		var elem = doc.createElement('video'),
            bool = !!elem.canPlayType;
        
        if (bool){  
            bool      = new Boolean(bool);  
            bool.ogg  = elem.canPlayType('video/ogg; codecs="theora"');
            
            // Workaround required for IE9, which doesn't report video support without audio codec specified.
            //   bug 599718 @ msft connect
            var h264 = 'video/mp4; codecs="avc1.42E01E';
            bool.h264 = elem.canPlayType(h264 + '"') || elem.canPlayType(h264 + ', mp4a.40.2"');
            
            bool.webm = elem.canPlayType('video/webm; codecs="vp8, vorbis"');
        }
        return bool;
	};
	return {video:this.tests.video(), audio:this.tests.audio()};
};


// BUTTONS
openplayer.prototype.buttons = function() {
	var frame_node = this.media.parentNode;
	var _this = this;
	
	addEvent(getByClass('o-player-playback',frame_node)[0],'click', this.actions.play);
	addEvent(getByClass('o-player-start',frame_node)[0],'click', this.actions.play);
	addEvent(getByClass('o-player-volume',frame_node)[0],'click', this.actions.mute);
	addEvent(getByClass('o-player-mode',frame_node)[0],'click', this.actions.fullscreen);
	addEvent(getByClass('o-player-seeker',frame_node)[0],'click', this.actions.position);
	addEvent(getByClass('o-player-knob',frame_node)[0],'mousedown', this.actions.slider);
	addEvent(getByClass('o-player-level',frame_node)[0],'mousedown', this.actions.slider);
	addEvent(getByClass('o-player-level',frame_node)[0],'click', this.actions.sound);
	//addEvent(window,'resize', this.actions.resize);
};

// EVENTS
openplayer.prototype.events = function() {
	_this = this;
	function updateTotalTime (e) {

		var frame_node = e.target.parentNode;
		getByClass('o-player-played', frame_node)[0].style.width=toPct(e.target.duration,e.target.currentTime)+'%';
		setHtml(getByClass('o-player-label-remain',frame_node)[0], secondsToTime(e.target.duration).join(':'));
	}
	this.events.onLoad = function (e) {
		updateTotalTime(e);
	};
	this.events.onLoadstart = function(e) {
		console.log(e.type);
	};
	this.events.onPlaying = function (e) {
		// Показываем/Скрываем кнопку o-player-start
		var frame_node = e.target.parentNode;
		toggle(getByClass('o-player-start',e.target.parentNode)[0]);
		addClass(frame_node.parentNode,'o-player-'+e.target.nodeName.toLowerCase()+'-playing');
	}
	this.events.onPause = function(e) {
		// Показываем/Скрываем кнопку o-player-start
		var frame_node = e.target.parentNode;
		toggle(getByClass('o-player-start',e.target.parentNode)[0]);
		removeClass(frame_node.parentNode,'o-player-'+e.target.nodeName.toLowerCase()+'-playing');
	};
	this.events.onTimeupdate = function(e) {
		// Показываем сколько проиграно
		var frame_node = e.target.parentNode;
		getByClass('o-player-played', frame_node)[0].style.width=toPct(e.target.duration,e.target.currentTime)+'%';
		var current_time = e.target.currentTime;
		
		setHtml(getByClass('o-player-label-current',frame_node)[0], secondsToTime(current_time).join(':'));
		// ?
		setHtml(getByClass('o-player-label-remain',frame_node)[0], secondsToTime((e.target.duration)).join(':'));
	};
	this.events.onLoadeddata = function(e) {
		setHtml(getByClass('o-player-label-remain',frame_node)[0], secondsToTime((e.target.duration)).join(':'));
	};
	this.events.onLoadedmetadata = function(e) {
		
	};
	this.events.onDurationchange = function(e) {
		console.log(e.type);
	};
	this.events.onProgress = function(e) {
		// Показываем сколько загружено
		if(e.loaded && e.total) { // Старый драфт
			getByClass('o-player-loaded', e.target.parentNode)[0].style.width=toPct(e.total,e.loaded)+'%';
		}else if(e.target.buffered) {
			getByClass('o-player-loaded', e.target.parentNode)[0].style.width=toPct(e.target.duration,e.target.buffered.end(0))+'%';
		}
	};
	this.events.onSuspend = function(e) {
		console.log(e.type);
	};
	this.events.onAbort = function(e) {
		console.log(e.type);
	};
	this.events.onError = function(e) {
		console.log(e.type);
	};
	this.events.onEmptied = function(e) {
		console.log(e.type);
	};
	this.events.onStalled = function(e) {
		console.log(e.type);
	};
	this.events.onWaiting = function(e) {
		console.log(e.type);
	};
	this.events.onWaiting = function(e) {
		console.log(e.type);
	};
	this.events.onCanplay = function(e) {
		updateTotalTime(e);
	};
	this.events.onCanplaythrough = function(e) {
		updateTotalTime(e);
	};
	this.events.onSeeking = function(e) {
		console.log(e.type);
	};
	this.events.onSeeked = function(e) {
		console.log(e.type);
	};
	this.events.onEnded = function(e) {
		var frame_node = e.target.parentNode;
		toggle(getByClass('o-player-start',frame_node)[0]);
		removeClass(frame_node.parentNode,'o-player-'+e.target.nodeName.toLowerCase()+'-playing');
		_this.actions.seek(e.target, 0);
		e.target.pause();
	};
	this.events.onRatechange = function(e) {
		console.log(e.type);
	};
	this.events.onVolumechange = function(e) {
		var frame_node = e.target.parentNode;
		var o_player_volume = getByClass('o-player-volume', frame_node)[0];
		var o_player_loaded = getByClass('o-player-loaded',getByClass('o-player-level', frame_node)[0])[0];

		var volume = e.target.volume;
		if(e.target.muted) {
			removeClass(o_player_volume,'o-player-volume-50');
			removeClass(o_player_volume,'o-player-volume-100');
			addClass(o_player_volume,'o-player-volume-0');
			setStyle(o_player_loaded,'width','0');
		}else{
			if(volume == 0) {
				removeClass(o_player_volume,'o-player-volume-50');
				removeClass(o_player_volume,'o-player-volume-100');
				addClass(o_player_volume,'o-player-volume-0');
			}else if ( volume <= '0.5') {
				removeClass(o_player_volume,'o-player-volume-0');
				removeClass(o_player_volume,'o-player-volume-100');
				addClass(o_player_volume, 'o-player-volume-50');
			} else if (volume >= '0.5'){
				removeClass(o_player_volume, 'o-player-volume-50');
				removeClass(o_player_volume, 'o-player-volume-0');
				addClass(o_player_volume, 'o-player-volume-100');
			}
			
			setStyle(o_player_loaded,'width',toPct(1,volume)+'%');
		}
	};
	
	var media_events = ['load','loadstart','progress','suspend','abort','error',
	'emptied','stalled','play','pause','loadedmetadata','loadeddata',
	'waiting','playing','canplay','canplaythrough','seeking','seeked',
	'timeupdate','ended','ratechange','durationchange','volumechange'];
	
	for (var k=0; k < media_events.length; k++) {
		var event_function = media_events[k].charAt(0).toUpperCase() + media_events[k].slice(1);
		if('on'+event_function in this.events) {
			addEvent(this.media, media_events[k], this.events['on'+event_function]);
		};
		
	};
};

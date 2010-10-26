(function($) {

    $.fn.openplayer = function(options) {
        return this.each(function() {
        	new OpenPlayer(this, options);
        });
    };
	
	var OpenPlayer = function(container, options) {
		this.settings = {
			controlsSelectors : {
				startButton : '.o-player-start',
				playPauseButton : '.o-player-playback',
				durationKnob : '.o-player-played .o-player-knob',
				durationPlayedBar : '.o-player-played',
				durationLoadedBar : '.o-player-seeker-short .o-player-loaded',
				timeSpentLabel : '.o-player-label-current',
				timeLeftLabel : '.o-player-label-remain',
				volumeIcon : '.o-player-volume',
				volumeLevel : '.o-player-level',
				volumeLevelKnob : '.o-player-level .o-player-knob',
				fullscreenToggler : '.o-player-mode'
			},
			playingClassname : 'o-player-video-playing',
			mediaSelectors : {
				video : 'video',
				audio : 'audio'
			}
		};
		
		this.container = $(container);
		this.controls = [];
		this.state = 'paused';
		this.mediaType = 'unknown';
		
		if (options) {
			$.extend(this.settings, options);
		}
		
		
		this.init();
	};
	
	OpenPlayer.prototype = {
		init : function() {
			this.findElems();
			this.bindEvents();			
		},
		
		findElems : function() {
			var controlsSelectors = this.settings.controlsSelectors,
				controls = this.controls,
				container = this.container;
			
			for (var control in controlsSelectors) {
				controls[control] = container.find(controlsSelectors[control]);
			}
			
			this.defineMediaType();
		},
		
		defineMediaType : function() {
			var videoElem = this.container.find(this.settings.mediaSelectors.video),
				audioElem = this.container.find(this.settings.mediaSelectors.audio);
				
			if (videoElem.length) {
				this.mediaType = 'videoElem';
				this.media = videoElem.get(0);
			} else if (audioElem.length) {
				this.mediaType = 'audio';
				this.media = audioElem.get(0);
			} else {
				this.mediaType = 'unknown';
				$.error('There are no media tags in container.');
			}
		},
		
		bindEvents : function() {
			var that = this;
			
			this.controls.playPauseButton.add(this.controls.startButton)
				.bind('click', function(event) {
					event.preventDefault();
					
					that.togglePlay();
				});
			
			this.container.bind('statechange', function() {
				that.toggleUpdateTimer();
			});
			
			/*
			this.media.addEventListener('load', function(event) {
				that.update('time');
			}, false);
			*/
			
			// this.media.addEventListener('timeupdate', rememberProgressParams, false);
			
			this.media.addEventListener('progress', function(event) {
				that.durationLoaded = (event.loaded / event.total * 100) + '%';
				that.update('durationLoaded');
			}, false);
		},
		
		play : function() {
			this.media.play();
			this.container.addClass(this.settings.playingClassname);

			this.state = 'playing';
			this.container.trigger('statechange');
		},
		
		pause : function() {
			this.media.pause();
			this.container.removeClass(this.settings.playingClassname);

			this.state = 'paused';
			this.container.trigger('statechange');
		},
		
		toggleUpdateTimer : function() {
			var that = this;
			
			if (this.state == 'playing') {
				this.update('time');
				this.timeUpdateTimer = setInterval(function() {
					that.update('time');
				}, 1000);
				
				this.update('duration');
				this.durationUpdateTimer = setInterval(function() {
					that.update('duration');
				}, 100);
			} else if (this.state == 'paused') {
				clearInterval(this.timeUpdateTimer);
				clearInterval(this.durationUpdateTimer);
			}
		},
		
		update : function(indicator) {
			var media = this.media,
				currentTime = media.currentTime,
				duration = media.duration;
			
			if (indicator == 'time') {
				this.timeSpent = secondsToTime(currentTime);
				this.timeLeft = secondsToTime(duration - currentTime);
				
				this.controls.timeSpentLabel.text(this.timeSpent);
				this.controls.timeLeftLabel.text(this.timeLeft);
			} else if (indicator == 'duration') {
				this.durationPlayed = (currentTime / duration * 100) + '%';							
				
				this.controls.durationPlayedBar.width(this.durationPlayed);
			} else if (indicator == 'durationLoaded') {
				this.controls.durationLoadedBar.width(this.durationLoaded);
			}
		},
		
		startLoading : function() {
			
		},

		togglePlay : function() {
			if (this.state == 'paused') {
				this.play();
			} else {
				this.pause();
			}
		}
	};
	
	function secondsToTime(secs) {
		var hours = Math.floor(secs / (60 * 60)),
			divisorForMinutes = secs % (60 * 60),
			minutes = Math.floor(divisorForMinutes / 60),
			divisorForSeconds = divisorForMinutes % 60,
			seconds = Math.ceil(divisorForSeconds),
			arr;
		
		if (secs >= 3600) {
			arr = [
				hours > 9 ? parseInt(hour, 10) : '0' + parseInt(hours, 10),
				minutes > 9 ? parseInt(minutes, 10) : '0' + parseInt(minutes, 10),
				seconds > 9 ? parseInt(seconds, 10) : '0' + parseInt(seconds, 10)
			];
		} else {
			arr = [
				minutes > 9 ? parseInt(minutes, 10) : '0' + parseInt(minutes, 10),
				seconds > 9 ? parseInt(seconds, 10) : '0' + parseInt(seconds, 10)
			];
		}
 
		return arr.join(':');				
	}
	 
})(jQuery);

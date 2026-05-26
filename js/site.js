(() => {
    const player = document.getElementById('music-player');
    const audio = document.getElementById('cover-audio');

    if (!player || !audio) return;

    const playlist = [
        {
            title: 'Glass Morning',
            artist: 'Lotus Night Drive',
            src: '/audio-glass-morning.m4a',
        },
        {
            title: 'Blue Haze Loop',
            artist: 'Static Garden',
            src: '/audio-glass-morning.m4a',
        },
    ];

    const trackTitle = document.getElementById('player-track-title');
    const trackArtist = document.getElementById('player-track-artist');
    const toggleButton = document.getElementById('player-toggle');
    const prevButton = document.getElementById('player-prev');
    const nextButton = document.getElementById('player-next');
    const progress = document.getElementById('player-progress-current');
    const currentTime = document.getElementById('player-current-time');
    const duration = document.getElementById('player-duration');

    let currentIndex = 0;

    function formatTime(seconds) {
        if (!Number.isFinite(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${String(secs).padStart(2, '0')}`;
    }

    function renderPlayIcon(isPlaying) {
        toggleButton.innerHTML = isPlaying
            ? '<svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M8 5h3v14H8zM13 5h3v14h-3z"></path></svg>'
            : '<svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M8 5.14v14l11-7-11-7z"></path></svg>';
        player.classList.toggle('is-playing', isPlaying);
    }

    function loadTrack(index) {
        const track = playlist[index];
        audio.src = track.src;
        trackTitle.textContent = track.title;
        trackArtist.textContent = track.artist;
        progress.style.width = '0%';
        currentTime.textContent = '0:00';
        duration.textContent = '0:00';
        renderPlayIcon(false);
    }

    async function togglePlay() {
        if (audio.paused) {
            try {
                await audio.play();
                renderPlayIcon(true);
            } catch (error) {
                renderPlayIcon(false);
            }
        } else {
            audio.pause();
            renderPlayIcon(false);
        }
    }

    function stepTrack(direction) {
        currentIndex = (currentIndex + direction + playlist.length) % playlist.length;
        loadTrack(currentIndex);
        togglePlay();
    }

    toggleButton.addEventListener('click', togglePlay);
    prevButton.addEventListener('click', () => stepTrack(-1));
    nextButton.addEventListener('click', () => stepTrack(1));

    audio.addEventListener('loadedmetadata', () => {
        duration.textContent = formatTime(audio.duration);
    });

    audio.addEventListener('timeupdate', () => {
        const percent = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
        progress.style.width = `${percent}%`;
        currentTime.textContent = formatTime(audio.currentTime);
    });

    audio.addEventListener('ended', () => stepTrack(1));
    audio.addEventListener('pause', () => renderPlayIcon(false));
    audio.addEventListener('play', () => renderPlayIcon(true));

    loadTrack(currentIndex);
})();

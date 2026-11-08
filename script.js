const audio = document.getElementById("bg-music");
const playBtn = document.getElementById("play-btn");
const progressFill = document.getElementById("progress-fill");
const progressContainer = document.getElementById("progress-container");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");

// Громкость 50%
audio.volume = 0.5;

function formatTime(seconds) {
  if (isNaN(seconds)) return "00:00";
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
}

audio.addEventListener("timeupdate", () => {
  if (audio.duration) {
    const percent = (audio.currentTime / audio.duration) * 100;
    progressFill.style.width = `${percent}%`;
    currentTimeEl.textContent = formatTime(audio.currentTime);
  }
});

audio.addEventListener("loadedmetadata", () => {
  durationEl.textContent = formatTime(audio.duration);
});

playBtn.addEventListener("click", () => {
  if (audio.paused) {
    audio.play();
    playBtn.classList.replace("fa-play", "fa-pause");
  } else {
    audio.pause();
    playBtn.classList.replace("fa-pause", "fa-play");
  }
});

// Перемотка трека по клику
progressContainer.addEventListener("click", (e) => {
  const rect = progressContainer.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const width = rect.width;
  const duration = audio.duration;

  if (duration && !isNaN(duration)) {
    audio.currentTime = (clickX / width) * duration;
  }
});

// Автоплей (с обходом блокировки браузера)
let playPromise = audio.play();
if (playPromise !== undefined) {
  playPromise
    .then((_) => {
      playBtn.classList.replace("fa-play", "fa-pause");
    })
    .catch((error) => {
      // Если браузер заблокировал автоплей, включаем по первому клику
      document.body.addEventListener(
        "click",
        () => {
          audio.play();
          playBtn.classList.replace("fa-play", "fa-pause");
        },
        { once: true },
      );
    });
}

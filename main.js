let audio = new Audio();

const urlInput = document.getElementById("urlInput");
const playBtn = document.getElementById("playBtn");
const pauseBtn = document.getElementById("pauseBtn");
const volume = document.getElementById("volume");

volume.value = 0.6;
audio.volume = 0.6;

playBtn.onclick = () => {
  const url = urlInput.value.trim();
  if (!url) return;

  audio.src = url;
  audio.play();
};

pauseBtn.onclick = () => {
  audio.pause();
};

volume.oninput = () => {
  audio.volume = volume.value;
};

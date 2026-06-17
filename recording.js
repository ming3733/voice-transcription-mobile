const finishButton = document.getElementById("finishButton");
const recordTimer = document.getElementById("recordTimer");
const recordProgress = document.getElementById("recordProgress");

const maxSeconds = 10;
const circumference = 309.27;
let startedAt = Date.now();
let finished = false;
let loading = false;

function formatTime(value) {
  return `00:${String(value).padStart(2, "0")}`;
}

function goResult() {
  if (finished) return;
  finished = true;
  window.location.href = "./result.html";
}

function setProgress(progress) {
  const safeProgress = Math.max(0, Math.min(1, progress));
  recordProgress.style.strokeDashoffset = String(circumference * (1 - safeProgress));
}

function startLoadingThenResult() {
  if (finished || loading) return;
  loading = true;
  finishButton.classList.add("is-loading");
  finishButton.disabled = true;
  window.setTimeout(goResult, 2000);
}

finishButton.addEventListener("click", startLoadingThenResult);

const timer = window.setInterval(() => {
  if (finished || loading) {
    window.clearInterval(timer);
    return;
  }

  const elapsed = Math.min(maxSeconds, (Date.now() - startedAt) / 1000);
  const displaySeconds = Math.min(maxSeconds, Math.floor(elapsed));
  recordTimer.textContent = formatTime(displaySeconds);
  setProgress(elapsed / maxSeconds);

  if (elapsed >= maxSeconds) {
    window.clearInterval(timer);
    recordTimer.textContent = formatTime(maxSeconds);
    setProgress(1);
    startLoadingThenResult();
  }
}, 100);

recordTimer.textContent = formatTime(0);
setProgress(0);

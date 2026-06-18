const screens = [...document.querySelectorAll(".screen")];
const recordTimer = document.getElementById("recordTimer");
const recordProgress = document.getElementById("recordProgress");

const maxSeconds = 10;
const resultToastFlag = "voiceResultToast";
const circumference = 320.44;
let startedAt = 0;
let timerHandle = null;
let loadingHandle = null;
let toastHandle = null;
let currentState = "ready";

function formatSeconds(value) {
  return `00:${String(Math.min(maxSeconds, Math.max(0, value))).padStart(2, "0")}`;
}

function showState(nextState) {
  currentState = nextState;
  screens.forEach((screen) => {
    screen.hidden = screen.dataset.state !== nextState;
  });
  window.location.hash = nextState === "ready" ? "" : nextState;

  if (nextState === "result") {
    showFailureToastFromFlag();
  }
}

function stopTimers() {
  if (timerHandle) {
    window.clearInterval(timerHandle);
    timerHandle = null;
  }
  if (loadingHandle) {
    window.clearTimeout(loadingHandle);
    loadingHandle = null;
  }
}

function setRecordingProgress(elapsed) {
  const safeElapsed = Math.min(maxSeconds, Math.max(0, elapsed));
  const progress = safeElapsed / maxSeconds;
  recordTimer.textContent = formatSeconds(Math.floor(safeElapsed));
  recordProgress.style.strokeDashoffset = String(circumference * (1 - progress));
  return progress;
}

function startRecording() {
  stopTimers();
  startedAt = Date.now();
  setRecordingProgress(0);
  showState("recording");

  timerHandle = window.setInterval(() => {
    const elapsed = Math.min(maxSeconds, (Date.now() - startedAt) / 1000);
    const progress = setRecordingProgress(elapsed);
    if (progress >= 1) {
      enterLoading();
    }
  }, 100);
}

function setResultToastFlag(shouldShow) {
  try {
    if (shouldShow) {
      sessionStorage.setItem(resultToastFlag, "manual-finish");
    } else {
      sessionStorage.removeItem(resultToastFlag);
    }
  } catch (error) {
    // Ignore storage failures in restricted browser contexts.
  }
}

function enterLoading(shouldShowToast = false) {
  if (currentState === "loading") return;
  stopTimers();
  setRecordingProgress(maxSeconds);
  setResultToastFlag(shouldShowToast);
  showState("loading");
  loadingHandle = window.setTimeout(() => {
    showState("result");
  }, 2000);
}

function resetToReady() {
  stopTimers();
  showState("ready");
}

function showFailureToast() {
  const toast = document.getElementById("failureToast");
  if (!toast) return;

  const resultInput = document.querySelector('[data-state="result"] textarea');
  if (resultInput) {
    resultInput.value = "";
  }

  window.clearTimeout(toastHandle);
  toast.classList.add("is-visible");
  toast.setAttribute("aria-hidden", "false");

  toastHandle = window.setTimeout(() => {
    toast.classList.remove("is-visible");
    toast.setAttribute("aria-hidden", "true");
  }, 2000);
}

function showFailureToastFromFlag() {
  try {
    if (sessionStorage.getItem(resultToastFlag) === "manual-finish") {
      sessionStorage.removeItem(resultToastFlag);
      window.setTimeout(showFailureToast, 120);
    }
  } catch (error) {
    // Ignore storage failures in restricted browser contexts.
  }
}

document.addEventListener("click", (event) => {
  const action = event.target.closest("[data-action]")?.dataset.action;
  if (!action) return;

  if (action === "start" || action === "rerecord") {
    startRecording();
  }

  if (action === "finish") {
    enterLoading(true);
  }

  if (action === "confirm") {
    resetToReady();
  }
});

document.querySelectorAll(".back-button").forEach((button) => {
  button.addEventListener("click", resetToReady);
});

const initialHash = window.location.hash.replace("#", "");
if (["recording", "loading", "result"].includes(initialHash)) {
  if (initialHash === "recording") {
    startRecording();
  } else if (initialHash === "loading") {
    enterLoading();
  } else {
    showState("result");
  }
} else {
  showState("ready");
}

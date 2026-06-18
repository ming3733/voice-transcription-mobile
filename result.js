document.getElementById("rerecordButton").addEventListener("click", () => {
  window.location.href = "./recording.html";
});

const failureToast = document.getElementById("failureToast");
let toastTimer = null;
const RESULT_TOAST_FLAG = "voiceResultToast";
const RESULT_TEXT_MAX_LENGTH = 120;
const DEFAULT_RESULT_TEXT = "你好，欢迎学习编程，今天我们一起来写一个有趣的小程序吧！";

function getResultInput() {
  return document.querySelector(".result-box textarea");
}

function setResultText(value) {
  const resultInput = getResultInput();
  if (resultInput) {
    resultInput.value = value.slice(0, RESULT_TEXT_MAX_LENGTH);
  }
}

function showFailureToast() {
  if (!failureToast) return;

  setResultText("");

  window.clearTimeout(toastTimer);
  failureToast.classList.add("is-visible");
  failureToast.setAttribute("aria-hidden", "false");

  toastTimer = window.setTimeout(() => {
    failureToast.classList.remove("is-visible");
    failureToast.setAttribute("aria-hidden", "true");
  }, 2000);
}

getResultInput()?.addEventListener("input", (event) => {
  if (event.target.value.length > RESULT_TEXT_MAX_LENGTH) {
    event.target.value = event.target.value.slice(0, RESULT_TEXT_MAX_LENGTH);
  }
});

document.getElementById("confirmButton").addEventListener("click", () => {
  window.location.href = "./index.html";
});

try {
  if (sessionStorage.getItem(RESULT_TOAST_FLAG) === "manual-finish") {
    sessionStorage.removeItem(RESULT_TOAST_FLAG);
    window.setTimeout(showFailureToast, 120);
  } else {
    setResultText(DEFAULT_RESULT_TEXT);
  }
} catch (error) {
  // Ignore storage failures in restricted browser contexts.
  setResultText(DEFAULT_RESULT_TEXT);
}

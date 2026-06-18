document.getElementById("rerecordButton").addEventListener("click", () => {
  window.location.href = "./recording.html";
});

const failureToast = document.getElementById("failureToast");
let toastTimer = null;
const RESULT_TOAST_FLAG = "voiceResultToast";

function showFailureToast() {
  if (!failureToast) return;

  const resultInput = document.querySelector(".result-box textarea");
  if (resultInput) {
    resultInput.value = "";
  }

  window.clearTimeout(toastTimer);
  failureToast.classList.add("is-visible");
  failureToast.setAttribute("aria-hidden", "false");

  toastTimer = window.setTimeout(() => {
    failureToast.classList.remove("is-visible");
    failureToast.setAttribute("aria-hidden", "true");
  }, 2000);
}

document.getElementById("confirmButton").addEventListener("click", () => {
  window.location.href = "./index.html";
});

try {
  if (sessionStorage.getItem(RESULT_TOAST_FLAG) === "manual-finish") {
    sessionStorage.removeItem(RESULT_TOAST_FLAG);
    window.setTimeout(showFailureToast, 120);
  }
} catch (error) {
  // Ignore storage failures in restricted browser contexts.
}

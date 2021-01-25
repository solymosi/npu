const $ = window.jQuery;
const utils = require("../utils");

// Hide countdown and send requests to the server to keep the session alive
function initKeepSession() {
  const cdt = $("#hfCountDownTime");
  let timeout = 120;
  if (cdt.size() > 0) {
    const cdto = parseInt(cdt.val(), 10);
    if (cdto > 60) {
      timeout = cdto;
    }
  }
  const keepAlive = function () {
    window.setTimeout(() => {
      $.ajax({
        url: "main.aspx",
      });
      keepAlive();
    }, timeout * 1000 - 30000 - Math.floor(Math.random() * 30000));
  };
  keepAlive();

  window.setInterval(() => {
    utils.runEval(() => {
      window.ShowModal = function () {};
      clearTimeout(window.timerID);
      clearTimeout(window.timerID2);
      window.sessionEndDate = null;
    });
    if ($("#npuStatus").size() === 0) {
      $("#upTraining_lblRemainingTime").html(
        `<span id="npuStatus" style="font-weight: normal">` +
          `<a href="https://github.com/solymosi/npu" target="_blank">Neptun PowerUp!</a> ` +
          `v${GM.info.script.version}` +
          `</span>`
      );
    }
  }, 1000);
}

module.exports = {
  shouldActivate: () => utils.isLoggedIn(),
  initialize: () => {
    initKeepSession();
  },
};

const utils = require("../utils");

function addEvent() {
  window.addEventListener("click", event => {
    // If the click is outside an open modal
    if (event.target.classList.contains("ui-widget-overlay")) {
      const dialogs = document.querySelectorAll(".ui-dialog");
      const topmostDialog = dialogs[dialogs.length - 1];
      const closeButton = topmostDialog.querySelector(".ui-dialog-titlebar-close");
      if (closeButton) {
        closeButton.click();
      }
    }
  });
}
module.exports = {
  shouldActivate: () => utils.isLoggedIn(),
  initialize: addEvent,
};

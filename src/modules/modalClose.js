const utils = require("../utils");

function addEvent() {
  window.addEventListener('click', () => {
    // If the click is outside an open modal
    if(event.target.matches('.ui-widget-overlay')) {
      const closeButtons = document.querySelectorAll('.ui-dialog-titlebar-close');
      const lastCloseButton = closeButtons[closeButtons.length-1];
      if(lastCloseButton) {
        //Close the topmost modal
        lastCloseButton.click();
      }
    }
  })
}
module.exports = {
  shouldActivate: () => utils.isLoggedIn(),
  initialize: () => {
    addEvent();
  },
};

const $ = window.jQuery;
const utils = require("../utils");

// Hide page header to save vertical space
function hideHeader() {
  if ($("#panCloseHeader").hasClass("CloseHeader")) {
    $("#panCloseHeader").click();
  }
}

module.exports = {
  shouldActivate: () => utils.isLoggedIn(),
  initialize: () => {
    hideHeader();
  },
};

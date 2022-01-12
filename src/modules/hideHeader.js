const $ = window.jQuery;
const utils = require("../utils");

// Hide page header to save vertical space
function hideHeader() {
  $(".panHeader").css("display", "none");
}

module.exports = {
  shouldActivate: () => utils.isLoggedIn(),
  initialize: () => {
    hideHeader();
  },
};

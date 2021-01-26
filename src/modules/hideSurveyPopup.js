const $ = window.jQuery;
const utils = require("../utils");

/* Hide popup notifying the user about unfilled surveys on every login */
function hideSurveyPopup() {
  $(".ui-dialog:has(#startupPopup_lblOpinion) .ui-dialog-titlebar-close").click();
}

module.exports = {
  shouldActivate: () => utils.isLoggedIn(),
  initialize: () => {
    hideSurveyPopup();
  },
};

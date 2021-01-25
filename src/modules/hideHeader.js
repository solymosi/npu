const $ = window.jQuery;
const utils = require("../utils");

// Hide page header to save vertical space
function hideHeader() {
  $("#panHeader, #panCloseHeader").hide();
  $("table.top_menu_wrapper").css("margin-top", "5px").css("margin-bottom", "8px");
  $("#form1 > fieldset").css("border", "0 none");
  $("#span_changeproject").parent().hide();
}

module.exports = {
  shouldActivate: () => utils.isLoggedIn(),
  initialize: () => {
    hideHeader();
  },
};

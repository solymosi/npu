const $ = window.jQuery;
const utils = require("../utils");

// Add current page name to the window title
function fixTitle() {
  const originalTitle = document.title;
  window.setInterval(() => {
    const pageTitle = $("#upMenuCaption_menucaption").text().toString();
    if (document.title === originalTitle) {
      document.title = (pageTitle === "" ? "" : `${pageTitle} – `) + originalTitle;
    }
  }, 1000);
}

module.exports = {
  shouldActivate: () => utils.isLoggedIn(),
  initialize: () => {
    fixTitle();
  },
};

const $ = window.jQuery;
const utils = require("../utils");
const storage = require("../storage");

// Add a checkbox under the login button for enabling auto-redirect to the last visited page
function initLastPageCheckbox() {
  utils.injectCss(`
    .login_right_side {
      vertical-align: top;
    }
  `);
  $(".login_button_td").append(`
    <div id="backToLastPage" style="text-align: center; margin: 23px 0 0 128px">
      <input type="checkbox" id="backToLastPage_chbx" style="vertical-align: middle">
      <label for="backToLastPage_chbx">vissza a legutóbbi oldalra</label>
    </div>
  `);
  $("#backToLastPage_chbx").change(function () {
    saveLastPageSetting();
  });
}

// Save the saved state of the last page setting
function saveLastPageSetting() {
  storage.set("backToLastPage", utils.getDomain(), document.getElementById("backToLastPage_chbx").checked);
  storage.set("newLogin", utils.getDomain(), document.getElementById("backToLastPage_chbx").checked);
}

// Load the saved state of the last page setting
function loadLastPageSetting() {
  if (storage.get("backToLastPage", utils.getDomain())) {
    storage.set("newLogin", utils.getDomain(), true);
    $("#backToLastPage_chbx").get(0).checked = true;
  }
}

function lastPageInit() {
  if (utils.isLoginPage()) {
    initLastPageCheckbox();
    loadLastPageSetting();
  } else {
    if (window.location.href.endsWith("main.aspx") && storage.get("newLogin", utils.getDomain())) {
      storage.set("newLogin", utils.getDomain(), false);
      if (!storage.getForUser("lastPage").includes("ctrl=inbox")) {
        window.location.href = storage.getForUser("lastPage");
      }
    } else if (window.location.href.includes("main.aspx")) {
      storage.setForUser("lastPage", window.location.href);
    }
  }
}

module.exports = {
  shouldActivate: () => utils.isNeptunPage(),
  initialize: () => {
    lastPageInit();
  },
};

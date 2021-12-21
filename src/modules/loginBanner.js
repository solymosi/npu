const $ = window.jQuery;
const utils = require("../utils");

// Display Neptun PowerUp! version on login page
function showLoginBanner() {
  const color = $("#lblModuleType").css("color");

  utils.injectCss(`
    #div_login_right_side .login_info_version span {
      display: block;
      margin-bottom: 5px;
    }
    #div_login_right_side .login_info_version span > a {
      color: ${color};
      text-decoration: none;
    }
    #div_login_right_side .login_info_version span > a:hover,
    #div_login_right_side .login_info_version span > a:focus {
      text-decoration: underline;
    }
  `);

  $(
    `<span id="npuStatus" style="font-weight: normal">` +
      `<a href="https://github.com/solymosi/npu" target="_blank">Neptun PowerUp!</a> ` +
      `v${GM.info.script.version}` +
      `</span>`
  ).appendTo("#div_login_right_side .login_info_version");
}

module.exports = {
  shouldActivate: () => utils.isLoginPage(),
  initialize: () => {
    showLoginBanner();
  },
};

const utils = require("../utils");

// Reconfigure server full wait dialog parameters
function fixWaitDialog() {
  unsafeWindow.maxtrynumber = 1e6;
  // Export the patched starttimer function into the security context of the page in order to avoid an "access denied" error on Firefox.
  // Details: https://blog.mozilla.org/addons/2014/04/10/changes-to-unsafewindow-for-the-add-on-sdk
  const timerFunction = () => {
    unsafeWindow.login_wait_timer = unsafeWindow.setInterval(unsafeWindow.docheck, 5000);
  };
  exportFunction(timerFunction, unsafeWindow, { defineAs: "npu_starttimer" });
  unsafeWindow.starttimer = unsafeWindow.npu_starttimer;
}

module.exports = {
  shouldActivate: () => utils.isLoginPage(),
  initialize: () => {
    fixWaitDialog();
  },
};

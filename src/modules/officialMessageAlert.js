const $ = window.jQuery;
const utils = require("../utils");

// Allow user to dismiss the 'you have an official message' popup
function fixOfficialMessagePopup() {
  const dismiss = () => {
    const e = $("[aria-describedby=upRequiredMessageReader_upmodal_RequiredMessageReader_divpopup] .ui-dialog-content");
    e.dialog("close");
  };

  window.setInterval(() => {
    const popup = $("#upRequiredMessageReader_upmodal_RequiredMessageReader_divpopup:visible").closest(".ui-dialog");
    if (popup.size() > 0 && $("#upFunction_c_messages_upMain_upGrid").size() === 0) {
      utils.runEval(dismiss);
    }
    if (popup.size() > 0 && popup.is(":not([data-npu-enhanced])")) {
      popup.attr("data-npu-enhanced", "true");
      $("input[commandname=Tovabb]", popup).val("Elolvasom");
      const dismissBtn = $(
        '<input value="Most nem érdekel" class="npu_dismiss ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only" type="button">'
      );
      dismissBtn.click(function () {
        utils.runEval(dismiss);
      });
      $(".ui-dialog-footerbar > div", popup).append(dismissBtn);
    }
  }, 200);
}

module.exports = {
  shouldActivate: () => utils.isLoggedIn(),
  initialize: () => {
    fixOfficialMessagePopup();
  },
};

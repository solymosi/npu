const $ = window.jQuery;
const utils = require("../utils");

// Use custom loading indicator for async requests
function initProgressIndicator() {
  const color = $("#lbtnQuit").css("color");
  utils.injectCss(`
    #npu_loading { 
      position: fixed;
      width: 150px;
      margin-left: -75px;
      left: 50%;
      top: 0;
      background: ${color};
      color: white;
      font-size: 1.2em;
      font-weight: bold;
      padding: 8px 10px;
      text-align: center;
      z-index: 1000;
      display: none;
      -webkit-border-bottom-right-radius: 5px;
      -webkit-border-bottom-left-radius: 5px;
      -moz-border-radius-bottomright: 5px;
      -moz-border-radius-bottomleft: 5px;
      border-bottom-right-radius: 5px;
      border-bottom-left-radius: 5px;
      -webkit-box-shadow: 0px 0px 3px 0px black;
      -moz-box-shadow: 0px 0px 3px 0px black;
      box-shadow: 0px 0px 3px 0px black;
    }
  `);

  $("#progress, #customtextprogress").css("visibility", "hidden");
  $('<div id="npu_loading">Kis türelmet...</div>').appendTo("body");

  utils.runEval(() => {
    const manager = window.Sys.WebForms.PageRequestManager.getInstance();
    manager.add_beginRequest(() => {
      $("#npu_loading").show();
    });
    manager.add_endRequest(() => {
      $("#npu_loading").hide();
    });
  });
}

module.exports = {
  shouldActivate: () => utils.isLoggedIn(),
  initialize: () => {
    initProgressIndicator();
  },
};

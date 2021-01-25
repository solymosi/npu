const $ = window.jQuery;
const utils = require("../utils");

// Enhance timetable functionality
function fixTimetable() {
  window.setInterval(() => {
    if ($("#gridcontainer").attr("data-bound") !== "1") {
      utils.runEval(function () {
        const options = $("#gridcontainer").BcalGetOp();
        if (options) {
          $("#gridcontainer").attr("data-bound", "1");
          const callback = options.onAfterRequestData;
          options.onAfterRequestData = function (n) {
            if ($("#gridcontainer").attr("data-called") !== "1") {
              $("#gridcontainer").attr("data-called", "1");
              $("#upFunction_c_common_timetable_upTimeTable .showtoday").trigger("click");
            }
            callback(n);
          };
        }
      });
    }
  }, 100);
}

module.exports = {
  shouldActivate: () => utils.isLoggedIn() && utils.isPageId("0203", "c_common_timetable"),
  initialize: () => {
    fixTimetable();
  },
};

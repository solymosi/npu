const $ = window.jQuery;
const utils = require("../utils");

// Automatically press submit button on course list page
function initCourseAutoList() {
  utils.runEval(function () {
    const manager = window.Sys.WebForms.PageRequestManager.getInstance();
    let courseListLoading = false;
    manager.add_beginRequest(function () {
      courseListLoading = true;
    });
    manager.add_endRequest(function () {
      courseListLoading = false;
    });
    window.setInterval(() => {
      if (!courseListLoading && $("#h_addsubjects_gridSubjects_gridmaindiv").size() === 0) {
        $("#upFilter_expandedsearchbutton").click();
      }
    }, 250);
  });

  const updateTable = function () {
    $("#upFunction_h_addsubjects_upGrid").html("");
  };

  $("body").on("change", "#upFilter_chkFilterCourses", updateTable);
  $("body").on("change", "#upFilter_rbtnSubjectType input[type=radio]", updateTable);
}

module.exports = {
  shouldActivate: () => utils.isLoggedIn() && utils.isPageId("0303", "h_addsubjects"),
  initialize: () => {
    initCourseAutoList();
  },
};

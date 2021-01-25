const $ = window.jQuery;
const utils = require("../utils");

// Enhance course list style and functionality
function fixCourseList() {
  utils.injectCss(`
    #h_addsubjects_gridSubjects_bodytable tr.Row1_Bold td,
    #Addsubject_course1_gridCourses_bodytable tr.Row1_sel td,
    #Addsubject_course1_gridCourses_grid_body_div tr.Row1_sel td,
    #Addsubject_course1_gridCourses_bodytable tr.Row1_Bold_sel td,
    #Addsubject_course1_gridCourses_grid_body_div tr.Row1_Bold_sel td,
    #h_addsubjects_gridSubjects_bodytable tr.context_selectedrow td {
      background-color: #F8EFB1 !important;
      font-weight: bold; color: #525659;
    }
    #h_addsubjects_gridSubjects_bodytable tr,
    #Addsubject_course1_gridCourses_bodytable tr,
    #Addsubject_course1_gridCourses_grid_body_div tr {
      cursor: pointer;
    }
    #h_addsubjects_gridSubjects_bodytable tr.npu_completed td,
    #h_addsubjects_gridSubjects_bodytable tr.context_selectedrow[data-completed] td {
      background-color: #D5EFBA !important;
      font-weight: bold;
      color: #525659;
    }
    #h_addsubjects_gridSubjects_bodytable tr.context_selectedrow {
      border: 0 none !important;
      border-bottom: 1px solid #D3D3D3 !important;
    }
  `);

  $("body").on(
    "click",
    "#Addsubject_course1_gridCourses_bodytable tbody td, #Addsubject_course1_gridCourses_grid_body_div tbody td",
    function (e) {
      if ($(e.target).closest("input[type=checkbox]").size() === 0 && $(e.target).closest("td[onclick]").size() === 0) {
        const checkbox = $("input[type=checkbox]", $(this).closest("tr")).get(0);
        checkbox.checked = !checkbox.checked;
        if (utils.getAjaxInstance(this)) {
          utils.getAjaxInstance(this).Cv($("input[type=checkbox]", $(this).closest("tr")).get(0), "1");
        }
        e.preventDefault();
        return false;
      }
    }
  );

  $("body").on("click", "#h_addsubjects_gridSubjects_bodytable tbody td", function (e) {
    if (
      $(e.target).closest("td[onclick], span.link").size() === 0 &&
      $(e.target).closest("td.contextcell_sel, td.contextcell").size() === 0
    ) {
      utils.runEval($("td span.link", $(this).closest("tr")).attr("onclick"));
      e.preventDefault();
      return false;
    }
  });

  window.setInterval(() => {
    const table = $("#h_addsubjects_gridSubjects_bodytable");
    if (table.attr("data-painted") !== "1") {
      table.attr("data-painted", "1");
      $("tbody tr", table).each(function () {
        if ($('td[n="Completed"] img', this).size() !== 0) {
          $(this).addClass("npu_completed").attr("data-completed", "1");
        }
      });
    }
  }, 250);
}

module.exports = {
  shouldActivate: () => utils.isLoggedIn() && utils.isPageId("0303", "h_addsubjects"),
  initialize: () => {
    fixCourseList();
  },
};

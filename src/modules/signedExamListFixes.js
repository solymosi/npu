const $ = window.jQuery;
const utils = require("../utils");

// Enhance signed exam list style and functionality
function fixSignedExamList() {
  utils.injectCss(`
    #h_signedexams_gridExamList_bodytable tr.npu_missed td {
      background-color: #F8EFB1 !important;
      color: #525659 !important;
    }
    #h_signedexams_gridExamList_bodytable tr.npu_completed td {
      background-color: #D5EFBA !important;
    }
    #h_signedexams_gridExamList_bodytable tr.npu_failed td {
      background-color: #F2A49F !important;
      color: #3A3C3E !important;
    }
  `);

  window.setInterval(() => {
    const table = $("#h_signedexams_gridExamList_bodytable");

    if (table.attr("data-processed") !== "1") {
      table.attr("data-processed", "1");

      $("tbody tr:not(.NoMatch)", table).each(function () {
        const row = $(this);
        row.removeClass("npu_completed npu_failed npu_missed");
        const cells = row.children("td").length;
        let attended = $("td[n=Attended]", row)[0].attributes.checked.value === "true";

        let grade;
        if (cells <= 15) grade = $("td:nth-child(13)", row).text().trim();
        else {
          // Neptun build 454 introduced an extra column to show justified absence.
          // In this case, consider such exams "attended". Because of no grade,
          // they won't be coloured.
          attended = attended || $("td[n=JustifiedMissing]", row)[0].attributes.checked.value === "true";

          if (cells <= 16) {
            grade = $("td:nth-child(14)", row).text().trim();
          } else {
            // Neptun build 456 introduced ANOTHER extra column, now the signed exams
            // are listed with rows: "counts as exam", "attended", "justified absence".
            grade = $("td:nth-child(15)", row).text().trim();
          }
        }

        if (attended) {
          if (utils.isPassingGrade(grade)) {
            row.addClass("npu_completed");
          }
          if (utils.isFailingGrade(grade)) {
            row.addClass("npu_failed");
          }
        } else {
          row.addClass("npu_missed");
        }
      });
    }
  }, 250);
}

module.exports = {
  shouldActivate: () => utils.isLoggedIn() && utils.isPageId("0402", "h_signedexams"),
  initialize: () => {
    fixSignedExamList();
  },
};

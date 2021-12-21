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

      const resultCellIndex = $("#h_signedexams_gridExamList_headerrow th[id^=head_ExamResult").index();
      if (!resultCellIndex) {
        // Bail because we have no idea which cell has the exam result
        return;
      }

      $("tbody tr:not(.NoMatch)", table).each(function () {
        const row = $(this);
        row.removeClass("npu_completed npu_failed npu_missed");

        const attended =
          $("td[n=Attended]", row)[0].attributes.checked.value === "true" ||
          $("td[n=JustifiedMissing]", row)[0].attributes.checked.value === "true";

        const grade = $("td", row).eq(resultCellIndex).text().trim();

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

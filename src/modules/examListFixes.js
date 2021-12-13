const $ = window.jQuery;
const utils = require("../utils");
const storage = require("../storage");

let examListTerm;
let examListSubject;
let examListSubjectValue;
let examSubjectFilterCache;

// Enhance exam list style and functionality
function fixExamList() {
  utils.injectCss(`
    #h_exams_gridExamList_bodytable tr.gridrow_blue td {
      background-color: #F8EFB1 !important;
      font-weight: bold;
      color: #525659 !important;
    }
    #h_exams_gridExamList_bodytable tr.npu_completed td {
      background-color: #D5EFBA !important;
    }
    #h_exams_gridExamList_bodytable tr.npu_failed td {
      background-color: #F2A49F !important;
      color: #3A3C3E !important;
    }
    #h_exams_gridExamList_bodytable tr.npu_hidden {
      display: none;
    }
    #h_exams_gridExamList_bodytable tr {
      cursor: pointer;
    }
    #upFilter_cmbSubjects option[value="0"] {
      font-size: 13px;
      font-weight: bold;
      text-decoration: underline;
    }
    #upFilter_cmbSubjects option.npu_hidden {
      display: none;
    }
    #upFilter_cmbSubjects option.npu_subscribed {
      background-color: #F8EFB1 !important;
      font-weight: bold;
    }
    #upFilter_cmbSubjects option.npu_completed {
      background-color: #D5EFBA !important;
    }
    #upFilter_cmbSubjects option.npu_failed {
      background-color: #F2A49F !important;
      color: #3A3C3E !important;
    }
  `);

  $("body").on("click", "#h_exams_gridExamList_bodytable tbody td", function (e) {
    if ($(e.target).closest("td[onclick], td.contextcell_sel, td.contextcell").size() === 0) {
      utils.runEval(() => {
        $("td.contextcell, td.contextcell_sel", $(this).closest("tr")).trigger("click");
      });
      e.preventDefault();
      return false;
    }
  });

  // Exam classes listed from most important to least important
  const classPrecedence = ["npu_subscribed", "npu_failed", "npu_completed", "npu_regular"].reverse();

  // Selects the class with the higher precedence from the two provided classes
  const selectImportantClass = function (one, two) {
    // Invalid classes have an index of -1 so they are never selected in favor of a valid one
    return classPrecedence.indexOf(one) > classPrecedence.indexOf(two) ? one : two;
  };

  window.setInterval(() => {
    const table = $("#h_exams_gridExamList_bodytable");
    const filterEnabled = storage.getForUser("filterExams");
    const filterSubscribedEnabled = storage.getForUser("filterSubscribedExams");

    if (table.attr("data-processed") !== "1") {
      table.attr("data-processed", "1");

      $("tbody tr[id*=tr__]", table).each(function () {
        const row = $(this);
        const courseCode = $("td:nth-child(3)", row).clone().children().remove().end().text();
        const rowId = row.attr("id").replace(/^tr__/, "");
        const subRow = $(`#trs__${rowId}`, row.closest("tbody"));
        const markRows = $(".subtable > tbody > tr", subRow);

        row.add(markRows).removeClass(classPrecedence.join(" "));

        markRows.each(function () {
          const grade = $("td:nth-child(4)", this).text().trim();
          if (utils.isPassingGrade(grade)) {
            $(this).addClass("npu_completed");
          }
          if (utils.isFailingGrade(grade)) {
            $(this).addClass("npu_failed");
          }
        });

        let rowClass = row.hasClass("gridrow_blue") ? "npu_subscribed" : "npu_regular";

        if (markRows.size() > 0) {
          const lastMark = markRows.last();
          const grade = $("td:nth-child(4)", lastMark).text().trim();
          // The class 'npu_subscribed' has a higher precedence than these, so it will not get overwritten
          rowClass = selectImportantClass(rowClass, utils.isPassingGrade(grade) && "npu_completed");
          rowClass = selectImportantClass(rowClass, utils.isFailingGrade(grade) && "npu_failed");

          if (rowClass === "npu_completed") {
            row.add(subRow)[filterEnabled ? "addClass" : "removeClass"]("npu_hidden");
          }
        }

        if(rowClass !== "npu_subscribed" && filterSubscribedEnabled)
        {          
          row.addClass("npu_hidden");
        }

        row.addClass(rowClass);

        if (!$("#upFilter_cmbSubjects").val() || $("#upFilter_cmbSubjects").val() === "0") {
          examSubjectFilterCache = examSubjectFilterCache || {};
          // Only overwrite the class if it has a higher precedence than the previous one
          examSubjectFilterCache[courseCode] = selectImportantClass(examSubjectFilterCache[courseCode], rowClass);
        }
      });

      if (examSubjectFilterCache) {
        $("#upFilter_cmbSubjects > option").each(function () {
          $(this).removeClass(`npu_hidden ${classPrecedence.join(" ")}`);
          const subjectCode = utils.parseSubjectCode($(this).text().trim());
          const rowClass = examSubjectFilterCache[subjectCode];
          const enabled = storage.getForUser("filterExams");
          if (subjectCode) {
            $(this).addClass(rowClass || "npu_hidden");
          }
          if (enabled && rowClass === "npu_completed") {
            $(this).addClass("npu_hidden");
          }
        });
      }
    }
  }, 250);

  window.setInterval(() => {
    const filterEnabled = storage.getForUser("filterExams");
    const pager = $("#h_exams_gridExamList_gridmaindiv .grid_pagertable .grid_pagerpanel table tr");
    if ($("#npu_filter_exams").size() === 0) {
      const filterCell = $(
        `<td id="npu_filter_exams" style="padding-right: 30px; line-height: 17px">` +
          `<input type="checkbox" id="npu_filter_field" style="vertical-align: middle" />&nbsp;&nbsp;` +
          `<label for="npu_filter_field">Teljesített tárgyak elrejtése</label>` +
          `</td>`
      );
      $("input", filterCell).change(function () {
        storage.setForUser("filterExams", $(this).get(0).checked);
        utils.runEval(function () {
          $("#upFilter_expandedsearchbutton").click();
        });
      });
      pager.prepend(filterCell);
    }
    $("#npu_filter_field").get(0).checked = filterEnabled;

    const filterSubscribedEnabled = storage.getForUser("filterSubscribedExams");
    if ($("#npu_filter_subscribed_field").size() === 0) {
      const filterSubscribedCell = $(
        `<td id="npu_filter_subscribed_exams" style="padding-right: 30px; line-height: 17px">` +
          `<input type="checkbox" id="npu_filter_subscribed_field" style="vertical-align: middle" />&nbsp;&nbsp;` +
          `<label for="npu_filter_subscribed_field">Csak a jelentkezett vizsgák megejelnítése</label>` +
          `</td>`
      );
      $("input", filterSubscribedCell).change(function () {
        storage.setForUser("filterSubscribedExams", $(this).get(0).checked);
        utils.runEval(function () {
          $("#upFilter_expandedsearchbutton").click();
        });
      });
      pager.prepend(filterSubscribedCell);
    }
    $("#npu_filter_subscribed_field").get(0).checked = filterSubscribedEnabled;
  }, 500);
}

// Automatically list exams on page load and subject change
function initExamAutoList() {
  utils.injectCss(`
    #upFilter_bodytable tr.nostyle {
      display: none;
    }
  `);
  $("body").on("change", "#upFilter_cmbSubjects", function () {
    examListSubjectValue = $(this).val();
  });
  window.setInterval(() => {
    const panel = $("#upFilter_panFilter table.searchpanel");
    const termChanged = examListTerm !== $("#upFilter_cmbTerms option[selected]").attr("value");
    const subjectChanged = examListSubject !== examListSubjectValue;

    if (panel.attr("data-listing") !== "1" && (termChanged || subjectChanged)) {
      panel.attr("data-listing", "1");
      if (termChanged) {
        examSubjectFilterCache = null;
      }
      examListTerm = $("#upFilter_cmbTerms option[selected]").attr("value");
      examListSubject = examListSubjectValue;
      utils.runEval(function () {
        $("#upFilter_expandedsearchbutton").click();
      });
    }
  }, 100);
}

module.exports = {
  shouldActivate: () => utils.isLoggedIn() && utils.isPageId("0401", "h_exams"),
  initialize: () => {
    fixExamList();
    initExamAutoList();
  },
};

686
870
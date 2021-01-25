const $ = window.jQuery;
const utils = require("../utils");
const storage = require("../storage");

// Replace term drop-down list with buttons
function fixTermSelect() {
  utils.injectCss(`
    .termSelect {
      list-style: none;
      padding: 0;
    }
    .termSelect li {
      display: inline-block;
      vertical-align: middle;
      margin: 0 15px 0 0;
      line-height: 250%;
    }
    .termSelect li a {
      padding: 5px;
    }
    .termSelect li a.button {
      color: #FFF;
      box-shadow: none;
      text-decoration: none;
      cursor: default;
    }
  `);
  const findTermSelect = () => {
    return $(
      [
        "#upFilter_cmbTerms",
        "#upFilter_cmb_m_cmb",
        "#cmbTermsNormal",
        "#upFilter_cmbTerms_m_cmb",
        "#cmb_cmb",
        "#c_common_timetable_cmbTermsNormal",
        "#cmbTerms_cmb",
      ].join(", ")
    ).first();
  };
  const blanklist = [
    "0303",
    "h_addsubjects",
    "0401",
    "h_exams",
    "0503",
    "h_transactionlist",
    "1406",
    "h_grading_request",
  ];
  const clickExecuteButton = () => {
    if (blanklist.includes(utils.getPageId())) {
      return;
    }
    utils.runEval(() => {
      $("#upFilter_expandedsearchbutton").click();
    });
  };
  const selectTerm = term => {
    const termSelect = findTermSelect();
    const el = $(`.termSelect a[data-value=${term}]`);
    if (el.size() === 0 || el.hasClass("button")) {
      return false;
    }
    termSelect.val(el.attr("data-value"));
    $(".termSelect .button").removeClass("button");
    el.addClass("button");
    const onChange = termSelect[0].getAttributeNode("onchange");
    if (onChange) {
      utils.runAsync(() => {
        utils.runEval(onChange.value);
      });
    }
    return true;
  };

  window.setInterval(() => {
    const termSelect = findTermSelect();
    if (termSelect.is(":disabled")) {
      return;
    }
    if (termSelect.is(":visible")) {
      $(".termSelect").remove();
      const select = $('<ul class="termSelect"></ul>');
      let stored = storage.getForUser("termSelect", utils.getPageId());
      let found = false;
      const match = $("#lblTrainingName")
        .text()
        .match(/:(\d{4}\/\d{2}\/\d)\[.*?\]\)/);
      const admissionSemester = match && String(match[1]);

      $("option", termSelect).each(function () {
        if ($(this).attr("value") === "-1") {
          return;
        }
        if (admissionSemester && $(this).text() < admissionSemester) {
          return;
        }
        const value = $(this).attr("value");
        const klass = termSelect.val() === $(this).attr("value") ? "button" : "";
        const label = $(this).html();
        const item = $(`<li><a href="#" data-value="${value}" class="${klass}">${label}</a></li>`);
        if (stored && $(this).attr("value") === stored) {
          found = true;
        }
        $("a", item).bind("click", function (e) {
          e.preventDefault();
          const term = $(this).attr("data-value");
          if (selectTerm(term)) {
            if (stored !== term) {
              stored = term;
              storage.setForUser("termSelect", utils.getPageId(), term);
            }
            clickExecuteButton();
          }
        });
        select.append(item);
      });
      termSelect.parent().append(select);
      termSelect.hide();
      if (!termSelect.data("initialized")) {
        termSelect.data("initialized", true);
        if (found && termSelect.val() !== stored) {
          selectTerm(stored);
          clickExecuteButton();
        } else if ($(".grid_pagertable").size() === 0) {
          clickExecuteButton();
        }
      }
    }
  }, 500);
}

module.exports = {
  shouldActivate: () => utils.isLoggedIn(),
  initialize: () => {
    fixTermSelect();
  },
};

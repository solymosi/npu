const $ = window.jQuery;
const utils = require("../utils");
const storage = require("../storage");

let courses;

function loadCourses() {
  courses = {
    ...storage.getForUser("courses", "_legacy"),
    ...storage.getForUser("courses", utils.getTraining()),
  };
}

function refreshScreen() {
  $("#h_addsubjects_gridSubjects_bodytable").attr("data-choices-displayed", "0");
  $("#Addsubject_course1_gridCourses_bodytable").attr("data-inner-choices-displayed", "0");
  $("#Addsubject_course1_gridCourses_grid_body_div").attr("data-inner-choices-displayed", "0");
}

// Initialize course choice storage and mark subject and course lines with stored course choices
function initCourseStore() {
  utils.injectCss(`
    #h_addsubjects_gridSubjects_bodytable tr td.npu_choice_mark,
    #Addsubject_course1_gridCourses_bodytable tr td.npu_choice_mark,
    #Addsubject_course1_gridCourses_grid_body_div tr td.npu_choice_mark {
      background: #C00 !important;
    }
  `);

  loadCourses();

  window.setInterval(() => {
    const table = $("#h_addsubjects_gridSubjects_bodytable");
    if (table.size() > 0 && table.attr("data-choices-displayed") !== "1") {
      table.attr("data-choices-displayed", "1");
      const filterEnabled = storage.getForUser("filterCourses");
      $("tbody tr", table).each(function () {
        const subjectCode = $("td:nth-child(3)", this).text().trim().toUpperCase();
        const choices = courses[subjectCode.trim().toUpperCase()];
        if (typeof choices !== "undefined" && choices !== null && choices.length > 0) {
          $("td:first-child", this).addClass("npu_choice_mark");
          $(this).css("display", "table-row");
        } else {
          $("td:first-child", this).removeClass("npu_choice_mark");
          $(this).css("display", filterEnabled ? "none" : "table-row");
        }
      });

      if ($("#h_addsubjects_gridSubjects_gridmaindiv .grid_pagertable .grid_pagerpanel").size() === 0) {
        $('<td class="grid_pagerpanel"><table align="right"><tbody><tr></tr></tbody></table></td>').insertBefore(
          "#h_addsubjects_gridSubjects_gridmaindiv .grid_pagertable .grid_pagerrow_right"
        );
      }

      const pager = $("#h_addsubjects_gridSubjects_gridmaindiv .grid_pagertable .grid_pagerpanel table tr");
      if ($("#npu_clear_courses").size() === 0) {
        const clearAll = $(
          '<td id="npu_clear_courses"><a style="color: #C00; line-height: 17px; margin-right: 30px" href="">Tárolt kurzusok törlése</a></td>'
        );
        $("a", clearAll).click(function (e) {
          e.preventDefault();
          if (
            confirm(
              `${utils.getNeptunCode()} felhasználó összes tárolt kurzusa törölve lesz ezen a képzésen. Valóban ezt szeretnéd?`
            )
          ) {
            storage.setForUser("courses", utils.getTraining(), {});
            storage.setForUser("courses", "_legacy", {});
            storage.setForUser("filterCourses", false);
            loadCourses();
            refreshScreen();
          }
        });
        pager.prepend(clearAll);
      }
      if ($("#npu_filter_courses").size() === 0) {
        const filterCell = $(
          `<td id="npu_filter_courses" style="padding-right: 30px; line-height: 17px">` +
            `<input type="checkbox" id="npu_filter_field" style="vertical-align: middle" />&nbsp;&nbsp;` +
            `<label for="npu_filter_field">Csak a tárolt kurzusok megjelenítése</label>` +
            `</td>`
        );
        $("input", filterCell).change(function () {
          storage.setForUser("filterCourses", $(this).get(0).checked);
          refreshScreen();
        });
        pager.prepend(filterCell);
      }
      $("#npu_filter_field").get(0).checked = filterEnabled;
    }

    const innerTable = $(
      "#Addsubject_course1_gridCourses_bodytable:visible, #Addsubject_course1_gridCourses_grid_body_div:visible"
    ).first();
    if (innerTable.size() > 0 && innerTable.attr("data-inner-choices-displayed") !== "1") {
      innerTable.attr("data-inner-choices-displayed", "1");
      if ($("th.headerWithCheckbox", innerTable).size() === 0) {
        const objName = utils.getAjaxInstanceId(this);
        $(
          `<th id="head_chk" class="headerWithCheckbox headerDisabled" colname="chk" title="Válasszon ki legalább egyet!" align="center">` +
            `<label class="hiddenforlabel" for="Addsubject_course1_gridCourses_bodytable_chk_chkall">Összes kijelölése</label>` +
            `<span></span>` +
            `<input aria-disabled="false" role="checkbox" id="Addsubject_course1_gridCourses_bodytable_chk_chkall" ` +
            `onclick="${objName}.AllCheckBox(this.checked,'chk',true,1,this)" type="checkbox">` +
            `<span></span>` +
            `</th>`
        ).appendTo("#Addsubject_course1_gridCourses_headerrow");
        $("tbody tr", innerTable).each(function () {
          const id = $(this).attr("id").substring(4);
          const text = $("td:nth-child(2)", this).text().trim();
          $(
            `<td t="chks" n="chk" class="aligncenter">` +
              `<label class="hiddenforlabel" for="chk${id}">${text}</label>` +
              `<input id="chk${id}" aria-disabled="false" role="checkbox" onclick="${objName}.Cv(this,'1');" type="checkbox">` +
              `</td>`
          ).appendTo(this);
        });
      }
      $("tbody tr", innerTable).each(function () {
        $("input[type=checkbox]", this).removeAttr("disabled");
      });
      const subjectText = $("#Subject_data_for_schedule_ctl00:visible > div > div > h2").html();
      if (subjectText !== null) {
        const part = subjectText.split("<br>")[0];
        const subjectCode = utils.parseSubjectCode(part);
        if (subjectCode) {
          const choices = courses[subjectCode.trim().toUpperCase()];
          const hasChoices = choices && choices.length > 0;
          if (hasChoices) {
            $("tbody tr", innerTable).each(function () {
              const courseCode = $("td:nth-child(2)", this).text().trim().toUpperCase();
              if (choices.includes(courseCode)) {
                $("td:first-child", this).addClass("npu_choice_mark");
              } else {
                $("td:first-child", this).removeClass("npu_choice_mark");
              }
            });
          } else {
            $("tbody tr td:first-child", innerTable).removeClass("npu_choice_mark");
          }
          if ($(".npu_course_choice_actions").size() === 0) {
            let header = $("#Addsubject_course1_gridCourses_gridmaindiv .grid_functiontable_top .functionitem");
            let footer = $("#Addsubject_course1_gridCourses_tablebottom .grid_functiontable_bottom .functionitem");
            const canSave = header.size() > 0;
            if (header.size() === 0) {
              $(
                `<table class="grid_functiontable_top" align="left"><tbody><tr>` +
                  `<td class="functionitem" nowrap=""></td>` +
                  `</tr></tbody></table>`
              ).appendTo("#Addsubject_course1_gridCourses_gridmaindiv .grid_topfunctionpanel");
              header = $(header.selector);
            }
            if (footer.size() === 0) {
              $(
                `<table class="grid_functiontable_bottom" align="right"><tbody><tr>` +
                  `<td class="functionitem" nowrap=""></td>` +
                  `</tr></tbody></table>`
              ).appendTo("#Addsubject_course1_gridCourses_tablebottom .grid_bottomfunctionpanel");
              footer = $(footer.selector);
            }
            const loadAndSaveHtml = canSave
              ? '<input type="button" value="Betöltés és Mentés" class="gridbutton npu_course_choice_apply" style="display: none">'
              : "";
            const buttonBarExtensions = $(
              `<span class="npu_course_choice_actions" style="margin: 0 20px">` +
                `<span class="FunctionCommandTitle">Tárolt kurzusok:</span>` +
                `<input type="button" value="Tárolás" class="gridbutton npu_course_choice_save">` +
                `<input type="button" value="Betöltés" class="gridbutton npu_course_choice_load" style="display: none">` +
                `${loadAndSaveHtml}` +
                `<input type="button" value="Törlés" class="gridbutton npu_course_choice_delete" style="display: none"></span>`
            );
            header.append(buttonBarExtensions);
            footer.prepend(buttonBarExtensions.clone());
            $(".npu_course_choice_actions .npu_course_choice_save").click(function () {
              const selectedCourses = [];
              $("tbody tr", innerTable).each(function () {
                const courseCode = $("td:nth-child(2)", this).text().trim().toUpperCase();
                const checkbox = $("input[type=checkbox]", this).get(0);
                if (checkbox.checked) {
                  selectedCourses.push(courseCode);
                }
              });
              if (selectedCourses.length === 0) {
                alert("A tároláshoz előbb válaszd ki a tárolandó kurzusokat.");
              } else {
                storage.setForUser("courses", utils.getTraining(), subjectCode.trim().toUpperCase(), selectedCourses);
                loadCourses();
                refreshScreen();
              }
            });
            $(".npu_course_choice_actions .npu_course_choice_load").click(function () {
              $("tbody tr", innerTable).each(function () {
                const courseCode = $("td:nth-child(2)", this).text().trim().toUpperCase();
                const checkbox = $("input[type=checkbox]", this).get(0);
                checkbox.checked = courses[subjectCode.trim().toUpperCase()].includes(courseCode);
                if (utils.getAjaxInstance(this)) {
                  utils.getAjaxInstance(this).Cv(checkbox, "1");
                }
              });
            });
            $(".npu_course_choice_actions .npu_course_choice_apply").click(function () {
              utils.runEval(function () {
                $(".npu_course_choice_actions .npu_course_choice_load").trigger("click");
              });
              if (utils.getAjaxInstance(this)) {
                utils.getAjaxInstance(this).SelectFunction("update");
              }
            });
            $(".npu_course_choice_actions .npu_course_choice_delete").click(function () {
              if (confirm("Valóban törölni szeretnéd a tárolt kurzusokat?")) {
                storage.setForUser("courses", utils.getTraining(), subjectCode.trim().toUpperCase(), null);
                storage.setForUser("courses", "_legacy", subjectCode.trim().toUpperCase(), null);
                loadCourses();
                refreshScreen();
              }
            });
          }
          $(
            ".npu_course_choice_load, .npu_course_choice_apply, .npu_course_choice_delete",
            $(".npu_course_choice_actions")
          ).css("display", hasChoices ? "inline" : "none");
        }
      }
    }
  }, 500);
}

module.exports = {
  shouldActivate: () => utils.isLoggedIn() && utils.isPageId("0303", "h_addsubjects"),
  initialize: () => {
    initCourseStore();
  },
};

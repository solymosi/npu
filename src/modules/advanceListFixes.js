const utils = require("../utils");

// Enhance advance list style
function fixAdvanceList() {
  utils.injectCss(`
    #h_advance_gridSubjects_bodytable tr:not(.gridrow_blue):not(.gridrow_green) td,
    #h_advance_NonCurrTemp_bodytable tr:not(.gridrow_blue):not(.gridrow_green) td {
      background-color: #F8EFB1 !important;
      font-weight: bold;
      color: #525659;
    }
    #h_advance_gridSubjects_bodytable tr.gridrow_green td,
    #h_advance_NonCurrTemp_bodytable tr.gridrow_green td {
      background-color: #D5EFBA !important;
      font-weight: bold;
      color: #525659;
    }
    #h_advance_gridSubjects_bodytable tr.gridrow_blue td,
    #h_advance_NonCurrTemp_bodytable tr.gridrow_blue td {
      background-color: none !important;
      color: #525659;
    }
  `);
}

module.exports = {
  shouldActivate: () => utils.isLoggedIn() && utils.isPageId("0222", "h_advance"),
  initialize: () => {
    fixAdvanceList();
  },
};

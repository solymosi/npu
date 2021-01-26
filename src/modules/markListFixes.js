const utils = require("../utils");

// Enhance mark list style
function fixMarkList() {
  utils.injectCss(`
    #h_markbook_gridIndexEntry_bodytable tr.SubjectCompletedRow td {
      background-color: #D5EFBA !important;
    }
  `);
}

module.exports = {
  shouldActivate: () => utils.isLoggedIn() && utils.isPageId("0206", "h_markbook"),
  initialize: () => {
    fixMarkList();
  },
};

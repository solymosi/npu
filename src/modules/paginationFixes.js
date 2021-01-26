const $ = window.jQuery;
const utils = require("../utils");

// Set all paginators to 500 items per page
function fixPagination() {
  window.setInterval(() => {
    const pageSelect = $(".grid_pagerpanel select");
    pageSelect.each(function () {
      const e = $(this);
      e.hide();
      $(".link_pagesize", e.closest("tr")).html("");
      if (e.attr("data-listing") !== "1" && e.val() !== "500") {
        e.attr("data-listing", "1").val("500");
        const onChange = this.getAttributeNode("onchange");
        if (onChange) {
          utils.runEval(onChange.value);
        }
      }
    });
  }, 100);
}

module.exports = {
  shouldActivate: () => utils.isLoggedIn(),
  initialize: () => {
    fixPagination();
  },
};

const $ = window.jQuery;
const utils = require("../utils");

// Mark selected or all messages as read
function fixMessageMarker() {
  const markAsReadButton = '<input type="button" class="gridbutton" id="messagemarker" value="Megjelölés olvasottként">';
  const markAllAsReadButton = '<input type="button" class="gridbutton" id="messagemarkerall" value="Minden üzenet olvasottnak jelölése" style="float: right;">';
  window.setInterval(() => {
    if($('.functionitem').first().children().length < 3)
    {
        $('.functionitem').append(markAsReadButton);

        $('#messagemarker')
            .attr("onclick", "")
            .bind("click", function (e) {
            e.preventDefault();

            var rows = document.querySelectorAll('.Row1_Bold_sel');

            rows.forEach(row => {
                var id = row.id.substr(4);
                document.querySelector(`#tr__${id} .link`).click();

                //window.setInterval(() => closePopup(), 100);
            });
        });

        $('.functionitem').append(markAllAsReadButton);

        $('#messagemarkerall')
            .attr("onclick", "")
            .bind("click", function (e) {
            e.preventDefault();

            var rows = document.querySelectorAll('.Row1_Bold');

            rows.forEach(row => {
                var id = row.id.substr(4);
                document.querySelector(`#tr__${id} .link`).click();
            });
        });
    }
  }, 500);
}

module.exports = {
  shouldActivate: () => utils.isLoggedIn(),
  initialize: () => {
    fixMessageMarker();
  },
};

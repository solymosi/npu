const $ = window.jQuery;
const utils = require("../utils");

// Fix opening in new tab and add shortcuts
function fixMenu() {
  const color = $("#lbtnQuit").css("color");
  utils.injectCss(`
    ul.menubar, .top_menu_wrapper {
      cursor: default !important; 
    }
    #mb1 li.menu-parent {
      color: #525659 !important;
    }   
    #mb1 li.menu-parent.has-target {
      color: ${color} !important;
    }
    #mb1 li.menu-parent.has-target:hover {
      color: #000 !important;
    }
  `);

  $("#mb1_Tanulmanyok")
    .attr("targeturl", "main.aspx?ctrl=0206&ismenuclick=true")
    .attr("hoverid", "#mb1_Tanulmanyok_Leckekonyv");
  $("#mb1_Targyak")
    .attr("targeturl", "main.aspx?ctrl=0303&ismenuclick=true")
    .attr("hoverid", "#mb1_Targyak_Targyfelvetel");
  $("#mb1_Vizsgak")
    .attr("targeturl", "main.aspx?ctrl=0401&ismenuclick=true")
    .attr("hoverid", "#mb1_Vizsgak_Vizsgajelentkezes");
  $("#mb1_Vizsgak").text($("#mb1_Vizsgak_Vizsgajelentkezes").text());

  const orarend = $(`
    <li aria-haspopup="false" tabindex="0" role="menuitem"
      class="menu-parent has-target"
      id="mb1_Orarend"
      targeturl="main.aspx?ctrl=0203&amp;ismenuclick=true">
      Órarend
    </li>
  `);
  $("#mb1_Targyak").before(orarend);
  $("#mb1_Tanulmanyok_Órarend").remove();

  if (!$("#upChooser_chooser_kollab").hasClass("KollabChooserSelected")) {
    $(`
      <li aria-haspopup="false" tabindex="0" role="menuitem"
        class="menu-parent has-target"
        id="mb1_MeetStreet"
        targeturl="javascript:__doPostBack('upChooser$btnKollab','')">
        Meet Street
      </li>
    `).appendTo("#mb1");
  }
  if (!$("#upChooser_chooser_neptun").hasClass("NeptunChooserSelected")) {
    $(`
      <li aria-haspopup="false" tabindex="0" role="menuitem"
        class="menu-parent has-target"
        id="mb1_TanulmanyiRendszer"
        targeturl="javascript:__doPostBack('upChooser$btnNeptun','')">
        Neptun
      </li>
    `).appendTo("#mb1");
  }

  $("#mb1 li[targeturl]")
    .css("position", "relative")
    .each(function () {
      $(this).addClass("has-target");
      const target = $(this).attr("targeturl");
      const a = $(`
        <a href="${target}" style="display: block; position: absolute; left: 0; top: 0; width: 100%; height: 100%"></a>
      `);
      a.click(function (e) {
        $("ul.menu").css("visibility", "hidden");
        e.stopPropagation();
      });
      const hoverid = $(this).attr("hoverid");
      if (hoverid) {
        a.hover(
          () => {
            $(hoverid).addClass("menu-hover");
          },
          () => {
            $(hoverid).removeClass("menu-hover");
          }
        );
      }
      $(this).append(a);
    });
}

module.exports = {
  shouldActivate: () => utils.isLoggedIn(),
  initialize: () => {
    fixMenu();
  },
};

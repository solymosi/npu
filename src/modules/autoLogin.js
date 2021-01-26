const $ = window.jQuery;
const utils = require("../utils");
const storage = require("../storage");

// Returns users with stored credentials
function getLoginUsers() {
  const users = [];
  const list = storage.get("users", utils.getDomain());
  Object.keys(list).forEach(user => {
    if (typeof list[user].password === "string" && list[user].password !== "") {
      users.push(user);
    }
  });
  return users;
}

function initUserSelect() {
  const users = getLoginUsers();

  $(".login_left_side .login_input").css("text-align", "left");

  const selectField = $('<select id="user_sel" class="bevitelimezo" name="user_sel"></select>').hide();
  users.forEach(user => {
    $('<option class="neptun_kod"></option>').attr("id", user).attr("value", user).text(user).appendTo(selectField);
  });
  selectField.append('<option disabled="disabled" class="user_separator">&nbsp;</option>');
  selectField.append('<option id="other_user" value="__OTHER__">Más felhasználó...</option>');
  selectField.append('<option id="edit_list" value="__DELETE__">Tárolt kód törlése...</option>');

  $("td", selectField).css("position", "relative");
  selectField
    .css("font-weight", "bold")
    .css("font-family", "consolas, courier new, courier, monospace")
    .css("font-size", "1.5em");
  $("option[class!=neptun_kod]", selectField)
    .css("font-size", "0.8em")
    .css("font-family", "tahoma")
    .css("font-weight", "normal")
    .css("color", "#666")
    .css("font-style", "italic");
  $("option.user_separator", selectField).css("font-size", "0.5em");

  selectField.bind("mousedown focus change", function () {
    abortLogin();
  });
  $("#pwd, #Submit, #btnSubmit").bind("mousedown focus change", function () {
    abortLogin();
  });

  selectField.bind("change", function () {
    clearLogin();

    if ($(this).val() === "__OTHER__") {
      hideSelect();
      return false;
    }

    if ($(this).val() === "__DELETE__") {
      $("#user_sel").val(users[0]).trigger("change");
      const itemToDelete = unsafeWindow.prompt(
        "Írd be a törlendő neptun kódot. Az összes törléséhez írd be: MINDEGYIKET",
        ["mindegyiket", ...users].join("   /   ")
      );
      if (!itemToDelete) {
        return false;
      }

      let deleted = false;
      users.forEach(user => {
        if (user === itemToDelete.toUpperCase() || itemToDelete.toUpperCase() === "MINDEGYIKET") {
          storage.set("users", utils.getDomain(), user, "password", null);
          deleted = true;
        }
      });

      if (!deleted) {
        if (confirm("A megadott neptun kód nincs benne a tárolt listában. Megpróbálod újra?")) {
          $("#user_sel").val("__DELETE__").trigger("change");
        }
        return false;
      }

      if (itemToDelete.toUpperCase() === "MINDEGYIKET") {
        alert("Az összes tárolt neptun kód törölve lett a bejelentkezési listából.");
        window.location.reload();
        return false;
      }

      alert(`A(z) ${itemToDelete} felhasználó törölve lett a bejelentkezési listából.`);
      window.location.reload();
      return false;
    }

    $("#user").val(users[$(this).get(0).selectedIndex]);
    $("#pwd").val(atob(storage.get("users", utils.getDomain(), users[$(this).get(0).selectedIndex], "password")));
  });

  $("input[type=button].login_button")
    .attr("onclick", "")
    .bind("click", function (e) {
      e.preventDefault();

      if ($("#user_sel").val() === "__OTHER__") {
        if ($("#user").val().trim() === "" || $("#pwd").val().trim() === "") {
          return;
        }

        const foundUser = users.find(user => user === $("#user").val().toUpperCase());
        if (!foundUser) {
          if (
            confirm(
              "Szeretnéd menteni a beírt adatokat, hogy később egy kattintással be tudj lépni erről a számítógépről?"
            )
          ) {
            storage.set("users", utils.getDomain(), $("#user").val().toUpperCase(), "password", btoa($("#pwd").val()));
          }
          submitLogin();
          return;
        } else {
          $("#user_sel").val(foundUser);
        }
      }

      if ($("#user_sel").val() === "__DELETE__") {
        return;
      }

      if (
        $("#pwd").val() !==
        atob(storage.get("users", utils.getDomain(), users[$("#user_sel").get(0).selectedIndex], "password"))
      ) {
        if (
          confirm(
            `Szeretnéd megváltoztatni a(z) ${$("#user")
              .val()
              .toUpperCase()} felhasználó tárolt jelszavát a most beírt jelszóra?`
          )
        ) {
          storage.set(
            "users",
            utils.getDomain(),
            users[$("#user_sel").get(0).selectedIndex],
            "password",
            btoa($("#pwd").val())
          );
        }
      }

      submitLogin();
      return;
    });

  $("#user").parent().append(selectField);
  showSelect();
  selectField.trigger("change");
}

let loginTimer;
let loginButtonText;

function initAutoLogin() {
  const users = getLoginUsers();

  if (users.length < 1) {
    return;
  }

  const submit = $("#Submit, #btnSubmit");

  let loginCount = 3;
  loginButtonText = submit.attr("value");
  submit.attr("value", `${loginButtonText} (${loginCount})`);

  $(".login_button_td").append(
    '<div id="abortLogin" style="text-align: center; margin: 23px 0 0 128px"><a href="#" class="abort_login">Megszakít</a></div>'
  );
  $(".login_button_td a.abort_login").click(function (e) {
    e.preventDefault();
    abortLogin();
  });

  loginTimer = window.setInterval(() => {
    loginCount--;
    submit.attr("value", `${loginButtonText} (${loginCount})`);

    if (loginCount <= 0) {
      submitLogin();
      abortLogin();
      submit.attr("value", `${loginButtonText}...`);
    }
  }, 1000);
}

// Abort the auto login countdown
function abortLogin() {
  window.clearInterval(loginTimer);
  $("#Submit, #btnSubmit").attr("value", loginButtonText);
  $("#abortLogin").remove();
}

// Clears the login form
function clearLogin() {
  $("#user").val("");
  $("#pwd").val("");
}

// Display user select field
function showSelect() {
  $("#user").hide();
  $("#user_sel").show().focus();
  utils.runEval(' Page_Validators[0].controltovalidate = "user_sel" ');
}

// Hide user select field and display original textbox
function hideSelect() {
  $("#user_sel").hide();
  $("#user").show().focus();
  utils.runEval(' Page_Validators[0].controltovalidate = "user" ');
}

// Submit the login form
function submitLogin() {
  unsafeWindow.docheck();
}

module.exports = {
  shouldActivate: () => utils.isLoginPage(),
  initialize: () => {
    initUserSelect();
    initAutoLogin();
  },
};

const utils = require("./utils");
const storage = require("./storage");

const modules = [
  // Login page
  require("./modules/autoLogin"),
  require("./modules/loginRetry"),
  require("./modules/loginBanner"),

  // All authenticated pages
  require("./modules/hideHeader"),
  require("./modules/pageTitle"),
  require("./modules/mainMenuFixes"),
  require("./modules/termSelectorFixes"),
  require("./modules/paginationFixes"),
  require("./modules/officialMessageAlert"),
  require("./modules/hideSurveyPopup"),
  require("./modules/infiniteSession"),
  require("./modules/loadingIndicator"),

  // Timetable page
  require("./modules/timetableFixes"),

  // Markbook page
  require("./modules/markListFixes"),

  // Advance page
  require("./modules/advanceListFixes"),

  // Course signup page
  require("./modules/courseListFixes"),
  require("./modules/courseAutoList"),
  require("./modules/courseStore"),

  // Exams page
  require("./modules/examListFixes"),

  // Signed exams page
  require("./modules/signedExamListFixes"),
];

(async () => {
  await storage.initialize();

  if(window.location.href.endsWith("main.aspx") && storage.get("newLogin", utils.getDomain())) {
    storage.set("newLogin", utils.getDomain(), false)
    if(!storage.getForUser("lastPage").includes("ctrl=inbox")) {
      window.location.href = storage.getForUser("lastPage");
    }
  }
  else if(window.location.href.includes("main.aspx"))
  {
    storage.setForUser("lastPage", window.location.href);
  }

  modules.forEach(module => {
    if (module.shouldActivate() && (utils.isNeptunPage() || module.runOutsideNeptun)) {
      module.initialize();
    }
  });
})();

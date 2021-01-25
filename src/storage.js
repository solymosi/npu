const utils = require("./utils");

// Stored data
let data = {};

// Load all data from local storage
async function initialize() {
  try {
    data = JSON.parse(await GM.getValue("data")) || {};
  } catch (e) {}
  await upgradeSchema();
}

// Save all data to local storage
function save() {
  return GM.setValue("data", JSON.stringify(data));
}

// Gets the value at the specified key path
function get(...keys) {
  return utils.deepGetProp(data, keys);
}

// Sets the value at the specified key path
function set(...keysAndValue) {
  const value = keysAndValue.pop();
  const keys = keysAndValue;
  utils.deepSetProp(data, keys, value);
  save();
}

// Gets the specified property or all data of the current user
function getForUser(...keys) {
  return get("users", utils.getDomain(), utils.getNeptunCode(), "data", ...keys);
}

// Sets the specified property of the current user
function setForUser(...keysAndValue) {
  return set("users", utils.getDomain(), utils.getNeptunCode(), "data", ...keysAndValue);
}

// Upgrade the data schema to the latest version
async function upgradeSchema() {
  const ver = typeof data.version !== "undefined" ? data.version : 0;

  // < 1.3
  if (ver < 1) {
    let users;
    try {
      users = JSON.parse(await GM.getValue("neptun.users"));
    } catch (e) {}
    if (Array.isArray(users)) {
      users.forEach(user => {
        set("users", utils.getDomain(), user[0].toUpperCase(), "password", btoa(user[1]));
      });
    }
    let courses;
    try {
      courses = JSON.parse(await GM.getValue("neptun.courses"));
    } catch (e) {}
    if (typeof courses === "object") {
      Object.keys(courses).forEach(user => {
        Object.keys(courses[user]).forEach(subject => {
          set("users", utils.getDomain(), user, "courses", "_legacy", subject, courses[user][subject]);
        });
      });
    }
    data.version = 1;
  }

  save();
}

module.exports = {
  initialize,
  get,
  set,
  getForUser,
  setForUser,
};

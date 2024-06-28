/**
 * Stores seconds spent on a site.
 */
var SITE_TO_TIME_MAP = {}
var focused = true; // -1 if the window is not on focus.
var currentDate = new Date().toDateString();

// NOTE:
// I think localStorage breaks the extension here
// so I :

// // Initialize date from localStorage
// if (localStorage.getItem('currentDate')) {
//   currentDate = localStorage.getItem('currentDate');
// } else {
//   localStorage.setItem('currentDate', currentDate);
// }

/**
 * Run every 1 seconds and increment time spent on a website.
 */
setInterval(function () {
  var filters = { active: true, currentWindow: true };

  // Check if the day has changed
  var newDate = new Date().toDateString();
  if (newDate !== currentDate) {
    SITE_TO_TIME_MAP = {}; // Reset time map
    currentDate = newDate;
    localStorage.setItem('currentDate', currentDate);
  }

  // Get active tabs.
  chrome.tabs.query(filters, function (tabs) {

    // If no tabs are active don't do anything.
    if (!tabs || !tabs.length || !focused) return;

    // Get the site name from the tab url and initialize and increment the time.
    var site = getSiteName(tabs[0].url);
    if (!(site in SITE_TO_TIME_MAP)) {
      SITE_TO_TIME_MAP[site] = 0;
    }
    SITE_TO_TIME_MAP[site] += 1;

    var data = { site: site, time: SITE_TO_TIME_MAP[site] };
    chrome.tabs.sendMessage(tabs[0].id, data, null);

    var opt = {
      type: "basic",
      title: "Time Spent",
      message: "You spent a total of: " + data.time + " seconds on " + data.site,
      iconUrl: "icon.png"
    }

    chrome.notifications.create('spent-on-' + site, opt, function () {
      console.log('notification created');
    });
  });
}, 1000);


/**
 * @param {string} url The URL to parse a site out of.
 * @return {string} Site name.
 */
function getSiteName(url) {
  var a = document.createElement('a');
  a.href = url;
  return a.hostname;
}


// Detect when chrome is out of focus. i.e. You are not in chrome.
chrome.windows.onFocusChanged.addListener(function (windowId) {
  // windowId will be -1 when the window is un-focused.
  focused = windowId != -1;
});

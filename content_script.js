/**
 * Build the DOM for the notificiation on the page and initialize
 * listeners.
 */
var init = function () {
  var container = document.createElement('div');
  container.innerHTML =
    '<div class="" id="time-counter-notification">' +
    'time spent: ' +
    '<span id="time-counter-time"></span>' +
    'on <span id="time-counter-site"></span>.' +
    '</div>';
  document.body.appendChild(container);

  chrome.extension.onMessage.addListener(messageRecieved);

  makeDraggable(document.getElementById('time-counter-notification'));
};

function makeDraggable(element) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

  element.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // Get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // Call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // Calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // Set the element's new position:
    element.style.top = (element.offsetTop - pos2) + "px";
    element.style.left = (element.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // Stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

/**
 * Handles recieving a message from the extension.
 * @param {object} data An object with some data sent from the extension.
 *   Example: {site: 'facebook', time: 300}
 * @param {MessageSender} sender The sender of the message,
 * @param {function} sendResponse Callback for sending a response.
 */
var messageRecieved = function (data, sender, sendResponse) {
  var notificationEl = document.getElementById('time-counter-notification'),
    timeEl = document.getElementById('time-counter-time'),
    siteEl = document.getElementById('time-counter-site');

  if (data && data.site) {
    // Update the notification count.
    timeEl.innerText = secondsToHHMMSS(data.time);
    siteEl.innerText = data.site;

    // Show the notification and hide it after 3 seconds.
    notificationEl.className = '';
    setTimeout(function () { notificationEl.className = '' }, 1000);
  }
};

init();

// helpers:

/**
 * Converts a number of seconds to a string in the format hh:mm:ss.
 * @param {number} totalSeconds The total number of seconds to convert.
 * @return {string} The formatted time string.
 */
function secondsToHHMMSS(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const formattedHours = hours.toString().padStart(2, '0');
  const formattedMinutes = minutes.toString().padStart(2, '0');
  const formattedSeconds = seconds.toString().padStart(2, '0');

  // if (totalSeconds > 120) return `${formattedHours}h ${formattedMinutes}m`;

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}
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
  var elX1, elX2, elY1, elY2;
  var mouseX1, mouseX2, mouseY1, mouseY2;

  element.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();

    mouseX1 = e.clientX;
    mouseY1 = e.clientY;

    var computedStyle = getComputedStyle(element);
    elX1 = computedStyle.right.split('px')[0];
    elY1 = computedStyle.bottom.split('px')[0];

    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();

    mouseX2 = e.clientX;
    mouseY2 = e.clientY;

    mouseXDiff = mouseX1 - mouseX2;
    mouseYDiff = mouseY1 - mouseY2;

    elX2 = parseInt(elX1) + mouseXDiff;
    elY2 = parseInt(elY1) + mouseYDiff;

    element.style.right = elX2 + 'px';
    element.style.bottom = elY2 + 'px';
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
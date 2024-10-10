// Leaflet map setup
var map = L.map('map').setView([39.8283, -98.5795], 4);

var southWest = L.latLng(24.396308, -125.0);
var northEast = L.latLng(49.384358, -66.93457);
var bounds = L.latLngBounds(southWest, northEast);

map.setMaxBounds(bounds);
map.on('drag', function () {
    map.panInsideBounds(bounds, { animate: false });
});

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Define circles for outages
var NYcircle1 = L.circle([40.7128, -74.0060], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 100000
}).addTo(map);

var NYcircle2 = L.circle([42.6526, -73.7562], {
    color: 'orange',
    fillColor: '#ffa500',
    fillOpacity: 0.5,
    radius: 100000
}).addTo(map);

var NYcircle3 = L.circle([42.8864, -78.8784], {
    color: 'yellow',
    fillColor: '#ffff00',
    fillOpacity: 0.5,
    radius: 100000
}).addTo(map);

// Bind popups to circles
NYcircle1.bindPopup("<b>Critical Outage</b>");
NYcircle2.bindPopup("<b>Medium Outage</b>");
NYcircle3.bindPopup("<b>Low Outage</b>");

// Outage alerts data
var outageAlerts = [
    { location: "New York City", severity: "Critical Outage", details: "5000 customers impacted" },
    { location: "Albany", severity: "Medium Outage", details: "1500 customers impacted" },
    { location: "Buffalo", severity: "Low Outage", details: "500 customers impacted" }
];

// Selecting the alert display window
var alertWindow = document.querySelector('.alert');

// Add outage alerts to the alert window
NYcircle1.on('click', function () {
    addAlertToChat(outageAlerts[0]);
});

NYcircle2.on('click', function () {
    addAlertToChat(outageAlerts[1]);
});

NYcircle3.on('click', function () {
    addAlertToChat(outageAlerts[2]);
});

// Function to add alerts to chat window
function addAlertToChat(alert) {
    // Keep existing content and append new alerts
    var alertMessage = `<strong>${alert.severity}:</strong> ${alert.location} - ${alert.details}<br>`;
    alertWindow.innerHTML += alertMessage;
}

// Function to add command responses to the same chat window
function addCommandToChat(commandResponse) {
    // Append command response to the alert window
    var commandMessage = `<p class="command-response">${commandResponse}</p>`;
    alertWindow.innerHTML += commandMessage;
}

// Handling command submission
document.getElementById("submit-command").addEventListener("click", function () {
    var commandInput = document.getElementById("command-input").value.toLowerCase();

    if (commandInput === "troubleshoot") {
        addCommandToChat("Troubleshooting issue...");
    } else if (commandInput === "escalate") {
        addCommandToChat("Escalating issue to team lead...");
    } else if (commandInput === "dispatch") {
        addCommandToChat("Dispatching repair team...");
    } else if (commandInput === "help") {
        addCommandToChat("Use 'troubleshoot', 'escalate', or 'dispatch'.");
    } else if (commandInput === "clear") {
        alertWindow.innerHTML = '';
    } else {
        addCommandToChat("Invalid command. Use 'help' for a list of valid commands.");
    }

    // Clear the input field after submission
    document.getElementById("command-input").value = "";
});

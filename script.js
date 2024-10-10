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
// var NYcircle1 = L.circle([40.7128, -74.0060], {
//     color: 'red',
//     fillColor: '#f03',
//     fillOpacity: 0.5,
//     radius: 100000
// }).addTo(map);

// var NYcircle2 = L.circle([42.6526, -73.7562], {
//     color: 'orange',
//     fillColor: '#ffa500',
//     fillOpacity: 0.5,
//     radius: 100000
// }).addTo(map);

// var NYcircle3 = L.circle([42.8864, -78.8784], {
//     color: 'yellow',
//     fillColor: '#ffff00',
//     fillOpacity: 0.5,
//     radius: 100000
// }).addTo(map);

// Bind popups to circles
// NYcircle1.bindPopup("<b>Critical Outage</b>");
// NYcircle2.bindPopup("<b>Medium Outage</b>");
// NYcircle3.bindPopup("<b>Low Outage</b>");

// // Outage alerts data
// var outageAlerts = [
//     { location: "New York City", severity: "Critical Outage", details: "5000 customers impacted" },
//     { location: "Albany", severity: "Medium Outage", details: "1500 customers impacted" },
//     { location: "Buffalo", severity: "Low Outage", details: "500 customers impacted" }
// ];

// Function to create outage bubbles with specialized scenarios
function createOutage(lat, lng, color, label) {
    var circle = L.circle([lat, lng], {
        color: color,
        fillColor: color,
        fillOpacity: 0.5,
        radius: 100000
    }).addTo(map);

    circle.bindPopup(`<b>Outage Type:</b> ${label}`);
};


// Define the types of outages with colors and labels
var outageTypes = [
    { color: 'red', label: 'Critical Outage', details: '5000-20000 customers impacted.' },
    { color: 'orange', label: 'Medium Outage', details: '1500-5000 customers impacted.' },
    { color: 'yellow', label: 'Low Outage', details: '500-15000 customers impacted.' }
];

// Random interval timelapse function to simulate the appearance of outages
function randomizeOutages() {
    var locations = [
        [40.7128, -74.0060],  // New York City
        [34.0522, -118.2437], // Los Angeles
        [41.8781, -87.6298],  // Chicago
        [29.7604, -95.3698],  // Houston
        [33.4484, -112.0740]  // Phoenix
    ];

    locations.forEach(function (loc, index) {
        // Random delay between 1 and 10 second
        var delay = Math.random() * 20000 + 5000;

        setTimeout(function () {
            var outageType = outageTypes[Math.floor(Math.random() * outageTypes.length)];
            createOutage(loc[0], loc[1], outageType.color, outageType.label);
        }, delay);
    });

};

// Trigger the timelapse of outages
randomizeOutages();



// Selecting the alert display window
var alertWindow = document.querySelector('.alert');

// Function to add alerts to chat window
// function addAlertToChat(outage) {
//     // Keep existing content and append new alerts
//     var alertMessage = `<strong>${outageTypes.label}:</strong> ${outageTypes.details}<br>`;
//     alertWindow.innerHTML += alertMessage;
// }

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

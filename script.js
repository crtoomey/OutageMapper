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


// Selecting the alert display window
var alertWindow = document.querySelector('.alert');

// Function to add alerts to chat window
function addAlertToChat(alert, location) {
    // Keep existing content and append new alerts
    var alertMessage = `<strong>${alert.label}:</strong> ${location} - ${alert.details}<br>`;
    alertWindow.innerHTML += alertMessage;
}

// 

function dealWithOutage(label) {
    // Need to add functionality and remove the hints
    var alertMessage = '';
    if (label === 'Critical Outage') {
        alertMessage = 'Need to escalate this issue';
        alertWindow.innerHTML += alertMessage;
    } else if (label === 'Medium Outage') {
        alertMessage = 'Need to dispatch repair team for this issue';
        alertWindow.innerHTML += alertMessage;
    } else if (label === 'Low Outage') {
        alertMessage = 'Need to troubleshoot this issue';
        alertWindow.innerHTML += alertMessage;
    } else {
        console.log('Something went wrong');
    }
}

function findLocation(lat) {
    var location = 'N/A';
    if (lat === 40.7128) {
        location = 'New York City';
        return location
    } else if (lat === 34.0522) {
        location = 'Los Angeles';
        return location;
    } else if (lat === 41.8781) {
        location = 'Chicago';
        return location;
    } else if (lat === 29.7604) {
        location = 'Houston';
        return location;
    } else if (lat === 33.4484) {
        location = 'Phoenix';
        return location;
    } else {
        return 'Invalid';
    };

};

// Function to create outage bubbles with specialized scenarios
function createOutage(lat, lng, color, label, details) {
    var circle = L.circle([lat, lng], {
        color: color,
        fillColor: color,
        fillOpacity: 0.5,
        radius: 100000
    }).addTo(map);

    var detail = '';
    detail = details.toLowerCase();

    circle.bindPopup(`<b>Outage Type:</b> ${label}`);
    circle.on('click', function () {
        var alertMessage = `<p>Looking into ${label} with ${detail} in ${findLocation(lat)}. Please use command line to address the issue.</p>`;
        alertWindow.innerHTML += alertMessage;
        dealWithOutage(label);
    });
}

// Define the types of outages with colors and labels
var outageTypes = [
    { color: 'red', label: 'Critical Outage', details: 'Potential DDoS attack' },
    { color: 'orange', label: 'Medium Outage', details: 'Storms reported in the area' },
    { color: 'yellow', label: 'Low Outage', details: 'Customers reporting slow internet connection' }
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
        // Random delay between 1 and 5 seconds
        var delay = Math.random() * 4000 + 1000;
        

        setTimeout(function () {
            var location = findLocation(loc[0]);
            var outageType = outageTypes[Math.floor(Math.random() * outageTypes.length)];
            createOutage(loc[0], loc[1], outageType.color, outageType.label, outageType.details);
            addAlertToChat(outageType, location);
        }, delay);
    });
}

// Trigger the timelapse of outages
randomizeOutages();


// 

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
        addCommandToChat("Use 'troubleshoot', 'escalate', or 'dispatch'. Use 'clear' to clear the alert window.");
    } else if (commandInput === "clear") {
        alertWindow.innerHTML = '';
    } else {
        addCommandToChat("Invalid command. Use 'help' for a list of valid commands.");
    }
    // Clear the input field after submission
    document.getElementById("command-input").value = "";
});
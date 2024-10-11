// Leaflet map setup
var map = L.map('map').setView([39.8283, -98.5795], 4);
var southWest = L.latLng(24.396308, -125.0);
var northEast = L.latLng(49.384358, -66.93457);
var bounds = L.latLngBounds(southWest, northEast);
var selectedOutage = null;
var alertWindow = document.querySelector('.alert');

// Leaflet map stuff
map.setMaxBounds(bounds);
map.on('drag', function () {
    map.panInsideBounds(bounds, { animate: false });
});
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Function to add alerts to alert window
function addAlertToChat(alert, location) {
    var alertMessage = `<strong>${alert.label}:</strong> ${location} - ${alert.details}<br>`;
    alertWindow.innerHTML += alertMessage;
}

// Function to handle the diagnostics command 
function runDiagnostics(label) {
    if (label === "Low Outage") {
        addCommandToChat("Speed test shows download speeds at 5 Mbps, customer expects 100 Mbps.")
    } else if (label === "Medium Outage") {
        addCommandToChat("No connection from optical node to customers. Storms have been reported in the area.")
    } else if (label === "Critical Outage") {
        addCommandToChat("Network traffic spikes detected in the core network.")
    } else {
        addCommandToChat("Diagnostics failed.")
    }
}

// Function to find location name based on lat value
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
    var outage = { label: label, details: details, lat: lat, lng: lng };

    circle.bindPopup(`<b>Outage Type:</b> ${label}`);

    circle.on('click', function () {
        selectedOutage = { circle: circle, label: label };
        console.log("Outage selected ", selectedOutage);

        var alertMessage = `<p>Looking into ${label} with ${detail} in ${findLocation(lat)}. Please use command line to address the issue.</p>`;
        alertWindow.innerHTML += alertMessage;
    });
}

// Define the types of outages with colors and labels 
var outageTypes = [
    { color: 'red', label: 'Critical Outage', details: 'Network traffic anomaly detected' },
    { color: 'orange', label: 'Medium Outage', details: 'Customers reporting complete TV and internet outages' },
    { color: 'yellow', label: 'Low Outage', details: 'Customers reporting slow internet speeds' }
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

// Function to add command responses to the same chat window
function addCommandToChat(commandResponse) {
    var commandMessage = `<p class="command-response">${commandResponse}</p>`;
    alertWindow.innerHTML += commandMessage;
}

// Handling command submission
document.getElementById("submit-command").addEventListener("click", function () {
    var commandInput = document.getElementById("command-input").value.toLowerCase();

    if (!selectedOutage || !selectedOutage.circle) {
        addCommandToChat("No outage selected. Please click on an outage bubble to begin.");
        return;
    }

    var label = selectedOutage;

    if (commandInput === "troubleshoot" && selectedOutage.label === "Low Outage") {
        addCommandToChat("Troubleshooting issue...");
        addCommandToChat("Outage successfully handled.");
        map.removeLayer(selectedOutage.circle);
        selectedOutage = null;
    } else if (commandInput === "escalate" && selectedOutage.label === "Critical Outage") {
        addCommandToChat("Escalating issue to team lead...");
        addCommandToChat("Outage successfully handled.");
        map.removeLayer(selectedOutage.circle);
        selectedOutage = null;
    } else if (commandInput === "dispatch" && selectedOutage.label === "Medium Outage") {
        addCommandToChat("Dispatching repair team...");
        addCommandToChat("Outage successfully handled.");
        map.removeLayer(selectedOutage.circle);
        selectedOutage = null;
    } else if (commandInput === "help") {
        addCommandToChat("Use 'diagnostics', 'troubleshoot', 'escalate', or 'dispatch'. Use 'clear' to clear the alert window.");
    } else if (commandInput === "clear") {
        alertWindow.innerHTML = '';
    } else if (commandInput === "diagnostics") {
        addCommandToChat("Diagnosing issue...");
        runDiagnostics(selectedOutage.label);
    } else {
        addCommandToChat("Invalid or incorrect command. Use 'help' for a list of valid commands.");
    }
    // Clear the input field
    document.getElementById("command-input").value = "";
});
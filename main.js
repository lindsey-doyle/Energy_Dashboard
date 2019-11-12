const JSONFileName = 'assets/springfield.json';

// Utility function to fetch any file from the server
function fetchJSONFile(path, callback) {
    var request = new XMLHttpRequest();
    request.open("GET", path, false);
    request.send(null)
    var my_JSON_object = JSON.parse(request.responseText);
    alert (my_JSON_object.result[0]);
}

// The entrypoint of the script execution
function doMain() {
    fetchJSONFile("assets/springfield.json");
}

document.onload = doMain();
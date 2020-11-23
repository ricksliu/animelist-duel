// Called when username_submit class buttons are pressed
function submitUsername(user_number) {
    var username;

    // Chooses which username to get
    if (+user_number == 1) {
        username = document.getElementById("username_1_input").value;
    } else {
        username = document.getElementById("username_2_input").value;
    }
    
    // Sends http request to backend server
    const http_req = new XMLHttpRequest();
    http_req.open("GET", `http://localhost:3000/?username=${username.replace(" ", "+")}`);
    http_req.send();

    // Executes when a response is recieved (in a JSON-encoded string)
    http_req.onload = () => {
        console.log(1);
        var user = JSON.parse(http_req.response);
        
        if (+user_number == 1) {
            document.getElementById("days_1").textContent = user.days_watched;
        } else {
            document.getElementById("days_2").textContent = user.days_watched;
        }
    }
}

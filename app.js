document.addEventListener("DOMContentLoaded", function () {
    const rbxbtn = document.querySelector(".getrbx");
    const usernameInput = document.querySelector(".username");
    const useroutput = document.querySelector(".useroutput");
    const box1 = document.querySelector(".box");
    const box2 = document.querySelector(".box2");
    const box3 = document.querySelector(".box3");
    const thumbnailContainer = document.getElementById("thumbnailContainer");
    let thumbnailUrl = ""; // Store thumbnail URL

    console.log("DOM fully loaded and parsed");

    // Function to handle Next button click
    const handleNextButtonClick = async (event) => {
        event.preventDefault();
        const username = usernameInput.value.trim();

        if (!username || username.length < 3) {
            alert("Please enter a valid Roblox username.");
            return;
        }

        useroutput.innerHTML = `Searching for <b>${username}</b>...`;
        try {
            // Show loading box
            box1.style.display = "none";
            box2.style.display = "block";

            // Fetch thumbnail
            thumbnailUrl = await fetchThumbnail(username);

            // Display thumbnail and update UI
            if (thumbnailUrl) {
                useroutput.innerHTML = `Found user: <b>${username}</b>`;
                displayThumbnail(thumbnailUrl);
                box2.style.display = "none";
                box3.style.display = "block";
            }
        } catch (error) {
            console.error("Error:", error);
            useroutput.innerHTML = "Error: User not found or an issue occurred.";
            box2.style.display = "none";
            box1.style.display = "block"; // Reset to input state
        }
    };

    rbxbtn.addEventListener("click", handleNextButtonClick);

    // Function to fetch thumbnail URL from backend
    const fetchThumbnail = async (username) => {
        console.log("Fetching thumbnail for username:", username);
        try {
            const response = await fetch('https://your-vercel-app.vercel.app/api/get_thumbnail', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "An error occurred.");
            }

            const data = await response.json();
            console.log("API Response:", data);

            return data.thumbnailUrl || null;
        } catch (error) {
            console.error("Fetch error:", error.message);
            throw error;
        }
    };

    // Function to display the thumbnail
    const displayThumbnail = (url) => {
        if (url) {
            console.log("Displaying thumbnail:", url);
            const imgElement = document.createElement("img");
            imgElement.src = url;
            imgElement.alt = "Roblox Thumbnail";
            imgElement.style.maxWidth = "150px";
            imgElement.style.borderRadius = "8px";

            // Clear previous thumbnails and append new one
            thumbnailContainer.innerHTML = "";
            thumbnailContainer.appendChild(imgElement);
        } else {
            console.error("No URL to display thumbnail.");
        }
    };
});

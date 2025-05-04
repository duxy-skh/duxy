from flask import Flask, render_template, request, jsonify
import requests

app = Flask(__name__)

# Serve the main page (index.html)
@app.route('/')
def index():
    return render_template('index.html')

# API endpoint to fetch Roblox avatars
@app.route('/api/avatar', methods=['POST'])
def get_avatar():
    try:
        # Extract the username from the request
        username = request.json.get('username', '').strip()

        if not username:
            return jsonify({"error": "Username is required"}), 400

        # Call Roblox API to get user info
        api_url = "https://users.roblox.com/v1/usernames/users"
        payload = {"usernames": [username]}
        response = requests.post(api_url, json=payload)

        # Log API response for debugging
        print(f"Usernames API Response for {username}: {response.text}")

        if response.status_code != 200:
            return jsonify({"error": "Failed to fetch user data"}), 500

        data = response.json()

        if "data" in data and data["data"]:
            user_id = data["data"][0]["id"]

            # Fetch avatar URL from Roblox Thumbnails API
            avatar_api_url = f"https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds={user_id}&size=420x420&format=Png&isCircular=false"
            avatar_response = requests.get(avatar_api_url)

            # Log avatar API response for debugging
            print(f"Thumbnails API Response for {username}: {avatar_response.text}")

            if avatar_response.status_code != 200:
                return jsonify({"error": "Failed to fetch avatar"}), 500

            avatar_data = avatar_response.json()
            if "data" in avatar_data and avatar_data["data"]:
                avatar_url = avatar_data["data"][0]["imageUrl"]
                return jsonify({"username": username, "avatar_url": avatar_url})
            else:
                return jsonify({"error": "Avatar not found"}), 404
        else:
            return jsonify({"error": "User not found"}), 404

    except Exception as e:
        print(f"Unexpected error: {e}")
        return jsonify({"error": "An unexpected error occurred"}), 500


if __name__ == '__main__':
    app.run(debug=True)

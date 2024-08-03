from flask import Flask

app = Flask(__name__)

@app.route("/music")
def music():
    return {"music": ["music1", "music2", "music3"]}


if __name__ == "__main__":
    app.run(debug=True)
    
    
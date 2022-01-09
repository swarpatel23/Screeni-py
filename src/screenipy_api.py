from flask import Flask
from screenipy import main
from flask import Response, request
from flask_cors import CORS, cross_origin
import copy


import time

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


@app.route('/api/screen')
def screen_stocks():
    requestDict = {}
    requestDict["ticker"] = request.args.get('ticker')
    requestDict["screening"] = request.args.get('screening')
    requestDict["lowestVolumeDays"] = request.args.get('lowestVolumeDays', 0)
    requestDict["minRSI"] = request.args.get('minRSI', 0)
    requestDict["maxRSI"] = request.args.get('maxRSI', 100)
    requestDict["reversal"] = request.args.get('reversal', 0)
    requestDict["MALength"] = request.args.get('MALength', 0)
    requestDict["chartPattern"] = request.args.get('chartPattern', 0)
    requestDict["lookBackBars"] = request.args.get('lookBackBars', 0)
    return Response(main(requestDict), mimetype="text/event-stream")


if __name__ == '__main__':
    app.run(port=8081)

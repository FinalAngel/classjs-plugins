# -*- coding: utf-8 -*-
import flask
import jinja2

app = flask.Flask(__name__)
my_loader = jinja2.ChoiceLoader([
    jinja2.FileSystemLoader('_site'),
])
app.jinja_loader = my_loader

@app.route('/')
def index():
    return flask.redirect('/classjs-plugins')

@app.route('/classjs-plugins')
def home():
    return flask.render_template('index.html')

@app.route('/examples/<path>')
def examples(path):
    return flask.render_template('examples/%s/index.html' % path)

@app.route('/classjs-plugins/<path:filename>')
def static(filename):
    return flask.send_from_directory('_site', filename)

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument('--public', action='store_true')
    parser.add_argument('--no-debug', dest='debug', action='store_false')
    parser.add_argument('--port', default=8000, type=int)
    args = parser.parse_args()
    host = '0.0.0.0' if args.public else '127.0.0.1'
    app.run(debug=args.debug, host=host, port=args.port)
import os
import json

from flask import Flask, Response
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
def hello_world():
    return 'Why do I exist'

@app.route('/get-chapters/')
def get_chapters():
    return Response(json.dumps(sorted(os.listdir("../../SoundtrackingBooks-Streamlit/data/HP/chunks/"))), mimetype='application/json')

@app.route('/get-chapter-content/<int:chap_num>')
def get_chapter_content(chap_num):
    chapters = sorted(os.listdir("../../SoundtrackingBooks-Streamlit/data/HP/chunks/"))
    chapter = chapters[chap_num]

    with open(os.path.join('../../SoundtrackingBooks-Streamlit/data/HP/chunks/', chapter), 'r') as f:
        content = json.load(f)

    content['name'] = chapter.split('.')[0].split('-')[-1].replace('_', ' ')
    
    return content

@app.route('/get-song-list/<int:chap_num>')
def get_song_list(chap_num):
    songs = sorted(os.listdir(f"../../SoundtrackingBooks-Streamlit/generated_chunked_low_arousal/{chap_num}"))
    # songs = list(map(lambda x: os.path.join(f"../../SoundtrackingBooks-Streamlit/generated_chunked/{chap_num}", x), songs))
    songs = list(map(lambda x: os.path.join(f"http://localhost:5000/generated_chunked_low_arousal/{chap_num}", x), songs))
    # songs = list(map(lambda x: os.path.join(f"../generated_chunked/{chap_num}", x), songs))

    return Response(json.dumps(songs), mimetype='application/json')

if __name__ == '__main__':
    app.run('localhost', 8000, debug=True, use_reloader=True)

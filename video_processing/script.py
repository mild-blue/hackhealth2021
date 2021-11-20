import cv2
import numpy as np
import scipy.signal
from flask import Flask, jsonify, make_response
from matplotlib import pyplot as plt

app = Flask(__name__)


@app.get("/<path:file_url>")
def get_heart_rate(file_url):
    cap = cv2.VideoCapture(file_url)
    # cap = cv2.VideoCapture('video-20211120-102943-0560fd61.mov')
    fps = cap.get(cv2.CAP_PROP_FPS)  # frames per second
    frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    video_duration = frame_count / fps

    if video_duration < 60:
        return make_response(jsonify({
            'error': 'Invalid input',
            'message': 'Video is too short.'
        }), 400
        )

    proper_video_length_in_frames = int(60 * fps)
    assert cap.isOpened()

    full_video = []
    while True:
        ret, im = cap.read()
        if not ret:
            break
        im = cv2.cvtColor(im, cv2.COLOR_BGR2HSV)
        h, s, v = cv2.split(im)
        full_video.append(int(np.sum(v)))
    values = full_video[:proper_video_length_in_frames]

    maxi = np.max(values)
    mini = np.min(values)

    dist = maxi - mini

    # TODO: tady bude mozna treba to rozseparovat do mensich casti a min/max urcit zvlast
    peaks, properties = scipy.signal.find_peaks(values, prominence=dist / 6)
    x_axis_in_sec = [i / fps for i in range(len(values))]
    peaks_in_sec = [i / fps for i in peaks]
    peaks_distances = []
    for previous, current in zip(peaks_in_sec, peaks_in_sec[1:]):
        peaks_distances.append(current - previous)

    # values
    pulse_wave = [x_axis_in_sec, values]
    plt.plot(x_axis_in_sec, values)

    # peaks
    peaks_arr = [peaks_in_sec, [int(values[i]) for i in peaks]]
    plt.plot(peaks_in_sec, [int(values[i]) for i in peaks], 'ro')
    plt.axhline(max(values))
    plt.axhline(min(values))

    plt.xlabel('time(s)')
    plt.show()

    # BPM
    bpm = len(peaks)
    if bpm <= 50:
        return make_response(jsonify({
            'error': 'Invalid input',
            'message': 'Poor video quality.'
        }), 400
        )
    print(bpm)

    # RR intervals
    plt.figure(2)
    plt.plot(peaks_distances, 'bo')
    ax = plt.gca()
    ax.set_ylim([0, 1])
    plt.show()

    return make_response(jsonify({
        "pulse_wave": pulse_wave,
        "peaks": peaks_arr,
        "peaks_distances": peaks_distances,
        "bpm": bpm
    }), 200)


if __name__ == "__main__":
    app.run(debug=True)

import os
import requests
import uuid
import urllib.parse
import cv2
import numpy as np
import scipy.signal
from flask import Flask, jsonify, make_response
from matplotlib import pyplot as plt

app = Flask(__name__)


def is_near(value, threshold, delta):
    return abs(value - threshold) < delta


def rr_tachogram_plot(peaks_distances):
    plt.figure(2)
    plt.plot(peaks_distances, 'bo')
    ax = plt.gca()
    ax.set_ylim([0, 2])
    plt.show()


def poincare_plot(peaks_distances):
    plt.figure(3)
    plt.scatter(peaks_distances[:-1], peaks_distances[1:])
    ax = plt.gca()
    ax.set_ylim([0, 2])
    ax.set_xlim([0, 2])
    plt.show()


@app.get("/<path:file_url>")
def get_heart_rate(file_url):
    print(file_url)

    if "https://" not in file_url:
        file_url = file_url.replace("https:/", "https://")

    file_url = urllib.parse.unquote(file_url)
    print(file_url)
    to_verify = "localhost" not in file_url
    file_url = file_url.replace("localhost", "host.docker.internal")
    print(file_url)

    u = requests.get(file_url, verify=to_verify)
    path = "/usr/share/" + str(uuid.uuid4())
    print(path)

    with open(path, "wb+") as f:
        f.write(u.content)

    cap = cv2.VideoCapture(path)

    assert cap.isOpened()

    fps = cap.get(cv2.CAP_PROP_FPS)  # frames per second
    frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    video_duration = frame_count / fps

    print(f'video_duration: {video_duration}')

    # This should never happen, we limit the length during recording, after 30 (or 60 sec) the video will turn off
    if (not is_near(video_duration, 30, 0.5)) and (not is_near(video_duration, 60, 0.5)):
        return make_response(jsonify({
            'error': 'Invalid input',
            'message': 'Video is too short.'
        }), 400
        )

    print(f'frames per sec: {fps}')

    if is_near(video_duration, 60, 0.5):
        proper_video_length_in_frames = int(60 * fps)
    else:
        proper_video_length_in_frames = int(30 * fps)

    print(f'proper_video_length_in_frames {proper_video_length_in_frames}')

    assert cap.isOpened()

    full_video = []
    while True:
        ret, im = cap.read()
        if not ret:
            break
        im = cv2.cvtColor(im, cv2.COLOR_BGR2HSV)
        h, s, v = cv2.split(im)
        full_video.append(int(np.sum(v)))

    print(f'full video len: {len(full_video)}')

    max_y = np.max(full_video)
    min_y = np.min(full_video)

    dist = max_y - min_y

    # TODO: tady bude mozna treba to rozseparovat do mensich casti a min/max urcit zvlast
    peaks, properties = scipy.signal.find_peaks(full_video, prominence=dist / 6)
    x_axis_in_sec = [i / fps for i in range(len(full_video))]
    peaks_in_sec = [i / fps for i in peaks]
    peaks_distances = []
    for previous, current in zip(peaks_in_sec, peaks_in_sec[1:]):
        peaks_distances.append(current - previous)

    ppg = [x_axis_in_sec, full_video]
    plt.plot(x_axis_in_sec, full_video)

    # peaks
    peaks_arr = [peaks_in_sec, [int(full_video[i]) for i in peaks]]
    plt.plot(peaks_in_sec, [int(full_video[i]) for i in peaks], 'ro')
    plt.axhline(max(full_video))
    plt.axhline(min(full_video))

    plt.xlabel('time(s)')
    plt.show()

    # BPM
    bpm = len(peaks)
    print(f'peaks counted: {bpm}')
    bpm *= round(60 / video_duration)
    print(f'bpm: {bpm}')

    # RR intervals
    rr_tachogram_plot(peaks_distances)
    poincare_plot(peaks_distances)

    os.remove(path)

    if bpm <= 40:
        return make_response(jsonify({
            'error': 'Invalid input',
            'message': 'Poor video quality, please repeat the measurement.'
        }), 400
        )
    elif bpm < 60:
        return make_response(jsonify({
            'conclusion': 'Bradycardia',
            'message': f'Warning! Your heart rate is {bpm}. ' +
                       'A normal resting heart rate for adults ranges from 60 to 100 beats per minute (bpm). ' +
                       f'A heart rate of {bpm} is thus considered as bradycardia. ' +
                       'If you\'re not an athlete and your bpm is lower than 60 bpm, it might be ' +
                       'a sign of bradycardia, which could be an indicator of other health conditions. ' +
                       'Please, double check your heart rate (repeat the measurement, use different ways of ' +
                       'measuring heart rate). If you do not feel well, contact a doctor.',
            'pulse_wave': ppg,
            'peaks': peaks_arr,
            'peaks_distances': peaks_distances,
            'bpm': bpm
        }), 200
        )
    elif bpm > 100:
        return make_response(jsonify({
            'conclusion': 'Tachycardia',
            'message': f'Warning! Your heart rate is {bpm}. ' +
                       'A normal resting heart rate for adults ranges from 60 to 100 beats per minute (bpm). ' +
                       f'A heart rate of {bpm} is thus considered as tachycardia. ' +
                       'If your heart rate remains high even after you have calmed down (repeat the measurement in a few minutes). ' +
                       'If you have irregular or height heart rate for a long time or you do not feel well, contact a doctor.',
            'pulse_wave': ppg,
            'peaks': peaks_arr,
            'peaks_distances': peaks_distances,
            'bpm': bpm
        }), 200
        )

    return make_response(jsonify({
        'conclusion': 'Normal rhythm',
        'message': 'Your heart rate is in normal resting range.',
        'pulse_wave': ppg,
        'peaks': peaks_arr,
        'peaks_distances': peaks_distances,
        'bpm': bpm
    }), 200)


if __name__ == "__main__":
    # get_heart_rate("https://hotpink.azurewebsites.net/patient/download/4495f796-ec3b-4e5f-8efb-e225574c30f5.mov")
    app.run(host='0.0.0.0', port=80)

import cv2
import numpy as np
import scipy.signal
from matplotlib import pyplot as plt

cap = cv2.VideoCapture('video-20211119-215254-2f482421.mov')
fps = cap.get(cv2.CAP_PROP_FPS)  # frames per second
frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
video_duration = frame_count/fps

assert cap.isOpened()
assert video_duration >= 60

values = []
while True:
    ret, im = cap.read()
    if not ret:
        break
    im = cv2.cvtColor(im, cv2.COLOR_BGR2HSV)
    h, s, v = cv2.split(im)
    values.append(np.sum(v))

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
plt.plot(x_axis_in_sec, values)

# peaks
plt.plot(peaks_in_sec, [values[i] for i in peaks], 'ro')
plt.axhline(max(values))
plt.axhline(min(values))

plt.xlabel('time(s)')
plt.show()

# BPM
bpm = len(peaks)
print(bpm)

# RR intervals
plt.figure(2)
plt.plot(peaks_distances, 'bo')
ax = plt.gca()
ax.set_ylim([0, 1])
plt.show()

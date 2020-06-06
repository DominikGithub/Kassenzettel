#! /venv/bin/ python

"""
OCR image analysis.

Input: Read input image name from cmd arguments.
Output: Stores anotated image and intermediate stage into ./uploads dir.

Run with: $ python ocr_script.py <FILE NAME>
"""

import pytesseract
import cv2 as cv
import numpy as np
import sys
from PIL import Image, ImageDraw

filename = sys.argv[1]

# filenames
anotated_filename = filename.split('.')[0] + '_anotated.png'
binarized_filename = filename.split('.')[0] + '_bin.png'

# load input image
img = Image.open(f"./{filename}")



# CV optimizations
# binarization
img_bin = np.array(img)
img_bin = cv.cvtColor(img_bin, cv.COLOR_BGR2GRAY)
img_bin = cv.adaptiveThreshold(img_bin, 255, cv.ADAPTIVE_THRESH_GAUSSIAN_C, cv.THRESH_BINARY, 11, 3)

# CV closing 
kernel = np.ones((3, 3),np.uint8)
img_bin = cv.dilate(img_bin, kernel, iterations = 1)
img_bin = cv.erode(img_bin, kernel, iterations = 1)
img = Image.fromarray(img_bin)

# image orientation
orientation = pytesseract.image_to_osd(img, lang="deu")
rot = 270
img = img.rotate(rot, expand=True)

# save binary image
img.save('./'+binarized_filename)



## OCR 
# config
ocr_config = ' --psm 11 -bordercolor White -border 10x10 -load_system_dawg false -load_freq_dawg false ' # -tessedit_char_whitelist true

# get text
df = pytesseract.image_to_data(img, lang="deu", config=ocr_config, output_type='data.frame')

# clean up - remove detections below 20% confidence
df = df[df.conf >= 20]



## image annotation
# colors
TINT_COLOR = (255, 13, 13)
TRANSPARENCY = .25
OPACITY = int(255 * TRANSPARENCY)

# create anotation image overlay
overlay = Image.new('RGBA', img.size, TINT_COLOR+(0,))
img_anotated = ImageDraw.Draw(overlay)

# create anotation
for row_idx, row in df.iterrows():
  shape = ((row.left+row.height, row.top+row.height),(row.left+row.width, row.top))
  img_anotated.rectangle(shape, fill=TINT_COLOR+(OPACITY,)) 

# combine overlay and image
img = img.convert('RGBA')
img = Image.alpha_composite(img, overlay) 
img = img.convert('RGB')

# save anotated image
img.save('./'+anotated_filename)



# forward results
#print(df.to_html())    #TODO return OCR results as table data

# return anoted file name
print(anotated_filename)
sys.stdout.flush()
exit(0)
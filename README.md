# Kassenzettel

Web app for Zettel OCR.

## Setup  
1. Set env variables in `.env`, `package.json`, (`Dockerfile`, `docker-compose.yaml`) file.  
2. Install dependencies: `$ npm install` (for front- and backend dirs)  
3. Python backend: 
```
 Create virtualenv: $ virtualenv venv -p 3.7 (activate: $ source /venv/bin/activate)  
 Install requirements: $ pip install requirements.txt
```
4. Tesseract intall lang (Ubuntu): 
 ```
 $ cd usr/share/tesseract-ocr/4.00/tessdata
 $ wget https://github.com/tesseract-ocr/tessdata/raw/master/deu.traineddata (german)
```

## OCR  
For optimizations see [Image processing docs](https://github.com/tesseract-ocr/tessdoc/blob/master/ImproveQuality.md)

## Start  
* Frontend: `npm run serve` starts backend on port 81 (or `docker-compose up`)   
* Backend: `node index.js` starts backend on port 4000  

### Build with  
* VueJS 
* NodeJS 8.10
* Node-express 4.17
* Python 3.7.2
* [Tesseract-OCR 4.0](https://github.com/madmaze/pytesseract)
* Pandas 1.0.4

## TODO
* OCR parameter optimization
* Monitor upload folder
* Containerization
* TLS
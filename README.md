# Kassenzettel

Web app for Zettel OCR.

## Run app  
* Set .env variables  
* Frontend: `npm run serve` or `docker-compose up`  
* Backend: `node index.js`  

---  
## Development  
### Setup  
1. Set env variables in `.env`  
2. Install dependencies: `$ npm install` 
3. Python backend: 
```
 Create virtualenv: $ virtualenv venv -p 3.7  
 Install requirements: $ pip install requirements.txt  
```
4. Tesseract intall (Ubuntu) [docs](https://tesseract-ocr.github.io/tessdoc/Home.html): 
 ```
 $ sudo apt install tesseract-ocr  
 $ sudo apt install libtesseract-dev  

 $ mkdir -p usr/share/tesseract-ocr/4.00/tessdata  
 $ cd usr/share/tesseract-ocr/4.00/tessdata  
 $ wget https://github.com/tesseract-ocr/tessdata/raw/master/deu.traineddata (german)  
```

#### Build with  
* VueJS 2.6  
* NodeJS 8.10  
* Node-express 4.17  
* Nginx  
* Python 3.7.2  
* Virtualenv  20.0.10  
* Pyenv 1.2.20  
* [Tesseract-OCR 4.0](https://github.com/madmaze/pytesseract)  
* Pandas 1.0.4  

### OCR  
For optimizations see [Image processing docs](https://github.com/tesseract-ocr/tessdoc/blob/master/ImproveQuality.md)

---  

## TODO
* OCR parameter optimization
* Monitor upload folder
* Containerization
* TLS
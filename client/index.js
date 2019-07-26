// let poseNet
let video;
let classifier;
let classificationOutput;

let size = 200;

let outputWindow = {
    x: 0,
    y: 0,
    sizeX: size,
    sizeY: size
};

let captureWindow = {
    x: outputWindow.sizeX,
    y: 0,
    offsetX: 400,
    offsetY:0,
    sizeX: 200,
    sizeY: 200
};

let previewWindow = {
    x: outputWindow.sizeX+captureWindow.sizeX,
    y: 0,
    offsetX: captureWindow.offsetX,
    offsetY: captureWindow.offsetY,
    sizeX: captureWindow.sizeX,
    sizeY: captureWindow.sizeY
};


calibrationMode = true;

function mouseClicked() {
    calibrationMode = !calibrationMode;
    clear();
    video = createCapture(VIDEO);
}


function setup() {
    video = createCapture(VIDEO);

    video.hide();
    createCanvas(5 * size,1*size);

    window.setInterval(() => {
        if(!calibrationMode){
            classify()
                .then(d => {
                    classificationOutput && classificationOutput.remove();
                    classificationOutput = createP(d.label);
                    return searchUnsplash(d.label)
                });
        }

    }, 5000)
}

function searchUnsplash(keyword) {
    return fetch(`https://cors.ft0.ch/https://unsplash.com/search/photos/${keyword}`)
        .then(r => r.text())
        .then(d => {
            const r = JSON.parse(d.match(/INITIAL_STATE__ = ([^;]*)/)[1])
            const photoIds = (Object.keys(r.entities.photos))
            const photo = r.entities.photos[photoIds[Math.floor(Math.random() * photoIds.length)]]
            loadImage(photo.urls.small, img => {
                image(img, outputWindow.x, outputWindow.y, outputWindow.sizeX, outputWindow.sizeY);
            })
        })
}

function draw() {
    if(calibrationMode){
        image(video,previewWindow.x, previewWindow.y, previewWindow.sizeX, previewWindow.sizeY,previewWindow.offsetX,previewWindow.offsetY,previewWindow.sizeX,previewWindow.sizeY)
    }
}


function classify() {
    video = createCapture(VIDEO);

    return new Promise((resolve,reject) => {
        setTimeout(() => {
            if (video) {
                video.hide();
                stillImage = video.get(captureWindow.offsetX, captureWindow.offsetY, captureWindow.sizeX, captureWindow.sizeY);
                image(stillImage, captureWindow.x, captureWindow.y, captureWindow.sizeX, captureWindow.sizeY);
                return getClassifier(stillImage)
                    .then(classifier => resolve(classifyAndGetFirstResult(classifier,stillImage)));
            }
        }, 500)

    })

}


function getClassifier() {
    return new Promise((resolve, reject) => {
        classifier = ml5.imageClassifier('MobileNet', () => {
            resolve(classifier);
        });
    })
}

function classifyAndGetFirstResult(classifier, stillImage) {
    return classifier.classify(stillImage)
        .then(results => {
            return {
                label: results[0].label,
                confidence: results[0].confidence
            }
        })
}

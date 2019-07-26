let serverIP = "192.168.10.188";

const socket = new WebSocket(`ws://${serverIP}:8080`);
const id = `${Math.random()}`;
const dunes = 'https://images.unsplash.com/photo-1563985336376-568060942b80?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjEyMDd9'
// let poseNet
let video;
let classifier;
let classificationOutput;
let charRNN;
let charRNNalt;

let size = 200;

let outputWindow = {
    x: 0,
    y: 0,
    sizeX: size * 6,
    sizeY: size * 3
};

let captureWindow = {
    x: outputWindow.sizeX,
    y: outputWindow.sizeY,
    offsetX: 400,
    offsetY: 0,
    sizeX: 200,
    sizeY: 200
};

let previewWindow = {
    x: outputWindow.sizeX + captureWindow.sizeX,
    y: 0,
    offsetX: captureWindow.offsetX,
    offsetY: captureWindow.offsetY,
    sizeX: captureWindow.sizeX,
    sizeY: captureWindow.sizeY
};


calibrationMode = true;

function mouseClicked() {
    charRNN = charRNNalt
    calibrationMode = false;
    clear();
    classifyAndSend();
}


function setup() {
    video = createCapture(VIDEO);

    video.hide();
    createCanvas(10 * size, 3 * size);

    let label = "";

    socket.addEventListener('message', (dataStr) => {
        console.log(dataStr.data)
        if (calibrationMode){
            calibrationMode = false;
            clear();
        }
        let data = JSON.parse(dataStr.data);
        if (data.id !== id) {
            classifyAndSend();
        }
    })

    charRNN = ml5.charRNN('./models/jkrowling_HP/')
    charRNNalt = ml5.charRNN('./models/hemingway/')
}

function classifyAndSend() {
    classify()
        .then(d => {
            // label = d.label;
            // classificationOutput && classificationOutput.remove();
            // classificationOutput = createP(d.label);
            return searchUnsplash(d)
        })
        .then(({label, url}) => {
            let txt = label.toLowerCase();
            let data = {
              seed: txt,
              temperature: 0.75,
              length: 160
            }
            charRNN.generate(data, (err, result) => {
              let output = `${txt}${result.sample}`
              console.log(output)
              output = output.replace(/\n/g, ' ').trim()
              console.log(output)
              output = output.match(/^(.*)\s([^\s]+)$/)[1]
              console.log(output)
              socket.send(JSON.stringify({label: output, url, id}))
            });
        })
}

function searchUnsplash(keywords) {
    const label = keywords[0].split(',')[0]
    return fetch(`https://cors.ft0.ch/https://unsplash.com/search/photos/${label}`)
        .then(r => r.text())
        .then(d => {
            const json = d.match(/INITIAL_STATE__ = (((?!;<\/script).)*)/)[1]
            const r = JSON.parse(json)
            const photoIds = (Object.keys(r.entities.photos))
            let photo;
            if(photoIds.length === 1){
                photo = r.entities.photos[photoIds[0]];
            } else {
                const photos = photoIds.map(id => r.entities.photos[id]).filter(p => p.description !== 'Sandwich Harbour');
                photo = photos[Math.floor(Math.random() * photos.length)]
            }
            loadImage(photo.urls.small, img => {
                image(img, outputWindow.x, outputWindow.y, outputWindow.sizeX, outputWindow.sizeY);
            })
            return {url: photo.urls.small, label};
        })
}

function draw() {
    if (calibrationMode) {
        image(video, previewWindow.x, previewWindow.y, previewWindow.sizeX, previewWindow.sizeY, previewWindow.offsetX, previewWindow.offsetY, previewWindow.sizeX, previewWindow.sizeY)
    }
}


function classify() {
    video = createCapture(VIDEO);

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (video) {
                video.hide();
                stillImage = video.get(captureWindow.offsetX, captureWindow.offsetY, captureWindow.sizeX, captureWindow.sizeY);
                image(stillImage, captureWindow.x, captureWindow.y, captureWindow.sizeX, captureWindow.sizeY);
                return getClassifier(stillImage)
                    .then(classifier => resolve(classifyAndGetFirstResult(classifier, stillImage)));
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
        .then(results => results.map(res => res.label))
}

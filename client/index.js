const socket = new WebSocket('ws://192.168.10.188:8080');
const id = `${Math.random()}`

let style1;
let inputImg;
let resultImg;
let result;

// let poseNet
let video
let classifier

function setup() {

  createCanvas(1200, 800)
  video = createCapture(VIDEO).hide()
  // window.setInterval( () => {
    classify(video).then(d => {
      searchUnsplash(d.label)
    })
  // }, 30000)
  // classifier = ml5.imageClassifier('MobileNet', video, onModelReady)
  // poseNet = ml5.poseNet(video, onModelReady)

  style1 = ml5.styleTransfer('./models/wave/');
}

function searchUnsplash(keyword) {
  fetch(`https://cors.ft0.ch/https://unsplash.com/search/photos/${keyword}`)
    .then(r => r.text())
    .then(d => {
      const json = d.match(/INITIAL_STATE__ = (((?!;<\/script).)*)/)[1]
      const r = JSON.parse(json)
      const photoIds = (Object.keys(r.entities.photos))
      const photo = r.entities.photos[photoIds[Math.floor(Math.random() * photoIds.length)]]
      // console.log(photo.urls)
      loadImage(photo.urls.thumb, img => {
        background(255)
        image(img,0,0,img.width * 2, img.height * 2)
        window.setTimeout(() => transferStyle(img), 50)
      })
    })
}

function classify(video){
    return getClassifier(video)
        .then(classifyAndGetFirstResult);
}

function getClassifier(video){
    return new Promise((resolve,reject) => {
        classifier = ml5.imageClassifier('MobileNet',video);
        resolve(classifier);
    })
}

function classifyAndGetFirstResult(classifier) {
    return classifier.classify()
        .then(results => {
            return {
                label: results[0].label,
                confidence: results[0].confidence
            }
        })
}

function transferStyle (img) {
  img.loadPixels();
  if (style1 && style1.ready) {
    console.log("Applying Style transfer...", img.imageData);
  	style1.transfer(img.imageData, (err, result) => {
      resultImg = createImg(result.src).hide()
      console.log(result.src)
      image(resultImg,0,0,resultImg.width * 2, resultImg.height * 2)

      classify(video).then(d => {
        searchUnsplash(d.label)
      })
    })
  }
}

socket.addEventListener('open', function (event) {
    socket.send(`init/${id}`)
})

socket.addEventListener('message', ({data}) => {
    console.log('received', data)
    if (data.split('/')[0] === 'done' && data.split('/')[1] != id) {
        console.log('do something')
    }
})

function done () {
    socket.send(`done/${id}`)
}

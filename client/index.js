const socket = new WebSocket('ws://192.168.10.188:8080');
const id = `${Math.random()}`

// let poseNet
let video
let classifier

function setup() {

  createCanvas(1200, 800)
  video = createCapture(VIDEO)
  window.setInterval( () => {classify(video).then(d => {
    console.log(d.label)
    searchUnsplash(d.label)
  })}, 5000)
  // classifier = ml5.imageClassifier('MobileNet', video, onModelReady)
  // poseNet = ml5.poseNet(video, onModelReady)
}

function searchUnsplash(keyword) {
  fetch(`https://cors.ft0.ch/https://unsplash.com/search/photos/${keyword}`)
    .then(r => r.text())
    .then(d => {
      const r = JSON.parse(d.match(/INITIAL_STATE__ = ([^;]*)/)[1])
      const photoIds = (Object.keys(r.entities.photos))
      const photo = r.entities.photos[photoIds[Math.floor(Math.random() * photoIds.length)]]
      loadImage(photo.urls.small, img => {
        image(img, 0, 0);
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

let style1;
let inputImg;
let resultImg;
let result;


function setup() {
  //noCanvas();
  createCanvas(1200,600);

  
  // Create Style methods with different pre-trained models
  console.log("start load model");
  style1 = ml5.styleTransfer('./models/wave/', modelLoaded);
  loadPic();
}

function loadPic(i_img){
  if(i_img){
    console.log("use provided image");
  	inputImg = i_img;
  }
  else{
    console.log("load default image");
    //inputImg = select('#inputImg');
    inputImg = loadImage('./img/patagonia.jpg',onLoadImage,onLoadImageErr);
    //inputImg = loadImage('https://images.pexels.com/photos/104827/cat-pet-animal-domestic-104827.jpeg?cs=srgb&dl=animal-animal-photography-cat-104827.jpg&fm=jpg',onLoadImage,onLoadImageErr);
    //resizeCanvas(inputImg.width, 2 * inputImg.height)
    //image(inputImg,0,0);

  }
}

function onLoadImageErr(){
  console.log("image load fail");
  inputImg = null;
}

function onLoadImage(inputImg){
  console.log("image loaded");
  inputImg.loadPixels();
  console.log(inputImg);
  resizeCanvas(inputImg.width, 2 * inputImg.height)
  image(inputImg,0,0);
}

// A function to be called when the models have loaded
function modelLoaded() {
  // Check if models is loaded
  if(style1.ready){
    console.log("model loaded");
  }
  if (style1.ready && inputImg){
    console.log("Applying Style transfer...", inputImg.imageData);
  	style1.transfer(inputImg.imageData, onTransferDone);
  }
}

function onTransferDone(err, result) {
  if(err) {
    console.log("Style transfer error");
    console.log(err);
  }
  else{ 
    console.log(result.src);
    resultImg = createImg(result.src).hide();
    image(resultImg,0,inputImg.height);

    console.log("Style transfer success");
  }

}


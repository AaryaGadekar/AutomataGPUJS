
const RESOLUTION = 800;

let flipper = (kernel) => {
  return [kernel[0].reverse(), kernel[1].reverse(), kernel[2].reverse()]
}


// let CONVOLUTION_MATRIX = flipper([
//   [0.565, -0.716, 0.565],
//   [-0.716, 0.627, -0.716],
//   [0.565, -0.716, 0.565]
// ]); //waves


let CONVOLUTION_MATRIX = [
    [0.037, 0.43, -0.737],
    [0.406, -0.321, -0.319],
    [-0.458, 0.416, 0.478]
]; //FABRIC


// let CONVOLUTION_MATRIX = [
//     [1, 1, 1],
//     [1, 9, 1],
//     [1, 1, 1]
// ]; //GOL

// let CONVOLUTION_MATRIX = [
//     [0.8, -0.85, 0.8],
//     [-0.85, -0.2, -0.85],
//     [0.8, -0.85, 0.8]
// ]; //Slime


// let CONVOLUTION_MATRIX = [
//   [0,1,0],
//   [1, 1, 1],
//   [0, 1, 0],
// ]; //pathwasys

// let CONVOLUTION_MATRIX = flipper([
//   [0.68, -0.9, 0.68],
//   [-0.9, -0.66, -0.9],
//   [0.68, -0.9, 0.68],
// ]); //WORMS


const canvas = document.getElementById("c");
const gpu = new GPU({
  canvas: canvas,
  mode: "gpu",
});


const gUpdate = gpu.createKernel(function(grid, CONVOLUTION_MATRIX, RESOLUTION) {



  function activation(x) {
    // let a = -1./Math.pow(2., (0.6*Math.pow(x, 2.)))+1.;
    let a =  (Math.exp(2.*x)-1.)/(Math.exp(2.*x)+1.);
    // let a = -1./(0.89*Math.pow(x, 2.)+1.)+1.;
    // let a = Math.abs(1.2 * x);

    return Math.min(Math.max(a, 0.), 1.);

    // if (a < 0. || a > 1.){
    //   return 0.;
    // }
    // return a; 
  }


  var sum = 0;
  for (var i = -1; i <= 1; i++) {
    var p = (this.thread.y + i + RESOLUTION) % RESOLUTION;
    for (var j = -1; j <= 1; j++) {
      var q = (this.thread.x + j + RESOLUTION) % RESOLUTION;
      if (grid[p][q] != 0) {
        sum += grid[p][q] * CONVOLUTION_MATRIX[i + 1][j + 1];
      }
    }
  }
  return activation(sum);
})
  .setOutput([RESOLUTION, RESOLUTION]);


init = function() {

  let grid = new Array(RESOLUTION)
    .fill(0)
    .map(() => new Array(RESOLUTION).fill(0));

  for (let i = 0; i < RESOLUTION; i++) {
    for (let j = 0; j < RESOLUTION; j++) {
      //fill every cell with a random float between -1 and 1 rounded to three decimal places
      grid[i][j] = Math.round(Math.random() * 2000 - 1000) / 1000;
    }
  }
  oldGrid = grid;
  return grid;
};


gShow = gpu
  .createKernel(function(grid) {
    this.color(
      grid[this.thread.x][grid.thread.y] * 0,
      grid[this.thread.x][grid.thread.y] * 1,
      grid[this.thread.x][grid.thread.y] * 0,
      // grid[this.thread.x][grid.thread.y] * 0.05,
      // grid[this.thread.x][grid.thread.y] * 0.65,
      // grid[this.thread.x][grid.thread.y] * 0.35,
      1
    );
  })
  .setOutput([RESOLUTION, RESOLUTION])
  .setGraphical(true);


let grid = init();
const doDraw = () => {
  grid = gUpdate(grid, CONVOLUTION_MATRIX, RESOLUTION);
  // createPng();
  gShow(grid);
    // drawOnCanvas();
  // createPng();
  window.requestAnimationFrame(doDraw);
};



const createPng = () => {
  var img = canvas.toDataURL("image/png");
  // document.write('<img src="'+img+'"/>');
  // if (counter >= 20){
  //   mergeImages([img, 'testautomata.png'])
  // .then(b64 => {
  //   document.write('<img src="'+b64+'"/>');
  // });
  //   debugger;
  // }
  // mergeImages([img, 'testautomata.png'])
  // .then(b64 => {
  //   document.getElementById('image2').src = b64
  // });
  
    document.getElementById('image2').src = img

}

doDraw();
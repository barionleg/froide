var cat1 = [
  "https://aibolem.github.io/dbrein/paris/",
  "https://aibolem.github.io/dbrein/trocadera_barrel/indnext7.html",
  "https://aibolem.github.io/dbrein/ruthenium/index.html",
  "https://aibolem.github.io/dbrein/musica/index.html",
  "https://aibolem.github.io/dbrein/bpolaroid/index.html",
  "https://aibolem.github.io/dbrein/cola/index.html",
  "https://aibolem.github.io/dbrein/rubbyn/index.html",
  "https://aibolem.github.io/dbrein/arni/index.html",
  "https://aibolem.github.io/dbrein/nota/index.html",
  "https://aibolem.github.io/dbrein/niva/index.html",
  "https://aibolem.github.io/dbrein/Acetylcholin/index.html",
  "https://aibolem.github.io/dbrein/40QR/index.html",
];

var myFrame = document.getElementById("frame");

function getRandomUrl(myFrame) {
  var index = Math.floor(Math.random() * cat1.length);
  var url = cat1[index];
  myFrame.src = url;
}

btn.addEventListener("click", function() {

  getRandomUrl(myFrame);

});

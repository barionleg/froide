particlesJS('particles-js', {
 'particles': {
 'number': {
 'value': 69,
 'density': {
 'enable': true,
 'value_area': 800
 }
 },
 'color': { 'value': '#ff0266',},
 'shape': {
 'type': 'image',
 'stroke': {
 'width': 3,
 'color': '#000000'
 },
 'edge': { 'nb_sides': 5 },
 'image': {
 'src': 'https://aibolem.github.io/dbrein/FrontEnd/TAR_PARIS.png',
 'width': 18,
 'height': 18
 }
 },
 'opacity': {
 'value': 0.5,
 'random': true,
 'anim': {
 'enable': true,
 'speed': 3,
 'opacity_min': 0.1,
 'sync': false
 }
 },
 'size': {
 'value': 18,
 'random': true,
 'anim': {
 'enable': true,
 'speed': 3,
 'size_min': 18,
 'sync': false
 }
 },
 'line_linked': {
 'enable': true,
 'distance': 150,
 'color': "#03dac6",
 'opacity': 0.4,
 'width': 2
 },
 'move': {
 'enable': true,
 'speed': 3,
 'direction': 'none',
 'random': true,
 'straight': false,
 'out_mode': 'out',
 'bounce': true,
 'attract': {
 'enable': true,
 'rotateX': 600,
 'rotateY': 1200
 }
 }
 },
 'interactivity': {
 'detect_on': 'canvas',
 'events': {
     'onhover': {
 'enable': true,
 'mode': 'grab'
 },
 'resize': true
 },
 'modes': {
 'grab': {
 'distance': 140,
 'line_linked': { 'opacity': 1 }
 },
 'bubble': {
 'distance': 300,
 'size': 18,
 'duration': 2,
 'opacity': 8,
 'speed': 3
 },
 'repulse': {
 'distance': 140,
 'duration': 0.4
 },
 'push': { 'particles_nb': 4 },
 'remove': { 'particles_nb': 2 }
 }
 },
 'retina_detect': true
 });

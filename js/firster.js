<script>
 function loadIframe(frame1, url) {
    if ( window.frames[frame1] ) {
        window.frames[frame1].location = url;   
        return false;
    }
    return true;
}</script>

<a href="https://barionleg.github.io/death-star/public/index.html" onclick="return loadIframe('frame1', this.href)">swi</a>
    <iframe name="frame1" id="firster" src="https://barionleg.github.io/death-star/public/index.html" frameborder="0">
    Your browser doesn't support iframes.</iframe>

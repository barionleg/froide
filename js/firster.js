<script>
 function loadIframe(frame1, url) {
    if ( window.frames[frame1] ) {
        window.frames[frame1].location = url;   
        return false;
    }
    return true;
}</script>

<a href="link" onclick="return loadIframe('ifrm', this.href)">whasjjjf</a>
    <iframe name="ifrm" id="ifrm" src="https://barionleg.github.io/death-star/public/index.html" frameborder="0">
    Your browser doesn't support iframes.</iframe>

<script>
    export let songId;
    export let width;
    export let height;
</script>

<iframe src={`https://open.spotify.com/embed/track/${songId}`} width={width} height={height} frameborder="0" allowtransparency="true" allow="encrypted-media" title="Song sample"></iframe>

<style>
    iframe {
        margin: auto;
        width: 100%;
    }
</style>
<script>
    import { onMount } from "svelte";
    import {Button, Spacer, Spinner, Stack, Grid, Heading, Box, Scrollable} from "@kahi-ui/framework";

    export let songId;
    export let width;
    export let height;

    let iframeComponent;

</script>

<div>
    <iframe bind:this={iframeComponent} class="center" src={`https://open.spotify.com/embed/track/${songId}`} width={width} height={height} frameborder="0" allowtransparency="true" allow="encrypted-media" title="Song sample">
    </iframe>
    <Spinner class="iframe-spinner center" />
</div>

<style>
    div {
        position: relative;
        height: 80px;
    }

    iframe {
        margin: auto;
        width: 100%;
        z-index: 10;
    }

    :global(.iframe-spinner) {
        z-index: 5;
    }

</style>
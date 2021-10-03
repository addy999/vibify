<script>
    import { onMount } from "svelte";
    import {Button, Spacer, Spinner, Stack, Grid, Text, Heading, Box, Scrollable} from "@kahi-ui/framework";

    export let songId;
    export let info; // name, artist, img
    export let width;

    let iframeComponent;
    let clicked;

    const shortenString = (string) => 
        string.length > "I Know What You Did Last".length ? string.slice(0, string.length - 3) + "..." : string;
    

</script>

<div class="fadeIn" on:click={() => clicked=true} tabindex="0">
    {#if clicked}
        <iframe bind:this={iframeComponent} class="center" src={`https://open.spotify.com/embed/track/${songId}`} width={width} height="100" frameborder="0" allowtransparency="true" allow="encrypted-media" title="Song sample">
        </iframe>
        <Spinner class="iframe-spinner center" />
    {:else}
        <Stack orientation="horizontal" class="playholder" >
            <img src={info.img} alt={`${info.name} album art`} />
            <Stack padding_left="large">
                <Heading class="song-title" align="left" as="h4" is="strong">{shortenString(info.name)}</Heading>
                <Text class="song-artist" align="left">{info.artist}</Text>
            </Stack>
        </Stack>
    {/if}
</div>

<style>
    div {
        position: relative;
        height: 100px;
    }

    iframe {
        margin: auto;
        width: 100%;
        z-index: 10;
    }

    :global(.iframe-spinner) {
        z-index: 5;
    }

    :global(.playholder) {
        background-color: rgba(0,0,0,0.5);
        width: 100%;
        cursor: pointer;
    }

    :global(.playholder:hover) {
        /* filter: brightness(1.5); */
        background-color: rgba(255,255,255,0.1);
    }

    :global(.playholder:focus) {
        box-shadow: 0px 0px 8px 1px white;
    }

    img {
        max-width: 100px;
    }

    :global(.song-title) {
        font-size: 0.95em;
        font-weight: bold!important;
    }
    :global(.song-artist) {
        font-size: 0.8em;
    }

    @media (min-width: 640px) {
        div {
            height: 100px;
        }
        img {
            max-width: 100px;
        }
        :global(.song-title) {
            font-size: 1em;
        }
        :global(.song-artist) {
            font-size: 1em;
        }
    }

</style>
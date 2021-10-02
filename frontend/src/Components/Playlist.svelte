<script lang="ts">

    import {Button, Spacer, Spinner, Stack, Grid, Heading, Box, Scrollable} from "@kahi-ui/framework";
    import { onMount } from "svelte";

    import Embed from "../Components/embed.svelte";
    import store from "../store";

    export let playlist_id: string;

    function shuffleArray(_array) {
        let array = [..._array];
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }

    const max_songs = 25;

    let songsChosen = [];
    const generateSongs = () => songsChosen = shuffleArray($store.playlists[playlist_id]).slice(0, max_songs);
    
    onMount(generateSongs)

</script>

<Box padding_y="huge" class="playlist-box" padding_x="large" palette="dark">
    <Stack
        spacing="medium">
        <Heading as="h2" align="left" class="playlist-title">{playlist_id}</Heading>
        <Heading as="h3" align="left" class="playlist-count">{`${songsChosen.length} songs`}</Heading>
    </Stack>    
    <Spacer spacing="medium" />
    <Stack orientation="horizontal">        
        {#if songsChosen.length <= max_songs}
            <Button class="padding" palette="light" on:click={generateSongs}>
                Refresh 
                <span class="material-icons">
                    refresh
                </span>
            </Button>
        {/if}
        <Button class="padding" palette="accent" disabled={true}>
            Add
            <span class="material-icons">
                add
            </span
        ></Button>
    </Stack>
    <Spacer spacing="medium" />
    <Scrollable class="scroll">
        <Stack spacing="medium">
            {#each songsChosen as song}
                <Embed songId={song.id} width="" height="80"/>
            {/each}
        </Stack>
    </Scrollable>
</Box>

<style>
    :global(.playlist-title) {
        font-size: 3em !important;
    }
    :global(.playlist-count) {
        font-size: 1.5em !important;
    }
    :global(.playlist-box > .scroll) {
        max-height: 350px;
        padding-bottom: 40px;
        padding-top: 40px;
        clip-path: polygon(0 0, 100% 10%, 100% 100%, 0% 90%);
    }
    :global(.playlist-box) {
        animation: slideMobile 2s;
        clip-path: polygon(0 0, 100% 10%, 100% 100%, 0% 90%);
    }

    @media (min-width: 640px) {
        :global(.playlist-box) {
            animation: slideDesktop 2s;
            clip-path: polygon(0 0, 100% 20%, 100% 100%, 0% 80%);
            /* clip-path: polygon(0 0, 100% 20%, 100% 100%, 0% 80%); */
        }
        :global(.playlist-box > .scroll) {
            max-height: 500px;
            padding-bottom: 80px;
            padding-top: 80px;
            clip-path: polygon(0 0, 100% 20%, 100% 100%, 0% 80%);
        }
    }

    @keyframes slideDesktop {
        from { clip-path: polygon(0 0, 100% 0%, 100% 100%, 0% 100%); }
        to   { clip-path: polygon(0 0, 100% 20%, 100% 100%, 0% 80%); }
    }

    @keyframes slideMobile {
        from { clip-path: polygon(0 0, 100% 0%, 100% 100%, 0% 100%); }
        to   {clip-path: polygon(0 0, 100% 10%, 100% 100%, 0% 90%); }
    }
</style>

 
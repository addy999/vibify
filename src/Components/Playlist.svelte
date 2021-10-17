<script lang="ts">

    import {Button, Spacer, Spinner, Stack, Grid, Heading, Box, Scrollable} from "@kahi-ui/framework";
    import { onMount } from "svelte";
    import { getTracksInfo, postRequest } from "../api";
    import { toast } from '@zerodevx/svelte-toast'
    import mixpanel from 'mixpanel-browser';

    import Embed from "../Components/embed.svelte";
    import store, { BASE_URL} from "../store";

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

    let max_songs = 15 + Math.floor(Math.random() * 20); // 15 - 35 songs 
    const playlistTitle = `Mix-${Object.keys($store.playlists).findIndex(i => i===playlist_id) + 1}`;
    const style = `background-color: rgba(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255},0.3);`;

    let songsChosen = [];
    let trackInfos = [];
    let submitting;
    let refrehing;


    const generateSongs = async (mounting = false) => {
        refrehing = true;
        max_songs = 15 + Math.floor(Math.random() * 20);
        let tempSongsChosen = shuffleArray($store.playlists[playlist_id]).slice(0, max_songs);
        trackInfos = await getTracksInfo($store.token, tempSongsChosen.map(s => s.id));
        songsChosen = tempSongsChosen; // assing this var eperatley because it will queue the UI being re-rendered
        !mounting && toast.push('New songs found')
        setTimeout(() => refrehing = false, 500);
    };

    const submitPlaylist = () => {
        submitting = "loading";
        mixpanel.track("Added playlist")
        postRequest(BASE_URL + `submit-playlist?token=${$store.token}&name=${playlistTitle}`, songsChosen.map(s => s.id))
        .then(() => {
            submitting="check";
            setTimeout(() => submitting="", 2000);
            toast.push('Playlist created in Spotify')
        })
    }
    
    onMount(() => generateSongs(true))

</script>

<Box tabindex="0" padding_y="huge" class="playlist-box" padding_x="large" palette="dark" {style}>
    <Stack
        spacing="large">
        <Heading as="h2" align="left" class="playlist-title">{playlistTitle}</Heading>
        <Heading as="h3" align="left" class="playlist-count">{`${songsChosen.length} songs`}</Heading>
    </Stack>    
    <Spacer spacing="medium" />
    <Stack orientation="horizontal">        
        {#if songsChosen.length >= max_songs}
            <Button class="padding" palette="auto" on:click={() => generateSongs()}>
                {#if refrehing}
                    <Spinner size="medium" />
                {:else}
                    Refresh 
                    <span class="material-icons">
                        refresh
                    </span>
                {/if}
            </Button>
            
        {/if}
        <Button class="padding" palette={submitting === "check" ? "affirmative" : "accent"} on:click={submitPlaylist}>
            {#if submitting === "loading"}
                <Spinner size="medium" />
            {:else if submitting === "check"}
                <span class="material-icons">
                    done
                </span>
            {:else}
                Add
                <span class="material-icons">
                    add
                </span>
            {/if}
        </Button>
    </Stack>
    <Spacer spacing="medium" />
    <Scrollable class="scroll">
        <Stack spacing="medium">
            {#if trackInfos.length > 0}
                {#each songsChosen as song, index}
                    <Embed songId={song.id} info={trackInfos[index]} width=""/>
                {/each}
            {/if}
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
        clip-path: polygon(0 0, 100% 10%, 100% 100%, 0% 85%);
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
            /* padding-top: 80px; */
            clip-path: polygon(0 0, 100% 20%, 100% 100%, 0% 70%);
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

 
<script lang="ts">

    import {Button, Spacer, Spinner, Stack, Grid, Heading, Box, Scrollable} from "@kahi-ui/framework";

    import Embed from "../Components/embed.svelte";
    import store from "../store";

    let playlist = "Dance";

</script>

<Stack class="center" spacing="large" padding_y="large">
    <Box padding_y="huge" class="playlist-box" padding_x="large" palette="dark">
        <Stack
            spacing="medium">
            <Heading as="h2" align="left" class="playlist-title">{playlist}</Heading>
            <Heading as="h3" align="left" class="playlist-count">{`${$store.playlists[playlist].length} songs`}</Heading>
        </Stack>    
        <Spacer spacing="medium" />
        <Stack orientation="horizontal">        
            <Button class="padding" palette="light">
                Refresh 
                <span class="material-icons">
                    refresh
                </span>
            </Button>
            <Button class="padding" palette="accent">
                Add
                <span class="material-icons">
                    add
                </span
            ></Button>
        </Stack>
        <Spacer spacing="medium" />
        <Scrollable class="scroll">
            <Stack spacing="medium">
                {#each $store.playlists[playlist] as song}
                    <Embed songId={song.id} width="" height="80"/>
                {/each}
            </Stack>
        </Scrollable>
    </Box>
    
</Stack>

<style>
    :global(.playlist-title) {
        font-size: 3em !important;
    }
    :global(.playlist-count) {
        font-size: 1.5em !important;
    }
    :global(.playlist-box > .scroll) {
        max-height: 500px;
    }
    :global(.playlist-box) {
        clip-path: polygon(0 0, 100% 20%, 100% 100%, 0% 80%);
    }
</style>

 
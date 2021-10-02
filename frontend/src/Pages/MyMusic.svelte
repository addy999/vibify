<script lang="ts">
    import {Button, Spacer, Spinner, Stack, Box, Text, Heading, Badge} from "@kahi-ui/framework";
    import { onMount } from "svelte";
    import store from "../store";
    import {Grid} from "@kahi-ui/framework";
    import { router } from "tinro";

    let steps = {
        getMusic: true,
        group: false,
        createPlaylists: false
    };

    let primaryColor = "light";
    let error;
    $: currentStep = "grid";
    // @ts-ignore
    $: !currentStep && party.confetti(document.querySelector(".browse-playlists"), {
        count: party.variation.range(30, 50),
        spread: 55
    });

    const playlistCounter = () => Object.values($store.playlists)
    .reduce((sum: number, current: string[]) => {
        sum += current.length;
        return sum;
    }, 0);

    const postRequest = (url, blob) => fetch(url, {
            method: 'POST',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(blob)
    });

    onMount(() => {
        // get all music from 10 years
        fetch($store.BASE_URL + `my-music?token=${$store.token}&days=${10}`)
        .then(data => data.json())
        .then(songs => {
            $store.songs = songs;
        })
        .then(() => fetch($store.BASE_URL + `my-music?token=${$store.token}&days=${2*365}`))
        .then(data => data.json())
        .then(songs => {
            $store.shortTermSongs = songs;
            steps.group = true;
            currentStep = "group";
        })
        .then(() => postRequest($store.BASE_URL + `find-avg-features`, $store.shortTermSongs))
        .then(data => data.json())
        .then(data => new Promise(r => setTimeout(() => r(data), 2000)))
        .then(feats => {
            $store.features = feats;
            steps.createPlaylists = true;
            currentStep = "createPlaylists";
        })
        .then(() => postRequest($store.BASE_URL + `create-playlists`, {
            songs: $store.songs,
            centers: $store.features
        }))
        .then(data => data.json())
        .then(data => new Promise(r => setTimeout(() => r(data), 3500)))
        .then(lists => {
            $store.playlists = lists;
            currentStep = "";
        })
        .catch(() => error=true)
    })

    // onMount(() => {
    //     setTimeout(() => {
    //         steps.group = true;
    //         currentStep = "group";
    //         $store.songs = Array(1000).fill(0);
    //     }, 1500)
    //     setTimeout(() => {
    //         steps.createPlaylists = true;
    //         currentStep = "createPlaylists";
    //         $store.features = {
    //             1: [],
    //             2: [],
    //         }
    //     }, 3500)
    //     setTimeout(() => {
    //         currentStep = "";
    //         $store.playlists = {
    //             1: ['a', 'b', 'c'],
    //             2: ['a', 'b']
    //         };
    //         // error = true;
    //     }, 5500)
    // })

</script>


<div class="center padding">
    <h1>Analyzing your music 🎵</h1>

    <Spacer spacing="large" />

    <Grid.Container
        alignment_x="center"
        points={["mobile:1", "3"]}
        orientation={["tablet:horizatonal", "desktop:horizontal", "widescreen:horizontal"]}
        spacing="medium">

        <Box shape="rounded" class="fadeIn progressCard" palette={primaryColor} padding="large"> 
            <Stack alignment="center">
                <Heading is="h3">Downloading your music</Heading>
                <Spacer spacing="large" />
                {#if currentStep=="grid"}
                    <Spinner />
                {:else if $store.songs}
                    <Text>{$store.songs.length} songs found 🥵</Text>
                {/if}
            </Stack>
        </Box>

        <Box shape="rounded" class="fadeIn progressCard" palette={steps.group ? primaryColor : "dark"} padding="large"> 
            <Stack alignment="center">
                <Heading is="h3"  palette="dark">Analyzing each song</Heading>
                <Spacer spacing="large" />
                {#if currentStep=="group"}
                    <Spinner />
                {:else if $store.features}
                    <Text>{Object.keys($store.features).length} 💅🏽 vibes found</Text>
                {/if}
            </Stack>
        </Box>

        <Box shape="rounded" class="fadeIn progressCard" palette={steps.createPlaylists ? primaryColor : "dark"} padding="large"> 
            <Stack alignment="center">
                <Heading is="h3" palette="dark">Matching music with vibes</Heading>
                <Spacer spacing="large" />
                {#if currentStep=="createPlaylists"}
                    <Spinner />
                {:else if $store.playlists}
                    <Text>{playlistCounter()} songs matched</Text>
                {/if}
            </Stack>
        </Box>

    </Grid.Container>

    <!-- Result container (error or success) -->
    <!-- {#if !currentStep} -->
    <Spacer spacing="medium" />
    {#if error}
        <Stack>
            <Heading is="h2">
                Uh oh, something failed!
            </Heading>
            <Spacer spacing="large" />
            <Button class="padding" size="large" palette="negative" on:click={() => window.location.href=""}>Try again</Button>
        </Stack>
    {:else}
            <Spacer spacing="small" />
            <Button
                class="browse-playlists padding"
                size="large" 
                palette="affirmative"
                disabled={!!currentStep}
                on:click={() => router.goto("/auth/playlists")}
            >
                Browse playlists
            </Button>
    {/if}
    <!-- {/if} -->

</div>

<style global>

    .fadeIn {
        animation: fadein 2s;
    }
    @keyframes fadein {
        from { opacity: 0; }
        to   { opacity: 1; }
    }

    @keyframes flickerAnimation {
        0%   { opacity:1; }
        50%  { opacity:0; }
        100% { opacity:1; }
    }
            
</style>


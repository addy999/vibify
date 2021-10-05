<script lang="ts">
    import {Button, Spacer, Spinner, Stack, Box, Text, Heading, Badge} from "@kahi-ui/framework";
    import { onMount } from "svelte";
    import store from "../store";
    import {Grid} from "@kahi-ui/framework";
    import { router } from "tinro";
    import { getSongsUntil, postRequest, get_song_features, filterSongsUntilDaysAgo } from "../api";
    import mixpanel from 'mixpanel-browser';

    let steps = {
        getMusic: true,
        group: false,
        createPlaylists: false
    };

    let primaryColor = "light";
    let error;
    $: currentStep = "grid";
    // @ts-ignore
    $: !currentStep && Object.keys($store.playlists).length > 0 && party.confetti(document.querySelector(".browse-playlists"), {
        count: party.variation.range(30, 50),
        spread: 55
    });

    const playlistCounter = () => Object.values($store.playlists)
    .reduce((sum: number, current: string[]) => {
        sum += current.length;
        return sum;
    }, 0);

    onMount(() => {
        mixpanel.track("Logged in");
        // get all music from 10 years
        getSongsUntil($store.token, 10 * 365)
        .then(songs => {
            $store.songs = songs;
            steps.group = true;
            currentStep = "group";
            return songs;
        })
        .then(songs => get_song_features($store.token, songs.map(s => s.id), false))
        .then(feats => {
            $store.songs = $store.songs.map(song => {
                song.feats = feats[song.id];
                return song;
            })
            return postRequest($store.BASE_URL + `find-avg-features`, 
            filterSongsUntilDaysAgo($store.songs, 2 * 365) // last two years
        );
        })
        .then(data => data.json())
        .then(feats => {
            if (feats.length > 0) return new Promise(r => setTimeout(() => r(feats), 2000));
            else {
                // increase range to ALL songs and larger window to a week
                return postRequest($store.BASE_URL + `find-avg-features?max_diff=${7 * 24 * 3600}`, 
                $store.songs).then(d => d.json()) // last two years
            }

        })
        .then(feats => {
            // @ts-ignore
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
            // @ts-ignore
            $store.playlists = lists;
            currentStep = "";
        })
        .catch(() => error=true)
    })

</script>


<div class="center padding">
    <h1 class="analyze">Analyzing your music 🎵</h1>

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
                    <Text>{$store.songs.length} songs found 🤩</Text>
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
                    <Text>Beep boop done 👩‍💻</Text>
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
                    <Text>
                        {Object.keys($store.playlists).length} 💅🏽 vibes found
                        <!-- { Math.round((playlistCounter() / $store.songs.length) * 100)}% songs fit the vibes -->
                    </Text>
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
                disabled={!$store.playlists || Object.keys($store.playlists).length == 0}
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

    :global(.analyze) {
        font-size: 2em;
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


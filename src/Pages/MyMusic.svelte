<script lang="ts">
  import {
    Button,
    Spacer,
    Spinner,
    Stack,
    Box,
    Text,
    Heading,
    Badge,
  } from "@kahi-ui/framework";
  import { onMount } from "svelte";
  import store from "../store";
  import { Grid } from "@kahi-ui/framework";
  import { router } from "tinro";
  import { beepBoopBeep, Events } from "../algo";
  import mixpanel from "mixpanel-browser";

  // config
  const primaryColor = "light";

  // state
  const stepHistory = {
    songsAdded: false,
    featuresAdded: false,
    playlistsCreated: false,
  };
  const eventCallback = (event, arg) => {
    switch (event) {
      case Events.songsAdded:
        stepHistory.songsAdded = true;
        $store.songs = arg;
        currentStep = 2;
        break;
      case Events.featuresAdded:
        console.log("featuresAdded");
        stepHistory.featuresAdded = true;
        $store.features = arg;
        currentStep = 3;
        break;
      case Events.playlistsCreated:
        console.log("playlistsCreated");
        stepHistory.playlistsCreated = true;
        $store.playlists = arg;
        currentStep = 0;
        Object.keys($store.playlists).length > 0 &&
          // @ts-ignore
          party.confetti(document.querySelector(".browse-playlists"), {
            // @ts-ignore
            count: party.variation.range(30, 50),
            spread: 55,
          });
    }
  };
  let error;
  let currentStep = 1;

  onMount(() => {
    mixpanel.track("Logged in");
    beepBoopBeep({
      cb: eventCallback,
      token: $store.token,
    }).catch(() => (error = true));
  });
</script>

<div class="center padding">
  <h1 class="analyze">Analyzing your music 🪗</h1>

  <Spacer spacing="large" />
  <Spacer spacing="large" />

  <Grid.Container
    alignment_x="center"
    points={["mobile:1", "3"]}
    orientation={[
      "tablet:horizatonal",
      "desktop:horizontal",
      "widescreen:horizontal",
    ]}
    spacing="medium"
  >
    <Box
      shape="rounded"
      class="fadeIn progressCard"
      palette={primaryColor}
      padding="large"
    >
      <Stack alignment="center">
        <Heading is="h3">Downloading your music</Heading>
        <Spacer spacing="large" />
        {#if currentStep == 1}
          <Spinner />
        {:else if $store.songs}
          <Text>{$store.songs.length} songs found 🤩</Text>
        {/if}
      </Stack>
    </Box>

    <Box
      shape="rounded"
      class="fadeIn progressCard"
      palette={stepHistory.songsAdded ? primaryColor : "dark"}
      padding="large"
    >
      <Stack alignment="center">
        <Heading is="h3" palette="dark">Analyzing each song</Heading>
        <Spacer spacing="large" />
        {#if currentStep == 2}
          <Spinner />
        {:else if $store.features}
          <Text>Beep boop done 👩‍💻</Text>
        {/if}
      </Stack>
    </Box>

    <Box
      shape="rounded"
      class="fadeIn progressCard"
      palette={stepHistory.playlistsCreated ? primaryColor : "dark"}
      padding="large"
    >
      <Stack alignment="center">
        <Heading is="h3" palette="dark">Matching music with vibes</Heading>
        <Spacer spacing="large" />
        {#if currentStep == 3}
          <Spinner />
        {:else if $store.playlists}
          <Text>
            {Object.keys($store.playlists).length} 💅🏽 vibes found
          </Text>
        {/if}
      </Stack>
    </Box>
  </Grid.Container>

  <!-- Result container (error or success) -->
  <Spacer spacing="medium" />
  {#if error}
    <Stack>
      <Heading is="h2">Uh oh, something failed!</Heading>
      <Spacer spacing="large" />
      <Button
        class="padding"
        size="large"
        palette="negative"
        on:click={() => (window.location.href = "")}>Try again</Button
      >
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
</div>

<style global>
  .fadeIn {
    animation: fadein 2s;
  }

  :global(.analyze) {
    font-size: 2em;
  }

  @keyframes fadein {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes flickerAnimation {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
</style>

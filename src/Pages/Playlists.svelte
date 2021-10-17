<script lang="ts">
  import {
    Button,
    Spacer,
    Spinner,
    Stack,
    Grid,
    Heading,
    Box,
    Scrollable,
  } from "@kahi-ui/framework";
  import store from "../store";
  import Playlist from "../Components/Playlist.svelte";
  import mixpanel from "mixpanel-browser";

  const min_playlist_size = 5;

  mixpanel.track("Browsed playlists");
</script>

<Stack spacing="large" padding_y="large" padding_x="mobile:medium">
  {#each Object.keys($store.playlists) as playlist_id}
    {#if $store.playlists[playlist_id].length >= min_playlist_size}
      <Playlist {playlist_id} />
    {/if}
  {/each}
</Stack>

<style>
</style>

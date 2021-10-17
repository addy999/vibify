<script>
  import store from "./store";
  import { onMount } from "svelte";
  let foundToken = !!$store.token;

  onMount(() => {
    if (!foundToken) {
      const urlSearchParams = new URLSearchParams(window.location.search);
      const params = Object.fromEntries(urlSearchParams.entries());
      if ("token" in params) {
        $store.token = params.token;
        foundToken = true;
      }
    }
  });
</script>

{#if foundToken}
  <slot name="authed" />
{:else}
  <slot name="notAuuthed" />
{/if}

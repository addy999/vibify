<script>
    import store from "./store";
    import { onMount } from "svelte"; 
    let foundToken;

	onMount(() => {
		foundToken = document.cookie.split(";")
		.find(cookie => cookie.includes('token='));
		
		if (foundToken) {
			$store.token = foundToken.replace("token=", "");
		}
	});

</script>

{#if foundToken}
    <slot name="authed" />
{:else}
    <slot name="notAuuthed" />
{/if}
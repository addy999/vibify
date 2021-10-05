<script>
    import store from "./store";
    import { onMount } from "svelte"; 
    let foundToken = !!$store.token;

	// console.log(route.params)

	onMount(() => {
		// foundToken = document.cookie.split(";")
		// .find(cookie => cookie.includes('token='));
		
		// if (foundToken) {
		// 	$store.token = foundToken.replace("token=", "");
		// }

		if (!foundToken) {
			const urlSearchParams = new URLSearchParams(window.location.search);
			const params = Object.fromEntries(urlSearchParams.entries());
			if ('token' in params) {
				$store.token  = params.token;
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
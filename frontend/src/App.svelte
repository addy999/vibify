<script lang="ts">
	import { Route, router } from 'tinro'; 
	import "@kahi-ui/framework/dist/kahi-ui.framework.css";
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import mixpanel from 'mixpanel-browser';

	import MyMusic from "./Pages/MyMusic.svelte";
	import Transition from './Transition.svelte';
	import AuthGuard from "./AuthGuard.svelte";
	import Playlists from "./Pages/Playlists.svelte";
	import store from "./store";

	import {Button, Spacer, Spinner, Stack, Heading} from "@kahi-ui/framework";
	
	let loading;

	const getAuthRedirect = () => {
		setTimeout(() => {
			loading= true;
		}, 100);
		fetch($store.BASE_URL + "get-auth")
		.then(data => data.json())
		.then(url => {
			// loading= true;
			// router.goto(url.url)
			window.location.href = url.url;
	});}

	const logo = "./Vibify-logos_white.png";
	mixpanel.init('a925c935d82ff2db81f3416c99ba0a36', {debug: false, ignore_dnt: true}); 
	
</script>

<Transition>
	<Route path="/">
		<Stack class="center" padding="medium">
			<!-- <img alt="A visual breakdown of playlists" src="./Group 1.png" /> -->
			<!-- <Box> -->
				<!-- <Heading as="h1" class="headline" variation="headline">Vibify</Heading> -->
				<img src={logo} alt="Logo"/>
				<Spacer spacing="large" />
				<Heading is="h2">Find hidden playlists within your music using your listening history</Heading>
				<Spacer  spacing="large"/>
				<Button filled on:click={getAuthRedirect} class="padding" size="huge" palette="affirmative">
					{#if !loading}
						Connect to Spotify
					{:else}
						<Spinner class="margin" />
					{/if}
				</Button>
			<!-- </Box> -->
		</Stack>
	</Route>
	<AuthGuard>
		<Route path="/auth/*" slot="authed">
			<Route path="/onboard">
				<MyMusic />
			</Route>
			<Route path="/playlists">
				<Playlists />
			</Route>
		</Route>
	</AuthGuard>
	<Route fallback redirect="/">
	</Route>
</Transition>	
<SvelteToast />

<style global>
	body {
		background-color: #3E3E3E;
		color: white;
		font-family: 'Roboto', sans-serif;
    	margin: auto;
		background-image: linear-gradient(to right, #2c3e50, #4ca1af);
	}
	main {	
		min-height: 100vh;
		max-width: 800px;
		margin: auto;
		position: relative;
		text-align: center;
	}

    button {
        max-width: 300px;
		margin: auto !important;
    }

	:global(.center) {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 100%;
	}

	.margin {
		margin: 5px 15px;
	}

	.padding {
		padding: 15px 15px !important;
	}

	@media (min-width: 640px) {
		.padding {
			padding: 15px 25px !important;
		}
	}

	h1, h2 {
		/* font-size: 2em !important; */
		font-weight: 100 !important;
	}

	.headline {
		font-size: 6em !important;
		letter-spacing: 7px;
		/* font-style: italic; */
	}

</style>
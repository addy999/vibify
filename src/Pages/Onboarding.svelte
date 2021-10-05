<script>
	import { Route, router } from 'tinro'; 
    import {Button, Spacer, Spinner, Stack} from "@kahi-ui/framework";

    const selectMode = mode => {
        // mode = my-music || top-music
        router.goto( $router.path + "/"+  mode)
    }
</script>


<div class="center">
    <h1>How would you like to create playlists?</h1>

    <div class="flex-container">
        <button class="card" on:click={() => selectMode("my-music")}>
            Find similar music and group them together
        </button>
        <button class="card disabled" disabled  on:click={() => selectMode("top-music")}>
            Group songs using my top listens in the last year
        </button>
    </div>
</div>

<style>
    
</style>


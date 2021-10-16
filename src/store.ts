import { writable } from "svelte/store";

interface Store {
    token?: string;
    songs: any[];
    features?: Array<Array<number>>;
    playlists?: Record<string, any[]>;
    BASE_URL: string;
}

export default writable<Store>({
    token: null,
    songs: [],
    features: null, // {}
    playlists: null, // {}
    BASE_URL: window.location.href.includes('127.0.0.1') ? 'http://127.0.0.1:8000/' : "https://api.vibify.me/"  // api
})
import { writable } from "svelte/store";

export const BASE_URL = window.location.href.includes("127.0.0.1")
  ? "http://127.0.0.1:8000/"
  : "https://api-ymz3zzn52a-uc.a.run.app/"; // api

interface Store {
  token?: string;
  songs: any[];
  features?: Array<Array<number>>;
  playlists?: Record<string, any[]>;
}

export default writable<Store>({
  token: null,
  songs: [],
  features: null, // {}
  playlists: null, // {}
});

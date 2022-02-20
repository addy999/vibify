import { BASE_URL } from "./store";
import { arrayChunks, mergeDeep } from "./utils";

const day = 3600 * 24 * 1000;

export const postRequest = (url, blob) =>
  fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(blob),
  }).then((data) => data.json());

export const get_song_features = async (
  token: string,
  song_ids: string[],
  normalize: boolean
): Promise<any> => {
  console.log("getting details...", song_ids.length);
  // debugger;
  const features = {};
  const songs_to_get = song_ids.length;

  for (let i = 0; i < songs_to_get / 100 + 1; i++) {
    let feats = await fetch(
      `https://api.spotify.com/v1/audio-features?ids=${song_ids
        .slice(i * 100, i * 100 + 100)
        .join(",")}`,
      { headers: { Authorization: `Bearer ${token}` } }
    ).then((d) => d.json());

    feats["audio_features"].map((_, j) => {
      if (_) {
        features[song_ids[i * 100 + j]] = [
          _.acousticness,
          _.danceability,
          _.loudness,
          _.energy,
          _.liveness,
          _.valence,
          _.tempo,
          _.speechiness,
          _.instrumentalness
        ];
      }
    });
  }

  return features;
};

export const filterSongsUntilDaysAgo = (songs: any[], days: number) => {
  let last_time = Date.now() * 1000;
  let end_time = last_time - day * days * 1000;

  return songs.filter((song) => song.time >= end_time);
};

const getSongsWithOffsets = (
  token: string,
  offset_start: number,
  n: number
): Promise<any> =>
  Promise.all(
    [...Array(n).keys()].map((i) =>
      fetch(
        `https://api.spotify.com/v1/me/tracks?offset=${
          (offset_start + i) * 50
        }&limit=50`,
        { headers: { Authorization: `Bearer ${token}` } }
      ).then((d) => d.json())
    )
  ).then((respArray) =>
    respArray.reduce((all, current) => [...all, ...current.items], [])
  );

export const batchCreatePlaylists = async (songs, centers) => {
  const chunks_of_songs = arrayChunks(songs, 100);
  return Promise.all([
    chunks_of_songs.map((chunk) =>
      postRequest(BASE_URL + `create-playlists`, {
        songs: chunk,
        centers,
      })
    ),
  ]).then((respArray) =>
    respArray.reduce((all, current) => mergeDeep(all, current), {})
  );
};

export const getSongsUntil = async (token: string, days: number) => {
  console.log("getting songs");
  let song_map = {};
  let last_time = Date.now() * 1000;
  let end_time = last_time - day * days * 1000;
  let offset = 0;
  let reached_end = false;

  while (last_time >= end_time && !reached_end) {
    const items = await getSongsWithOffsets(token, offset, 10);
    try {
      if (items.length === 0) reached_end = true;

      items.map((song) => {
        if (reached_end) return;

        last_time = Date.parse(song.added_at) * 1000;

        if (song.track.id in song_map) {
          reached_end = true;
        }

        song_map[song.track.id] = {
          id: song["track"]["id"],
          name: song["track"]["name"],
          artist: song["track"]["artists"][0]["name"],
          time: last_time,
          feats: [],
        };
      });
    } catch (err) {
      console.warn(err);
      reached_end = true;
    }
    offset += 10;
  }

  return Object.values(song_map);
};

export const getTopTracks = async (
  token: string,
  max_amount = 20
): Promise<any> => {
  const songs = await fetch(
    `https://api.spotify.com/v1/me/top/tracks?limit=${max_amount}&time_range=long_term`,
    { headers: { Authorization: `Bearer ${token}` } }
  ).then((d) => d.json());

  return songs.items.map((song) => song.id);
};

export const getTracksInfo = (token: string, ids: string[]): Promise<any> =>
  fetch(`https://api.spotify.com/v1/tracks?ids=${ids.join(",")}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((d) => d.json())
    .then((data) =>
      data.tracks.map((track) => ({
        name: track.name,
        artist: track.artists[0].name,
        img: track.album.images[1].url,
      }))
    );

export const batchGetTracksInfo = (token: string, ids: string[]): Promise<any[]> => 
  Promise.all(
    arrayChunks(ids, 25).map((chunk) =>
      getTracksInfo(token, chunk)
    ),
  )
  .then((respArray) =>
    respArray.reduce((all, current) => [...all, ...current], [])
  );
  
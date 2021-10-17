import {
  getSongsUntil,
  postRequest,
  get_song_features,
  getTopTracks,
  batchCreatePlaylists
} from "./api";

import { BASE_URL } from "./store";
import { delayedCall } from "./utils";

export enum Events {
  songsAdded, // step1
  featuresAdded, // step2
  playlistsCreated, // step3
}

type SequenceProps = {
  cb: (arg0: Events, arg1?: any) => void; // callback
  token: string;
  songs?: any[];
};

const baseSequence = ({ cb, token }: SequenceProps) =>
  getSongsUntil(token, 10 * 365)
    .then(async (songs) => {
      // Now get features for each song
      // @ts-ignore
      return {
        feats: await get_song_features(
          token,
          // @ts-ignore
          songs.map((s) => s.id),
          false
        ),
        songs,
      };
    })
    .then(({ feats, songs }) => {
      cb(Events.songsAdded, songs);
      // Add features onto songs
      return songs.map((song) => {
        // @ts-ignore
        song.feats = feats[song.id];
        return song;
      });
    });

// Algos

const historySequence = ({ cb, token, songs }: SequenceProps) =>
  postRequest(BASE_URL + `find-avg-features`, songs)
    .then(feats => {
      delayedCall(cb, Events.featuresAdded, feats, 2500); 
      // step2 done, step3 start
      return postRequest(BASE_URL + `create-playlists`, {
        songs,
        centers: feats,
      })
      // return await batchCreatePlaylists(songs, feats);
    })
    .then((lists) => {
      delayedCall(cb, Events.playlistsCreated, lists, 3500);
      //step3 done
      console.log({ lists })
      return lists;
    });

const topSequence = ({ cb, token, songs }: SequenceProps) =>
  getTopTracks(token, 20)
    .then(async (topIds) => ({
      songs,
      feats: await get_song_features(token, topIds, false),
    }))
    .then(({ songs, feats }) => {
      cb(Events.featuresAdded, feats); // step2 done, step3 start
      return postRequest(BASE_URL + `create-playlists`, {
        songs: songs,
        centers: feats,
      });
    })
    // .then(feats => new Promise((r) => setTimeout(() => r(feats), 1500)))
    .then((lists) => {
      cb(Events.playlistsCreated, lists); // step3 done
      return lists;
    });

export const beepBoopBeep = async ({ cb, token }: SequenceProps) => {
  const songs = await baseSequence({ cb, token });
  return songs.length > 1000
    ? historySequence({ cb, token, songs })
    : topSequence({ cb, token, songs });
};

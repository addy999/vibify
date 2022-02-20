import {
  getSongsUntil,
  postRequest,
  get_song_features,
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
      cb(Events.songsAdded, songs);
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
      cb(Events.featuresAdded, "blah");
      // Add features onto songs
      return songs.map((song) => {
        // @ts-ignore
        song.feats = feats[song.id];
        return song;
      });
    });

// Algos

const clusterSequence = ({ cb, token, songs }: SequenceProps) => 
 postRequest(BASE_URL + `create-playlists`, {songs})
  .then(lists => {
    delayedCall(cb, Events.playlistsCreated, lists, 2000); // step3 done
    return lists;
  });;


export const beepBoopBeep = async ({ cb, token }: SequenceProps) => {
  const songs = await baseSequence({ cb, token });
  return clusterSequence({ cb, token, songs });
};

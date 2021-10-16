import { getSongsUntil, postRequest, get_song_features, filterSongsUntilDaysAgo } from "./api";

export enum Events {
    songsAdded,
    findingFeatures,
    featuresAdded,
    startingAvgFeatures,
    avgFeaturesFound,
}

export type SequenceProps = {
    cb: (arg0: Events, arg1?: any) => void, 
    token: string
};

const baseSequence = ({cb, token} : SequenceProps) => getSongsUntil(token, 10 * 365)
.then(songs => {
    // First, get all music from past 10 years
    cb(Events.songsAdded, songs);
    return songs;
})
.then((songs) => {
    // Now get features for each song
    cb(Events.findingFeatures);
    // @ts-ignore
    return {feats: get_song_features(token, songs.map(s => s.id), false),
    songs}
})
.then(({feats, songs}) => {
    // Add features onto songs
    cb(Events.featuresAdded, songs.map(song => {
        // @ts-ignore
        song.feats = feats[song.id];
        return song;
    }));
    return songs;
})

const topSequence = ({cb, token}: SequenceProps) => 
    baseSequence({cb, token})
    .then(songs => {
        
    })
const day = 3600 * 24 * 1000;

const get_song_features = async (token: string, song_ids: string[], normalize: boolean): Promise<any> => {
    console.log("getting details...", song_ids.length)
    // debugger;
    const features = {}
    const songs_to_get = song_ids.length;

    for (let i=0; i < (songs_to_get / 100) + 1; i++) {
        let feats = await fetch(
            `https://api.spotify.com/v1/audio-features?ids=${song_ids.slice(i * 100, i * 100 + 100).join(",")}`,
            {headers: {"Authorization": `Bearer ${token}`}},
        ).then(d => d.json());

        feats["audio_features"].map((_, j) => {
            if (_) {
                features[song_ids[i * 100 + j]] = [
                    _.danceability,
                    _.energy,
                    _.liveness,
                    _.valence,
                    _.tempo
                ]
            }
        })
            
    }

    return features;
}

export const getSongsUntil = async (token: string, days: number) => {
    console.log("getting songs")
    let song_map = {};
    let last_time = Date.now() * 1000;
    let end_time = last_time - day * days *1000;
    let offset = 0
    let reached_end = false;
    // debugger;

    // console.log("starting at", last_time);
    // console.log("ending at", end_time);

    while (last_time >= end_time && !reached_end) {
        const resp = await fetch(`https://api.spotify.com/v1/me/tracks?offset=${offset * 50}&limit=50`, {headers: {"Authorization": `Bearer ${token}`}}).then(d => d.json());

        try {
            if (resp.items.length === 0) reached_end = true;
            
            resp.items.map(song => {

                if (reached_end) return;

                last_time = Date.parse(song.added_at) * 1000
                // console.log("last song", last_time)

                if (song.track.id in song_map) {
                    reached_end = true
                }

                song_map[song.track.id] = {
                    id: song["track"]["id"],
                    name: song["track"]["name"],
                    artist: song["track"]["artists"][0]["name"],
                    time: last_time,
                    feats: []
                }
                
            })

                
        }
        catch(err) {
            console.warn(err)
            reached_end = true;
        }

        offset += 1;
    }

    //  add features

    const feats = await get_song_features(token, Object.keys(song_map), false)
    const songs = []
    Object.keys(feats).map(s_id => {
        let s = song_map[s_id]
        s.feats = feats[s_id]
        songs.push(s)
    });
        
    console.log("found", songs.length)
    return songs
}
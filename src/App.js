import React, { useState, useEffect } from 'react';
import Dropdown from './Dropdown';
import Listbox from './Listbox';
import View from './View';
import { Credentials } from './Credentials';
import axios from 'axios';

const App = () => {

  const spotify = Credentials();  


    
 

  const [token, setToken] = useState('');  
  const [categories, setcategories] = useState({selectedCategories: '', listOfcategoriesFromAPI: []});
  const [playlist, setPlaylist] = useState({selectedPlaylist: '', listOfPlaylistFromAPI: []});
  const [tracks, setTracks] = useState({selectedTrack: '', listOfTracksFromAPI: []});
  const [trackDetail, setTrackDetail] = useState(null);

  useEffect(() => {

    axios('https://accounts.spotify.com/api/token', {
      headers: {
        'Content-Type' : 'application/x-www-form-urlencoded',
        'Authorization' : 'Basic ' + btoa(spotify.ClientId + ':' + spotify.ClientSecret)      
      },
      data: 'grant_type=client_credentials',
      method: 'POST'
    })
    .then(tokenResponse => {      
      setToken(tokenResponse.data.access_token);

      axios('https://api.spotify.com/v1/browse/categories?locale=sv_US', {
        method: 'GET',
        headers: { 'Authorization' : 'Bearer ' + tokenResponse.data.access_token}
      })
      .then (CategoriesResponse => {        
        setcategories({
          selectedCategories: categories.selectedCategories,
          listOfcategoriesFromAPI: CategoriesResponse.data.categories.items
        })
      });
      
    });

  }, [categories.selectedCategories, spotify.ClientId, spotify.ClientSecret]); 

  const Categories = val => {
    setcategories({
      selectedCategories: val, 
      listOfcategoriesFromAPI: categories.listOfcategoriesFromAPI
    });

    axios(`https://api.spotify.com/v1/browse/categories/${val}/playlists?limit=10`, {
      method: 'GET',
      headers: { 'Authorization' : 'Bearer ' + token}
    })
    .then(playlistResponse => {
      setPlaylist({
        selectedPlaylist: playlist.selectedPlaylist,
        listOfPlaylistFromAPI: playlistResponse.data.playlists.items
      })
    });

    console.log(val);
  }

  const playlistChanged = val => {
    console.log(val);
    setPlaylist({
      selectedPlaylist: val,
      listOfPlaylistFromAPI: playlist.listOfPlaylistFromAPI
    });
  }

  const buttonClicked = e => {
    e.preventDefault();

    axios(`https://api.spotify.com/v1/playlists/${playlist.selectedPlaylist}/tracks?limit=10`, {
      method: 'GET',
      headers: {
        'Authorization' : 'Bearer ' + token
      }
    })
    .then(tracksResponse => {
      setTracks({
        selectedTrack: tracks.selectedTrack,
        listOfTracksFromAPI: tracksResponse.data.items
      })
    });
  }

  const listboxClicked = val => {

    const currentTracks = [...tracks.listOfTracksFromAPI];

    const trackInfo = currentTracks.filter(t => t.track.id === val);

    setTrackDetail(trackInfo[0].track);



  }

  
  

  return (
    <div >
      <form onSubmit={buttonClicked}>        
          <Dropdown label="Categories :" options={categories.listOfcategoriesFromAPI} selectedValue={categories.selectedCategories} changed={Categories} />
          <Dropdown label="Playlist :" options={playlist.listOfPlaylistFromAPI} selectedValue={playlist.selectedPlaylist} changed={playlistChanged} />
          <div >
            <button type='submit'>
              Search
            </button>
          </div>
          <div>
            <Listbox items={tracks.listOfTracksFromAPI} clicked={listboxClicked} />
            {trackDetail && <View {...trackDetail} /> }
          </div>        
      </form>
    </div>
    
    
  );
}

export default App;
// BQAL39jBJVB1ssl2_E6mLvJG0ibhKdrbBTrHyi1tHdzWVD4IZO389-MeLfZWSNGqgDiWXdOQwVmT-We5LuxmXR3VmIWbKMjg-dT_S_dmNhkUs-jQLifNSigEqNONZ4vSwh45KCSU3biC8MFw4XuZfYaQEEpblTM
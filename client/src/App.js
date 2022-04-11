import axios from 'axios';
import { useState } from 'react';

import CryptoItem from './CryptoItem';
import Search from './Search';

import './App.scss';

const App = () => {

  const [apiData, setApiData] = useState([]);

  // Controls max number of crytpo shown on list
  const [maxShown, setMaxShown] = useState(10);

  const [suggested, setSuggested] = useState([]);

  //For list of crypto pinned at the top of page
  const [pinned, setPinned] = useState([]);

  // Pop up notification for when a crypto is pinned or unpinned
  const[notification, setNotification] = useState('');

  // Notification timer - will hold a setTimeout for how long the notification is displayed on screen 
  const [notiTimer, setNotiTimer] = useState();
  

  const getData = async() => {
    const res = await axios.get('/api/getData')
    setApiData(res.data.data);
  }


  // Control maxShown to show more or less crypto on list
  const showMore = () => { 
    // Reset maxShown to 20 if it become >= apiData length
    if (maxShown >= apiData.length) {
          setMaxShown(10);
    } else {
      setMaxShown(maxShown + 10);
    }
  }


  // Pinned function - onClick grab crypot ID and use it to find the corresponding object in suggested state and push it the
  const handlePinned = (crypto) => {

    // Pinned functionality ///////////////////////////////////////////////////////////////////////////////////////////////////
    let pinnedArr = [];
    let unpin;

    // if pinned state is not empty
    if(pinned.length > 0) {
      
      pinnedArr.push(crypto);

      setPinned([...pinned, ...pinnedArr].reverse());
      // console.log('additional pinned', pinnedArr);

      // Unpin - if pinned obj is already in the pinned state, remove it
      pinned.map(el => {
        if(crypto.id === el.id) {
          // console.log('stop, unpin ID: ', el.id );
          unpin = pinned.indexOf(el);
          // console.log('unpin index: ',  unpin);
          pinnedArr = [...pinned];
          pinnedArr.splice(unpin, 1);
          // console.log('Arr after unpin: ', pinnedArr);
          setPinned(pinnedArr.reverse());
        } 
        
        return pinned;
        
      });

    // if pinned state is empty, set pinned state to pinnedArr
    } else if (pinned.length === 0) {
      pinnedArr.push(crypto);
      setPinned(pinnedArr);
    }


    // Notication functionality ///////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Reset timer
    setNotiTimer(clearTimeout(notiTimer));
    // If pinned state is empty set notification state without looping through pinned state, else check if crypto is already in pinned state and set notification accordingly
    if(pinned.length === 0) {
      setNotification(crypto.name + ' Pinned');

    } else {

      for(let i = 0; i < pinned.length; i++) {

        // If crypto is already in the pinned state - set notification to say '*crypto* Unpinned'
        if(pinned[i].id === crypto.id) {
          // console.log(crypto.id === pinned[i].id, "Id match - unpin")
          setNotification(crypto.name + ' Unpinned');
          break;

          // If crypto is not already in the pinned state - set notification to say '*crypto* Pinned'
        } else if(pinned[i].id !== crypto.id) {
          // console.log(crypto.id !== pinned[i].id, "Ids don't match - pin")
          setNotification(crypto.name + ' Pinned') 
        }

      }
     
    }
    // Set timer
    setNotiTimer(setTimeout(() => setNotification(''), 2000));
    
  }

  // Set diplay to show only the first 20 crypot results
  const cryptoDisplay = apiData.slice(0, maxShown);

  return (
    <div className="App">
      <h1>React Crypto App</h1>

      <button className='btn' onClick={() => getData()}>{cryptoDisplay.length === 0 ? 'GET DATA' : 'REFRESH'}</button>

      {/* Search bar */}
      <Search 
      pinned={ pinned } 
      apiData={ apiData } 
      suggested={ suggested } 
      setSuggested={ setSuggested }
      handlePinned={handlePinned} />


      {pinned.length > 0 && 
      <div className='pinned'>

        <h2>Pinned</h2>
      { pinned.map((crypto, i) => <CryptoItem
        handlePinned={ handlePinned }
        index={ i }
        crypto={ crypto }
        key={ crypto.id } 
        name={ crypto.name } 
        symbol={ crypto.symbol } 
        price={ crypto.quote.USD.price } 
        change24hr={ crypto.quote.USD.percent_change_24h } />) } 

      </div>}

      {/* display api data */}
      <div className='display'>
        
        { cryptoDisplay.map((crypto, i)=> <CryptoItem
        handlePinned={ handlePinned }
        index={ i }
        crypto={ crypto }
        key={ crypto.id } 
        name={ crypto.name } 
        symbol={ crypto.symbol } 
        price={ crypto.quote.USD.price } 
        change24hr={ crypto.quote.USD.percent_change_24h } />) }

        {/* Show more/Show less button */}
        { cryptoDisplay.length > 0 && <button className="btn" onClick={ () => showMore() }>
          { maxShown < apiData.length ? 'SHOW MORE' : 'SHOW LESS' }
        </button> } 

      </div>

      {/* Pinned notification */}
      <div className='pinnedNotificationDiv'>
        { notification && <div className='pinnedNotification hide'>{ notification }</div> }
      </div>
    </div>
  );
}

export default App;

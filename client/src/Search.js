import React, { useState } from "react";

const Search = ( { apiData, suggested, setSuggested, handlePinned } ) => {

    const [searchInput, setSearchInput] = useState('');
    // const [showSuggested, setShowSuggested] = useState(false);
    const [timer, setTimer] = useState(null);

    // Search logic - If searchInput matches a crypot name, grab that object and place name in the search results as a clikable item. This happens 1/2 a second after a key stroke after the first 3 characters
    const searchLogic = (e) => {
        
        // Reset timer a timer after each keystroke
        clearTimeout(timer);


        let input = e.target.value
        setSearchInput(input);

        // Create array to temporarily push suggestions to until ready to be assigned to the suggested state
        let tempSearchArr = [];
        
        // set timer 
        setTimer(setTimeout(() => {
            // Check if search input is empty 
            if(input.trim().length !== 0  && input.length > 2) {

                // Map through apiData state and see if input matches any of the cryptocurrencies 
                apiData.map(crpt => {
                    let cryptoName = crpt.name.toLowerCase();
                    const cryptoSymbol = crpt.symbol.toLowerCase();
                    
                    // If crypto name/symbol matches the input push to tempSearchArr - checking againt the searchInput state causes issues with predictive search
                    if(cryptoName.includes(input.toLowerCase()) || cryptoSymbol.includes(input.toLowerCase())) {
                        tempSearchArr.push(crpt);
                    } 
                });

            }

            // Set tempSearchArr as suggested state
            setSuggested(tempSearchArr);
            
        }, 500));

        return suggested;
        
    }

    return (
        // {/* Search to pin - Create predictive search bar, that only starts the search after 3 characters  */}
        <div className='searchDiv'>
        
            <div className='search'>
                <input onChange={ (e) => searchLogic(e) } value={searchInput} placeholder="Search Crypto" />
                {/* Show search results */}
                <ul className='searchResults'>
                    { suggested && suggested.map(el => <li className="result" key={el.id} onClick={() => handlePinned(el)}>{el.name}</li>) }
                </ul>
            </div>

        </div>
    );
}

export default Search;
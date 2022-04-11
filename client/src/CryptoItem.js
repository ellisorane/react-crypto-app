import React from "react";
import NumberFormat from 'react-number-format';


const CryptoItem = ({ name, symbol, price, change24hr, handlePinned, crypto }) => {
    const priceDirection = change24hr.toString()[0];
    return (
       
        // {/* Single crypto  */}
        <div className='singleCrypto' onClick={ () => handlePinned(crypto) }>
        {/* Col 1 */}
        <div className='col1'>
            <h3>{ name }</h3>
            <p>{ symbol }</p>
        </div>

        {/* Col 2 */}
        <div className="col2">
            <h3><NumberFormat value={price.toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={'$'} /></h3>
            <h4 
            // If change24hr is positive add a + at the beginning and change color to green, else change color to red
            className={ priceDirection === '-' ? 'negative' : 'positive' }>
                { priceDirection !== '-' && '+'}{change24hr.toFixed(2) }%
            </h4>
        </div>

        </div>


        
    );
}

export default CryptoItem;
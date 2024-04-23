// src/contexts/WalletContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

const WalletContext = createContext();

export const useWallet = () => useContext(WalletContext);

export const WalletProvider = ({ children }) => {
    const [userAddress, setUserAddress] = useState(localStorage.getItem('userWalletAddress'));

    useEffect(() => {
        const handleAccountsChanged = (accounts) => {
            if (accounts.length === 0) {
                console.log('Please connect to MetaMask.');
                localStorage.removeItem('userWalletAddress');
                setUserAddress(null);
            } else {
                const account = accounts[0];
                localStorage.setItem('userWalletAddress', account);
                setUserAddress(account);
            }
        };

        if (window.ethereum) {
            window.ethereum.on('accountsChanged', handleAccountsChanged);
        }

        return () => {
            if (window.ethereum) {
                window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
            }
        };
    }, []);

    return (
        <WalletContext.Provider value={{ userAddress, setUserAddress }}>
            {children}
        </WalletContext.Provider>
    );
};

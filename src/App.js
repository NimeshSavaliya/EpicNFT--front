import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import myEpicNFT from './utils/MyEpicNFT.json';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const CONTRACT_ADDRESS = '0x89eEf698f42A9e0dB5ebd393D22e923a0395BB5F';

const App = () => {
   const [currentAccount, setCurrentAccount] = useState(null);

   const checkIfWalletIsConnected = async () => {
      const { ethereum } = window;

      if (!ethereum) {
         console.log('Make sure you have MetaMask!');
         return;
      } else {
         console.log('We have ethereum wallet ====> ', ethereum);
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (!!accounts.length) {
         const account = accounts[0];
         console.log('Found account ====> ', account);
         setCurrentAccount(account);

         setupEventListener();
      } else {
         console.log('No authenticated accounts found');
      }
   };

   const connectWallet = async () => {
      try {
         const { ethereum } = window;

         if (!ethereum) {
            alert('get MetaMask');
            return;
         }

         const accounts = await ethereum.request({
            method: 'eth_requestAccounts',
         });

         console.log('Connected ====> ', accounts[0]);

         setCurrentAccount(accounts[0]);
      } catch (error) {
         console.log(error);
      }
   };

   const setupEventListener = async () => {
      try {
         const { ethereum } = window;

         if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const connectedContract = new ethers.Contract(
               CONTRACT_ADDRESS,
               myEpicNFT.abi,
               signer
            );

            connectedContract.on('NewEpicNFTMinted', (from, tokenId) => {
               console.log(from, tokenId.toNumber());
               alert(
                  `Check minted NFT here (It might take some time to display...) : https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()} `
               );
            });
         }
      } catch (error) {
         console.log(error);
      }
   };

   const askContractToMint = async () => {
      try {
         const { ethereum } = window;

         if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const connectedContract = new ethers.Contract(
               CONTRACT_ADDRESS,
               myEpicNFT.abi,
               signer
            );

            console.log('Going to pop wallet to pay gas...');
            let nftTxn = await connectedContract.makeAnEpicNFT();

            console.log('Mining... ');
            await nftTxn.wait();

            console.log(
               `<Mined, see : https://rinkeby.etherscan.io/tx/${nftTxn.hash}  `
            );
         } else {
            console.log('No eth object');
         }
      } catch (error) {
         console.log(error);
      }
   };

   // Render Methods
   const renderNotConnectedContainer = () => (
      <button
         className="cta-button connect-wallet-button"
         onClick={connectWallet}
      >
         Connect to Wallet
      </button>
   );

   useEffect(() => {
      checkIfWalletIsConnected();
   }, []);

   return (
      <div className="App">
         <div className="container">
            <div className="header-container">
               <p className="header gradient-text">My NFT Collection</p>
               <p className="sub-text">
                  Each unique. Each beautiful. Discover your NFT today.
               </p>
               {!currentAccount && renderNotConnectedContainer()}
               {currentAccount && (
                  <button
                     onClick={askContractToMint}
                     className="cta-button connect-wallet-button"
                  >
                     Mint NFT
                  </button>
               )}
            </div>
            <div className="footer-container">
               <img
                  alt="Twitter Logo"
                  className="twitter-logo"
                  src={twitterLogo}
               />
               <a
                  className="footer-text"
                  href={TWITTER_LINK}
                  target="_blank"
                  rel="noreferrer"
               >{`built on @${TWITTER_HANDLE}`}</a>
            </div>
         </div>
      </div>
   );
};

export default App;

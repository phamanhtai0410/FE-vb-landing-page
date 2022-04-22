import Web3 from 'web3/dist/web3.min.js'

const getWeb3 = async () => {

    let web3;
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    if (window.ethereum) {
        try {
            web3 = new Web3(window.ethereum);
        } catch (error) {
            console.error(error);
        }

    }
    // Legacy dapp browsers...
    else if (window.web3) {
        // Use Mist/MetaMask's provider.
        web3 = window.web3;
        console.log('Injected web3 detected.');
    }
    
    // Fallback to localhost; use dev console port by default...
    else {
        const provider = new Web3.providers.HttpProvider('http://127.0.0.1:8545');
        web3 = new Web3(provider);

        console.log('No web3 instance injected, using Local web3.');

    }


    return web3;
};

export default getWeb3;
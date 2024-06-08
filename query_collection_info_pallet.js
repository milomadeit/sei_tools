//? updated Pallet API for SEI V2

async function queryCollectionInfo(contracAddress) {
    const { default: fetch } = await import('node-fetch');
    const url = `https://api.pallet.exchange/api/v2/nfts/${contracAddress}/details`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch collection info: ${response.statusText}`);
        }
        const data = await response.json();
        return data; 
    } catch (error) {
        console.error('There was an error fetching the collection info:', error);
        throw error; 
    }
}
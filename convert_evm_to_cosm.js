// IMPORT WALLETS OR PROVIDE A LIST IN THE WALLETS ARRAY
const fs = require('fs');
const csv = require('csv-parser');
const { rejects } = require('assert');

// const wallets = ["0xWalletAddresses"];

async function csvToArray(filePath) {
	return new Promise((resolve, reject) => {
		const results = []
		fs.createReadStream(filePath)
			.pipe(csv())
			.on('data', (data) => results.push(data.addresses)) 
			.on('end', () =>  {
				resolve(results);
			})
			.on('error', (error) => {
				reject(error)
			})
	})

}

async function GetWallets(wallets) {

    const sei_wallets = ["addresses"];

	try {
		for (const wallet of wallets) {
			const request = await fetch(`https://v2.seipex.fi/convert-address?address=${wallet}`);
			const data = await request.json();

			if (typeof (data.addresses) !== 'undefined') {
				const sei_wallet = data.addresses.cosmos;
		
				sei_wallets.push(sei_wallet);

			}
		}	
	
		// console.log(evm_wallets);
		fs.writeFile('sei_wallets.csv', sei_wallets.join(',\n'), (err) => {
			if (err) throw err;
			console.log('The wallets hav been saved to sei_wallets.csv!');
			//file written successfully
		  });
		  
		// fs.appendFileSync('somefile.txt', sei_wallets.join(' '));
		return sei_wallets;

	}

	catch (error) {
		console.log(error)
	}

}

async function main() {
    try {
        const walletsArray = await csvToArray('./evm.csv');
		console.log("CSV converted into array. Querying SEI wallets!")
        await GetWallets(walletsArray);
    } catch (error) {
        console.log('Error:', error);
    }
}


main();
// IMPORT WALLETS OR PROVIDE A LIST IN THE WALLETS ARRAY
const fs = require('fs');
const csv = require('csv-parser');
const { rejects } = require('assert');

// const wallets = ["seiWalletAddresses"];

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

    const evm_wallets = ["addresses"];

	try {
		for (const wallet of wallets) {
			const request = await fetch(`https://v2.seipex.fi/convert-address?address=${wallet}`);
			const data = await request.json();

			if (typeof (data.addresses) !== 'undefined') {
				const evm_wallet = data.addresses.evm;
		
				evm_wallets.push(evm_wallet);

			}
		}	
	
		// console.log(evm_wallets);
		fs.writeFile('evm_wallets.csv', evm_wallets.join(',\n'), (err) => {
			if (err) throw err;
			console.log('The wallets hav been saved to evm_wallets.csv!');
			//file written successfully
		  });
		  
		// fs.appendFileSync('somefile.txt', evm_wallets.join(' '));
		return evm_wallets;

	}

	catch (error) {
		console.log(error)
	}

}

async function main() {
    try {
        const walletsArray = await csvToArray('./sei.csv');
		console.log("CSV converted into array. Querying EVM wallets!")
        await GetWallets(walletsArray);
    } catch (error) {
        console.log('Error:', error);
    }
}


main();
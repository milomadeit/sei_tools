const { CosmWasmClient } = require('@cosmjs/cosmwasm-stargate');
const fs = require('fs');



// VALUES TO CHANGE DEPENDING ON QUERY
const rpcEndpoint = 'https://sei-m.rpc.n0ok.net/';/
const excludeAddress = 'sei152u2u0lqc27428cuf8dx48k8saua74m6nql5kgvsu4rfeqm547rsnhy4y9';   // excludes Pallet contract from output
const listOnlyAddresses = true;  
const listAllHolders = true; 
const contractAddress = ""
const startTokenId = 0
const endTokenId = 999
const batchSize = 1000
const collectionName = ""
const filename = "TokenOwners"




async function queryTokenOwners(contractAddress, startTokenId, endTokenId, batchSize, collectionName, filename) {
	const client = await CosmWasmClient.connect(rpcEndpoint);
	let owners = listAllHolders ? [] : new Set();
  
	for (let tokenId = startTokenId; tokenId <= endTokenId; tokenId += batchSize) {
	  const promises = [];
	  for (let id = tokenId; id < tokenId + batchSize && id <= endTokenId; id++) {
		console.log(`Preparing query for token ID ${id}`);
		promises.push(
		  client.queryContractSmart(contractAddress, { owner_of: { token_id: id.toString() } })
			.then(result => {
			  if (result.owner && result.owner !== excludeAddress) {
				if (listOnlyAddresses) {
				  if (listAllHolders) {
					owners.push(result.owner); 
				  } else {
					owners.add(result.owner); 
				  }
				} else {
				  owners[result.owner] = owners[result.owner] || [];
				  owners[result.owner].push(id);
				}
			  }
			})
			.catch(error => {
			  console.error(`Error querying token ID ${id}:`, error.message);
			})
		);
	  }
  
	  await Promise.allSettled(promises);
	  console.log(`Finished querying batch up to token ID ${tokenId + batchSize - 1}`);
	}
  
	let filePrefix = collectionName;
	if (listOnlyAddresses) {
	  filePrefix += '_Unique_Addresses';
	}
	if (listAllHolders) {
	  filePrefix += '_All_Addresses';
	}
  
	const fileName = `${filePrefix}.txt`;
  
	if (listOnlyAddresses) {
	  fs.writeFileSync(fileName, JSON.stringify(listAllHolders ? owners : [...owners], null, 2));
	} else {
	  fs.writeFileSync(fileName, JSON.stringify(owners, null, 2));
	}
	
	return { content: 'Here are the queried owners, unique addresses only:', files: [fileName] }
  }

queryTokenOwners(contractAddress, startTokenId, endTokenId, batchSize, collectionName, filename)
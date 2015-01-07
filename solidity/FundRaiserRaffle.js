//change this contract address to the one you have created!
var contractAddress = '0xe3669d9bb3b06c001e4727bb93c1bb604a28ff71';

function newRaffle() {
	
	var beneficary  = document.querySelector('#beneficary').value;
	var goal        = document.querySelector('#goal').value;
	var deadline    = document.querySelector('#deadline').value;
	var ticketPrice = document.querySelector('#ticketPrice').value;
	var description = document.querySelector('#description').value;
	
	var data = [beneficary, goal, deadline, ticketPrice, description];
	// Which contract function???
	web3.eth.transact({to: contractAddress, data: data, gas: 5000});
}

function buyRaffleTickets(){
	var raffleId = document.querySelector('#raffleId').value;
	var amount = document.querySelector('#amount').value;
	var data = [raffleId, amount];
	// Which contract function???
	web3.eth.transact({value: amount, to: contractAddress, data: data, gas: 5000});
}

function drawRaffle(){
	var raffleId = document.querySelector('#raffleId').value;
	var data = [raffleId];
	// Which contract function???
	web3.eth.transact({to: contractAddress, data: data, gas: 5000});
}

web3.eth.watch().changed(function(){
	web3.eth.block(web3.eth.number).then(function(result){
		document.getElementById('latestBlock').innerText = web3.eth.number._result;
		document.getElementById('latestBlockHash').innerText = result.hash;
		document.getElementById('latestBlockTimestamp').innerText = Date(result.timestamp);
	})
});

/*
w eb3.eth.watch({altered: {at: web3.eth.accounts[0], id: contractAddress}}).changed(function() {
	document.getElementById('owner').innerText = web3.toDecimal(web3.eth.stateAt(contractAddress, web3.eth.owner));
});

web3.eth.watch({altered: {at: web3.eth.nextRaffleId, id: contractAddress}}).changed(function() {
	document.getElementById('nextRaffleId').innerText = web3.toDecimal(web3.eth.stateAt(contractAddress, web3.eth.nextRaffleId));
});
*/
/*
 var receiverAddress = '0x' + document.querySelector('#receiverAddress').value;*
 var amount = document.querySelector('#amount').value;
 
 */


web3.eth.watch({altered: web3.eth.coinbase}).changed(function(){
	web3.eth.coinbase.then(function(result) {
		document.getElementById('coinbase').innerText = result;
	});
	web3.eth.balanceAt(web3.eth.coinbase).then(function(result){
		document.getElementById('balance').innerText = web3.toDecimal(result);;
	});
});

web3.eth.watch().changed(function(){
	web3.eth.block(web3.eth.number).then(function(result){
		document.getElementById('latestBlock').innerText = web3.eth.number._result;
		document.getElementById('latestBlockHash').innerText = result.hash;
		document.getElementById('latestBlockTimestamp').innerText = Date(result.timestamp);
	})
});

//change this contract address to the one you have created!
var contractAddress = '0x0e144aa7d60e4ea0be13cc3f22800ad933cf2cf2';

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
	web3.eth.transact({to: contractAddress, data: data, gas: 5000});
}

function drawRaffle(){
	var raffleId = document.querySelector('#raffleId').value;
	var data = [raffleId];
	// Which contract function???
	web3.eth.transact({to: contractAddress, data: data, gas: 5000});
}

web3.eth.watch({altered: {at: web3.eth.owner, id: contractAddress}}).changed(function() {
	document.getElementById('owner').innerText = web3.toDecimal(web3.eth.stateAt(contractAddress, web3.eth.owner));
});

web3.eth.watch({altered: {at: web3.eth.nextRaffleId, id: contractAddress}}).changed(function() {
	document.getElementById('nextRaffleId').innerText = web3.toDecimal(web3.eth.stateAt(contractAddress, web3.eth.nextRaffleId));
});

/*
 var receiverAddress = '0x' + document.querySelector('#receiverAddress').value;*
 var amount = document.querySelector('#amount').value;
 
 */
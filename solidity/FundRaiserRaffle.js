//change this contract address to the one you have created!
var contractAddress = '0x83dc4b84fcccfd7c14a7d7bfdaac2b14742f5b7e';

var contractInterface = [
	{ "name": "shutdown",
		"inputs" :[],
		"outputs":[]
	},
	{ "name": "kill",
		"inputs" :[],
		"outputs":[]
	},
	{ "name": "newRaffle",
		"inputs" :[
		{"name": "beneficary", 	 "type":"address"}
		,{"name": "goal", 		 "type":"uint"}
		,{"name": "deadline", 	 "type":"uint"}
		,{"name": "ticketPrice", "type":"uint"}
		,{"name": "description", "type":"uint"}],
		"outputs":[
		{"name": "raffleId", 	 "type":"string32"}]
	},
	{ "name": "buyRaffleTickets",
		"inputs" :[
		{"name": "raffleId", 	 "type":"uint"}],
		"outputs":[
		{"name": "lastTicket", 	 "type":"uint"}]
	},
	{ "name": "drawRaffle",
		"inputs" :[
		{"name": "raffleId", 	 "type":"uint"}],
		"outputs":[
		{"name": "paidOut", 	 "type":"bool"}
		]
	}
];

var raffleContract = web3.contract(contractAddress, contractInterface);

function newRaffle() {
	
	var beneficary  = document.querySelector('#beneficary').value;
	var goal        = document.querySelector('#goal').value;
	var deadline    = document.querySelector('#deadline').value;
	var ticketPrice = document.querySelector('#ticketPrice').value;
	var description = document.querySelector('#description').value;
	
	//What about gas?
	raffleContract.newRaffle(beneficary, goal, deadline, ticketPrice, description).call().then(function(res) {
		var option = document.createElement('option');
		option.value = res[0];
		option.text  = res[0];
		document.getElementById('raffleId').add(option, null);
	});
}

function buyRaffleTickets(){
	var raffleId = document.querySelector('#raffleId').value;
	var amount   = document.querySelector('#amount').value;

	//What about gas?
	raffleContract.buyRaffleTickets(raffleId, amount).call().then(function(res) {
		document.getElementById('lastTicketIdId').innerText = res[0];
	});
}

function drawRaffle(){
	var raffleId = document.querySelector('#raffleId').value;
	//What about gas?
	raffleContract.buyRaffleTickets(raffleId).call().then(function(res) {
		document.getElementById('paidOut').innerText = res[0];
	});
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

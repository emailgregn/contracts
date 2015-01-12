//change this contract address to the one you have created!
var contractAddress = '0xdc319d5a0e227f037975f5ac5e6a29ed64ddd208';

var contractInterface = [
	{ "name": "mint",
		"inputs" :[
			{"name": "owner", 	 "type":"address"}
			,{"name": "amount", 	 "type":"uint"}],
		"outputs":[
			{"name": "balance", "type":"uint"}]
	},
	{ "name": "send",
		"inputs" :[
			{"name": "receiver", 	 "type":"address"}
			,{"name": "amount", 	 "type":"uint"}],
		"outputs":[
			{"name": "balance", "type":"uint"}]
	},
	{ "name": "queryBalance",
		"inputs" :[
			{"name": "addr", 	 "type":"address"}],
		"outputs":[
			{"name": "balance", "type":"uint"}]
	}
];

var ccyContract = web3.contract(contractAddress, contractInterface);

function mint(){
	var owner  = document.querySelector('#owner').value;
	var amount = document.querySelector('#amount').value;	

	ccyContract.mint(owner, amount).call().then(function(res) {
		var r = res[0];
		debugger;
	});
}
function send(){
	var receiver  = document.querySelector('#receiver').value;
	var amount = document.querySelector('#amount').value;	
	
	ccyContract.send(receiver, amount).call().then(function(res) {
		var r = res[0];
		debugger;
	});
}
function queryBalance(){
	var addr  = document.querySelector('#addr').value;
	
	ccyContract.queryBalance(addr).call().then(function(res) {
		var r = res[0];
		debugger;
	});	
}


web3.eth.watch().changed(function(){
	web3.eth.block(web3.eth.number).then(function(result){
		document.getElementById('latestBlock').innerText = web3.eth.number._result;
		document.getElementById('latestBlockHash').innerText = result.hash;
		document.getElementById('latestBlockTimestamp').innerText = Date(result.timestamp);
	})
});

web3.eth.watch({altered: web3.eth.coinbase}).changed(function(){
	web3.eth.coinbase.then(function(result) {
		document.getElementById('coinbase').innerText = result;
	});
	web3.eth.balanceAt(web3.eth.coinbase).then(function(result){
		document.getElementById('balance').innerText = web3.toDecimal(result);;
	});
});


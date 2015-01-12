contract Coin {
    address minter;
    mapping (address => uint) balances;
    function Coin() {
        minter = msg.sender;
    }
    function mint(address owner, uint amount) returns (uint balance){
        if (msg.sender != minter) 
			return;
        balances[owner] += amount;
		return balances[owner];
    }
    function send(address receiver, uint amount) returns (uint balance){
        if (balances[msg.sender] < amount) 
			return;
        balances[msg.sender] -= amount;
        balances[receiver] += amount;
		return balances[receiver];
    }
    function queryBalance(address addr) constant returns (uint balance) {
        return balances[addr];
    }
}

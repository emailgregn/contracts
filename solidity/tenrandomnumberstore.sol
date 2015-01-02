contract TenRandomNumberStore {
    
	uint SIZE;

	function TenRandomNumberStore(){
		SIZE=10;
	}
    
    mapping(uint => uint[SIZE]) numbersAsAtBlockId;
    
    // Check the numbers are sorted and unique
    function _sanityCheck(uint[SIZE] numbers) returns (bool sane) {
        sane = true;
        for (var idx = 1; idx < SIZE) ; idx++){
            sane = sane && (numbers[idx-1] < numbers[idx]);
        }
        return sane;
    }
    
    // Numbers are only cast in stone once the blockChain.blockId has moved on.
    function setNumbers(uint[SIZE] numbers ) returns (bool accepted) {
        accepted = false;
        // Only accept numbers from this contract's creator
        if (msg.sender = contract.creator){
            var numSet = numbersAsAtBlockId[blockchain.blockId];
            if( _sanityChecked(numbers){
                numbersAsAtBlockId[blockChain.blockId] = numbers;
                accepted = true;
            }
        }
    }

    // Only reports numbers for past blockChain.blockIds
    function getNumbers(uint blockId) const returns (uint[10] numbers) {
        // Don't work for free
        if(msg.value > 0 && blockId > blockChain.blockId ){
            return numbersAsAtBlockId[blockId]
        }
    }
}





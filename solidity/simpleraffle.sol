contract FundRaiserRaffle {
	// A simple raffle Contract. 
	// Unlimited tickets per raffle.
	// If less than goal is raised by deadline, all tickets are refunded.
	// As many tickets as possible are bought for each contribution.
	// Because of modulo, same ticket could possibly win more than 1 prize.
	// Fund distribution:
	//   Raffle beneficary = 50%
	//   First prize * 1   = 25%
	//   Second prize* 2   = 10%
	//   Third prize * 3   = 1%
	//   Admin fee   * 1   = 2%
	
	struct RaffleData {
		address beneficary;
		string32 description;
		uint raffleFund;
		uint goal;
		uint deadline;
		uint numTickets;
		uint numPrizes;
		uint ticketPrice;
		mapping(uint => Ticket) tickets;
		Winning winning;
	}
	
	struct Ticket {
		address ticketHolder;
		uint purchasePrice;
	}
	
	struct Winning {
		mapping(uint8 => uint) number;
	}
	
	address owner;
	uint nextRaffleId;
	mapping(uint256 => RaffleData) rafflesList;
	
	// Constructor
	function FundRaiserRaffle(){
		owner = msg.sender;
	}
	
	// refund everyone & shutdown
	function shutdown() {
		if (msg.sender == owner) {
			for(var raffleId = 0; raffleId < nextRaffleId; raffleId++){
				_refundTickets(raffleId);
			}
		}
	}
	
	// Crash & burn
	function kill() {
		if (msg.sender == owner) {
			suicide(owner);
		}
	}
	
	// Start a new raffle.
	// TicketPrice must be > 0
	// Goal must be >= 100 otherwise prizes would drop into floats
	// Deadline must be a future blockId
	function newRaffle(address beneficary, uint256 goal, uint256 deadline, uint256 ticketPrice, string32 description) returns (uint id) {
		if (ticketPrice > 0 && goal >= 100 && deadline > block.number ) {
			var raffle = rafflesList[nextRaffleId];
			id = nextRaffleId; // returned arg
			raffle.beneficary = beneficary;
			raffle.description = description;
			raffle.goal = goal;
			raffle.deadline = deadline;
			raffle.ticketPrice = ticketPrice;
			raffle.numPrizes = 6;
			nextRaffleId ++;
		}
	}
	
	// Buy raffle tickets to value of msg.value from raffle with id $(raffleId).
	// Any msg.value modulo just goes into the raffleFund without getting a ticket
	// Future feature : Allow ticketPrice to change during lifetime of raffle.
	function buyRaffleTickets(uint256 raffleId) returns (uint firstTicket, uint lastTicket) {
		var raffle = rafflesList[raffleId];
		if (raffle.ticketPrice == 0) // check for non-existing raffle
			return;
		if( block.number < raffle.deadline) {
			firstTicket = raffle.numTickets;
			raffle.raffleFund += msg.value; 
			for (var i=0; i <= (msg.value/raffle.ticketPrice); i++){ //ToDo double check solidity division symantics, want integer division here.
				var ticket = raffle.tickets[raffle.numTickets]; // nb zero indexed array vs numTickets starting at 1
				ticket.ticketHolder = msg.sender;
				ticket.purchasePrice = (msg.value/raffle.ticketPrice);
				raffle.numTickets++; 
			}if(raffle.deadline < block.number){
				
			}
			lastTicket = raffle.numTickets;
		} else {
			// Deadline has passed, don't sell tickets
			// throw an error so msg.value is not accepted
			return;
		}
	}
	
	// Returns a list of unique winning ticketNumbers
	// ToDo: ask a specialist random number contract to help
	function _drawRaffleWinners(uint raffleId, uint fee) returns (bool success) {
		var raffle = rafflesList[raffleId];
		if (raffle.deadline < block.number) {
		/*
			winningNumbers = TenRandomNumberStore.send(value=fee, // split the admin fee with TenRandomNumberStore
												gas=5000, 
												data=[raffle.deadline, raffle.numPrizes]);
											);
		*/

			Winning win = raffle.winning;
			win.number[0] = 123;
			win.number[1] = 234;
			win.number[2] = 345;
			win.number[3] = 456;
			win.number[4] = 567;
			win.number[5] = 678;
			success = true;
		} else {
			success = false;
		}
	}
	
	function _refundTickets(uint raffleId) {
		var raffle = rafflesList[raffleId];
		for (var idx = 0; idx < raffle.numTickets; idx ++){
			var ticket = raffle.tickets[idx]; // nb zero indexed array vs numTickets starting at 1
			ticket.ticketHolder.send(ticket.purchasePrice);
			raffle.raffleFund -= ticket.purchasePrice;
			delete raffle.tickets[idx];
		}
		// Leftovers (modulo ticketprice rounding errors) to contract owner
		address(this).send(raffle.raffleFund);
		
		raffle.beneficary.send(0); // Send them a "it's over" message
	}
	
	// Because of modulo, same ticket could win twice.
	function drawRaffle(uint256 raffleId) returns(bool paidOut) {
		paidOut = false;
		var raffle = rafflesList[raffleId];
		if (raffle.deadline < block.number) { 
			if(raffle.raffleFund >= raffle.goal){		
				if( _drawRaffleWinners(raffleId, (raffle.raffleFund * 0.01)) && 
					raffle.winning.number[1] > 0) { // Make sure there were random numbers returned. [0] can be zero but [1] can't ever
					
					uint benefit    = raffle.raffleFund * 0.50;
					uint firstPrize = raffle.raffleFund * 0.25;
					uint secondPrize= raffle.raffleFund * 0.10;
					uint thirdPrize = raffle.raffleFund * 0.01;
					
					raffle.beneficary.send(benefit);
					raffle.raffleFund -= benefit;
					//1 x 1st
					raffle.tickets[raffle.winning.number[1] % raffle.numTickets].ticketHolder.send(firstPrize);
					raffle.raffleFund -= firstPrize;
					//2 x 2nd
					raffle.tickets[raffle.winning.number[2] % raffle.numTickets].ticketHolder.send(secondPrize);
					raffle.raffleFund -= secondPrize;
					raffle.tickets[raffle.winning.number[3] % raffle.numTickets].ticketHolder.send(secondPrize);
					raffle.raffleFund -= secondPrize;
					// 3 x 3rd
					raffle.tickets[raffle.winning.number[4] % raffle.numTickets].ticketHolder.send(thirdPrize);
					raffle.raffleFund -= thirdPrize;
					raffle.tickets[raffle.winning.number[5] % raffle.numTickets].ticketHolder.send(thirdPrize);
					raffle.raffleFund -= thirdPrize;
					raffle.tickets[raffle.winning.number[6] % raffle.numTickets].ticketHolder.send(thirdPrize);
					raffle.raffleFund -= thirdPrize;
					
					// Leftovers (1%) to contract owner
					address(this).send(raffle.raffleFund); //ToDo API syntax
					raffle.raffleFund = 0;
					
					// Cleanup
					for (var idx = 0; idx < raffle.numTickets; idx ++){
						var ticket = raffle.tickets[idx]; // nb zero indexed array vs numTickets starting at 1
						delete raffle.tickets[idx];
					}
					delete raffle;
					paidOut = true;
				} else {
					// random number service couldn't provide numbers for blockId=deadline
					_refundTickets(raffleId);
					delete raffle;
					paidOut = true;
				}
			} else {
				// Goal not reached, refund tickets
				_refundTickets(raffleId);
				delete raffle;
				paidOut = true;
			}
		} else {
			// deadLine not passed
			paidOut = false;
		}
	}
}
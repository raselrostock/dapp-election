pragma solidity ^0.4.20;

contract Election{
	// Model the Candidate
	struct Candidate{
		uint id;
		string name;
		uint voteCount;
	}
	
	// Mapping the Candidate
	// @input uint
	// @return Candidate Model

	mapping( uint => Candidate ) public candidates;

	// Mapping the Voters
	// @input voter address
	// @return true or false as for voted

	mapping( address=> bool) public voters;


	// Count the total candidates
	// default value is 0
	uint public candidateCount;
	//Constractor 

	//Create Event for notify the vote
	// input a indexed local id
	event voteEvent(
		uint indexed _candidateId
		);

	function Election() public{
		// Add Candidate 1
		addCandidate( "Candidate 1" );
		//Add Candidate 2
		addCandidate( "Candidate 2" );
	}

	// Add the candidates
	function addCandidate( string _name ) private{
		candidateCount++;
		//Inserted the Candidates
		candidates[candidateCount] = Candidate( candidateCount, _name, 0);
	}

	function Vote( uint _candidateId ) public{

		//Check the voter already vote 
		// if yes no more execution
		require(!voters[msg.sender]);

		//Check the Invalid candidate 
		// if yes no more execution
		require( _candidateId >0 && _candidateId <= candidateCount);

		// set the voter voted
		voters[msg.sender] =true;

		//Increase the Candidate vote
		candidates[_candidateId].voteCount++;
		emit voteEvent(_candidateId);
	}
}
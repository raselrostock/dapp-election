pragma solidity ^0.4.20;

contract Election{
	// Model the Candidate
	struct Candidate{
		uint id;
		string name;
		uint voteCount;
	}
	// Mapping the Candidate
	mapping( uint => Candidate ) public candidates;

	mapping( address=> bool) public voters;
	// Count the total candidates
	// default value is 0
	uint public candidateCount;
	//Constractor 
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
		require(!voters[msg.sender]);
		require( _candidateId >0 && _candidateId <= candidateCount);
		voters[msg.sender] =true;
		candidates[_candidateId].voteCount++;
	}
}
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
	// Count the total candidates
	// default value is 0
	uint public candidateCount;
	//Constractor 
	function Election() public{
		addCandidate( "Candidate 1" );
		addCandidate( "Candidate 2" );
	}
	// Add the candidates
	function addCandidate( string _name ) private{
		candidateCount++;
		candidates[candidateCount] = Candidate( candidateCount, _name, 0);

	}
}
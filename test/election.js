var Election = artifacts.require("./Election.sol");

contract('Election',function(accounts){

	//Variable Initialize
	var electioninstance;
	// Test Case: candidateCount 
	it("Check candidateCount is right",function(){
		return Election.deployed().then(function(instance){
			return instance.candidateCount();
		}).then(function(count){
			assert.equal(count.toNumber(),2);
		});
	});

	//Test Case: Valid Candidate Data
	
	it("Valid Candidate Data",function(){
		return Election.deployed().then(function(instance){
			electioninstance = instance;
			return electioninstance.candidates(1);
		}).then(function(candidate){
			 assert.equal(candidate[0].toNumber(),1, "Id");
			 assert.equal(candidate[1].toString(),'Candidate 1', "Name");
			 assert.equal(candidate[2].toNumber(),0, "voteCount");
			 return electioninstance.candidates(2);
		}).then(function(candidate){
			 assert.equal(candidate[0].toNumber(),2, "Id");
			 assert.equal(candidate[1].toString(),'Candidate 2', "Name");
			 assert.equal(candidate[2].toNumber(),0, "voteCount");
		});
	});


});
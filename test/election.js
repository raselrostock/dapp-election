var Election = artifacts.require("./Election.sol");

contract('Election',function(accounts){

	//Variable Initialize
	var electioninstance;
	var candidateId;
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

	it("allows a voter to cast a vote",function(){
		return Election.deployed().then(function(instance){
			electioninstance = instance;
			candidateId =1;
			return electioninstance.Vote( candidateId, {from:accounts[0]});
		}).then(function(receipt){
			return electioninstance.voters(accounts[0]);
		}).then(function(voted){
			assert(voted,"The voter marked as voted");
			return electioninstance.candidates(candidateId);
		}).then(function(candidate){
			assert.equal(candidate[2].toNumber(),1,"increments the candidate's vote count");
		});
	});
	it("throws an exception for invalid candiates",function(){
		return Election.deployed().then(function(instance){
			electioninstance = instance;
			return electioninstance.Vote( 99, {from:accounts[1]});
		}).then(assert.fail).catch(function(error){
			assert(error.message.indexOf('revert')>=0,'Invalid candidate');
			return electioninstance.candidates(1);
		}).then(function(candidate1){
			assert.equal(candidate1[2].toNumber(),1,"candidate 1 did not receive any votes");
			return electioninstance.candidates(2);
		}).then(function(candidate2){
			assert.equal(candidate2[2].toNumber(),0,"candidate 2 did not receive any votes");
		});
	});

	it("Verify the voter vote once",function(){
		return Election.deployed().then(function(instance){
			electioninstance= instance;
			candidateId =2;
			return electioninstance.Vote(candidateId,{from:accounts[0]});
		}).then(assert.fail).catch(function(error){
			assert(error.message.indexOf('revert')>=0 ,"Already voted");
			return electioninstance.candidates(1);
		}).then(function(candidate1){
			assert.equal(candidate1[2].toNumber(),1,"candidate 1 did not receive any votes");
			return electioninstance.candidates(2);
		}).then(function(candidate2){
			assert.equal(candidate2[2].toNumber(),0,"candidate 2 did not receive any votes");
		});
			
	});


});
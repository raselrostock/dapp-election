App= {
   //Variable Initialization
   web3Provider: null,
   contracts: {},
   account: '0x0',

   init: function(){
      return App.initWeb3();
   },

   initWeb3: function(){
      if( typeof web3 !== 'undefined' ){
          App.web3Provider = web3.currentProvider;
          web3 = new Web3( web3.currentProvider );
      }
      else{
          App.web3Provider = new Web3.providers.HttpProvider( 'http://localhost:7545' );
          web3 = new Web3( App.web3Provider );
      }
      return App.initContract();
   },

   initContract: function(){
      $.getJSON('Election.json' , function(election){
        //Instantiate a Truffle Contract from artifacts
          App.contracts.Election = TruffleContract(election);
        // Set the current provider 
          App.contracts.Election.setProvider( App.web3Provider );
          return App.rander();
      });
   },

   rander: function(){
      var electionInstance;
      var loader = $('#loader' );
      var content = $('#content');
      loader.show();
      content.hide();
      // Set the accounts
      web3.eth.getCoinbase(function(err,account){
          if( err === null ){
              App.account= account;
              $('#accountAddress').html( " Your account: "+ App.account);
          }
      });

      App.contracts.Election.deployed().then(function(instance){
          electionInstance = instance;
          return electionInstance.candidateCount();
        }).then(function(candidateCount){
              var candidatesResults= $('#candidatesResults');
              candidatesResults.empty();
              var candidatesSelect=$('#candidatesSelect');
              candidatesSelect.empty();
              for( var i=1; i <= candidateCount; i++){
                  electionInstance.candidates(i).then(function(candidate){
                      var contentTemplate = "<tr><th>"+candidate[0]+"</th><td>"+candidate[1]+"</td><th>"+candidate[2]+"</td></tr>"
                      candidatesResults.append(contentTemplate);
                      var candidateOption = "<option value='" + candidate[0] + "' >" + candidate[1] + "</ option>"
                      candidatesSelect.append(candidateOption);
                  });
              }
            return electionInstance.voters(App.account);
      }).then(function(hasVoted){
          if(hasVoted){
            $('form').hide();
          }
            loader.hide();
            content.show();
      }).catch(function(error){
          console.warn(error);
      });
      
   },
   castVote: function(){
      var candidateId=$('#candidatesSelect').val();
      App.contracts.Election.deployed().then(function(instance){
          return instance.Vote(candidateId, {from:App.account});
      }).then(function(result){
          $('#loader' ).show();
          $('#content' ).hide();
      }).catch(function(err){
          console.error(err);
      });
   }
};

$(function(){
    $(window).load(function(){
        App.init();
    });
});
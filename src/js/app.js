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
      $.getJSON('Election' , function(election){
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
      var candidatesResults= $('#candidatesResults');
      candidatesResults.empty();
      App.contracts.Election.deployed().then(function(instance){
          electionInstance = instance;
          return electionInstance.candidateCount();
        }).then(function(candidateCount){
              for( var i=1; i <= candidateCount; i++){
                  electionInstance.candidates(i).then(function(candidate){
                      var contentTemplate = "<tr><th>"+candidate[0]+"</th><td>"+candidate[1]+"</td><th>"+candidate[2]+"</td></tr>"
                      candidatesResults.append(contentTemplate);
                  });
              }
           loader.hide();
           content.show();

      }).catch(function(error){
          console.warn(error);
      });
      
   }
};

$(function(){
    $(window).load(function(){
        App.init();
    });
});
App = {
  //Variable Initialize
  web3Provider: null,
  contracts:{},
  account: '0x0',

  init: function(){
    return App.initWeb3();
  },

  initWeb3: function(){
    //Set the provider
    if( typeof web3 !== 'undefined'){
        App.web3Provider = web3.currentProvider;
        web3 = new Web3(web3.currentProvider);
    }
    else{
        App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function(){
    $.getJSON('Election.json', function(election){
      //Instantiate a new instance of TruffleContract from artifacts
        App.contracts.Election = TruffleContract(election);
        //Set the provider to instance
        App.contracts.Election.setProvider(App.web3Provider);
        return App.rander();
    });
  },

  rander: function(){
     var electioninstance;
     var loader= $('#loader');
     var content = $('#content');
     loader.show();
     content.hide();
     // Get the account
     web3.eth.getCoinbase(function(err, account){
          if(err === null){
            App.account = account;
            $('#accountAddress').html('Your Account: '+ App.account);
          }
     });
     var candidatesResults = $('#candidatesResults');
     candidatesResults.empty();
     App.contracts.Election.deployed().then(function(instance){
          electioninstance = instance;
          return electioninstance.candidateCount();
     }).then(function(candidateCount){
          for(var i=1; i <= candidateCount; i++ )
          {
            electioninstance.candidates(i).then(function(candidate){
                var contentTemplate = '<tr><th>'+candidate[0]+'</th><td>'+candidate[1]+'</td><td>'+candidate[2]+'</td></tr>';
                candidatesResults.append(contentTemplate);
            });
          }
          loader.hide();
          content.show();
     });

  }
};

$(function(){
  $(window).load(function(){
    App.init();
  });
});
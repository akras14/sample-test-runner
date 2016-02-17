var tests = require('../test/spec.js').tests;
var Ractive = require('ractive');

var testStatus = ["Not Running Yet", "Running", "Passed", "Failed"];
var WAITING = 0;
var RUNNING = 1;
var PASSED = 2;
var FAILED = 3;
//Initialize view
var ractive = new Ractive({
  el: '#container',
  template: '#markup',
  data: {
    tests: tests.map(function(test){
      test.status = testStatus[WAITING];
      return test;
    }),
    running: 0,
    pass: 0,
    fail: 0
  },
  computed: {
    allTestsAreDone: function(){
      var passed = this.get('pass');
      var failed = this.get('fail');
      var tests = this.get('tests');
      return passed + failed === tests.length;
    },
    allTestsPassed: function(){
      var passed = this.get('pass');
      var tests = this.get('tests');
      return passed === tests.length;
    }
  }
});

ractive.on('startTest', function(event, test){

  //Increment running count
  ractive.add('running');
  //Update test status
  test.status = testStatus[RUNNING];
  ractive.update('tests');

  test.run(function(result){
    //Decrement running count
    ractive.subtract('running');

    //Update test result and status
    if(result){
      test.status = testStatus[PASSED];
      ractive.add('pass');
    } else {
      test.status = testStatus[FAILED];
      ractive.add('fail');
    }
    ractive.update('tests');
  })
});

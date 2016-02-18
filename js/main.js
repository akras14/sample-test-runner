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
      test.disabled = false;
      return test;
    }),
  },
  computed: {
    running: function(){
      var tests = this.get('tests');
      return getCount(tests, RUNNING);
    },
    pass: function(){
      var tests = this.get('tests');
      return getCount(tests, PASSED);
    },
    fail: function(){
      var tests = this.get('tests');
      return getCount(tests, FAILED);
    },
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

function runTest(test){
  //Update test status
  test.status = testStatus[RUNNING];
  test.disabled = true;
  ractive.update('tests');

  test.run(function(result){

    //Update test result and status
    if(result){
      test.status = testStatus[PASSED];
    } else {
      test.status = testStatus[FAILED];
    }
    ractive.update('tests');
  })
}

function getCount(tests, statusIndex){
  var count = 0;
  if(!ractive){
    return count;
  }
  tests.forEach(function(test){
    if(test.status === testStatus[statusIndex]){
      count++;
    }
  });
  return count;
}

ractive.on('startTest', function(event, test){
  runTest(test);
});

ractive.on('startAll', function(){
  tests.forEach(function(test){
    runTest(test);
  });
});

var myApp = angular.module('myApp');
var date = new Date();
var personalCount = 0;
var driverCount = 0;
var vehCount = 0;
var covCount = 0;
var covType = "";
var covPremium = "";

myApp.controller('zipcodeCtrl', function($scope,$http, myService) {
  console.log("inside");
    var vm = $scope;
    vm.user = {};
 
    vm.getZipData = function(zipCode) {
      var isValidZip = /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(zipCode);
    console.log(isValidZip);
    console.log(zipCode);
      if ( isValidZip ) {
          vm.zipCodeValid = true;
          var url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + zipCode;
          $http.get(url).then(function(res) {
              var city = res.data.results[0].address_components[1].long_name;
              console.log(city);
      
              for (var i = 0; i < 10; i++){
                  var stateorcounty = res.data.results[0].address_components[i].types[0];
                  console.log(stateorcounty);
                  if (stateorcounty == "administrative_area_level_1") {
                    var state = res.data.results[0].address_components[i].long_name;
                    i = 10;
                  }
              }
          //var state = res.data.results[0].address_components[2].long_name;
             myService.set(zipCode,state,city);
             console.log(state);
          }, function(res) {
                console.log("Failed getting data from Google");
        });
      } else {
        vm.zipCodeValid = false;
      }
    }
 
    vm.$watch('user.zipCode', function() {
      vm.getZipData(vm.user.zipCode);
    });
 
  });


myApp.factory('myService', function() {
 var savedZipcode = {};
 var savedState = {};
 var savedCity = {};
 
 function set(zipcode,state,city) {
   savedZipcode = zipcode;   
   savedState = state;
   savedCity = city;
   console.log("savedZipcode :" +savedZipcode + "savedState :" +savedState + "savedCity :" +savedCity);
 }
 function getsavedZipcode() {
  return savedZipcode;
 }
  function getsavedState() {
  return savedState;
 }
  function getsavedCity() {
  return savedCity;
 }

 return {
  set: set,
  getsavedZipcode: getsavedZipcode,
  getsavedState: getsavedState,
  getsavedCity: getsavedCity
 }

});



myApp.controller('nextPageCtrl', ['$scope', '$http', '$location', '$routeParams', 'myService', function($scope, $http, $location, $routeParams, myService){
  console.log("nextPageCtrl");

    $scope.goToPersonalDetail = function(){
    window.location.href='#/personal_details';
    console.log("#/personal_details" + date.getSeconds() + " " + date.getMilliseconds());
  }
}]);


myApp.controller('nextPageCtrl2', ['$scope', '$http', '$location', '$routeParams', 'myService', 'personalService', function($scope, $http, $location, $routeParams, myService, personalService){
  console.log("nextPageCtrl2");
  $scope.personal = {};
  $scope.personal.city = myService.getsavedCity();
  $scope.personal.zip = myService.getsavedZipcode();
  $scope.personal.state = myService.getsavedState();
  if (personalCount > 0)
  {
      $scope.personal.firstText = personalService.getsavedFirstText();
      $scope.personal.mi = personalService.getsavedMi();
      $scope.personal.lastText = personalService.getsavedLastText();
      $scope.personal.suffix = personalService.getsavedSuffix();
      $scope.personal.address = personalService.getsavedAddress();
      $scope.personal.aptunit = personalService.getsavedAptunit();
      $scope.personal.dob = personalService.getsavedDob();
      $scope.personal.email = personalService.getsavedEmail();
      $scope.personal.phone = personalService.getsavedPhone();
  }
    $scope.goToDriverDetail = function(){
      var firsttext = $scope.personal.firstText;
      var mi = $scope.personal.mi;
      var lasttext = $scope.personal.lastText;
      var suffix = $scope.personal.suffix;
      var address = $scope.personal.address;
      var aptunit = $scope.personal.aptunit;
      var dob = $scope.personal.dob;
      var email = $scope.personal.email;
      var phone = $scope.personal.phone;
      console.log("firsttext : " + firsttext);
      personalService.set(firsttext,mi,lasttext,suffix,address,aptunit,dob,email,phone);

      console.log("goToDriverDetail");
  if (personalCount > 0)
  {
    var id = personalCount;
    $http.put('/api/personalUpdate/'+id, $scope.personal).success(function(response){
      console.log("api/personalUpdate");
      window.location.href='#/driver_details';
    });
  }
  else
  {
    $http.post('/api/personal', $scope.personal).success(function(response){
        var datei = new Date();
        console.log("personal success " + datei.getSeconds() + " " + datei.getMilliseconds());
        window.location.href='#/driver_details';

      });
  }
  }
  console.log("nextPageCtrl2" + date.getSeconds() + " " + date.getMilliseconds());
}]);

myApp.controller('nextPageCtrl3', ['$scope', '$http', '$location', '$routeParams', '$window', 'myService', 'personalService', 'driverService', function($scope, $http, $location, $routeParams, $window, myService, personalService, driverService){
  console.log("nextPageCtrl3");
  
    $scope.driver = {};
    if (driverCount > 0)
    {
        $scope.driver.firstText = driverService.getsavedFirstText();
        $scope.driver.mi = driverService.getsavedMi();
        $scope.driver.lastText = driverService.getsavedLastText();
        $scope.driver.suffix = driverService.getsavedSuffix();
        $scope.driver.dob = driverService.getsavedDob();
        $scope.driver.maritalstatus = driverService.getsavedMaritalstatus();
        $scope.driver.licstate = driverService.getsavedLicState();
        $scope.driver.accident = driverService.getsavedAccident();
        $scope.driver.age = driverService.getsavedAge();
    }

    $scope.goToVehDetail = function(){
      var firsttext = $scope.driver.firstText;
      var mi = $scope.driver.mi;
      var lasttext = $scope.driver.lastText;
      var suffix = $scope.driver.suffix;
      var dob = $scope.driver.dob;
      var maritalstatus = $scope.driver.maritalstatus;
      var licstate = $scope.driver.licstate;
      var accident = $scope.driver.accident;
      var age = $scope.driver.age;
      driverService.set(firsttext,mi,lasttext,suffix,dob,maritalstatus,licstate,accident,age);

    if (driverCount > 0)
    {
      var id = driverCount;
      $http.put('/api/driverUpdate/'+id, $scope.driver).success(function(response){
        console.log("api/driverUpdate");
        window.location.href='#/veh_details';
      });
    }
    else
    {
    $http.post('/api/driver', $scope.driver).success(function(response){
        $scope.date = new Date();
        console.log("driver success " + $scope.date);
        window.location.href='#/veh_details';

      });
    }
  }
     
    $scope.goBackToPerDetail = function(){
      personalCount = personalCount + 1;
      window.history.back();
    }
}]);

myApp.controller('nextPageCtrl4', ['$scope', '$http', '$location', '$routeParams', '$window', 'myService', 'personalService', 'vehService', function($scope, $http, $location, $routeParams, $window, myService, personalService, vehService){
  console.log("nextPageCtrl4");
  $scope.vehicle = {};
   $scope.changedValue = function () {
    if ($scope.vehicle.park == "yes")
    {
        $scope.vehicle.address = personalService.getsavedAddress();
    } 
    else if ($scope.vehicle.park == "no")
    {
        $scope.vehicle.address = "";
    }
   }

    if (vehCount > 0)
    {
        $scope.vehicle.year = vehService.getsavedYear();
        $scope.vehicle.make = vehService.getsavedMake();
        $scope.vehicle.model = vehService.getsavedModel();
        $scope.vehicle.series = vehService.getsavedSeries();
        $scope.vehicle.custom = vehService.getsavedCustom();
        $scope.vehicle.primary = vehService.getsavedPrimary();
        $scope.vehicle.loan = vehService.getsavedLoan();
        $scope.vehicle.device = vehService.getsavedDevice();
        $scope.vehicle.park = vehService.getsavedPark();
        $scope.vehicle.address = vehService.getsavedAddress();
    }


    $scope.goToCovDetail = function(){
      console.log("goToCovDetail");
      var year = $scope.vehicle.year;
        var make = $scope.vehicle.make;
        var model = $scope.vehicle.model;
        var series = $scope.vehicle.series;
        var custom =  $scope.vehicle.custom;
        var primary = $scope.vehicle.primary;
        var loan = $scope.vehicle.loan;
        var device = $scope.vehicle.device;
        var park = $scope.vehicle.park;
        var address = $scope.vehicle.address;
        vehService.set(year,make,model,series,custom,primary,loan,device,park,address);

      if (vehCount > 0)
      {
        var id = vehCount;
        $http.put('/api/vehicleUpdate/'+id, $scope.vehicle).success(function(response){
          console.log("api/vehicleUpdate");
          covCount = covCount + 1;
          window.location.href='#/cov_details';
        });
      }
      else
      {
      $http.post('/api/vehicle', $scope.vehicle).success(function(response){
          $scope.date = new Date();
          console.log("vehicle success " + $scope.date);
          covCount = covCount + 1;
          window.location.href='#/cov_details';

        });
      }
    
  }
    $scope.goBackToDrvDetail = function(){
      driverCount = driverCount + 1;
      window.history.back();
    }
}]);



myApp.controller('nextPageCtrl5', ['$scope', '$http', '$location', '$routeParams', '$window', 'myService',  function($scope, $http, $location, $routeParams, myService){
    console.log("nextPageCtrl5");



}]);


myApp.controller('bslctoptCntrl', ['$scope', '$http', '$location', '$routeParams', '$window', 'myService', 'bcovService', 'personalService',  function($scope, $http, $location, $routeParams, $window, myService, bcovService, personalService){
   
  $scope.coverage = {};

  $scope.coverage.type = "Basic";

  $scope.bipdval = [ 
    {cov : "BI: $500 / $1000 & PD: $500", val : 60}, 
    {cov : "BI: $1000 / $1500 & PD: $1000", val : 70}, 
    {cov : "BI: $1500 / $2000 & PD: $1500", val : 80}, 
    {cov : "BI: $2000 / $2500 & PD: $2000", val : 90}];

 $scope.pipval = [ 
    {cov : "$500 Limit, $0 Deductible", val : 66}, 
    {cov : "$1000 Limit, $500 Deductible", val : 77}, 
    {cov : "$1500 Limit, $1000 Deductible", val : 88}, 
    {cov : "$2000 Limit, $1500 Deductible", val : 99}]; 

 $scope.umbival = [ 
    {cov : "$500 / $1000 includes supplemental", val : 33}, 
    {cov : "$1000 / $1500 includes supplemental", val : 55}, 
    {cov : "$1500 / $2000 includes supplemental", val : 77}, 
    {cov : "$2000 / $2500 includes supplemental", val : 99}];

 $scope.compval = [ 
    {cov : "$100 deductible", val : -0.023}, 
    {cov : "$200 deductible", val : -0.035}, 
    {cov : "$300 deductible", val : -0.045}, 
    {cov : "$400 deductible", val : -0.055}];  

 $scope.collval = [ 
    {cov : "$100 deductible", val : -0.025}, 
    {cov : "$200 deductible", val : -0.035}, 
    {cov : "$300 deductible", val : -0.045}, 
    {cov : "$400 deductible", val : -0.055}]; 

  if (covCount > 1)
    {
        $scope.coverage.bipd = bcovService.getsavedBipd();
        $scope.coverage.pip = bcovService.getsavedPip();
        $scope.coverage.umbi = bcovService.getsavedUmbi();
        $scope.coverage.comp = bcovService.getsavedComp();
        $scope.coverage.coll = bcovService.getsavedColl();
    }
  else 
    {
        $scope.coverage.bipd = $scope.bipdval[0].val; 
        $scope.coverage.pip = $scope.pipval[0].val; 
        $scope.coverage.umbi = $scope.umbival[0].val;
        $scope.coverage.comp = $scope.compval[0].val;
        $scope.coverage.coll = $scope.collval[0].val; 
    }
  $scope.coverage.premium = $scope.coverage.bipd * $scope.coverage.pip * $scope.coverage.umbi * $scope.coverage.comp * $scope.coverage.coll;

  $scope.changedCovValue = function () {
      $scope.coverage.premium = $scope.coverage.bipd * $scope.coverage.pip * $scope.coverage.umbi * $scope.coverage.comp * $scope.coverage.coll;
      bcovService.set($scope.coverage.bipd,$scope.coverage.pip,$scope.coverage.umbi,$scope.coverage.comp,$scope.coverage.coll,$scope.coverage.type,$scope.coverage.premium);
  };


    bcovService.set($scope.coverage.bipd,$scope.coverage.pip,$scope.coverage.umbi,$scope.coverage.comp,$scope.coverage.coll,$scope.coverage.type,$scope.coverage.premium);

  $scope.goToSummary = function(){
      console.log("goToSummary");
      console.log("$scope.coverage : " + $scope.coverage.bipd);
      console.log("SMS logic");
      $scope.sms = {};
      $scope.sms.phoneno = personalService.getsavedPhone();
      $scope.sms.name = personalService.getsavedFirstText();
      $scope.sms.email = personalService.getsavedEmail();
      $scope.sms.premium = $scope.coverage.premium;
      $http.get('/api/uuid').success(function(response){
        $scope.sms.uuid = response;
      });
      $http.post('/api/coverage', $scope.coverage).success(function(response){
          $scope.date = new Date();
          console.log("coverage success " + $scope.date);
          covType = "Basic";
          covPremium = $scope.coverage.premium;
          $http.post('/api/sms', $scope.sms).success(function(response){
          console.log("Sent SMS");
          });
          $http.post('/api/email', $scope.sms).success(function(response){
          console.log("Sent EMAIL");
          });
          window.location.href='#/summary';

        });        
  }
      $scope.goBackToVehDetail = function(){
      vehCount = vehCount + 1;
      window.history.back();
    }

}]);

myApp.controller('sslctoptCntrl', ['$scope', '$http', '$location', '$routeParams', '$window', 'myService', 'scovService', 'personalService',  function($scope, $http, $location, $routeParams, $window, myService, scovService, personalService){
   
  $scope.coverage = {};

  $scope.coverage.type = "Standard";
$scope.bipdval = [ 
    {cov : "BI: $500 / $1000 & PD: $500", val : 60}, 
    {cov : "BI: $1000 / $1500 & PD: $1000", val : 70}, 
    {cov : "BI: $1500 / $2000 & PD: $1500", val : 80}, 
    {cov : "BI: $2000 / $2500 & PD: $2000", val : 90}];

 $scope.pipval = [ 
    {cov : "$500 Limit, $0 Deductible", val : 66}, 
    {cov : "$1000 Limit, $500 Deductible", val : 77}, 
    {cov : "$1500 Limit, $1000 Deductible", val : 88}, 
    {cov : "$2000 Limit, $1500 Deductible", val : 99}]; 

 $scope.umbival = [ 
    {cov : "$500 / $1000 includes supplemental", val : 33}, 
    {cov : "$1000 / $1500 includes supplemental", val : 55}, 
    {cov : "$1500 / $2000 includes supplemental", val : 77}, 
    {cov : "$2000 / $2500 includes supplemental", val : 99}];


 $scope.compval = [ 
    {cov : "$100 deductible", val : -0.023}, 
    {cov : "$200 deductible", val : -0.035}, 
    {cov : "$300 deductible", val : -0.045}, 
    {cov : "$400 deductible", val : -0.055}]; 

 $scope.collval = [ 
    {cov : "$100 deductible", val : -0.025}, 
    {cov : "$200 deductible", val : -0.035}, 
    {cov : "$300 deductible", val : -0.045}, 
    {cov : "$400 deductible", val : -0.055}]; 

   if (covCount > 1)
    {
        $scope.coverage.bipd = scovService.getsavedBipd();
        $scope.coverage.pip = scovService.getsavedPip();
        $scope.coverage.umbi = scovService.getsavedUmbi();
        $scope.coverage.comp = scovService.getsavedComp();
        $scope.coverage.coll = scovService.getsavedColl();
    }
  else 
    {
        $scope.coverage.bipd = $scope.bipdval[1].val; 
        $scope.coverage.pip = $scope.pipval[1].val; 
        $scope.coverage.umbi = $scope.umbival[2].val;
        $scope.coverage.comp = $scope.compval[1].val;
        $scope.coverage.coll = $scope.collval[2].val; 
    }

  $scope.coverage.premium = $scope.coverage.bipd * $scope.coverage.pip * $scope.coverage.umbi * $scope.coverage.comp * $scope.coverage.coll;

  $scope.changedCovValue = function () {
      $scope.coverage.premium = $scope.coverage.bipd * $scope.coverage.pip * $scope.coverage.umbi * $scope.coverage.comp * $scope.coverage.coll;
      scovService.set($scope.coverage.bipd,$scope.coverage.pip,$scope.coverage.umbi,$scope.coverage.comp,$scope.coverage.coll,$scope.coverage.type,$scope.coverage.premium);
  };


    scovService.set($scope.coverage.bipd,$scope.coverage.pip,$scope.coverage.umbi,$scope.coverage.comp,$scope.coverage.coll,$scope.coverage.type,$scope.coverage.premium);

  $scope.goToSummary = function(){
      console.log("goToSummary");
      console.log("$scope.coverage : " + $scope.coverage.bipd);
      console.log("SMS logic");
      $scope.sms = {};
      $scope.sms.phoneno = personalService.getsavedPhone();
      $scope.sms.name = personalService.getsavedFirstText();
      $scope.sms.email = personalService.getsavedEmail();
      $scope.sms.premium = $scope.coverage.premium;
      $http.get('/api/uuid').success(function(response){
        $scope.sms.uuid = response;
      });
      $http.post('/api/coverage', $scope.coverage).success(function(response){
          $scope.date = new Date();
          console.log("coverage success " + $scope.date);
          covType = "Standard";
          covPremium = $scope.coverage.premium;
          $http.post('/api/sms', $scope.sms).success(function(response){
          console.log("Sent SMS");
          });
          $http.post('/api/email', $scope.sms).success(function(response){
          console.log("Sent EMAIL");
          });
          window.location.href='#/summary';

        });   

  }
      $scope.goBackToVehDetail = function(){
      vehCount = vehCount + 1;
      window.history.back();
    }

}]);

myApp.controller('eslctoptCntrl', ['$scope', '$http', '$location', '$routeParams', '$window', 'myService', 'ecovService', 'personalService', function($scope, $http, $location, $routeParams, $window, myService, ecovService, personalService){
   
  $scope.coverage = {};

  $scope.coverage.type = "Extended";

  $scope.bipdval = [ 
    {cov : "BI: $500 / $1000 & PD: $500", val : 60}, 
    {cov : "BI: $1000 / $1500 & PD: $1000", val : 70}, 
    {cov : "BI: $1500 / $2000 & PD: $1500", val : 80}, 
    {cov : "BI: $2000 / $2500 & PD: $2000", val : 90}];

 $scope.pipval = [ 
    {cov : "$500 Limit, $0 Deductible", val : 66}, 
    {cov : "$1000 Limit, $500 Deductible", val : 77}, 
    {cov : "$1500 Limit, $1000 Deductible", val : 88}, 
    {cov : "$2000 Limit, $1500 Deductible", val : 99}]; 

 $scope.umbival = [ 
    {cov : "$500 / $1000 includes supplemental", val : 33}, 
    {cov : "$1000 / $1500 includes supplemental", val : 55}, 
    {cov : "$1500 / $2000 includes supplemental", val : 77}, 
    {cov : "$2000 / $2500 includes supplemental", val : 99}];

 $scope.compval = [ 
    {cov : "$100 deductible", val : -0.023}, 
    {cov : "$200 deductible", val : -0.035}, 
    {cov : "$300 deductible", val : -0.045}, 
    {cov : "$400 deductible", val : -0.055}]; 

 $scope.collval = [ 
    {cov : "$100 deductible", val : -0.025}, 
    {cov : "$200 deductible", val : -0.035}, 
    {cov : "$300 deductible", val : -0.045}, 
    {cov : "$400 deductible", val : -0.055}]; 


 $scope.mpval = [ 
    {cov : "Not Included - Consider Adding", val : 0}, 
    {cov : "$100 deductible", val : -5}, 
    {cov : "$200 deductible", val : -9.8}, 
    {cov : "$300 deductible", val : -15.4}, 
    {cov : "$400 deductible", val : -19.3}]; 

 $scope.tlval = [ 
    {cov : "Not Included - Consider Adding", val : 0}, 
    {cov : "$100 deductible", val : -10}, 
    {cov : "$200 deductible", val : -12}, 
    {cov : "$300 deductible", val : -13}, 
    {cov : "$400 deductible", val : -14}]; 


  if (covCount > 1)
    {
        $scope.coverage.bipd = ecovService.getsavedBipd();
        $scope.coverage.pip = ecovService.getsavedPip();
        $scope.coverage.umbi = ecovService.getsavedUmbi();
        $scope.coverage.comp = ecovService.getsavedComp();
        $scope.coverage.coll = ecovService.getsavedColl();
        $scope.coverage.mp = ecovService.getsavedMp();
        $scope.coverage.tl = ecovService.getsavedTl();
    }
  else 
    {
        $scope.coverage.bipd = $scope.bipdval[3].val; 
        $scope.coverage.pip = $scope.pipval[1].val; 
        $scope.coverage.umbi = $scope.umbival[3].val;
        $scope.coverage.comp = $scope.compval[2].val;
        $scope.coverage.coll = $scope.collval[3].val; 
        $scope.coverage.mp = $scope.mpval[0].val; 
        $scope.coverage.tl = $scope.tlval[0].val; 
    }

  $scope.coverage.premium = ($scope.coverage.bipd * $scope.coverage.pip * $scope.coverage.umbi * $scope.coverage.comp * $scope.coverage.coll) + $scope.coverage.mp + $scope.coverage.tl;

  $scope.changedCovValue = function () {
      $scope.coverage.premium = ($scope.coverage.bipd * $scope.coverage.pip * $scope.coverage.umbi * $scope.coverage.comp * $scope.coverage.coll) + $scope.coverage.mp  + $scope.coverage.tl;
      ecovService.set($scope.coverage.bipd,$scope.coverage.pip,$scope.coverage.umbi,$scope.coverage.comp,$scope.coverage.coll,$scope.coverage.mp,$scope.coverage.tl,$scope.coverage.type,$scope.coverage.premium);
  };


    ecovService.set($scope.coverage.bipd,$scope.coverage.pip,$scope.coverage.umbi,$scope.coverage.comp,$scope.coverage.coll,$scope.coverage.mp,$scope.coverage.tl,$scope.coverage.type,$scope.coverage.premium);

  $scope.goToSummary = function(){
      console.log("goToSummary");
      console.log("$scope.coverage : " + $scope.coverage.bipd);
      console.log("SMS logic");
      $scope.sms = {};
      $scope.sms.phoneno = personalService.getsavedPhone();
      $scope.sms.name = personalService.getsavedFirstText();
      $scope.sms.email = personalService.getsavedEmail();
      console.log("get email : " + $scope.sms.email);
      $scope.sms.premium = $scope.coverage.premium;
      $http.get('/api/uuid').success(function(response){
        $scope.sms.uuid = response;
      });
      $http.post('/api/coverage', $scope.coverage).success(function(response){
          $scope.date = new Date();
          console.log("coverage success " + $scope.date);
          covType = "Extended";
          covPremium = $scope.coverage.premium;
          $http.post('/api/sms', $scope.sms).success(function(response){
              console.log("Sent SMS");
          });
          $http.post('/api/email', $scope.sms).success(function(response){
          console.log("Sent EMAIL");
          });
          window.location.href='#/summary';

        });        
  }
      $scope.goBackToVehDetail = function(){
      vehCount = vehCount + 1;
      window.history.back();
    }

}]);

myApp.controller('summPageCtrl', ['$scope', '$http', '$location', '$routeParams', '$window','myService', 'bcovService', 'scovService', 'ecovService', 'personalService', function($scope, $http, $location, $routeParams, $window, myService, bcovService, scovService, ecovService, personalService){

    $http.get('/api/uuid').success(function(response){
      $scope.uuid = response;
    });

    $scope.insuredname = personalService.getsavedSuffix() + " " + personalService.getsavedFirstText() + " " + personalService.getsavedLastText();
    $scope.covtype = covType;
    $scope.premium = covPremium;
    /*var id = 0;
    $http.get('/api/coverage/'+id).success(function(response){
      $scope.covtype = response.type;
      $scope.premium = response.premium;
    });*/

    $scope.generatePDF = function() {
        kendo.drawing.drawDOM($("#summForm")).then(function(group) {
        kendo.drawing.pdf.saveAs(group, "Premium Details.pdf");
  });
}

}]);


myApp.factory('personalService', function() {
 var savedFirstText = {};
 var savedMi = {};
 var savedLastText = {};
 var savedSuffix = {};
 var savedAddress = {};
 var savedAptunit = {};
 var savedDob = {};
 var savedEmail = {};
 var savedPhone = {};

 function set(firsttext,mi,lasttext,suffix,address,aptunit,dob,email,phone) {
   savedFirstText = firsttext;   
   savedMi = mi;
   savedLastText = lasttext;
   savedSuffix = suffix;
   savedAddress = address;   
   savedAptunit = aptunit;
   savedDob = dob;
   savedEmail = email;
   savedPhone = phone;
   console.log("savedFirstText : " + savedFirstText);
   console.log("savedMi : " + savedMi);
 }

 function getsavedFirstText() {
  return savedFirstText;
 }
  function getsavedMi() {
  return savedMi;
 }
  function getsavedLastText() {
  return savedLastText;
 }
  function getsavedSuffix() {
  return savedSuffix;
 }
  function getsavedAddress() {
  return savedAddress;
 }
  function getsavedAptunit() {
  return savedAptunit;
 }
  function getsavedDob() {
  return savedDob;
 }
  function getsavedEmail() {
  return savedEmail;
 }
  function getsavedPhone() {
  return savedPhone;
 }

 return {
  set: set,
  getsavedFirstText: getsavedFirstText,
  getsavedMi: getsavedMi,
  getsavedLastText: getsavedLastText,
  getsavedSuffix: getsavedSuffix,
  getsavedAddress: getsavedAddress,
  getsavedAptunit: getsavedAptunit,
  getsavedDob: getsavedDob,
  getsavedEmail: getsavedEmail,
  getsavedPhone: getsavedPhone
 }

});

myApp.factory('driverService', function() {
 var savedFirstText = {};
 var savedMi = {};
 var savedLastText = {};
 var savedSuffix = {};
 var savedDob = {};
 var savedMaritalstatus = {};
 var savedLicstate = {};
 var savedAccident = {};
 var savedAge = {};

 function set(firsttext,mi,lasttext,suffix,dob,maritalstatus,lictsate,accident,age) {
   savedFirstText = firsttext;   
   savedMi = mi;
   savedLastText = lasttext;
   savedSuffix = suffix;
   savedDob = dob;
   savedMaritalstatus = maritalstatus;
   savedLicstate = lictsate;
   savedAccident = accident;
   savedAge = age;
   console.log("savedFirstText : " + savedFirstText);
   console.log("savedMi : " + savedMi);
 }

 function getsavedFirstText() {
  return savedFirstText;
 }
  function getsavedMi() {
  return savedMi;
 }
  function getsavedLastText() {
  return savedLastText;
 }
  function getsavedSuffix() {
  return savedSuffix;
 }
  function getsavedDob() {
  return savedDob;
 }
  function getsavedMaritalstatus() {
  return savedMaritalstatus;
 }
  function getsavedLicState() {
  return savedLicstate;
 }
  function getsavedAccident() {
  return savedAccident;
 }
 function getsavedAge() {
  return savedAge;
 }


 return {
  set: set,
  getsavedFirstText: getsavedFirstText,
  getsavedMi: getsavedMi,
  getsavedLastText: getsavedLastText,
  getsavedSuffix: getsavedSuffix,
  getsavedDob: getsavedDob,
  getsavedMaritalstatus: getsavedMaritalstatus,
  getsavedLicState: getsavedLicState,
  getsavedAccident: getsavedAccident,
  getsavedAge: getsavedAge
 }

});

myApp.factory('vehService', function() {
 var savedYear = {};
 var savedMake = {};
 var savedModel = {};
 var savedSeries = {};
 var savedCustom = {};
 var savedPrimary = {};
 var savedLoan = {};
 var savedDevice = {};
 var savedPark = {};
 var savedAddress = {};

 function set(year,make,model,series,custom,primary,loan,device,park,address) {
   savedYear = year;   
   savedMake = make;
   savedModel = model;
   savedSeries = series;
   savedCustom = custom;
   savedPrimary = primary;
   savedLoan = loan;
   savedDevice = device;
   savedPark = park;
   savedAddress = address;
 }

 function getsavedYear() {
  return savedYear;
 }
  function getsavedMake() {
  return savedMake;
 }
  function getsavedModel() {
  return savedModel;
 }
  function getsavedSeries() {
  return savedSeries;
 }
  function getsavedCustom() {
  return savedCustom;
 }
  function getsavedPrimary() {
  return savedPrimary;
 }
  function getsavedLoan() {
  return savedLoan;
 }
  function getsavedDevice() {
  return savedDevice;
 }
 function getsavedPark() {
  return savedPark;
 }
 function getsavedAddress() {
  return savedAddress;
 }


 return {
  set: set,
  getsavedYear: getsavedYear,
  getsavedMake: getsavedMake,
  getsavedModel: getsavedModel,
  getsavedSeries: getsavedSeries,
  getsavedCustom: getsavedCustom,
  getsavedPrimary: getsavedPrimary,
  getsavedLoan: getsavedLoan,
  getsavedDevice: getsavedDevice,
  getsavedPark: getsavedPark,
  getsavedAddress: getsavedAddress
 }

});

myApp.factory('bcovService', function() {
 var savedBipd = {};
 var savedPip = {};
 var savedUmbi = {};
 var savedComp = {};
 var savedColl = {};
 var savedType = {};
 var savedPremium = {};

 function set(bipd,pip,umbi,comp,coll,type,premium) {
   savedBipd = bipd;   
   savedPip = pip;
   savedUmbi = umbi;
   savedComp = comp;
   savedColl = coll;
   savedType = type;
   savedPremium = premium;
 }

 function getsavedBipd() {
  return savedBipd;
 }
  function getsavedPip() {
  return savedPip;
 }
  function getsavedUmbi() {
  return savedUmbi;
 }
  function getsavedComp() {
  return savedComp;
 }
  function getsavedColl() {
  return savedColl;
 }
 function getsavedType() {
  return savedType;
 }
 function getsavedPremium() {
  return savedPremium;
 }
 return {
  set: set,
  getsavedBipd: getsavedBipd,
  getsavedPip: getsavedPip,
  getsavedUmbi: getsavedUmbi,
  getsavedComp: getsavedComp,
  getsavedColl: getsavedColl,
  getsavedType: getsavedType,
  getsavedPremium: getsavedPremium
 }

});

myApp.factory('scovService', function() {
 var savedBipd = {};
 var savedPip = {};
 var savedUmbi = {};
 var savedComp = {};
 var savedColl = {};
 var savedType = {};
 var savedPremium= {};

 function set(bipd,pip,umbi,comp,coll,type,premium) {
   savedBipd = bipd;   
   savedPip = pip;
   savedUmbi = umbi;
   savedComp = comp;
   savedColl = coll;
   savedType = type;
   savedPremium = premium;
 }

 function getsavedBipd() {
  return savedBipd;
 }
  function getsavedPip() {
  return savedPip;
 }
  function getsavedUmbi() {
  return savedUmbi;
 }
  function getsavedComp() {
  return savedComp;
 }
  function getsavedColl() {
  return savedColl;
 }
  function getsavedType() {
  return savedType;
 }
  function getsavedPremium() {
  return savedPremium;
 }
 return {
  set: set,
  getsavedBipd: getsavedBipd,
  getsavedPip: getsavedPip,
  getsavedUmbi: getsavedUmbi,
  getsavedComp: getsavedComp,
  getsavedColl: getsavedColl,
  getsavedType: getsavedType,
  getsavedPremium: getsavedPremium
 }

});

myApp.factory('ecovService', function() {
 var savedBipd = {};
 var savedPip = {};
 var savedUmbi = {};
 var savedComp = {};
 var savedColl = {};
 var savedMp = {};
 var savedTl = {};
 var savedType = {};
 var savedPremium = {};

 function set(bipd,pip,umbi,comp,coll,mp,tl,type,premium) {
   savedBipd = bipd;   
   savedPip = pip;
   savedUmbi = umbi;
   savedComp = comp;
   savedColl = coll;
   savedMp = mp;
   savedTl = tl;
   savedType = type;
   savedPremium = premium;
 }

 function getsavedBipd() {
  return savedBipd;
 }
  function getsavedPip() {
  return savedPip;
 }
  function getsavedUmbi() {
  return savedUmbi;
 }
  function getsavedComp() {
  return savedComp;
 }
  function getsavedColl() {
  return savedColl;
 }
  function getsavedMp() {
  return savedMp;
 }
  function getsavedTl() {
  return savedTl;
 }
  function getsavedType() {
  return savedType;
 }
  function getsavedPremium() {
  return savedPremium;
 }
 return {
  set: set,
  getsavedBipd: getsavedBipd,
  getsavedPip: getsavedPip,
  getsavedUmbi: getsavedUmbi,
  getsavedComp: getsavedComp,
  getsavedColl: getsavedColl,
  getsavedMp: getsavedMp,
  getsavedTl: getsavedTl,
  getsavedType: getsavedType,
  getsavedPremium: getsavedPremium
 }

});



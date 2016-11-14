angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $http) {

  $scope.activeIcon="img/ActiveUser.png";

  var loggedinUser=window.localStorage.getItem("loggedinUser");
  if (loggedinUser!="null" && loggedinUser!=null) 
  {
    $scope.activeUserText="Logged in as : "+loggedinUser;
  }
  else
  {
        $scope.activeIcon="img/User-icon.png";
        $scope.activeUserText="Logged out!";
  }

  getAllUsers=JSON.parse(window.localStorage.getItem("loginInfo"));
  // getAllUsers=window.localStorage.removeItem("loginInfo");
  console.log(getAllUsers);
  $scope.users=getAllUsers;


  if ($scope.users==null) 
  {
  	$scope.savedText="List of Saved Users will appear here<br><br>Tap to Quick Login<br>Hold to Delete<br><br>Tap the power button to Logout";
  }
  else
  {
  	$scope.savedText="Saved Users";
  }


  $scope.login = function(uid, pass) 
  {


      $scope.wait=true;
      $scope.loadingmsg="Logging in ...";

      var loginDetails = "user="+uid+"&password="+pass+"&cmd=authenticate&login=Log+In";

      $http({
                method  : 'POST',
                url     : 'https://securelogin.pu.ac.in/cgi-bin/login',
                data    : loginDetails, //forms user object
                headers : {'Content-Type': 'application/x-www-form-urlencoded'} 
            })
                .success(function(data) 
                {
                 

                  $scope.wait=flase;
                  $scope.activeIcon="img/ActiveUser.png";
                  $scope.activeUserText="Logged in as : "+uid;
                  window.localStorage.setItem("loggedinUser", uid);
                  

                 });

                  if (/\S/.test(uid) && /\S/.test(pass) && uid!=undefined && pass!=undefined) 
                  {



                    // var loginDetails = "user="+uid+"&password="+pass+"&cmd=authenticate&login=Log+in";

                    // $http({
                    //           method  : 'POST',
                    //           url     : 'http://localhost/test.php',
                    //           data    : loginDetails, //forms user object
                    //           headers : {'Content-Type': 'application/x-www-form-urlencoded'} 
                    //          })
                    //           .success(function(data) {
                    //            console.log(data);
                    //           });





                      var credentials=window.localStorage.getItem("loginInfo");

                      if (credentials=="null" || credentials==null) 
                      {
                        var savedInfo=new Array();
                        var submittedInfo={userid:uid, password:pass};
                        savedInfo.push(submittedInfo);
                        window.localStorage.setItem("loginInfo", JSON.stringify(savedInfo)); 
                        getAllUsers=[submittedInfo];

                        // getAllUsers.push(submittedInfo);
                      }
                      else
                      {
                        var savedInfo=JSON.parse(window.localStorage.getItem("loginInfo"));
                        var submittedInfo=new Object();
                        submittedInfo={"userid":uid, "password":pass};
                        savedInfo.push(submittedInfo);
                        window.localStorage.setItem("loginInfo", JSON.stringify(savedInfo)); 
                        getAllUsers.push(submittedInfo);
                      }
                      $scope.users=getAllUsers;
                     






                  }




               




        
    };




    $scope.logout=function()
    {

      if (loggedinUser!="null" && loggedinUser!=null)
      {
        $scope.wait=true;
        $scope.loadingmsg="Logging out ...";



        $http.get("https://securelogin.pu.ac.in/cgi-bin/login?cmd=logout")
          .then(function(response) {
              
              $scope.wait=false;
              // $scope.loadingmsg="Logging in ...";
              $scope.activeIcon="img/User-icon.png";
              $scope.activeUserText="Logged out!";
              window.localStorage.setItem("loggedinUser", null);

        });
      }

        

    }



    $scope.loginFromSavedUsers=function(user)
    {


      $scope.wait=true;
      $scope.loadingmsg="Logging in ...";


      var loginDetails = "user="+user.userid+"&password="+user.password+"&cmd=authenticate&login=Log+In";

      $http({
                method  : 'POST',
                url     : 'https://securelogin.pu.ac.in/cgi-bin/login',
                data    : loginDetails, //forms user object
                headers : {'Content-Type': 'application/x-www-form-urlencoded'} 
            })
                .success(function(data) 
                {

                  $scope.wait=false;
                  // $scope.loadingmsg="Logging in ...";
                  $scope.activeIcon="img/ActiveUser.png";
                  var useridOfLoggedinUser=user.userid;
                  $scope.activeUserText="Logged in as : "+useridOfLoggedinUser;
                  window.localStorage.setItem("loggedinUser", user.userid);


                });
                 


    }


    $scope.deleteSavedUser=function(user)
    {
    	for (var i = 0; i < $scope.users.length; i++) {
    		if($scope.users[i]==user)
    		{
    			$scope.users.splice(i,1);
        
          var savedInfo=JSON.parse(window.localStorage.getItem("loginInfo"));
          // var submittedInfo=new Object();
          // submittedInfo={"userid":uid, "password":pass};
          savedInfo.splice(i,1);
          window.localStorage.setItem("loginInfo", JSON.stringify(savedInfo)); 
          // getAllUsers.push(submittedInfo);

          i--;
          break;    			
    		}
      // alert('yo');
    	}
      // $scope.activeIcon="img/ActiveUser.png";
      // var useridOfLoggedinUser=user.userid;
      // $scope.activeUserText="Logged in as : "+useridOfLoggedinUser;
    }


})

.controller('ChatsCtrl', function($scope, Chats, $http) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // getAllUsers=window.localStorage.removeItem("savedNotices");


  

  $http.get("http://innov.hol.es/getNotices.php")
    .then(function(response) {
        console.log(response.data.result);
        $scope.chats = response.data.result;
        window.localStorage.setItem("savedNotices", JSON.stringify(response)); 
        Chats.copyNotices(response.data.result);
    });


 var tempChats = JSON.parse(window.localStorage.getItem("savedNotices"));

  if (tempChats!=null && tempChats!="null") 
  {
  	$scope.chats = tempChats.data.result;
  	Chats.copyNotices(tempChats.data.result);
  	console.log(tempChats.data.result);
  }

   // console.log(Chats.all());
   $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});

// Anna Malaj, Matthew Gomez
// COP 4331, Spring 2021
// 1/17/2021

var urlBase = 'http://161.35.176.41:80/LAMPAPI';
var extension = 'php';

var userId = 0;
var firstName = "";
var lastName = "";

function registerUser()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
  firstName = document.getElementById("firstName").value;
  lastName = document.getElementById("lastName").value;

  var login = document.getElementById("registerUsername").value;
  var password = document.getElementById("registerPassword").value;
  //	var hash = md5( password );

  // This helps to ensure that none of the form 
  // inputs are left blank.
  if (!checkRegisterNames(firstName, lastName))
    return;
	
	document.getElementById("registerResult").innerHTML = "";

  // var jsonPayload = '{"login" : "' + login + '", "password" : "' + hash + '"}';
  var jsonPayload = 
  '{"FirstName" : "' + firstName + '", "LastName" : "' + lastName + '", "Login" : "' + login + '", "Password" : "' + password + '"}';
	var url = urlBase + '/SignUp.' + extension;
  var xhr = new XMLHttpRequest();
  
  console.log(jsonPayload);
  
	xhr.open("POST", url, false);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  
	try
	{
		xhr.send(jsonPayload);
		saveCookie();
		window.location.href = "app.html";
	}
	catch(err)
	{
		document.getElementById("registerResult").innerHTML = err.message;
	}
}

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	var login = document.getElementById("username").value;
	var password = document.getElementById("password").value;
  //	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

  //	var jsonPayload = '{"login" : "' + login + '", "password" : "' + hash + '"}';
	var jsonPayload = '{"Login" : "' + login + '", "Password" : "' + password + '"}';
	var url = urlBase + '/Login.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{
		xhr.send(jsonPayload);
		
    var jsonObject = JSON.parse( xhr.responseText );
		
		userId = jsonObject.ID;
		
		if (userId < 1)
		{
      // Provide an error message pushing the user to register
			document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
			return;
		}
		
		firstName = jsonObject.FirstName;
		lastName = jsonObject.LastName;

		saveCookie();
	
		window.location.href = "app.html";
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}
}

function saveCookie()
{
	var minutes = 20;
	var date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ",expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	var data = document.cookie;
	var splits = data.split(",");
  
  for (var i = 0; i < splits.length; i++) 
	{
		var thisOne = splits[i].trim();
    var tokens = thisOne.split("=");
    
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("userName").innerHTML = firstName + " " + lastName;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	window.location.href = "index.html";
}

function addContact()
{
	var newColor = document.getElementById("colorText").value;
	document.getElementById("colorAddResult").innerHTML = "";
	
	var jsonPayload = '{"color" : "' + newColor + '", "userId" : ' + userId + '}';
	var url = urlBase + '/AddColor.' + extension;
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("colorAddResult").innerHTML = "Color has been added";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorAddResult").innerHTML = err.message;
	}
	
}

function searchContacts()
{
	var srch = document.getElementById("searchText").value;
	document.getElementById("colorSearchResult").innerHTML = "";
	
	var colorList = "";
	
	var jsonPayload = '{"search" : "' + srch + '","userId" : ' + userId + '}';
	var url = urlBase + '/SearchColors.' + extension;
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
        document.getElementById("colorSearchResult").innerHTML = "Contact(s) has been retrieved";
        
				var jsonObject = JSON.parse( xhr.responseText );
				
				for (var i = 0; i<jsonObject.results.length; i++)
				{
          colorList += jsonObject.results[i];
          
					if (i < jsonObject.results.length - 1)
					{
						colorList += "<br />\r\n";
					}
				}
				
				document.getElementsByTagName("p")[0].innerHTML = colorList;
			}
    };
    
		xhr.send(jsonPayload);
  }
  
	catch(err)
	{
		document.getElementById("colorSearchResult").innerHTML = err.message;
	}
}

function showLoginPassword() 
{
  var x = document.getElementById("password");

  if (x.type === "password") 
    x.type = "text";
  else 
    x.type = "password";
}

function showRegistrationPassword() 
{
  var x = document.getElementById("registerPassword");

  if (x.type === "password") 
    x.type = "text";
  else 
    x.type = "password";
}

function checkRegisterNames(firstName, lastName) 
{
  var isAlpha = function(ch)
  {
    return typeof ch === "string" && ch.length === 1 && (ch >= "a" && ch <= "z" || ch >= "A" && ch <= "Z");
  }  

  for (var i = 0; i < firstName.length; i++) {
    if (!isAlpha(firstName[i])) {
      document.getElementById("registerResult").innerHTML = 'First name must have alphabet characters only';

      return false;
    }
  }

  for (var j = 0; j < lastName.length; j++) {
    if (!isAlpha(lastName[j])) {
      document.getElementById("registerResult").innerHTML = 'Last name must have alphabet characters only';

      return false;
    }
	}
	
  return true;
}

function displayUserInfo()
{
	var loginData = document.getElementById("loginInfo");

	loginData.textContent = "Logged in as: ";
	loginData.textContent.concat(" " + firstName + " " + lastName);

}
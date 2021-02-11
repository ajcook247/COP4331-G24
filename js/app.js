// Anna Malaj, Matthew Gomez
// COP 4331, Spring 2021
// 1/17/2021

var urlBase = 'http://contactmeshop.com/LAMPAPI';
var extension = 'php';

var userId = 0;
var firstName = "";
var lastName = "";
var updateFlag = false;
  
function addRow(obj)
{
	var row = `<tr scope="row" class="test-row-${obj.contactID}">
								<td id="contactID-${obj.contactID}" class="d-none" data-testid="${obj.contactID}">${obj.contactID}</td>
								<td id="firstName-${obj.contactID}" data-testid="${obj.contactID}">${obj.firstName}</td>
								<td id="lastName-${obj.contactID}" data-testid="${obj.contactID}">${obj.lastName}</td>
								<td id="email-${obj.contactID}" data-testid="${obj.contactID}">${obj.email}</td>
								<td id="phone-${obj.contactID}" data-testid="${obj.contactID}">${obj.phone}</td>
								<td>
									<button class="btn btn-sm btn-info" data-testid="${obj.contactID}"  id="save-${obj.contactID}" data-toggle="modal" data-target="#updateContactModal">Update</button> 
									<button class="btn btn-sm btn-danger" data-testid=${obj.contactID} id="delete-${obj.contactID}" >Delete</button>	
								</td>
							</tr>`

	$('#tests-table').append(row)
	
	$(`#delete-${obj.contactID}`).on('click', deleteTest)
	$(`#save-${obj.contactID}`).on('click', saveUpdate)
	
}

function saveUpdate()
{ 
	var testid = $(this).data('testid');
	var saveBtn = $(`#save-${testid}`);
	var row = $(`.test-row-${testid}`);

	if (updateFlag == false)
		testID = testid;

	if (updateFlag)
	{
		var updateFirstName = document.getElementById("updateFirstName").value;
		var updateLastName = document.getElementById("updateLastName").value;
		var updateEmail = document.getElementById("updateEmail").value;
		var updatePhone = document.getElementById("updatePhone").value;
   
    console.log(updateFirstName);
    console.log(updateLastName);
    console.log(updateEmail);
    console.log(updatePhone);

		updateFlag = false;
		updateContact(updateFirstName, updateLastName, updateEmail, updatePhone, testID);
	}

	updateFlag = true;
}

function deleteTest()
{
	var testid = $(this).data('testid')
	var row = $(`.test-row-${testid}`)

	deleteContact(testid);

	row.remove()
}

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
		
    var jsonObject = JSON.parse(xhr.responseText);
		
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
    
		if (tokens[0] == "firstName")
		{
			firstName = tokens[1];
		}
		else if (tokens[0] == "lastName")
		{
			lastName = tokens[1];
		}
		else if (tokens[0] == "userId")
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if (userId < 0)
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("userName").innerHTML = firstName + " " + lastName;
	}
}

function createContact()
{
	firstName = "";
	lastName = "";
	
	var contactFirstName = document.getElementById("contactFirstName").value;
	var contactLastName = document.getElementById("contactLastName").value;

	var contactEmail = document.getElementById("contactEmail").value;
	var contactPhone = document.getElementById("contactPhone").value;

	// Remove any special characters in order to ensure all
	// numbers are a 10 digit string.
	contactPhone = contactPhone.replace(/[^\w\s]/gi, '');

	// This helps to ensure that none of the form 
	// inputs are left blank.
	if (!checkFormNames(contactFirstName, contactLastName))
		return;
	
	document.getElementById("contactsResult").innerHTML = "";

	// var jsonPayload = '{"login" : "' + login + '", "password" : "' + hash + '"}';
  var jsonPayload = 
  	'{"UserID" : "' + userId + '", "FirstName" : "' + contactFirstName + '", "LastName" : "' + contactLastName + '", "Email" : "' + contactEmail + '", "Phone" : "' + contactPhone + '"}';
	var url = urlBase + '/Create.' + extension;
	var xhr = new XMLHttpRequest();
	
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	
	try
	{
		/*xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				document.getElementById("contactsResult").innerHTML = "Contact has been added";
			}
		};*/
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactsResult").innerHTML = err.message;
	}
}

function deleteContact(contactID)
{
	var xhr = new XMLHttpRequest();
	var newUrl = 'http://contactmeshop.com/LAMPAPI/DeleteContact.php';
	var jsonPayload = 
  	'{"ID" : "' + contactID + '"}';
	
	xhr.open("DELETE", newUrl, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("deleteResult").innerHTML = err.message;
	}
}

function updateContact(updateFirstName, updateLastName, updateEmail, updatePhone, testid)
{
	// This helps to ensure that none of the form 
	// inputs are left blank.
	if (!checkFormNames(updateFirstName, updateLastName))
		return;
	
	document.getElementById("updateResult").innerHTML = "";

	// var jsonPayload = '{"login" : "' + login + '", "password" : "' + hash + '"}';
  var jsonPayload = 
  	'{"ID" : "' + testid + '", "UserID" : "' + userId + '", "FirstName" : "' + updateFirstName + '", "LastName" : "' + updateLastName + '", "Email" : "' + updateEmail + '", "Phone" : "' + updatePhone + '"}';
	var url = urlBase + '/Update.' + extension;
	var xhr = new XMLHttpRequest();
	
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	
	try
	{
		/*xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				document.getElementById("updateResult").innerHTML = "Contact has been updated";
			}
		};*/
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("updateResult").innerHTML = err.message;
	}
}

function displayTable()
{	
  var jsonPayload = 
  	'{"UserID" : "' + userId + '"}';
	var url = urlBase + '/DisplayTable.' + extension;
	var xhr = new XMLHttpRequest();
	
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
				console.log("Success in displayTable()");
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		console.log("Failure in displayTable()");
	}

	var contactList = JSON.parse(xhr.responseText);

	for (var i in contactList)
  {
  	addRow(contactList[i]);
  }
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	window.location.href = "index.html";
}

function searchContacts()
{
	var srch = document.getElementById("contactsInput").value;
	document.getElementById("contactsTableResult").innerHTML = "";
 
  var fullName = srch.split(' '),
  firstName = fullName[0],
  lastName = fullName[fullName.length - 1];
	
	var contactsList = "";
	
	var jsonPayload = '{"UserID" : "' + userId + '", "FirstName" : "' + firstName + '", "LastName" : "' + lastName + '"}';
	var url = urlBase + '/Search.' + extension;
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
        document.getElementById("contactsTableResult").innerHTML = "Contact(s) has been retrieved";
        
				var jsonObject = JSON.parse(xhr.responseText);
				
				for (var i = 0; i < jsonObject.results.length; i++)
				{
          contactsList += jsonObject.results[i];
          
					if (i < jsonObject.results.length - 1)
					{
						contactsList += "<br /> \r\n";
					}
				}
				
				document.getElementsByTagName("p")[0].innerHTML = contactsList;
			}
    };
    
		xhr.send(jsonPayload);
  }
  
	catch(err)
	{
		document.getElementById("contactsTableResult").innerHTML = err.message;
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

function checkFormNames(firstName, lastName) 
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
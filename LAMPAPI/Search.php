<?php

	$inData = getRequestInfo();
	
	$input = $inData["Input"];
	$userId = $inData["UserID"];
 
   class Contact 
  {
      public $contactID = "";
      public $userID = "";
      public $firstName = "";
      public $lastName  = "";
      public $email = "";
      public $phone = "";
  }
 
  $users[] = array();
	$conn = new mysqli("localhost", "DatabaseAdmin", "COP4331isVeryFun", "COP4331");
 
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
 
    if (strpos($input, ' ') > 0)
    {
      $names = explode(" ", $input);
     
      $result = mysqli_query($conn, "Select * from Contacts Where (UserID = $userId) AND (FirstName LIKE '%$names[0]%' AND LastName LIKE '%$names[1]%')");
    }
    else
    {
      $result = mysqli_query($conn, "Select * from Contacts Where (UserID = $userId) AND (FirstName LIKE '%$input%' OR LastName LIKE '%$input%' OR              Email LIKE '%$input%' OR Phone LIKE '%$input%')");
    }
   
    while($row = mysqli_fetch_array($result))
    {
      $newContact = new Contact();
      
      $newContact->contactID = $row['ID'];
      $newContact->userID = $row['UserID'];
      $newContact->firstName = $row['FirstName'];
      $newContact->lastName = $row['LastName'];
  		$newContact->email = $row['Email'];
  		$newContact->phone = $row['Phone'];
     
      $users[] = $newContact;
    }
  
    unset($users[0]); 
    sendResultInfoAsJson($users);
   
		$conn->close();
	}
	
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

 	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo json_encode($obj);
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"ID":0,"FirstName":"","LastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $firstName, $lastName, $id )
	{
		$retValue = '{"ID":' . $id . ',"FirstName":"' . $firstName . '","LastName":"' . $lastName . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
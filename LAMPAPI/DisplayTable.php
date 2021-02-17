<?php

  $inData = getRequestInfo();

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
  
  // Check the connection
  if ($conn->connect_error) 
  {
  	returnWithError( $conn->connect_error );
  }
  
  $result = mysqli_query($conn, "SELECT * FROM Contacts WHERE UserID = '$inData[UserID]'");     
  
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
  
  mysqli_close($conn);
  
 	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}
 
 	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo json_encode($obj);
	}
?>
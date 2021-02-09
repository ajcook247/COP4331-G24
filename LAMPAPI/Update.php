<?php
	$inData = getRequestInfo();
	
	$id = $inData["ID"];
	$userId = $inData["UserID"];
	$firstName = $inData["FirstName"];
	$lastName = $inData["LastName"];
	$email = $inData["Email"];
	$phone = $inData["Phone"];
	
	$conn = new mysqli("localhost", "DatabaseAdmin", "COP4331isVeryFun", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		// MAY NOT NEED THIS PART
		/*
		$q = "select ID from Contacts where UserID = '" . $userId . "' and FirstName = '" . $firstName . "' and LastName = '" . $lastName . "' and Email = '" . $email . "' and Phone = '" . $phone . "'";
		$res = $conn->query($q);
		
		if ($res != TRUE)
			returnWithError($conn->error);
		
		$row = $res->fetch_assoc();
		$id = $row["ID"];
		*/
		
		$sql = "update Contacts set FirstName = '" . $firstName . "', LastName = '" . $lastName . "', Email = '" . $email . "', Phone = '" . $phone . "' where UserID = '" . $userId . "' and ID = '" . $id . "'";
		
		//$sql = "update Contacts set FirstName = '" . $firstName . "', LastName = '" . $lastName . "', Email = '" . $email . "', Phone = '" . $phone . "' where UserID = '" . $userId . "'";
		
		if( $result = $conn->query($sql) != TRUE )
		{
			returnWithError( $conn->error );
		}
		$conn->close();
	}
	
	returnWithError("");
	
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
?>
<?php
	$inData = getRequestInfo();
	
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
		$sql = "insert into Contacts (FirstName,LastName,Email,Phone) VALUES ('" . $firstName . "','" . $lastName . "','" . $email . "','" . $phone . "')";
		if( $result = $conn->query($sql) != TRUE )
		{
			returnWithError( $conn->error );
		}
		
		$lastId = $conn->insert_id;
		$upd = "update Contacts set UserID = " . $lastId . " where FirstName = '" . $firstName . "' and LastName = '" . $lastName . "' and Email = '" . $email . "' and Phone = '" . $phone . "'";
		if( $result2 = $conn->query($upd) != TRUE )
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
<?php

	$inData = getRequestInfo();
	
	
	  $firstName = "";
    $lastName = "";
    $userName = "";
    $password = "";
    

	$conn = new mysqli("localhost", "DatabaseAdmin", "COP4331isVeryFun", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
        $sql = "DELETE FROM Contacts WHERE ID= '" . $inData["ID"] . "'";

        if( $result = $conn->query($sql) != TRUE )
        {
            returnWithError( $conn->error );
        }
        
        $conn->close();
	
	}
	
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
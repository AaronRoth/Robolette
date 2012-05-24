<?php
  // Copyright (c) 2012 Aaron Roth
  // See the file license.txt for copying permission.
  //
  
  try
  {
    $team_one_count;
    $team_two_count;
    
    // Open a connection to the database.
    $db_handle = new PDO('sqlite:../drinks.db');
    
    $result = $db_handle->query("SELECT * FROM drinkcounts
                                 WHERE name = 'counts'");
                                 
    foreach ($result as $row)
    {
      $team_one_count = intval($row[1]);
      $team_two_count = intval($row[2]);
    }
    
    // Respond with the current drink counts.
    echo $team_one_count . $team_two_count;
    
    // Reduce each count in the database by one.
    if ($team_one_count > 0)
      $db_handle->exec("UPDATE drinkcounts SET team_one = team_one - 1");
      
    if ($team_two_count > 0)
      $db_handle->exec("UPDATE drinkcounts SET team_two = team_two - 1");
      
    // Close the database connection.
    $db_handle = null;
  }
  catch (PDOException $exception)
  {
    echo $exception->getMessage();
  }
?>
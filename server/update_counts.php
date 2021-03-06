<?php
  // Copyright (c) 2012 Aaron Roth
  // See the file license.txt for copying permission.
  //
  
  // Get number of drinks to add to each team's drink count.
  $team_one_increase = intval($_GET["team_one"]);
  $team_two_increase = intval($_GET["team_two"]);
  
  try
  {
    // Open a connection to the database.
    $db_handle = new PDO('sqlite:../drinks.db');
    
    // Increase the counts in the database.
    if ($team_one_increase > 0)
      $db_handle->exec("UPDATE drinkcounts
                        SET team_one = team_one + $team_one_increase");
    
    if ($team_two_increase > 0)
      $db_handle->exec("UPDATE drinkcounts
                        SET team_two = team_two + $team_two_increase");
    
    $result = $db_handle->query("SELECT * FROM drinkcounts
                                 WHERE name = 'counts'");
    
    foreach ($result as $row)
    {
      $team_one_count = intval($row[1]);
      $team_two_count = intval($row[2]);
    }
    
    // Respond with the current drink counts.
    echo $team_one_count . "|" . $team_two_count;
                  
    // Close the database connection.
    $db_handle = null;
  }
  catch (PDOException $exception)
  {
    echo $exception->getMessage();
  }
?>
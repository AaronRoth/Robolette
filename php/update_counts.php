<?php
  /*
  Copyright (c) 2012 Aaron Roth

  Permission is hereby granted, free of charge, to any person obtaining a copy of
  this software and associated documentation files (the "Software"), to deal in
  the Software without restriction, including without limitation the rights to
  use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
  of the Software, and to permit persons to whom the Software is furnished to do
  so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
  */
  
  // Get number of drinks to add to each team's drink count.
  $team_one_increase = intval($_GET["team_one"]);
  $team_two_increase = intval($_GET["team_two"]);
  
  try
  {
    // Open a connection to the database.
    $db_handle = new PDO('sqlite:../drinks.db');
    
    // Increase the counts in the database.
    if ($team_one_increase > 0)
      $db_handle->exec("UPDATE drinkcounts SET team_one = team_one + $team_one_increase");
      
    if ($team_two_increase > 0)
      $db_handle->exec("UPDATE drinkcounts SET team_two = team_two + $team_two_increase");
      
    // Close the database connection.
    $db_handle = null;
  }
  catch (PDOException $exception)
  {
    echo $exception->getMessage();
  }
?>
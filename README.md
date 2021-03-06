# Robolette

A modified roulette game: Punish your opponent with a drink every time you win a bet.

## Web Client Homepage

URL: http://findaaron.nfshost.com/Robolette/client

## API Methods

### Update drink counts

URL: http://findaaron.nfshost.com/Robolette/server/update_counts.php  
Format: Text	
Parameters:	

+ **team_one** - (required) Number of drinks you want to add to team one's drink count.
+ **team_two** - (required) Number of drinks you want to add to team two's drink count.

Response:
```
2|3
```

Note: The response is the drink counts after the update had been made.

### Check drink counts

URL: http://findaaron.nfshost.com/Robolette/server/check_counts.php  
Format: Text	
Response:	
```
2|3
```

### Check and reduce drink counts

URL: http://findaaron.nfshost.com/Robolette/server/get_counts.php  
Format: Text	
Response:	
```
1|2
```
Note: After every visit to this URL, each team's drink count is reduced by one.

### Reset each team's drink count to zero

URL: http://findaaron.nfshost.com/Robolette/server/reset_counts.php  
Format: Text	
Response:	
```
0|0
```
(
	function () 
	{
		'use strict';

		//Splits the incoming query string after the "#'
		var args = _.reduce(window.location.hash.substring(1).split('&'), function (accu, kvp)
		{
			var splitted = kvp.split('=');
			accu[splitted[0]] = splitted[1];
			return accu;
		}, 
		{
		
		}
		);
/**
		if (!args.baseUrl || !args.apiBaseUrl || !args.token)
		{
			alert('Missing baseUrl, apiBaseUrl or token.');
			return;
		}**/
		var baseUrl = decodeURIComponent("https:%2F%2Fapp.leanix.net%2Fcti&");
		var apiBaseUrl = decodeURIComponent("https:%2F%2Fapp.leanix.net%2Fcti%2Fapi%2Fv1&");
		var token ="eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJrb25yYWQuZ2VybGFjaEBnbXguZGUiLCJwcmluY2lwYWwiOnsiaWQiOiJmODdiNWFlOS0yMDBhLTRlNzgtYWQzYi0xMDg5YjQ5NzUwYTYiLCJ1c2VybmFtZSI6ImtvbnJhZC5nZXJsYWNoQGdteC5kZSIsInJvbGUiOiJBQ0NPVU5UVVNFUiIsInN0YXR1cyI6IkFDVElWRSIsImFjY291bnQiOnsiaWQiOiI4OTk1MTMxMy03MThlLTRhMzEtYjkyYi03YjJmZTkzNWFkNTQiLCJuYW1lIjoiY3RpIn0sInBlcm1pc3Npb24iOnsiaWQiOiJlOWE0MTg5NC1mYWFjLTQ2ZTUtODhiOC0yMTlhODdmYmU3ZTkiLCJ3b3Jrc3BhY2VJZCI6ImQzYTQwODM5LTVkZWItNDQwMi1hYTM5LTJkNDMwMmM2MDA2ZSIsInJvbGUiOiJBRE1JTiIsInN0YXR1cyI6IkFDVElWRSJ9fSwianRpIjoiZjY1N2M4Y2UtN2Q2MC00N2QyLWJmMTEtYjcyZDNmYWY3NTRiIiwiZXhwIjoxNDg1MTYxMjYwLCJyZWZyZXNoX3Rva2VuIjoiMTYzMjc1NDMtZGNkZi00OWRhLTkzNDctZmQwZmFmZTk4ZTM0In0.mVWm3sQOGynaw9_MoeR-jvzWKAh6zc_OeDXCVyKav3oqpGFThoQ2wq1RhE1Tm2GkEaneMQbzi0vgADg8ux3vqg4C4_Dw1FJ7JUeMGRqGxOCzZ3cYpfCLMSqUlnR8i3G_22SNSwKDUm4gxPh2d9JXs0l_v0-gnvSjagX2bYgLAw5KHgcj4skQFrBc0Um9DWy9v3SRh2gMAsif7hI-GJzqltFdfyh5C-0-0_9DRGiWGIeydVnobs2bpKufdlQIh6fgT-PtddL1lGprTOdp9p5J0qHRlc4gKmLAQdIevN5UUVVIzhFQoghBkW0dcpz8z_FvZ7CgsHG1Jj96I6G_CzvLmQ" ;
/**
		var baseUrl = decodeURIComponent(args.baseUrl);
		var apiBaseUrl = decodeURIComponent(args.apiBaseUrl);
		var token = args.token;**/
		//creates the Variable Users
		var Users;
		//Always includes token into auth header
		$.ajaxSetup
		(
			{
				beforeSend : function(xhr)
				{
					xhr.setRequestHeader('Authorization', 'Bearer ' + token);
				}
			}
		);
		//gets the UserGroup Information from the LeanIX database
		$.get(apiBaseUrl + '/consumers').then
		(
			function(response)
				{ 
					//stores the UserGroup Array into the Users Variable, which can lateron be configured
					Users=response;
					//"debug Logs the UserGroup Array into the console" console.log(response);
					return;
				}
		);
		//Print out the results as table
		//gets the Application Information from the LeanIX database
		$.get(apiBaseUrl + '/services?relations=true').then(function(response)
		{ 
			//stores the Application-Information Array into the changedresponse Array, which can lateron be configured
			var changedresponse=response;
			
			//goes through the changedresponse Array one by one
			for(var i=0; i<changedresponse.length; i++)
			{		
				//goes through the serviceHasConsumers Array one by one, also serves as a safety measure, as it ignores all empty serviceHasConsumers Arrays
				for(var j=0; j<changedresponse[i].serviceHasConsumers.length;j++) 
				{
					//creates a variable content, which holds an HTML <tr> tag start
					var content = "<tr>";
					//adds an HTML <td> tag, holding a certain (i) Application id, to the content variable
					content += '<td>' + changedresponse[i].ID + '</td>';
					//adds an HTML <td> tag, holding a certain (i) Application Name, to the content variable
					content += '<td>' + changedresponse[i].displayName + '</td>';
					//creates the Variable correctUser
					var correctUser;
					//goes through all the UserGroups and matches their Id with the Id of the UserGroup, that commented on the Application
					for(var k =0;k<Users.length;k++)
					{   
						if(changedresponse[i].serviceHasConsumers[j].consumerID===Users[k].ID)
						{
							correctUser=k;
						}
	
					}
					//adds an HTML <td> tag, holding a certain (correctUser) UserGroup name (one of the ones, that commented on the current Application), to the content variable
					content += '<td>' + Users[correctUser].displayName + '</td>';
					//adds an HTML <td> tag, holding a certain (i,j) comment (the comment submitted by the previously shown UserGroup on the current Application) , to the content variable
					content += '<td>' +changedresponse[i].serviceHasConsumers[j].comment +'</td>';
					//"debug Shows the position in the array changedresponse behind the rows in the table" content += '<td>' +i+'</td>';
					//closes the HTML <tr> tag, which was entered first
					content+="</tr>";
					//enters the content Variable, which now holds HTML tags and their content into the HTML table with the id #target
					$('#target').append(content);
				}
				
			}
			//"debug shows all the changedrepsonse object in the console" console.log(changedresponse);
		}
	);
	}
)
	();
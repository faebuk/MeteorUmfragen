//events für das pollSubmit template
Template.pollSubmit.events({
	'submit form': function(e) {
		e.preventDefault();

		var valid = true;

		//title und categories von der Umfrage holen
		var title = $(e.target).find('[name=title]').val();
		var categories = $(e.target).find('[name=categories]').val();

		//validation
		if(title.length <= 0){
			valid = false;
		}

		if(categories.length <= 0){
			valid = false;
		}

		//schauen ob alle Inputs ausgefüllt wurden
		_.each(listIndx, function(doc){			
			var question = $(e.target).find('[name='+doc+'question]').val();

			if(question.length <= 0){
				valid = false;
				
			}
		});
		
		//wenn alles valid, Umfrage + Fragen in Collection schreiben
		if(valid){
			var poll = {
				title: title,
				categories: categories
			};

			var success = true;

			//serverseitige Collection methode "pollInsert" (polls.js)
			Meteor.call('pollInsert', poll, function(error, result) {
				// error dem Benutzer anzeigen
				if (error){
					FlashMessages.sendError(error.reason, { hideDelay: 4000, autoScroll: true });
					return error.reason;
				}
				// falls Umfrage schon existiert error anzeigen
				if (result.pollExists){
					FlashMessages.sendError("Die Umfrage mit dem Titel existiert schon.", { hideDelay: 4000, autoScroll: true });
					success = false;
					return result._id;
				}


				//alle Felder holen und die Fragen in die Collection hinzufügen
				_.each(listIndx, function(doc){			
					var question = {
						question: $(e.target).find('[name='+doc+'question]').val(),
						pollId: result._id
					}

					Meteor.call('questionInsert', question, function(error, result) {
						// display the error to the user and abort
						if (error){
							FlashMessages.sendError(error.reason, { hideDelay: 4000, autoScroll: true });
							success = false;
						}			
					});
				});

				if(success){
					FlashMessages.sendSuccess("Umfrage erfolgreich erstellt.", { hideDelay: 4000, autoScroll: true });			
					Router.go('pollPage', {_id: result._id});
				}
				
			});
		}else{
			FlashMessages.sendError("Alle Felder müssen ausgefüllt sein.", { hideDelay: 4000, autoScroll: true });
		}
	}
});

//Anzahl Fragen
listIndx = [
	"Erste",
	"Zweite", 
	"Dritte",
	"Vierte",
	"Fünfte",
	"Sechste",
	"Siebte",
	"Achte",
	"Neunte",
	"Zehnte",
];

//Daten für das template pollSubmit
Template.pollSubmit.helpers({
	listIndx: listIndx
});
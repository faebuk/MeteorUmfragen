Template.pollPage.helpers({
	questions: function() {
		return Questions.find({pollId: this._id});
	},
});

Template.pollPage.events({
	//event submit für die form mit dem Event und Template parameter
	'submit form': function(e, t) {
		e.preventDefault();

		var pollId = this._id;

		//alle Fragen zur Umfrage holen
		var questionsCursor = Questions.find({pollId: pollId});
		var questions = questionsCursor.fetch();

		var valid = true;

		//schauen ob alle Fragen ausgefüllt sind
		for (var i=0; i<questions.length; i++) {
			var question_id = questions[i]._id;

			var element = t.find('input:radio[name='+question_id+']:checked');
			var elementvalue = $(element).val();

    		if(!elementvalue){
    			valid = false;
    		}
		}

		//wenn valid die Umfrage und alle Fragen updaten
		if(valid){
			FlashMessages.clear();

			for (var i=0; i<questions.length; i++) {
				var question_id = questions[i]._id;
				var element = t.find('input:radio[name='+question_id+']:checked');
				var elementvalue = $(element).val();

				//schauen ob es schon ausgefüllte Antworten hat
				var questionsAnswered = Questions_Users.findOne({questionId: question_id, userId: Meteor.userId()});
			
				//falls ja -> update
				if (questionsAnswered) {
					Questions_Users.update({_id: questionsAnswered._id}, {$set: {answer: elementvalue}});
				} 
				//sonst neu erstellen
				else{
					var question_answers = {
						questionId: question_id,
						answer: elementvalue
					};				

					//Meteor serversitige Methoden "questionsusersInsert" aufrufen (Questions_Users.js)
					Meteor.call('questionsusersInsert', question_answers, function(error, result) {
						//wenn ein error zurück kommt dem User anzeigen
						if (error)
							return FlashMessages.sendError(error.reason,{ hideDelay: 4000, autoScroll: true });
					});	
				}

							
			}

			var questionsAnswered = Questions_Users.findOne({questionId: question_id});

			if(questionsAnswered){
				FlashMessages.sendSuccess("Sie haben die Umfrage erfolgreich geändert.", { hideDelay: 6000, autoScroll: true });
			}else{
				FlashMessages.sendSuccess("Sie haben an der Umfrage erfolgreich teilgenommen.", { hideDelay: 6000, autoScroll: true });
			}
			
			//Redirect zur Route "pollsList"
			Router.go('pollsList');
		}else{
			FlashMessages.sendError("Alle Fragen müssen ausgefüllt sein.", { autoHide: false });
		}
	}
});
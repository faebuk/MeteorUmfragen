//Daten für die questions welche im Template gebraucht werden
Template.pollEdit.helpers({
	questions: function() {
		return Questions.find({pollId: this._id});
	}
});

//Events für das "pollEdit" Template
Template.pollEdit.events({
	//sobald form submitted wird (enter oder click), mit dem event und template Parameter
	'submit form': function(e, t) {
		//normale Aktion verhindern
		e.preventDefault();

		var valid = true;

		var pollId = this._id;

		//inputs holen
		var pollTitle = t.find('input:text[name=pollTitle]');
		var pollTitleValue = $(pollTitle).val();

		var pollCategories = t.find('input:text[name=pollCategories]');
		var pollCategoriesValue = $(pollCategories).val();

		//validation
		if(pollTitleValue.length <= 0){
			valid = false;
		}
		if(pollCategoriesValue.length <= 0){
			valid = false;
		}	

		//alle Fragen der Umfrage holen
		var questionsCursor = Questions.find({pollId: pollId});
		var questions = questionsCursor.fetch();

		//schauen ob die HTML Inputs ausgefüllt sind
		questions.forEach(function(entry){
			var element = t.find('input:text[name='+entry._id+']');
			var elementvalue = $(element).val();

			if(elementvalue.length <= 0){
				valid = false;
			}
		});
		//wenn alles valid ist, updaten
		if(valid){
			FlashMessages.clear();

			Polls.update({_id: pollId}, {$set: {title: pollTitleValue, categories: pollCategoriesValue}});

			questions.forEach(function(entry){
				var element = t.find('input:text[name='+entry._id+']');
				var elementvalue = $(element).val();

				Questions.update({_id: entry._id}, {$set: {question: elementvalue}});				
			});

			FlashMessages.sendSuccess('Umfrage erfolgreich bearbeitet', { hideDelay: 4000, autoScroll: true });
			Router.go('pollPage', {_id: pollId});
		}else{
			FlashMessages.sendError("Alle Felder müssen ausgefüllt sein.", { hideDelay: 4000, autoScroll: true });
		}
	}
});

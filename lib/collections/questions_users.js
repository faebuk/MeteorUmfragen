//Collection für die Antworten der User zu den Fragen
Questions_Users = new Mongo.Collection('questions_users');

//dem Client folgende Aktionen erlauben
Questions_Users.allow({
	//Antwort bearbeiten falls Sie ihm gehört
	update: function(userId, question) {
		return question.userId === userId; 
	},
});

//dem Client folgende Aktionen verbieten
Questions_Users.deny({
	//er darf nur Feld "answer" bearbeiten
	update: function(userId, question, fieldNames) {
		return (_.without(fieldNames, 'answer').length > 0);
	}
});

//serverseitige Methoden zur Verfügung stellen
Meteor.methods({
	questionsusersInsert: function(postAttributes) {
		check(Meteor.userId(), String);

		check(postAttributes, {
			questionId: String,
			answer: String
		});
		
		var user = Meteor.user();

		var questions_users_entry = _.extend(postAttributes, {
			userId: user._id,
		});

		Questions_Users.insert(questions_users_entry);
	}
});
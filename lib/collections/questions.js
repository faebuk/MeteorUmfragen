//Collections für die Fragen einer Umfrage
Questions = new Mongo.Collection('questions');

//es wird definiert was der Client alles clientseitig machen kann
Questions.allow({
	//nur bearbeiten wenn die Umfrage am eingeloggten User gehört
	update: function(userId, question) {
		var poll = Polls.findOne({_id: question.pollId});
		return poll.userId === userId; 
	},
});

//definiert was Clientseitig verboten werden soll
Questions.deny({
	//der User darf clientseitig nur das Feld "question" editieren
	update: function(userId, question, fieldNames) {
		return (_.without(fieldNames, 'question').length > 0);
	}
});

//serverseitige collections methoden zur Verfügung stellen
Meteor.methods({
	questionInsert: function(postAttributes) {
		//validation überprüfen ob es ein String ist
		check(postAttributes, {
			question: String,
			pollId: String
		});
		
		var question = _.extend(postAttributes, {
			submitted: new Date()
		});

		Questions.insert(question);
	}

});
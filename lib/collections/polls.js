//Collection für die Umfragen werden erstellt
Polls = new Mongo.Collection('polls');

Polls.allow({
	update: function(userId, poll) {
		return poll.userId === userId; 
	},
});

//es werden serverseitige Methoden zum inserten und löschen erstellt,
//diese können vom Client aufgerufen werden
Meteor.methods({
	pollInsert: function(postAttributes) {
		check(Meteor.userId(), String);

		check(postAttributes, {
			title: String,
			categories: String
		});

		//schauen ob Umfrage vorhanden ist
		var pollWithSameTitle = Polls.findOne({title: postAttributes.title});
		
		if (pollWithSameTitle) {
			return {
				pollExists: true,
				_id: pollWithSameTitle._id
			}
		}
		
		var user = Meteor.user();

		//array erweitern
		var poll = _.extend(postAttributes, {
			userId: user._id,
			author: user.profile.prename+" "+user.profile.surname,
			submitted: new Date()
		});

		var pollId = Polls.insert(poll);

		return {
			_id: pollId
		};
	}, 

	pollDelete: function(postAttributes){
		Polls.remove({_id: postAttributes._id});
	}
});
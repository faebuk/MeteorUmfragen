//hier werden die Collections veröffentlicht für den Client
Meteor.publish('polls', function() {
	return Polls.find();
});

Meteor.publish('questions', function() {
	return Questions.find();
});

Meteor.publish('questions_users', function() {
	return Questions_Users.find();
});


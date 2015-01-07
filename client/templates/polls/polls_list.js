Template.pollsList.helpers({
	polls: function() {
		return Polls.find();
	}
});

//Event für click auf "Umfrage hinzufügen" Button
Template.pollsList.events({
	'click .addnew': function(e){
		e.preventDefault();

		Router.go('pollSubmit');
	}
});
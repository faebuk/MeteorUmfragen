Template.pollItem.helpers({
	//schauen ob Umfrage dem User gehört
	ownPoll: function() {
		return this.userId === Meteor.userId();
	},
	//alle Kategorien zurückgeben
	categories: function(){		
		var poll = Polls.findOne({_id: this._id}).categories;

		poll = poll.replace(/, /g, ",");

		return poll.split(",");
	}
});
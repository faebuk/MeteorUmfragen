Template.pollDelete.events({
	'click button': function(e) {
		e.preventDefault();

		Meteor.call('pollDelete', this, function(error, result) {
			if (error)
				return FlashMessages.sendError(error.reason, { hideDelay: 4000, autoScroll: true });	
			else
				Router.go('pollsList');			
		});

	}
});
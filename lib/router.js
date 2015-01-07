//es wird überprüft ob der User eingeloggt ist, falls nicht accessDenied Fehlerseite anzeigen
var requireLogin = function() {
	if (! Meteor.user()) {
		if (Meteor.loggingIn()) {
			this.render(this.loadingTemplate);
		} else {
			this.render('accessDenied');
		}
	} else {
		this.next();
	}
}

var requireNoLogin = function() {
	if (! Meteor.user()) {
		this.next();
	} else {
		this.render('accessDenied');
	}
}

//es wird geschaut ob der User die Umfrage erstellt hat
var ownPoll = function() {
	var pollId = this.params._id;
	if(Polls.findOne(pollId)){
		var poll = Polls.findOne(pollId);

		if(poll.userId === Meteor.userId()){
			this.next();
		}
		else{
			this.render('accessDenied');
		}
	}
}

var alreadyVoted = function(){
	var pollId = this.params._id;
	console.log(pollId);
	this.next();
}

//globale Einstellungen für den Router
Router.configure({
	layoutTemplate: 'layout',
	loadingTemplate: 'loading',
	notFoundTemplate: 'notFound',
	waitOn: function() { return Meteor.subscribe('polls'); },
});



/*
ab hier werden Routen für den Router konfiguriert, je nach URL
onBeforeAction überprüft ob der User die Berechtigung etc. hat (siehe Funktionen oben)
data definiert welche Daten dem Template übergeben werden
waitOn wird gewartet bis die Daten vom Server kommen, und erst dann wird die neue Seite angezeigt
*/

//default Route führt zum template "pollsList"
Router.route('/', {name: 'pollsList'});

Router.route('/user/reset', {
	name: 'userChangePw',
	onBeforeAction: requireLogin,
});

Router.route('/polls/:_id/delete', {
	name: 'pollDelete', 
	onBeforeAction: ownPoll,
	data: function(){ return Polls.findOne(this.params._id)}
});

Router.route('/polls/:_id/edit', {
	name: 'pollEdit', 
	onBeforeAction: ownPoll,
	waitOn: function() { return Meteor.subscribe('questions');},
	data: function(){ return Polls.findOne(this.params._id)}
});

Router.route('/polls/:_id/analysis', {
	name: 'pollAnalysis',
	onBeforeAction: requireLogin, 
	waitOn: function() { return [Meteor.subscribe('questions'),Meteor.subscribe('questions_users')];},
	data: function(){ return Polls.findOne(this.params._id)}
});

Router.route('/polls/:_id', {
	name: 'pollPage',
	waitOn: function() { return [Meteor.subscribe('questions'),Meteor.subscribe('questions_users')]; },
	data: function() { return Polls.findOne(this.params._id); },
	onBeforeAction: function(){
		if (! Meteor.user()) {
			if (Meteor.loggingIn()) {
				this.render(this.loadingTemplate);
			} else {
				this.render('accessDenied');
			}
		} else {
			var questions = Questions.findOne({pollId: this.params._id},{fields: {'_id':1}});

			var answers = Questions_Users.findOne({questionId: questions._id, userId: Meteor.userId()});

			if(answers){
				FlashMessages.sendSuccess("Umfrage wurde schon ausgefüllt, die Antworten können bearbeitet werden.");
			}

			this.next();
		}
	}
});

Router.route('/poll/submit', {
	name: 'pollSubmit',
	data: {errorMessage: 'You have to be logged in to view this site.'},
	onBeforeAction: requireLogin,
});

Router.route('/signup', {
	name: 'signupForm',
	data: {errorMessage: 'You have to be logged out to sign up.'},
	onBeforeAction: requireNoLogin,
});

//es wird geschaut ob es Daten in der Datenbank überhaupt vorhanden hat
Router.onBeforeAction('dataNotFound', {only: 'pollPage'});
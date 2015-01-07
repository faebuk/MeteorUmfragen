Template.questionItem.helpers({
	question_user: function(){
		return Questions_Users.findOne({questionId: this._id, userId: Meteor.userId()}, {fields: {answer:1}});
	},
});

/*neue Handlebar "equals" registrieren, kann nun als Handlebar gebraucht werden
wird gebraucht zum schauen was die Antwort ist
{{if equals wert1 wert2}}
*/
Handlebars.registerHelper('equals', function (a, b) {
  return a === b;
});
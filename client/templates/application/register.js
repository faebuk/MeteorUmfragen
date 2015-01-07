//Events für das "signupForm" template
Template.signupForm.events({
	'submit form': function(e) {
		e.preventDefault();

		//regex für 1. Zahl, 1. Grossbuchstabe, 1. Kleinbuchstabe, 1. Sonderzeichen und 8 Zeichen lang//regex für 1. Zahl, 1. Grossbuchstabe, 1. Kleinbuchstabe, 1. Sonderzeichen und 8 Zeichen lang
		var pwregex = /(?=.*\d.*)(?=.*[A-Z].*)(?=.*[a-z].*)(?=.*[!#\$%&\?].*).{8,}/;

		//inputs values auf Template holen
		var password = $(e.target).find('[name=signup-password]').val();
		var repassword = $(e.target).find('[name=signup-repassword]').val();
		
		//Validation
		if(password != repassword){
			FlashMessages.sendError("Passwörter stimmen nicht überein.", { hideDelay: 6000, autoScroll: true });
		} else if (!password || !(pwregex.test(password))){
        	FlashMessages.sendError("Passwort stimmt nicht mit dem gewünschen Format überein.", { hideDelay: 6000, autoScroll: true });
		}else{
			//User "abfüllen", für Collection insert
			var user = {
				username: $(e.target).find('[name=signup-username]').val(),
				password: password,
				email: $(e.target).find('[name=signup-email]').val(),
				profile: {
					surname: $(e.target).find('[name=signup-surname]').val(),
					prename: $(e.target).find('[name=signup-prename]').val(),
					gender: $(e.target).find('[name=signup-gender]:checked').val(),
				}
			};

			//User erstellen + Error/Success anzeigen
			Accounts.createUser(user, function(err){
				if (err) {
					//Account konnte nicht erstellt werden
					FlashMessages.sendError(err.reason, { hideDelay: 6000, autoScroll: true });
				} else {
					// Account konnte erstellt & eingeloggt werden.
					// Weiterleitung zur Route "pollsList"
					FlashMessages.sendSuccess("Erfolgreich registriert, du bist nun eingeloggt.")
					Router.go('pollsList');
				}
			});
		}
	}
});
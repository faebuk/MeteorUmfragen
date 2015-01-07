//Daten "name" gibt den eingeloggten Vorname + Nachname aus
Template.headerUser.helpers({
	name: function(){
		return Meteor.user().profile.prename+" "+Meteor.user().profile.surname;
	}
});

//sobald "Ausloggen" Button geklickt wurde
Template.headerUser.events({
	'click #logout' : function(e, t){
		e.preventDefault();

		//User ausloggen
		Meteor.logout(function(e){
			if(e){
				FlashMessages.sendError(e.reason, { hideDelay: 4000, autoScroll: true });
			}else{
				FlashMessages.sendSuccess("Erfolgreich ausgeloggt.", { hideDelay: 4000, autoScroll: true });
			}
		});
	}
});

//events für "Passwort wechseln" Formular
Template.userChangePw.events({
	//sobald die form abgesendet wurde
	'submit form': function(e, t){
		e.preventDefault();

		//regex für 1. Zahl, 1. Grossbuchstabe, 1. Kleinbuchstabe, 1. Sonderzeichen und 8 Zeichen lang
		var pwregex = /(?=.*\d.*)(?=.*[A-Z].*)(?=.*[a-z].*)(?=.*[!#\$%&\?].*).{8,}/;

		//auf dem Template inputs finden mit den IDs
		var oldpw = t.find('#inputOldPassword').value;
		var newpw = t.find('#inputNewPassword').value;
		var newrepw = t.find('#inputNewRePassword').value;

		//Validation 
		if(newpw != newrepw){
			FlashMessages.sendError("Passwörter stimmen nicht überein.", { hideDelay: 6000, autoScroll: true });
		} else if (!newpw || !(pwregex.test(newpw))){
        	FlashMessages.sendError("Passwort stimmt nicht mit dem gewünschen Format überein.", { hideDelay: 6000, autoScroll: true });
		}else{
			//Passwort wechseln + Error anzeigen
			Accounts.changePassword(oldpw, newpw, function(e){
				if(e){
					FlashMessages.sendError(e.reason, { hideDelay: 6000, autoScroll: true });
				}else{
					FlashMessages.sendSuccess("Passwort erfolgreich geändert.", { hideDelay: 6000, autoScroll: true })
					Router.go('pollsList');
				}
			});
		}		
	}
});

Template.headerLogin.events({
	'submit form' : function(e, t){
		e.preventDefault();

		// input holen
		var username = t.find('#inputUsername').value
		, password = t.find('#inputPassword').value;

		// Meteor funktion für Login
		Meteor.loginWithPassword(username, password, function(err){
			if (err){
				FlashMessages.sendError(err.reason, { hideDelay: 6000, autoScroll: true });
			}else{
				FlashMessages.clear();
				FlashMessages.sendSuccess("Erfolgreich eingeloggt.");
			}

			// The user has been logged in.
		});

		return false; 
	},
});
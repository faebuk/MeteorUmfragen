//wird aufgerufen sobald ein neuer User erstellt wird, hier wird die Validation serverseitig erledigt.
Accounts.validateNewUser(function (user) {
	var mailregex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    
    if (!user.username || !(user.username.length == 6))
        throw new Meteor.Error(403, "Benutzername muss 6 Zeichen lang sein.");
    
    if (!user.emails || !(mailregex.test(user.emails[0].address)) || !user.emails[0].address)
        throw new Meteor.Error(403, "Keine gültige Email Adresse.");
    
    if(!user.profile.prename || !(user.profile.prename.length >=3))
        throw new Meteor.Error(403, "Vorname muss ausgefüllt sein.");

    if(!user.profile.surname || !(user.profile.surname.length >=3))
    	throw new Meteor.Error(403, "Nachname muss ausgefüllt sein.");

    if(!user.profile.gender){
        throw new Meteor.Error(403, "Geschlecht muss ausgewählt sein.");
    }
    
    return true;	
});
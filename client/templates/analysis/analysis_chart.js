Template.analysisChart.helpers({
	/*
	Hier werden die Anzahl Prozente für die Auswertung ausgerechnet
	*/
	count: function(){
		var questionId = this._id;
		
		var count = Questions_Users.find({questionId: questionId}).count();

		var countyes = Questions_Users.find({questionId: questionId, answer: "yes"}).count();
		var countno = Questions_Users.find({questionId: questionId, answer: "no"}).count();
		var countyesno = Questions_Users.find({questionId: questionId, answer: "yesno"}).count();
		var countnoyes = Questions_Users.find({questionId: questionId, answer: "noyes"}).count();

		return {
			yes: (100 / count * countyes).toFixed(2),
			yesno: (100 / count * countyesno).toFixed(2),
			noyes: (100 / count * countnoyes).toFixed(2),
			no: (100 / count * countno).toFixed(2)
		};
	}
});
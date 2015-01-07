Template.pollAnalysis.helpers({
	questions: function(){
		return Questions.find({pollId: this._id});
	}
});
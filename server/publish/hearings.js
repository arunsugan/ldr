Meteor.publish("hearings_list", function(caseId) {
	if(Users.isInRoles(this.userId, ["admin","viewer"])) {
		return Hearings.find({}, {});
	}
	if(Users.isInRoles(this.userId, ["junior"])) {
		var user = Meteor.users.findOne(this.userId);
		return Hearings.find({ownerId: user.seniorId}, {});
	}
	return Hearings.find({ownerId:this.userId}, {});
});

Meteor.publish("hearings", function(caseId) {
	if(Users.isInRoles(this.userId, ["admin","viewer"])) {
		return Hearings.find({caseId:caseId}, {});
	}
	if(Users.isInRoles(this.userId, ["junior"])) {
		var user = Meteor.users.findOne(this.userId);
		return Hearings.find({caseId:caseId,ownerId:user.seniorId}, {});
	}
	return Hearings.find({caseId:caseId,ownerId:this.userId}, {});
});

Meteor.publish("hearings_empty", function() {
	if(Users.isInRoles(this.userId, ["admin","viewer"])) {
		return Hearings.find({_id:"null"}, {});
	}
	return Hearings.find({_id:null,ownerId:this.userId}, {});
});

Meteor.publish("hearing", function(hearingId) {
	if(Users.isInRoles(this.userId, ["admin","viewer"])) {
		return Hearings.find({_id:hearingId}, {});
	}
	return Hearings.find({_id:hearingId,ownerId:this.userId}, {});
});


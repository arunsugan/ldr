Meteor.publish("logs_list", function() {
	if(Users.isInRoles(this.userId, ["admin","viewer"])) {
		return Logs.find({}, {});
	}
	return Logs.find({ownerId:this.userId}, {});
});

Meteor.publish("logs", function(caseId) {
	if(Users.isInRoles(this.userId, ["admin","viewer"])) {
		return Logs.find({caseId:caseId}, {});
	}
	return Logs.find({caseId:caseId,ownerId:this.userId}, {});
});

Meteor.publish("logs_empty", function() {
	if(Users.isInRoles(this.userId, ["admin","viewer"])) {
		return Logs.find({_id:"null"}, {});
	}
	return Logs.find({_id:null,ownerId:this.userId}, {});
});

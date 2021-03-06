Meteor.publish("caseprofile_list", function() {
	if(Users.isInRoles(this.userId, ["admin","viewer"])) {
		return Caseprofile.find({"archived":{"$exists": false}}, {sort:[["caseId","desc"]]});
	}
	if(Users.isInRoles(this.userId, ["junior"])) {
		var user = Meteor.users.findOne(this.userId);
		return Caseprofile.find({ownerId: user.seniorId, "archived":{"$exists": false}}, {sort:[["caseId","desc"]]});
	}
	return Caseprofile.find({ownerId:this.userId, "archived":{"$exists": false}}, {sort:[["caseId","desc"]]});
});

Meteor.publish("caseprofileA_list", function() {
	if(Users.isInRoles(this.userId, ["admin","viewer"])) {
		return Caseprofile.find({"archived":"archived"}, {sort:[["caseId","desc"]]});
	}
	if(Users.isInRoles(this.userId, ["junior"])) {
		var user = Meteor.users.findOne(this.userId);
		return Caseprofile.find({ownerId: user.seniorId, "archived":{"$exists": false}}, {sort:[["caseId","desc"]]});
	}
	return Caseprofile.find({ownerId:this.userId, "archived":"archived"}, {sort:[["caseId","desc"]]});
});

Meteor.publish("caseprofile_empty", function() {
	if(Users.isInRoles(this.userId, ["admin","viewer"])) {
		return Caseprofile.find({_id:null}, {});
	}
	return Caseprofile.find({_id:null,ownerId:this.userId}, {});
});

Meteor.publish("caseprofile_details", function(caseId) {
	if(Users.isInRoles(this.userId, ["admin","viewer"])) {
		return Caseprofile.find({_id:caseId}, {});
	}
	if(Users.isInRoles(this.userId, ["junior"])) {
		return Caseprofile.find({_id:caseId,ownerId:this.seniorId}, {});
	}
	return Caseprofile.find({_id:caseId,ownerId:this.userId}, {});
});


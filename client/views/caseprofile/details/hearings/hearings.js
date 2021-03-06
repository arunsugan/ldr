var pageSession = new ReactiveDict();

Template.CaseprofileDetailsHearings.rendered = function() {
	
};

Template.CaseprofileDetailsHearings.events({
	
});

Template.CaseprofileDetailsHearings.helpers({
	
});

var CaseprofileDetailsHearingsViewItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("CaseprofileDetailsHearingsViewSearchString");
	var sortBy = pageSession.get("CaseprofileDetailsHearingsViewSortBy");
	var sortAscending = pageSession.get("CaseprofileDetailsHearingsViewSortAscending");
	if(typeof(sortAscending) == "undefined") sortAscending = true;

	var raw = cursor.fetch();

	// filter
	var filtered = [];
	if(!searchString || searchString == "") {
		filtered = raw;
	} else {
		searchString = searchString.replace(".", "\\.");
		var regEx = new RegExp(searchString, "i");
		var searchFields = ["businessDate", "nextDate", "description"];
		filtered = _.filter(raw, function(item) {
			var match = false;
			_.each(searchFields, function(field) {
				var value = (getPropertyValue(field, item) || "") + "";

				match = match || (value && value.match(regEx));
				if(match) {
					return false;
				}
			})
			return match;
		});
	}

	// sort
	if(sortBy) {
		filtered = _.sortBy(filtered, sortBy);

		// descending?
		if(!sortAscending) {
			filtered = filtered.reverse();
		}
	}

	return filtered;
};

var CaseprofileDetailsHearingsViewExport = function(cursor, fileType) {
	var data = CaseprofileDetailsHearingsViewItems(cursor);
	var exportFields = ["businessDate", "nextDate", "description"];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.CaseprofileDetailsHearingsView.rendered = function() {
	pageSession.set("CaseprofileDetailsHearingsViewStyle", "table");
	pageSession.set("CaseprofileDetailsHearingsViewSortBy", "lastDate");
	
};

Template.CaseprofileDetailsHearingsView.events({
	"submit #dataview-controls": function(e, t) {
		return false;
	},

	"click #dataview-search-button": function(e, t) {
		e.preventDefault();
		var form = $(e.currentTarget).parent();
		if(form) {
			var searchInput = form.find("#dataview-search-input");
			if(searchInput) {
				searchInput.focus();
				var searchString = searchInput.val();
				pageSession.set("CaseprofileDetailsHearingsViewSearchString", searchString);
			}

		}
		return false;
	},

	"keydown #dataview-search-input": function(e, t) {
		if(e.which === 13)
		{
			e.preventDefault();
			var form = $(e.currentTarget).parent();
			if(form) {
				var searchInput = form.find("#dataview-search-input");
				if(searchInput) {
					var searchString = searchInput.val();
					pageSession.set("CaseprofileDetailsHearingsViewSearchString", searchString);
				}

			}
			return false;
		}

		if(e.which === 27)
		{
			e.preventDefault();
			var form = $(e.currentTarget).parent();
			if(form) {
				var searchInput = form.find("#dataview-search-input");
				if(searchInput) {
					searchInput.val("");
					pageSession.set("CaseprofileDetailsHearingsViewSearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		Router.go("caseprofile.details.insert", {caseId: this.params.caseId});
	},

	"click #dataview-export-default": function(e, t) {
		e.preventDefault();
		CaseprofileDetailsHearingsViewExport(this.hearings, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		CaseprofileDetailsHearingsViewExport(this.hearings, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		CaseprofileDetailsHearingsViewExport(this.hearings, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		CaseprofileDetailsHearingsViewExport(this.hearings, "json");
	},

	"click #dataview-archive-button": function(e, t) {
		e.preventDefault();
		var me = this;
		bootbox.dialog({
			message: 
			'<div class="form-group  field-archive form-center">' +
				'<label for="opNotes">Archive Comment</label>' +
				'<div class="input-div">' + 
					'<input type="text" name="archiveMsg" id="archiveMsg" value="" class="form-control">' +
					'<span id="help-text" class="help-block"></span>' +
					'<span id="error-text" class="help-block">' +
					'</span></div></div>',
			title: "Move to Archive",
			animate: false,
			buttons: {
				success: {
					label: "Move",
					className: "btn-success",
					callback: function() {
						var msg = $('#archiveMsg').val();
						Caseprofile.update({ _id: t.data.caseprofile_details._id }, { $set: {'archived': 'archived', 'archivedMsg': msg} }, function(e) { if(e) alert(e);});
					}
				},
				danger: {
					label: "Cancel",
					className: "btn-default"
				}
			}
		});
		return false;
	},

	"click #dataview-restore-button": function(e, t) {
		e.preventDefault();
		var me = this;
		bootbox.dialog({
			message: 'Are you sure want to Restore?',
			title: "Restore from Archive",
			animate: false,
			buttons: {
				success: {
					label: "Yes",
					className: "btn-success",
					callback: function() {
						Caseprofile.update({ _id: t.data.caseprofile_details._id }, { $unset: {'archived': '', 'archivedMsg': ''} }, function(e) { if(e) alert(e);});
					}
				},
				danger: {
					label: "No",
					className: "btn-default"
				}
			}
		});
		return false;
	}

});

Template.CaseprofileDetailsHearingsView.helpers({

	"insertButtonClass": function() {
		return Hearings.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
	},

	"isEmpty": function() {
		return !this.hearings || this.hearings.count() == 0;
	},
	"isNotEmpty": function() {
		return this.hearings && this.hearings.count() > 0;
	},
	"isNotFound": function() {
		return this.hearings && pageSession.get("CaseprofileDetailsHearingsViewSearchString") && CaseprofileDetailsHearingsViewItems(this.hearings).length == 0;
	},
	"searchString": function() {
		return pageSession.get("CaseprofileDetailsHearingsViewSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("CaseprofileDetailsHearingsViewStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("CaseprofileDetailsHearingsViewStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("CaseprofileDetailsHearingsViewStyle") == "gallery";
	}

	
});


Template.CaseprofileDetailsHearingsViewTable.rendered = function() {
	
};

Template.CaseprofileDetailsHearingsViewTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("CaseprofileDetailsHearingsViewSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("CaseprofileDetailsHearingsViewSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("CaseprofileDetailsHearingsViewSortAscending") || false;
			pageSession.set("CaseprofileDetailsHearingsViewSortAscending", !sortAscending);
		} else {
			pageSession.set("CaseprofileDetailsHearingsViewSortAscending", true);
		}
	}
});

Template.CaseprofileDetailsHearingsViewTable.helpers({
	"tableItems": function() {
		return CaseprofileDetailsHearingsViewItems(this.hearings);
	}
});


Template.CaseprofileDetailsHearingsViewTableItems.rendered = function() {
	
};

Template.CaseprofileDetailsHearingsViewTableItems.events({
	"click td": function(e, t) {
		e.preventDefault();
		/**/
		return false;
	},

	"click .inline-checkbox": function(e, t) {
		e.preventDefault();

		if(!this || !this._id) return false;

		var fieldName = $(e.currentTarget).attr("data-field");
		if(!fieldName) return false;

		var values = {};
		values[fieldName] = !this[fieldName];

		Hearings.update({ _id: this._id }, { $set: values });

		return false;
	},

	"click #delete-button": function(e, t) {
		e.preventDefault();
		var me = this;
		bootbox.dialog({
			message: "Delete? Are you sure?",
			title: "Delete",
			animate: false,
			buttons: {
				success: {
					label: "Yes",
					className: "btn-success",
					callback: function() {
						Hearings.remove({ _id: me._id });
					}
				},
				danger: {
					label: "No",
					className: "btn-default"
				}
			}
		});
		return false;
	},
	"click #edit-button": function(e, t) {
		e.preventDefault();
		Router.go("caseprofile.details.edit", {caseId: UI._parentData(1).params.caseId, hearingId: this._id});
		return false;
	},
	"click #sendMail-button": function(e, t) {
		e.preventDefault();
		Session.set("caseProfileId", UI._parentData(1).params.caseId);
		Session.set("hearingId", this._id);
		console.log("hearing sendmail is clicked " + this._id);
		$('#sendMailModal').modal('show');
		return false;
	},
	"click #btn-approve": function(e, t) {
		//updated approved status as yes
		console.log("[INFO] updated approved status");
		Hearings.update({ _id: this._id }, { $set: {"approved": "yes"} });
		Hearings.update({ _id: this._id }, { $unset: {"resendMsg": ""} });
	},
	"click #btn-resend": function(e, t) {
		var me = this;
		bootbox.dialog({
			message: '<label class="col-md-4 control-label" for="msg">Reason?</label> ' +
			'<input id="msg" name="msg" type="text" placeholder="Your Message" class="form-control input-md"> ',
			title: "Resend",
			animate: false,
			buttons: {
				success: {
					label: "Send",
					className: "btn-success",
					callback: function() {
						var msg = $('#msg').val();
						Hearings.update({ _id: me._id }, { $set: {"approved": "resend", "resendMsg": msg} });
						alert("Resend is clicked", msg);
						//Hearings.remove({ _id: me._id });
					}
				},
				danger: {
					label: "Cancel",
					className: "btn-default"
				}
			}			
		});
	//	Hearings.update({ _id: this._id }, { $set: {"approved": "resend"} });
	},
	"click #btn-remove": function (e, t) {
		//can be removed
		e.preventDefault();
		var me = this;
		bootbox.dialog({
			message: "Reject? Are you sure?",
			title: "Reject",
			animate: false,
			buttons: {
				success: {
					label: "Yes",
					className: "btn-success",
					callback: function() {
						Hearings.remove({ _id: me._id });
					}
				},
				danger: {
					label: "No",
					className: "btn-default"
				}
			}
		});
		return false;
	}
});

Template.CaseprofileDetailsHearingsViewTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return Hearings.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function(d1, d2) {
		// var retVal = "";
		// console.log("Last hearing in delete", d1, d2);	
		// if(d1.getTime() == d2.getTime()) {
		// 	console.log("Equal");
			return Hearings.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
		// } else {
		// 	console.log("Not ======== Equal");
		// 	return "hidden";
		// }
	},
	"approvalStatus": function(val) {
		console.log("[INFO] approvalStatus ", val);
		//return false if status is approved
		if(val == "yes") {
			console.log("return empty");
			return "";
		}
		console.log("return value");
		return val;
	}
});

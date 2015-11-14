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
		Router.go("caseprofile.details.edit", {caseId: UI._parentData(1).params.caseId, caseId: this._id});
		return false;
	},
	"click #sendMail-button": function(e, t) {
		e.preventDefault();
		$('#sendMailModal').modal('show');
		return false;
	}
});

Template.CaseprofileDetailsHearingsViewTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return Hearings.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return Hearings.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	}
});

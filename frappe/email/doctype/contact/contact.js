// Copyright (c) 2016, Frappe Technologies and contributors
// For license information, please see license.txt


cur_frm.email_field = "email_id";
frappe.ui.form.on("Contact", {
	refresh: function(frm) {
		if(frm.doc.__islocal) {
			var last_route = frappe.route_history.slice(-2, -1)[0];
			if(frappe.contact_link && frappe.contact_link.doc
					&& frappe.contact_link.doc.name==last_route[2]) {
				frm.add_child('links', {
					link_doctype: frappe.contact_link.doctype,
					link_name: frappe.contact_link.doc[frappe.contact_link.fieldname]
				});
			}
		}

		if(!frm.doc.user && !frm.is_new() && frm.perm[0].write) {
			frm.add_custom_button(__("Invite as User"), function() {
				frappe.call({
					method: "erpnext.utilities.doctype.contact.contact.invite_user",
					args: {
						contact: frm.doc.name
					},
					callback: function(r) {
						frm.set_value("user", r.message);
					}
				});
			});
		}
	},
	validate: function(frm) {
		// clear linked customer / supplier / sales partner on saving...
		if(frm.doc.links) {
			frm.doc.links.forEach(function(d) {
				frappe.model.remove_from_locals(d.link_doctype, d.link_name);
			});
		}
	}
});
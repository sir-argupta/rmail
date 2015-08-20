var alt = require('../alt');

var MailThreadActionCreators = require('../actions/MailThreadActionCreators');
var ContextMenuActionCreators = require('../actions/ContextMenuActionCreators');

function CheckedEmailStore() {
  this.bindActions(MailThreadActionCreators);
  this.bindActions(ContextMenuActionCreators);

  this.checkedMails = {
    inbox: {},
    spam: {},
    sent: {}
  };

  this.exportPublicMethods({

    isChecked: function(boxName, id) {
      return id in this.getState().checkedMails[boxName];
    },

    getCheckedMails: function(boxName) {
      return Object.keys(this.getState().checkedMails[boxName]);
    }

  });
}

CheckedEmailStore.prototype.onAddCheck = function(obj) {
  var box = this.checkedMails[obj.name];
  var mail;
  var i;
  var len = obj.mailList.length;

  if (len < 1) {
    return false;
  }

  for (i = 0; i < len; i++) {
    mail = obj.mailList[i];

    if (mail.isChecked) {
      box[mail.id] = true;
    } else {
      delete box[mail.id];
    }
  }
};

CheckedEmailStore.prototype.onShowMenu = function(obj) {
  var box = this.checkedMails[obj.name];

  if (obj.id in box) {
    return false;
  }

  this.checkedMails[obj.name] = {};
  this.checkedMails[obj.name][obj.id] = true;
};

CheckedEmailStore.prototype.onDelete = function(obj) {
  var box = this.checkedMails[obj.name];
  if (!obj.id in box) {
    return false;
  }
  delete box[obj.id];
};

module.exports = alt.createStore(CheckedEmailStore, 'CheckedEmailStore');

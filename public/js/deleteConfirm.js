// Kudos Paul Wilkins for the code on this form confirmation dialog box

$(function () {
    'use strict';

    function confirmDialog(title, message, success) {
        var confirmdialog = $('<div></div>').appendTo('body')
            .html('<div><h6>' + message + '</h6></div>')
            .dialog({
                dialogClass: "no-close",
                modal: true,
                title: title,
                zIndex: 10000,
                autoOpen: false,
                width: 'auto',
                resizable: false,
                buttons: {
                    Yes: function () {
                        success();
                        $(this).dialog("close");
                    },
                    No: function () {
                        $(this).dialog("close");
                    }
                },
                close: function() {
                    $(this).remove();
                }
            });

        return confirmdialog.dialog("open");
    }

    $('form').on('submit', function (e) {
        e.preventDefault();
        var form = this;

        confirmDialog('Confirm', 'Are you sure you want to delete this?', function () {
            form.submit();
        });
    });
});
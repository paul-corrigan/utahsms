$( function() {
   $( ".datepicker" ).datepicker({ dateFormat: 'yy-mm-dd'});
} );

$('.datepicker').on('focus', function(e) {
   e.preventDefault();
   $(this).attr("autocomplete", "off");  
});

$('#start_time').timepicker({
    timeFormat: 'HH:mm',
    interval: 30,
    minTime: '6',
    maxTime: '23',
    defaultTime: '11',
    startTime: '00:00',
    dynamic: false,
    dropdown: true,
    scrollbar: false
});
  
$('#end_time').timepicker({
    timeFormat: 'HH:mm',
    interval: 30,
    minTime: '6',
    maxTime: '23',
    defaultTime: '16',
    startTime: '00:00',
    dynamic: false,
    dropdown: true,
    scrollbar: false
});
//   var value = (evt.hour || '00') + ':' + (evt.minute || '00');
//   evt.element.value = value;

$('.multi-field-wrapper').each(function() {
    var $wrapper = $('.multi-fields', this);
    $(".add-field", $(this)).click(function(e) {
        $('.multi-field:first-child', $wrapper).clone(true).appendTo($wrapper).find('input').val('').focus();
    });
    $('.multi-field .remove-field', $wrapper).click(function() {
        if ($('.multi-field', $wrapper).length > 1)
            $(this).parent('.multi-field').remove();
    });
});

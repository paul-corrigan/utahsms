

// this bit of genius provided on jsFiddle by Tushar Gupta - not sure how else to thank him
// it limits the burn window to seven total days depending on the start date
$(document).ready(function () {
    var d = new Date();
    var monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    today = monthNames[d.getMonth()] + ' ' + d.getDate() + ' ' + d.getFullYear();

    $('#to').attr('disabled', 'disabled');
    $('#from').datepicker({
        defaultDate: "+2d",
//         minDate: 1,
        maxDate: "+3M",
        dateFormat: 'yy-mm-dd',
        showOtherMonths: true,
        changeMonth: true,
        selectOtherMonths: true,
        required: true,
        showOn: "focus",
        numberOfMonths: 1,
    });

    $('#from').change(function () {
        var from = $('#from').datepicker('getDate');
        var date_diff = Math.ceil((from.getTime() - Date.parse(today)) / 86400000);
        var maxDate_d = date_diff+6+'d';
        date_diff = date_diff + 'd';
        $('#to').val('').removeAttr('disabled').removeClass('hasDatepicker').datepicker({
            dateFormat: 'yy-mm-dd',
            minDate: date_diff,
            maxDate: maxDate_d
        });
    });

//     $('#to').keyup(function () {
//         $(this).val('');
//         alert('Please select end date');
//     });
//     $('#from').keyup(function () {
//         $('#from,#to').val('');
//         $('#to').attr('disabled', 'disabled');
//         alert('Please select start date');
//     });

});

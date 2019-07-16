function addSpaces(initial){
        initial.replace("/([0-9]{3})/","\1 ");
        initial.replace("/[0-9]{3} ([0-9]{3})/","\1 ");
        return initial;
    }

$(".chosen-select").chosen();

$(".phone").focus();
$(".phone")[0].setSelectionRange(0,0);

// call a function from the inputmask.js script to insert parentheses and dashes in the right place so user doesn't have to think about it
jQuery(function($){
    $(".phone").mask("(999) 999-9999");
    // the script puts the cursor at the end of the line so these lines move it to the beginning
    $(".phone").focus();
    $(".phone")[0].setSelectionRange(0,0);

});


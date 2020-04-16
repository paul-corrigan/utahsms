function addSpaces(initial){
        initial.replace("/([0-9]{3})/","\1 ");
        initial.replace("/[0-9]{3} ([0-9]{3})/","\1 ");
        return initial;
    }

$(".chosen-select").chosen();

// $(function() {
//   $("#sortableTable").tablesorter();
// });

// $(function() {
  
$(document).ready( function () {
    $('#sortableTable').DataTable({
      "order" : [],
      paging: false,
      
    });
} );

//https://datatables.net/reference/option/columns.orderData

// $('#sortableTable').dynatable({
//   features: {
//     paginate: false,
    
    
//   },
//   inputs: {
//     queries: $('#search-agency')
//   }
  
// });

// $(document).ready(function() {
//     // Setup - add a text input to each footer cell
//     $('#sortableTable thead tr').clone(true).appendTo( '#sortableTable thead' );
//     $('#sortableTable thead tr:eq(1) th').each( function (i) {
//         var title = $(this).text();
//         $(this).html( '<input type="text" placeholder="Search '+title+'" />' );
 
//         $( 'input', this ).on( 'keyup change', function () {
//             if ( table.column(i).search() !== this.value ) {
//                 table
//                     .column(i)
//                     .search( this.value )
//                     .draw();
//             }
//         } );
//     } );
 
//     var table = $('#sortableTable').DataTable( {
//         orderCellsTop: true,
//         fixedHeader: true,
//         "dateCol": [
//           {"dateDisplay": 1}, // Date format DD/MM/YYYY, sorting dependent on index 1
//           {"dateSort": false}, // Date format YYYY/MM/DD (datatable default) made hidden.
//         ]
      
      
//     } );
// } );


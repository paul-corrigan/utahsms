$( function() {
   $( ".datepicker" ).datepicker({ dateFormat: 'yy-mm-dd'});
} );

$('.datepicker').on('focus', function(e) {
   e.preventDefault();
   $(this).attr("autocomplete", "off");  
});

$().ready(function() {
  //validate new project form on keyup and submit
  $("#newProjectForm").validate({
    rules: {
      project_name: "required",
      project_acres: "required",
      burn_type: "required",
      agency_id: "required",
      county_id: "required",
      inputLat: {
          required: true,
          min: 0,
          max: 90
      },
       inputLong: {
          required: true,
          min: -180,
          max: 0
      },    
      airshed_id: "required",
      fuel_model: "required",
      ignition_method: "required",
      ert: "required",
      objectives: "required",
      elevation_low: "required",
      elevation_high: "required",
      pm_max: "required",
      first_burn: "required",
      
    },
    messages: {
      project_name: "Please enter a project name",
      project_acres: "Please enter project acres",
      inputLat: "Please enter valid project latitude, 0-90",
      inputLong: "Please enter valid negative longitude",
      burn_type: "Select a burn type",
      agency_id: "Select an agency",
      county_id: "Select a county",
      airshed_id: "Select an airshed",
      fuel_model: "Select a fuel model",
      ignition_method: "Select an ignition method",
      ert: "Select an ERT",
      objectives: "Select at least one objective",
      elevation_low: "Please enter low elevation",
      elevation_high: "Please enter high elevation",
      pm_max: "Please enter estimated PM",
      first_burn: "Please enter earliest burn date",
      
    }
  });
  
  
});


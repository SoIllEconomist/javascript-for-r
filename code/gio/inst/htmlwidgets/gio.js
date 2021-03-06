HTMLWidgets.widget({

  name: 'gio',

  type: 'output',

  factory: function(el, width, height) {

    // TODO: define shared variables for this instance
    var controller;

    // selection handle
    var sel_handle = new crosstalk.SelectionHandle();

    sel_handle.on("change", function(e) {
      if (e.sender !== sel_handle) {
        // clear selection
      }
      controller.switchCountry(e.value[0]);
    });


    return {

      renderValue: function(x) {

        el.innerHTML = '';
        controller = new GIO.Controller(el, x.configs);

        // group
        sel_handle.setGroup(x.crosstalk.group);
        
        // add data
        controller.addData(x.data);

        controller.setStyle(x.style);

        // callback
        controller.onCountryPicked(callback);

        function callback (selectedCountry, relatedCountries) {
          sel_handle.set([selectedCountry.ISOCode]);
          Shiny.setInputValue(el.id + '_selected', selectedCountry);
          Shiny.setInputValue(el.id + '_related:gio.related.countries', relatedCountries);
        }

        // use stats
        if(x.stats)
          controller.enableStats();

        // render
        controller.init();

      },

      resize: function(width, height) {

        // TODO: code to re-render the widget with a new size
        controller.resizeUpdate()

      },

      getGlobe: function(){
        return controller;
      }

    };
  }
});

// retrieve widget
function get_gio(id){
  var widget = HTMLWidgets.find("#" + id);
  var globe = widget.getGlobe();
  return globe;
}

// check if shiny running
if (HTMLWidgets.shinyMode){

  // send-data message handler
  Shiny.addCustomMessageHandler(type = 'send-data', function(message) {
    var controller = get_gio(message.id);
    controller.addData(message.data);
  });

  // clear data message handler
  Shiny.addCustomMessageHandler(type = 'clear-data', function(message) {
    var controller = get_gio(message.id);
    controller.clearData();
  });

  // set style message handler
  Shiny.addCustomMessageHandler(type = 'set-style', function(message) {
    var controller = get_gio(message.id);
    controller.setStyle(message.style);
    controller.update();
  });

}

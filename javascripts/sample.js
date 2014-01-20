$(document).ready(function() {

  function selectItem($item,type) {
    var count = $(".selected-" + type + " li").length;
    if (type == 'style') {
      count < 2 ? $item.appendTo(".selected-" + type + " ul") : alert('You may only select 2 car styles.');
    } else {
      count < 3 ? $item.appendTo(".selected-" + type + " ul") : alert('You may only select 3 car brands.');
    }
  }

  function returnItem($item,type) {
    $item.appendTo("." + type + "-draggable ul");
  }

  var types = ['style','brand'];

  $.each(types, function(item, index) {

    var type = index;

    $('.' + type + '-draggable li').draggable({
      revert: "invalid",
      helper: "clone",
      cursor: "move"
    });
    
    $('.' + type + '-draggable').droppable({
      accept: ".selected-" + type + " li",
      drop: function(event,ui) {
        returnItem(ui.draggable,type)
      }
    });

    $('.selected-' + type).droppable({
      accept: '.' + type + '-draggable li',
      drop: function( event, ui) {
        selectItem(ui.draggable,type);
      }
    });

  });

  function showModels() {
    var brands = [];
    var styles = [];

    $('.selected-brand a').each(function(){
      brands.push($(this).attr('data-brand'));
    });

    $('.selected-style a').each(function(){
      styles.push($(this).attr('data-style'));
    });

    $('.list').remove();

    var hash = (function() {
      var keys = {};
      return {
          contains: function(key) {
              return keys[key] === true;
          },
          add: function(key) {
              if (keys[key] !== true)
              {
                  keys[key] = true;
              }
          }
      };
    })();

    $.getJSON("javascripts/cars.json", function(data){
      $.each(brands,function(i,id){ 
        $.each(data.cars, function(n,item){
          if (item.brand_id == id){
            var $car_list = "<div class='col-md-4 vmm list text-center'><div class='box'><div class='heading'><h5 class='panel-title'>" + item.brand_title + "</h5></div><ul class='list-group car-list" + item.brand_id + "'></ul></div></div>";
            $('.results').append($car_list);
            $.each(item.styles, function(s,style){
              $.each(styles,function(m,model){
                if (style.style_id == model) {
                  var models = [];
                  var key = null; 
                  $.each(style.models, function(p,pushit){
                    key = pushit.title;
                    if (!hash.contains(key)) {
                      models.push("<li class='list-group-item'>" + pushit.title + "</li>");
                      hash.add(key);
                    }
                  });
                  $('.car-list' + item.brand_id).append(models);
                }
              });
            });
          }
        });
      });
    }).error(function(jqXhr, textStatus, error) {
                alert("ERROR: " + textStatus + ", " + error);
    });
  }

  $('.show-models').on('click',showModels);

});


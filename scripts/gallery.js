
  
function slideShow() {  
  
    //Set the opacity of all images to 0  
    $('#gallery a').css({opacity: 0.0});  
      
    //Get the first image and display it (set it to full opacity)  
    $('#gallery a:first').css({opacity: 1.0});  
      
    //Call the gallery function to run the slideshow, 6000 = change to next image after 6 seconds  
    setInterval('gallery()',4000);  
      
}  
  
function gallery() {  
      
    //if no IMGs have the show class, grab the first image  
    var current = ($('#gallery a.show')?  $('#gallery a.show') : $('#gallery a:first'));  
  
    //Get next image, if it reached the end of the slideshow, rotate it back to the first image  
    var next = ((current.next().length) ? ((current.next().hasClass('caption'))? $('#gallery a:first') :current.next()) : $('#gallery a:first'));     
      
      
    //Set the fade in effect for the next image, show class has higher z-index  
    next.css({opacity: 0.0})  
    .addClass('show')  
    .animate({opacity: 1.0}, 1000);  
  
    //Hide the current image  
    current.animate({opacity: 0.0}, 1000)  
    .removeClass('show');  
          
}  

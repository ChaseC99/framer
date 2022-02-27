// GLOBAL VARIABLES
var cropper;    // Cropper instance of profile pic
var frameImg;   // The frame for the image


// ENTRY POINT
// When the page loads, loadFrameImg will be called 
// to load the frame into the canvas
this.onload = (() => {loadFrameImg()})


// GET CONTEXT
// Fetch the context from the canvas
// Returns a context object
const getContext = () => document.getElementById('framed').getContext('2d');


// GET PROFILE PIC
// Fetch the profile-pic element
const getProfilePic = () => document.getElementById('profile-pic');


// DRAW FRAMED PIC
// Draw the profile picture within the frame
// If pic is undefined, only the frame will be drawn
const drawFramedPic = (frame, pic) => {
    const ctx = getContext()

    // Set size of the canvas for the framed picture
    // as the same sized of the framed image
    const {height, width} = frame
    ctx.canvas.width = width
    ctx.canvas.height = height;

    // Draw the profile picture if it exists
    if (pic && pic.width > 0 && pic.height > 0) { 
        ctx.drawImage(pic, 0, 0, height, width); 
    }
    // Draw the frame
    ctx.drawImage(frame, 0, 0);
}


// GENERATE PROFILE PICTURE CROPPER
// Using the profile-pic img, generate a cropper object around it
const generateProfilePictureCropper = () => {
    const image = getProfilePic()
    const {width, height} = frameImg;

    // Show crop-containter
    document.getElementById("crop-container").style.display = "block"

    // Create the cropper object and save it to the global variable
    cropper = new Cropper(image, { 
        aspectRatio: width/height,
        zoomable: false,
        guides: false,
        background: false,
        toggleDragModeOnDblclick: false,
        crop() {
            // On a crop change, redraw the framed picture with the new cropped pic
            drawFramedPic(frameImg, this.cropper.getCroppedCanvas())
        }
    })
}


// CREATE FRAME
// This is only called once at the beginning of the session.
// Saves the frame image as a global variable
// Draws the framed pic with a profile pic
const createFrame = (frame) => {
    frameImg = frame                    // Save frame as global variable
    drawFramedPic(frameImg, undefined)  // Draw the framed picture without a profile pic
}


// LOAD FRAME IMG
// Frame image is loaded from the URL parameters
// This parses the url, fetch the image, and draws it within the frame
const loadFrameImg = () => {
    let frameImg = new Image()
    frameImg.onload = () => createFrame(frameImg, undefined);

    // Fetch the frameImg src from the url paramaters
    // URL is structured like "?frameURL=" so we need to ignore the first 10 chars
    frameImg.src = decodeURIComponent(window.location.search.substr(10));
}


// LOAD PICTURE
// This is the onlick function for loading an image from the client
// Onload, it will call generateProfilePictureCropper
const loadPicture = (input) => {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = (e) => {
            var profilePic = getProfilePic()
            profilePic.src = e.target.result;
            generateProfilePictureCropper()
        };

        reader.readAsDataURL(input.files[0]);
    }
}


// DOWNLOAD FRAMED PICTURE
// Save the canvas as an image to the client's computer
//
// NOTE: Not working right now due to CORS... user can still right click on the image to save it
const downloadFramedPicture = () => {
    var canvas = document.getElementById("framed");
    image = canvas.toDataURL("image/png", 1.0).replace("image/png", "image/octet-stream");
    window.location.href=image; 
}

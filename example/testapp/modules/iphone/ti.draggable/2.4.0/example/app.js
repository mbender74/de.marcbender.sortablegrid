var Draggable = require('ti.draggable');

var mainWindow = Ti.UI.createWindow({
	backgroundColor : 'white',
	exitOnClose : true,
	fullscreen : true
});

var scrollView = Ti.UI.createScrollView({
	contentWidth : Ti.UI.FILL,
	contentHeight : Ti.UI.SIZE
});

// create a grid of views
for (var c = 1; c <= 5; c++) {
	for (var r = 0; r < 20; r++) {
		var view = Draggable.createView({
			left : ((c - 1) * 20) + '%',
			top : (r * 100),
			width : '20%',
			height : 100,
			draggableConfig : {
				enabled : false, // disabled by default
				enableOnLongpress : true, // enable the dragging on a longpress touch event
				showShadowOnMove : true // show a drop shadow while dragging the view
			},
			backgroundColor : '#' + Math.floor(Math.random() * 16777215).toString(16)
		});

		scrollView.add(view);
		
		// events
		view.addEventListener("start", function() {
			// lock the scrollView
			scrollView.scrollingEnabled = false;

		});
		view.addEventListener("end", function() {
			// unlock the scrollView
			scrollView.scrollingEnabled = true;
		});

		view.addEventListener("move", eventCallback);
		view.addEventListener("cancel", eventCallback);
	}
}

function eventCallback(e) {
	Ti.API.info(e);
}

mainWindow.add(scrollView);
mainWindow.open();

var cirularProgressModule = require("ti.circularprogress");
 var SortableView = require("/lib/SortableView");
 var fontawesome = require('/lib/IconicFont').IconicFont({font: '/lib/FontAwesome',ligature: false});

 var sortableGridModule = require("de.marcbender.sortablegrid");

var sliderModule = require("de.marcelpociot.circularslider");
var gridView;
var tr_init = Titanium.UI.createMatrix2D();
var tr_second = Titanium.UI.createMatrix2D();
var tr_third = Titanium.UI.createMatrix2D();

var tr_start = tr_init.rotate(-1,0);
var tr_anim = tr_second.rotate(2,0);
var tr_end = tr_third.rotate(-2,0);
var wobbeling = false;

var gridCells = [];


function createRemoveButton(parent){
		

	var removeButtonContainer = viewFunc.createView({
		parentCell:parent,
		visible:true,
		height:Ti.UI.SIZE,
		width:Ti.UI.SIZE,
		top:0,
		right:0,
		zIndex:200
	});

	var removeImageButtonContainer = viewFunc.createView({
		backgroundColor:'#d0d0d0',
		
		touchEnabled:false,
		bubbleParent:true
	});


	var removeImageButton = Ti.UI.createImageView({
		width: Ti.UI.SIZE,
		height: 34,
		touchEnabled:false,
		bubbleParent:true
	});
	Ti.UI.createLabel({
		width: Ti.UI.SIZE,
		height: Ti.UI.SIZE,
		color : 'rgba(63, 69, 81, 0.8)',
		textAlign:'center',
		font: {
			fontSize: 26,
			fontFamily: fontawesome.fontfamily()
		},
		text: fontawesome.icon('fa-minus-circle')
	}).toImage(function(e){
		var newDim = Math.ceil(e.width/2);
		removeImageButton.image = e;
		removeImageButtonContainer.applyProperties({
			width:34,
			height:34,
			borderRadius:17
			//borderRadius:Math.ceil(newDim/2)	
		})
	},true);


	
	removeImageButtonContainer.add(removeImageButton);
	removeButtonContainer.add(removeImageButtonContainer);
	

	removeButtonContainer.addEventListener('touchstart', function(e){
		removeImageButton.opacity = 0.8;
		removeImageButton.tintColor = 'red';
	});

	removeButtonContainer.addEventListener('touchend', function(e){
		removeImageButton.opacity = 1.0;		
		removeImageButton.tintColor = null;	
	});

	removeButtonContainer.addEventListener('touchcancel', function(e){
		removeImageButton.opacity = 1.0;		
		removeImageButton.tintColor = null;	
	});



	return removeButtonContainer;
}



function shake(view) {
	view.firstRun = true;

	//Translation to start from
	view.transform = tr_start;
	
	//Animation
	var a = Titanium.UI.createAnimation();
	a.curve = Titanium.UI.ANIMATION_CURVE_EASE_IN_OUT;
	a.transform = tr_anim;
	a.duration = 125;
	a.autoreverse = true;
	a.repeat = 2000;
	a.delay = 0;

	//Return to initial position
	a.addEventListener('complete',function() {
		if (completeCounter == cells.length-1){
			editMode(false);
			completeCounter = 0;
		}
		else {
			completeCounter++;
		}
	});
	view.wobbleAnimation = a;
	//Execute Animation
	view.animate(a);
  }

 function wobble(){
	for (var i = 0; i < gridCells.length; i++) {
		shake(gridCells[i]);
		// cells[i].draggable.setConfig({
		// 	enabled : true
		// });
	}
 }
  
 var editMode = function(status) {
	if (status == false){
		var restTR = Titanium.UI.createMatrix2D();
		restTR.rotate(-2,0);

		for (var i = 0; i < gridCells.length; i++) {
			//cells[i].removeButton.hide();

			// if (!isAndroid){
			// 	cells[i].cellContent.stopAnimations();
			// 	cells[i].cellContent.transform = restTR;
			// }
			// else {
				gridCells[i].stopAnimation();
			//}

			// cells[i].draggable.setConfig({
			// 	enabled : true
			// });	
		}
		wobbeling = false;
	}
	
 }









function getRandomColor() {
	var letters = '0123456789ABCDEF';
	var color = '#';
	for (var i = 0; i < 6; i++) {
	  color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
  }

var isAndroid = false;
if(Ti.Platform.osname == 'android'){
	isAndroid = true;
	var androidClipView = require('ti.clipview');
	var viewFunc = {};
	viewFunc.createView = function(params){
		return androidClipView.createClipView(params);
	}
}
else {
	var viewFunc = {};
	viewFunc.createView = function(params){
		return Ti.UI.createView(params);
	}
}

var win = Ti.UI.createWindow({backgroundColor: '#fff'});
var btn = Ti.UI.createButton({title: "animate from 0", bottom: 50});
var btn2 = Ti.UI.createButton({title: "set random value", bottom: 100});
var btn3 = Ti.UI.createButton({title: "change track", bottom: 150});
var lbl = Ti.UI.createLabel({
  color: '#bbffffff',
  width:Ti.UI.SIZE,
  height:Ti.UI.SIZE,
  textAlign:Ti.UI.TEXT_ALIGNMENT_CENTER,
  font: {
    fontFamily : 'Arial',
    fontSize: 44,
    fontWeight: 'bold',
  },
  shadowColor: '#77000000',
  shadowRadius: 4,
  shadowOffset: {
    x: 1,
    y: 1
  },
  text: ''
});

var circularProgessView = cirularProgressModule.createCircularProgress({
	height: 200,
	width: 200,
	trackColor: '#777',
	progressColor: ['#f00', "#ff0"],
	roundedCorners: false,
	progressWidth: 20,
	trackWidth: 10,
	duration: 0,
	progressValue: 10,
	gradientRotateSpeed: 1.0,
	glowAmount: 0.2,
});

circularProgessView.addEventListener('done', function() {
	console.log("reached end value");
	lbl.text = circularProgessView.progressValue + "%";
});

circularProgessView.addEventListener('progress', function(e) {
  console.log("progress: ", e.progress);
	lbl.text = Math.round(e.progress) + "%";
});

btn.addEventListener("click", function() {
	circularProgessView.animateProgress({
		startValue: 0,
		endValue: 100,
		duration: 2000
	});
})

btn2.addEventListener("click", function() {
	var rnd = Math.round(Math.random() * 100);
	circularProgessView.progressValue = rnd;
	lbl.text = rnd + "%";
})

btn3.addEventListener("click", function() {
	circularProgessView.trackWidth = Math.round(Math.random() * 10) + 10;
	circularProgessView.progressWidth = Math.round(Math.random() * 10) + 10;
  circularProgessView.roundedCorners = circularProgessView.roundedCorners == true ? circularProgessView.roundedCorners = false : circularProgessView.roundedCorners = true;

  console.log("trackWidth: ", circularProgessView.trackWidth);
  console.log("progressWidth: ", circularProgessView.progressWidth);
  console.log("roundedCorners: ", circularProgessView.roundedCorners);


})

//win.add([circularProgessView, btn, btn2, btn3, lbl]);

function createGridDashBoardViews(size){
	var sortableViewData = [];
	for (var i = 0; i < size; i++){

	   var v = viewFunc.createView({
		  id:i,
		  height:110,
		  width:110,
		  borderRadius: 14,
		  borderWith:1,
		  borderColor:'#ccffffff',
		  backgroundColor:getRandomColor()
	   });
	   v.add(Ti.UI.createLabel({
		  text: 'Cell ' + (i+1),
		  color: '#bbffffff',
		  width:Ti.UI.SIZE,
		  height:Ti.UI.SIZE,
		  textAlign:Ti.UI.TEXT_ALIGNMENT_CENTER,
		  font: {
			  fontFamily : 'Arial',
			  fontSize: 18,
			  fontWeight: 'bold',
		  },
		  shadowColor: '#CC000000',
		  shadowRadius: 4,
		  shadowOffset: {
			  x: 1,
			  y: 1
		  }
		}));
		// v.addEventListener('longpress', function(e){
		// 	if (wobbeling == false){
		// 		wobbeling = true;
		// 		wobble();
		// 	}
		// 	else {
		// 		editMode(false);
		// 	}
		// });

		var removeButton = createRemoveButton(v);

		removeButton.addEventListener("click",function(e){
			gridView.deleteItem(this.parentCell.id);
		});
		v.add(removeButton);

		sortableViewData.push(v);	
	}
	return sortableViewData;
   }


function createDashBoardButtons(size){
	var sortableViewData = [];
	for (var i = 0; i < size; i++){
	   
	   var touchStartAnim = Titanium.UI.createAnimation({
		  duration: 180,
		  opacity: 0.7
		});
	   var touchEndAnim = Titanium.UI.createAnimation({
		  duration: 180,
		  opacity: 1.0
	   });
	   var v = viewFunc.createView({
		  height:90,
		  width:90,
		  borderRadius: 14,
		  borderWith:1,
		  borderColor:'#ccffffff',
		  backgroundColor:getRandomColor(),
		  touchEnabled:false,
		  bubbleParent:false
	   });
	   v.add(Ti.UI.createLabel({
		  text: 'Cell ' + (i+1),
		  color: '#bbffffff',
		  width:Ti.UI.SIZE,
		  height:Ti.UI.SIZE,
		  textAlign:Ti.UI.TEXT_ALIGNMENT_CENTER,
		  font: {
			  fontFamily : 'Arial',
			  fontSize: 18,
			  fontWeight: 'bold',
		  },
		  shadowColor: '#CC000000',
		  shadowRadius: 4,
		  shadowOffset: {
			  x: 1,
			  y: 1
		  },
		  touchEnabled:false,
		  bubbleParent:false
		}));
		// v.addEventListener('touchstart', function(e){
		// 	  this.animate(touchStartAnim);
		// });
		// v.addEventListener('touchend', function(e){
		// 	  this.animate(touchEndAnim);
		// });
		// v.addEventListener('touchcancel', function(e){
		// 	  this.animate(touchEndAnim);
		// });
		sortableViewData.push(v);	
	}
	return sortableViewData;
   }



  var sortableView = new SortableView({
	height:Ti.UI.SIZE,
	width:Ti.UI.SIZE,
	top:20,
//	left:0,
//	right:0,
	data: createDashBoardButtons(15), //array of views
	cellBorderRadius:14,
	cellShowShadowOnMove:true,
	cellBackgroundColor:'#55000000',
	cellWidth:90,
	cellHeight:90,
	columnPadding:8, //Space in between two columns
	rowPadding:8, //Space in between two rows
	columns:3, //Number of columns	
	//clipMode:Ti.UI.iOS.CLIP_MODE_DISABLED
});

gridCells = createGridDashBoardViews(10);

gridView = sortableGridModule.createView({
	height:Ti.UI.FILL,
	width:Ti.UI.FILL,
	top:30,
	bottom:30,
	left:0,
	right:0,
	backgroundColor:'transparent',
	data:gridCells
})


win.add(gridView);



// var sliderView = sliderModule.createView({
// 	height: 250,
// 	width: 250,
// 	backgroundColor:'red',
// 	lineWidth: 24,
// 	filledColor: 'blue',
// 	unfilledColor: 'grey'
// });
// sliderView.addEventListener('change',function(e){
// 	Ti.API.info( "Value is: ", e.value );
// });
//win.add( sliderView );


win.open();
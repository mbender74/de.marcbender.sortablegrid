var cirularProgressModule = require("ti.circularprogress");
 var SortableView = require("/lib/SortableView");

var sortableGridModule = require("de.marcbender.sortablegrid");


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

	   var v = Ti.UI.createView({
		  height:Ti.UI.FILL,
		  width:Ti.UI.FILL,
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


var gridView = sortableGridModule.createView({
	height:Ti.UI.FILL,
	width:Ti.UI.FILL,
	top:20,
	backgroundColor:'red',
	items:createGridDashBoardViews(10)
})


win.add(gridView);


win.open();
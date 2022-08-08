var fontawesome = require('/lib/IconicFont').IconicFont({font: '/lib/FontAwesome',ligature: false});
var sortableGridModule = require("de.marcbender.sortablegrid");

var gridView;
var tr_init = Titanium.UI.createMatrix2D();
var tr_second = Titanium.UI.createMatrix2D();
var tr_third = Titanium.UI.createMatrix2D();

var tr_start = tr_init.rotate(-1,0);
var tr_anim = tr_second.rotate(2,0);
var tr_end = tr_third.rotate(-2,0);
var wobbeling = false;

var gridCells = [];
var isAndroid = false;
if(Ti.Platform.osname == 'android'){
	isAndroid = true;
}

var isEditable = false;

function generateRandomInteger(min, max) {
	return Math.floor(min + Math.random()*(max - min))
  }


function createRemoveButtonImage(){
	var removeImageButtonContainer = Ti.UI.createView({
		height:38,
		width:38,
		borderRadius:19,
		borderWidth:3,
		borderColor:'white',
		backgroundColor:'rgba(63, 69, 81)'
	});
	var label = Ti.UI.createLabel({
		width: Ti.UI.FILL,
		height: Ti.UI.FILL,
		backgroundColor:'white',
		color : 'rgba(63, 69, 81)',
		textAlign:'center',
		font: {
			fontSize: 34,
			fontFamily: fontawesome.fontfamily()
		},
		text: fontawesome.icon('fa-minus-circle')
	});
	removeImageButtonContainer.add(label);
	return removeImageButtonContainer.toImage(null,true);
}

var badgeImage = Ti.UI.createView({
		height:28,
		width:28,
		borderRadius: 14,
		borderWidth:3,
		borderColor:'white',
		backgroundColor:'red'
   }).toImage(null,true);
var deleteButton = createRemoveButtonImage();


function createBadgeImage(){
	var badgeImageCustom = Ti.UI.createView({
		height:28,
		width:28,
		borderRadius: 14,
		borderWidth:3,
		borderColor:'white',
		backgroundColor:'red'
   }).toImage(null,true);
   return badgeImageCustom;
}


function createRemoveButton(parent){

	var removeButtonContainer = Ti.UI.createView({
		parentCell:(parent) ? parent : undefined,
		width: 30,
		height: 30,
		borderRadius:15,
		backgroundColor:'#d0d0d0'
	});

	var removeImageButton = Ti.UI.createLabel({
		width: Ti.UI.FILL,
		height: Ti.UI.FILL,
		color : 'rgba(63, 69, 81, 0.8)',
		textAlign:'center',
		font: {
			fontSize: 30,
			fontFamily: fontawesome.fontfamily()
		},
		text: fontawesome.icon('fa-minus-circle')
	});

	removeButtonContainer.add(removeImageButton);

	if (parent){
		removeButtonContainer.addEventListener('touchstart', function(e){
			removeImageButton.opacity = 0.8;
			removeImageButton.color = 'red';
		});

		removeButtonContainer.addEventListener('touchend', function(e){
			removeImageButton.opacity = 1.0;
			removeImageButton.color = 'rgba(63, 69, 81)';
		});

		removeButtonContainer.addEventListener('touchcancel', function(e){
			removeImageButton.opacity = 1.0;
			removeImageButton.color = 'rgba(63, 69, 81)';
		});
	}
	return removeButtonContainer;
}


function getRandomColor() {
	var letters = '0123456789ABCDEF';
	var color = '#';
	for (var i = 0; i < 6; i++) {
	  color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
  }

var win = Ti.UI.createWindow({
	backgroundColor: '#fff'
});


var win2 = Ti.UI.createWindow({
	backgroundColor: '#fff'
});


win.open();


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




var deleteButtonImage = createRemoveButton().toImage(null,true);

var refreshControl = Ti.UI.createRefreshControl({ tintColor: 'red' });
refreshControl.addEventListener('refreshstart', () => {
	setTimeout(() => {
		refreshControl.endRefreshing();
	}, 2000);
});

gridView = sortableGridModule.createView({
	top:100,
	bottom:100,
	left:0,
	right:0,
	height:Ti.UI.FILL,
	width:Ti.UI.FILL,
	layout: "vertical",
	lazyLoadingEnabled:true, // disables image loader when scrolling, enables when scrolling done
	contentInsets:{top: 10, bottom:20, left:10,right:10},
	scrollIndicatorInsets:{top: 0, bottom:0,left:0,right:0},
	columnCount:3,
	rowCount:5, // Android only
	wobble:true, // wobble animation in edit mode
	minHorizontalSpacing:10,
	minVerticalSpacing:10,
	showDeleteButton:true,
	deleteButtonImage:deleteButtonImage,  // this should be an image, this demo function that will create the image works only after the view is loaded (because of toImage() function), you can also set the property "deleteButtonImage" after the view did focus with: gridView.deleteButtonImage = yourImage;  
	itemsBadgeEnabled:true,
	waterFallLayout:true,
	pagingEnabled:true, // scroll will do paging instead of normal scrolling
	pagerEnabled:true, // display page indicator
	pagerFollowsBottomInset:false, // pager will reposition to bottomInset - per example if you set bottomInset when keyboard is visible....
	pageIndicatorTintColor:'#dddddd',
	currentPageIndicatorTintColor:'red',
	showVerticalScrollIndicator: true,
	showHorizontalScrollIndicator: true,
	scrollType:'vertical',
	disableBounce:false, // disable bouncing of gridview
	backgroundColor:'#cdcdcd',
	refreshControl
	//data:[]
});




function createGridDashBoardViews(size){
	var sortableViewData = [];
	for (var i = 0; i < size; i++){
		if (!isAndroid){

	   var v = sortableGridModule.createItem({
		   top:10,
		   bottom:0,
			id:(i+1), // usefull,but not needed, if you will do something with the gridView.data, to identify your item view, the gridView will automaticly add a 'position' property the the item, that reflects the item positon in the gridView, updated each time you move, add, delete an item
			height:Ti.UI.SIZE,
        width:Ti.UI.FILL,
        badge:true,
        canBeDeleted:true,
        canBeMoved:true,
		badgeValue:generateRandomInteger(0,200),
		badgeTintColor:'#ccd3413d',
	   });

	   v.addEventListener("click",function(e){
			 	console.log("this.position:"+(this.position+1));
				//gridView.deleteItemAtIndex({index:this.position});
	   });
	   v.addEventListener('touchstart', function(e){
			 this.opacity = 0.7;
	   });

	  v.addEventListener('touchend', function(e){
			this.opacity = 1.0;
	  });

	  v.addEventListener('touchcancel', function(e){
			this.opacity = 1.0;
	  });

	}
	else {
		var v = Ti.UI.createView({
			id:(i+1),
		  height:generateRandomInteger(120,220),
		  width:generateRandomInteger(120,180),
			top:0,
			left:0,
			right:0,
			bottom:0,
		  backgroundColor:getRandomColor()
	   });

	}

	var contentContainerView = Ti.UI.createView({
		left:0,
		right:0,
		top:0,
		bottom:0,
		width:Ti.UI.SIZE,
		height:Ti.UI.SIZE,
		backgroundColor:getRandomColor(),
		viewShadowColor: '#000000',
		  	viewShadowOffset: {
			   x: 2,
			   y: 2
		   	},
		   	viewShadowRadius: 4
	});

	contentContainerView.add(Ti.UI.createLabel({
		  text: 'Cell ' + (i+1),
		  color: '#ffffff',
		  width:Ti.UI.FILL,
		  height:100,
		  left:30,
		  right:30,
		  bottom:30,
		  top:30,
		  textAlign:Ti.UI.TEXT_ALIGNMENT_CENTER,
		  font: {
			  fontFamily : 'Arial',
			  fontSize: 18,
			  fontWeight: 'bold',
		  },
		  shadowColor: '#000000',
		  shadowRadius: 4,
		  shadowOffset: {
			  x: 1,
			  y: 1
		  },
		  backgroundColor:getRandomColor()
		}));
		v.add(contentContainerView);

		if (!isAndroid){
			sortableViewData.push(v);
		}
		else {
			sortableViewData.push(v);
		}

	}
	return sortableViewData;
   }









gridCells = createGridDashBoardViews(20);



 gridView.addEventListener('itemsReordered', function(e) {
		console.log("  ");
		console.log(" +++ ");
		gridView.data.forEach(function(entry) {
			console.log("item: "+(entry.id)+" position: "+(entry.position+1));
		});
		console.log(" +++ ");
		console.log("  ");
 });

  gridView.addEventListener('itemAdded', function(e) {
		console.log("itemAdded: "+(e.itemId)+" "+gridView.data.length);
  });


  gridView.addEventListener('itemDeleted', function(e) {
		console.log("item deleted: "+(e.itemId+1)+" "+gridView.data.length);
  });

  gridView.addEventListener('editingStart', function(e) {
	console.log("editingStart: ");
});

  gridView.addEventListener('editingEnd', function(e) {
	console.log("editingEnd: ");
  });

  gridView.addEventListener('pageCountChanged', function(e) {
	console.log("pageCountChanged: "+e.pageCount);
  });

  gridView.addEventListener('pageChanged', function(e) {
	console.log("pageChangedEvent: "+e.pageNo);
  });



  var editButton = Ti.UI.createView({
	bottom:30,
	height:40,
	width:40,
	borderRadius: 6,
	borderWith:2,
	borderColor:'#ccffffff',
	backgroundColor:getRandomColor()
 });
 editButton.addEventListener('touchstart', function(e){
	this.opacity = 0.7;
  });

  editButton.addEventListener('touchend', function(e){
	this.opacity = 1.0;
  });

  editButton.addEventListener('touchcancel', function(e){
	this.opacity = 1.0;
  });

 function addItemAtIndex(index){
	var v = sortableGridModule.createItem({
		id:(index+1),
		height:generateRandomInteger(120,210),
//		width:generateRandomInteger(120,120),
		width:Ti.UI.FILL,
		canBeDeleted:true,
		canBeMoved:true,
	  borderRadius: 0,
	  borderWith:4,
	  borderColor:'#11000000',
	  badge:true,
	  badgeValue:generateRandomInteger(0,200),
	  badgeTintColor:'#ccd3413d',
	  backgroundColor:getRandomColor()
   });

	v.addEventListener("click",function(e){
		console.log("this.position:"+(this.position+1));

		//gridView.deleteItemAtIndex({index:this.position});
	});
	v.addEventListener('touchstart', function(e){
		this.opacity = 0.7;
	  });

	  v.addEventListener('touchend', function(e){
		this.opacity = 1.0;
	  });

	  v.addEventListener('touchcancel', function(e){
		this.opacity = 1.0;
	  });


	  v.add(Ti.UI.createLabel({
		text: 'Cell ' + (index+1),
		color: '#ffffff',
		width:Ti.UI.SIZE,
		height:Ti.UI.SIZE,
		textAlign:Ti.UI.TEXT_ALIGNMENT_CENTER,
		font: {
			fontFamily : 'Arial',
			fontSize: 18,
			fontWeight: 'bold',
		},
		shadowColor: '#000000',
		shadowRadius: 4,
		shadowOffset: {
			x: 1,
			y: 1
		},
		//backgroundColor:getRandomColor()
	  }));
	  return v;
}




 var addBadgeValue = Ti.UI.createView({
	bottom:30,
	height:40,
	width:40,
	left:20,
	borderRadius: 6,
	borderWith:2,
	borderColor:'#ccffffff',
	backgroundColor:getRandomColor()
 });

 addBadgeValue.addEventListener('touchstart', function(e){
	this.opacity = 0.7;
  });

  addBadgeValue.addEventListener('touchend', function(e){
	this.opacity = 1.0;
  });

  addBadgeValue.addEventListener('touchcancel', function(e){
	this.opacity = 1.0;
  });


 addBadgeValue.addEventListener("click",function(e){
	//gridView.data[0].badgeValue = generateRandomInteger(0,120);

	var newItem = addItemAtIndex((gridView.data.length));
	gridView.insertItemAtIndex({item:newItem,index:generateRandomInteger(0,gridView.data.length)});


 });

 editButton.addEventListener("click",function(e){
	if (isEditable) {
		gridView.stopEditing();
		isEditable = false;

	  } else {
		isEditable = true;

		//gridView.showDeleteButton = !(gridView.showDeleteButton);
		//gridView.itemsBadgeEnabled = !(gridView.itemsBadgeEnabled);

		gridView.startEditing();
	}


});
editButton.addEventListener('touchstart', function(e){
	this.opacity = 0.7;
  });

  editButton.addEventListener('touchend', function(e){
	this.opacity = 1.0;
  });

  editButton.addEventListener('touchcancel', function(e){
	this.opacity = 1.0;
  });


var setNewData = Ti.UI.createView({
	bottom:30,
	height:40,
	width:40,
	right:20,
	borderRadius: 6,
	borderWith:2,
	borderColor:'#ccffffff',
	backgroundColor:getRandomColor()
 });
 setNewData.addEventListener("click",function(e){

	console.log("gridView.data length" + gridView.data.length);
	console.log("gridCells length" + gridCells.length);
	gridCells = gridView.data;
	console.log("gridCells length after" + gridCells.length);


	gridView.data = [];


	gridCells.forEach(function(entry) {
	 	entry.backgroundColor = getRandomColor();
	});

	setTimeout(function() {
		gridView.data = gridCells;
	},1000);


 });



 gridView.data = gridCells;


 var gridContainer = Ti.UI.createView({
	height:Ti.UI.SIZE,
	width:Ti.UI.FILL,
	backgroundColor:'red',
	layout: 'vertical',

});
gridContainer.add(gridView);
win.add(gridContainer);



win.add(editButton);
win.add(addBadgeValue);
win.add(setNewData);


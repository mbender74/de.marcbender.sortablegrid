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
		height:34,
		width:34,
		borderRadius: 17,
		borderWidth:2,
		borderColor:'white',
		backgroundColor:'red'
   }).toImage(null,true);
var deleteButton = createRemoveButtonImage();



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



function createGridDashBoardViews(size){
	var sortableViewData = [];
	for (var i = 0; i < size; i++){

	   var v = Ti.UI.createView({
		  id:i,
		  height:110,
		  width:110,
		  borderRadius: 14,
		  borderWith:1,
		  borderColor:'#ccffffff',
		  badge:1,
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

		if (!isAndroid){
			var item = sortableGridModule.createItem({
						height:110,
						width:110,
						backgroundColor:'transparent',
						badge:1,
			});
			item.add(v);	
			sortableViewData.push(item);	
		
		}
		else {
			// var removeButton = createRemoveButton(v);

			// removeButton.addEventListener("click",function(e){
			// 	gridView.deleteItem(this.parentCell.id);
			// });
			// v.add(removeButton);
			sortableViewData.push(v);	

		}

	}
	return sortableViewData;
   }

   
var deleteButtonImage = createRemoveButton().toImage(null,true);


gridCells = createGridDashBoardViews(12);

gridView = sortableGridModule.createView({
	height:Ti.UI.FILL,
	width:Ti.UI.FILL,
	top:10,
	bottom:30,
	left:2,
	right:2,
	rowCount:5,
	columnCount:3,
	wobble: true,
	deleteButtonImage:deleteButtonImage,
	badgeViewImage:badgeImage,
	columnWidth:120,
	horizontalSpacing:10,
	verticalSpacing:10,
	//backgroundColor:'#22000000',
	data:gridCells
})

  gridView.addEventListener('edit', function(e) {
	isEditable = true;
  });
  
  gridView.addEventListener('commit', function(e) {
	isEditable = false;
  });
  
  

  var editButton = Ti.UI.createView({
	bottom:40,
	height:40,
	width:40,
	borderRadius: 6,
	borderWith:2,
	borderColor:'#ccffffff',
	backgroundColor:getRandomColor()
 });



 editButton.addEventListener("click",function(e){
	if (isEditable) {
		gridView.stopEditing();
		isEditable = false;

	  } else {
		isEditable = true;

		gridView.startEditing();
	}
});

win.add(gridView);
win.add(editButton);

win.open();
// TiSortable
// Copyright (c) 2013 Adam Paxton - Polanco Media, LLC
// http://github.com/adampax/TiSortable
// Licensed under the MIT License. See: /License.txt
function SortableView(args) {
   var Draggable = require('ti.draggable');
   var fontawesome = require('/lib/IconicFont').IconicFont({font: '/lib/FontAwesome',ligature: false});
   var isAndroid = false;

   if(Ti.Platform.osname == 'android'){

		console.log("IS ANDROID");

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

   var fadein = Titanium.UI.createAnimation({
		opacity:0.7,
		curve : Titanium.UI.ANIMATION_CURVE_EASE_IN_OUT,
		duration:250
	});
	var fadeout = Titanium.UI.createAnimation({
		opacity:0.0,
		curve : Titanium.UI.ANIMATION_CURVE_EASE_IN_OUT,
		duration:300
	});

   var smallScale = Titanium.UI.createMatrix2D();
   smallScale = smallScale.scale(1.1,1.1);
   smallScale = smallScale.rotate(2,0);

   var normalScale = Titanium.UI.createMatrix2D();
   normalScale = normalScale.scale(1.0,1.0);
   normalScale = normalScale.rotate(2,0);

   var tr_init = Titanium.UI.createMatrix2D();
   var tr_second = Titanium.UI.createMatrix2D();
   var tr_third = Titanium.UI.createMatrix2D();
   
   var tr_start = tr_init.rotate(-1,0);
   var tr_anim = tr_second.rotate(2,0);
   var tr_end = tr_third.rotate(-2,0);


	//mix in properties with the defaults
	args = extend({
		cellWidth : 95,
		cellHeight : 95,
		columnPadding : 10,
		rowPadding : 10,
		columns : 3
	}, args || {});
	
	
	

	if (((args.columns * (args.cellWidth + (2 * args.columnPadding))) + (2 * args.columnPadding)) > Ti.Platform.displayCaps.platformWidth) {
		//console.log("cell are larger than possible: "+((args.columns * (args.cellWidth + (2 * args.columnPadding))) + (2 * args.columnPadding))+" "+Ti.Platform.displayCaps.platformWidth);


		args.cellWidth = ((Ti.Platform.displayCaps.platformWidth / args.columns) - (args.columns * (2 * args.columnPadding))  );

		//console.log("cellWidth new: "+args.cellWidth);

	}

	var completeCounter = 0;

	var cells = [],
		tempCells = [];
		posArray = [],
		tempPosArray = [],
		rowArray = [];

	var wobbeling = false;

	var showShadows = false;
	if ((args.cellShowShadowOnMove && args.cellShowShadowOnMove == true)){
		showShadows = true;
	}

	var self = viewFunc.createView(args);

	//console.log("contentWidth: "+( (args.columns * (args.cellWidth + (2 * args.columnPadding))) - (2*args.columnPadding) ) )


	var sortableContentView = viewFunc.createView({
		//height:Ti.UI.SIZE,
		top:0,
		bottom:0,
		left:0,
		right:0,
		width:((args.columns * args.cellWidth) + ((args.columns-1) * (2*args.columnPadding)))+(2*args.columnPadding),
		//backgroundColor:'green',
		clipMode:(!isAndroid) ? Ti.UI.iOS.CLIP_MODE_DISABLED : undefined
	});
	self.add(sortableContentView);

	Array.prototype.removeItem = function(from, to) {
		var rest = this.slice((to || from) + 1 || this.length);
		this.length = from < 0 ? this.length + from : from;
		return this.push.apply(this, rest);
	};


	populate();

	//FUNCTIONS


	function createRemoveButton(parent){
		

		var removeButtonContainer = viewFunc.createView({
			parentCell:parent,
			visible:false,
			height:Ti.UI.SIZE,
			width:Ti.UI.SIZE,
			top:(!isAndroid) ? -args.columnPadding : 0,
			right:(!isAndroid) ? -args.columnPadding : 0,
			zIndex:200,
			clipMode:(!isAndroid) ? Ti.UI.iOS.CLIP_MODE_DISABLED : undefined
		});

		var removeImageButtonContainer = viewFunc.createView({
			backgroundColor:'#d0d0d0',
			clipMode:(!isAndroid) ? Ti.UI.iOS.CLIP_MODE_DISABLED : undefined,
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





	function getByValue(arr, value) {
		for (var i=0, iLen=arr.length; i<iLen; i++) {
		  if (arr[i].b == value) return arr[i];
		}
	}

	function findByIndex(element,value) { 
		return element.cellIndex === value;
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
		for (var i = 0; i < cells.length; i++) {
			cells[i].removeButton.show();
			//shake(cells[i].cellContent);
			// cells[i].draggable.setConfig({
			// 	enabled : true
			// });
		}
	 }
	  
	 var editMode = function(status) {
		if (status == false){
			var restTR = Titanium.UI.createMatrix2D();
			restTR.rotate(-2,0);

			for (var i = 0; i < cells.length; i++) {
				cells[i].removeButton.hide();

				if (!isAndroid){
					cells[i].cellContent.stopAnimations();
					cells[i].cellContent.transform = restTR;
				}
				else {
					cells[i].cellContent.stopAnimation();
				}

				// cells[i].draggable.setConfig({
				// 	enabled : true
				// });	
			}
			wobbeling = false;
		}
		else {
			wobble();
		}
	 }


	 var setCells = function(data) {
		args.data = data;
		cells = [],
		tempCells = [];
		posArray = [],
		tempPosArray = [],
		rowArray = [];
		populate();
	 }


	function populate(){
		completeCounter = 0;

		//clear out the parent view
	  	var viewChildren = sortableContentView.children.slice(0);
		for (var i = 0; i < viewChildren.length; ++i) {
	        sortableContentView.remove(viewChildren[i]);
		}
		
		var row = 0,
			rowCheck = '';
	
		for (var i = 0; i < args.data.length; i++) {
			
			var column = i % args.columns;
			var top = row * (args.cellHeight + (2 * args.rowPadding));
			var left = column * (args.cellWidth + (2 * args.columnPadding)) + args.columnPadding - 1;

			var cell = Draggable.createView({
				position: i,
				index: i,
				top : top,
				left : left,
				height : args.cellHeight+2,
				width : args.cellWidth+2,
				zIndex:10,
				backgroundColor:'transparent',
				elevation: 0,
				clipMode:(!isAndroid) ? Ti.UI.iOS.CLIP_MODE_DISABLED : undefined,
				borderRadius:(args.cellBorderRadius) ? args.cellBorderRadius : undefined,
				draggableConfig: {
					enabled: true,
					//enabledOnLongpress: true,
					showShadowOnMove: false
				}
			});


			var removeButton = createRemoveButton(cell);

			removeButton.addEventListener("click",function(e){
				var thisRealIndex = cells.findIndex(x => x.position == this.parentCell.position);
				sortableContentView.remove(cells[thisRealIndex]);
				cells.removeItem(thisRealIndex);
				args.data.removeItem(thisRealIndex);

				 for(var j = this.parentCell.position; j < cells.length; j++){
					var indexInCells = cells.findIndex(x => x.position == (j+1));
				   	cells[indexInCells].applyProperties({
				   	 	position:j
				  	});
				 }
				
				if (this.parentCell.position == cells.length){
					posArray.removeItem(posArray.findIndex(x => x.cellIndex == this.parentCell.index));
				}
				else {
					for(var j = this.parentCell.position; j < cells.length; j++){
									deleteanimate({
										cellPosition: j,
										dPositionIndex: j,
										callback: function(){
											if (j == posArray.length-1){
												posArray.pop();
											}
											enableTouch(true);
										}
									});
								
						}
				}
	
			});

			
			args.data[i].applyProperties({
				clipMode:(!isAndroid) ? Ti.UI.iOS.CLIP_MODE_DISABLED : undefined
			})
					

			var cellContent = viewFunc.createView({
				height:args.cellHeight,
				width:args.cellWidth,
				backgroundColor:(args.cellBackgroundColor) ? args.cellBackgroundColor : 'transparent',
				borderRadius:(args.cellBorderRadius) ? args.cellBorderRadius : undefined,
				clipMode:(!isAndroid) ? Ti.UI.iOS.CLIP_MODE_DISABLED : undefined
			});

			


			if (showShadows == true && !isAndroid){
				var shadowView = viewFunc.createView({
					height:args.cellHeight,
					width:args.cellWidth,
					backgroundColor:args.data[i].backgroundColor,
					borderRadius:(args.cellBorderRadius) ? args.cellBorderRadius : undefined,
					clipMode:(!isAndroid) ? Ti.UI.iOS.CLIP_MODE_DISABLED : undefined,
					viewShadowColor: '#000000',
					viewShadowOffset: {
						x: 0,
						y: 0
					},
					viewShadowRadius:8,
					opacity:0.0
				});
				cellContent.add(shadowView);
				cell.shadowView = shadowView;
			}
			cellContent.add(args.data[i]);
			cellContent.add(removeButton);
			cell.add(cellContent);
			cell.cellContent = cellContent;
			cell.removeButton = removeButton;

			cells.push(cell);
			posArray.push({top:top,left:left, cellIndex: i});
			sortableContentView.add(cell);
	
			if (column + 1 === args.columns) {
				row++;
			}
	
			//attach the event listener to each view
			(function(v) {							
				
				v.addEventListener('longpress', function(e){
					if (wobbeling == false){
						wobbeling = true;
						if (!isAndroid){
							//Ti.Media.peek();
						}
						else {
						//	Ti.Media.vibrate();
						}
						wobble();
					}
					else {
						if (!isAndroid){
							//Ti.Media.peek();
						}
						else {
							//Ti.Media.vibrate();
						}
						editMode(false);
					}
				});

				
				 v.addEventListener('start', function(e){
				 	 v.zIndex = 100;
					 if (showShadows == true){
						if (!isAndroid){
							v.shadowView.animate(fadein);
						}
						else {
							//v.animate(androidShadowShow);
							v.elevation = 10;
						}
					}
					//v.transform = smallScale;
				});

				 // v.addEventListener('cancel', function(e){

				// });

				v.addEventListener('cancel', function(e){
					if (showShadows == true){
						if (!isAndroid){
							v.shadowView.animate(fadeout);
						}
						else {
							v.elevation = 0;
							//v.animate(androidShadowHide);
						}
					}
					//v.transform = normalScale;
				});


				v.addEventListener('end', function(e){
					if (showShadows == true){
						if (!isAndroid){
							v.shadowView.animate(fadeout);
						}
						else {
							v.elevation = 0;
							//v.animate(androidShadowHide);
						}
					}
					//v.transform = normalScale;

					//disable the touch
					enableTouch(false);
					var dPositionIndex = getPositionIndex(e);
					var oPositionIndex = v.position;					
					//v.left = e.left;
					//v.top = e.top;
					
					animate({
						cellPosition: oPositionIndex,
						dPositionIndex: dPositionIndex,
						duration: 225
					});
					

					//move old cells
					if(dPositionIndex !== oPositionIndex){
						
						var startPos = (dPositionIndex > oPositionIndex) ? oPositionIndex : dPositionIndex;
						
						var max = (dPositionIndex > oPositionIndex) ? ((dPositionIndex - oPositionIndex)+oPositionIndex) : ((oPositionIndex - dPositionIndex)+dPositionIndex);
						if(dPositionIndex > oPositionIndex){
							//ascending
							for(var i = startPos; i < max; i++){
										animate({
											cellPosition: i+1,
											dPositionIndex: i,
											callback: (i+1) !== max ? '' : (function(){
												enableTouch(true);
												setTimeout(function () {
													v.zIndex = 10;	
												},20);
											})
										});	
							}
						} else {
							//descending
							for(var i = startPos; i < max; i++){
									animate({
										cellPosition: i,
										dPositionIndex: i+1,
										callback: (i+1) !== max ? '' : (function(){
											enableTouch(true);
											setTimeout(function () {
												v.zIndex = 10;	
											},20);
										})
									});	
							}
						}
					} else {
						enableTouch(true);
						setTimeout(function () {
							v.zIndex = 10;	
						},20);
					}					
				});
			})(cell);
	
		}
	}
	
	function animate(obj){
		
		var indexInCells = cells.findIndex(x => x.position == obj.cellPosition);
		var indexOfCell = cells[indexInCells].index;
		var indexInPosArray = posArray.findIndex(x => x.cellIndex == indexOfCell);

		if (obj.withShadow){
				cells[indexInCells].animate({
					top: posArray[obj.dPositionIndex].top, 
					left: posArray[obj.dPositionIndex].left, 
					duration: obj.duration || 225,
				curve:Titanium.UI.ANIMATION_CURVE_EASE_IN_OUT
				}, function(){
					//handle cell array movements on completion callback
					//to prevent what appeared to be race conditions			
					cells[indexInCells].position = obj.dPositionIndex;
					posArray[obj.dPositionIndex].cellIndex = indexOfCell;
	
					//perform any callbacks
					if(typeof(obj.callback) === 'function'){
						obj.callback();
					}	
			});	
		}
		else {
			cells[indexInCells].animate({
				top: posArray[obj.dPositionIndex].top, 
				left: posArray[obj.dPositionIndex].left, 
				duration: obj.duration || 225,
				curve:Titanium.UI.ANIMATION_CURVE_EASE_IN_OUT
				}, function(){
					//handle cell array movements on completion callback
					//to prevent what appeared to be race conditions			
					cells[indexInCells].position = obj.dPositionIndex;
					posArray[obj.dPositionIndex].cellIndex = indexOfCell;
	
					//perform any callbacks
					if(typeof(obj.callback) === 'function'){
						obj.callback();
					}	
			});	
		}
	}


	function deleteanimate(obj){
		
		var indexInCells = cells.findIndex(x => x.position == obj.cellPosition);
		var indexOfCell = cells[indexInCells].index;
		var indexInPosArray = posArray.findIndex(x => x.cellIndex == indexOfCell);

		cells[indexInCells].animate({
			top: posArray[obj.dPositionIndex].top, 
			left: posArray[obj.dPositionIndex].left, 
			duration: obj.duration || 225,
			curve:Titanium.UI.ANIMATION_CURVE_EASE_IN_OUT
			}, function(){
				//handle cell array movements on completion callback
				//to prevent what appeared to be race conditions			
				cells[indexInCells].position = obj.dPositionIndex;
				posArray[obj.dPositionIndex].cellIndex = indexOfCell;

				//perform any callbacks
				if(typeof(obj.callback) === 'function'){
					obj.callback();
				}	
		});			
	}

	
	function enableTouch(enable){
		//enable = enable || true;
		for(var i = 0; i < cells.length; i++){
			cells[i].touchEnabled = enable;
		}
	}


	var enableSort = function(enable){
		//enable = enable || true;
		for(var i = 0; i < cells.length; i++){
			cells[i].draggable.setConfig({
				enabled : true
			});
		}
	}	
	
	//get the position array index from the screen coords
	function getPositionIndex(e){
		
		var totCells = cells.length,
			totRows = Math.ceil(totCells / args.columns),
			col = args.columns-1,
			row = totRows-1,
			heightMult = (args.cellHeight + (2 * args.rowPadding)),
			widthMult = (args.cellWidth + (2 * args.columnPadding));
		
		//get the new row
		for(var i = 0; i < totRows; i++){
			if(e.top < (i * heightMult) + (heightMult / 2)){
				row = i;
				break;
			}
		}
					
		//get the new column
		for(var i = 0; i < args.columns; i++){
			if(e.left < (i * widthMult)+(widthMult/2)){
				col = i;
				break;
			}
		}
		var dPositionIndex = ((1*row)*args.columns)+col;
		
		//check to see if the index is out of bounds and just set it to the last cell
		//probably a better way to handle this
		if(dPositionIndex >= totCells){
			dPositionIndex = totCells-1;
		}
		return 	dPositionIndex;	
	}		

	//helper function extend on object with the properties of one or more others (thanks, Dojo!)
	function extend(obj, props) {
		var empty = {};	
		
		if(!obj) {
			obj = {};
		}
		for(var i = 1, l = arguments.length; i < l; i++) {
			mixin(obj, arguments[i]);
		}
		return obj;
		
		function mixin(target, source) {
			var name, s, i;
			for(name in source) {
				if(source.hasOwnProperty(name)) {
					s = source[name];
					if(!( name in target) || (target[name] !== s && (!( name in empty) || empty[name] !== s))) {
						target[name] = s;
					}
				}
			}
			return target;
			// Object
		}		
	}

	self.editMode = editMode;
	self.setCells = setCells;
	self.enableSort = enableSort;
	return self;
}

module.exports = SortableView; 
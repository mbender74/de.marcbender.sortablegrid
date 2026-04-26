// TiSortable
// Copyright (c) 2013 Adam Paxton - Polanco Media, LLC
// http://github.com/adampax/TiSortable
// Licensed under the MIT License. See: /License.txt
function SortableView(args) {
  var Draggable = require('ti.draggable');
  var fontawesome = require('/lib/IconicFont').IconicFont({ font: '/lib/FontAwesome', ligature: false });
  var isAndroid = false;

  if (Ti.Platform.osname == 'android') {

    console.log("IS ANDROID");

    isAndroid = true;
    var androidClipView = require('ti.clipview');
    var viewFunc = {};
    viewFunc.createView = function (params) {
      return androidClipView.createClipView(params);
    };
  } else
  {
    var viewFunc = {};
    viewFunc.createView = function (params) {
      return Ti.UI.createView(params);
    };
  }

  var fadein = Titanium.UI.createAnimation({
    opacity: 0.7,
    curve: Titanium.UI.ANIMATION_CURVE_EASE_IN_OUT,
    duration: 250
  });
  var fadeout = Titanium.UI.createAnimation({
    opacity: 0.0,
    curve: Titanium.UI.ANIMATION_CURVE_EASE_IN_OUT,
    duration: 300
  });

  var smallScale = Titanium.UI.createMatrix2D();
  smallScale = smallScale.scale(1.1, 1.1);
  smallScale = smallScale.rotate(2, 0);

  var normalScale = Titanium.UI.createMatrix2D();
  normalScale = normalScale.scale(1.0, 1.0);
  normalScale = normalScale.rotate(2, 0);

  var tr_init = Titanium.UI.createMatrix2D();
  var tr_second = Titanium.UI.createMatrix2D();
  var tr_third = Titanium.UI.createMatrix2D();

  var tr_start = tr_init.rotate(-1, 0);
  var tr_anim = tr_second.rotate(2, 0);
  var tr_end = tr_third.rotate(-2, 0);


  //mix in properties with the defaults
  args = extend({
    cellWidth: 95,
    cellHeight: 95,
    columnPadding: 10,
    rowPadding: 10,
    columns: 3
  }, args || {});




  if (args.columns * (args.cellWidth + 2 * args.columnPadding) + 2 * args.columnPadding > Ti.Platform.displayCaps.platformWidth) {
    //console.log("cell are larger than possible: "+((args.columns * (args.cellWidth + (2 * args.columnPadding))) + (2 * args.columnPadding))+" "+Ti.Platform.displayCaps.platformWidth);


    args.cellWidth = Ti.Platform.displayCaps.platformWidth / args.columns - args.columns * (2 * args.columnPadding);

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
  if (args.cellShowShadowOnMove && args.cellShowShadowOnMove == true) {
    showShadows = true;
  }

  var self = viewFunc.createView(args);

  //console.log("contentWidth: "+( (args.columns * (args.cellWidth + (2 * args.columnPadding))) - (2*args.columnPadding) ) )


  var sortableContentView = viewFunc.createView({
    //height:Ti.UI.SIZE,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    width: args.columns * args.cellWidth + (args.columns - 1) * (2 * args.columnPadding) + 2 * args.columnPadding,
    //backgroundColor:'green',
    clipMode: !isAndroid ? Ti.UI.iOS.CLIP_MODE_DISABLED : undefined
  });
  self.add(sortableContentView);

  Array.prototype.removeItem = function (from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
  };


  populate();

  //FUNCTIONS


  function createRemoveButton(parent) {


    var removeButtonContainer = viewFunc.createView({
      parentCell: parent,
      visible: false,
      height: Ti.UI.SIZE,
      width: Ti.UI.SIZE,
      top: !isAndroid ? -args.columnPadding : 0,
      right: !isAndroid ? -args.columnPadding : 0,
      zIndex: 200,
      clipMode: !isAndroid ? Ti.UI.iOS.CLIP_MODE_DISABLED : undefined
    });

    var removeImageButtonContainer = viewFunc.createView({
      backgroundColor: '#d0d0d0',
      clipMode: !isAndroid ? Ti.UI.iOS.CLIP_MODE_DISABLED : undefined,
      touchEnabled: false,
      bubbleParent: true
    });


    var removeImageButton = Ti.UI.createImageView({
      width: Ti.UI.SIZE,
      height: 34,
      touchEnabled: false,
      bubbleParent: true
    });
    Ti.UI.createLabel({
      width: Ti.UI.SIZE,
      height: Ti.UI.SIZE,
      color: 'rgba(63, 69, 81, 0.8)',
      textAlign: 'center',
      font: {
        fontSize: 26,
        fontFamily: fontawesome.fontfamily()
      },
      text: fontawesome.icon('fa-minus-circle')
    }).toImage(function (e) {
      var newDim = Math.ceil(e.width / 2);
      removeImageButton.image = e;
      removeImageButtonContainer.applyProperties({
        width: 34,
        height: 34,
        borderRadius: 17
        //borderRadius:Math.ceil(newDim/2)	
      });
    }, true);



    removeImageButtonContainer.add(removeImageButton);
    removeButtonContainer.add(removeImageButtonContainer);


    removeButtonContainer.addEventListener('touchstart', function (e) {
      removeImageButton.opacity = 0.8;
      removeImageButton.tintColor = 'red';
    });

    removeButtonContainer.addEventListener('touchend', function (e) {
      removeImageButton.opacity = 1.0;
      removeImageButton.tintColor = null;
    });

    removeButtonContainer.addEventListener('touchcancel', function (e) {
      removeImageButton.opacity = 1.0;
      removeImageButton.tintColor = null;
    });



    return removeButtonContainer;
  }





  function getByValue(arr, value) {
    for (var i = 0, iLen = arr.length; i < iLen; i++) {
      if (arr[i].b == value) return arr[i];
    }
  }

  function findByIndex(element, value) {
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
    a.addEventListener('complete', function () {
      if (completeCounter == cells.length - 1) {
        editMode(false);
        completeCounter = 0;
      } else
      {
        completeCounter++;
      }
    });
    view.wobbleAnimation = a;
    //Execute Animation
    view.animate(a);
  }

  function wobble() {
    for (var i = 0; i < cells.length; i++) {
      cells[i].removeButton.show();
      //shake(cells[i].cellContent);
      // cells[i].draggable.setConfig({
      // 	enabled : true
      // });
    }
  }

  var editMode = function (status) {
    if (status == false) {
      var restTR = Titanium.UI.createMatrix2D();
      restTR.rotate(-2, 0);

      for (var i = 0; i < cells.length; i++) {
        cells[i].removeButton.hide();

        if (!isAndroid) {
          cells[i].cellContent.stopAnimations();
          cells[i].cellContent.transform = restTR;
        } else
        {
          cells[i].cellContent.stopAnimation();
        }

        // cells[i].draggable.setConfig({
        // 	enabled : true
        // });	
      }
      wobbeling = false;
    } else
    {
      wobble();
    }
  };


  var setCells = function (data) {
    args.data = data;
    cells = [],
    tempCells = [];
    posArray = [],
    tempPosArray = [],
    rowArray = [];
    populate();
  };


  function populate() {
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
      var top = row * (args.cellHeight + 2 * args.rowPadding);
      var left = column * (args.cellWidth + 2 * args.columnPadding) + args.columnPadding - 1;

      var cell = Draggable.createView({
        position: i,
        index: i,
        top: top,
        left: left,
        height: args.cellHeight + 2,
        width: args.cellWidth + 2,
        zIndex: 10,
        backgroundColor: 'transparent',
        elevation: 0,
        clipMode: !isAndroid ? Ti.UI.iOS.CLIP_MODE_DISABLED : undefined,
        borderRadius: args.cellBorderRadius ? args.cellBorderRadius : undefined,
        draggableConfig: {
          enabled: true,
          //enabledOnLongpress: true,
          showShadowOnMove: false
        }
      });


      var removeButton = createRemoveButton(cell);

      removeButton.addEventListener("click", function (e) {
        var thisRealIndex = cells.findIndex((x) => x.position == this.parentCell.position);
        sortableContentView.remove(cells[thisRealIndex]);
        cells.removeItem(thisRealIndex);
        args.data.removeItem(thisRealIndex);

        for (var j = this.parentCell.position; j < cells.length; j++) {
          var indexInCells = cells.findIndex((x) => x.position == j + 1);
          cells[indexInCells].applyProperties({
            position: j
          });
        }

        if (this.parentCell.position == cells.length) {
          posArray.removeItem(posArray.findIndex((x) => x.cellIndex == this.parentCell.index));
        } else
        {
          for (var j = this.parentCell.position; j < cells.length; j++) {
            deleteanimate({
              cellPosition: j,
              dPositionIndex: j,
              callback: function () {
                if (j == posArray.length - 1) {
                  posArray.pop();
                }
                enableTouch(true);
              }
            });

          }
        }

      });


      args.data[i].applyProperties({
        clipMode: !isAndroid ? Ti.UI.iOS.CLIP_MODE_DISABLED : undefined
      });


      var cellContent = viewFunc.createView({
        height: args.cellHeight,
        width: args.cellWidth,
        backgroundColor: args.cellBackgroundColor ? args.cellBackgroundColor : 'transparent',
        borderRadius: args.cellBorderRadius ? args.cellBorderRadius : undefined,
        clipMode: !isAndroid ? Ti.UI.iOS.CLIP_MODE_DISABLED : undefined
      });




      if (showShadows == true && !isAndroid) {
        var shadowView = viewFunc.createView({
          height: args.cellHeight,
          width: args.cellWidth,
          backgroundColor: args.data[i].backgroundColor,
          borderRadius: args.cellBorderRadius ? args.cellBorderRadius : undefined,
          clipMode: !isAndroid ? Ti.UI.iOS.CLIP_MODE_DISABLED : undefined,
          viewShadowColor: '#000000',
          viewShadowOffset: {
            x: 0,
            y: 0
          },
          viewShadowRadius: 8,
          opacity: 0.0
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
      posArray.push({ top: top, left: left, cellIndex: i });
      sortableContentView.add(cell);

      if (column + 1 === args.columns) {
        row++;
      }

      //attach the event listener to each view
      (function (v) {

        v.addEventListener('longpress', function (e) {
          if (wobbeling == false) {
            wobbeling = true;
            if (!isAndroid) {

              //Ti.Media.peek();
            } else {

                //	Ti.Media.vibrate();
              }wobble();
          } else
          {
            if (!isAndroid) {

              //Ti.Media.peek();
            } else {

                //Ti.Media.vibrate();
              }editMode(false);
          }
        });


        v.addEventListener('start', function (e) {
          v.zIndex = 100;
          if (showShadows == true) {
            if (!isAndroid) {
              v.shadowView.animate(fadein);
            } else
            {
              //v.animate(androidShadowShow);
              v.elevation = 10;
            }
          }
          //v.transform = smallScale;
        });

        // v.addEventListener('cancel', function(e){

        // });

        v.addEventListener('cancel', function (e) {
          if (showShadows == true) {
            if (!isAndroid) {
              v.shadowView.animate(fadeout);
            } else
            {
              v.elevation = 0;
              //v.animate(androidShadowHide);
            }
          }
          //v.transform = normalScale;
        });


        v.addEventListener('end', function (e) {
          if (showShadows == true) {
            if (!isAndroid) {
              v.shadowView.animate(fadeout);
            } else
            {
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
          if (dPositionIndex !== oPositionIndex) {

            var startPos = dPositionIndex > oPositionIndex ? oPositionIndex : dPositionIndex;

            var max = dPositionIndex > oPositionIndex ? dPositionIndex - oPositionIndex + oPositionIndex : oPositionIndex - dPositionIndex + dPositionIndex;
            if (dPositionIndex > oPositionIndex) {
              //ascending
              for (var i = startPos; i < max; i++) {
                animate({
                  cellPosition: i + 1,
                  dPositionIndex: i,
                  callback: i + 1 !== max ? '' : function () {
                    enableTouch(true);
                    setTimeout(function () {
                      v.zIndex = 10;
                    }, 20);
                  }
                });
              }
            } else {
              //descending
              for (var i = startPos; i < max; i++) {
                animate({
                  cellPosition: i,
                  dPositionIndex: i + 1,
                  callback: i + 1 !== max ? '' : function () {
                    enableTouch(true);
                    setTimeout(function () {
                      v.zIndex = 10;
                    }, 20);
                  }
                });
              }
            }
          } else {
            enableTouch(true);
            setTimeout(function () {
              v.zIndex = 10;
            }, 20);
          }
        });
      })(cell);

    }
  }

  function animate(obj) {

    var indexInCells = cells.findIndex((x) => x.position == obj.cellPosition);
    var indexOfCell = cells[indexInCells].index;
    var indexInPosArray = posArray.findIndex((x) => x.cellIndex == indexOfCell);

    if (obj.withShadow) {
      cells[indexInCells].animate({
        top: posArray[obj.dPositionIndex].top,
        left: posArray[obj.dPositionIndex].left,
        duration: obj.duration || 225,
        curve: Titanium.UI.ANIMATION_CURVE_EASE_IN_OUT
      }, function () {
        //handle cell array movements on completion callback
        //to prevent what appeared to be race conditions			
        cells[indexInCells].position = obj.dPositionIndex;
        posArray[obj.dPositionIndex].cellIndex = indexOfCell;

        //perform any callbacks
        if (typeof obj.callback === 'function') {
          obj.callback();
        }
      });
    } else
    {
      cells[indexInCells].animate({
        top: posArray[obj.dPositionIndex].top,
        left: posArray[obj.dPositionIndex].left,
        duration: obj.duration || 225,
        curve: Titanium.UI.ANIMATION_CURVE_EASE_IN_OUT
      }, function () {
        //handle cell array movements on completion callback
        //to prevent what appeared to be race conditions			
        cells[indexInCells].position = obj.dPositionIndex;
        posArray[obj.dPositionIndex].cellIndex = indexOfCell;

        //perform any callbacks
        if (typeof obj.callback === 'function') {
          obj.callback();
        }
      });
    }
  }


  function deleteanimate(obj) {

    var indexInCells = cells.findIndex((x) => x.position == obj.cellPosition);
    var indexOfCell = cells[indexInCells].index;
    var indexInPosArray = posArray.findIndex((x) => x.cellIndex == indexOfCell);

    cells[indexInCells].animate({
      top: posArray[obj.dPositionIndex].top,
      left: posArray[obj.dPositionIndex].left,
      duration: obj.duration || 225,
      curve: Titanium.UI.ANIMATION_CURVE_EASE_IN_OUT
    }, function () {
      //handle cell array movements on completion callback
      //to prevent what appeared to be race conditions			
      cells[indexInCells].position = obj.dPositionIndex;
      posArray[obj.dPositionIndex].cellIndex = indexOfCell;

      //perform any callbacks
      if (typeof obj.callback === 'function') {
        obj.callback();
      }
    });
  }


  function enableTouch(enable) {
    //enable = enable || true;
    for (var i = 0; i < cells.length; i++) {
      cells[i].touchEnabled = enable;
    }
  }


  var enableSort = function (enable) {
    //enable = enable || true;
    for (var i = 0; i < cells.length; i++) {
      cells[i].draggable.setConfig({
        enabled: true
      });
    }
  };

  //get the position array index from the screen coords
  function getPositionIndex(e) {

    var totCells = cells.length,
      totRows = Math.ceil(totCells / args.columns),
      col = args.columns - 1,
      row = totRows - 1,
      heightMult = args.cellHeight + 2 * args.rowPadding,
      widthMult = args.cellWidth + 2 * args.columnPadding;

    //get the new row
    for (var i = 0; i < totRows; i++) {
      if (e.top < i * heightMult + heightMult / 2) {
        row = i;
        break;
      }
    }

    //get the new column
    for (var i = 0; i < args.columns; i++) {
      if (e.left < i * widthMult + widthMult / 2) {
        col = i;
        break;
      }
    }
    var dPositionIndex = 1 * row * args.columns + col;

    //check to see if the index is out of bounds and just set it to the last cell
    //probably a better way to handle this
    if (dPositionIndex >= totCells) {
      dPositionIndex = totCells - 1;
    }
    return dPositionIndex;
  }

  //helper function extend on object with the properties of one or more others (thanks, Dojo!)
  function extend(obj, props) {
    var empty = {};

    if (!obj) {
      obj = {};
    }
    for (var i = 1, l = arguments.length; i < l; i++) {
      mixin(obj, arguments[i]);
    }
    return obj;

    function mixin(target, source) {
      var name, s, i;
      for (name in source) {
        if (source.hasOwnProperty(name)) {
          s = source[name];
          if (!(name in target) || target[name] !== s && (!(name in empty) || empty[name] !== s)) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUM7VUFDakI7UUFDRDtNQUNEO01BQ0EsT0FBT0gsTUFBTTtNQUNiO0lBQ0Q7RUFDRDs7RUFFQTdJLElBQUksQ0FBQ3dFLFFBQVEsR0FBR0EsUUFBUTtFQUN4QnhFLElBQUksQ0FBQ29GLFFBQVEsR0FBR0EsUUFBUTtFQUN4QnBGLElBQUksQ0FBQ2dJLFVBQVUsR0FBR0EsVUFBVTtFQUM1QixPQUFPaEksSUFBSTtBQUNaOztBQUVBa0osTUFBTSxDQUFDQyxPQUFPLEdBQUczTSxZQUFZIiwibmFtZXMiOlsiU29ydGFibGVWaWV3IiwiYXJncyIsIkRyYWdnYWJsZSIsInJlcXVpcmUiLCJmb250YXdlc29tZSIsIkljb25pY0ZvbnQiLCJmb250IiwibGlnYXR1cmUiLCJpc0FuZHJvaWQiLCJUaSIsIlBsYXRmb3JtIiwib3NuYW1lIiwiY29uc29sZSIsImxvZyIsImFuZHJvaWRDbGlwVmlldyIsInZpZXdGdW5jIiwiY3JlYXRlVmlldyIsInBhcmFtcyIsImNyZWF0ZUNsaXBWaWV3IiwiVUkiLCJmYWRlaW4iLCJUaXRhbml1bSIsImNyZWF0ZUFuaW1hdGlvbiIsIm9wYWNpdHkiLCJjdXJ2ZSIsIkFOSU1BVElPTl9DVVJWRV9FQVNFX0lOX09VVCIsImR1cmF0aW9uIiwiZmFkZW91dCIsInNtYWxsU2NhbGUiLCJjcmVhdGVNYXRyaXgyRCIsInNjYWxlIiwicm90YXRlIiwibm9ybWFsU2NhbGUiLCJ0cl9pbml0IiwidHJfc2Vjb25kIiwidHJfdGhpcmQiLCJ0cl9zdGFydCIsInRyX2FuaW0iLCJ0cl9lbmQiLCJleHRlbmQiLCJjZWxsV2lkdGgiLCJjZWxsSGVpZ2h0IiwiY29sdW1uUGFkZGluZyIsInJvd1BhZGRpbmciLCJjb2x1bW5zIiwiZGlzcGxheUNhcHMiLCJwbGF0Zm9ybVdpZHRoIiwiY29tcGxldGVDb3VudGVyIiwiY2VsbHMiLCJ0ZW1wQ2VsbHMiLCJwb3NBcnJheSIsInRlbXBQb3NBcnJheSIsInJvd0FycmF5Iiwid29iYmVsaW5nIiwic2hvd1NoYWRvd3MiLCJjZWxsU2hvd1NoYWRvd09uTW92ZSIsInNlbGYiLCJzb3J0YWJsZUNvbnRlbnRWaWV3IiwidG9wIiwiYm90dG9tIiwibGVmdCIsInJpZ2h0Iiwid2lkdGgiLCJjbGlwTW9kZSIsImlPUyIsIkNMSVBfTU9ERV9ESVNBQkxFRCIsInVuZGVmaW5lZCIsImFkZCIsIkFycmF5IiwicHJvdG90eXBlIiwicmVtb3ZlSXRlbSIsImZyb20iLCJ0byIsInJlc3QiLCJzbGljZSIsImxlbmd0aCIsInB1c2giLCJhcHBseSIsInBvcHVsYXRlIiwiY3JlYXRlUmVtb3ZlQnV0dG9uIiwicGFyZW50IiwicmVtb3ZlQnV0dG9uQ29udGFpbmVyIiwicGFyZW50Q2VsbCIsInZpc2libGUiLCJoZWlnaHQiLCJTSVpFIiwiekluZGV4IiwicmVtb3ZlSW1hZ2VCdXR0b25Db250YWluZXIiLCJiYWNrZ3JvdW5kQ29sb3IiLCJ0b3VjaEVuYWJsZWQiLCJidWJibGVQYXJlbnQiLCJyZW1vdmVJbWFnZUJ1dHRvbiIsImNyZWF0ZUltYWdlVmlldyIsImNyZWF0ZUxhYmVsIiwiY29sb3IiLCJ0ZXh0QWxpZ24iLCJmb250U2l6ZSIsImZvbnRGYW1pbHkiLCJmb250ZmFtaWx5IiwidGV4dCIsImljb24iLCJ0b0ltYWdlIiwiZSIsIm5ld0RpbSIsIk1hdGgiLCJjZWlsIiwiaW1hZ2UiLCJhcHBseVByb3BlcnRpZXMiLCJib3JkZXJSYWRpdXMiLCJhZGRFdmVudExpc3RlbmVyIiwidGludENvbG9yIiwiZ2V0QnlWYWx1ZSIsImFyciIsInZhbHVlIiwiaSIsImlMZW4iLCJiIiwiZmluZEJ5SW5kZXgiLCJlbGVtZW50IiwiY2VsbEluZGV4Iiwic2hha2UiLCJ2aWV3IiwiZmlyc3RSdW4iLCJ0cmFuc2Zvcm0iLCJhIiwiYXV0b3JldmVyc2UiLCJyZXBlYXQiLCJkZWxheSIsImVkaXRNb2RlIiwid29iYmxlQW5pbWF0aW9uIiwiYW5pbWF0ZSIsIndvYmJsZSIsInJlbW92ZUJ1dHRvbiIsInNob3ciLCJzdGF0dXMiLCJyZXN0VFIiLCJoaWRlIiwiY2VsbENvbnRlbnQiLCJzdG9wQW5pbWF0aW9ucyIsInN0b3BBbmltYXRpb24iLCJzZXRDZWxscyIsImRhdGEiLCJ2aWV3Q2hpbGRyZW4iLCJjaGlsZHJlbiIsInJlbW92ZSIsInJvdyIsInJvd0NoZWNrIiwiY29sdW1uIiwiY2VsbCIsInBvc2l0aW9uIiwiaW5kZXgiLCJlbGV2YXRpb24iLCJjZWxsQm9yZGVyUmFkaXVzIiwiZHJhZ2dhYmxlQ29uZmlnIiwiZW5hYmxlZCIsInNob3dTaGFkb3dPbk1vdmUiLCJ0aGlzUmVhbEluZGV4IiwiZmluZEluZGV4IiwieCIsImoiLCJpbmRleEluQ2VsbHMiLCJkZWxldGVhbmltYXRlIiwiY2VsbFBvc2l0aW9uIiwiZFBvc2l0aW9uSW5kZXgiLCJjYWxsYmFjayIsInBvcCIsImVuYWJsZVRvdWNoIiwiY2VsbEJhY2tncm91bmRDb2xvciIsInNoYWRvd1ZpZXciLCJ2aWV3U2hhZG93Q29sb3IiLCJ2aWV3U2hhZG93T2Zmc2V0IiwieSIsInZpZXdTaGFkb3dSYWRpdXMiLCJ2IiwiZ2V0UG9zaXRpb25JbmRleCIsIm9Qb3NpdGlvbkluZGV4Iiwic3RhcnRQb3MiLCJtYXgiLCJzZXRUaW1lb3V0Iiwib2JqIiwiaW5kZXhPZkNlbGwiLCJpbmRleEluUG9zQXJyYXkiLCJ3aXRoU2hhZG93IiwiZW5hYmxlIiwiZW5hYmxlU29ydCIsImRyYWdnYWJsZSIsInNldENvbmZpZyIsInRvdENlbGxzIiwidG90Um93cyIsImNvbCIsImhlaWdodE11bHQiLCJ3aWR0aE11bHQiLCJwcm9wcyIsImVtcHR5IiwibCIsImFyZ3VtZW50cyIsIm1peGluIiwidGFyZ2V0Iiwic291cmNlIiwibmFtZSIsInMiLCJoYXNPd25Qcm9wZXJ0eSIsIm1vZHVsZSIsImV4cG9ydHMiXSwic291cmNlUm9vdCI6Ii9Vc2Vycy9tYXJjYmVuZGVyL2dyaWRtb2R1bC9kZS5tYXJjYmVuZGVyLnNvcnRhYmxlZ3JpZC90ZXN0YXBwL1Jlc291cmNlcy9saWIiLCJzb3VyY2VzIjpbIlNvcnRhYmxlVmlldy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBUaVNvcnRhYmxlXG4vLyBDb3B5cmlnaHQgKGMpIDIwMTMgQWRhbSBQYXh0b24gLSBQb2xhbmNvIE1lZGlhLCBMTENcbi8vIGh0dHA6Ly9naXRodWIuY29tL2FkYW1wYXgvVGlTb3J0YWJsZVxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLiBTZWU6IC9MaWNlbnNlLnR4dFxuZnVuY3Rpb24gU29ydGFibGVWaWV3KGFyZ3MpIHtcbiAgIHZhciBEcmFnZ2FibGUgPSByZXF1aXJlKCd0aS5kcmFnZ2FibGUnKTtcbiAgIHZhciBmb250YXdlc29tZSA9IHJlcXVpcmUoJy9saWIvSWNvbmljRm9udCcpLkljb25pY0ZvbnQoe2ZvbnQ6ICcvbGliL0ZvbnRBd2Vzb21lJyxsaWdhdHVyZTogZmFsc2V9KTtcbiAgIHZhciBpc0FuZHJvaWQgPSBmYWxzZTtcblxuICAgaWYoVGkuUGxhdGZvcm0ub3NuYW1lID09ICdhbmRyb2lkJyl7XG5cblx0XHRjb25zb2xlLmxvZyhcIklTIEFORFJPSURcIik7XG5cblx0XHRpc0FuZHJvaWQgPSB0cnVlO1xuXHRcdHZhciBhbmRyb2lkQ2xpcFZpZXcgPSByZXF1aXJlKCd0aS5jbGlwdmlldycpO1xuXHRcdHZhciB2aWV3RnVuYyA9IHt9O1xuXHRcdHZpZXdGdW5jLmNyZWF0ZVZpZXcgPSBmdW5jdGlvbihwYXJhbXMpe1xuXHRcdFx0cmV0dXJuIGFuZHJvaWRDbGlwVmlldy5jcmVhdGVDbGlwVmlldyhwYXJhbXMpO1xuXHRcdH1cblx0fVxuXHRlbHNlIHtcblx0XHR2YXIgdmlld0Z1bmMgPSB7fTtcblx0XHR2aWV3RnVuYy5jcmVhdGVWaWV3ID0gZnVuY3Rpb24ocGFyYW1zKXtcblx0XHRcdHJldHVybiBUaS5VSS5jcmVhdGVWaWV3KHBhcmFtcyk7XG5cdFx0fVxuXHR9XG5cbiAgIHZhciBmYWRlaW4gPSBUaXRhbml1bS5VSS5jcmVhdGVBbmltYXRpb24oe1xuXHRcdG9wYWNpdHk6MC43LFxuXHRcdGN1cnZlIDogVGl0YW5pdW0uVUkuQU5JTUFUSU9OX0NVUlZFX0VBU0VfSU5fT1VULFxuXHRcdGR1cmF0aW9uOjI1MFxuXHR9KTtcblx0dmFyIGZhZGVvdXQgPSBUaXRhbml1bS5VSS5jcmVhdGVBbmltYXRpb24oe1xuXHRcdG9wYWNpdHk6MC4wLFxuXHRcdGN1cnZlIDogVGl0YW5pdW0uVUkuQU5JTUFUSU9OX0NVUlZFX0VBU0VfSU5fT1VULFxuXHRcdGR1cmF0aW9uOjMwMFxuXHR9KTtcblxuICAgdmFyIHNtYWxsU2NhbGUgPSBUaXRhbml1bS5VSS5jcmVhdGVNYXRyaXgyRCgpO1xuICAgc21hbGxTY2FsZSA9IHNtYWxsU2NhbGUuc2NhbGUoMS4xLDEuMSk7XG4gICBzbWFsbFNjYWxlID0gc21hbGxTY2FsZS5yb3RhdGUoMiwwKTtcblxuICAgdmFyIG5vcm1hbFNjYWxlID0gVGl0YW5pdW0uVUkuY3JlYXRlTWF0cml4MkQoKTtcbiAgIG5vcm1hbFNjYWxlID0gbm9ybWFsU2NhbGUuc2NhbGUoMS4wLDEuMCk7XG4gICBub3JtYWxTY2FsZSA9IG5vcm1hbFNjYWxlLnJvdGF0ZSgyLDApO1xuXG4gICB2YXIgdHJfaW5pdCA9IFRpdGFuaXVtLlVJLmNyZWF0ZU1hdHJpeDJEKCk7XG4gICB2YXIgdHJfc2Vjb25kID0gVGl0YW5pdW0uVUkuY3JlYXRlTWF0cml4MkQoKTtcbiAgIHZhciB0cl90aGlyZCA9IFRpdGFuaXVtLlVJLmNyZWF0ZU1hdHJpeDJEKCk7XG4gICBcbiAgIHZhciB0cl9zdGFydCA9IHRyX2luaXQucm90YXRlKC0xLDApO1xuICAgdmFyIHRyX2FuaW0gPSB0cl9zZWNvbmQucm90YXRlKDIsMCk7XG4gICB2YXIgdHJfZW5kID0gdHJfdGhpcmQucm90YXRlKC0yLDApO1xuXG5cblx0Ly9taXggaW4gcHJvcGVydGllcyB3aXRoIHRoZSBkZWZhdWx0c1xuXHRhcmdzID0gZXh0ZW5kKHtcblx0XHRjZWxsV2lkdGggOiA5NSxcblx0XHRjZWxsSGVpZ2h0IDogOTUsXG5cdFx0Y29sdW1uUGFkZGluZyA6IDEwLFxuXHRcdHJvd1BhZGRpbmcgOiAxMCxcblx0XHRjb2x1bW5zIDogM1xuXHR9LCBhcmdzIHx8IHt9KTtcblx0XG5cdFxuXHRcblxuXHRpZiAoKChhcmdzLmNvbHVtbnMgKiAoYXJncy5jZWxsV2lkdGggKyAoMiAqIGFyZ3MuY29sdW1uUGFkZGluZykpKSArICgyICogYXJncy5jb2x1bW5QYWRkaW5nKSkgPiBUaS5QbGF0Zm9ybS5kaXNwbGF5Q2Fwcy5wbGF0Zm9ybVdpZHRoKSB7XG5cdFx0Ly9jb25zb2xlLmxvZyhcImNlbGwgYXJlIGxhcmdlciB0aGFuIHBvc3NpYmxlOiBcIisoKGFyZ3MuY29sdW1ucyAqIChhcmdzLmNlbGxXaWR0aCArICgyICogYXJncy5jb2x1bW5QYWRkaW5nKSkpICsgKDIgKiBhcmdzLmNvbHVtblBhZGRpbmcpKStcIiBcIitUaS5QbGF0Zm9ybS5kaXNwbGF5Q2Fwcy5wbGF0Zm9ybVdpZHRoKTtcblxuXG5cdFx0YXJncy5jZWxsV2lkdGggPSAoKFRpLlBsYXRmb3JtLmRpc3BsYXlDYXBzLnBsYXRmb3JtV2lkdGggLyBhcmdzLmNvbHVtbnMpIC0gKGFyZ3MuY29sdW1ucyAqICgyICogYXJncy5jb2x1bW5QYWRkaW5nKSkgICk7XG5cblx0XHQvL2NvbnNvbGUubG9nKFwiY2VsbFdpZHRoIG5ldzogXCIrYXJncy5jZWxsV2lkdGgpO1xuXG5cdH1cblxuXHR2YXIgY29tcGxldGVDb3VudGVyID0gMDtcblxuXHR2YXIgY2VsbHMgPSBbXSxcblx0XHR0ZW1wQ2VsbHMgPSBbXTtcblx0XHRwb3NBcnJheSA9IFtdLFxuXHRcdHRlbXBQb3NBcnJheSA9IFtdLFxuXHRcdHJvd0FycmF5ID0gW107XG5cblx0dmFyIHdvYmJlbGluZyA9IGZhbHNlO1xuXG5cdHZhciBzaG93U2hhZG93cyA9IGZhbHNlO1xuXHRpZiAoKGFyZ3MuY2VsbFNob3dTaGFkb3dPbk1vdmUgJiYgYXJncy5jZWxsU2hvd1NoYWRvd09uTW92ZSA9PSB0cnVlKSl7XG5cdFx0c2hvd1NoYWRvd3MgPSB0cnVlO1xuXHR9XG5cblx0dmFyIHNlbGYgPSB2aWV3RnVuYy5jcmVhdGVWaWV3KGFyZ3MpO1xuXG5cdC8vY29uc29sZS5sb2coXCJjb250ZW50V2lkdGg6IFwiKyggKGFyZ3MuY29sdW1ucyAqIChhcmdzLmNlbGxXaWR0aCArICgyICogYXJncy5jb2x1bW5QYWRkaW5nKSkpIC0gKDIqYXJncy5jb2x1bW5QYWRkaW5nKSApIClcblxuXG5cdHZhciBzb3J0YWJsZUNvbnRlbnRWaWV3ID0gdmlld0Z1bmMuY3JlYXRlVmlldyh7XG5cdFx0Ly9oZWlnaHQ6VGkuVUkuU0laRSxcblx0XHR0b3A6MCxcblx0XHRib3R0b206MCxcblx0XHRsZWZ0OjAsXG5cdFx0cmlnaHQ6MCxcblx0XHR3aWR0aDooKGFyZ3MuY29sdW1ucyAqIGFyZ3MuY2VsbFdpZHRoKSArICgoYXJncy5jb2x1bW5zLTEpICogKDIqYXJncy5jb2x1bW5QYWRkaW5nKSkpKygyKmFyZ3MuY29sdW1uUGFkZGluZyksXG5cdFx0Ly9iYWNrZ3JvdW5kQ29sb3I6J2dyZWVuJyxcblx0XHRjbGlwTW9kZTooIWlzQW5kcm9pZCkgPyBUaS5VSS5pT1MuQ0xJUF9NT0RFX0RJU0FCTEVEIDogdW5kZWZpbmVkXG5cdH0pO1xuXHRzZWxmLmFkZChzb3J0YWJsZUNvbnRlbnRWaWV3KTtcblxuXHRBcnJheS5wcm90b3R5cGUucmVtb3ZlSXRlbSA9IGZ1bmN0aW9uKGZyb20sIHRvKSB7XG5cdFx0dmFyIHJlc3QgPSB0aGlzLnNsaWNlKCh0byB8fCBmcm9tKSArIDEgfHwgdGhpcy5sZW5ndGgpO1xuXHRcdHRoaXMubGVuZ3RoID0gZnJvbSA8IDAgPyB0aGlzLmxlbmd0aCArIGZyb20gOiBmcm9tO1xuXHRcdHJldHVybiB0aGlzLnB1c2guYXBwbHkodGhpcywgcmVzdCk7XG5cdH07XG5cblxuXHRwb3B1bGF0ZSgpO1xuXG5cdC8vRlVOQ1RJT05TXG5cblxuXHRmdW5jdGlvbiBjcmVhdGVSZW1vdmVCdXR0b24ocGFyZW50KXtcblx0XHRcblxuXHRcdHZhciByZW1vdmVCdXR0b25Db250YWluZXIgPSB2aWV3RnVuYy5jcmVhdGVWaWV3KHtcblx0XHRcdHBhcmVudENlbGw6cGFyZW50LFxuXHRcdFx0dmlzaWJsZTpmYWxzZSxcblx0XHRcdGhlaWdodDpUaS5VSS5TSVpFLFxuXHRcdFx0d2lkdGg6VGkuVUkuU0laRSxcblx0XHRcdHRvcDooIWlzQW5kcm9pZCkgPyAtYXJncy5jb2x1bW5QYWRkaW5nIDogMCxcblx0XHRcdHJpZ2h0OighaXNBbmRyb2lkKSA/IC1hcmdzLmNvbHVtblBhZGRpbmcgOiAwLFxuXHRcdFx0ekluZGV4OjIwMCxcblx0XHRcdGNsaXBNb2RlOighaXNBbmRyb2lkKSA/IFRpLlVJLmlPUy5DTElQX01PREVfRElTQUJMRUQgOiB1bmRlZmluZWRcblx0XHR9KTtcblxuXHRcdHZhciByZW1vdmVJbWFnZUJ1dHRvbkNvbnRhaW5lciA9IHZpZXdGdW5jLmNyZWF0ZVZpZXcoe1xuXHRcdFx0YmFja2dyb3VuZENvbG9yOicjZDBkMGQwJyxcblx0XHRcdGNsaXBNb2RlOighaXNBbmRyb2lkKSA/IFRpLlVJLmlPUy5DTElQX01PREVfRElTQUJMRUQgOiB1bmRlZmluZWQsXG5cdFx0XHR0b3VjaEVuYWJsZWQ6ZmFsc2UsXG5cdFx0XHRidWJibGVQYXJlbnQ6dHJ1ZVxuXHRcdH0pO1xuXG5cblx0XHR2YXIgcmVtb3ZlSW1hZ2VCdXR0b24gPSBUaS5VSS5jcmVhdGVJbWFnZVZpZXcoe1xuXHRcdFx0d2lkdGg6IFRpLlVJLlNJWkUsXG5cdFx0XHRoZWlnaHQ6IDM0LFxuXHRcdFx0dG91Y2hFbmFibGVkOmZhbHNlLFxuXHRcdFx0YnViYmxlUGFyZW50OnRydWVcblx0XHR9KTtcblx0XHRUaS5VSS5jcmVhdGVMYWJlbCh7XG5cdFx0XHR3aWR0aDogVGkuVUkuU0laRSxcblx0XHRcdGhlaWdodDogVGkuVUkuU0laRSxcblx0XHRcdGNvbG9yIDogJ3JnYmEoNjMsIDY5LCA4MSwgMC44KScsXG5cdFx0XHR0ZXh0QWxpZ246J2NlbnRlcicsXG5cdFx0XHRmb250OiB7XG5cdFx0XHRcdGZvbnRTaXplOiAyNixcblx0XHRcdFx0Zm9udEZhbWlseTogZm9udGF3ZXNvbWUuZm9udGZhbWlseSgpXG5cdFx0XHR9LFxuXHRcdFx0dGV4dDogZm9udGF3ZXNvbWUuaWNvbignZmEtbWludXMtY2lyY2xlJylcblx0XHR9KS50b0ltYWdlKGZ1bmN0aW9uKGUpe1xuXHRcdFx0dmFyIG5ld0RpbSA9IE1hdGguY2VpbChlLndpZHRoLzIpO1xuXHRcdFx0cmVtb3ZlSW1hZ2VCdXR0b24uaW1hZ2UgPSBlO1xuXHRcdFx0cmVtb3ZlSW1hZ2VCdXR0b25Db250YWluZXIuYXBwbHlQcm9wZXJ0aWVzKHtcblx0XHRcdFx0d2lkdGg6MzQsXG5cdFx0XHRcdGhlaWdodDozNCxcblx0XHRcdFx0Ym9yZGVyUmFkaXVzOjE3XG5cdFx0XHRcdC8vYm9yZGVyUmFkaXVzOk1hdGguY2VpbChuZXdEaW0vMilcdFxuXHRcdFx0fSlcblx0XHR9LHRydWUpO1xuXHRcblxuXHRcdFxuXHRcdHJlbW92ZUltYWdlQnV0dG9uQ29udGFpbmVyLmFkZChyZW1vdmVJbWFnZUJ1dHRvbik7XG5cdFx0cmVtb3ZlQnV0dG9uQ29udGFpbmVyLmFkZChyZW1vdmVJbWFnZUJ1dHRvbkNvbnRhaW5lcik7XG5cdFx0XG5cblx0XHRyZW1vdmVCdXR0b25Db250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIGZ1bmN0aW9uKGUpe1xuXHRcdFx0cmVtb3ZlSW1hZ2VCdXR0b24ub3BhY2l0eSA9IDAuODtcblx0XHRcdHJlbW92ZUltYWdlQnV0dG9uLnRpbnRDb2xvciA9ICdyZWQnO1xuXHRcdH0pO1xuXG5cdFx0cmVtb3ZlQnV0dG9uQ29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgZnVuY3Rpb24oZSl7XG5cdFx0XHRyZW1vdmVJbWFnZUJ1dHRvbi5vcGFjaXR5ID0gMS4wO1x0XHRcblx0XHRcdHJlbW92ZUltYWdlQnV0dG9uLnRpbnRDb2xvciA9IG51bGw7XHRcblx0XHR9KTtcblxuXHRcdHJlbW92ZUJ1dHRvbkNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGNhbmNlbCcsIGZ1bmN0aW9uKGUpe1xuXHRcdFx0cmVtb3ZlSW1hZ2VCdXR0b24ub3BhY2l0eSA9IDEuMDtcdFx0XG5cdFx0XHRyZW1vdmVJbWFnZUJ1dHRvbi50aW50Q29sb3IgPSBudWxsO1x0XG5cdFx0fSk7XG5cblxuXG5cdFx0cmV0dXJuIHJlbW92ZUJ1dHRvbkNvbnRhaW5lcjtcblx0fVxuXG5cblxuXG5cblx0ZnVuY3Rpb24gZ2V0QnlWYWx1ZShhcnIsIHZhbHVlKSB7XG5cdFx0Zm9yICh2YXIgaT0wLCBpTGVuPWFyci5sZW5ndGg7IGk8aUxlbjsgaSsrKSB7XG5cdFx0ICBpZiAoYXJyW2ldLmIgPT0gdmFsdWUpIHJldHVybiBhcnJbaV07XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gZmluZEJ5SW5kZXgoZWxlbWVudCx2YWx1ZSkgeyBcblx0XHRyZXR1cm4gZWxlbWVudC5jZWxsSW5kZXggPT09IHZhbHVlO1xuXHR9XG5cblx0ZnVuY3Rpb24gc2hha2Uodmlldykge1xuXHRcdHZpZXcuZmlyc3RSdW4gPSB0cnVlO1xuXG5cdFx0Ly9UcmFuc2xhdGlvbiB0byBzdGFydCBmcm9tXG5cdFx0dmlldy50cmFuc2Zvcm0gPSB0cl9zdGFydDtcblx0XHRcblx0XHQvL0FuaW1hdGlvblxuXHRcdHZhciBhID0gVGl0YW5pdW0uVUkuY3JlYXRlQW5pbWF0aW9uKCk7XG5cdFx0YS5jdXJ2ZSA9IFRpdGFuaXVtLlVJLkFOSU1BVElPTl9DVVJWRV9FQVNFX0lOX09VVDtcblx0XHRhLnRyYW5zZm9ybSA9IHRyX2FuaW07XG5cdFx0YS5kdXJhdGlvbiA9IDEyNTtcblx0XHRhLmF1dG9yZXZlcnNlID0gdHJ1ZTtcblx0XHRhLnJlcGVhdCA9IDIwMDA7XG5cdFx0YS5kZWxheSA9IDA7XG5cdFxuXHRcdC8vUmV0dXJuIHRvIGluaXRpYWwgcG9zaXRpb25cblx0XHRhLmFkZEV2ZW50TGlzdGVuZXIoJ2NvbXBsZXRlJyxmdW5jdGlvbigpIHtcblx0XHRcdGlmIChjb21wbGV0ZUNvdW50ZXIgPT0gY2VsbHMubGVuZ3RoLTEpe1xuXHRcdFx0XHRlZGl0TW9kZShmYWxzZSk7XG5cdFx0XHRcdGNvbXBsZXRlQ291bnRlciA9IDA7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0Y29tcGxldGVDb3VudGVyKys7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0dmlldy53b2JibGVBbmltYXRpb24gPSBhO1xuXHRcdC8vRXhlY3V0ZSBBbmltYXRpb25cblx0XHR2aWV3LmFuaW1hdGUoYSk7XG5cdCAgfVxuXG5cdCBmdW5jdGlvbiB3b2JibGUoKXtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGNlbGxzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRjZWxsc1tpXS5yZW1vdmVCdXR0b24uc2hvdygpO1xuXHRcdFx0Ly9zaGFrZShjZWxsc1tpXS5jZWxsQ29udGVudCk7XG5cdFx0XHQvLyBjZWxsc1tpXS5kcmFnZ2FibGUuc2V0Q29uZmlnKHtcblx0XHRcdC8vIFx0ZW5hYmxlZCA6IHRydWVcblx0XHRcdC8vIH0pO1xuXHRcdH1cblx0IH1cblx0ICBcblx0IHZhciBlZGl0TW9kZSA9IGZ1bmN0aW9uKHN0YXR1cykge1xuXHRcdGlmIChzdGF0dXMgPT0gZmFsc2Upe1xuXHRcdFx0dmFyIHJlc3RUUiA9IFRpdGFuaXVtLlVJLmNyZWF0ZU1hdHJpeDJEKCk7XG5cdFx0XHRyZXN0VFIucm90YXRlKC0yLDApO1xuXG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGNlbGxzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGNlbGxzW2ldLnJlbW92ZUJ1dHRvbi5oaWRlKCk7XG5cblx0XHRcdFx0aWYgKCFpc0FuZHJvaWQpe1xuXHRcdFx0XHRcdGNlbGxzW2ldLmNlbGxDb250ZW50LnN0b3BBbmltYXRpb25zKCk7XG5cdFx0XHRcdFx0Y2VsbHNbaV0uY2VsbENvbnRlbnQudHJhbnNmb3JtID0gcmVzdFRSO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdGNlbGxzW2ldLmNlbGxDb250ZW50LnN0b3BBbmltYXRpb24oKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIGNlbGxzW2ldLmRyYWdnYWJsZS5zZXRDb25maWcoe1xuXHRcdFx0XHQvLyBcdGVuYWJsZWQgOiB0cnVlXG5cdFx0XHRcdC8vIH0pO1x0XG5cdFx0XHR9XG5cdFx0XHR3b2JiZWxpbmcgPSBmYWxzZTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHR3b2JibGUoKTtcblx0XHR9XG5cdCB9XG5cblxuXHQgdmFyIHNldENlbGxzID0gZnVuY3Rpb24oZGF0YSkge1xuXHRcdGFyZ3MuZGF0YSA9IGRhdGE7XG5cdFx0Y2VsbHMgPSBbXSxcblx0XHR0ZW1wQ2VsbHMgPSBbXTtcblx0XHRwb3NBcnJheSA9IFtdLFxuXHRcdHRlbXBQb3NBcnJheSA9IFtdLFxuXHRcdHJvd0FycmF5ID0gW107XG5cdFx0cG9wdWxhdGUoKTtcblx0IH1cblxuXG5cdGZ1bmN0aW9uIHBvcHVsYXRlKCl7XG5cdFx0Y29tcGxldGVDb3VudGVyID0gMDtcblxuXHRcdC8vY2xlYXIgb3V0IHRoZSBwYXJlbnQgdmlld1xuXHQgIFx0dmFyIHZpZXdDaGlsZHJlbiA9IHNvcnRhYmxlQ29udGVudFZpZXcuY2hpbGRyZW4uc2xpY2UoMCk7XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB2aWV3Q2hpbGRyZW4ubGVuZ3RoOyArK2kpIHtcblx0ICAgICAgICBzb3J0YWJsZUNvbnRlbnRWaWV3LnJlbW92ZSh2aWV3Q2hpbGRyZW5baV0pO1xuXHRcdH1cblx0XHRcblx0XHR2YXIgcm93ID0gMCxcblx0XHRcdHJvd0NoZWNrID0gJyc7XG5cdFxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgYXJncy5kYXRhLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcblx0XHRcdHZhciBjb2x1bW4gPSBpICUgYXJncy5jb2x1bW5zO1xuXHRcdFx0dmFyIHRvcCA9IHJvdyAqIChhcmdzLmNlbGxIZWlnaHQgKyAoMiAqIGFyZ3Mucm93UGFkZGluZykpO1xuXHRcdFx0dmFyIGxlZnQgPSBjb2x1bW4gKiAoYXJncy5jZWxsV2lkdGggKyAoMiAqIGFyZ3MuY29sdW1uUGFkZGluZykpICsgYXJncy5jb2x1bW5QYWRkaW5nIC0gMTtcblxuXHRcdFx0dmFyIGNlbGwgPSBEcmFnZ2FibGUuY3JlYXRlVmlldyh7XG5cdFx0XHRcdHBvc2l0aW9uOiBpLFxuXHRcdFx0XHRpbmRleDogaSxcblx0XHRcdFx0dG9wIDogdG9wLFxuXHRcdFx0XHRsZWZ0IDogbGVmdCxcblx0XHRcdFx0aGVpZ2h0IDogYXJncy5jZWxsSGVpZ2h0KzIsXG5cdFx0XHRcdHdpZHRoIDogYXJncy5jZWxsV2lkdGgrMixcblx0XHRcdFx0ekluZGV4OjEwLFxuXHRcdFx0XHRiYWNrZ3JvdW5kQ29sb3I6J3RyYW5zcGFyZW50Jyxcblx0XHRcdFx0ZWxldmF0aW9uOiAwLFxuXHRcdFx0XHRjbGlwTW9kZTooIWlzQW5kcm9pZCkgPyBUaS5VSS5pT1MuQ0xJUF9NT0RFX0RJU0FCTEVEIDogdW5kZWZpbmVkLFxuXHRcdFx0XHRib3JkZXJSYWRpdXM6KGFyZ3MuY2VsbEJvcmRlclJhZGl1cykgPyBhcmdzLmNlbGxCb3JkZXJSYWRpdXMgOiB1bmRlZmluZWQsXG5cdFx0XHRcdGRyYWdnYWJsZUNvbmZpZzoge1xuXHRcdFx0XHRcdGVuYWJsZWQ6IHRydWUsXG5cdFx0XHRcdFx0Ly9lbmFibGVkT25Mb25ncHJlc3M6IHRydWUsXG5cdFx0XHRcdFx0c2hvd1NoYWRvd09uTW92ZTogZmFsc2Vcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblxuXHRcdFx0dmFyIHJlbW92ZUJ1dHRvbiA9IGNyZWF0ZVJlbW92ZUJ1dHRvbihjZWxsKTtcblxuXHRcdFx0cmVtb3ZlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLGZ1bmN0aW9uKGUpe1xuXHRcdFx0XHR2YXIgdGhpc1JlYWxJbmRleCA9IGNlbGxzLmZpbmRJbmRleCh4ID0+IHgucG9zaXRpb24gPT0gdGhpcy5wYXJlbnRDZWxsLnBvc2l0aW9uKTtcblx0XHRcdFx0c29ydGFibGVDb250ZW50Vmlldy5yZW1vdmUoY2VsbHNbdGhpc1JlYWxJbmRleF0pO1xuXHRcdFx0XHRjZWxscy5yZW1vdmVJdGVtKHRoaXNSZWFsSW5kZXgpO1xuXHRcdFx0XHRhcmdzLmRhdGEucmVtb3ZlSXRlbSh0aGlzUmVhbEluZGV4KTtcblxuXHRcdFx0XHQgZm9yKHZhciBqID0gdGhpcy5wYXJlbnRDZWxsLnBvc2l0aW9uOyBqIDwgY2VsbHMubGVuZ3RoOyBqKyspe1xuXHRcdFx0XHRcdHZhciBpbmRleEluQ2VsbHMgPSBjZWxscy5maW5kSW5kZXgoeCA9PiB4LnBvc2l0aW9uID09IChqKzEpKTtcblx0XHRcdFx0ICAgXHRjZWxsc1tpbmRleEluQ2VsbHNdLmFwcGx5UHJvcGVydGllcyh7XG5cdFx0XHRcdCAgIFx0IFx0cG9zaXRpb246alxuXHRcdFx0XHQgIFx0fSk7XG5cdFx0XHRcdCB9XG5cdFx0XHRcdFxuXHRcdFx0XHRpZiAodGhpcy5wYXJlbnRDZWxsLnBvc2l0aW9uID09IGNlbGxzLmxlbmd0aCl7XG5cdFx0XHRcdFx0cG9zQXJyYXkucmVtb3ZlSXRlbShwb3NBcnJheS5maW5kSW5kZXgoeCA9PiB4LmNlbGxJbmRleCA9PSB0aGlzLnBhcmVudENlbGwuaW5kZXgpKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRmb3IodmFyIGogPSB0aGlzLnBhcmVudENlbGwucG9zaXRpb247IGogPCBjZWxscy5sZW5ndGg7IGorKyl7XG5cdFx0XHRcdFx0XHRcdFx0XHRkZWxldGVhbmltYXRlKHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0Y2VsbFBvc2l0aW9uOiBqLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkUG9zaXRpb25JbmRleDogaixcblx0XHRcdFx0XHRcdFx0XHRcdFx0Y2FsbGJhY2s6IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKGogPT0gcG9zQXJyYXkubGVuZ3RoLTEpe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cG9zQXJyYXkucG9wKCk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVuYWJsZVRvdWNoKHRydWUpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcblx0XHRcdH0pO1xuXG5cdFx0XHRcblx0XHRcdGFyZ3MuZGF0YVtpXS5hcHBseVByb3BlcnRpZXMoe1xuXHRcdFx0XHRjbGlwTW9kZTooIWlzQW5kcm9pZCkgPyBUaS5VSS5pT1MuQ0xJUF9NT0RFX0RJU0FCTEVEIDogdW5kZWZpbmVkXG5cdFx0XHR9KVxuXHRcdFx0XHRcdFxuXG5cdFx0XHR2YXIgY2VsbENvbnRlbnQgPSB2aWV3RnVuYy5jcmVhdGVWaWV3KHtcblx0XHRcdFx0aGVpZ2h0OmFyZ3MuY2VsbEhlaWdodCxcblx0XHRcdFx0d2lkdGg6YXJncy5jZWxsV2lkdGgsXG5cdFx0XHRcdGJhY2tncm91bmRDb2xvcjooYXJncy5jZWxsQmFja2dyb3VuZENvbG9yKSA/IGFyZ3MuY2VsbEJhY2tncm91bmRDb2xvciA6ICd0cmFuc3BhcmVudCcsXG5cdFx0XHRcdGJvcmRlclJhZGl1czooYXJncy5jZWxsQm9yZGVyUmFkaXVzKSA/IGFyZ3MuY2VsbEJvcmRlclJhZGl1cyA6IHVuZGVmaW5lZCxcblx0XHRcdFx0Y2xpcE1vZGU6KCFpc0FuZHJvaWQpID8gVGkuVUkuaU9TLkNMSVBfTU9ERV9ESVNBQkxFRCA6IHVuZGVmaW5lZFxuXHRcdFx0fSk7XG5cblx0XHRcdFxuXG5cblx0XHRcdGlmIChzaG93U2hhZG93cyA9PSB0cnVlICYmICFpc0FuZHJvaWQpe1xuXHRcdFx0XHR2YXIgc2hhZG93VmlldyA9IHZpZXdGdW5jLmNyZWF0ZVZpZXcoe1xuXHRcdFx0XHRcdGhlaWdodDphcmdzLmNlbGxIZWlnaHQsXG5cdFx0XHRcdFx0d2lkdGg6YXJncy5jZWxsV2lkdGgsXG5cdFx0XHRcdFx0YmFja2dyb3VuZENvbG9yOmFyZ3MuZGF0YVtpXS5iYWNrZ3JvdW5kQ29sb3IsXG5cdFx0XHRcdFx0Ym9yZGVyUmFkaXVzOihhcmdzLmNlbGxCb3JkZXJSYWRpdXMpID8gYXJncy5jZWxsQm9yZGVyUmFkaXVzIDogdW5kZWZpbmVkLFxuXHRcdFx0XHRcdGNsaXBNb2RlOighaXNBbmRyb2lkKSA/IFRpLlVJLmlPUy5DTElQX01PREVfRElTQUJMRUQgOiB1bmRlZmluZWQsXG5cdFx0XHRcdFx0dmlld1NoYWRvd0NvbG9yOiAnIzAwMDAwMCcsXG5cdFx0XHRcdFx0dmlld1NoYWRvd09mZnNldDoge1xuXHRcdFx0XHRcdFx0eDogMCxcblx0XHRcdFx0XHRcdHk6IDBcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHZpZXdTaGFkb3dSYWRpdXM6OCxcblx0XHRcdFx0XHRvcGFjaXR5OjAuMFxuXHRcdFx0XHR9KTtcblx0XHRcdFx0Y2VsbENvbnRlbnQuYWRkKHNoYWRvd1ZpZXcpO1xuXHRcdFx0XHRjZWxsLnNoYWRvd1ZpZXcgPSBzaGFkb3dWaWV3O1xuXHRcdFx0fVxuXHRcdFx0Y2VsbENvbnRlbnQuYWRkKGFyZ3MuZGF0YVtpXSk7XG5cdFx0XHRjZWxsQ29udGVudC5hZGQocmVtb3ZlQnV0dG9uKTtcblx0XHRcdGNlbGwuYWRkKGNlbGxDb250ZW50KTtcblx0XHRcdGNlbGwuY2VsbENvbnRlbnQgPSBjZWxsQ29udGVudDtcblx0XHRcdGNlbGwucmVtb3ZlQnV0dG9uID0gcmVtb3ZlQnV0dG9uO1xuXG5cdFx0XHRjZWxscy5wdXNoKGNlbGwpO1xuXHRcdFx0cG9zQXJyYXkucHVzaCh7dG9wOnRvcCxsZWZ0OmxlZnQsIGNlbGxJbmRleDogaX0pO1xuXHRcdFx0c29ydGFibGVDb250ZW50Vmlldy5hZGQoY2VsbCk7XG5cdFxuXHRcdFx0aWYgKGNvbHVtbiArIDEgPT09IGFyZ3MuY29sdW1ucykge1xuXHRcdFx0XHRyb3crKztcblx0XHRcdH1cblx0XG5cdFx0XHQvL2F0dGFjaCB0aGUgZXZlbnQgbGlzdGVuZXIgdG8gZWFjaCB2aWV3XG5cdFx0XHQoZnVuY3Rpb24odikge1x0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFxuXHRcdFx0XHR2LmFkZEV2ZW50TGlzdGVuZXIoJ2xvbmdwcmVzcycsIGZ1bmN0aW9uKGUpe1xuXHRcdFx0XHRcdGlmICh3b2JiZWxpbmcgPT0gZmFsc2Upe1xuXHRcdFx0XHRcdFx0d29iYmVsaW5nID0gdHJ1ZTtcblx0XHRcdFx0XHRcdGlmICghaXNBbmRyb2lkKXtcblx0XHRcdFx0XHRcdFx0Ly9UaS5NZWRpYS5wZWVrKCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdC8vXHRUaS5NZWRpYS52aWJyYXRlKCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR3b2JibGUoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHRpZiAoIWlzQW5kcm9pZCl7XG5cdFx0XHRcdFx0XHRcdC8vVGkuTWVkaWEucGVlaygpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHRcdC8vVGkuTWVkaWEudmlicmF0ZSgpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWRpdE1vZGUoZmFsc2UpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XG5cdFx0XHRcdCB2LmFkZEV2ZW50TGlzdGVuZXIoJ3N0YXJ0JywgZnVuY3Rpb24oZSl7XG5cdFx0XHRcdCBcdCB2LnpJbmRleCA9IDEwMDtcblx0XHRcdFx0XHQgaWYgKHNob3dTaGFkb3dzID09IHRydWUpe1xuXHRcdFx0XHRcdFx0aWYgKCFpc0FuZHJvaWQpe1xuXHRcdFx0XHRcdFx0XHR2LnNoYWRvd1ZpZXcuYW5pbWF0ZShmYWRlaW4pO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHRcdC8vdi5hbmltYXRlKGFuZHJvaWRTaGFkb3dTaG93KTtcblx0XHRcdFx0XHRcdFx0di5lbGV2YXRpb24gPSAxMDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Ly92LnRyYW5zZm9ybSA9IHNtYWxsU2NhbGU7XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdCAvLyB2LmFkZEV2ZW50TGlzdGVuZXIoJ2NhbmNlbCcsIGZ1bmN0aW9uKGUpe1xuXG5cdFx0XHRcdC8vIH0pO1xuXG5cdFx0XHRcdHYuYWRkRXZlbnRMaXN0ZW5lcignY2FuY2VsJywgZnVuY3Rpb24oZSl7XG5cdFx0XHRcdFx0aWYgKHNob3dTaGFkb3dzID09IHRydWUpe1xuXHRcdFx0XHRcdFx0aWYgKCFpc0FuZHJvaWQpe1xuXHRcdFx0XHRcdFx0XHR2LnNoYWRvd1ZpZXcuYW5pbWF0ZShmYWRlb3V0KTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0XHR2LmVsZXZhdGlvbiA9IDA7XG5cdFx0XHRcdFx0XHRcdC8vdi5hbmltYXRlKGFuZHJvaWRTaGFkb3dIaWRlKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Ly92LnRyYW5zZm9ybSA9IG5vcm1hbFNjYWxlO1xuXHRcdFx0XHR9KTtcblxuXG5cdFx0XHRcdHYuYWRkRXZlbnRMaXN0ZW5lcignZW5kJywgZnVuY3Rpb24oZSl7XG5cdFx0XHRcdFx0aWYgKHNob3dTaGFkb3dzID09IHRydWUpe1xuXHRcdFx0XHRcdFx0aWYgKCFpc0FuZHJvaWQpe1xuXHRcdFx0XHRcdFx0XHR2LnNoYWRvd1ZpZXcuYW5pbWF0ZShmYWRlb3V0KTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0XHR2LmVsZXZhdGlvbiA9IDA7XG5cdFx0XHRcdFx0XHRcdC8vdi5hbmltYXRlKGFuZHJvaWRTaGFkb3dIaWRlKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Ly92LnRyYW5zZm9ybSA9IG5vcm1hbFNjYWxlO1xuXG5cdFx0XHRcdFx0Ly9kaXNhYmxlIHRoZSB0b3VjaFxuXHRcdFx0XHRcdGVuYWJsZVRvdWNoKGZhbHNlKTtcblx0XHRcdFx0XHR2YXIgZFBvc2l0aW9uSW5kZXggPSBnZXRQb3NpdGlvbkluZGV4KGUpO1xuXHRcdFx0XHRcdHZhciBvUG9zaXRpb25JbmRleCA9IHYucG9zaXRpb247XHRcdFx0XHRcdFxuXHRcdFx0XHRcdC8vdi5sZWZ0ID0gZS5sZWZ0O1xuXHRcdFx0XHRcdC8vdi50b3AgPSBlLnRvcDtcblx0XHRcdFx0XHRcblx0XHRcdFx0XHRhbmltYXRlKHtcblx0XHRcdFx0XHRcdGNlbGxQb3NpdGlvbjogb1Bvc2l0aW9uSW5kZXgsXG5cdFx0XHRcdFx0XHRkUG9zaXRpb25JbmRleDogZFBvc2l0aW9uSW5kZXgsXG5cdFx0XHRcdFx0XHRkdXJhdGlvbjogMjI1XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XG5cblx0XHRcdFx0XHQvL21vdmUgb2xkIGNlbGxzXG5cdFx0XHRcdFx0aWYoZFBvc2l0aW9uSW5kZXggIT09IG9Qb3NpdGlvbkluZGV4KXtcblx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0dmFyIHN0YXJ0UG9zID0gKGRQb3NpdGlvbkluZGV4ID4gb1Bvc2l0aW9uSW5kZXgpID8gb1Bvc2l0aW9uSW5kZXggOiBkUG9zaXRpb25JbmRleDtcblx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0dmFyIG1heCA9IChkUG9zaXRpb25JbmRleCA+IG9Qb3NpdGlvbkluZGV4KSA/ICgoZFBvc2l0aW9uSW5kZXggLSBvUG9zaXRpb25JbmRleCkrb1Bvc2l0aW9uSW5kZXgpIDogKChvUG9zaXRpb25JbmRleCAtIGRQb3NpdGlvbkluZGV4KStkUG9zaXRpb25JbmRleCk7XG5cdFx0XHRcdFx0XHRpZihkUG9zaXRpb25JbmRleCA+IG9Qb3NpdGlvbkluZGV4KXtcblx0XHRcdFx0XHRcdFx0Ly9hc2NlbmRpbmdcblx0XHRcdFx0XHRcdFx0Zm9yKHZhciBpID0gc3RhcnRQb3M7IGkgPCBtYXg7IGkrKyl7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGFuaW1hdGUoe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGNlbGxQb3NpdGlvbjogaSsxLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRQb3NpdGlvbkluZGV4OiBpLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGNhbGxiYWNrOiAoaSsxKSAhPT0gbWF4ID8gJycgOiAoZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVuYWJsZVRvdWNoKHRydWUpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHYuekluZGV4ID0gMTA7XHRcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0sMjApO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH0pO1x0XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdC8vZGVzY2VuZGluZ1xuXHRcdFx0XHRcdFx0XHRmb3IodmFyIGkgPSBzdGFydFBvczsgaSA8IG1heDsgaSsrKXtcblx0XHRcdFx0XHRcdFx0XHRcdGFuaW1hdGUoe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRjZWxsUG9zaXRpb246IGksXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRQb3NpdGlvbkluZGV4OiBpKzEsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGNhbGxiYWNrOiAoaSsxKSAhPT0gbWF4ID8gJycgOiAoZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlbmFibGVUb3VjaCh0cnVlKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHYuekluZGV4ID0gMTA7XHRcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9LDIwKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdFx0XHRcdH0pO1x0XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0ZW5hYmxlVG91Y2godHJ1ZSk7XG5cdFx0XHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdFx0di56SW5kZXggPSAxMDtcdFxuXHRcdFx0XHRcdFx0fSwyMCk7XG5cdFx0XHRcdFx0fVx0XHRcdFx0XHRcblx0XHRcdFx0fSk7XG5cdFx0XHR9KShjZWxsKTtcblx0XG5cdFx0fVxuXHR9XG5cdFxuXHRmdW5jdGlvbiBhbmltYXRlKG9iail7XG5cdFx0XG5cdFx0dmFyIGluZGV4SW5DZWxscyA9IGNlbGxzLmZpbmRJbmRleCh4ID0+IHgucG9zaXRpb24gPT0gb2JqLmNlbGxQb3NpdGlvbik7XG5cdFx0dmFyIGluZGV4T2ZDZWxsID0gY2VsbHNbaW5kZXhJbkNlbGxzXS5pbmRleDtcblx0XHR2YXIgaW5kZXhJblBvc0FycmF5ID0gcG9zQXJyYXkuZmluZEluZGV4KHggPT4geC5jZWxsSW5kZXggPT0gaW5kZXhPZkNlbGwpO1xuXG5cdFx0aWYgKG9iai53aXRoU2hhZG93KXtcblx0XHRcdFx0Y2VsbHNbaW5kZXhJbkNlbGxzXS5hbmltYXRlKHtcblx0XHRcdFx0XHR0b3A6IHBvc0FycmF5W29iai5kUG9zaXRpb25JbmRleF0udG9wLCBcblx0XHRcdFx0XHRsZWZ0OiBwb3NBcnJheVtvYmouZFBvc2l0aW9uSW5kZXhdLmxlZnQsIFxuXHRcdFx0XHRcdGR1cmF0aW9uOiBvYmouZHVyYXRpb24gfHwgMjI1LFxuXHRcdFx0XHRjdXJ2ZTpUaXRhbml1bS5VSS5BTklNQVRJT05fQ1VSVkVfRUFTRV9JTl9PVVRcblx0XHRcdFx0fSwgZnVuY3Rpb24oKXtcblx0XHRcdFx0XHQvL2hhbmRsZSBjZWxsIGFycmF5IG1vdmVtZW50cyBvbiBjb21wbGV0aW9uIGNhbGxiYWNrXG5cdFx0XHRcdFx0Ly90byBwcmV2ZW50IHdoYXQgYXBwZWFyZWQgdG8gYmUgcmFjZSBjb25kaXRpb25zXHRcdFx0XG5cdFx0XHRcdFx0Y2VsbHNbaW5kZXhJbkNlbGxzXS5wb3NpdGlvbiA9IG9iai5kUG9zaXRpb25JbmRleDtcblx0XHRcdFx0XHRwb3NBcnJheVtvYmouZFBvc2l0aW9uSW5kZXhdLmNlbGxJbmRleCA9IGluZGV4T2ZDZWxsO1xuXHRcblx0XHRcdFx0XHQvL3BlcmZvcm0gYW55IGNhbGxiYWNrc1xuXHRcdFx0XHRcdGlmKHR5cGVvZihvYmouY2FsbGJhY2spID09PSAnZnVuY3Rpb24nKXtcblx0XHRcdFx0XHRcdG9iai5jYWxsYmFjaygpO1xuXHRcdFx0XHRcdH1cdFxuXHRcdFx0fSk7XHRcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRjZWxsc1tpbmRleEluQ2VsbHNdLmFuaW1hdGUoe1xuXHRcdFx0XHR0b3A6IHBvc0FycmF5W29iai5kUG9zaXRpb25JbmRleF0udG9wLCBcblx0XHRcdFx0bGVmdDogcG9zQXJyYXlbb2JqLmRQb3NpdGlvbkluZGV4XS5sZWZ0LCBcblx0XHRcdFx0ZHVyYXRpb246IG9iai5kdXJhdGlvbiB8fCAyMjUsXG5cdFx0XHRcdGN1cnZlOlRpdGFuaXVtLlVJLkFOSU1BVElPTl9DVVJWRV9FQVNFX0lOX09VVFxuXHRcdFx0XHR9LCBmdW5jdGlvbigpe1xuXHRcdFx0XHRcdC8vaGFuZGxlIGNlbGwgYXJyYXkgbW92ZW1lbnRzIG9uIGNvbXBsZXRpb24gY2FsbGJhY2tcblx0XHRcdFx0XHQvL3RvIHByZXZlbnQgd2hhdCBhcHBlYXJlZCB0byBiZSByYWNlIGNvbmRpdGlvbnNcdFx0XHRcblx0XHRcdFx0XHRjZWxsc1tpbmRleEluQ2VsbHNdLnBvc2l0aW9uID0gb2JqLmRQb3NpdGlvbkluZGV4O1xuXHRcdFx0XHRcdHBvc0FycmF5W29iai5kUG9zaXRpb25JbmRleF0uY2VsbEluZGV4ID0gaW5kZXhPZkNlbGw7XG5cdFxuXHRcdFx0XHRcdC8vcGVyZm9ybSBhbnkgY2FsbGJhY2tzXG5cdFx0XHRcdFx0aWYodHlwZW9mKG9iai5jYWxsYmFjaykgPT09ICdmdW5jdGlvbicpe1xuXHRcdFx0XHRcdFx0b2JqLmNhbGxiYWNrKCk7XG5cdFx0XHRcdFx0fVx0XG5cdFx0XHR9KTtcdFxuXHRcdH1cblx0fVxuXG5cblx0ZnVuY3Rpb24gZGVsZXRlYW5pbWF0ZShvYmope1xuXHRcdFxuXHRcdHZhciBpbmRleEluQ2VsbHMgPSBjZWxscy5maW5kSW5kZXgoeCA9PiB4LnBvc2l0aW9uID09IG9iai5jZWxsUG9zaXRpb24pO1xuXHRcdHZhciBpbmRleE9mQ2VsbCA9IGNlbGxzW2luZGV4SW5DZWxsc10uaW5kZXg7XG5cdFx0dmFyIGluZGV4SW5Qb3NBcnJheSA9IHBvc0FycmF5LmZpbmRJbmRleCh4ID0+IHguY2VsbEluZGV4ID09IGluZGV4T2ZDZWxsKTtcblxuXHRcdGNlbGxzW2luZGV4SW5DZWxsc10uYW5pbWF0ZSh7XG5cdFx0XHR0b3A6IHBvc0FycmF5W29iai5kUG9zaXRpb25JbmRleF0udG9wLCBcblx0XHRcdGxlZnQ6IHBvc0FycmF5W29iai5kUG9zaXRpb25JbmRleF0ubGVmdCwgXG5cdFx0XHRkdXJhdGlvbjogb2JqLmR1cmF0aW9uIHx8IDIyNSxcblx0XHRcdGN1cnZlOlRpdGFuaXVtLlVJLkFOSU1BVElPTl9DVVJWRV9FQVNFX0lOX09VVFxuXHRcdFx0fSwgZnVuY3Rpb24oKXtcblx0XHRcdFx0Ly9oYW5kbGUgY2VsbCBhcnJheSBtb3ZlbWVudHMgb24gY29tcGxldGlvbiBjYWxsYmFja1xuXHRcdFx0XHQvL3RvIHByZXZlbnQgd2hhdCBhcHBlYXJlZCB0byBiZSByYWNlIGNvbmRpdGlvbnNcdFx0XHRcblx0XHRcdFx0Y2VsbHNbaW5kZXhJbkNlbGxzXS5wb3NpdGlvbiA9IG9iai5kUG9zaXRpb25JbmRleDtcblx0XHRcdFx0cG9zQXJyYXlbb2JqLmRQb3NpdGlvbkluZGV4XS5jZWxsSW5kZXggPSBpbmRleE9mQ2VsbDtcblxuXHRcdFx0XHQvL3BlcmZvcm0gYW55IGNhbGxiYWNrc1xuXHRcdFx0XHRpZih0eXBlb2Yob2JqLmNhbGxiYWNrKSA9PT0gJ2Z1bmN0aW9uJyl7XG5cdFx0XHRcdFx0b2JqLmNhbGxiYWNrKCk7XG5cdFx0XHRcdH1cdFxuXHRcdH0pO1x0XHRcdFxuXHR9XG5cblx0XG5cdGZ1bmN0aW9uIGVuYWJsZVRvdWNoKGVuYWJsZSl7XG5cdFx0Ly9lbmFibGUgPSBlbmFibGUgfHwgdHJ1ZTtcblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgY2VsbHMubGVuZ3RoOyBpKyspe1xuXHRcdFx0Y2VsbHNbaV0udG91Y2hFbmFibGVkID0gZW5hYmxlO1xuXHRcdH1cblx0fVxuXG5cblx0dmFyIGVuYWJsZVNvcnQgPSBmdW5jdGlvbihlbmFibGUpe1xuXHRcdC8vZW5hYmxlID0gZW5hYmxlIHx8IHRydWU7XG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IGNlbGxzLmxlbmd0aDsgaSsrKXtcblx0XHRcdGNlbGxzW2ldLmRyYWdnYWJsZS5zZXRDb25maWcoe1xuXHRcdFx0XHRlbmFibGVkIDogdHJ1ZVxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9XHRcblx0XG5cdC8vZ2V0IHRoZSBwb3NpdGlvbiBhcnJheSBpbmRleCBmcm9tIHRoZSBzY3JlZW4gY29vcmRzXG5cdGZ1bmN0aW9uIGdldFBvc2l0aW9uSW5kZXgoZSl7XG5cdFx0XG5cdFx0dmFyIHRvdENlbGxzID0gY2VsbHMubGVuZ3RoLFxuXHRcdFx0dG90Um93cyA9IE1hdGguY2VpbCh0b3RDZWxscyAvIGFyZ3MuY29sdW1ucyksXG5cdFx0XHRjb2wgPSBhcmdzLmNvbHVtbnMtMSxcblx0XHRcdHJvdyA9IHRvdFJvd3MtMSxcblx0XHRcdGhlaWdodE11bHQgPSAoYXJncy5jZWxsSGVpZ2h0ICsgKDIgKiBhcmdzLnJvd1BhZGRpbmcpKSxcblx0XHRcdHdpZHRoTXVsdCA9IChhcmdzLmNlbGxXaWR0aCArICgyICogYXJncy5jb2x1bW5QYWRkaW5nKSk7XG5cdFx0XG5cdFx0Ly9nZXQgdGhlIG5ldyByb3dcblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgdG90Um93czsgaSsrKXtcblx0XHRcdGlmKGUudG9wIDwgKGkgKiBoZWlnaHRNdWx0KSArIChoZWlnaHRNdWx0IC8gMikpe1xuXHRcdFx0XHRyb3cgPSBpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cdFx0XHRcdFx0XG5cdFx0Ly9nZXQgdGhlIG5ldyBjb2x1bW5cblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgYXJncy5jb2x1bW5zOyBpKyspe1xuXHRcdFx0aWYoZS5sZWZ0IDwgKGkgKiB3aWR0aE11bHQpKyh3aWR0aE11bHQvMikpe1xuXHRcdFx0XHRjb2wgPSBpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cdFx0dmFyIGRQb3NpdGlvbkluZGV4ID0gKCgxKnJvdykqYXJncy5jb2x1bW5zKStjb2w7XG5cdFx0XG5cdFx0Ly9jaGVjayB0byBzZWUgaWYgdGhlIGluZGV4IGlzIG91dCBvZiBib3VuZHMgYW5kIGp1c3Qgc2V0IGl0IHRvIHRoZSBsYXN0IGNlbGxcblx0XHQvL3Byb2JhYmx5IGEgYmV0dGVyIHdheSB0byBoYW5kbGUgdGhpc1xuXHRcdGlmKGRQb3NpdGlvbkluZGV4ID49IHRvdENlbGxzKXtcblx0XHRcdGRQb3NpdGlvbkluZGV4ID0gdG90Q2VsbHMtMTtcblx0XHR9XG5cdFx0cmV0dXJuIFx0ZFBvc2l0aW9uSW5kZXg7XHRcblx0fVx0XHRcblxuXHQvL2hlbHBlciBmdW5jdGlvbiBleHRlbmQgb24gb2JqZWN0IHdpdGggdGhlIHByb3BlcnRpZXMgb2Ygb25lIG9yIG1vcmUgb3RoZXJzICh0aGFua3MsIERvam8hKVxuXHRmdW5jdGlvbiBleHRlbmQob2JqLCBwcm9wcykge1xuXHRcdHZhciBlbXB0eSA9IHt9O1x0XG5cdFx0XG5cdFx0aWYoIW9iaikge1xuXHRcdFx0b2JqID0ge307XG5cdFx0fVxuXHRcdGZvcih2YXIgaSA9IDEsIGwgPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG5cdFx0XHRtaXhpbihvYmosIGFyZ3VtZW50c1tpXSk7XG5cdFx0fVxuXHRcdHJldHVybiBvYmo7XG5cdFx0XG5cdFx0ZnVuY3Rpb24gbWl4aW4odGFyZ2V0LCBzb3VyY2UpIHtcblx0XHRcdHZhciBuYW1lLCBzLCBpO1xuXHRcdFx0Zm9yKG5hbWUgaW4gc291cmNlKSB7XG5cdFx0XHRcdGlmKHNvdXJjZS5oYXNPd25Qcm9wZXJ0eShuYW1lKSkge1xuXHRcdFx0XHRcdHMgPSBzb3VyY2VbbmFtZV07XG5cdFx0XHRcdFx0aWYoISggbmFtZSBpbiB0YXJnZXQpIHx8ICh0YXJnZXRbbmFtZV0gIT09IHMgJiYgKCEoIG5hbWUgaW4gZW1wdHkpIHx8IGVtcHR5W25hbWVdICE9PSBzKSkpIHtcblx0XHRcdFx0XHRcdHRhcmdldFtuYW1lXSA9IHM7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdGFyZ2V0O1xuXHRcdFx0Ly8gT2JqZWN0XG5cdFx0fVx0XHRcblx0fVxuXG5cdHNlbGYuZWRpdE1vZGUgPSBlZGl0TW9kZTtcblx0c2VsZi5zZXRDZWxscyA9IHNldENlbGxzO1xuXHRzZWxmLmVuYWJsZVNvcnQgPSBlbmFibGVTb3J0O1xuXHRyZXR1cm4gc2VsZjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTb3J0YWJsZVZpZXc7ICJdLCJ2ZXJzaW9uIjozfQ==

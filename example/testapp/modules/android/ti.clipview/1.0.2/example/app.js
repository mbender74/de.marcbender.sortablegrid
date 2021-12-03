
    var win = Ti.UI.createWindow({
        backgroundColor: "#fff"
    });

    var clipview = require('ti.clipview');

    // similar feature as in iOS views with  clipMode = Titanium.UI.iOS.CLIP_MODE_DISABLED
    // samme options as for Ti.UI.createView() possible


    // child views can draw outside of parent bounds beheavior

    var view = clipview.createClipView({
        top:0,
        backgroundColor:'yellow',
        height:300,
        width:400,
    });

    var nonClippingView = clipview.createClipView({
        backgroundColor:'red',
        height:200,
        width:200,
    });

    // this view can draw outside the parent views
    var insideViewB =Ti.UI.createView({
        backgroundColor:'blue',
        height:10,
        width:300
    });

    view.add(nonClippingView)
    nonClippingView.add(insideViewB);
    win.add(view);



    // normal View beheavior

    var contentView = Ti.UI.createView({
        top:330,
        backgroundColor:'yellow',
        height:300,
        width:400,
    });

    var clippingView = Ti.UI.createView({
        backgroundColor:'red',
        height:200,
        width:200
    });


    var insideViewA = Ti.UI.createView({
        backgroundColor:'blue',
        height:10,
        width:300
    });

    contentView.add(clippingView);
    clippingView.add(insideViewA);
    win.add(contentView);

    win.open();
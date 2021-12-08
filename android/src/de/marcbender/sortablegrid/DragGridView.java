package de.marcbender.sortablegrid;

import java.util.LinkedList;
import java.util.List;
import android.app.Activity;
import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.PixelFormat;
import android.graphics.Rect;
import android.os.Handler;
import android.os.Looper;
import android.os.Vibrator;
import android.util.AttributeSet;
import android.view.Gravity;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewTreeObserver;
import android.view.ViewTreeObserver.OnPreDrawListener;
import android.view.WindowManager;
import android.view.animation.AccelerateDecelerateInterpolator;
import android.widget.AdapterView;
import android.widget.GridView;
import android.widget.ImageView;
import android.widget.ListAdapter;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.animation.Animator;
import android.animation.AnimatorListenerAdapter;
import android.animation.AnimatorSet;
import android.animation.ObjectAnimator;
import android.graphics.Color;
import android.graphics.drawable.Drawable;
import android.graphics.drawable.LayerDrawable;
import android.graphics.drawable.ShapeDrawable;
import android.graphics.drawable.shapes.RoundRectShape;
import org.appcelerator.titanium.util.TiConvert;
import android.content.res.Resources;
import android.content.res.TypedArray;
import android.graphics.BlurMaskFilter;
import android.graphics.PorterDuff;
import androidx.annotation.FloatRange;
import android.util.AttributeSet;
import android.widget.FrameLayout;
import org.appcelerator.kroll.common.Log;

/**
 *
 * @blog http://blog.csdn.net/xiaanming
 *
 * @author xiaanming
 *
 */
public class DragGridView extends GridView{

	private boolean isInEditMode = false;

	/**
	 */
	private long dragResponseMS = 300;

	/**
	 */
	private boolean isDrag = false;

	private int mDownX;
	private int mDownY;
	private int moveX;
	private int moveY;
	/**
	 */
	private int mDragPosition;

	/**
	 */
	private View mStartDragItemView = null;

	/**
	 */
	private ImageView mDragImageView;

	private ShadowLayout shadowLayout;

	/**
	 */

	private WindowManager mWindowManager;
	/**
	 */
	private WindowManager.LayoutParams mWindowLayoutParams;

	/**
	 */
	private Bitmap mDragBitmap;

	/**
	 */
	private int mPoint2ItemTop ;

	/**
	 */
	private int mPoint2ItemLeft;

	/**
	 */
	private int mOffset2Top;

	/**
	 */
	private int mOffset2Left;

	/**
	 */
	private int mStatusHeight;

	/**
	 */
	private int mDownScrollBorder;

	/**
	 */
	private int mUpScrollBorder;

	/**
	 */
	private static final int speed = 20;
	/**
	 */
	private boolean mAnimationEnd = true;

	private DragGridBaseAdapter mDragAdapter;
	/**
	 *
	 */
	private int mNumColumns;
	/**
	 *
	 */
	private int mColumnWidth;
	/**
	 *
	 */
	private boolean mNumColumnsSet;
	private int mHorizontalSpacing;
	private int mVerticalSpacing;




	public class ShadowLayout extends FrameLayout {

	    // Default shadow values
	    private final static float DEFAULT_SHADOW_RADIUS = 30.0F;
	    private final static float DEFAULT_SHADOW_DISTANCE = 15.0F;
	    private final static float DEFAULT_SHADOW_ANGLE = 45.0F;
	    private final static int DEFAULT_SHADOW_COLOR = Color.DKGRAY;

	    // Shadow bounds values
	    private final static int MAX_ALPHA = 255;
	    private final static float MAX_ANGLE = 360.0F;
	    private final static float MIN_RADIUS = 0.1F;
	    private final static float MIN_ANGLE = 0.0F;
	    // Shadow paint
	    private final Paint mPaint = new Paint(Paint.ANTI_ALIAS_FLAG) {
	        {
	            setDither(true);
	            setFilterBitmap(true);
	        }
	    };
	    // Shadow bitmap and canvas
	    private Bitmap mBitmap;
	    private final Canvas mCanvas = new Canvas();
	    // View bounds
	    private final Rect mBounds = new Rect();
	    // Check whether need to redraw shadow
	    private boolean mInvalidateShadow = true;

	    // Detect if shadow is visible
	    private boolean mIsShadowed;

	    // Shadow variables
	    private int mShadowColor;
	    private int mShadowAlpha;
	    private float mShadowRadius;
	    private float mShadowDistance;
	    private float mShadowAngle;
	    private float mShadowDx;
	    private float mShadowDy;

	    public ShadowLayout(final Context context) {
	        this(context, null);
	    }

	    public ShadowLayout(final Context context, final AttributeSet attrs) {
	        this(context, attrs, 0);
	    }

	    public ShadowLayout(final Context context, final AttributeSet attrs, final int defStyleAttr) {
	        super(context, attrs, defStyleAttr);

	        setWillNotDraw(false);
	        setLayerType(LAYER_TYPE_HARDWARE, mPaint);

	        // Retrieve attributes from xml
	        final TypedArray typedArray = context.obtainStyledAttributes(attrs, R.styleable.ShadowLayout);
	        try {
	            setIsShadowed(typedArray.getBoolean(R.styleable.ShadowLayout_sl_shadowed, true));
	            setShadowRadius(
	                    typedArray.getDimension(
	                            R.styleable.ShadowLayout_sl_shadow_radius, DEFAULT_SHADOW_RADIUS
	                    )
	            );
	            setShadowDistance(
	                    typedArray.getDimension(
	                            R.styleable.ShadowLayout_sl_shadow_distance, DEFAULT_SHADOW_DISTANCE
	                    )
	            );
	            setShadowAngle(
	                    typedArray.getInteger(
	                            R.styleable.ShadowLayout_sl_shadow_angle, (int) DEFAULT_SHADOW_ANGLE
	                    )
	            );
	            setShadowColor(
	                    typedArray.getColor(
	                            R.styleable.ShadowLayout_sl_shadow_color, DEFAULT_SHADOW_COLOR
	                    )
	            );
	        } finally {
	            typedArray.recycle();
	        }
	    }

	    @Override
	    protected void onDetachedFromWindow() {
	        super.onDetachedFromWindow();
	        // Clear shadow bitmap
	        if (mBitmap != null) {
	            mBitmap.recycle();
	            mBitmap = null;
	        }
	    }

	    public boolean isShadowed() {
	        return mIsShadowed;
	    }

	    public void setIsShadowed(final boolean isShadowed) {
	        mIsShadowed = isShadowed;
	        postInvalidate();
	    }

	    public float getShadowDistance() {
	        return mShadowDistance;
	    }

	    public void setShadowDistance(final float shadowDistance) {
	        mShadowDistance = shadowDistance;
	        resetShadow();
	    }

	    public float getShadowAngle() {
	        return mShadowAngle;
	    }

	    @FloatRange
	    public void setShadowAngle(@FloatRange(from = MIN_ANGLE, to = MAX_ANGLE) final float shadowAngle) {
	        mShadowAngle = Math.max(MIN_ANGLE, Math.min(shadowAngle, MAX_ANGLE));
	        resetShadow();
	    }

	    public float getShadowRadius() {
	        return mShadowRadius;
	    }

	    public void setShadowRadius(final float shadowRadius) {
	        mShadowRadius = Math.max(MIN_RADIUS, shadowRadius);

	        if (isInEditMode()) return;
	        // Set blur filter to paint
	        mPaint.setMaskFilter(new BlurMaskFilter(mShadowRadius, BlurMaskFilter.Blur.NORMAL));
	        resetShadow();
	    }

	    public int getShadowColor() {
	        return mShadowColor;
	    }

	    public void setShadowColor(final int shadowColor) {
	        mShadowColor = shadowColor;
	        mShadowAlpha = Color.alpha(shadowColor);

	        resetShadow();
	    }

	    public float getShadowDx() {
	        return mShadowDx;
	    }

	    public float getShadowDy() {
	        return mShadowDy;
	    }

	    // Reset shadow layer
	    private void resetShadow() {
	        // Detect shadow axis offset
	        mShadowDx = (float) ((mShadowDistance) * Math.cos(mShadowAngle / 180.0F * Math.PI));
	        mShadowDy = (float) ((mShadowDistance) * Math.sin(mShadowAngle / 180.0F * Math.PI));
		    	mShadowDx = 0;
		    	mShadowDy = 0;

	        // Set padding for shadow bitmap
	        final int padding = 4;

	        setPadding(padding, padding, padding, padding);
	        requestLayout();
	    }

	    private int adjustShadowAlpha(final boolean adjust) {
	        return Color.argb(
	                adjust ? MAX_ALPHA : mShadowAlpha,
	                Color.red(mShadowColor),
	                Color.green(mShadowColor),
	                Color.blue(mShadowColor)
	        );
	    }

	    @Override
	    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
	        super.onMeasure(widthMeasureSpec, heightMeasureSpec);

	        // Set ShadowLayout bounds
	        mBounds.set(0, 0, getMeasuredWidth()+20, getMeasuredHeight()+20);
	    }

	    @Override
	    public void requestLayout() {
	        // Redraw shadow
	        mInvalidateShadow = true;
	        super.requestLayout();
	    }

	    @Override
	    protected void dispatchDraw(final Canvas canvas) {
	        // If is not shadowed, skip
	        if (mIsShadowed) {
	            // If need to redraw shadow
	            if (mInvalidateShadow) {
	                // If bounds is zero
	                if (mBounds.width() != 0 && mBounds.height() != 0) {
	                    // Reset bitmap to bounds
	                    mBitmap = Bitmap.createBitmap(
	                            mBounds.width(), mBounds.height(), Bitmap.Config.ARGB_8888
	                    );
	                    // Canvas reset
	                    mCanvas.setBitmap(mBitmap);

	                    // We just redraw
	                    mInvalidateShadow = false;
	                    // Main feature of this lib. We create the local copy of all content, so now
	                    // we can draw bitmap as a bottom layer of natural canvas.
	                    // We draw shadow like blur effect on bitmap, cause of setShadowLayer() method of
	                    // paint does`t draw shadow, it draw another copy of bitmap
	                    super.dispatchDraw(mCanvas);

	                    // Get the alpha bounds of bitmap
	                    final Bitmap extractedAlpha = mBitmap.extractAlpha();
	                    // Clear past content content to draw shadow
	                    mCanvas.drawColor(0, PorterDuff.Mode.CLEAR);

	                    // Draw extracted alpha bounds of our local canvas
	                    mPaint.setColor(adjustShadowAlpha(false));
	                    mCanvas.drawBitmap(extractedAlpha, mShadowDx, mShadowDy, mPaint);

	                    // Recycle and clear extracted alpha
	                    extractedAlpha.recycle();
	                } else {
	                    // Create placeholder bitmap when size is zero and wait until new size coming up
	                    mBitmap = Bitmap.createBitmap(1, 1, Bitmap.Config.RGB_565);
	                }
	            }

	            // Reset alpha to draw child with full alpha
	            mPaint.setColor(adjustShadowAlpha(true));
	            // Draw shadow bitmap
	            if (mCanvas != null && mBitmap != null && !mBitmap.isRecycled())
	                canvas.drawBitmap(mBitmap, 0.0F, 0.0F, mPaint);
	        }

	        // Draw child`s
	        super.dispatchDraw(canvas);
	    }
	}


	public static Drawable generateBackgroundWithShadow(View view,int cornerRadius,int elevation,int shadowGravity) {
		float scale = view.getResources().getDisplayMetrics().density;
        float cornerRadiusValue = ((float) cornerRadius) * scale;

        int elevationValue = elevation;
        int shadowColorValue = TiConvert.toColor("#88000000");
        int backgroundColorValue = TiConvert.toColor("#ffffff");

        float[] outerRadius = {cornerRadiusValue, cornerRadiusValue, cornerRadiusValue,
                cornerRadiusValue, cornerRadiusValue, cornerRadiusValue, cornerRadiusValue,
                cornerRadiusValue};

        Paint backgroundPaint = new Paint();
        backgroundPaint.setStyle(Paint.Style.FILL);
        backgroundPaint.setShadowLayer(cornerRadiusValue, 0, 0, 0);

        Rect shapeDrawablePadding = new Rect();
        shapeDrawablePadding.left = elevationValue;
        shapeDrawablePadding.right = elevationValue;

        int DY;
        switch (shadowGravity) {
            case Gravity.CENTER:
                shapeDrawablePadding.top = elevationValue;
                shapeDrawablePadding.bottom = elevationValue;
                shapeDrawablePadding.left = elevationValue;
                shapeDrawablePadding.right = elevationValue;
                DY = 0;
                break;
            case Gravity.TOP:
                shapeDrawablePadding.top = elevationValue*2;
                shapeDrawablePadding.bottom = elevationValue;
                DY = -1*elevationValue/3;
                break;
            default:
            case Gravity.BOTTOM:
                shapeDrawablePadding.top = elevationValue;
                shapeDrawablePadding.bottom = elevationValue*2;
                DY = elevationValue/3;
                break;
        }

        ShapeDrawable shapeDrawable = new ShapeDrawable();
        shapeDrawable.setPadding(shapeDrawablePadding);

        shapeDrawable.getPaint().setColor(backgroundColorValue);
        shapeDrawable.getPaint().setShadowLayer(cornerRadiusValue, 0, DY, shadowColorValue);

        view.setLayerType(LAYER_TYPE_SOFTWARE, shapeDrawable.getPaint());

        shapeDrawable.setShape(new RoundRectShape(outerRadius, null, null));

        LayerDrawable drawable = new LayerDrawable(new Drawable[]{shapeDrawable});
        drawable.setLayerInset(0, elevationValue, elevationValue, elevationValue, elevationValue);

        //drawable.setAlpha((int)(0.7));

        return drawable;

    }



	public Bitmap getBitmapFromView(View view)
	{
	    Bitmap bitmap = Bitmap.createBitmap(view.getWidth(), view.getHeight(), Bitmap.Config.ARGB_8888);
	    Canvas canvas = new Canvas(bitmap);
	    view.draw(canvas);
	    return bitmap;
	}

	public Bitmap getBitmapFromView(View view,int defaultColor)
	{
	    Bitmap bitmap = Bitmap.createBitmap(view.getWidth(), view.getHeight(), Bitmap.Config.ARGB_8888);
	    Canvas canvas = new Canvas(bitmap);
	    canvas.drawColor(defaultColor);
	    view.draw(canvas);
	    return bitmap;
	}


	public DragGridView(Context context) {
		this(context, null);
	}

	public DragGridView(Context context, AttributeSet attrs) {
		this(context, attrs, 0);
	}

	public DragGridView(Context context, AttributeSet attrs, int defStyle) {
		super(context, attrs, defStyle);
	//	mVibrator = (Vibrator) context.getSystemService(Context.VIBRATOR_SERVICE);
		mWindowManager = (WindowManager) context.getSystemService(Context.WINDOW_SERVICE);
		mStatusHeight = getStatusHeight(context); //

		if(!mNumColumnsSet){
			mNumColumns = AUTO_FIT;
		}

	}



	public void setEditMode(boolean editing){

		isInEditMode = editing;

	}



	/**
	 *
	 * @param position
	 */
	public void removeItemAnimation(final int position){

		mDragAdapter.removeItem(position);
		final ViewTreeObserver observer = getViewTreeObserver();
		observer.addOnPreDrawListener(new OnPreDrawListener() {

			@Override
			public boolean onPreDraw() {
				observer.removeOnPreDrawListener(this);
				animateReorder(position, getLastVisiblePosition() + 1 );
				return true;
			}
		} );
	}

	private Handler mHandler = new Handler(Looper.getMainLooper());

	//
	private Runnable mLongClickRunnable = new Runnable() {

		@Override
		public void run() {
			isDrag = true; //
			//mVibrator.vibrate(50); //
			mStartDragItemView.setVisibility(View.INVISIBLE);
			createDragImage(mDragBitmap, mDownX, mDownY);
		}
	};


	@Override
	public void setAdapter(ListAdapter adapter) {
		super.setAdapter(adapter);

		if(adapter instanceof DragGridBaseAdapter){
			mDragAdapter = (DragGridBaseAdapter) adapter;
		}else{
			throw new IllegalStateException("the adapter must be implements DragGridAdapter");
		}
	}

	/**
	 *
	 */
	@Override
	public void setNumColumns(int numColumns) {
		super.setNumColumns(numColumns);
		mNumColumnsSet = true;
		this.mNumColumns = numColumns;
	}

	/**
	 *
	 */
	@Override
	public void setColumnWidth(int columnWidth) {
	    super.setColumnWidth(columnWidth);
	    mColumnWidth = columnWidth;
	}

	/**
	 *
	 */
    @Override
	public void setHorizontalSpacing(int horizontalSpacing) {
		super.setHorizontalSpacing(horizontalSpacing);
		this.mHorizontalSpacing = horizontalSpacing;
	}


    /**
     *
     */
	@Override
	public void setVerticalSpacing(int verticalSpacing) {
		super.setVerticalSpacing(verticalSpacing);
		this.mVerticalSpacing = verticalSpacing;
	}

	/**
     *
     */
	@Override
    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
        if (mNumColumns == AUTO_FIT) {
            int numFittedColumns;
            if (mColumnWidth > 0) {
                int gridWidth = Math.max(MeasureSpec.getSize(widthMeasureSpec) - getPaddingLeft()
                        - getPaddingRight(), 0);
                numFittedColumns = gridWidth / mColumnWidth;
                if (numFittedColumns > 0) {
                    while (numFittedColumns != 1) {
                        if (numFittedColumns * mColumnWidth + (numFittedColumns - 1)
                                * mHorizontalSpacing > gridWidth) {
                            numFittedColumns--;
                        } else {
                            break;
                        }
                    }
                } else {
                    numFittedColumns = 1;
                }
            } else {
                numFittedColumns = 2;
            }
            mNumColumns = numFittedColumns;
        }

        super.onMeasure(widthMeasureSpec, heightMeasureSpec);
    }


	public int getItemPosition(int x, int y) {
			mDragPosition = pointToPosition(x, y);

			return mDragPosition;
	}



	/**
	 *
	 * @param dragResponseMS
	 */
	public void setDragResponseMS(long dragResponseMS) {
		this.dragResponseMS = dragResponseMS;
	}

	@Override
	public boolean dispatchTouchEvent(MotionEvent ev) {


		if (isInEditMode == true){
			switch(ev.getAction()){
			case MotionEvent.ACTION_DOWN:
				mDownX = (int) ev.getX();
				mDownY = (int) ev.getY();

				//,
				mDragPosition = pointToPosition(mDownX, mDownY);


				if(mDragPosition == AdapterView.INVALID_POSITION){
					return super.dispatchTouchEvent(ev);
				}

				//
				mHandler.postDelayed(mLongClickRunnable, dragResponseMS);

				//
				mStartDragItemView = getChildAt(mDragPosition - getFirstVisiblePosition());

				//
				mPoint2ItemTop = mDownY - mStartDragItemView.getTop();
				mPoint2ItemLeft = mDownX - mStartDragItemView.getLeft();

				mOffset2Top = (int) (ev.getRawY() - mDownY);
				mOffset2Left = (int) (ev.getRawX() - mDownX);

				//
				mDownScrollBorder = getHeight() / 5;
				//
				mUpScrollBorder = getHeight() * 4/5;

				mDragBitmap = Bitmap.createBitmap(getBitmapFromView(mStartDragItemView));

				break;
			case MotionEvent.ACTION_MOVE:
				int moveX = (int)ev.getX();
				int moveY = (int) ev.getY();

				//
				if(!isTouchInItem(mStartDragItemView, moveX, moveY)){
					mHandler.removeCallbacks(mLongClickRunnable);
				}
				break;
			case MotionEvent.ACTION_UP:
				mHandler.removeCallbacks(mLongClickRunnable);
				mHandler.removeCallbacks(mScrollRunnable);


				onStopDrag();
				isDrag = false;

				//Log.d("MotionEvent", "ACTION_UP dispatchTouchEvent");

				break;
			case MotionEvent.ACTION_CANCEL:
				mHandler.removeCallbacks(mLongClickRunnable);
				mHandler.removeCallbacks(mScrollRunnable);
				//Log.d("MotionEvent", "ACTION_CANCEL");
				break;
			}

		}
		else {

		}

		return super.dispatchTouchEvent(ev);
	}


	/**
	 *
	 * @param itemView
	 * @param x
	 * @param y
	 * @return
	 */
	private boolean isTouchInItem(View dragView, int x, int y){
		if(dragView == null){
			return false;
		}
		int leftOffset = dragView.getLeft();
		int topOffset = dragView.getTop();
		if(x < leftOffset || x > leftOffset + dragView.getWidth()){
			return false;
		}

		if(y < topOffset || y > topOffset + dragView.getHeight()){
			return false;
		}

		return true;
	}



	@Override
	public boolean onTouchEvent(MotionEvent ev) {
		if(isDrag && shadowLayout != null){
			switch(ev.getAction()){
			case MotionEvent.ACTION_MOVE:
				moveX = (int) ev.getX();
				moveY = (int) ev.getY();

				//
				onDragItem(moveX, moveY);
				break;
			case MotionEvent.ACTION_UP:
		//							Log.d("MotionEvent", "ACTION_UP onTouchEvent");

				//onStopDrag();
				//isDrag = false;
				break;
			case MotionEvent.ACTION_CANCEL:
			//						Log.d("MotionEvent", "ACTION_CANCEL");

				onStopDrag();
				isDrag = false;
				break;
			}
			return true;
		}
		return super.onTouchEvent(ev);
	}


	/**
	 *
	 * @param bitmap
	 * @param downX
	 *
	 * @param downY
	 *
	 */
	private void createDragImage(Bitmap bitmap, int downX , int downY){
		mWindowLayoutParams = new WindowManager.LayoutParams();
		mWindowLayoutParams.format = PixelFormat.TRANSLUCENT; //
		mWindowLayoutParams.gravity = Gravity.TOP | Gravity.LEFT;
		mWindowLayoutParams.x = downX - mPoint2ItemLeft + mOffset2Left;
		mWindowLayoutParams.y = downY - mPoint2ItemTop + mOffset2Top - mStatusHeight;
		mWindowLayoutParams.alpha = 0.95f;
		mWindowLayoutParams.width = WindowManager.LayoutParams.WRAP_CONTENT;
		mWindowLayoutParams.height = WindowManager.LayoutParams.WRAP_CONTENT;
		mWindowLayoutParams.flags = WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE
	                | WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE ;

		int paddingTopBottom = 4;
    int paddingLeftRight = 4;

		mDragImageView = new ImageView(getContext());
		mDragImageView.setImageBitmap(bitmap);
	  //mDragImageView.setPadding(paddingLeftRight, paddingTopBottom, paddingLeftRight, paddingTopBottom);
		mDragImageView.setClickable(false);
		//mDragImageView.setBackground(generateBackgroundWithShadow(mDragImageView,14,6, Gravity.CENTER));

    int backgroundColorValue = TiConvert.toColor("#CC000000");
		//mDragImageView.setBackgroundColor(backgroundColorValue);
		//mDragImageView.setElevation(10f);
		//mDragImageView.setElevation(10);
		//mDragImageView.setOutlineAmbientShadowColor(backgroundColorValue);
		//mDragImageView.setOutlineSpotShadowColor(backgroundColorValue);

		shadowLayout = new ShadowLayout(getContext());

		shadowLayout.setIsShadowed(true);
		shadowLayout.setShadowAngle(20);
		shadowLayout.setShadowRadius(14);
		shadowLayout.setShadowDistance(20);
		shadowLayout.setShadowColor(Color.BLACK);
		shadowLayout.setClipChildren(false);
    shadowLayout.setClipToPadding(false);
		shadowLayout.addView(mDragImageView);

		mWindowManager.addView(shadowLayout, mWindowLayoutParams);
		//mDragImageView.setTranslationZ(10);
	}

	/**
	 *
	 */
	private void removeDragImage(){
								//		Log.d("removeDragImage", "removeDragImage ");

		if(shadowLayout != null){
											//		Log.d("removeDragImage", "NOT NULL ");

			mWindowManager.removeView(shadowLayout);
			shadowLayout = null;
		}
	}

	/**
	 *
	 * @param x
	 * @param y
	 */
	private void onDragItem(int moveX, int moveY){
		mWindowLayoutParams.x = moveX - mPoint2ItemLeft + mOffset2Left;
		mWindowLayoutParams.y = moveY - mPoint2ItemTop + mOffset2Top - mStatusHeight;
		mWindowManager.updateViewLayout(shadowLayout, mWindowLayoutParams); //
		onSwapItem(moveX, moveY);

		//
		mHandler.post(mScrollRunnable);
	}


	/**
	 *
	 *
	 *
	 */
	private Runnable mScrollRunnable = new Runnable() {

		@Override
		public void run() {
			int scrollY;
			if(getFirstVisiblePosition() == 0 || getLastVisiblePosition() == getCount() - 1){
				mHandler.removeCallbacks(mScrollRunnable);
			}

			if(moveY > mUpScrollBorder){
				 scrollY = speed;
				 mHandler.postDelayed(mScrollRunnable, 25);
			}else if(moveY < mDownScrollBorder){
				scrollY = -speed;
				 mHandler.postDelayed(mScrollRunnable, 25);
			}else{
				scrollY = 0;
				mHandler.removeCallbacks(mScrollRunnable);
			}

			smoothScrollBy(scrollY, 10);
		}
	};


	/**
	 * ,
	 * @param moveX
	 * @param moveY
	 */
	private void onSwapItem(int moveX, int moveY){
		//
		final int tempPosition = pointToPosition(moveX, moveY);

		// -1,
		if(tempPosition != mDragPosition && tempPosition != AdapterView.INVALID_POSITION && mAnimationEnd){
			/**
			 *
			 */
			mDragAdapter.reorderItems(mDragPosition, tempPosition);
			/**
			 *
			 */
			mDragAdapter.setHideItem(tempPosition);

			final ViewTreeObserver observer = getViewTreeObserver();
			observer.addOnPreDrawListener(new OnPreDrawListener() {

				@Override
				public boolean onPreDraw() {
					observer.removeOnPreDrawListener(this);
					animateReorder(mDragPosition, tempPosition);
					mDragPosition = tempPosition;
					return true;
				}
			} );

		}
	}

	/**
	 *
	 * @param view
	 * @param startX
	 * @param endX
	 * @param startY
	 * @param endY
	 * @return
	 */
	private AnimatorSet createTranslationAnimations(View view, float startX,
			float endX, float startY, float endY) {
		ObjectAnimator animX = ObjectAnimator.ofFloat(view, "translationX",
				startX, endX);
		ObjectAnimator animY = ObjectAnimator.ofFloat(view, "translationY",
				startY, endY);
		AnimatorSet animSetXY = new AnimatorSet();
		animSetXY.playTogether(animX, animY);
		return animSetXY;
	}


	/**
	 *
	 * @param oldPosition
	 * @param newPosition
	 */
	private void animateReorder(final int oldPosition, final int newPosition) {
		boolean isForward = newPosition > oldPosition;
		List<Animator> resultList = new LinkedList<Animator>();
		if (isForward) {
			for (int pos = oldPosition; pos < newPosition; pos++) {
				View view = getChildAt(pos - getFirstVisiblePosition());
				if ((pos + 1) % mNumColumns == 0) {
					resultList.add(createTranslationAnimations(view,
							- (view.getWidth() + mHorizontalSpacing) * (mNumColumns - 1), 0,
							view.getHeight() + mVerticalSpacing, 0));
				} else {
					resultList.add(createTranslationAnimations(view,
							view.getWidth() + mHorizontalSpacing, 0, 0, 0));
				}
			}
		} else {
			for (int pos = oldPosition; pos > newPosition; pos--) {
				View view = getChildAt(pos - getFirstVisiblePosition());
				if ((pos) % mNumColumns == 0) {
					resultList.add(createTranslationAnimations(view,
							(view.getWidth() + mHorizontalSpacing) * (mNumColumns - 1), 0,
							-view.getHeight() - mVerticalSpacing, 0));
				} else {
					resultList.add(createTranslationAnimations(view,
							-view.getWidth() - mHorizontalSpacing, 0, 0, 0));
				}
			}
		}

		AnimatorSet resultSet = new AnimatorSet();
		resultSet.playTogether(resultList);
		resultSet.setDuration(300);
		resultSet.setInterpolator(new AccelerateDecelerateInterpolator());
		resultSet.addListener(new AnimatorListenerAdapter() {
			@Override
			public void onAnimationStart(Animator animation) {
				mAnimationEnd = false;
			}

			@Override
			public void onAnimationEnd(Animator animation) {
				mAnimationEnd = true;
			}
		});
		resultSet.start();
	}

	/**
	 *
	 */
	private void onStopDrag(){
							//	Log.d("onStopDrag", "onStopDrag ");

		View view = getChildAt(mDragPosition - getFirstVisiblePosition());
		if(view != null){
			view.setVisibility(View.VISIBLE);
		}
		mDragAdapter.setHideItem(-1);
		removeDragImage();
	}

	/**
	 *
	 * @param context
	 * @return
	 */
	private static int getStatusHeight(Context context){
        int statusHeight = 0;
        Rect localRect = new Rect();
        ((Activity) context).getWindow().getDecorView().getWindowVisibleDisplayFrame(localRect);
        statusHeight = localRect.top;
        if (0 == statusHeight){
            Class<?> localClass;
            try {
                localClass = Class.forName("com.android.internal.R$dimen");
                Object localObject = localClass.newInstance();
                int i5 = Integer.parseInt(localClass.getField("status_bar_height").get(localObject).toString());
                statusHeight = context.getResources().getDimensionPixelSize(i5);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return statusHeight;
    }

}

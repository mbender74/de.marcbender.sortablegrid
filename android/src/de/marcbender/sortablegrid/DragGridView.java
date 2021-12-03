package de.marcbender.sortablegrid;

import java.util.LinkedList;
import java.util.List;

import android.app.Activity;
import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.PixelFormat;
import android.graphics.Rect;
import android.os.Handler;
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

import android.animation.Animator;
import android.animation.AnimatorListenerAdapter;
import android.animation.AnimatorSet;
import android.animation.ObjectAnimator;

/**
 *
 * @blog http://blog.csdn.net/xiaanming
 *
 * @author xiaanming
 *
 */
public class DragGridView extends GridView{
	/**
	 */
	private long dragResponseMS = 1000;

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
		mStatusHeight = getStatusHeight(context); //��ȡ״̬���ĸ߶�

		if(!mNumColumnsSet){
			mNumColumns = AUTO_FIT;
		}

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

	private Handler mHandler = new Handler();

	//
	private Runnable mLongClickRunnable = new Runnable() {

		@Override
		public void run() {
			isDrag = true; //
			//mVibrator.vibrate(50); //
			mStartDragItemView.setVisibility(View.INVISIBLE);//���ظ�item

			//
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

	/**
	 *
	 * @param dragResponseMS
	 */
	public void setDragResponseMS(long dragResponseMS) {
		this.dragResponseMS = dragResponseMS;
	}

	@Override
	public boolean dispatchTouchEvent(MotionEvent ev) {
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


			//
			mStartDragItemView.setDrawingCacheEnabled(true);
			//
			mDragBitmap = Bitmap.createBitmap(mStartDragItemView.getDrawingCache());
			//
			mStartDragItemView.destroyDrawingCache();

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
			break;
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
		if(isDrag && mDragImageView != null){
			switch(ev.getAction()){
			case MotionEvent.ACTION_MOVE:
				moveX = (int) ev.getX();
				moveY = (int) ev.getY();

				//
				onDragItem(moveX, moveY);
				break;
			case MotionEvent.ACTION_UP:
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
		mWindowLayoutParams.format = PixelFormat.TRANSLUCENT; //ͼƬ֮���������ط�͸��
		mWindowLayoutParams.gravity = Gravity.TOP | Gravity.LEFT;
		mWindowLayoutParams.x = downX - mPoint2ItemLeft + mOffset2Left;
		mWindowLayoutParams.y = downY - mPoint2ItemTop + mOffset2Top - mStatusHeight;
		mWindowLayoutParams.alpha = 0.55f; //
		mWindowLayoutParams.width = WindowManager.LayoutParams.WRAP_CONTENT;
		mWindowLayoutParams.height = WindowManager.LayoutParams.WRAP_CONTENT;
		mWindowLayoutParams.flags = WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE
	                | WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE ;

		mDragImageView = new ImageView(getContext());
		mDragImageView.setImageBitmap(bitmap);
		mWindowManager.addView(mDragImageView, mWindowLayoutParams);
	}

	/**
	 *
	 */
	private void removeDragImage(){
		if(mDragImageView != null){
			mWindowManager.removeView(mDragImageView);
			mDragImageView = null;
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
		mWindowManager.updateViewLayout(mDragImageView, mWindowLayoutParams); //���¾�����λ��
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

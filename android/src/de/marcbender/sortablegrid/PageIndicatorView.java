package de.marcbender.sortablegrid;

import android.content.Context;
import android.graphics.Color;
import android.util.AttributeSet;
import android.view.Gravity;
import android.widget.ImageView;
import android.widget.LinearLayout;

/**
 * A simple page indicator view that displays dots for each page,
 * similar to iOS UIPageControl.
 */
public class PageIndicatorView extends LinearLayout {

	private int pageCount = 0;
	private int currentPage = 0;
	private int pageIndicatorTintColor = Color.parseColor("#dddddd");
	private int currentPageIndicatorTintColor = Color.RED;
	private float density;

	public PageIndicatorView(Context context) {
		super(context);
		init();
	}

	public PageIndicatorView(Context context, AttributeSet attrs) {
		super(context, attrs);
		init();
	}

	public PageIndicatorView(Context context, AttributeSet attrs, int defStyleAttr) {
		super(context, attrs, defStyleAttr);
		init();
	}

	private void init() {
		density = getContext().getResources().getDisplayMetrics().density;
		setOrientation(HORIZONTAL);
		setGravity(Gravity.CENTER);
		setPadding(0, (int)(8 * density), 0, (int)(8 * density));
	}

	public void setPageCount(int count) {
		pageCount = Math.max(0, count);
		rebuildDots();
	}

	public void setCurrentPage(int page) {
		currentPage = page;
		updateDots();
	}

	public void setPageIndicatorTintColor(int color) {
		pageIndicatorTintColor = color;
		updateDots();
	}

	public void setCurrentPageIndicatorTintColor(int color) {
		currentPageIndicatorTintColor = color;
		updateDots();
	}

	public int getPageCount() {
		return pageCount;
	}

	public int getCurrentPage() {
		return currentPage;
	}

	private void rebuildDots() {
		removeAllViews();

		for (int i = 0; i < pageCount; i++) {
			ImageView dot = createDot(i);
			addView(dot);
		}
		updateDots();
	}

	private ImageView createDot(int index) {
		ImageView dot = new ImageView(getContext());
		int size = (int)(8 * density);
		int margin = (int)(4 * density);
		LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(size, size);
		params.setMargins(margin, 0, margin, 0);
		dot.setLayoutParams(params);
		dot.setScaleType(ImageView.ScaleType.CENTER);
		return dot;
	}

	private void updateDots() {
		int childCount = getChildCount();
		for (int i = 0; i < childCount; i++) {
			ImageView dot = (ImageView) getChildAt(i);
			if (i == currentPage) {
				dot.setBackgroundColor(currentPageIndicatorTintColor);
			} else {
				dot.setBackgroundColor(pageIndicatorTintColor);
			}
		}
	}
}
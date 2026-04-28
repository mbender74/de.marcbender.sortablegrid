package de.marcbender.sortablegrid;

import android.content.Context;
import android.util.Log;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewConfiguration;
import android.view.ViewParent;
import android.widget.FrameLayout;
import android.widget.LinearLayout;

/**
 * Waterfall-Layout: Jeder Spalte ist ein ColumnContainerView (vertical).
 * Alle Spalten stehen horizontal nebeneinander in einem NestedScrollView.
 * Handles drag-and-drop across columns in edit mode via onInterceptTouchEvent.
 */
public class WaterfallLayout extends FrameLayout {

	private static final String LCAT = "WaterfallLayout";
	private static final boolean DBG_LOG = true;
	private static void d(String msg) { if (DBG_LOG) Log.d(LCAT, msg); }

	/** Pro Spalte ein ColumnContainerView */
	private ColumnContainerView[] columnContainers;
	/** Anzahl der Spalten */
	private int spanCount;
	/** Horizontaler Abstand zwischen den Spalten */
	private int horizontalSpacing;

	/** Äußerer NestedScrollView (vertikal scrollbar, performanter als ScrollView) */
	private androidx.core.widget.NestedScrollView mScrollView;
	/** Horizontaler Layout-Container für die Spalten */
	public LinearLayout mHorizontalContainer;

	// Drag state
	private ColumnTouchHelper touchHelper;
	private float touchSlop;
	private float downX, downY;
	private boolean isDragging = false;
	private View dragView = null;
	private int dragFromCol = -1;
	private int dragFromPos = -1;
	private float dragTouchOffsetX = 0;
	private float dragTouchOffsetY = 0;
	private int dragViewHeight = 0;

	public WaterfallLayout(Context context, int spanCount, int horizontalSpacing) {
		super(context);
		this.spanCount = spanCount;
		this.horizontalSpacing = horizontalSpacing;
		this.touchSlop = ViewConfiguration.get(context).getScaledTouchSlop();
		this.columnContainers = new ColumnContainerView[spanCount];

		// 1. Äußerer NestedScrollView
		mScrollView = new androidx.core.widget.NestedScrollView(context);
		mScrollView.setOverScrollMode(View.OVER_SCROLL_IF_CONTENT_SCROLLS);
		mScrollView.setLayerType(View.LAYER_TYPE_HARDWARE, null);
		addView(mScrollView, new FrameLayout.LayoutParams(
			FrameLayout.LayoutParams.MATCH_PARENT,
			FrameLayout.LayoutParams.MATCH_PARENT
		));

		// 2. Horizontaler Container für Spalten-Nebeneinander
		mHorizontalContainer = new LinearLayout(context);
		mHorizontalContainer.setOrientation(LinearLayout.HORIZONTAL);
		mHorizontalContainer.setClipChildren(false);
		mHorizontalContainer.setClipToPadding(false);
		mScrollView.addView(mHorizontalContainer, new android.widget.ScrollView.LayoutParams(
			android.widget.ScrollView.LayoutParams.MATCH_PARENT,
			android.widget.ScrollView.LayoutParams.WRAP_CONTENT
		));

		// 3. Jede Spalte als eigenen Container erstellen
		for (int i = 0; i < spanCount; i++) {
			columnContainers[i] = new ColumnContainerView(context, i);
			mHorizontalContainer.addView(columnContainers[i], new LinearLayout.LayoutParams(
				0, LinearLayout.LayoutParams.WRAP_CONTENT, 1f
			));
		}

		d("Created WaterfallLayout with " + spanCount + " columns");

		getViewTreeObserver().addOnGlobalLayoutListener(new android.view.ViewTreeObserver.OnGlobalLayoutListener() {
			@Override
			public void onGlobalLayout() {
				getViewTreeObserver().removeOnGlobalLayoutListener(this);
				setColumnWidths();
			}
		});
	}

	public void setTouchHelper(ColumnTouchHelper helper) {
		this.touchHelper = helper;
	}

	public int getDragViewHeight() {
		return dragViewHeight;
	}

	public boolean isEditMode() {
		return touchHelper != null && touchHelper.isEditMode();
	}

	@Override
	public boolean onInterceptTouchEvent(MotionEvent ev) {
		if (!isEditMode()) {
			isDragging = false;
			return false;
		}

		switch (ev.getAction()) {
			case MotionEvent.ACTION_DOWN:
				downX = ev.getRawX();
				downY = ev.getRawY();
				isDragging = false;
				// Find which item was touched
				findTouchedItem(ev);
				// Prevent NestedScrollView from intercepting this gesture
				requestDisallowInterceptUpChain(true);
				return false; // Let children handle DOWN initially

			case MotionEvent.ACTION_MOVE:
				if (!isDragging && dragView != null) {
					float dx = Math.abs(ev.getRawX() - downX);
					float dy = Math.abs(ev.getRawY() - downY);
					if (dx > touchSlop || dy > touchSlop) {
						isDragging = true;
						reparentDragView(ev);
						d("onInterceptTouchEvent: drag started col=" + dragFromCol + " pos=" + dragFromPos);
						return true; // Intercept: we handle the drag
					}
				}
				return isDragging;

			case MotionEvent.ACTION_UP:
			case MotionEvent.ACTION_CANCEL:
				if (isDragging) {
					return true; // Still intercepting during drag end
				}
				requestDisallowInterceptUpChain(false);
				isDragging = false;
				dragView = null;
				dragFromCol = -1;
				dragFromPos = -1;
				return false;
		}
		return false;
	}

	@Override
	public boolean onTouchEvent(MotionEvent ev) {
		if (!isDragging) {
			return false;
		}

		switch (ev.getAction()) {
			case MotionEvent.ACTION_MOVE:
				if (dragView != null) {
					// Convert screen coordinates to parent-relative for setX/setY
					int[] myPos = new int[2];
					getLocationInWindow(myPos);
					float newX = ev.getRawX() - dragTouchOffsetX - myPos[0];
					float newY = ev.getRawY() - dragTouchOffsetY - myPos[1];
					dragView.setX(newX);
					dragView.setY(newY);
					if (touchHelper != null) {
						touchHelper.highlightTargetColumn(ev.getRawX(), ev.getRawY(), dragFromCol, dragFromPos);
					}
				}
				return true;

			case MotionEvent.ACTION_UP:
			case MotionEvent.ACTION_CANCEL:
				if (touchHelper != null) {
					touchHelper.finishDrag(dragView, dragFromCol, dragFromPos, ev.getRawX(), ev.getRawY());
				}
				requestDisallowInterceptUpChain(false);
				isDragging = false;
				dragView = null;
				dragFromCol = -1;
				dragFromPos = -1;
				return true;
		}
		return true;
	}

	private void reparentDragView(MotionEvent ev) {
		if (dragView == null) return;

		// Calculate the drag view's current screen position
		int[] viewPos = new int[2];
		dragView.getLocationInWindow(viewPos);
		int[] myPos = new int[2];
		getLocationInWindow(myPos);

		// Save offset from CURRENT touch point to view top-left for smooth dragging
		dragTouchOffsetX = ev.getRawX() - viewPos[0];
		dragTouchOffsetY = ev.getRawY() - viewPos[1];

		float viewX = viewPos[0] - myPos[0];
		float viewY = viewPos[1] - myPos[1];

		// Remove from column and add to this WaterfallLayout (top-level, no clipping)
		ColumnContainerView fromCol = columnContainers[dragFromCol];
		fromCol.removeView(dragView);

		FrameLayout.LayoutParams lp = new FrameLayout.LayoutParams(
			dragView.getWidth(), dragView.getHeight()
		);
		lp.leftMargin = (int) viewX;
		lp.topMargin = (int) viewY;
		addView(dragView, lp);

		dragView.setAlpha(0.7f);
		dragView.setScaleX(1.05f);
		dragView.setScaleY(1.05f);
		dragViewHeight = dragView.getHeight();

		d("reparentDragView: moved to WaterfallLayout overlay, offset=(" + dragTouchOffsetX + "," + dragTouchOffsetY + ")");
	}

	private void findTouchedItem(MotionEvent ev) {
		dragView = null;
		dragFromCol = -1;
		dragFromPos = -1;

		float rawX = ev.getRawX();
		float rawY = ev.getRawY();

		for (int c = 0; c < spanCount; c++) {
			ColumnContainerView col = columnContainers[c];
			int[] colPos = new int[2];
			col.getLocationInWindow(colPos);
			if (rawX < colPos[0] || rawX >= colPos[0] + col.getWidth()) continue;

			// Touch is in this column, find the item
			for (int i = 0; i < col.getChildCount(); i++) {
				View child = col.getChildAt(i);
				int[] childPos = new int[2];
				child.getLocationInWindow(childPos);
				if (rawY >= childPos[1] && rawY < childPos[1] + child.getHeight()) {
					dragView = child;
					dragFromCol = c;
					dragFromPos = i;
					d("findTouchedItem: col=" + c + " pos=" + i);
					return;
				}
			}
			return; // In column but not on an item
		}
	}

	private void requestDisallowInterceptUpChain(boolean disallow) {
		ViewParent parent = getParent();
		while (parent != null) {
			parent.requestDisallowInterceptTouchEvent(disallow);
			parent = parent.getParent();
		}
	}

	public void setVerticalSpacing(int spacing) {
		for (int i = 0; i < spanCount; i++) {
			columnContainers[i].setVerticalSpacing(spacing);
		}
		d("setVerticalSpacing=" + spacing + " for all columns");
	}

	@Override
	protected void onSizeChanged(int w, int h, int oldw, int oldh) {
		super.onSizeChanged(w, h, oldw, oldh);
		setColumnWidths();
	}

	public void setColumnWidths() {
		if (mHorizontalContainer == null || getWidth() <= 0) return;
		int w = getWidth();

		for (int i = 0; i < spanCount; i++) {
			ColumnContainerView col = columnContainers[i];
			if (col.getLayoutParams() instanceof LinearLayout.LayoutParams) {
				LinearLayout.LayoutParams lp = (LinearLayout.LayoutParams) col.getLayoutParams();
				lp.weight = 1f;
				lp.width = 0;
				col.setLayoutParams(lp);
			}
		}

		mHorizontalContainer.requestLayout();
		d("setColumnWidths: w=" + w + " spanCount=" + spanCount);
	}

	public int getSpanCount() {
		return spanCount;
	}

	public void addItemView(View itemView) {
		int targetCol = findShortestColumn();
		columnContainers[targetCol].addItemView(itemView);
		d("Added item to column " + targetCol + " (shortest)");
	}

	public void insertItemView(View itemView, int columnIndex, int position) {
		if (columnIndex < 0 || columnIndex >= spanCount) {
			d("insertItemView: invalid column index " + columnIndex);
			return;
		}
		columnContainers[columnIndex].insertItemView(itemView, position);
		d("Inserted item at pos " + position + " in column " + columnIndex);
	}

	public void removeItemView(View itemView, int columnIndex) {
		if (columnIndex < 0 || columnIndex >= spanCount) {
			d("removeItemView: invalid column index " + columnIndex);
			return;
		}
		columnContainers[columnIndex].removeItemView(itemView);
		d("Removed item from column " + columnIndex);
	}

	public int getColumnItemCount(int columnIndex) {
		if (columnIndex < 0 || columnIndex >= spanCount) return 0;
		return columnContainers[columnIndex].getItemCount();
	}

	public View getColumnItemView(int columnIndex, int position) {
		if (columnIndex < 0 || columnIndex >= spanCount) return null;
		return columnContainers[columnIndex].getItemView(position);
	}

	public void clearColumn(int columnIndex) {
		if (columnIndex < 0 || columnIndex >= spanCount) return;
		columnContainers[columnIndex].clearAllItems();
		d("Cleared column " + columnIndex);
	}

	public void clearAllColumns() {
		for (int i = 0; i < spanCount; i++) {
			columnContainers[i].clearAllItems();
		}
		d("Cleared all columns");
	}

	public void clearAllColumnsAndDetach() {
		for (int i = 0; i < spanCount; i++) {
			ColumnContainerView col = columnContainers[i];
			while (col.getChildCount() > 0) {
				View child = col.getChildAt(0);
				col.removeView(child);
			}
		}
		d("Cleared all columns and detached views");
	}

	private int findShortestColumn() {
		int shortestCol = 0;
		// Use measured height for true waterfall distribution;
		// fall back to item count if not yet laid out
		boolean hasHeight = columnContainers[0].getHeight() > 0;
		int minHeight = hasHeight ? columnContainers[0].getHeight() : columnContainers[0].getItemCount();

		for (int i = 1; i < spanCount; i++) {
			int val = hasHeight ? columnContainers[i].getHeight() : columnContainers[i].getItemCount();
			if (val < minHeight) {
				minHeight = val;
				shortestCol = i;
			}
		}
		return shortestCol;
	}

	public int getItemCount(int columnIndex) {
		if (columnIndex < 0 || columnIndex >= spanCount) return 0;
		return columnContainers[columnIndex].getItemCount();
	}

	public ColumnContainerView[] getColumnContainers() {
		return columnContainers;
	}
}
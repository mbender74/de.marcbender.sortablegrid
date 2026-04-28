package de.marcbender.sortablegrid;

import android.animation.ValueAnimator;
import android.graphics.Color;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;

import java.util.ArrayList;
import java.util.HashMap;

/**
 * Handles drag-and-drop operations for the column-container layout.
 * WaterfallLayout handles the touch interception and reparenting;
 * this helper provides target detection, live reordering, and data moves.
 */
public class ColumnTouchHelper {

	private static final String LCAT = "ColumnTouchHelper";
	private static final boolean DBG_LOG = true;
	private static void d(String msg) { if (DBG_LOG) android.util.Log.d(LCAT, msg); }

	private final WaterfallLayout waterfallLayout;
	private final ViewProxy viewProxy;

	// Live reordering state
	private int lastTargetCol = -1;
	private int lastTargetPos = -1;
	private int dragFromCol = -1;
	private int dragFromPos = -1;

	// Animation duration
	private static final long ANIM_DURATION = 150;

	public ColumnTouchHelper(WaterfallLayout waterfallLayout, ViewProxy viewProxy) {
		this.waterfallLayout = waterfallLayout;
		this.viewProxy = viewProxy;
	}

	public boolean isEditMode() {
		return viewProxy.isInEditMode();
	}

	private int findColumnAtX(float rawX) {
		ColumnContainerView[] columns = waterfallLayout.getColumnContainers();
		for (int c = 0; c < columns.length; c++) {
			int[] colPos = new int[2];
			columns[c].getLocationInWindow(colPos);
			int colWidth = columns[c].getWidth();
			if (rawX >= colPos[0] && rawX < colPos[0] + colWidth) {
				return c;
			}
		}
		return 0;
	}

	private int findInsertPosition(int colIndex, float rawY) {
		ColumnContainerView col = waterfallLayout.getColumnContainers()[colIndex];
		for (int i = 0; i < col.getChildCount(); i++) {
			View child = col.getChildAt(i);
			int[] childPos = new int[2];
			child.getLocationInWindow(childPos);
			if (rawY < childPos[1] + child.getHeight() / 2) {
				return i;
			}
		}
		return col.getChildCount();
	}

	/**
	 * Highlights the target column and redistributes items below the drag point
	 * to the shortest columns (live waterfall reordering).
	 */
	public void highlightTargetColumn(float rawX, float rawY, int fromCol, int fromPos) {
		this.dragFromCol = fromCol;
		this.dragFromPos = fromPos;
		int targetCol = findColumnAtX(rawX);
		int targetPos = findInsertPosition(targetCol, rawY);

		if (targetCol != lastTargetCol || targetPos != lastTargetPos) {
			redistributeBelowDragPoint(targetCol, targetPos, rawY);
			lastTargetCol = targetCol;
			lastTargetPos = targetPos;
		}

		// Highlight target column
		ColumnContainerView[] columns = waterfallLayout.getColumnContainers();
		for (int c = 0; c < columns.length; c++) {
			if (c == targetCol) {
				columns[c].setBackgroundColor(Color.parseColor("#E0E0E0"));
			} else {
				columns[c].setBackgroundColor(Color.TRANSPARENT);
			}
		}
	}

	/**
	 * Redistribute items below the drag point to the shortest columns.
	 * - Target column: items at/after insertPos shift DOWN (gap for drag item)
	 * - All other columns: items at/below dragY redistribute to shortest column
	 */
	private void redistributeBelowDragPoint(int targetCol, int insertPos, float dragY) {
		ColumnContainerView[] columns = waterfallLayout.getColumnContainers();
		int dragHeight = waterfallLayout.getDragViewHeight();
		if (dragHeight <= 0) dragHeight = 100;

		// Record ALL items' visual positions (including translation) BEFORE any changes
		final HashMap<View, int[]> oldPositions = new HashMap<>();
		for (ColumnContainerView col : columns) {
			for (int i = 0; i < col.getChildCount(); i++) {
				View child = col.getChildAt(i);
				int[] pos = new int[2];
				child.getLocationInWindow(pos);
				pos[0] += (int) child.getTranslationX();
				pos[1] += (int) child.getTranslationY();
				oldPositions.put(child, pos);
			}
		}

		// Cancel all running animations and reset translations
		for (ColumnContainerView col : columns) {
			for (int i = 0; i < col.getChildCount(); i++) {
				View child = col.getChildAt(i);
				child.animate().cancel();
				child.setTranslationX(0f);
				child.setTranslationY(0f);
			}
		}

		// Target column: shift items at/after insertPos DOWN (gap for drag item)
		ColumnContainerView targetColView = columns[targetCol];
		for (int i = insertPos; i < targetColView.getChildCount(); i++) {
			View child = targetColView.getChildAt(i);
			child.setTranslationY(dragHeight);
		}

		// Other columns: redistribute items at/below dragY
		final ArrayList<View> itemsToRedistribute = new ArrayList<>();
		for (int c = 0; c < columns.length; c++) {
			if (c == targetCol) continue;
			ColumnContainerView col = columns[c];
			for (int i = 0; i < col.getChildCount(); i++) {
				View child = col.getChildAt(i);
				int[] childPos = new int[2];
				child.getLocationInWindow(childPos);
				if (childPos[1] >= dragY) {
					itemsToRedistribute.add(child);
				}
			}
		}

		if (!itemsToRedistribute.isEmpty()) {
			// Remove items from their columns
			for (View item : itemsToRedistribute) {
				if (item.getParent() instanceof ViewGroup) {
					((ViewGroup) item.getParent()).removeView(item);
				}
			}

			// Calculate column heights from items that remain
			float densityScale = waterfallLayout.getContext().getResources().getDisplayMetrics().density;
			int spacingPx = (int) (columns[0].getVerticalSpacing() * densityScale + 0.5f);
			int[] colHeights = new int[columns.length];
			for (int c = 0; c < columns.length; c++) {
				for (int i = 0; i < columns[c].getChildCount(); i++) {
					View child = columns[c].getChildAt(i);
					int h = viewProxy.getCellHeightForView(child.getId());
					colHeights[c] += h + spacingPx;
				}
			}

			// Add drag item's height to target column (reserve space for gap)
			colHeights[targetCol] += dragHeight + spacingPx;

			// Distribute items to the shortest column
			for (View item : itemsToRedistribute) {
				int targetC = 0;
				int minH = colHeights[0];
				for (int c = 1; c < columns.length; c++) {
					if (colHeights[c] < minH) {
						minH = colHeights[c];
						targetC = c;
				}
			}
				columns[targetC].addView(item);
				int h = viewProxy.getCellHeightForView(item.getId());
				colHeights[targetC] += h + spacingPx;
			}
		}

		// Defer requestLayout so animation starts in same frame as layout (no visual jump)
		waterfallLayout.post(new Runnable() {
			@Override
			public void run() {
				waterfallLayout.requestLayout();
			}
		});
		waterfallLayout.invalidate();

		// Start animation immediately - items slide from old to new positions
		// (requestLayout is deferred, so visual positions haven't changed yet)
		for (ColumnContainerView col : columns) {
			for (int i = 0; i < col.getChildCount(); i++) {
				View child = col.getChildAt(i);
				if (oldPositions.containsKey(child)) {
					int[] oldPos = oldPositions.get(child);
					int[] newPos = new int[2];
					child.getLocationInWindow(newPos);
					float visX = newPos[0] + child.getTranslationX();
					float visY = newPos[1] + child.getTranslationY();
					float dx = oldPos[0] - visX;
					float dy = oldPos[1] - visY;
					if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
						float baseTx = child.getTranslationX();
						float baseTy = child.getTranslationY();
						child.setTranslationX(baseTx + dx);
						child.setTranslationY(baseTy + dy);
						child.animate()
							.translationX(baseTx)
							.translationY(baseTy)
							.setDuration(ANIM_DURATION)
							.setInterpolator(new android.view.animation.DecelerateInterpolator())
							.start();
					}
				}
			}
		}
	}

	/**
	 * Immediately reset all translation shifts (no animation).
	 */
	private void clearAllShiftsImmediate() {
		ColumnContainerView[] columns = waterfallLayout.getColumnContainers();
		for (ColumnContainerView col : columns) {
			for (int i = 0; i < col.getChildCount(); i++) {
				View child = col.getChildAt(i);
				child.animate().cancel();
				child.setTranslationX(0f);
				child.setTranslationY(0f);
			}
		}
	}

	/**
	 * Finishes the drag: inserts view into target column, then redistributes
	 * items below the dropped position to the shortest columns (waterfall reorder).
	 */
	public void finishDrag(View dragView, int fromCol, int fromPos, float rawX, float rawY) {
		if (dragView == null) return;

		// Cancel animations and clear shifts immediately
		clearAllShiftsImmediate();

		// Reset drag view visual state
		dragView.setAlpha(1.0f);
		dragView.setScaleX(1.0f);
		dragView.setScaleY(1.0f);

		// Find target column and position
		int targetCol = findColumnAtX(rawX);
		int targetPos = findInsertPosition(targetCol, rawY);

		d("finishDrag: from col=" + fromCol + " pos=" + fromPos +
		  " to col=" + targetCol + " pos=" + targetPos);

		// Remove drag view from overlay
		if (dragView.getParent() instanceof ViewGroup) {
			((ViewGroup) dragView.getParent()).removeView(dragView);
		}
		dragView.setX(0);
		dragView.setY(0);
		dragView.setTranslationX(0);
		dragView.setTranslationY(0);

		// Record ALL items' screen positions before redistribution
		ColumnContainerView[] columns = waterfallLayout.getColumnContainers();
		final HashMap<View, int[]> oldPositions = new HashMap<>();
		for (ColumnContainerView col : columns) {
			for (int i = 0; i < col.getChildCount(); i++) {
				View child = col.getChildAt(i);
				int[] pos = new int[2];
				child.getLocationInWindow(pos);
				oldPositions.put(child, pos);
			}
		}

		// Insert drag view into target column
		ColumnContainerView tgtCol = columns[targetCol];
		tgtCol.addView(dragView, targetPos, new LinearLayout.LayoutParams(
			LinearLayout.LayoutParams.MATCH_PARENT,
			LinearLayout.LayoutParams.WRAP_CONTENT
		));

		// Collect items BELOW the dropped item in reading order.
		// In the target column: items after the drop position.
		// In other columns: items whose top edge is at or below the drop Y.
		final ArrayList<View> itemsToRedistribute = new ArrayList<>();
		int[] dragPos = new int[2];
		dragView.getLocationInWindow(dragPos);
		int dropY = dragPos[1];
		for (int c = 0; c < columns.length; c++) {
			ColumnContainerView col = columns[c];
			if (c == targetCol) {
				for (int i = targetPos + 1; i < col.getChildCount(); i++) {
					View child = col.getChildAt(i);
					if (child != dragView) {
						itemsToRedistribute.add(child);
					}
				}
			} else {
				for (int i = 0; i < col.getChildCount(); i++) {
					View child = col.getChildAt(i);
					int[] childPos = new int[2];
					child.getLocationInWindow(childPos);
					if (childPos[1] >= dropY) {
						itemsToRedistribute.add(child);
					}
				}
			}
		}

		// Remove redistributed items from their columns
		for (View item : itemsToRedistribute) {
			if (item.getParent() instanceof ViewGroup) {
				((ViewGroup) item.getParent()).removeView(item);
			}
		}

		// Re-add each item to the shortest column using cell_height tracking
		float densityScale = waterfallLayout.getContext().getResources().getDisplayMetrics().density;
		int spacingPx = (int) (columns[0].getVerticalSpacing() * densityScale + 0.5f);
		int[] colHeights = new int[columns.length];
		for (int c = 0; c < columns.length; c++) {
			for (int i = 0; i < columns[c].getChildCount(); i++) {
				View child = columns[c].getChildAt(i);
				if (!itemsToRedistribute.contains(child)) {
					int h = viewProxy.getCellHeightForView(child.getId());
					colHeights[c] += h + (i > 0 ? spacingPx : 0);
				}
			}
		}
		for (View item : itemsToRedistribute) {
			int targetC = 0;
			int minH = colHeights[0];
			for (int c = 1; c < columns.length; c++) {
				if (colHeights[c] < minH) {
					minH = colHeights[c];
					targetC = c;
				}
			}
			columns[targetC].addView(item);
			int h = viewProxy.getCellHeightForView(item.getId());
			colHeights[targetC] += h + spacingPx;
		}

		waterfallLayout.requestLayout();
		waterfallLayout.invalidate();

		// Clear column highlights
		for (ColumnContainerView col : columns) {
			col.setBackgroundColor(Color.TRANSPARENT);
		}

		// Reset reordering state
		lastTargetCol = -1;
		lastTargetPos = -1;

		// Reorder data source to match the visual layout
		viewProxy.reorderDataSourceToMatchColumns(columns);

		// After layout pass, animate items from old positions to new positions
		waterfallLayout.post(new Runnable() {
			@Override
			public void run() {
				for (ColumnContainerView col : columns) {
					for (int i = 0; i < col.getChildCount(); i++) {
						View child = col.getChildAt(i);
						if (oldPositions.containsKey(child)) {
							int[] oldPos = oldPositions.get(child);
							int[] newPos = new int[2];
							child.getLocationInWindow(newPos);
							float dx = oldPos[0] - newPos[0];
							float dy = oldPos[1] - newPos[1];
							if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
								child.setTranslationX(dx);
								child.setTranslationY(dy);
								child.animate()
									.translationX(0f)
									.translationY(0f)
									.setDuration(250)
									.setInterpolator(new android.view.animation.DecelerateInterpolator())
									.start();
							}
						}
					}
				}
			}
		});
	}

	public void enableDrag() {
		waterfallLayout.setTouchHelper(this);
		d("enableDrag: set touch helper on WaterfallLayout");
	}

	public void updateAllDragListeners() {
		enableDrag();
	}

	public void rebindDragListeners() {
		enableDrag();
	}
}
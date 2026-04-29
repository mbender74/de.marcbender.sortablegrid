package de.marcbender.sortablegrid;

import android.graphics.Canvas;
import android.view.View;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.ItemTouchHelper;
import androidx.recyclerview.widget.RecyclerView;
import androidx.viewpager2.widget.ViewPager2;

import org.appcelerator.kroll.common.Log;

/**
 * ItemTouchHelper.Callback for drag-and-drop in the RecyclerView-based grid.
 * Handles drag reordering with per-item canBeMoved/canBeDeleted support.
 */
public class DragItemTouchCallback extends ItemTouchHelper.SimpleCallback {

	private static final String LCAT = "DragItemTouchCallback";
	private static final boolean DBG_LOG = true;

	private static void d(String msg) { if (DBG_LOG) Log.d(LCAT, msg); }

	private final DragRecyclerAdapter adapter;
	private final RecyclerView recyclerView;
	private DragItemTouchCallbackListener listener;
	private boolean isEditMode = false;
	private float dragItemShadowOpacity = 0.95f;
	private ViewPager2 viewPager2;
	private int currentPageIndex = 0;
	private static final int EDGE_THRESHOLD = 50; // dp from edge to trigger page switch
	private long lastPageSwitchTime = 0;
	private static final long PAGE_SWITCH_COOLDOWN = 300; // ms between page switches

	public interface DragItemTouchCallbackListener {
		void onItemsReordered();
		void onItemDeleted(int position, Object itemId);
	}

	public DragItemTouchCallback(DragRecyclerAdapter adapter, RecyclerView recyclerView) {
		// UP, DOWN, LEFT, RIGHT drag directions for grid
		super(ItemTouchHelper.UP | ItemTouchHelper.DOWN | ItemTouchHelper.LEFT | ItemTouchHelper.RIGHT, 0);
		this.adapter = adapter;
		this.recyclerView = recyclerView;
	}

	public void setEditMode(boolean editMode) {
		isEditMode = editMode;
	}

	public void setDragItemShadowOpacity(float opacity) {
		dragItemShadowOpacity = opacity;
	}

	public void setListener(DragItemTouchCallbackListener listener) {
		this.listener = listener;
	}

	/** Setzt ViewPager2-Referenz und Page-Index für Cross-Page-Drag */
	public void setViewPager(ViewPager2 viewPager, int pageIndex) {
		this.viewPager2 = viewPager;
		this.currentPageIndex = pageIndex;
		d("setViewPager: pageIndex=" + pageIndex);
	}

	@Override
	public boolean isLongPressDragEnabled() {
		d("isLongPressDragEnabled: " + isEditMode);
		// Only enable drag in edit mode
		return isEditMode;
	}

	@Override
	public boolean isItemViewSwipeEnabled() {
		return false; // No swipe-to-delete
	}

	@Override
	public boolean onMove(@NonNull RecyclerView recyclerView,
						@NonNull RecyclerView.ViewHolder viewHolder,
						@NonNull RecyclerView.ViewHolder target) {
		int fromPosition = viewHolder.getBindingAdapterPosition();
		int toPosition = target.getBindingAdapterPosition();

		d("onMove: fromPosition=" + fromPosition + " toPosition=" + toPosition +
		  " fromCanMove=" + (viewHolder instanceof DragRecyclerAdapter.DragViewHolder ? ((DragRecyclerAdapter.DragViewHolder) viewHolder).canBeMoved() : "?") +
		  " toCanMove=" + (target instanceof DragRecyclerAdapter.DragViewHolder ? ((DragRecyclerAdapter.DragViewHolder) target).canBeMoved() : "?"));

		if (fromPosition == RecyclerView.NO_POSITION || toPosition == RecyclerView.NO_POSITION) {
			d("onMove: returning false - NO_POSITION detected");
			return false;
		}

		// Check if target item can be moved
		if (target instanceof DragRecyclerAdapter.DragViewHolder) {
			if (!((DragRecyclerAdapter.DragViewHolder) target).canBeMoved()) {
				d("onMove: target cannot be moved, returning false");
				return false;
			}
		}

		// Check if dragged item can be moved
		if (viewHolder instanceof DragRecyclerAdapter.DragViewHolder) {
			if (!((DragRecyclerAdapter.DragViewHolder) viewHolder).canBeMoved()) {
				d("onMove: source cannot be moved, returning false");
				return false;
			}
		}

		d("onMove: calling adapter.moveItem(" + fromPosition + ", " + toPosition + ")");
		adapter.moveItem(fromPosition, toPosition);
		return true;
	}

	@Override
	public void onSwiped(@NonNull RecyclerView.ViewHolder viewHolder, int direction) {
		// Not used - swipe is disabled
	}

	@Override
	public void onSelectedChanged(RecyclerView.ViewHolder viewHolder, int actionState) {
		super.onSelectedChanged(viewHolder, actionState);

		d("onSelectedChanged: actionState=" + actionState +
		  " (DRAG=" + ItemTouchHelper.ACTION_STATE_DRAG + " SWIPE=" + ItemTouchHelper.ACTION_STATE_SWIPE + ")" +
		  " viewHolder=" + (viewHolder != null ? viewHolder.getClass().getSimpleName() : "null"));

		if (actionState == ItemTouchHelper.ACTION_STATE_DRAG && viewHolder != null) {
			// Scale up and reduce opacity during drag
			viewHolder.itemView.setAlpha(dragItemShadowOpacity);
			viewHolder.itemView.setScaleX(1.02f);
			viewHolder.itemView.setScaleY(1.02f);
			d("onSelectedChanged: drag started, alpha=" + dragItemShadowOpacity + " scale=1.02");
		}
	}

	@Override
	public void clearView(@NonNull RecyclerView recyclerView,
						@NonNull RecyclerView.ViewHolder viewHolder) {
		super.clearView(recyclerView, viewHolder);

		d("clearView: resetting visual state, visibleChildren=" + recyclerView.getChildCount() +
		  " totalCount=" + adapter.getItemCount());

		// Reset visual state after drag
		viewHolder.itemView.setAlpha(1.0f);
		viewHolder.itemView.setScaleX(1.0f);
		viewHolder.itemView.setScaleY(1.0f);

		// Notify listener that items were reordered
		if (listener != null) {
			listener.onItemsReordered();
		}

		d("clearView: done");
	}

	@Override
	public void onChildDraw(@NonNull Canvas c,
						@NonNull RecyclerView recyclerView,
						@NonNull RecyclerView.ViewHolder viewHolder,
						float dX, float dY, int actionState,
						boolean isCurrentlyActive) {
		super.onChildDraw(c, recyclerView, viewHolder, dX, dY, actionState, isCurrentlyActive);

		// Cross-Page Drag: wenn Item am Rand, Page wechseln
		if (actionState == ItemTouchHelper.ACTION_STATE_DRAG && viewPager2 != null && isCurrentlyActive) {
			View dragView = viewHolder.itemView;
			int[] location = new int[2];
			dragView.getLocationOnScreen(location);
			int screenX = location[0] + dragView.getWidth() / 2;
			int pageWidth = viewPager2.getWidth();
			int screenWidth = pageWidth; // ViewPager2 is full screen width
			long now = System.currentTimeMillis();

			// Rechts am Rand → nächste Page
			if (screenX > screenWidth - EDGE_THRESHOLD && currentPageIndex < viewPager2.getAdapter().getItemCount() - 1
			    && now - lastPageSwitchTime > PAGE_SWITCH_COOLDOWN) {
				d("onChildDraw: right edge, switching to page " + (currentPageIndex + 1));
				viewPager2.setCurrentItem(currentPageIndex + 1, false);
				currentPageIndex++;
				lastPageSwitchTime = now;
			}
			// Links am Rand → vorherige Page
			else if (screenX < EDGE_THRESHOLD && currentPageIndex > 0
			         && now - lastPageSwitchTime > PAGE_SWITCH_COOLDOWN) {
				d("onChildDraw: left edge, switching to page " + (currentPageIndex - 1));
				viewPager2.setCurrentItem(currentPageIndex - 1, false);
				currentPageIndex--;
				lastPageSwitchTime = now;
			}
		}
	}
}

package de.marcbender.sortablegrid;

import android.content.Context;
import android.graphics.Color;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.Bitmap;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.RelativeLayout;

import org.appcelerator.kroll.KrollDict;
import org.appcelerator.kroll.common.Log;
import org.appcelerator.titanium.TiC;
import org.appcelerator.titanium.util.TiConvert;
import org.appcelerator.titanium.view.TiCompositeLayout;
import org.appcelerator.titanium.view.TiUIView;
import org.appcelerator.titanium.proxy.TiViewProxy;
import org.appcelerator.titanium.view.TiDrawableReference;
import org.appcelerator.titanium.TiDimension;

import com.allenliu.badgeview.BadgeView;
import com.allenliu.badgeview.BadgeFactory;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import android.animation.Animator;
import android.animation.ValueAnimator;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import androidx.recyclerview.widget.StaggeredGridLayoutManager;
import androidx.recyclerview.widget.GridLayoutManager;

/**
 * RecyclerView Adapter for the sortable grid in waterfall layout mode.
 * Supports both StaggeredGridLayoutManager (waterfall) and GridLayoutManager (paging).
 */
public class DragRecyclerAdapter extends RecyclerView.Adapter<DragRecyclerAdapter.DragViewHolder> {

	private static final String LCAT = "DragRecyclerAdapter";
	private static final boolean DBG_LOG = true;

	private static void d(String msg) { if (DBG_LOG) Log.d(LCAT, msg); }
	private static void i(String msg) { if (DBG_LOG) Log.i(LCAT, msg); }
	private static void w(String msg) { if (DBG_LOG) Log.w(LCAT, msg); }

	// Spacing values (must match ViewProxy constants)
	private static final int HORIZONTAL_SPACING = 8;
	private static final int VERTICAL_SPACING = 8;

	private List<HashMap<String, Object>> dataSourceList;
	private Context context;
	private boolean isInEditMode = false;
	private boolean showDeleteButtons = false;
	private boolean wobbleEnabled = true;
	private boolean itemsBadgeEnabled = true;
	private TiDrawableReference deleteButtonReference;
	private float density;
	private ViewProxy viewProxy;
	private RecyclerView recyclerView;
	private ArrayList<Animator> animationsList = new ArrayList<>();
	/** Tracks ViewPropertyAnimator instances per view to ensure proper cancellation */
	private Map<View, Animator> viewAnimations = new ConcurrentHashMap<>();

	/** Known heights for all items (position -> height). Used for stable column assignment. */
	private int[] itemHeights;
	/** Pre-computed span indices per position (from shortest-column algorithm). */
	private int[] computedSpanIndices;

	public DragRecyclerAdapter(Context context, List<HashMap<String, Object>> dataSourceList, ViewProxy viewProxy) {
		this.context = context;
		this.dataSourceList = dataSourceList;
		this.viewProxy = viewProxy;
		this.density = context.getResources().getDisplayMetrics().density;
		this.itemHeights = new int[dataSourceList.size()];
		// Do NOT use setHasStableIds - our IDs change on insertion which causes
		// RecyclerView to think items moved, triggering unwanted reordering
	}

	/**
	 * Ensures the itemHeights array has enough slots for all items.
	 * New entries are initialized to 0 (height unknown).
	 */
	private void ensureItemHeightsSize(int size) {
		if (itemHeights.length < size) {
			int[] newHeights = new int[size];
			System.arraycopy(itemHeights, 0, newHeights, 0, itemHeights.length);
			itemHeights = newHeights;
		}
	}

	/**
	 * Stores the measured height for an item at a given position.
	 */
	public void setItemHeight(int position, int height) {
		if (position >= 0 && position < itemHeights.length) {
			itemHeights[position] = height;
		}
	}

	/**
	 * Computes stable column assignments for all items using the shortest-column algorithm.
	 * Stores results in computedSpanIndices[]. Call this AFTER data changes and BEFORE layout pass.
	 * The adapter will apply these indices when binding each item.
	 */
	public void computeSpanIndices(int spanCount) {
		if (spanCount <= 0) return;

		int itemCount = dataSourceList.size();
		computedSpanIndices = new int[itemCount];

		// Phase 1: Collect known heights for all items
		int[] heights = new int[itemCount];
		for (int i = 0; i < itemCount; i++) {
			heights[i] = getKnownItemHeight(i);
		}

		// Phase 2: Assign each item to the shortest column (shortest-column algorithm)
		int[] colHeights = new int[spanCount]; // Running height per column

		for (int i = 0; i < itemCount; i++) {
			int h = heights[i];
			if (h <= 0) {
				// Unknown height - fall back to round-robin
				computedSpanIndices[i] = i % spanCount;
			} else {
				// Find the shortest column
				int shortestCol = 0;
				int shortestH = colHeights[0];
				for (int c = 1; c < spanCount; c++) {
					if (colHeights[c] < shortestH) {
						shortestH = colHeights[c];
						shortestCol = c;
					}
				}
				computedSpanIndices[i] = shortestCol;
				colHeights[shortestCol] += h + VERTICAL_SPACING;
			}
		}

		d("computeSpanIndices: itemCount=" + itemCount + " spanCount=" + spanCount);
	}

	/**
	 * Returns the pre-computed span index for a given position.
	 * Must be called AFTER computeSpanIndices().
	 */
	public int getComputedSpanIndex(int position) {
		if (computedSpanIndices != null && position >= 0 && position < computedSpanIndices.length) {
			return computedSpanIndices[position];
		}
		return -1; // Unknown
	}

	/**
	 * Gets the known height for an item. Falls back to cellHeight from data, then 0.
	 */
	private int getKnownItemHeight(int position) {
		if (position >= 0 && position < itemHeights.length && itemHeights[position] > 0) {
			return itemHeights[position];
		}

		// Fallback: try to get height from data source
		if (position >= 0 && position < dataSourceList.size()) {
			ensureItemHeightsSize(position + 1);
			HashMap<String, Object> itemData = dataSourceList.get(position);
			Object mh = itemData.get("measured_height");
			if (mh instanceof Integer) {
				int h = (Integer) mh;
				if (h > 0) {
					itemHeights[position] = h;
					return h;
				}
			}
			Object ch = itemData.get("cellHeight");
			if (ch instanceof Integer) {
				int h = (Integer) ch;
				if (h > 0) {
					itemHeights[position] = h;
					return h;
				}
			}
		}

		return 0; // Unknown height
	}

	@Override
	public void onAttachedToRecyclerView(@NonNull RecyclerView recyclerView) {
		super.onAttachedToRecyclerView(recyclerView);
		this.recyclerView = recyclerView;
		d("onAttachedToRecyclerView: layoutManager=" +
		  (recyclerView.getLayoutManager() != null ? recyclerView.getLayoutManager().getClass().getSimpleName() : "null") +
		  " itemCount=" + dataSourceList.size());

		// Log StaggeredGridLayoutManager state
		if (recyclerView.getLayoutManager() instanceof StaggeredGridLayoutManager) {
			StaggeredGridLayoutManager mgl = (StaggeredGridLayoutManager) recyclerView.getLayoutManager();
			d("onAttachedToRecyclerView: StaggeredGridLayoutManager spanCount=" + mgl.getSpanCount() +
			  " orientation=" + (mgl.getOrientation() == StaggeredGridLayoutManager.HORIZONTAL ? "HORIZONTAL" : "VERTICAL"));
		}
	}

	public void setEditMode(boolean editing) {
		isInEditMode = editing;
		d("setEditMode: " + editing);
	}

	public void setShowDeleteButtons(boolean show) {
		showDeleteButtons = show;
		d("setShowDeleteButtons: " + show);
	}

	public void setWobbleEnabled(boolean enabled) {
		wobbleEnabled = enabled;
		d("setWobbleEnabled: " + enabled);
	}

	public void setItemsBadgeEnabled(boolean enabled) {
		itemsBadgeEnabled = enabled;
		d("setItemsBadgeEnabled: " + enabled);
	}

	public void setDeleteButtonReference(TiDrawableReference ref) {
		deleteButtonReference = ref;
	}

	@NonNull
	@Override
	public DragViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
		FrameLayout container = new FrameLayout(context);
		container.setClipChildren(false);
		container.setClipToPadding(false);

		RecyclerView.LayoutManager lm = null;
		if (parent instanceof RecyclerView) {
			lm = ((RecyclerView) parent).getLayoutManager();
		}
		String lmName = lm != null ? lm.getClass().getSimpleName() : "null";
		int spanCount = 0;
		if (lm instanceof StaggeredGridLayoutManager) {
			spanCount = ((StaggeredGridLayoutManager) lm).getSpanCount();
		} else if (lm instanceof GridLayoutManager) {
			spanCount = ((GridLayoutManager) lm).getSpanCount();
		}
		d("onCreateViewHolder: viewType=" + viewType + " layoutManager=" + lmName + " spanCount=" + spanCount);

		// Use GridLayoutManager.LayoutParams or StaggeredGridLayoutManager.LayoutParams
		// depending on the layout manager configuration
		if (viewProxy.getLayoutManager() instanceof GridLayoutManager) {
			GridLayoutManager glm = (GridLayoutManager) viewProxy.getLayoutManager();
			if (glm.getOrientation() == GridLayoutManager.HORIZONTAL) {
				// Horizontal: column width is determined by item content, height fills the span
				container.setLayoutParams(new GridLayoutManager.LayoutParams(
					ViewGroup.LayoutParams.WRAP_CONTENT,
					ViewGroup.LayoutParams.MATCH_PARENT
				));
			} else {
				// Vertical: width fills the column, height determined by content
				container.setLayoutParams(new GridLayoutManager.LayoutParams(
					ViewGroup.LayoutParams.MATCH_PARENT,
					ViewGroup.LayoutParams.WRAP_CONTENT
				));
			}
		} else if (viewProxy.getLayoutManager() instanceof StaggeredGridLayoutManager) {
			StaggeredGridLayoutManager.LayoutParams params = new StaggeredGridLayoutManager.LayoutParams(
				ViewGroup.LayoutParams.MATCH_PARENT,
				ViewGroup.LayoutParams.WRAP_CONTENT
			);
			params.setFullSpan(false);
			container.setLayoutParams(params);
		} else {
			container.setLayoutParams(new RecyclerView.LayoutParams(
				ViewGroup.LayoutParams.MATCH_PARENT,
				ViewGroup.LayoutParams.WRAP_CONTENT
			));
		}
		return new DragViewHolder(container);
	}

	@Override
	public void onBindViewHolder(@NonNull DragViewHolder holder, int position) {
		if (position < 0 || position >= dataSourceList.size()) {
			w("onBindViewHolder: position " + position + " out of bounds, size=" + dataSourceList.size());
			return;
		}

		d("onBindViewHolder: pos=" + position + " totalCount=" + dataSourceList.size() +
		  " layoutManager=" + (recyclerView != null && recyclerView.getLayoutManager() != null ? recyclerView.getLayoutManager().getClass().getSimpleName() : "null"));

		// Check if we're currently scrolling - if so, skip click binding
		boolean isScrolling = recyclerView != null && recyclerView.getScrollState() != RecyclerView.SCROLL_STATE_IDLE;

		HashMap<String, Object> itemData = dataSourceList.get(position);

		Object itemViewObj = itemData.get("item_view");
		if (itemViewObj instanceof View) {
			View itemView = (View) itemViewObj;

			// Disable click events during scrolling to prevent conflicts
			if (isScrolling) {
				itemView.setClickable(false);
				itemView.setFocusable(false);
			} else {
				itemView.setClickable(true);
				itemView.setFocusable(true);
			}

			// Remove any existing children from the container (from a previous binding)
			holder.container.removeAllViews();

			// Detach from previous parent if any
			if (itemView.getParent() != null) {
				((ViewGroup) itemView.getParent()).removeView(itemView);
			}

			int cellWidth = ViewGroup.LayoutParams.MATCH_PARENT;
			Object cellWidthObj = itemData.get("cell_width");
			if (cellWidthObj instanceof Integer) {
				cellWidth = (Integer) cellWidthObj;
			}
			int cellHeight = ViewGroup.LayoutParams.WRAP_CONTENT;
			Object cellHeightObj = itemData.get("cell_height");
			if (cellHeightObj instanceof Integer) {
				cellHeight = (Integer) cellHeightObj;
			}

			// Add item view with WRAP_CONTENT height so it expands naturally
			// (borders/padding can make content taller than the raw cellHeight)
			FrameLayout.LayoutParams lp = new FrameLayout.LayoutParams(cellWidth, FrameLayout.LayoutParams.WRAP_CONTENT);
			holder.container.addView(itemView, lp);

			// Check if we're in horizontal grid mode
			boolean isHorizontalGrid = false;
			if (recyclerView != null && recyclerView.getLayoutManager() instanceof GridLayoutManager) {
				isHorizontalGrid = ((GridLayoutManager) recyclerView.getLayoutManager()).getOrientation() == GridLayoutManager.HORIZONTAL;
			}

			// Force measure to get actual rendered height (including borders, padding).
			// For StaggeredGridLayoutManager, measure at column (cell) width so content
			// reflows correctly; for other layout managers, use the full RecyclerView width.
			int measureWidth = cellWidth;
			if (cellWidth == ViewGroup.LayoutParams.MATCH_PARENT && recyclerView != null && recyclerView.getWidth() > 0) {
				measureWidth = recyclerView.getWidth() - recyclerView.getPaddingLeft() - recyclerView.getPaddingRight();
			}
			if (recyclerView != null && recyclerView.getWidth() > 0) {
				RecyclerView.LayoutManager lm = recyclerView.getLayoutManager();
				if (lm instanceof GridLayoutManager) {
					GridLayoutManager glm = (GridLayoutManager) lm;
					if (glm.getOrientation() == GridLayoutManager.HORIZONTAL) {
						// Horizontal: measure at the cell width (column width)
						measureWidth = cellWidth > 0 ? cellWidth : recyclerView.getWidth() / 3;
					} else {
						// Vertical GridLayoutManager: width / columnCount
						Object colCount = itemData.get("columnCount");
						int cols = (colCount instanceof Number) ? ((Number) colCount).intValue() : glm.getSpanCount();
						measureWidth = recyclerView.getWidth() / cols;
					}
				} else if (!(lm instanceof StaggeredGridLayoutManager)) {
					measureWidth = recyclerView.getWidth() - recyclerView.getPaddingLeft() - recyclerView.getPaddingRight();
				}
			}
			holder.container.measure(
				View.MeasureSpec.makeMeasureSpec(measureWidth, View.MeasureSpec.AT_MOST),
				View.MeasureSpec.makeMeasureSpec(0, View.MeasureSpec.UNSPECIFIED)
			);
			int measuredHeight = holder.container.getMeasuredHeight();

			// Update container LayoutParams based on measured content
			ViewGroup.LayoutParams containerLp = holder.container.getLayoutParams();
			if (containerLp != null) {
				if (!isHorizontalGrid) {
					// Vertical mode: set height to match measured content
					if (measuredHeight > 0) {
						containerLp.height = measuredHeight;
					} else if (cellHeight > 0) {
						containerLp.height = cellHeight;
					} else {
						containerLp.height = cellHeight; // WRAP_CONTENT (-1) or MATCH_PARENT
					}
				} else {
					// Horizontal grid: set concrete column width so GridLayoutManager
					// measures items correctly (WRAP_CONTENT width gets UNSPECIFIED measure spec)
					if (cellWidth > 0) {
						containerLp.width = cellWidth;
					} else {
						containerLp.width = measureWidth > 0 ? measureWidth : 200;
					}
				}
				d("onBindViewHolder: pos=" + position + " cellWidth=" + cellWidth + " cellHeight=" + cellHeight +
				  " measuredWidth=" + measureWidth + " measuredHeight=" + measuredHeight +
				  " appliedHeight=" + containerLp.height + " appliedWidth=" + containerLp.width + " isHorizontalGrid=" + isHorizontalGrid);
				// Save the actual measured height for stable scrollRange calculation
				itemData.put("measured_height", measuredHeight > 0 ? measuredHeight : (cellHeight > 0 ? cellHeight : 0));

				// Store measured height in itemHeights[] for stable column assignment
				ensureItemHeightsSize(position + 1);
				if (measuredHeight > 0) {
					itemHeights[position] = measuredHeight;
				} else if (cellHeight > 0) {
					itemHeights[position] = cellHeight;
				}
			}
		}

		// Update visibility for delete button and badge
		updateItemVisibility(itemData);

		// Wobble animation in edit mode (native ValueAnimator with listener)
		if (isInEditMode && wobbleEnabled) {
			Object itemViewObj2 = itemData.get("item_view");
			if (itemViewObj2 instanceof View) {
				View itemView = (View) itemViewObj2;
				int rotation = (position % 2 == 0) ? 2 : -2;
				// Cancel any existing animator for this view before creating a new one
				Animator existingAnimator = viewAnimations.remove(itemView);
				if (existingAnimator != null && existingAnimator.isRunning()) {
					existingAnimator.cancel();
				}
				// Use ValueAnimator with a listener that manually sets rotation.
				// This gives us full control over the animation state.
				final int finalRotation = rotation;
				ValueAnimator animator = new ValueAnimator();
				animator.setFloatValues(finalRotation, -finalRotation);
				animator.setDuration(180);
				animator.setRepeatMode(ValueAnimator.REVERSE);
				animator.setRepeatCount(ValueAnimator.INFINITE);
				animator.addUpdateListener(animation -> {
					if (itemView != null) {
						itemView.setRotation((Float) animation.getAnimatedValue());
					}
				});
				animator.start();
				viewAnimations.put(itemView, animator);
				animationsList.add(animator);
				d("onBindViewHolder: started wobble animation on pos=" + position + " rotation=" + rotation);
			}
		} else if (!isInEditMode && wobbleEnabled && itemViewObj instanceof View) {
			((View) itemViewObj).setRotation(0f);
		}

		holder.setCanBeDeleted(itemData.containsKey("canBeDeleted") && Boolean.TRUE.equals(itemData.get("canBeDeleted")));
		holder.setCanBeMoved(itemData.containsKey("canBeMoved") && Boolean.TRUE.equals(itemData.get("canBeMoved")));
		holder.setItemPosition(position);
	}

	@Override
	public void onViewRecycled(@NonNull DragViewHolder holder) {
		super.onViewRecycled(holder);
		int pos = holder.getAdapterPosition();
		d("onViewRecycled: pos=" + pos);
		holder.boundItem = null;
		holder.container.removeAllViews();
		// Remove any animator references for views being recycled
		// (the view may be reused for a different item position)
		viewAnimations.entrySet().removeIf(entry -> {
			View v = entry.getKey();
			return v == null || v.getParent() == null;
		});
	}

	@Override
	public void onViewAttachedToWindow(@NonNull DragViewHolder holder) {
		super.onViewAttachedToWindow(holder);
		int pos = holder.getAdapterPosition();
		View itemView = getitemViewFromHolder(holder);
		int itemH = itemView != null ? itemView.getHeight() : 0;
		int contH = holder.container != null ? holder.container.getHeight() : 0;
		int top = holder.container != null ? holder.container.getTop() : -1;
		int bottom = holder.container != null ? holder.container.getBottom() : -1;

		// Log span index for StaggeredGridLayoutManager
		int spanIndex = -1;
		if (recyclerView != null && recyclerView.getLayoutManager() instanceof StaggeredGridLayoutManager) {
			ViewGroup.LayoutParams lp = holder.container.getLayoutParams();
			if (lp instanceof StaggeredGridLayoutManager.LayoutParams) {
				spanIndex = ((StaggeredGridLayoutManager.LayoutParams) lp).getSpanIndex();
			}
		}

		d("onViewAttachedToWindow: pos=" + pos + " spanIndex=" + spanIndex + " top=" + top + " bottom=" + bottom +
		  " itemViewH=" + itemH + " containerH=" + contH +
		  " layoutManager=" + (recyclerView != null && recyclerView.getLayoutManager() != null ? recyclerView.getLayoutManager().getClass().getSimpleName() : "null"));

		// Log visible range
		if (recyclerView != null) {
			int childCount = recyclerView.getChildCount();
			if (childCount > 0) {
				DragViewHolder firstHolder = (DragViewHolder) recyclerView.getChildViewHolder(recyclerView.getChildAt(0));
				DragViewHolder lastHolder = (DragViewHolder) recyclerView.getChildViewHolder(recyclerView.getChildAt(childCount - 1));
				d("onViewAttachedToWindow: visible children=" + childCount + " firstPos=" + firstHolder.getAdapterPosition() + " lastPos=" + lastHolder.getAdapterPosition());
			}
		}
	}

	@Override
	public void onViewDetachedFromWindow(@NonNull DragViewHolder holder) {
		super.onViewDetachedFromWindow(holder);
		int pos = holder.getAdapterPosition();
		d("onViewDetachedFromWindow: pos=" + pos);
	}

	private View getitemViewFromHolder(DragViewHolder holder) {
		if (holder != null && holder.container != null && holder.container.getChildCount() > 0) {
			return holder.container.getChildAt(0);
		}
		return null;
	}

	@Override
	public int getItemCount() {
		return dataSourceList.size();
	}

	// ---- Helper to update item visibility without re-attaching views ----

	private void updateItemVisibility(HashMap<String, Object> itemData) {
		Object deleteBtnObj = itemData.get("delete_button");
		if (deleteBtnObj instanceof View) {
			((View) deleteBtnObj).setVisibility(isInEditMode && showDeleteButtons ? View.VISIBLE : View.INVISIBLE);
		}
		Object badgeObj = itemData.get("badge_view");
		if (badgeObj instanceof View) {
			((View) badgeObj).setVisibility(isInEditMode ? View.INVISIBLE : (itemsBadgeEnabled ? View.VISIBLE : View.GONE));
		}
	}

	// ---- Data manipulation methods ----

	public void moveItem(int fromPosition, int toPosition) {
		d("moveItem: from=" + fromPosition + " to=" + toPosition + " totalCount=" + dataSourceList.size());
		if (fromPosition < 0 || fromPosition >= dataSourceList.size()) return;
		if (toPosition < 0 || toPosition >= dataSourceList.size()) return;

		HashMap<String, Object> item = dataSourceList.remove(fromPosition);
		dataSourceList.add(toPosition, item);
		notifyItemMoved(fromPosition, toPosition);
		d("moveItem: done, notifyItemMoved " + fromPosition + " -> " + toPosition);
	}

	public void removeItem(int position) {
		d("removeItem: pos=" + position + " totalCount=" + dataSourceList.size());
		if (position < 0 || position >= dataSourceList.size()) return;
		dataSourceList.remove(position);
		notifyItemRemoved(position);
		notifyItemRangeChanged(position, dataSourceList.size() - position);
		// Compute and apply stable span indices after data change
		if (recyclerView != null) {
			recyclerView.getRecycledViewPool().clear();
			// computeSpanIndices called from ViewProxy for column-container layout
		}
		d("removeItem: done, new size=" + dataSourceList.size());
	}

	/**
	 * Remove item and force full re-layout for proper spacing with GridLayoutManager.
	 * Use this instead of removeItem() when waterFallLayout=false to avoid
	 * spacing issues.
	 */
	public void removeItemWithFullRelayout(int position) {
		d("removeItemWithFullRelayout: pos=" + position + " totalCount=" + dataSourceList.size());
		if (position < 0 || position >= dataSourceList.size()) return;
		dataSourceList.remove(position);
		// Use notifyItemRemoved() + notifyItemRangeChanged() for proper spacing
		// notification without the instability of notifyDataSetChanged()
		notifyItemRemoved(position);
		notifyItemRangeChanged(position, dataSourceList.size() - position);
		// Clear recycled view pool to force re-measurement of all container heights
		if (recyclerView != null) {
			recyclerView.getRecycledViewPool().clear();
			recyclerView.requestLayout();
			// computeSpanIndices called from ViewProxy for column-container layout
		}
		d("removeItemWithFullRelayout: done, new size=" + dataSourceList.size());
	}

	public void addItem(HashMap<String, Object> item, int position) {
		d("addItem: pos=" + position + " totalCountBefore=" + dataSourceList.size());
		if (position < 0) position = 0;
		if (position > dataSourceList.size()) position = dataSourceList.size();
		dataSourceList.add(position, item);
		// Ensure itemHeights array is large enough for the new item
		ensureItemHeightsSize(dataSourceList.size());
		notifyItemInserted(position);
		// Notify range changed for items after the inserted position to ensure
		// GridSpacingItemDecoration recalculates spacing correctly
		notifyItemRangeChanged(position + 1, dataSourceList.size() - position - 1);
		// Compute and apply stable span indices after data change
		if (recyclerView != null) {
			recyclerView.getRecycledViewPool().clear();
			// computeSpanIndices called from ViewProxy for column-container layout
		}
		d("addItem: done, new size=" + dataSourceList.size() + " pos=" + position);
	}

	/**
	 * Add item and force full re-layout for proper spacing with GridLayoutManager.
	 * Use this instead of addItem() when waterFallLayout=false to avoid
	 * spacing issues between initially-bound and dynamically-inserted items.
	 */
	public void addItemWithFullRelayout(HashMap<String, Object> item, int position) {
		d("addItemWithFullRelayout: pos=" + position + " totalCountBefore=" + dataSourceList.size());
		if (position < 0) position = 0;
		if (position > dataSourceList.size()) position = dataSourceList.size();
		dataSourceList.add(position, item);
		// Ensure itemHeights array is large enough for the new item
		ensureItemHeightsSize(dataSourceList.size());
		if (recyclerView != null) {
			notifyItemInserted(position);
			notifyItemRangeChanged(position, dataSourceList.size() - position);
			recyclerView.getRecycledViewPool().clear();
			recyclerView.requestLayout();
			// computeSpanIndices called from ViewProxy for column-container layout
		}
		d("addItemWithFullRelayout: done, new size=" + dataSourceList.size() + " pos=" + position);
	}

	public void clearAnimations() {
		d("clearAnimations: animationsList.size=" + animationsList.size() + " viewAnimations.size=" + viewAnimations.size());
		for (Animator anim : animationsList) {
			if (anim != null && anim.isRunning()) {
				anim.cancel();
			}
		}
		animationsList.clear();
		// Also clear the view->animator map to prevent stale references
		viewAnimations.clear();
	}

	/**
	 * Stop wobble on all items and reset rotation.
	 * Cancels all ValueAnimators, then explicitly sets rotation to 0 on all item views.
	 * ValueAnimator doesn't directly modify view properties, so the rotation stays
	 * at the last value set by the update listener. We must reset it manually.
	 */
	public void stopWobble() {
		d("stopWobble: viewAnimations.size=" + viewAnimations.size());
		// Stop all tracked ValueAnimators
		for (Map.Entry<View, Animator> entry : viewAnimations.entrySet()) {
			Animator anim = entry.getValue();
			if (anim != null && anim.isRunning()) {
				anim.cancel();
			}
		}
		viewAnimations.clear();

		// Explicitly reset rotation to 0 on all item views.
		// ValueAnimator doesn't modify view properties directly,
		// so the rotation stays at the last animated value.
		for (int i = 0; i < dataSourceList.size(); i++) {
			HashMap<String, Object> item = dataSourceList.get(i);
			Object itemViewObj = item.get("item_view");
			if (itemViewObj instanceof View) {
				((View) itemViewObj).setRotation(0f);
			}
		}
		d("stopWobble: done, reset rotation on " + dataSourceList.size() + " items");
	}

	/**
	 * Reset rotation on all currently visible (on-screen) views.
	 * This is needed because notifyDataSetChanged() does NOT call onBindViewHolder()
	 * for views that are already bound to the same position.
	 */
	public void resetVisibleViewRotations() {
		if (recyclerView == null) return;
		d("resetVisibleViewRotations: visible children=" + recyclerView.getChildCount());
		for (int i = 0; i < recyclerView.getChildCount(); i++) {
			View child = recyclerView.getChildAt(i);
			if (child != null) {
				DragViewHolder holder = (DragViewHolder) recyclerView.getChildViewHolder(child);
				if (holder != null && holder.container != null) {
					// The item_view is the first child of the container
					if (holder.container.getChildCount() > 0) {
						View itemView = holder.container.getChildAt(0);
						if (itemView != null) {
							itemView.setRotation(0f);
						}
					}
				}
			}
		}
		d("resetVisibleViewRotations: done");
	}

	/**
	 * Update delete button and badge visibility for all items
	 */
	public void updateEditState() {
		d("updateEditState: isInEditMode=" + isInEditMode + " showDeleteButtons=" + showDeleteButtons +
		  " itemCount=" + dataSourceList.size());
		for (int i = 0; i < dataSourceList.size(); i++) {
			HashMap<String, Object> item = dataSourceList.get(i);
			Object deleteBtnObj = item.get("delete_button");
			Object badgeObj = item.get("badge_view");

			if (deleteBtnObj instanceof View) {
				((View) deleteBtnObj).setVisibility(isInEditMode && showDeleteButtons ? View.VISIBLE : View.INVISIBLE);
			}
			if (badgeObj instanceof View) {
				((View) badgeObj).setVisibility(isInEditMode ? View.INVISIBLE : (itemsBadgeEnabled ? View.VISIBLE : View.GONE));
			}
		}
		d("updateEditState: done");
	}

	/**
	 * Berechnet die Gesamt-Höhe aller Items aus dem dataSourceList.
	 * Summiert cell_height + verticalSpacing (10px bottom spacing).
	 * Dient als stabiler scrollRange für StaggeredGridLayoutManager.
	 */
	public int getTotalContentHeight() {
		int total = 0;
		for (int i = 0; i < dataSourceList.size(); i++) {
			HashMap<String, Object> item = dataSourceList.get(i);
			// Use measured_height if available (actual rendered height),
			// otherwise fall back to cell_height * 3 (generous estimate
			// for items that haven't been measured yet).
			Object measuredHeightObj = item.get("measured_height");
			Object cellHeightObj = item.get("cell_height");
			int itemHeight = 0;
			if (measuredHeightObj instanceof Integer) {
				itemHeight = (Integer) measuredHeightObj;
			}
			// If measured_height is 0 or not set, use cell_height * 3
			// as a safe upper bound (measured height is typically
			// 2-4x larger than cell_height due to padding, borders, etc.)
			if (itemHeight <= 0 && cellHeightObj instanceof Integer) {
				itemHeight = (Integer) cellHeightObj;
			}
			if (itemHeight > 0) {
				total += itemHeight;
			}
			// Add vertical spacing: 10px bottom spacing for each item
			total += 10;
		}
		d("getTotalContentHeight: total=" + total + " itemCount=" + dataSourceList.size());
		return total;
	}

	private int getSpanCount() {
		if (viewProxy == null || viewProxy.getLayoutManager() == null) return 3;
		if (viewProxy.getLayoutManager() instanceof GridLayoutManager) {
			return ((GridLayoutManager) viewProxy.getLayoutManager()).getSpanCount();
		}
		if (viewProxy.getLayoutManager() instanceof StaggeredGridLayoutManager) {
			return ((StaggeredGridLayoutManager) viewProxy.getLayoutManager()).getSpanCount();
		}
		return 3;
	}

	// ---- ViewHolder ----

	public static class DragViewHolder extends RecyclerView.ViewHolder {

		FrameLayout container;
		View boundItem; // tracks which item view is currently attached
		private boolean canBeDeleted = true;
		private boolean canBeMoved = true;
		private int itemPosition = 0;

		public DragViewHolder(FrameLayout container) {
			super(container);
			this.container = container;
		}

		public void setCanBeDeleted(boolean value) {
			canBeDeleted = value;
		}

		public boolean canBeDeleted() {
			return canBeDeleted;
		}

		public void setCanBeMoved(boolean value) {
			canBeMoved = value;
		}

		public boolean canBeMoved() {
			return canBeMoved;
		}

		public void setItemPosition(int position) {
			itemPosition = position;
		}

		public int getItemPosition() {
			return itemPosition;
		}
	}
}

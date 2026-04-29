package de.marcbender.sortablegrid;

import android.graphics.Rect;
import android.view.View;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import androidx.recyclerview.widget.StaggeredGridLayoutManager;

import org.appcelerator.kroll.common.Log;

/**
 * ItemDecoration that adds horizontal and vertical spacing between items
 * in a RecyclerView with StaggeredGridLayoutManager or GridLayoutManager.
 *
 * Bei StaggeredGridLayoutManager ist position != row. Items werden pro Spalte
 * gezählt (spanPos), nicht global. Wir müssen die tatsächliche Row-Position
 * über die Spalten hinweg berechnen.
 */
public class GridSpacingItemDecoration extends RecyclerView.ItemDecoration {

	private static final String LCAT = "GridSpacingItemDecoration";
	private static final boolean DBG_LOG = true;

	private static void d(String msg) { if (DBG_LOG) Log.d(LCAT, msg); }

	private int horizontalSpacing;
	private int verticalSpacing;
	private int spanCount;

	public GridSpacingItemDecoration(int spanCount, int horizontalSpacing, int verticalSpacing) {
		this.spanCount = spanCount;
		this.horizontalSpacing = horizontalSpacing;
		this.verticalSpacing = verticalSpacing;
	}

	public void setHorizontalSpacing(int spacing) {
		this.horizontalSpacing = spacing;
	}

	public void setVerticalSpacing(int spacing) {
		this.verticalSpacing = spacing;
	}

	public void setSpanCount(int count) {
		this.spanCount = count;
	}

	@Override
	public void getItemOffsets(@NonNull Rect outRect, @NonNull View view, @NonNull RecyclerView parent, @NonNull RecyclerView.State state) {
		int position = parent.getChildAdapterPosition(view);
		int totalItems = state.getItemCount();

		if (position < 0 || totalItems <= 0) {
			outRect.setEmpty();
			return;
		}

		// StaggeredGridLayoutManager: use standard spacing
		if (parent.getLayoutManager() instanceof StaggeredGridLayoutManager) {
			outRect.left = horizontalSpacing / 2;
			outRect.right = horizontalSpacing / 2;
			outRect.top = verticalSpacing / 2;
			outRect.bottom = verticalSpacing / 2;
			return;
		}

		int columns = spanCount;

		// Detect which layoutManager is being used to get correct column count
		RecyclerView.LayoutManager lm = parent.getLayoutManager();
		if (lm instanceof GridLayoutManager) {
			columns = ((GridLayoutManager) lm).getSpanCount();
		} else if (lm instanceof StaggeredGridLayoutManager) {
			columns = ((StaggeredGridLayoutManager) lm).getSpanCount();
		}

		if (columns <= 0) {
			columns = spanCount;
		}

		// Add horizontal spacing to all items
		outRect.left = horizontalSpacing / 2;
		outRect.right = horizontalSpacing / 2;

		// Add vertical spacing between rows
		outRect.top = verticalSpacing / 2;
		outRect.bottom = verticalSpacing / 2;

		// Top edge: no extra top spacing for first row
		if (position < columns) {
			outRect.top = verticalSpacing / 2;
		}

		// Bottom edge: spacing for last row
		if (position >= totalItems - columns) {
			outRect.bottom = verticalSpacing / 2;
		}

		d("getItemOffsets: pos=" + position + " spanCount=" + columns +
		  " outRect=[l=" + outRect.left + " t=" + outRect.top + " r=" + outRect.right + " b=" + outRect.bottom + "]");
	}

	/**
	 * Berechnet die Row-Index eines Items über alle Spalten hinweg.
	 *
	 * StaggeredGridLayoutManager platziert Items in die Spalte mit der
	 * geringsten Höhe. Die Item-Position ist die globale Item-Position,
	 * nicht die Position innerhalb einer Spalte.
	 *
	 * Bei verticaler Ausrichtung:
	 * - position=0,1,2 → row=0 (erste 3 Items füllen die erste Row)
	 * - position=3,4,5 → row=1
	 * - etc.
	 *
	 * WICHTIG: Dies ist eine ANNÄHERUNG. StaggeredGridLayoutManager kann
	 * Items in beliebiger Reihenfolge platzieren (nicht streng column-major).
	 * Die tatsächliche Zuordnung erfolgt durch das LayoutManager-Intern.
	 */
	private int calculateGlobalRowIndex(int position, int spanCount) {
		return position / spanCount;
	}
}

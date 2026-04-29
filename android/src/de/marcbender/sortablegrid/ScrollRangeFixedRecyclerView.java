package de.marcbender.sortablegrid;

import android.content.Context;
import android.util.AttributeSet;
import android.view.View;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.recyclerview.widget.RecyclerView;

import org.appcelerator.kroll.common.Log;

/**
 * RecyclerView der einen fixen scrollRange erzwingt.
 *
 * Problem: StaggeredGridLayoutManager berechnet scrollRange dynamisch
 * aus den aktuellen Spaltenhöhlen. Beim Recycling ändern sich die
 * Spaltenhöhlen → scrollRange schwankt → GAPs entstehen.
 *
 * Lösung: Überschreibt computeVerticalScrollRange() um einen fixen
 * Wert zurückzugeben.
 *
 * Items behalten ihre unterschiedlichen Höhen — das ist korrekt
 * für Waterfall/Masonry.
 */
public class ScrollRangeFixedRecyclerView extends RecyclerView {

	private static final String LCAT = "ScrollRangeFixedRV";
	private static final boolean DBG_LOG = true;
	private static void d(String msg) { if (DBG_LOG) Log.d(LCAT, msg); }

	/** Fixer scrollRange (0 = disabled) */
	private int fixedScrollRange = 0;

	public ScrollRangeFixedRecyclerView(@NonNull Context context) {
		super(context);
	}

	public ScrollRangeFixedRecyclerView(@NonNull Context context, @Nullable AttributeSet attrs) {
		super(context, attrs);
	}

	public ScrollRangeFixedRecyclerView(@NonNull Context context, @Nullable AttributeSet attrs, int defStyle) {
		super(context, attrs, defStyle);
	}

	@Override
	public int computeVerticalScrollRange() {
		if (fixedScrollRange > 0) {
			d("computeVerticalScrollRange: FIXED = " + fixedScrollRange);
			return fixedScrollRange;
		}
		d("computeVerticalScrollRange: NORMAL (super)");
		return super.computeVerticalScrollRange();
	}

	/**
	 * Setzt den fixen scrollRange.
	 * @param range Fixer Wert (0 = deaktiviert)
	 */
	public void setFixedVerticalScrollRange(int range) {
		this.fixedScrollRange = range;
		d("setFixedVerticalScrollRange: " + range);
	}

	/**
	 * Gibt den aktuellen fixen scrollRange zurück.
	 */
	public int getFixedVerticalScrollRange() {
		return fixedScrollRange;
	}
}

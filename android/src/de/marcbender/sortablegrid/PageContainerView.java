package de.marcbender.sortablegrid;

import android.content.Context;
import android.widget.LinearLayout;

/**
 * Container view für eine Seite im horizontalen Paging-Modus.
 * Enthält columnCount * rowCount Items.
 */
public class PageContainerView extends LinearLayout {
	
	private int pageId;
	private int columnCount;
	private int rowCount;
	
	public PageContainerView(Context context, int pageId, int columnCount, int rowCount) {
		super(context);
		this.pageId = pageId;
		this.columnCount = columnCount;
		this.rowCount = rowCount;
		
		setOrientation(HORIZONTAL);
		setLayoutParams(new LayoutParams(
			LayoutParams.WRAP_CONTENT,
			LayoutParams.MATCH_PARENT
		));
	}
	
	public int getPageId() {
		return pageId;
	}
	
	public int getColumnCount() {
		return columnCount;
	}
	
	public int getRowCount() {
		return rowCount;
	}
	
	public int getItemsPerPage() {
		return columnCount * rowCount;
	}
}

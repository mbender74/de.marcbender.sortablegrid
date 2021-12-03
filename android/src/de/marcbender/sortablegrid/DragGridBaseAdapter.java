package de.marcbender.sortablegrid;

public interface DragGridBaseAdapter {
	/**
	 *
	 * @param oldPosition
	 * @param newPosition
	 */
	public void reorderItems(int oldPosition, int newPosition);


	/**
	 *
	 * @param hidePosition
	 */
	public void setHideItem(int hidePosition);

	/**
	 *
	 * @param removePosition
	 */
	public void removeItem(int removePosition);


}

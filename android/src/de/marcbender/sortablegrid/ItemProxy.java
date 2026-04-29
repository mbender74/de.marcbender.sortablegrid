package de.marcbender.sortablegrid;

import org.appcelerator.kroll.KrollDict;
import org.appcelerator.kroll.annotations.Kroll;
import org.appcelerator.titanium.TiC;
import org.appcelerator.kroll.common.Log;
import org.appcelerator.kroll.common.TiConfig;
import org.appcelerator.titanium.util.TiConvert;
import org.appcelerator.titanium.proxy.TiViewProxy;
import org.appcelerator.kroll.KrollDict;
import org.appcelerator.kroll.annotations.Kroll;
import org.appcelerator.titanium.TiC;
import org.appcelerator.kroll.common.Log;
import org.appcelerator.kroll.common.TiConfig;
import org.appcelerator.titanium.util.TiConvert;
import org.appcelerator.titanium.proxy.TiViewProxy;
import org.appcelerator.titanium.view.TiUIView;
import org.appcelerator.titanium.view.TiCompositeLayout;
import org.appcelerator.titanium.view.TiCompositeLayout.LayoutArrangement;
import android.app.Activity;

/**
 * Item proxy for sortablegrid items, matching iOS DeMarcbenderSortablegridItemProxy.
 * Created via: sortableGridModule.createItem({...})
 */
@Kroll.proxy(creatableInModule=TiSortablegridModule.class)
public class ItemProxy extends TiViewProxy
{
	private static final String LCAT = "ItemProxy";
	private static final boolean DBG = TiConfig.LOGD;

	// Item-specific properties
	private int badgeValue = 0;
	private boolean badgeEnabled = false;
	private boolean canBeDeleted = true;
	private boolean canBeMoved = true;
	private int badgeTintColor = 0xFFFF0000; // red

	public ItemProxy()
	{
		super();
	}

	private class ItemView extends TiUIView
	{
		public ItemView(TiViewProxy proxy) {
			super(proxy);
			LayoutArrangement arrangement = LayoutArrangement.DEFAULT;
			if (proxy.hasProperty(TiC.PROPERTY_LAYOUT)) {
				String layoutProperty = TiConvert.toString(proxy.getProperty(TiC.PROPERTY_LAYOUT));
				if (layoutProperty.equals(TiC.LAYOUT_HORIZONTAL)) {
					arrangement = LayoutArrangement.HORIZONTAL;
				} else if (layoutProperty.equals(TiC.LAYOUT_VERTICAL)) {
					arrangement = LayoutArrangement.VERTICAL;
				}
			}
			setNativeView(new TiCompositeLayout(proxy.getActivity(), arrangement));
		}

		@Override
		public void processProperties(KrollDict d)
		{
			super.processProperties(d);
		}
	}

	@Override
	public TiUIView createView(Activity activity)
	{
		ItemView view = new ItemView(this);
		view.getLayoutParams().autoFillsHeight = true;
		view.getLayoutParams().autoFillsWidth = true;
		return view;
	}

	@Override
	public void handleCreationDict(KrollDict options)
	{
		super.handleCreationDict(options);

		if (options.containsKey("badgeValue")) {
			badgeValue = TiConvert.toInt(options.get("badgeValue"), 0);
		}
		if (options.containsKey("badge")) {
			badgeEnabled = TiConvert.toBoolean(options.get("badge"), false);
		}
		if (options.containsKey("canBeDeleted")) {
			canBeDeleted = TiConvert.toBoolean(options.get("canBeDeleted"), true);
		}
		if (options.containsKey("canBeMoved")) {
			canBeMoved = TiConvert.toBoolean(options.get("canBeMoved"), true);
		}
		if (options.containsKey("badgeTintColor")) {
			badgeTintColor = TiConvert.toColor(options.getString("badgeTintColor"), getActivity());
		}
	}

	// ---- badgeValue property ----

	@Kroll.getProperty @Kroll.method
	public int getBadgeValue()
	{
		return badgeValue;
	}

	@Kroll.setProperty @Kroll.method
	public void setBadgeValue(int value)
	{
		badgeValue = value;
		// If the item is already in the grid, update the badge view
		ViewProxy parentProxy = getParentViewProxy();
		if (parentProxy != null) {
			int pos = getPosition();
			if (pos >= 0) {
				parentProxy.updateBadgeValue(pos, value);
			}
		}
	}

	// ---- badge property (boolean, iOS-style) ----

	@Kroll.getProperty @Kroll.method
	public boolean getBadge()
	{
		return badgeEnabled;
	}

	@Kroll.setProperty @Kroll.method
	public void setBadge(boolean value)
	{
		badgeEnabled = value;
	}

	// ---- canBeDeleted property ----

	@Kroll.getProperty @Kroll.method
	public boolean getCanBeDeleted()
	{
		return canBeDeleted;
	}

	@Kroll.setProperty @Kroll.method
	public void setCanBeDeleted(boolean value)
	{
		canBeDeleted = value;
	}

	// ---- canBeMoved property ----

	@Kroll.getProperty @Kroll.method
	public boolean getCanBeMoved()
	{
		return canBeMoved;
	}

	@Kroll.setProperty @Kroll.method
	public void setCanBeMoved(boolean value)
	{
		canBeMoved = value;
	}

	// ---- badgeTintColor property ----

	@Kroll.getProperty @Kroll.method
	public String getBadgeTintColor()
	{
		return String.format("#%06X", (0xFFFFFF & badgeTintColor));
	}

	@Kroll.setProperty @Kroll.method
	public void setBadgeTintColor(String color)
	{
		if (color != null) {
			badgeTintColor = TiConvert.toColor(color, getActivity());
		}
	}

	// ---- position property (auto-updated by the grid) ----

	@Kroll.getProperty @Kroll.method
	public int getPosition()
	{
		if (hasProperty("position")) {
			return TiConvert.toInt(getProperty("position"), -1);
		}
		return -1;
	}

	// ---- Helper to find the parent ViewProxy ----

	private ViewProxy getParentViewProxy()
	{
		// Walk up the parent chain to find the ViewProxy
		if (getParent() instanceof ViewProxy) {
			return (ViewProxy) getParent();
		}
		return null;
	}
}
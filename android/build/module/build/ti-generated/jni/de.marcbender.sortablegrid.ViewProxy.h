/**
 * Titanium SDK
 * Copyright TiDev, Inc. 04/07/2022-Present
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */

/** This is generated, do not edit by hand. **/

#include "Proxy.h"

namespace de {
namespace marcbender {
namespace sortablegrid {
	namespace tisortablegrid {

class ViewProxy : public titanium::Proxy
{
public:
	explicit ViewProxy();

	static void bindProxy(v8::Local<v8::Object>, v8::Local<v8::Context>);
	static v8::Local<v8::FunctionTemplate> getProxyTemplate(v8::Isolate*);
	static v8::Local<v8::FunctionTemplate> getProxyTemplate(v8::Local<v8::Context>);
	static void dispose(v8::Isolate*);

	static jclass javaClass;

private:
	static v8::Persistent<v8::FunctionTemplate> proxyTemplate;
	static v8::Persistent<v8::Object> moduleInstance;

	// Methods -----------------------------------------------------------
	static void setDragItemShadowOpacity(const v8::FunctionCallbackInfo<v8::Value>&);
	static void setPageIndicatorTintColor(const v8::FunctionCallbackInfo<v8::Value>&);
	static void getPageCount(const v8::FunctionCallbackInfo<v8::Value>&);
	static void setDisableBounce(const v8::FunctionCallbackInfo<v8::Value>&);
	static void getEditable(const v8::FunctionCallbackInfo<v8::Value>&);
	static void setRefreshControl_(const v8::FunctionCallbackInfo<v8::Value>&);
	static void setItemsBadgeEnabled(const v8::FunctionCallbackInfo<v8::Value>&);
	static void insertItemAtIndex(const v8::FunctionCallbackInfo<v8::Value>&);
	static void getHorizontalSpacing(const v8::FunctionCallbackInfo<v8::Value>&);
	static void setPagingEnabled(const v8::FunctionCallbackInfo<v8::Value>&);
	static void getScrollToBottomAfterSetData(const v8::FunctionCallbackInfo<v8::Value>&);
	static void getPagerEnabled(const v8::FunctionCallbackInfo<v8::Value>&);
	static void setCurrentPageIndicatorTintColor(const v8::FunctionCallbackInfo<v8::Value>&);
	static void setScrollIndicatorInsets(const v8::FunctionCallbackInfo<v8::Value>&);
	static void startEditing(const v8::FunctionCallbackInfo<v8::Value>&);
	static void getDragItemShadowOpacity(const v8::FunctionCallbackInfo<v8::Value>&);
	static void setScrollToBottomAfterSetData(const v8::FunctionCallbackInfo<v8::Value>&);
	static void setLazyLoadingEnabled(const v8::FunctionCallbackInfo<v8::Value>&);
	static void getScrollType(const v8::FunctionCallbackInfo<v8::Value>&);
	static void getDisableBounce(const v8::FunctionCallbackInfo<v8::Value>&);
	static void setShowVerticalScrollIndicator(const v8::FunctionCallbackInfo<v8::Value>&);
	static void getPagingEnabled(const v8::FunctionCallbackInfo<v8::Value>&);
	static void setWobble(const v8::FunctionCallbackInfo<v8::Value>&);
	static void setVerticalSpacing(const v8::FunctionCallbackInfo<v8::Value>&);
	static void setPagerEnabled(const v8::FunctionCallbackInfo<v8::Value>&);
	static void createItem(const v8::FunctionCallbackInfo<v8::Value>&);
	static void getPageIndicatorTintColor(const v8::FunctionCallbackInfo<v8::Value>&);
	static void getScrollEnabled(const v8::FunctionCallbackInfo<v8::Value>&);
	static void getShowVerticalScrollIndicator(const v8::FunctionCallbackInfo<v8::Value>&);
	static void setShowDeleteButton(const v8::FunctionCallbackInfo<v8::Value>&);
	static void getColumnWidth(const v8::FunctionCallbackInfo<v8::Value>&);
	static void setShowHorizontalScrollIndicator(const v8::FunctionCallbackInfo<v8::Value>&);
	static void notifyItemsReordered(const v8::FunctionCallbackInfo<v8::Value>&);
	static void deleteItemAtIndex(const v8::FunctionCallbackInfo<v8::Value>&);
	static void setColumnWidth(const v8::FunctionCallbackInfo<v8::Value>&);
	static void setMinHorizontalSpacing(const v8::FunctionCallbackInfo<v8::Value>&);
	static void setMinVerticalSpacing(const v8::FunctionCallbackInfo<v8::Value>&);
	static void setHorizontalSpacing(const v8::FunctionCallbackInfo<v8::Value>&);
	static void getShowDeleteButton(const v8::FunctionCallbackInfo<v8::Value>&);
	static void getPagerFollowsBottomInset(const v8::FunctionCallbackInfo<v8::Value>&);
	static void setContentInsets(const v8::FunctionCallbackInfo<v8::Value>&);
	static void stopEditing(const v8::FunctionCallbackInfo<v8::Value>&);
	static void updateBadgeValue(const v8::FunctionCallbackInfo<v8::Value>&);
	static void setWaterFallLayout(const v8::FunctionCallbackInfo<v8::Value>&);
	static void setDeleteButtonImage(const v8::FunctionCallbackInfo<v8::Value>&);
	static void setItems(const v8::FunctionCallbackInfo<v8::Value>&);
	static void getLayoutManager(const v8::FunctionCallbackInfo<v8::Value>&);
	static void getLazyLoadingEnabled(const v8::FunctionCallbackInfo<v8::Value>&);
	static void getData(const v8::FunctionCallbackInfo<v8::Value>&);
	static void getWaterFallLayout(const v8::FunctionCallbackInfo<v8::Value>&);
	static void setData(const v8::FunctionCallbackInfo<v8::Value>&);
	static void scrollToBottom(const v8::FunctionCallbackInfo<v8::Value>&);
	static void getItemsBadgeEnabled(const v8::FunctionCallbackInfo<v8::Value>&);
	static void setScrollEnabled(const v8::FunctionCallbackInfo<v8::Value>&);
	static void getCurrentPageIndicatorTintColor(const v8::FunctionCallbackInfo<v8::Value>&);
	static void setCurrentPage(const v8::FunctionCallbackInfo<v8::Value>&);
	static void setPagerFollowsBottomInset(const v8::FunctionCallbackInfo<v8::Value>&);
	static void getVerticalSpacing(const v8::FunctionCallbackInfo<v8::Value>&);
	static void getMinHorizontalSpacing(const v8::FunctionCallbackInfo<v8::Value>&);
	static void setScrollType(const v8::FunctionCallbackInfo<v8::Value>&);
	static void getShowHorizontalScrollIndicator(const v8::FunctionCallbackInfo<v8::Value>&);
	static void setEditable(const v8::FunctionCallbackInfo<v8::Value>&);
	static void getWobble(const v8::FunctionCallbackInfo<v8::Value>&);
	static void deleteItem(const v8::FunctionCallbackInfo<v8::Value>&);
	static void scrollToItemAtIndex(const v8::FunctionCallbackInfo<v8::Value>&);
	static void setColumnCount(const v8::FunctionCallbackInfo<v8::Value>&);
	static void getMinVerticalSpacing(const v8::FunctionCallbackInfo<v8::Value>&);

	// Dynamic property accessors ----------------------------------------
	static void getter_data(v8::Local<v8::Name> name, const v8::PropertyCallbackInfo<v8::Value>& info);
	static void setter_data(v8::Local<v8::Name> name, v8::Local<v8::Value> value, const v8::PropertyCallbackInfo<void>& info);
	static void getter_pagerEnabled(v8::Local<v8::Name> name, const v8::PropertyCallbackInfo<v8::Value>& info);
	static void setter_pagerEnabled(v8::Local<v8::Name> name, v8::Local<v8::Value> value, const v8::PropertyCallbackInfo<void>& info);
	static void getter_dragItemShadowOpacity(v8::Local<v8::Name> name, const v8::PropertyCallbackInfo<v8::Value>& info);
	static void setter_dragItemShadowOpacity(v8::Local<v8::Name> name, v8::Local<v8::Value> value, const v8::PropertyCallbackInfo<void>& info);
	static void getter_disableBounce(v8::Local<v8::Name> name, const v8::PropertyCallbackInfo<v8::Value>& info);
	static void setter_disableBounce(v8::Local<v8::Name> name, v8::Local<v8::Value> value, const v8::PropertyCallbackInfo<void>& info);
	static void setter_refreshControl_(v8::Local<v8::Name> name, v8::Local<v8::Value> value, const v8::PropertyCallbackInfo<void>& info);
	static void getter_verticalSpacing(v8::Local<v8::Name> name, const v8::PropertyCallbackInfo<v8::Value>& info);
	static void setter_verticalSpacing(v8::Local<v8::Name> name, v8::Local<v8::Value> value, const v8::PropertyCallbackInfo<void>& info);
	static void getter_wobble(v8::Local<v8::Name> name, const v8::PropertyCallbackInfo<v8::Value>& info);
	static void setter_wobble(v8::Local<v8::Name> name, v8::Local<v8::Value> value, const v8::PropertyCallbackInfo<void>& info);
	static void getter_waterFallLayout(v8::Local<v8::Name> name, const v8::PropertyCallbackInfo<v8::Value>& info);
	static void setter_waterFallLayout(v8::Local<v8::Name> name, v8::Local<v8::Value> value, const v8::PropertyCallbackInfo<void>& info);
	static void getter_scrollEnabled(v8::Local<v8::Name> name, const v8::PropertyCallbackInfo<v8::Value>& info);
	static void setter_scrollEnabled(v8::Local<v8::Name> name, v8::Local<v8::Value> value, const v8::PropertyCallbackInfo<void>& info);
	static void getter_itemsBadgeEnabled(v8::Local<v8::Name> name, const v8::PropertyCallbackInfo<v8::Value>& info);
	static void setter_itemsBadgeEnabled(v8::Local<v8::Name> name, v8::Local<v8::Value> value, const v8::PropertyCallbackInfo<void>& info);
	static void getter_minVerticalSpacing(v8::Local<v8::Name> name, const v8::PropertyCallbackInfo<v8::Value>& info);
	static void setter_minVerticalSpacing(v8::Local<v8::Name> name, v8::Local<v8::Value> value, const v8::PropertyCallbackInfo<void>& info);
	static void getter_scrollType(v8::Local<v8::Name> name, const v8::PropertyCallbackInfo<v8::Value>& info);
	static void setter_scrollType(v8::Local<v8::Name> name, v8::Local<v8::Value> value, const v8::PropertyCallbackInfo<void>& info);
	static void getter_horizontalSpacing(v8::Local<v8::Name> name, const v8::PropertyCallbackInfo<v8::Value>& info);
	static void setter_horizontalSpacing(v8::Local<v8::Name> name, v8::Local<v8::Value> value, const v8::PropertyCallbackInfo<void>& info);
	static void setter_scrollIndicatorInsets(v8::Local<v8::Name> name, v8::Local<v8::Value> value, const v8::PropertyCallbackInfo<void>& info);
	static void getter_columnWidth(v8::Local<v8::Name> name, const v8::PropertyCallbackInfo<v8::Value>& info);
	static void setter_columnWidth(v8::Local<v8::Name> name, v8::Local<v8::Value> value, const v8::PropertyCallbackInfo<void>& info);
	static void getter_pagingEnabled(v8::Local<v8::Name> name, const v8::PropertyCallbackInfo<v8::Value>& info);
	static void setter_pagingEnabled(v8::Local<v8::Name> name, v8::Local<v8::Value> value, const v8::PropertyCallbackInfo<void>& info);
	static void getter_showDeleteButton(v8::Local<v8::Name> name, const v8::PropertyCallbackInfo<v8::Value>& info);
	static void setter_showDeleteButton(v8::Local<v8::Name> name, v8::Local<v8::Value> value, const v8::PropertyCallbackInfo<void>& info);
	static void getter_showVerticalScrollIndicator(v8::Local<v8::Name> name, const v8::PropertyCallbackInfo<v8::Value>& info);
	static void setter_showVerticalScrollIndicator(v8::Local<v8::Name> name, v8::Local<v8::Value> value, const v8::PropertyCallbackInfo<void>& info);
	static void getter_pagerFollowsBottomInset(v8::Local<v8::Name> name, const v8::PropertyCallbackInfo<v8::Value>& info);
	static void setter_pagerFollowsBottomInset(v8::Local<v8::Name> name, v8::Local<v8::Value> value, const v8::PropertyCallbackInfo<void>& info);
	static void getter_currentPageIndicatorTintColor(v8::Local<v8::Name> name, const v8::PropertyCallbackInfo<v8::Value>& info);
	static void setter_currentPageIndicatorTintColor(v8::Local<v8::Name> name, v8::Local<v8::Value> value, const v8::PropertyCallbackInfo<void>& info);
	static void setter_deleteButtonImage(v8::Local<v8::Name> name, v8::Local<v8::Value> value, const v8::PropertyCallbackInfo<void>& info);
	static void getter_pageCount(v8::Local<v8::Name> name, const v8::PropertyCallbackInfo<v8::Value>& info);
	static void getter_editable(v8::Local<v8::Name> name, const v8::PropertyCallbackInfo<v8::Value>& info);
	static void setter_editable(v8::Local<v8::Name> name, v8::Local<v8::Value> value, const v8::PropertyCallbackInfo<void>& info);
	static void setter_contentInsets(v8::Local<v8::Name> name, v8::Local<v8::Value> value, const v8::PropertyCallbackInfo<void>& info);
	static void setter_columnCount(v8::Local<v8::Name> name, v8::Local<v8::Value> value, const v8::PropertyCallbackInfo<void>& info);
	static void getter_minHorizontalSpacing(v8::Local<v8::Name> name, const v8::PropertyCallbackInfo<v8::Value>& info);
	static void setter_minHorizontalSpacing(v8::Local<v8::Name> name, v8::Local<v8::Value> value, const v8::PropertyCallbackInfo<void>& info);
	static void getter_lazyLoadingEnabled(v8::Local<v8::Name> name, const v8::PropertyCallbackInfo<v8::Value>& info);
	static void setter_lazyLoadingEnabled(v8::Local<v8::Name> name, v8::Local<v8::Value> value, const v8::PropertyCallbackInfo<void>& info);
	static void getter_scrollToBottomAfterSetData(v8::Local<v8::Name> name, const v8::PropertyCallbackInfo<v8::Value>& info);
	static void setter_scrollToBottomAfterSetData(v8::Local<v8::Name> name, v8::Local<v8::Value> value, const v8::PropertyCallbackInfo<void>& info);
	static void getter_layoutManager(v8::Local<v8::Name> name, const v8::PropertyCallbackInfo<v8::Value>& info);
	static void getter_showHorizontalScrollIndicator(v8::Local<v8::Name> name, const v8::PropertyCallbackInfo<v8::Value>& info);
	static void setter_showHorizontalScrollIndicator(v8::Local<v8::Name> name, v8::Local<v8::Value> value, const v8::PropertyCallbackInfo<void>& info);
	static void setter_currentPage(v8::Local<v8::Name> name, v8::Local<v8::Value> value, const v8::PropertyCallbackInfo<void>& info);
	static void setter_items(v8::Local<v8::Name> name, v8::Local<v8::Value> value, const v8::PropertyCallbackInfo<void>& info);
	static void getter_pageIndicatorTintColor(v8::Local<v8::Name> name, const v8::PropertyCallbackInfo<v8::Value>& info);
	static void setter_pageIndicatorTintColor(v8::Local<v8::Name> name, v8::Local<v8::Value> value, const v8::PropertyCallbackInfo<void>& info);

};

	} // namespace tisortablegrid
} // sortablegrid
} // marcbender
} // de

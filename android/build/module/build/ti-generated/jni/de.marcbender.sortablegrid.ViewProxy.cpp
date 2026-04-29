/**
 * Titanium SDK
 * Copyright TiDev, Inc. 04/07/2022-Present
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */

/** This code is generated, do not edit by hand. **/

#include "de.marcbender.sortablegrid.ViewProxy.h"

#include "JSException.h"
#include "TypeConverter.h"


#include "org.appcelerator.titanium.proxy.TiViewProxy.h"

#define TAG "ViewProxy"

using namespace v8;

namespace de {
namespace marcbender {
namespace sortablegrid {
	namespace tisortablegrid {


Persistent<FunctionTemplate> ViewProxy::proxyTemplate;
Persistent<Object> ViewProxy::moduleInstance;
jclass ViewProxy::javaClass = NULL;

ViewProxy::ViewProxy() : titanium::Proxy()
{
}

void ViewProxy::bindProxy(Local<Object> exports, Local<Context> context)
{
	Isolate* isolate = context->GetIsolate();

	Local<FunctionTemplate> pt = getProxyTemplate(isolate);

	v8::TryCatch tryCatch(isolate);
	Local<Function> constructor;
	MaybeLocal<Function> maybeConstructor = pt->GetFunction(context);
	if (!maybeConstructor.ToLocal(&constructor)) {
		titanium::V8Util::fatalException(isolate, tryCatch);
		return;
	}

	Local<String> nameSymbol = NEW_SYMBOL(isolate, "View"); // use symbol over string for efficiency
	exports->Set(context, nameSymbol, constructor);
	exports->Set(context, constructorSymbol.Get(isolate), constructor);
}

void ViewProxy::dispose(Isolate* isolate)
{
	LOGD(TAG, "dispose()");
	if (!proxyTemplate.IsEmpty()) {
		proxyTemplate.Reset();
	}
	if (!moduleInstance.IsEmpty()) {
	    moduleInstance.Reset();
	}

	titanium::TiViewProxy::dispose(isolate);
}

Local<FunctionTemplate> ViewProxy::getProxyTemplate(v8::Isolate* isolate)
{
	Local<Context> context = isolate->GetCurrentContext();
	if (!proxyTemplate.IsEmpty()) {
		return proxyTemplate.Get(isolate);
	}

	LOGD(TAG, "ViewProxy::getProxyTemplate()");

	javaClass = titanium::JNIUtil::findClass("de/marcbender/sortablegrid/ViewProxy");
	EscapableHandleScope scope(isolate);

	// use symbol over string for efficiency
	Local<String> nameSymbol = NEW_SYMBOL(isolate, "View");

	Local<FunctionTemplate> t = titanium::Proxy::inheritProxyTemplate(
		isolate,
		titanium::TiViewProxy::getProxyTemplate(isolate),
		javaClass,
		nameSymbol);

	proxyTemplate.Reset(isolate, t);
	t->Set(titanium::Proxy::inheritSymbol.Get(isolate), FunctionTemplate::New(isolate, titanium::Proxy::inherit<ViewProxy>));

	// Method bindings --------------------------------------------------------
	titanium::SetProtoMethod(isolate, t, "setDragItemShadowOpacity", ViewProxy::setDragItemShadowOpacity);
	titanium::SetProtoMethod(isolate, t, "setPageIndicatorTintColor", ViewProxy::setPageIndicatorTintColor);
	titanium::SetProtoMethod(isolate, t, "getPageCount", ViewProxy::getPageCount);
	titanium::SetProtoMethod(isolate, t, "setDisableBounce", ViewProxy::setDisableBounce);
	titanium::SetProtoMethod(isolate, t, "getEditable", ViewProxy::getEditable);
	titanium::SetProtoMethod(isolate, t, "setRefreshControl_", ViewProxy::setRefreshControl_);
	titanium::SetProtoMethod(isolate, t, "setItemsBadgeEnabled", ViewProxy::setItemsBadgeEnabled);
	titanium::SetProtoMethod(isolate, t, "insertItemAtIndex", ViewProxy::insertItemAtIndex);
	titanium::SetProtoMethod(isolate, t, "getHorizontalSpacing", ViewProxy::getHorizontalSpacing);
	titanium::SetProtoMethod(isolate, t, "setPagingEnabled", ViewProxy::setPagingEnabled);
	titanium::SetProtoMethod(isolate, t, "getScrollToBottomAfterSetData", ViewProxy::getScrollToBottomAfterSetData);
	titanium::SetProtoMethod(isolate, t, "getPagerEnabled", ViewProxy::getPagerEnabled);
	titanium::SetProtoMethod(isolate, t, "setCurrentPageIndicatorTintColor", ViewProxy::setCurrentPageIndicatorTintColor);
	titanium::SetProtoMethod(isolate, t, "setScrollIndicatorInsets", ViewProxy::setScrollIndicatorInsets);
	titanium::SetProtoMethod(isolate, t, "startEditing", ViewProxy::startEditing);
	titanium::SetProtoMethod(isolate, t, "getDragItemShadowOpacity", ViewProxy::getDragItemShadowOpacity);
	titanium::SetProtoMethod(isolate, t, "setScrollToBottomAfterSetData", ViewProxy::setScrollToBottomAfterSetData);
	titanium::SetProtoMethod(isolate, t, "setLazyLoadingEnabled", ViewProxy::setLazyLoadingEnabled);
	titanium::SetProtoMethod(isolate, t, "getScrollType", ViewProxy::getScrollType);
	titanium::SetProtoMethod(isolate, t, "getDisableBounce", ViewProxy::getDisableBounce);
	titanium::SetProtoMethod(isolate, t, "setShowVerticalScrollIndicator", ViewProxy::setShowVerticalScrollIndicator);
	titanium::SetProtoMethod(isolate, t, "getPagingEnabled", ViewProxy::getPagingEnabled);
	titanium::SetProtoMethod(isolate, t, "setWobble", ViewProxy::setWobble);
	titanium::SetProtoMethod(isolate, t, "setVerticalSpacing", ViewProxy::setVerticalSpacing);
	titanium::SetProtoMethod(isolate, t, "setPagerEnabled", ViewProxy::setPagerEnabled);
	titanium::SetProtoMethod(isolate, t, "createItem", ViewProxy::createItem);
	titanium::SetProtoMethod(isolate, t, "getPageIndicatorTintColor", ViewProxy::getPageIndicatorTintColor);
	titanium::SetProtoMethod(isolate, t, "getScrollEnabled", ViewProxy::getScrollEnabled);
	titanium::SetProtoMethod(isolate, t, "getShowVerticalScrollIndicator", ViewProxy::getShowVerticalScrollIndicator);
	titanium::SetProtoMethod(isolate, t, "setShowDeleteButton", ViewProxy::setShowDeleteButton);
	titanium::SetProtoMethod(isolate, t, "getColumnWidth", ViewProxy::getColumnWidth);
	titanium::SetProtoMethod(isolate, t, "setShowHorizontalScrollIndicator", ViewProxy::setShowHorizontalScrollIndicator);
	titanium::SetProtoMethod(isolate, t, "notifyItemsReordered", ViewProxy::notifyItemsReordered);
	titanium::SetProtoMethod(isolate, t, "deleteItemAtIndex", ViewProxy::deleteItemAtIndex);
	titanium::SetProtoMethod(isolate, t, "setColumnWidth", ViewProxy::setColumnWidth);
	titanium::SetProtoMethod(isolate, t, "setMinHorizontalSpacing", ViewProxy::setMinHorizontalSpacing);
	titanium::SetProtoMethod(isolate, t, "setMinVerticalSpacing", ViewProxy::setMinVerticalSpacing);
	titanium::SetProtoMethod(isolate, t, "setHorizontalSpacing", ViewProxy::setHorizontalSpacing);
	titanium::SetProtoMethod(isolate, t, "getShowDeleteButton", ViewProxy::getShowDeleteButton);
	titanium::SetProtoMethod(isolate, t, "getPagerFollowsBottomInset", ViewProxy::getPagerFollowsBottomInset);
	titanium::SetProtoMethod(isolate, t, "setContentInsets", ViewProxy::setContentInsets);
	titanium::SetProtoMethod(isolate, t, "stopEditing", ViewProxy::stopEditing);
	titanium::SetProtoMethod(isolate, t, "updateBadgeValue", ViewProxy::updateBadgeValue);
	titanium::SetProtoMethod(isolate, t, "setWaterFallLayout", ViewProxy::setWaterFallLayout);
	titanium::SetProtoMethod(isolate, t, "setDeleteButtonImage", ViewProxy::setDeleteButtonImage);
	titanium::SetProtoMethod(isolate, t, "setItems", ViewProxy::setItems);
	titanium::SetProtoMethod(isolate, t, "getLayoutManager", ViewProxy::getLayoutManager);
	titanium::SetProtoMethod(isolate, t, "getLazyLoadingEnabled", ViewProxy::getLazyLoadingEnabled);
	titanium::SetProtoMethod(isolate, t, "getData", ViewProxy::getData);
	titanium::SetProtoMethod(isolate, t, "getWaterFallLayout", ViewProxy::getWaterFallLayout);
	titanium::SetProtoMethod(isolate, t, "setData", ViewProxy::setData);
	titanium::SetProtoMethod(isolate, t, "scrollToBottom", ViewProxy::scrollToBottom);
	titanium::SetProtoMethod(isolate, t, "getItemsBadgeEnabled", ViewProxy::getItemsBadgeEnabled);
	titanium::SetProtoMethod(isolate, t, "setScrollEnabled", ViewProxy::setScrollEnabled);
	titanium::SetProtoMethod(isolate, t, "getCurrentPageIndicatorTintColor", ViewProxy::getCurrentPageIndicatorTintColor);
	titanium::SetProtoMethod(isolate, t, "setCurrentPage", ViewProxy::setCurrentPage);
	titanium::SetProtoMethod(isolate, t, "setPagerFollowsBottomInset", ViewProxy::setPagerFollowsBottomInset);
	titanium::SetProtoMethod(isolate, t, "getVerticalSpacing", ViewProxy::getVerticalSpacing);
	titanium::SetProtoMethod(isolate, t, "getMinHorizontalSpacing", ViewProxy::getMinHorizontalSpacing);
	titanium::SetProtoMethod(isolate, t, "setScrollType", ViewProxy::setScrollType);
	titanium::SetProtoMethod(isolate, t, "getShowHorizontalScrollIndicator", ViewProxy::getShowHorizontalScrollIndicator);
	titanium::SetProtoMethod(isolate, t, "setEditable", ViewProxy::setEditable);
	titanium::SetProtoMethod(isolate, t, "getWobble", ViewProxy::getWobble);
	titanium::SetProtoMethod(isolate, t, "deleteItem", ViewProxy::deleteItem);
	titanium::SetProtoMethod(isolate, t, "scrollToItemAtIndex", ViewProxy::scrollToItemAtIndex);
	titanium::SetProtoMethod(isolate, t, "setColumnCount", ViewProxy::setColumnCount);
	titanium::SetProtoMethod(isolate, t, "getMinVerticalSpacing", ViewProxy::getMinVerticalSpacing);

	Local<ObjectTemplate> prototypeTemplate = t->PrototypeTemplate();
	Local<ObjectTemplate> instanceTemplate = t->InstanceTemplate();

	// Delegate indexed property get and set to the Java proxy.
	instanceTemplate->SetIndexedPropertyHandler(titanium::Proxy::getIndexedProperty,
		titanium::Proxy::setIndexedProperty);

	// Constants --------------------------------------------------------------

	// Dynamic properties -----------------------------------------------------
	instanceTemplate->SetAccessor(
		NEW_SYMBOL(isolate, "data"),
		ViewProxy::getter_data,
		ViewProxy::setter_data,
		Local<Value>(),
		DEFAULT,
		static_cast<v8::PropertyAttribute>(v8::DontDelete)
	);
	instanceTemplate->SetAccessor(
		NEW_SYMBOL(isolate, "pagerEnabled"),
		ViewProxy::getter_pagerEnabled,
		ViewProxy::setter_pagerEnabled,
		Local<Value>(),
		DEFAULT,
		static_cast<v8::PropertyAttribute>(v8::DontDelete)
	);
	instanceTemplate->SetAccessor(
		NEW_SYMBOL(isolate, "dragItemShadowOpacity"),
		ViewProxy::getter_dragItemShadowOpacity,
		ViewProxy::setter_dragItemShadowOpacity,
		Local<Value>(),
		DEFAULT,
		static_cast<v8::PropertyAttribute>(v8::DontDelete)
	);
	instanceTemplate->SetAccessor(
		NEW_SYMBOL(isolate, "disableBounce"),
		ViewProxy::getter_disableBounce,
		ViewProxy::setter_disableBounce,
		Local<Value>(),
		DEFAULT,
		static_cast<v8::PropertyAttribute>(v8::DontDelete)
	);
	instanceTemplate->SetAccessor(
		NEW_SYMBOL(isolate, "refreshControl_"),
		titanium::Proxy::getProperty,
		ViewProxy::setter_refreshControl_,
		Local<Value>(),
		DEFAULT,
		static_cast<v8::PropertyAttribute>(v8::DontDelete)
	);
	instanceTemplate->SetAccessor(
		NEW_SYMBOL(isolate, "verticalSpacing"),
		ViewProxy::getter_verticalSpacing,
		ViewProxy::setter_verticalSpacing,
		Local<Value>(),
		DEFAULT,
		static_cast<v8::PropertyAttribute>(v8::DontDelete)
	);
	instanceTemplate->SetAccessor(
		NEW_SYMBOL(isolate, "wobble"),
		ViewProxy::getter_wobble,
		ViewProxy::setter_wobble,
		Local<Value>(),
		DEFAULT,
		static_cast<v8::PropertyAttribute>(v8::DontDelete)
	);
	instanceTemplate->SetAccessor(
		NEW_SYMBOL(isolate, "waterFallLayout"),
		ViewProxy::getter_waterFallLayout,
		ViewProxy::setter_waterFallLayout,
		Local<Value>(),
		DEFAULT,
		static_cast<v8::PropertyAttribute>(v8::DontDelete)
	);
	instanceTemplate->SetAccessor(
		NEW_SYMBOL(isolate, "scrollEnabled"),
		ViewProxy::getter_scrollEnabled,
		ViewProxy::setter_scrollEnabled,
		Local<Value>(),
		DEFAULT,
		static_cast<v8::PropertyAttribute>(v8::DontDelete)
	);
	instanceTemplate->SetAccessor(
		NEW_SYMBOL(isolate, "itemsBadgeEnabled"),
		ViewProxy::getter_itemsBadgeEnabled,
		ViewProxy::setter_itemsBadgeEnabled,
		Local<Value>(),
		DEFAULT,
		static_cast<v8::PropertyAttribute>(v8::DontDelete)
	);
	instanceTemplate->SetAccessor(
		NEW_SYMBOL(isolate, "minVerticalSpacing"),
		ViewProxy::getter_minVerticalSpacing,
		ViewProxy::setter_minVerticalSpacing,
		Local<Value>(),
		DEFAULT,
		static_cast<v8::PropertyAttribute>(v8::DontDelete)
	);
	instanceTemplate->SetAccessor(
		NEW_SYMBOL(isolate, "scrollType"),
		ViewProxy::getter_scrollType,
		ViewProxy::setter_scrollType,
		Local<Value>(),
		DEFAULT,
		static_cast<v8::PropertyAttribute>(v8::DontDelete)
	);
	instanceTemplate->SetAccessor(
		NEW_SYMBOL(isolate, "horizontalSpacing"),
		ViewProxy::getter_horizontalSpacing,
		ViewProxy::setter_horizontalSpacing,
		Local<Value>(),
		DEFAULT,
		static_cast<v8::PropertyAttribute>(v8::DontDelete)
	);
	instanceTemplate->SetAccessor(
		NEW_SYMBOL(isolate, "scrollIndicatorInsets"),
		titanium::Proxy::getProperty,
		ViewProxy::setter_scrollIndicatorInsets,
		Local<Value>(),
		DEFAULT,
		static_cast<v8::PropertyAttribute>(v8::DontDelete)
	);
	instanceTemplate->SetAccessor(
		NEW_SYMBOL(isolate, "columnWidth"),
		ViewProxy::getter_columnWidth,
		ViewProxy::setter_columnWidth,
		Local<Value>(),
		DEFAULT,
		static_cast<v8::PropertyAttribute>(v8::DontDelete)
	);
	instanceTemplate->SetAccessor(
		NEW_SYMBOL(isolate, "pagingEnabled"),
		ViewProxy::getter_pagingEnabled,
		ViewProxy::setter_pagingEnabled,
		Local<Value>(),
		DEFAULT,
		static_cast<v8::PropertyAttribute>(v8::DontDelete)
	);
	instanceTemplate->SetAccessor(
		NEW_SYMBOL(isolate, "showDeleteButton"),
		ViewProxy::getter_showDeleteButton,
		ViewProxy::setter_showDeleteButton,
		Local<Value>(),
		DEFAULT,
		static_cast<v8::PropertyAttribute>(v8::DontDelete)
	);
	instanceTemplate->SetAccessor(
		NEW_SYMBOL(isolate, "showVerticalScrollIndicator"),
		ViewProxy::getter_showVerticalScrollIndicator,
		ViewProxy::setter_showVerticalScrollIndicator,
		Local<Value>(),
		DEFAULT,
		static_cast<v8::PropertyAttribute>(v8::DontDelete)
	);
	instanceTemplate->SetAccessor(
		NEW_SYMBOL(isolate, "pagerFollowsBottomInset"),
		ViewProxy::getter_pagerFollowsBottomInset,
		ViewProxy::setter_pagerFollowsBottomInset,
		Local<Value>(),
		DEFAULT,
		static_cast<v8::PropertyAttribute>(v8::DontDelete)
	);
	instanceTemplate->SetAccessor(
		NEW_SYMBOL(isolate, "currentPageIndicatorTintColor"),
		ViewProxy::getter_currentPageIndicatorTintColor,
		ViewProxy::setter_currentPageIndicatorTintColor,
		Local<Value>(),
		DEFAULT,
		static_cast<v8::PropertyAttribute>(v8::DontDelete)
	);
	instanceTemplate->SetAccessor(
		NEW_SYMBOL(isolate, "deleteButtonImage"),
		titanium::Proxy::getProperty,
		ViewProxy::setter_deleteButtonImage,
		Local<Value>(),
		DEFAULT,
		static_cast<v8::PropertyAttribute>(v8::DontDelete)
	);
	instanceTemplate->SetAccessor(
		NEW_SYMBOL(isolate, "pageCount"),
		ViewProxy::getter_pageCount,
		titanium::Proxy::onPropertyChanged,
		Local<Value>(),
		DEFAULT,
		static_cast<v8::PropertyAttribute>(v8::ReadOnly | v8::DontDelete)
	);
	instanceTemplate->SetAccessor(
		NEW_SYMBOL(isolate, "editable"),
		ViewProxy::getter_editable,
		ViewProxy::setter_editable,
		Local<Value>(),
		DEFAULT,
		static_cast<v8::PropertyAttribute>(v8::DontDelete)
	);
	instanceTemplate->SetAccessor(
		NEW_SYMBOL(isolate, "contentInsets"),
		titanium::Proxy::getProperty,
		ViewProxy::setter_contentInsets,
		Local<Value>(),
		DEFAULT,
		static_cast<v8::PropertyAttribute>(v8::DontDelete)
	);
	instanceTemplate->SetAccessor(
		NEW_SYMBOL(isolate, "columnCount"),
		titanium::Proxy::getProperty,
		ViewProxy::setter_columnCount,
		Local<Value>(),
		DEFAULT,
		static_cast<v8::PropertyAttribute>(v8::DontDelete)
	);
	instanceTemplate->SetAccessor(
		NEW_SYMBOL(isolate, "minHorizontalSpacing"),
		ViewProxy::getter_minHorizontalSpacing,
		ViewProxy::setter_minHorizontalSpacing,
		Local<Value>(),
		DEFAULT,
		static_cast<v8::PropertyAttribute>(v8::DontDelete)
	);
	instanceTemplate->SetAccessor(
		NEW_SYMBOL(isolate, "lazyLoadingEnabled"),
		ViewProxy::getter_lazyLoadingEnabled,
		ViewProxy::setter_lazyLoadingEnabled,
		Local<Value>(),
		DEFAULT,
		static_cast<v8::PropertyAttribute>(v8::DontDelete)
	);
	instanceTemplate->SetAccessor(
		NEW_SYMBOL(isolate, "scrollToBottomAfterSetData"),
		ViewProxy::getter_scrollToBottomAfterSetData,
		ViewProxy::setter_scrollToBottomAfterSetData,
		Local<Value>(),
		DEFAULT,
		static_cast<v8::PropertyAttribute>(v8::DontDelete)
	);
	instanceTemplate->SetAccessor(
		NEW_SYMBOL(isolate, "layoutManager"),
		ViewProxy::getter_layoutManager,
		titanium::Proxy::onPropertyChanged,
		Local<Value>(),
		DEFAULT,
		static_cast<v8::PropertyAttribute>(v8::ReadOnly | v8::DontDelete)
	);
	instanceTemplate->SetAccessor(
		NEW_SYMBOL(isolate, "showHorizontalScrollIndicator"),
		ViewProxy::getter_showHorizontalScrollIndicator,
		ViewProxy::setter_showHorizontalScrollIndicator,
		Local<Value>(),
		DEFAULT,
		static_cast<v8::PropertyAttribute>(v8::DontDelete)
	);
	instanceTemplate->SetAccessor(
		NEW_SYMBOL(isolate, "currentPage"),
		titanium::Proxy::getProperty,
		ViewProxy::setter_currentPage,
		Local<Value>(),
		DEFAULT,
		static_cast<v8::PropertyAttribute>(v8::DontDelete)
	);
	instanceTemplate->SetAccessor(
		NEW_SYMBOL(isolate, "items"),
		titanium::Proxy::getProperty,
		ViewProxy::setter_items,
		Local<Value>(),
		DEFAULT,
		static_cast<v8::PropertyAttribute>(v8::DontDelete)
	);
	instanceTemplate->SetAccessor(
		NEW_SYMBOL(isolate, "pageIndicatorTintColor"),
		ViewProxy::getter_pageIndicatorTintColor,
		ViewProxy::setter_pageIndicatorTintColor,
		Local<Value>(),
		DEFAULT,
		static_cast<v8::PropertyAttribute>(v8::DontDelete)
	);

	// Accessors --------------------------------------------------------------

	return scope.Escape(t);
}

Local<FunctionTemplate> ViewProxy::getProxyTemplate(v8::Local<v8::Context> context)
{
	return getProxyTemplate(context->GetIsolate());
}

// Methods --------------------------------------------------------------------
void ViewProxy::setDragItemShadowOpacity(const FunctionCallbackInfo<Value>& args)
{
	LOGD(TAG, "setDragItemShadowOpacity()");
	Isolate* isolate = args.GetIsolate();
	Local<Context> context = isolate->GetCurrentContext();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		titanium::JSException::GetJNIEnvironmentError(isolate);
		return;
	}
	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "setDragItemShadowOpacity", "(F)V");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'setDragItemShadowOpacity' with signature '(F)V'";
			LOGE(TAG, error);
				titanium::JSException::Error(isolate, error);
				return;
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		args.GetReturnValue().Set(Undefined(isolate));
		return;
	}

	if (args.Length() < 1) {
		char errorStringBuffer[100];
		sprintf(errorStringBuffer, "setDragItemShadowOpacity: Invalid number of arguments. Expected 1 but got %d", args.Length());
		titanium::JSException::Error(isolate, errorStringBuffer);
		return;
	}

	jvalue jArguments[1];



	
		if ((titanium::V8Util::isNaN(isolate, args[0]) && !args[0]->IsUndefined()) || args[0]->ToString(context).FromMaybe(String::Empty(isolate))->Length() == 0) {
			const char *error = "Invalid value, expected type Number.";
			LOGE(TAG, error);
			titanium::JSException::Error(isolate, error);
			return;
		}
	if (!args[0]->IsNull()) {
		MaybeLocal<Number> arg_0 = args[0]->ToNumber(context);
		if (arg_0.IsEmpty()) {
			const char *error = "Invalid argument at index 0, expected type Number and failed to coerce.";
			LOGE(TAG, error);
			titanium::JSException::Error(isolate, error);
			return;
		} else {
			jArguments[0].f =
				titanium::TypeConverter::jsNumberToJavaFloat(
					env, arg_0.ToLocalChecked());
		}
	} else {
		jArguments[0].f = NULL;
	}

	const char *deprecationMessage = "Setter method deprecated, please use \"obj.dragItemShadowOpacity = val;\" or \"obj['dragItemShadowOpacity'] = val;\" instead.";
	LOGW(TAG, deprecationMessage);

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}
	env->CallVoidMethodA(javaProxy, methodID, jArguments);

	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
	}




	args.GetReturnValue().Set(v8::Undefined(isolate));

}
void ViewProxy::setPageIndicatorTintColor(const FunctionCallbackInfo<Value>& args)
{
	LOGD(TAG, "setPageIndicatorTintColor()");
	Isolate* isolate = args.GetIsolate();
	Local<Context> context = isolate->GetCurrentContext();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		titanium::JSException::GetJNIEnvironmentError(isolate);
		return;
	}
	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "setPageIndicatorTintColor", "(Ljava/lang/String;)V");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'setPageIndicatorTintColor' with signature '(Ljava/lang/String;)V'";
			LOGE(TAG, error);
				titanium::JSException::Error(isolate, error);
				return;
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		args.GetReturnValue().Set(Undefined(isolate));
		return;
	}

	if (args.Length() < 1) {
		char errorStringBuffer[100];
		sprintf(errorStringBuffer, "setPageIndicatorTintColor: Invalid number of arguments. Expected 1 but got %d", args.Length());
		titanium::JSException::Error(isolate, errorStringBuffer);
		return;
	}

	jvalue jArguments[1];



	
	if (!args[0]->IsNull()) {
		Local<Value> arg_0 = args[0];
		jArguments[0].l =
			titanium::TypeConverter::jsValueToJavaString(
				isolate,
				env, arg_0);
	} else {
		jArguments[0].l = NULL;
	}

	const char *deprecationMessage = "Setter method deprecated, please use \"obj.pageIndicatorTintColor = val;\" or \"obj['pageIndicatorTintColor'] = val;\" instead.";
	LOGW(TAG, deprecationMessage);

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}
	env->CallVoidMethodA(javaProxy, methodID, jArguments);

	proxy->unreferenceJavaObject(javaProxy);



				env->DeleteLocalRef(jArguments[0].l);


	if (env->ExceptionCheck()) {
		titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
	}




	args.GetReturnValue().Set(v8::Undefined(isolate));

}
void ViewProxy::getPageCount(const FunctionCallbackInfo<Value>& args)
{
	LOGD(TAG, "getPageCount()");
	Isolate* isolate = args.GetIsolate();
	Local<Context> context = isolate->GetCurrentContext();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		titanium::JSException::GetJNIEnvironmentError(isolate);
		return;
	}
	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "getPageCount", "()I");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'getPageCount' with signature '()I'";
			LOGE(TAG, error);
				titanium::JSException::Error(isolate, error);
				return;
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		args.GetReturnValue().Set(Undefined(isolate));
		return;
	}

	jvalue* jArguments = 0;

	const char *deprecationMessage = "Getter method deprecated, please use \"obj.pageCount;\" or \"obj['pageCount'];\" instead.";
	LOGW(TAG, deprecationMessage);

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}
	jint jResult = (jint)env->CallIntMethodA(javaProxy, methodID, jArguments);


	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		Local<Value> jsException = titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
		return;
	}


	Local<Number> v8Result = titanium::TypeConverter::javaIntToJsNumber(isolate, env, jResult);



	args.GetReturnValue().Set(v8Result);

}
void ViewProxy::setDisableBounce(const FunctionCallbackInfo<Value>& args)
{
	LOGD(TAG, "setDisableBounce()");
	Isolate* isolate = args.GetIsolate();
	Local<Context> context = isolate->GetCurrentContext();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		titanium::JSException::GetJNIEnvironmentError(isolate);
		return;
	}
	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "setDisableBounce", "(Z)V");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'setDisableBounce' with signature '(Z)V'";
			LOGE(TAG, error);
				titanium::JSException::Error(isolate, error);
				return;
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		args.GetReturnValue().Set(Undefined(isolate));
		return;
	}

	if (args.Length() < 1) {
		char errorStringBuffer[100];
		sprintf(errorStringBuffer, "setDisableBounce: Invalid number of arguments. Expected 1 but got %d", args.Length());
		titanium::JSException::Error(isolate, errorStringBuffer);
		return;
	}

	jvalue jArguments[1];



	if (!args[0]->IsBoolean() && !args[0]->IsNull()) {
		const char *error = "Invalid value, expected type Boolean.";
		LOGE(TAG, error);
		titanium::JSException::Error(isolate, error);
		return;
	}
	
		if (!args[0]->IsNull()) {
		Local<Boolean> arg_0 = args[0]->ToBoolean(isolate);
		jArguments[0].z =
			titanium::TypeConverter::jsBooleanToJavaBoolean(
				env, arg_0);
	} else {
		jArguments[0].z = NULL;
	}

	const char *deprecationMessage = "Setter method deprecated, please use \"obj.disableBounce = val;\" or \"obj['disableBounce'] = val;\" instead.";
	LOGW(TAG, deprecationMessage);

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}
	env->CallVoidMethodA(javaProxy, methodID, jArguments);

	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
	}




	args.GetReturnValue().Set(v8::Undefined(isolate));

}
void ViewProxy::getEditable(const FunctionCallbackInfo<Value>& args)
{
	LOGD(TAG, "getEditable()");
	Isolate* isolate = args.GetIsolate();
	Local<Context> context = isolate->GetCurrentContext();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		titanium::JSException::GetJNIEnvironmentError(isolate);
		return;
	}
	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "getEditable", "()Z");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'getEditable' with signature '()Z'";
			LOGE(TAG, error);
				titanium::JSException::Error(isolate, error);
				return;
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		args.GetReturnValue().Set(Undefined(isolate));
		return;
	}

	jvalue* jArguments = 0;

	const char *deprecationMessage = "Getter method deprecated, please use \"obj.editable;\" or \"obj['editable'];\" instead.";
	LOGW(TAG, deprecationMessage);

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}
	jboolean jResult = (jboolean)env->CallBooleanMethodA(javaProxy, methodID, jArguments);


	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		Local<Value> jsException = titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
		return;
	}


	Local<Boolean> v8Result = titanium::TypeConverter::javaBooleanToJsBoolean(isolate, env, jResult);



	args.GetReturnValue().Set(v8Result);

}
void ViewProxy::setRefreshControl_(const FunctionCallbackInfo<Value>& args)
{
	LOGD(TAG, "setRefreshControl_()");
	Isolate* isolate = args.GetIsolate();
	Local<Context> context = isolate->GetCurrentContext();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		titanium::JSException::GetJNIEnvironmentError(isolate);
		return;
	}
	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "setRefreshControl_", "(Ljava/lang/Object;)V");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'setRefreshControl_' with signature '(Ljava/lang/Object;)V'";
			LOGE(TAG, error);
				titanium::JSException::Error(isolate, error);
				return;
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		args.GetReturnValue().Set(Undefined(isolate));
		return;
	}

	if (args.Length() < 1) {
		char errorStringBuffer[100];
		sprintf(errorStringBuffer, "setRefreshControl_: Invalid number of arguments. Expected 1 but got %d", args.Length());
		titanium::JSException::Error(isolate, errorStringBuffer);
		return;
	}

	jvalue jArguments[1];



	bool isNew_0;
	if (!args[0]->IsNull()) {
		Local<Value> arg_0 = args[0];
		jArguments[0].l =
			titanium::TypeConverter::jsValueToJavaObject(
				isolate,
				env, arg_0, &isNew_0);
	} else {
		jArguments[0].l = NULL;
	}

	const char *deprecationMessage = "Setter method deprecated, please use \"obj.refreshControl_ = val;\" or \"obj['refreshControl_'] = val;\" instead.";
	LOGW(TAG, deprecationMessage);

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}
	env->CallVoidMethodA(javaProxy, methodID, jArguments);

	proxy->unreferenceJavaObject(javaProxy);



			if (isNew_0) {
				env->DeleteLocalRef(jArguments[0].l);
			}


	if (env->ExceptionCheck()) {
		titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
	}




	args.GetReturnValue().Set(v8::Undefined(isolate));

}
void ViewProxy::setItemsBadgeEnabled(const FunctionCallbackInfo<Value>& args)
{
	LOGD(TAG, "setItemsBadgeEnabled()");
	Isolate* isolate = args.GetIsolate();
	Local<Context> context = isolate->GetCurrentContext();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		titanium::JSException::GetJNIEnvironmentError(isolate);
		return;
	}
	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "setItemsBadgeEnabled", "(Z)V");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'setItemsBadgeEnabled' with signature '(Z)V'";
			LOGE(TAG, error);
				titanium::JSException::Error(isolate, error);
				return;
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		args.GetReturnValue().Set(Undefined(isolate));
		return;
	}

	if (args.Length() < 1) {
		char errorStringBuffer[100];
		sprintf(errorStringBuffer, "setItemsBadgeEnabled: Invalid number of arguments. Expected 1 but got %d", args.Length());
		titanium::JSException::Error(isolate, errorStringBuffer);
		return;
	}

	jvalue jArguments[1];



	if (!args[0]->IsBoolean() && !args[0]->IsNull()) {
		const char *error = "Invalid value, expected type Boolean.";
		LOGE(TAG, error);
		titanium::JSException::Error(isolate, error);
		return;
	}
	
		if (!args[0]->IsNull()) {
		Local<Boolean> arg_0 = args[0]->ToBoolean(isolate);
		jArguments[0].z =
			titanium::TypeConverter::jsBooleanToJavaBoolean(
				env, arg_0);
	} else {
		jArguments[0].z = NULL;
	}

	const char *deprecationMessage = "Setter method deprecated, please use \"obj.itemsBadgeEnabled = val;\" or \"obj['itemsBadgeEnabled'] = val;\" instead.";
	LOGW(TAG, deprecationMessage);

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}
	env->CallVoidMethodA(javaProxy, methodID, jArguments);

	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
	}




	args.GetReturnValue().Set(v8::Undefined(isolate));

}
void ViewProxy::insertItemAtIndex(const FunctionCallbackInfo<Value>& args)
{
	LOGD(TAG, "insertItemAtIndex()");
	Isolate* isolate = args.GetIsolate();
	Local<Context> context = isolate->GetCurrentContext();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		titanium::JSException::GetJNIEnvironmentError(isolate);
		return;
	}
	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "insertItemAtIndex", "(Lorg/appcelerator/kroll/KrollDict;)V");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'insertItemAtIndex' with signature '(Lorg/appcelerator/kroll/KrollDict;)V'";
			LOGE(TAG, error);
				titanium::JSException::Error(isolate, error);
				return;
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		args.GetReturnValue().Set(Undefined(isolate));
		return;
	}

	if (args.Length() < 1) {
		char errorStringBuffer[100];
		sprintf(errorStringBuffer, "insertItemAtIndex: Invalid number of arguments. Expected 1 but got %d", args.Length());
		titanium::JSException::Error(isolate, errorStringBuffer);
		return;
	}

	jvalue jArguments[1];



	bool isNew_0;
	if (!args[0]->IsNull()) {
		Local<Value> arg_0 = args[0];
		jArguments[0].l =
			titanium::TypeConverter::jsObjectToJavaKrollDict(
				isolate,
				env, arg_0, &isNew_0);
	} else {
		jArguments[0].l = NULL;
	}


	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}
	env->CallVoidMethodA(javaProxy, methodID, jArguments);

	proxy->unreferenceJavaObject(javaProxy);



			if (isNew_0) {
				env->DeleteLocalRef(jArguments[0].l);
			}


	if (env->ExceptionCheck()) {
		titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
	}




	args.GetReturnValue().Set(v8::Undefined(isolate));

}
void ViewProxy::getHorizontalSpacing(const FunctionCallbackInfo<Value>& args)
{
	LOGD(TAG, "getHorizontalSpacing()");
	Isolate* isolate = args.GetIsolate();
	Local<Context> context = isolate->GetCurrentContext();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		titanium::JSException::GetJNIEnvironmentError(isolate);
		return;
	}
	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "getHorizontalSpacing", "()I");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'getHorizontalSpacing' with signature '()I'";
			LOGE(TAG, error);
				titanium::JSException::Error(isolate, error);
				return;
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		args.GetReturnValue().Set(Undefined(isolate));
		return;
	}

	jvalue* jArguments = 0;

	const char *deprecationMessage = "Getter method deprecated, please use \"obj.horizontalSpacing;\" or \"obj['horizontalSpacing'];\" instead.";
	LOGW(TAG, deprecationMessage);

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}
	jint jResult = (jint)env->CallIntMethodA(javaProxy, methodID, jArguments);


	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		Local<Value> jsException = titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
		return;
	}


	Local<Number> v8Result = titanium::TypeConverter::javaIntToJsNumber(isolate, env, jResult);



	args.GetReturnValue().Set(v8Result);

}
void ViewProxy::setPagingEnabled(const FunctionCallbackInfo<Value>& args)
{
	LOGD(TAG, "setPagingEnabled()");
	Isolate* isolate = args.GetIsolate();
	Local<Context> context = isolate->GetCurrentContext();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		titanium::JSException::GetJNIEnvironmentError(isolate);
		return;
	}
	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "setPagingEnabled", "(Z)V");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'setPagingEnabled' with signature '(Z)V'";
			LOGE(TAG, error);
				titanium::JSException::Error(isolate, error);
				return;
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		args.GetReturnValue().Set(Undefined(isolate));
		return;
	}

	if (args.Length() < 1) {
		char errorStringBuffer[100];
		sprintf(errorStringBuffer, "setPagingEnabled: Invalid number of arguments. Expected 1 but got %d", args.Length());
		titanium::JSException::Error(isolate, errorStringBuffer);
		return;
	}

	jvalue jArguments[1];



	if (!args[0]->IsBoolean() && !args[0]->IsNull()) {
		const char *error = "Invalid value, expected type Boolean.";
		LOGE(TAG, error);
		titanium::JSException::Error(isolate, error);
		return;
	}
	
		if (!args[0]->IsNull()) {
		Local<Boolean> arg_0 = args[0]->ToBoolean(isolate);
		jArguments[0].z =
			titanium::TypeConverter::jsBooleanToJavaBoolean(
				env, arg_0);
	} else {
		jArguments[0].z = NULL;
	}

	const char *deprecationMessage = "Setter method deprecated, please use \"obj.pagingEnabled = val;\" or \"obj['pagingEnabled'] = val;\" instead.";
	LOGW(TAG, deprecationMessage);

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}
	env->CallVoidMethodA(javaProxy, methodID, jArguments);

	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
	}




	args.GetReturnValue().Set(v8::Undefined(isolate));

}
void ViewProxy::getScrollToBottomAfterSetData(const FunctionCallbackInfo<Value>& args)
{
	LOGD(TAG, "getScrollToBottomAfterSetData()");
	Isolate* isolate = args.GetIsolate();
	Local<Context> context = isolate->GetCurrentContext();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		titanium::JSException::GetJNIEnvironmentError(isolate);
		return;
	}
	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "getScrollToBottomAfterSetData", "()Z");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'getScrollToBottomAfterSetData' with signature '()Z'";
			LOGE(TAG, error);
				titanium::JSException::Error(isolate, error);
				return;
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		args.GetReturnValue().Set(Undefined(isolate));
		return;
	}

	jvalue* jArguments = 0;

	const char *deprecationMessage = "Getter method deprecated, please use \"obj.scrollToBottomAfterSetData;\" or \"obj['scrollToBottomAfterSetData'];\" instead.";
	LOGW(TAG, deprecationMessage);

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}
	jboolean jResult = (jboolean)env->CallBooleanMethodA(javaProxy, methodID, jArguments);


	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		Local<Value> jsException = titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
		return;
	}


	Local<Boolean> v8Result = titanium::TypeConverter::javaBooleanToJsBoolean(isolate, env, jResult);



	args.GetReturnValue().Set(v8Result);

}
void ViewProxy::getPagerEnabled(const FunctionCallbackInfo<Value>& args)
{
	LOGD(TAG, "getPagerEnabled()");
	Isolate* isolate = args.GetIsolate();
	Local<Context> context = isolate->GetCurrentContext();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		titanium::JSException::GetJNIEnvironmentError(isolate);
		return;
	}
	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "getPagerEnabled", "()Z");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'getPagerEnabled' with signature '()Z'";
			LOGE(TAG, error);
				titanium::JSException::Error(isolate, error);
				return;
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		args.GetReturnValue().Set(Undefined(isolate));
		return;
	}

	jvalue* jArguments = 0;

	const char *deprecationMessage = "Getter method deprecated, please use \"obj.pagerEnabled;\" or \"obj['pagerEnabled'];\" instead.";
	LOGW(TAG, deprecationMessage);

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}
	jboolean jResult = (jboolean)env->CallBooleanMethodA(javaProxy, methodID, jArguments);


	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		Local<Value> jsException = titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
		return;
	}


	Local<Boolean> v8Result = titanium::TypeConverter::javaBooleanToJsBoolean(isolate, env, jResult);



	args.GetReturnValue().Set(v8Result);

}
void ViewProxy::setCurrentPageIndicatorTintColor(const FunctionCallbackInfo<Value>& args)
{
	LOGD(TAG, "setCurrentPageIndicatorTintColor()");
	Isolate* isolate = args.GetIsolate();
	Local<Context> context = isolate->GetCurrentContext();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		titanium::JSException::GetJNIEnvironmentError(isolate);
		return;
	}
	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "setCurrentPageIndicatorTintColor", "(Ljava/lang/String;)V");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'setCurrentPageIndicatorTintColor' with signature '(Ljava/lang/String;)V'";
			LOGE(TAG, error);
				titanium::JSException::Error(isolate, error);
				return;
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		args.GetReturnValue().Set(Undefined(isolate));
		return;
	}

	if (args.Length() < 1) {
		char errorStringBuffer[100];
		sprintf(errorStringBuffer, "setCurrentPageIndicatorTintColor: Invalid number of arguments. Expected 1 but got %d", args.Length());
		titanium::JSException::Error(isolate, errorStringBuffer);
		return;
	}

	jvalue jArguments[1];



	
	if (!args[0]->IsNull()) {
		Local<Value> arg_0 = args[0];
		jArguments[0].l =
			titanium::TypeConverter::jsValueToJavaString(
				isolate,
				env, arg_0);
	} else {
		jArguments[0].l = NULL;
	}

	const char *deprecationMessage = "Setter method deprecated, please use \"obj.currentPageIndicatorTintColor = val;\" or \"obj['currentPageIndicatorTintColor'] = val;\" instead.";
	LOGW(TAG, deprecationMessage);

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}
	env->CallVoidMethodA(javaProxy, methodID, jArguments);

	proxy->unreferenceJavaObject(javaProxy);



				env->DeleteLocalRef(jArguments[0].l);


	if (env->ExceptionCheck()) {
		titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
	}




	args.GetReturnValue().Set(v8::Undefined(isolate));

}
void ViewProxy::setScrollIndicatorInsets(const FunctionCallbackInfo<Value>& args)
{
	LOGD(TAG, "setScrollIndicatorInsets()");
	Isolate* isolate = args.GetIsolate();
	Local<Context> context = isolate->GetCurrentContext();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		titanium::JSException::GetJNIEnvironmentError(isolate);
		return;
	}
	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "setScrollIndicatorInsets", "(Ljava/lang/Object;)V");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'setScrollIndicatorInsets' with signature '(Ljava/lang/Object;)V'";
			LOGE(TAG, error);
				titanium::JSException::Error(isolate, error);
				return;
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		args.GetReturnValue().Set(Undefined(isolate));
		return;
	}

	if (args.Length() < 1) {
		char errorStringBuffer[100];
		sprintf(errorStringBuffer, "setScrollIndicatorInsets: Invalid number of arguments. Expected 1 but got %d", args.Length());
		titanium::JSException::Error(isolate, errorStringBuffer);
		return;
	}

	jvalue jArguments[1];



	bool isNew_0;
	if (!args[0]->IsNull()) {
		Local<Value> arg_0 = args[0];
		jArguments[0].l =
			titanium::TypeConverter::jsValueToJavaObject(
				isolate,
				env, arg_0, &isNew_0);
	} else {
		jArguments[0].l = NULL;
	}

	const char *deprecationMessage = "Setter method deprecated, please use \"obj.scrollIndicatorInsets = val;\" or \"obj['scrollIndicatorInsets'] = val;\" instead.";
	LOGW(TAG, deprecationMessage);

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}
	env->CallVoidMethodA(javaProxy, methodID, jArguments);

	proxy->unreferenceJavaObject(javaProxy);



			if (isNew_0) {
				env->DeleteLocalRef(jArguments[0].l);
			}


	if (env->ExceptionCheck()) {
		titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
	}




	args.GetReturnValue().Set(v8::Undefined(isolate));

}
void ViewProxy::startEditing(const FunctionCallbackInfo<Value>& args)
{
	LOGD(TAG, "startEditing()");
	Isolate* isolate = args.GetIsolate();
	Local<Context> context = isolate->GetCurrentContext();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		titanium::JSException::GetJNIEnvironmentError(isolate);
		return;
	}
	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "startEditing", "()V");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'startEditing' with signature '()V'";
			LOGE(TAG, error);
				titanium::JSException::Error(isolate, error);
				return;
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		args.GetReturnValue().Set(Undefined(isolate));
		return;
	}

	jvalue* jArguments = 0;


	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}
	env->CallVoidMethodA(javaProxy, methodID, jArguments);

	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
	}




	args.GetReturnValue().Set(v8::Undefined(isolate));

}
void ViewProxy::getDragItemShadowOpacity(const FunctionCallbackInfo<Value>& args)
{
	LOGD(TAG, "getDragItemShadowOpacity()");
	Isolate* isolate = args.GetIsolate();
	Local<Context> context = isolate->GetCurrentContext();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		titanium::JSException::GetJNIEnvironmentError(isolate);
		return;
	}
	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "getDragItemShadowOpacity", "()F");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'getDragItemShadowOpacity' with signature '()F'";
			LOGE(TAG, error);
				titanium::JSException::Error(isolate, error);
				return;
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		args.GetReturnValue().Set(Undefined(isolate));
		return;
	}

	jvalue* jArguments = 0;

	const char *deprecationMessage = "Getter method deprecated, please use \"obj.dragItemShadowOpacity;\" or \"obj['dragItemShadowOpacity'];\" instead.";
	LOGW(TAG, deprecationMessage);

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}
	jfloat jResult = (jfloat)env->CallFloatMethodA(javaProxy, methodID, jArguments);


	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		Local<Value> jsException = titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
		return;
	}


	Local<Number> v8Result = titanium::TypeConverter::javaFloatToJsNumber(isolate, env, jResult);



	args.GetReturnValue().Set(v8Result);

}
void ViewProxy::setScrollToBottomAfterSetData(const FunctionCallbackInfo<Value>& args)
{
	LOGD(TAG, "setScrollToBottomAfterSetData()");
	Isolate* isolate = args.GetIsolate();
	Local<Context> context = isolate->GetCurrentContext();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		titanium::JSException::GetJNIEnvironmentError(isolate);
		return;
	}
	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "setScrollToBottomAfterSetData", "(Z)V");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'setScrollToBottomAfterSetData' with signature '(Z)V'";
			LOGE(TAG, error);
				titanium::JSException::Error(isolate, error);
				return;
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		args.GetReturnValue().Set(Undefined(isolate));
		return;
	}

	if (args.Length() < 1) {
		char errorStringBuffer[100];
		sprintf(errorStringBuffer, "setScrollToBottomAfterSetData: Invalid number of arguments. Expected 1 but got %d", args.Length());
		titanium::JSException::Error(isolate, errorStringBuffer);
		return;
	}

	jvalue jArguments[1];



	if (!args[0]->IsBoolean() && !args[0]->IsNull()) {
		const char *error = "Invalid value, expected type Boolean.";
		LOGE(TAG, error);
		titanium::JSException::Error(isolate, error);
		return;
	}
	
		if (!args[0]->IsNull()) {
		Local<Boolean> arg_0 = args[0]->ToBoolean(isolate);
		jArguments[0].z =
			titanium::TypeConverter::jsBooleanToJavaBoolean(
				env, arg_0);
	} else {
		jArguments[0].z = NULL;
	}

	const char *deprecationMessage = "Setter method deprecated, please use \"obj.scrollToBottomAfterSetData = val;\" or \"obj['scrollToBottomAfterSetData'] = val;\" instead.";
	LOGW(TAG, deprecationMessage);

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}
	env->CallVoidMethodA(javaProxy, methodID, jArguments);

	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
	}




	args.GetReturnValue().Set(v8::Undefined(isolate));

}
void ViewProxy::setLazyLoadingEnabled(const FunctionCallbackInfo<Value>& args)
{
	LOGD(TAG, "setLazyLoadingEnabled()");
	Isolate* isolate = args.GetIsolate();
	Local<Context> context = isolate->GetCurrentContext();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		titanium::JSException::GetJNIEnvironmentError(isolate);
		return;
	}
	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "setLazyLoadingEnabled", "(Z)V");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'setLazyLoadingEnabled' with signature '(Z)V'";
			LOGE(TAG, error);
				titanium::JSException::Error(isolate, error);
				return;
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		args.GetReturnValue().Set(Undefined(isolate));
		return;
	}

	if (args.Length() < 1) {
		char errorStringBuffer[100];
		sprintf(errorStringBuffer, "setLazyLoadingEnabled: Invalid number of arguments. Expected 1 but got %d", args.Length());
		titanium::JSException::Error(isolate, errorStringBuffer);
		return;
	}

	jvalue jArguments[1];



	if (!args[0]->IsBoolean() && !args[0]->IsNull()) {
		const char *error = "Invalid value, expected type Boolean.";
		LOGE(TAG, error);
		titanium::JSException::Error(isolate, error);
		return;
	}
	
		if (!args[0]->IsNull()) {
		Local<Boolean> arg_0 = args[0]->ToBoolean(isolate);
		jArguments[0].z =
			titanium::TypeConverter::jsBooleanToJavaBoolean(
				env, arg_0);
	} else {
		jArguments[0].z = NULL;
	}

	const char *deprecationMessage = "Setter method deprecated, please use \"obj.lazyLoadingEnabled = val;\" or \"obj['lazyLoadingEnabled'] = val;\" instead.";
	LOGW(TAG, deprecationMessage);

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}
	env->CallVoidMethodA(javaProxy, methodID, jArguments);

	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
	}




	args.GetReturnValue().Set(v8::Undefined(isolate));

}
void ViewProxy::getScrollType(const FunctionCallbackInfo<Value>& args)
{
	LOGD(TAG, "getScrollType()");
	Isolate* isolate = args.GetIsolate();
	Local<Context> context = isolate->GetCurrentContext();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		titanium::JSException::GetJNIEnvironmentError(isolate);
		return;
	}
	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "getScrollType", "()Ljava/lang/String;");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'getScrollType' with signature '()Ljava/lang/String;'";
			LOGE(TAG, error);
				titanium::JSException::Error(isolate, error);
				return;
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		args.GetReturnValue().Set(Undefined(isolate));
		return;
	}

	jvalue* jArguments = 0;

	const char *deprecationMessage = "Getter method deprecated, please use \"obj.scrollType;\" or \"obj['scrollType'];\" instead.";
	LOGW(TAG, deprecationMessage);

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}
	jstring jResult = (jstring)env->CallObjectMethodA(javaProxy, methodID, jArguments);


	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		Local<Value> jsException = titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
		return;
	}

	if (jResult == NULL) {
		args.GetReturnValue().Set(Null(isolate));
		return;
	}

	Local<Value> v8Result = titanium::TypeConverter::javaStringToJsString(isolate, env, jResult);

	env->DeleteLocalRef(jResult);


	args.GetReturnValue().Set(v8Result);

}
void ViewProxy::getDisableBounce(const FunctionCallbackInfo<Value>& args)
{
	LOGD(TAG, "getDisableBounce()");
	Isolate* isolate = args.GetIsolate();
	Local<Context> context = isolate->GetCurrentContext();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		titanium::JSException::GetJNIEnvironmentError(isolate);
		return;
	}
	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "getDisableBounce", "()Z");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'getDisableBounce' with signature '()Z'";
			LOGE(TAG, error);
				titanium::JSException::Error(isolate, error);
				return;
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		args.GetReturnValue().Set(Undefined(isolate));
		return;
	}

	jvalue* jArguments = 0;

	const char *deprecationMessage = "Getter method deprecated, please use \"obj.disableBounce;\" or \"obj['disableBounce'];\" instead.";
	LOGW(TAG, deprecationMessage);

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}
	jboolean jResult = (jboolean)env->CallBooleanMethodA(javaProxy, methodID, jArguments);


	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		Local<Value> jsException = titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
		return;
	}


	Local<Boolean> v8Result = titanium::TypeConverter::javaBooleanToJsBoolean(isolate, env, jResult);



	args.GetReturnValue().Set(v8Result);

}
void ViewProxy::setShowVerticalScrollIndicator(const FunctionCallbackInfo<Value>& args)
{
	LOGD(TAG, "setShowVerticalScrollIndicator()");
	Isolate* isolate = args.GetIsolate();
	Local<Context> context = isolate->GetCurrentContext();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		titanium::JSException::GetJNIEnvironmentError(isolate);
		return;
	}
	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "setShowVerticalScrollIndicator", "(Z)V");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'setShowVerticalScrollIndicator' with signature '(Z)V'";
			LOGE(TAG, error);
				titanium::JSException::Error(isolate, error);
				return;
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		args.GetReturnValue().Set(Undefined(isolate));
		return;
	}

	if (args.Length() < 1) {
		char errorStringBuffer[100];
		sprintf(errorStringBuffer, "setShowVerticalScrollIndicator: Invalid number of arguments. Expected 1 but got %d", args.Length());
		titanium::JSException::Error(isolate, errorStringBuffer);
		return;
	}

	jvalue jArguments[1];



	if (!args[0]->IsBoolean() && !args[0]->IsNull()) {
		const char *error = "Invalid value, expected type Boolean.";
		LOGE(TAG, error);
		titanium::JSException::Error(isolate, error);
		return;
	}
	
		if (!args[0]->IsNull()) {
		Local<Boolean> arg_0 = args[0]->ToBoolean(isolate);
		jArguments[0].z =
			titanium::TypeConverter::jsBooleanToJavaBoolean(
				env, arg_0);
	} else {
		jArguments[0].z = NULL;
	}

	const char *deprecationMessage = "Setter method deprecated, please use \"obj.showVerticalScrollIndicator = val;\" or \"obj['showVerticalScrollIndicator'] = val;\" instead.";
	LOGW(TAG, deprecationMessage);

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}
	env->CallVoidMethodA(javaProxy, methodID, jArguments);

	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
	}




	args.GetReturnValue().Set(v8::Undefined(isolate));

}
void ViewProxy::getPagingEnabled(const FunctionCallbackInfo<Value>& args)
{
	LOGD(TAG, "getPagingEnabled()");
	Isolate* isolate = args.GetIsolate();
	Local<Context> context = isolate->GetCurrentContext();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		titanium::JSException::GetJNIEnvironmentError(isolate);
		return;
	}
	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "getPagingEnabled", "()Z");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'getPagingEnabled' with signature '()Z'";
			LOGE(TAG, error);
				titanium::JSException::Error(isolate, error);
				return;
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		args.GetReturnValue().Set(Undefined(isolate));
		return;
	}

	jvalue* jArguments = 0;

	const char *deprecationMessage = "Getter method deprecated, please use \"obj.pagingEnabled;\" or \"obj['pagingEnabled'];\" instead.";
	LOGW(TAG, deprecationMessage);

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}
	jboolean jResult = (jboolean)env->CallBooleanMethodA(javaProxy, methodID, jArguments);


	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		Local<Value> jsException = titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
		return;
	}


	Local<Boolean> v8Result = titanium::TypeConverter::javaBooleanToJsBoolean(isolate, env, jResult);



	args.GetReturnValue().Set(v8Result);

}
void ViewProxy::setWobble(const FunctionCallbackInfo<Value>& args)
{
	LOGD(TAG, "setWobble()");
	Isolate* isolate = args.GetIsolate();
	Local<Context> context = isolate->GetCurrentContext();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		titanium::JSException::GetJNIEnvironmentError(isolate);
		return;
	}
	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "setWobble", "(Z)V");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'setWobble' with signature '(Z)V'";
			LOGE(TAG, error);
				titanium::JSException::Error(isolate, error);
				return;
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		args.GetReturnValue().Set(Undefined(isolate));
		return;
	}

	if (args.Length() < 1) {
		char errorStringBuffer[100];
		sprintf(errorStringBuffer, "setWobble: Invalid number of arguments. Expected 1 but got %d", args.Length());
		titanium::JSException::Error(isolate, errorStringBuffer);
		return;
	}

	jvalue jArguments[1];



	if (!args[0]->IsBoolean() && !args[0]->IsNull()) {
		const char *error = "Invalid value, expected type Boolean.";
		LOGE(TAG, error);
		titanium::JSException::Error(isolate, error);
		return;
	}
	
		if (!args[0]->IsNull()) {
		Local<Boolean> arg_0 = args[0]->ToBoolean(isolate);
		jArguments[0].z =
			titanium::TypeConverter::jsBooleanToJavaBoolean(
				env, arg_0);
	} else {
		jArguments[0].z = NULL;
	}

	const char *deprecationMessage = "Setter method deprecated, please use \"obj.wobble = val;\" or \"obj['wobble'] = val;\" instead.";
	LOGW(TAG, deprecationMessage);

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}
	env->CallVoidMethodA(javaProxy, methodID, jArguments);

	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
	}




	args.GetReturnValue().Set(v8::Undefined(isolate));

}
void ViewProxy::setVerticalSpacing(const FunctionCallbackInfo<Value>& args)
{
	LOGD(TAG, "setVerticalSpacing()");
	Isolate* isolate = args.GetIsolate();
	Local<Context> context = isolate->GetCurrentContext();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		titanium::JSException::GetJNIEnvironmentError(isolate);
		return;
	}
	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "setVerticalSpacing", "(I)V");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'setVerticalSpacing' with signature '(I)V'";
			LOGE(TAG, error);
				titanium::JSException::Error(isolate, error);
				return;
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		args.GetReturnValue().Set(Undefined(isolate));
		return;
	}

	if (args.Length() < 1) {
		char errorStringBuffer[100];
		sprintf(errorStringBuffer, "setVerticalSpacing: Invalid number of arguments. Expected 1 but got %d", args.Length());
		titanium::JSException::Error(isolate, errorStringBuffer);
		return;
	}

	jvalue jArguments[1];



	
		if ((titanium::V8Util::isNaN(isolate, args[0]) && !args[0]->IsUndefined()) || args[0]->ToString(context).FromMaybe(String::Empty(isolate))->Length() == 0) {
			const char *error = "Invalid value, expected type Number.";
			LOGE(TAG, error);
			titanium::JSException::Error(isolate, error);
			return;
		}
	if (!args[0]->IsNull()) {
		MaybeLocal<Number> arg_0 = args[0]->ToNumber(context);
		if (arg_0.IsEmpty()) {
			const char *error = "Invalid argument at index 0, expected type Number and failed to coerce.";
			LOGE(TAG, error);
			titanium::JSException::Error(isolate, error);
			return;
		} else {
			jArguments[0].i =
				titanium::TypeConverter::jsNumberToJavaInt(
					env, arg_0.ToLocalChecked());
		}
	} else {
		jArguments[0].i = NULL;
	}

	const char *deprecationMessage = "Setter method deprecated, please use \"obj.verticalSpacing = val;\" or \"obj['verticalSpacing'] = val;\" instead.";
	LOGW(TAG, deprecationMessage);

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}
	env->CallVoidMethodA(javaProxy, methodID, jArguments);

	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
	}




	args.GetReturnValue().Set(v8::Undefined(isolate));

}
void ViewProxy::setPagerEnabled(const FunctionCallbackInfo<Value>& args)
{
	LOGD(TAG, "setPagerEnabled()");
	Isolate* isolate = args.GetIsolate();
	Local<Context> context = isolate->GetCurrentContext();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		titanium::JSException::GetJNIEnvironmentError(isolate);
		return;
	}
	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "setPagerEnabled", "(Z)V");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'setPagerEnabled' with signature '(Z)V'";
			LOGE(TAG, error);
				titanium::JSException::Error(isolate, error);
				return;
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		args.GetReturnValue().Set(Undefined(isolate));
		return;
	}

	if (args.Length() < 1) {
		char errorStringBuffer[100];
		sprintf(errorStringBuffer, "setPagerEnabled: Invalid number of arguments. Expected 1 but got %d", args.Length());
		titanium::JSException::Error(isolate, errorStringBuffer);
		return;
	}

	jvalue jArguments[1];



	if (!args[0]->IsBoolean() && !args[0]->IsNull()) {
		const char *error = "Invalid value, expected type Boolean.";
		LOGE(TAG, error);
		titanium::JSException::Error(isolate, error);
		return;
	}
	
		if (!args[0]->IsNull()) {
		Local<Boolean> arg_0 = args[0]->ToBoolean(isolate);
		jArguments[0].z =
			titanium::TypeConverter::jsBooleanToJavaBoolean(
				env, arg_0);
	} else {
		jArguments[0].z = NULL;
	}

	const char *deprecationMessage = "Setter method deprecated, please use \"obj.pagerEnabled = val;\" or \"obj['pagerEnabled'] = val;\" instead.";
	LOGW(TAG, deprecationMessage);

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}
	env->CallVoidMethodA(javaProxy, methodID, jArguments);

	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
	}




	args.GetReturnValue().Set(v8::Undefined(isolate));

}
void ViewProxy::createItem(const FunctionCallbackInfo<Value>& args)
{
	LOGD(TAG, "createItem()");
	Isolate* isolate = args.GetIsolate();
	Local<Context> context = isolate->GetCurrentContext();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		titanium::JSException::GetJNIEnvironmentError(isolate);
		return;
	}
	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "createItem", "(Lorg/appcelerator/kroll/KrollDict;)Ljava/util/HashMap<java/lang/String,java/lang/Object>;");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'createItem' with signature '(Lorg/appcelerator/kroll/KrollDict;)Ljava/util/HashMap<java/lang/String,java/lang/Object>;'";
			LOGE(TAG, error);
				titanium::JSException::Error(isolate, error);
				return;
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		args.GetReturnValue().Set(Undefined(isolate));
		return;
	}

	if (args.Length() < 1) {
		char errorStringBuffer[100];
		sprintf(errorStringBuffer, "createItem: Invalid number of arguments. Expected 1 but got %d", args.Length());
		titanium::JSException::Error(isolate, errorStringBuffer);
		return;
	}

	jvalue jArguments[1];



	bool isNew_0;
	if (!args[0]->IsNull()) {
		Local<Value> arg_0 = args[0];
		jArguments[0].l =
			titanium::TypeConverter::jsObjectToJavaKrollDict(
				isolate,
				env, arg_0, &isNew_0);
	} else {
		jArguments[0].l = NULL;
	}


	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}
	jobject jResult = (jobject)env->CallObjectMethodA(javaProxy, methodID, jArguments);


	proxy->unreferenceJavaObject(javaProxy);



			if (isNew_0) {
				env->DeleteLocalRef(jArguments[0].l);
			}


	if (env->ExceptionCheck()) {
		Local<Value> jsException = titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
		return;
	}

	if (jResult == NULL) {
		args.GetReturnValue().Set(Null(isolate));
		return;
	}

	Local<Value> v8Result = titanium::TypeConverter::javaObjectToJsValue(isolate, env, jResult);

	env->DeleteLocalRef(jResult);


	args.GetReturnValue().Set(v8Result);

}
void ViewProxy::getPageIndicatorTintColor(const FunctionCallbackInfo<Value>& args)
{
	LOGD(TAG, "getPageIndicatorTintColor()");
	Isolate* isolate = args.GetIsolate();
	Local<Context> context = isolate->GetCurrentContext();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		titanium::JSException::GetJNIEnvironmentError(isolate);
		return;
	}
	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "getPageIndicatorTintColor", "()Ljava/lang/String;");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'getPageIndicatorTintColor' with signature '()Ljava/lang/String;'";
			LOGE(TAG, error);
				titanium::JSException::Error(isolate, error);
				return;
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		args.GetReturnValue().Set(Undefined(isolate));
		return;
	}

	jvalue* jArguments = 0;

	const char *deprecationMessage = "Getter method deprecated, please use \"obj.pageIndicatorTintColor;\" or \"obj['pageIndicatorTintColor'];\" instead.";
	LOGW(TAG, deprecationMessage);

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}
	jstring jResult = (jstring)env->CallObjectMethodA(javaProxy, methodID, jArguments);


	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		Local<Value> jsException = titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
		return;
	}

	if (jResult == NULL) {
		args.GetReturnValue().Set(Null(isolate));
		return;
	}

	Local<Value> v8Result = titanium::TypeConverter::javaStringToJsString(isolate, env, jResult);

	env->DeleteLocalRef(jResult);


	args.GetReturnValue().Set(v8Result);

}
void ViewProxy::getScrollEnabled(const FunctionCallbackInfo<Value>& args)
{
	LOGD(TAG, "getScrollEnabled()");
	Isolate* isolate = args.GetIsolate();
	Local<Context> context = isolate->GetCurrentContext();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		titanium::JSException::GetJNIEnvironmentError(isolate);
		return;
	}
	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "getScrollEnabled", "()Z");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'getScrollEnabled' with signature '()Z'";
			LOGE(TAG, error);
				titanium::JSException::Error(isolate, error);
				return;
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		args.GetReturnValue().Set(Undefined(isolate));
		return;
	}

	jvalue* jArguments = 0;

	const char *deprecationMessage = "Getter method deprecated, please use \"obj.scrollEnabled;\" or \"obj['scrollEnabled'];\" instead.";
	LOGW(TAG, deprecationMessage);

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}
	jboolean jResult = (jboolean)env->CallBooleanMethodA(javaProxy, methodID, jArguments);


	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		Local<Value> jsException = titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
		return;
	}


	Local<Boolean> v8Result = titanium::TypeConverter::javaBooleanToJsBoolean(isolate, env, jResult);



	args.GetReturnValue().Set(v8Result);

}
void ViewProxy::getShowVerticalScrollIndicator(const FunctionCallbackInfo<Value>& args)
{
	LOGD(TAG, "getShowVerticalScrollIndicator()");
	Isolate* isolate = args.GetIsolate();
	Local<Context> context = isolate->GetCurrentContext();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		titanium::JSException::GetJNIEnvironmentError(isolate);
		return;
	}
	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "getShowVerticalScrollIndicator", "()Z");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'getShowVerticalScrollIndicator' with signature '()Z'";
			LOGE(TAG, error);
				titanium::JSException::Error(isolate, error);
				return;
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		args.GetReturnValue().Set(Undefined(isolate));
		return;
	}

	jvalue* jArguments = 0;

	const char *deprecationMessage = "Getter method deprecated, please use \"obj.showVerticalScrollIndicator;\" or \"obj['showVerticalScrollIndicator'];\" instead.";
	LOGW(TAG, deprecationMessage);

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}
	jboolean jResult = (jboolean)env->CallBooleanMethodA(javaProxy, methodID, jArguments);


	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		Local<Value> jsException = titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
		return;
	}


	Local<Boolean> v8Result = titanium::TypeConverter::javaBooleanToJsBoolean(isolate, env, jResult);



	args.GetReturnValue().Set(v8Result);

}
void ViewProxy::setShowDeleteButton(const FunctionCallbackInfo<Value>& args)
{
	LOGD(TAG, "setShowDeleteButton()");
	Isolate* isolate = args.GetIsolate();
	Local<Context> context = isolate->GetCurrentContext();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		titanium::JSException::GetJNIEnvironmentError(isolate);
		return;
	}
	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "setShowDeleteButton", "(Z)V");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'setShowDeleteButton' with signature '(Z)V'";
			LOGE(TAG, error);
				titanium::JSException::Error(isolate, error);
				return;
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		args.GetReturnValue().Set(Undefined(isolate));
		return;
	}

	if (args.Length() < 1) {
		char errorStringBuffer[100];
		sprintf(errorStringBuffer, "setShowDeleteButton: Invalid number of arguments. Expected 1 but got %d", args.Length());
		titanium::JSException::Error(isolate, errorStringBuffer);
		return;
	}

	jvalue jArguments[1];



	if (!args[0]->IsBoolean() && !args[0]->IsNull()) {
		const char *error = "Invalid value, expected type Boolean.";
		LOGE(TAG, error);
		titanium::JSException::Error(isolate, error);
		return;
	}
	
		if (!args[0]->IsNull()) {
		Local<Boolean> arg_0 = args[0]->ToBoolean(isolate);
		jArguments[0].z =
			titanium::TypeConverter::jsBooleanToJavaBoolean(
				env, arg_0);
	} else {
		jArguments[0].z = NULL;
	}

	const char *deprecationMessage = "Setter method deprecated, please use \"obj.showDeleteButton = val;\" or \"obj['showDeleteButton'] = val;\" instead.";
	LOGW(TAG, deprecationMessage);

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}
	env->CallVoidMethodA(javaProxy, methodID, jArguments);

	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
	}




	args.GetReturnValue().Set(v8::Undefined(isolate));

}
void ViewProxy::getColumnWidth(const FunctionCallbackInfo<Value>& args)
{
	LOGD(TAG, "getColumnWidth()");
	Isolate* isolate = args.GetIsolate();
	Local<Context> context = isolate->GetCurrentContext();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		titanium::JSException::GetJNIEnvironmentError(isolate);
		return;
	}
	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "getColumnWidth", "()I");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'getColumnWidth' with signature '()I'";
			LOGE(TAG, error);
				titanium::JSException::Error(isolate, error);
				return;
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		args.GetReturnValue().Set(Undefined(isolate));
		return;
	}

	jvalue* jArguments = 0;

	const char *deprecationMessage = "Getter method deprecated, please use \"obj.columnWidth;\" or \"obj['columnWidth'];\" instead.";
	LOGW(TAG, deprecationMessage);

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}
	jint jResult = (jint)env->CallIntMethodA(javaProxy, methodID, jArguments);


	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		Local<Value> jsException = titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
		return;
	}


	Local<Number> v8Result = titanium::TypeConverter::javaIntToJsNumber(isolate, env, jResult);



	args.GetReturnValue().Set(v8Result);

}
void ViewProxy::setShowHorizontalScrollIndicator(const FunctionCallbackInfo<Value>& args)
{
	LOGD(TAG, "setShowHorizontalScrollIndicator()");
	Isolate* isolate = args.GetIsolate();
	Local<Context> context = isolate->GetCurrentContext();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		titanium::JSException::GetJNIEnvironmentError(isolate);
		return;
	}
	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "setShowHorizontalScrollIndicator", "(Z)V");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'setShowHorizontalScrollIndicator' with signature '(Z)V'";
			LOGE(TAG, error);
				titanium::JSException::Error(isolate, error);
				return;
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		args.GetReturnValue().Set(Undefined(isolate));
		return;
	}

	if (args.Length() < 1) {
		char errorStringBuffer[100];
		sprintf(errorStringBuffer, "setShowHorizontalScrollIndicator: Invalid number of arguments. Expected 1 but got %d", args.Length());
		titanium::JSException::Error(isolate, errorStringBuffer);
		return;
	}

	jvalue jArguments[1];



	if (!args[0]->IsBoolean() && !args[0]->IsNull()) {
		const char *error = "Invalid value, expected type Boolean.";
		LOGE(TAG, error);
		titanium::JSException::Error(isolate, error);
		return;
	}
	
		if (!args[0]->IsNull()) {
		Local<Boolean> arg_0 = args[0]->ToBoolean(isolate);
		jArguments[0].z =
			titanium::TypeConverter::jsBooleanToJavaBoolean(
				env, arg_0);
	} else {
		jArguments[0].z = NULL;
	}

	const char *deprecationMessage = "Setter method deprecated, please use \"obj.showHorizontalScrollIndicator = val;\" or \"obj['showHorizontalScrollIndicator'] = val;\" instead.";
	LOGW(TAG, deprecationMessage);

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}
	env->CallVoidMethodA(javaProxy, methodID, jArguments);

	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
	}




	args.GetReturnValue().Set(v8::Undefined(isolate));

}
void ViewProxy::notifyItemsReordered(const FunctionCallbackInfo<Value>& args)
{
	LOGD(TAG, "notifyItemsReordered()");
	Isolate* isolate = args.GetIsolate();
	Local<Context> context = isolate->GetCurrentContext();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		titanium::JSException::GetJNIEnvironmentError(isolate);
		return;
	}
	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "notifyItemsReordered", "()V");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'notifyItemsReordered' with signature '()V'";
			LOGE(TAG, error);
				titanium::JSException::Error(isolate, error);
				return;
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		args.GetReturnValue().Set(Undefined(isolate));
		return;
	}

	jvalue* jArguments = 0;


	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}
	env->CallVoidMethodA(javaProxy, methodID, jArguments);

	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
	}




	args.GetReturnValue().Set(v8::Undefined(isolate));

}
void ViewProxy::deleteItemAtIndex(const FunctionCallbackInfo<Value>& args)
{
	LOGD(TAG, "deleteItemAtIndex()");
	Isolate* isolate = args.GetIsolate();
	Local<Context> context = isolate->GetCurrentContext();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		titanium::JSException::GetJNIEnvironmentError(isolate);
		return;
	}
	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "deleteItemAtIndex", "(Ljava/lang/Object;)V");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'deleteItemAtIndex' with signature '(Ljava/lang/Object;)V'";
			LOGE(TAG, error);
				titanium::JSException::Error(isolate, error);
				return;
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		args.GetReturnValue().Set(Undefined(isolate));
		return;
	}

	if (args.Length() < 1) {
		char errorStringBuffer[100];
		sprintf(errorStringBuffer, "deleteItemAtIndex: Invalid number of arguments. Expected 1 but got %d", args.Length());
		titanium::JSException::Error(isolate, errorStringBuffer);
		return;
	}

	jvalue jArguments[1];



	bool isNew_0;
	if (!args[0]->IsNull()) {
		Local<Value> arg_0 = args[0];
		jArguments[0].l =
			titanium::TypeConverter::jsValueToJavaObject(
				isolate,
				env, arg_0, &isNew_0);
	} else {
		jArguments[0].l = NULL;
	}


	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}
	env->CallVoidMethodA(javaProxy, methodID, jArguments);

	proxy->unreferenceJavaObject(javaProxy);



			if (isNew_0) {
				env->DeleteLocalRef(jArguments[0].l);
			}


	if (env->ExceptionCheck()) {
		titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
	}




	args.GetReturnValue().Set(v8::Undefined(isolate));

}
void ViewProxy::setColumnWidth(const FunctionCallbackInfo<Value>& args)
{
	LOGD(TAG, "setColumnWidth()");
	Isolate* isolate = args.GetIsolate();
	Local<Context> context = isolate->GetCurrentContext();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		titanium::JSException::GetJNIEnvironmentError(isolate);
		return;
	}
	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "setColumnWidth", "(I)V");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'setColumnWidth' with signature '(I)V'";
			LOGE(TAG, error);
				titanium::JSException::Error(isolate, error);
				return;
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		args.GetReturnValue().Set(Undefined(isolate));
		return;
	}

	if (args.Length() < 1) {
		char errorStringBuffer[100];
		sprintf(errorStringBuffer, "setColumnWidth: Invalid number of arguments. Expected 1 but got %d", args.Length());
		titanium::JSException::Error(isolate, errorStringBuffer);
		return;
	}

	jvalue jArguments[1];



	
		if ((titanium::V8Util::isNaN(isolate, args[0]) && !args[0]->IsUndefined()) || args[0]->ToString(context).FromMaybe(String::Empty(isolate))->Length() == 0) {
			const char *error = "Invalid value, expected type Number.";
			LOGE(TAG, error);
			titanium::JSException::Error(isolate, error);
			return;
		}
	if (!args[0]->IsNull()) {
		MaybeLocal<Number> arg_0 = args[0]->ToNumber(context);
		if (arg_0.IsEmpty()) {
			const char *error = "Invalid argument at index 0, expected type Number and failed to coerce.";
			LOGE(TAG, error);
			titanium::JSException::Error(isolate, error);
			return;
		} else {
			jArguments[0].i =
				titanium::TypeConverter::jsNumberToJavaInt(
					env, arg_0.ToLocalChecked());
		}
	} else {
		jArguments[0].i = NULL;
	}

	const char *deprecationMessage = "Setter method deprecated, please use \"obj.columnWidth = val;\" or \"obj['columnWidth'] = val;\" instead.";
	LOGW(TAG, deprecationMessage);

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}
	env->CallVoidMethodA(javaProxy, methodID, jArguments);

	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
	}




	args.GetReturnValue().Set(v8::Undefined(isolate));

}
void ViewProxy::setMinHorizontalSpacing(const FunctionCallbackInfo<Value>& args)
{
	LOGD(TAG, "setMinHorizontalSpacing()");
	Isolate* isolate = args.GetIsolate();
	Local<Context> context = isolate->GetCurrentContext();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		titanium::JSException::GetJNIEnvironmentError(isolate);
		return;
	}
	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "setMinHorizontalSpacing", "(I)V");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'setMinHorizontalSpacing' with signature '(I)V'";
			LOGE(TAG, error);
				titanium::JSException::Error(isolate, error);
				return;
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		args.GetReturnValue().Set(Undefined(isolate));
		return;
	}

	if (args.Length() < 1) {
		char errorStringBuffer[100];
		sprintf(errorStringBuffer, "setMinHorizontalSpacing: Invalid number of arguments. Expected 1 but got %d", args.Length());
		titanium::JSException::Error(isolate, errorStringBuffer);
		return;
	}

	jvalue jArguments[1];



	
		if ((titanium::V8Util::isNaN(isolate, args[0]) && !args[0]->IsUndefined()) || args[0]->ToString(context).FromMaybe(String::Empty(isolate))->Length() == 0) {
			const char *error = "Invalid value, expected type Number.";
			LOGE(TAG, error);
			titanium::JSException::Error(isolate, error);
			return;
		}
	if (!args[0]->IsNull()) {
		MaybeLocal<Number> arg_0 = args[0]->ToNumber(context);
		if (arg_0.IsEmpty()) {
			const char *error = "Invalid argument at index 0, expected type Number and failed to coerce.";
			LOGE(TAG, error);
			titanium::JSException::Error(isolate, error);
			return;
		} else {
			jArguments[0].i =
				titanium::TypeConverter::jsNumberToJavaInt(
					env, arg_0.ToLocalChecked());
		}
	} else {
		jArguments[0].i = NULL;
	}

	const char *deprecationMessage = "Setter method deprecated, please use \"obj.minHorizontalSpacing = val;\" or \"obj['minHorizontalSpacing'] = val;\" instead.";
	LOGW(TAG, deprecationMessage);

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}
	env->CallVoidMethodA(javaProxy, methodID, jArguments);

	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
	}




	args.GetReturnValue().Set(v8::Undefined(isolate));

}
void ViewProxy::setMinVerticalSpacing(const FunctionCallbackInfo<Value>& args)
{
	LOGD(TAG, "setMinVerticalSpacing()");
	Isolate* isolate = args.GetIsolate();
	Local<Context> context = isolate->GetCurrentContext();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		titanium::JSException::GetJNIEnvironmentError(isolate);
		return;
	}
	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "setMinVerticalSpacing", "(I)V");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'setMinVerticalSpacing' with signature '(I)V'";
			LOGE(TAG, error);
				titanium::JSException::Error(isolate, error);
				return;
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		args.GetReturnValue().Set(Undefined(isolate));
		return;
	}

	if (args.Length() < 1) {
		char errorStringBuffer[100];
		sprintf(errorStringBuffer, "setMinVerticalSpacing: Invalid number of arguments. Expected 1 but got %d", args.Length());
		titanium::JSException::Error(isolate, errorStringBuffer);
		return;
	}

	jvalue jArguments[1];



	
		if ((titanium::V8Util::isNaN(isolate, args[0]) && !args[0]->IsUndefined()) || args[0]->ToString(context).FromMaybe(String::Empty(isolate))->Length() == 0) {
			const char *error = "Invalid value, expected type Number.";
			LOGE(TAG, error);
			titanium::JSException::Error(isolate, error);
			return;
		}
	if (!args[0]->IsNull()) {
		MaybeLocal<Number> arg_0 = args[0]->ToNumber(context);
		if (arg_0.IsEmpty()) {
			const char *error = "Invalid argument at index 0, expected type Number and failed to coerce.";
			LOGE(TAG, error);
			titanium::JSException::Error(isolate, error);
			return;
		} else {
			jArguments[0].i =
				titanium::TypeConverter::jsNumberToJavaInt(
					env, arg_0.ToLocalChecked());
		}
	} else {
		jArguments[0].i = NULL;
	}

	const char *deprecationMessage = "Setter method deprecated, please use \"obj.minVerticalSpacing = val;\" or \"obj['minVerticalSpacing'] = val;\" instead.";
	LOGW(TAG, deprecationMessage);

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}
	env->CallVoidMethodA(javaProxy, methodID, jArguments);

	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
	}




	args.GetReturnValue().Set(v8::Undefined(isolate));

}
void ViewProxy::setHorizontalSpacing(const FunctionCallbackInfo<Value>& args)
{
	LOGD(TAG, "setHorizontalSpacing()");
	Isolate* isolate = args.GetIsolate();
	Local<Context> context = isolate->GetCurrentContext();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		titanium::JSException::GetJNIEnvironmentError(isolate);
		return;
	}
	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "setHorizontalSpacing", "(I)V");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'setHorizontalSpacing' with signature '(I)V'";
			LOGE(TAG, error);
				titanium::JSException::Error(isolate, error);
				return;
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		args.GetReturnValue().Set(Undefined(isolate));
		return;
	}

	if (args.Length() < 1) {
		char errorStringBuffer[100];
		sprintf(errorStringBuffer, "setHorizontalSpacing: Invalid number of arguments. Expected 1 but got %d", args.Length());
		titanium::JSException::Error(isolate, errorStringBuffer);
		return;
	}

	jvalue jArguments[1];



	
		if ((titanium::V8Util::isNaN(isolate, args[0]) && !args[0]->IsUndefined()) || args[0]->ToString(context).FromMaybe(String::Empty(isolate))->Length() == 0) {
			const char *error = "Invalid value, expected type Number.";
			LOGE(TAG, error);
			titanium::JSException::Error(isolate, error);
			return;
		}
	if (!args[0]->IsNull()) {
		MaybeLocal<Number> arg_0 = args[0]->ToNumber(context);
		if (arg_0.IsEmpty()) {
			const char *error = "Invalid argument at index 0, expected type Number and failed to coerce.";
			LOGE(TAG, error);
			titanium::JSException::Error(isolate, error);
			return;
		} else {
			jArguments[0].i =
				titanium::TypeConverter::jsNumberToJavaInt(
					env, arg_0.ToLocalChecked());
		}
	} else {
		jArguments[0].i = NULL;
	}

	const char *deprecationMessage = "Setter method deprecated, please use \"obj.horizontalSpacing = val;\" or \"obj['horizontalSpacing'] = val;\" instead.";
	LOGW(TAG, deprecationMessage);

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}
	env->CallVoidMethodA(javaProxy, methodID, jArguments);

	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
	}




	args.GetReturnValue().Set(v8::Undefined(isolate));

}
void ViewProxy::getShowDeleteButton(const FunctionCallbackInfo<Value>& args)
{
	LOGD(TAG, "getShowDeleteButton()");
	Isolate* isolate = args.GetIsolate();
	Local<Context> context = isolate->GetCurrentContext();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		titanium::JSException::GetJNIEnvironmentError(isolate);
		return;
	}
	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "getShowDeleteButton", "()Z");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'getShowDeleteButton' with signature '()Z'";
			LOGE(TAG, error);
				titanium::JSException::Error(isolate, error);
				return;
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		args.GetReturnValue().Set(Undefined(isolate));
		return;
	}

	jvalue* jArguments = 0;

	const char *deprecationMessage = "Getter method deprecated, please use \"obj.showDeleteButton;\" or \"obj['showDeleteButton'];\" instead.";
	LOGW(TAG, deprecationMessage);

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}
	jboolean jResult = (jboolean)env->CallBooleanMethodA(javaProxy, methodID, jArguments);


	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		Local<Value> jsException = titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
		return;
	}


	Local<Boolean> v8Result = titanium::TypeConverter::javaBooleanToJsBoolean(isolate, env, jResult);



	args.GetReturnValue().Set(v8Result);

}
void ViewProxy::getPagerFollowsBottomInset(const FunctionCallbackInfo<Value>& args)
{
	LOGD(TAG, "getPagerFollowsBottomInset()");
	Isolate* isolate = args.GetIsolate();
	Local<Context> context = isolate->GetCurrentContext();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		titanium::JSException::GetJNIEnvironmentError(isolate);
		return;
	}
	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "getPagerFollowsBottomInset", "()Z");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'getPagerFollowsBottomInset' with signature '()Z'";
			LOGE(TAG, error);
				titanium::JSException::Error(isolate, error);
				return;
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		args.GetReturnValue().Set(Undefined(isolate));
		return;
	}

	jvalue* jArguments = 0;

	const char *deprecationMessage = "Getter method deprecated, please use \"obj.pagerFollowsBottomInset;\" or \"obj['pagerFollowsBottomInset'];\" instead.";
	LOGW(TAG, deprecationMessage);

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}
	jboolean jResult = (jboolean)env->CallBooleanMethodA(javaProxy, methodID, jArguments);


	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		Local<Value> jsException = titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
		return;
	}


	Local<Boolean> v8Result = titanium::TypeConverter::javaBooleanToJsBoolean(isolate, env, jResult);



	args.GetReturnValue().Set(v8Result);

}
void ViewProxy::setContentInsets(const FunctionCallbackInfo<Value>& args)
{
	LOGD(TAG, "setContentInsets()");
	Isolate* isolate = args.GetIsolate();
	Local<Context> context = isolate->GetCurrentContext();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		titanium::JSException::GetJNIEnvironmentError(isolate);
		return;
	}
	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "setContentInsets", "(Ljava/lang/Object;)V");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'setContentInsets' with signature '(Ljava/lang/Object;)V'";
			LOGE(TAG, error);
				titanium::JSException::Error(isolate, error);
				return;
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		args.GetReturnValue().Set(Undefined(isolate));
		return;
	}

	if (args.Length() < 1) {
		char errorStringBuffer[100];
		sprintf(errorStringBuffer, "setContentInsets: Invalid number of arguments. Expected 1 but got %d", args.Length());
		titanium::JSException::Error(isolate, errorStringBuffer);
		return;
	}

	jvalue jArguments[1];



	bool isNew_0;
	if (!args[0]->IsNull()) {
		Local<Value> arg_0 = args[0];
		jArguments[0].l =
			titanium::TypeConverter::jsValueToJavaObject(
				isolate,
				env, arg_0, &isNew_0);
	} else {
		jArguments[0].l = NULL;
	}

	const char *deprecationMessage = "Setter method deprecated, please use \"obj.contentInsets = val;\" or \"obj['contentInsets'] = val;\" instead.";
	LOGW(TAG, deprecationMessage);

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}
	env->CallVoidMethodA(javaProxy, methodID, jArguments);

	proxy->unreferenceJavaObject(javaProxy);



			if (isNew_0) {
				env->DeleteLocalRef(jArguments[0].l);
			}


	if (env->ExceptionCheck()) {
		titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
	}




	args.GetReturnValue().Set(v8::Undefined(isolate));

}
void ViewProxy::stopEditing(const FunctionCallbackInfo<Value>& args)
{
	LOGD(TAG, "stopEditing()");
	Isolate* isolate = args.GetIsolate();
	Local<Context> context = isolate->GetCurrentContext();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		titanium::JSException::GetJNIEnvironmentError(isolate);
		return;
	}
	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "stopEditing", "()V");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'stopEditing' with signature '()V'";
			LOGE(TAG, error);
				titanium::JSException::Error(isolate, error);
				return;
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		args.GetReturnValue().Set(Undefined(isolate));
		return;
	}

	jvalue* jArguments = 0;


	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}
	env->CallVoidMethodA(javaProxy, methodID, jArguments);

	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
	}




	args.GetReturnValue().Set(v8::Undefined(isolate));

}
void ViewProxy::updateBadgeValue(const FunctionCallbackInfo<Value>& args)
{
	LOGD(TAG, "updateBadgeValue()");
	Isolate* isolate = args.GetIsolate();
	Local<Context> context = isolate->GetCurrentContext();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		titanium::JSException::GetJNIEnvironmentError(isolate);
		return;
	}
	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "updateBadgeValue", "(II)V");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'updateBadgeValue' with signature '(II)V'";
			LOGE(TAG, error);
				titanium::JSException::Error(isolate, error);
				return;
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		args.GetReturnValue().Set(Undefined(isolate));
		return;
	}

	if (args.Length() < 2) {
		char errorStringBuffer[100];
		sprintf(errorStringBuffer, "updateBadgeValue: Invalid number of arguments. Expected 2 but got %d", args.Length());
		titanium::JSException::Error(isolate, errorStringBuffer);
		return;
	}

	jvalue jArguments[2];



	
		if ((titanium::V8Util::isNaN(isolate, args[0]) && !args[0]->IsUndefined()) || args[0]->ToString(context).FromMaybe(String::Empty(isolate))->Length() == 0) {
			const char *error = "Invalid value, expected type Number.";
			LOGE(TAG, error);
			titanium::JSException::Error(isolate, error);
			return;
		}
	if (!args[0]->IsNull()) {
		MaybeLocal<Number> arg_0 = args[0]->ToNumber(context);
		if (arg_0.IsEmpty()) {
			const char *error = "Invalid argument at index 0, expected type Number and failed to coerce.";
			LOGE(TAG, error);
			titanium::JSException::Error(isolate, error);
			return;
		} else {
			jArguments[0].i =
				titanium::TypeConverter::jsNumberToJavaInt(
					env, arg_0.ToLocalChecked());
		}
	} else {
		jArguments[0].i = NULL;
	}
	
		if ((titanium::V8Util::isNaN(isolate, args[1]) && !args[1]->IsUndefined()) || args[1]->ToString(context).FromMaybe(String::Empty(isolate))->Length() == 0) {
			const char *error = "Invalid value, expected type Number.";
			LOGE(TAG, error);
			titanium::JSException::Error(isolate, error);
			return;
		}
	if (!args[1]->IsNull()) {
		MaybeLocal<Number> arg_1 = args[1]->ToNumber(context);
		if (arg_1.IsEmpty()) {
			const char *error = "Invalid argument at index 1, expected type Number and failed to coerce.";
			LOGE(TAG, error);
			titanium::JSException::Error(isolate, error);
			return;
		} else {
			jArguments[1].i =
				titanium::TypeConverter::jsNumberToJavaInt(
					env, arg_1.ToLocalChecked());
		}
	} else {
		jArguments[1].i = NULL;
	}


	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}
	env->CallVoidMethodA(javaProxy, methodID, jArguments);

	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
	}




	args.GetReturnValue().Set(v8::Undefined(isolate));

}
void ViewProxy::setWaterFallLayout(const FunctionCallbackInfo<Value>& args)
{
	LOGD(TAG, "setWaterFallLayout()");
	Isolate* isolate = args.GetIsolate();
	Local<Context> context = isolate->GetCurrentContext();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		titanium::JSException::GetJNIEnvironmentError(isolate);
		return;
	}
	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "setWaterFallLayout", "(Z)V");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'setWaterFallLayout' with signature '(Z)V'";
			LOGE(TAG, error);
				titanium::JSException::Error(isolate, error);
				return;
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		args.GetReturnValue().Set(Undefined(isolate));
		return;
	}

	if (args.Length() < 1) {
		char errorStringBuffer[100];
		sprintf(errorStringBuffer, "setWaterFallLayout: Invalid number of arguments. Expected 1 but got %d", args.Length());
		titanium::JSException::Error(isolate, errorStringBuffer);
		return;
	}

	jvalue jArguments[1];



	if (!args[0]->IsBoolean() && !args[0]->IsNull()) {
		const char *error = "Invalid value, expected type Boolean.";
		LOGE(TAG, error);
		titanium::JSException::Error(isolate, error);
		return;
	}
	
		if (!args[0]->IsNull()) {
		Local<Boolean> arg_0 = args[0]->ToBoolean(isolate);
		jArguments[0].z =
			titanium::TypeConverter::jsBooleanToJavaBoolean(
				env, arg_0);
	} else {
		jArguments[0].z = NULL;
	}

	const char *deprecationMessage = "Setter method deprecated, please use \"obj.waterFallLayout = val;\" or \"obj['waterFallLayout'] = val;\" instead.";
	LOGW(TAG, deprecationMessage);

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}
	env->CallVoidMethodA(javaProxy, methodID, jArguments);

	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
	}




	args.GetReturnValue().Set(v8::Undefined(isolate));

}
void ViewProxy::setDeleteButtonImage(const FunctionCallbackInfo<Value>& args)
{
	LOGD(TAG, "setDeleteButtonImage()");
	Isolate* isolate = args.GetIsolate();
	Local<Context> context = isolate->GetCurrentContext();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		titanium::JSException::GetJNIEnvironmentError(isolate);
		return;
	}
	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "setDeleteButtonImage", "(Ljava/lang/Object;)V");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'setDeleteButtonImage' with signature '(Ljava/lang/Object;)V'";
			LOGE(TAG, error);
				titanium::JSException::Error(isolate, error);
				return;
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		args.GetReturnValue().Set(Undefined(isolate));
		return;
	}

	if (args.Length() < 1) {
		char errorStringBuffer[100];
		sprintf(errorStringBuffer, "setDeleteButtonImage: Invalid number of arguments. Expected 1 but got %d", args.Length());
		titanium::JSException::Error(isolate, errorStringBuffer);
		return;
	}

	jvalue jArguments[1];



	bool isNew_0;
	if (!args[0]->IsNull()) {
		Local<Value> arg_0 = args[0];
		jArguments[0].l =
			titanium::TypeConverter::jsValueToJavaObject(
				isolate,
				env, arg_0, &isNew_0);
	} else {
		jArguments[0].l = NULL;
	}

	const char *deprecationMessage = "Setter method deprecated, please use \"obj.deleteButtonImage = val;\" or \"obj['deleteButtonImage'] = val;\" instead.";
	LOGW(TAG, deprecationMessage);

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}
	env->CallVoidMethodA(javaProxy, methodID, jArguments);

	proxy->unreferenceJavaObject(javaProxy);



			if (isNew_0) {
				env->DeleteLocalRef(jArguments[0].l);
			}


	if (env->ExceptionCheck()) {
		titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
	}




	args.GetReturnValue().Set(v8::Undefined(isolate));

}
void ViewProxy::setItems(const FunctionCallbackInfo<Value>& args)
{
	LOGD(TAG, "setItems()");
	Isolate* isolate = args.GetIsolate();
	Local<Context> context = isolate->GetCurrentContext();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		titanium::JSException::GetJNIEnvironmentError(isolate);
		return;
	}
	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "setItems", "(Lorg/appcelerator/kroll/KrollDict;)V");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'setItems' with signature '(Lorg/appcelerator/kroll/KrollDict;)V'";
			LOGE(TAG, error);
				titanium::JSException::Error(isolate, error);
				return;
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		args.GetReturnValue().Set(Undefined(isolate));
		return;
	}

	if (args.Length() < 1) {
		char errorStringBuffer[100];
		sprintf(errorStringBuffer, "setItems: Invalid number of arguments. Expected 1 but got %d", args.Length());
		titanium::JSException::Error(isolate, errorStringBuffer);
		return;
	}

	jvalue jArguments[1];



	bool isNew_0;
	if (!args[0]->IsNull()) {
		Local<Value> arg_0 = args[0];
		jArguments[0].l =
			titanium::TypeConverter::jsObjectToJavaKrollDict(
				isolate,
				env, arg_0, &isNew_0);
	} else {
		jArguments[0].l = NULL;
	}

	const char *deprecationMessage = "Setter method deprecated, please use \"obj.items = val;\" or \"obj['items'] = val;\" instead.";
	LOGW(TAG, deprecationMessage);

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}
	env->CallVoidMethodA(javaProxy, methodID, jArguments);

	proxy->unreferenceJavaObject(javaProxy);



			if (isNew_0) {
				env->DeleteLocalRef(jArguments[0].l);
			}


	if (env->ExceptionCheck()) {
		titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
	}




	args.GetReturnValue().Set(v8::Undefined(isolate));

}
void ViewProxy::getLayoutManager(const FunctionCallbackInfo<Value>& args)
{
	LOGD(TAG, "getLayoutManager()");
	Isolate* isolate = args.GetIsolate();
	Local<Context> context = isolate->GetCurrentContext();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		titanium::JSException::GetJNIEnvironmentError(isolate);
		return;
	}
	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "getLayoutManager", "()Landroidx/recyclerview/widget/RecyclerView/LayoutManager;");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'getLayoutManager' with signature '()Landroidx/recyclerview/widget/RecyclerView/LayoutManager;'";
			LOGE(TAG, error);
				titanium::JSException::Error(isolate, error);
				return;
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		args.GetReturnValue().Set(Undefined(isolate));
		return;
	}

	jvalue* jArguments = 0;

	const char *deprecationMessage = "Getter method deprecated, please use \"obj.layoutManager;\" or \"obj['layoutManager'];\" instead.";
	LOGW(TAG, deprecationMessage);

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}
	jobject jResult = (jobject)env->CallObjectMethodA(javaProxy, methodID, jArguments);


	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		Local<Value> jsException = titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
		return;
	}

	if (jResult == NULL) {
		args.GetReturnValue().Set(Null(isolate));
		return;
	}

	Local<Value> v8Result = titanium::TypeConverter::javaObjectToJsValue(isolate, env, jResult);

	env->DeleteLocalRef(jResult);


	args.GetReturnValue().Set(v8Result);

}
void ViewProxy::getLazyLoadingEnabled(const FunctionCallbackInfo<Value>& args)
{
	LOGD(TAG, "getLazyLoadingEnabled()");
	Isolate* isolate = args.GetIsolate();
	Local<Context> context = isolate->GetCurrentContext();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		titanium::JSException::GetJNIEnvironmentError(isolate);
		return;
	}
	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "getLazyLoadingEnabled", "()Z");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'getLazyLoadingEnabled' with signature '()Z'";
			LOGE(TAG, error);
				titanium::JSException::Error(isolate, error);
				return;
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		args.GetReturnValue().Set(Undefined(isolate));
		return;
	}

	jvalue* jArguments = 0;

	const char *deprecationMessage = "Getter method deprecated, please use \"obj.lazyLoadingEnabled;\" or \"obj['lazyLoadingEnabled'];\" instead.";
	LOGW(TAG, deprecationMessage);

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}
	jboolean jResult = (jboolean)env->CallBooleanMethodA(javaProxy, methodID, jArguments);


	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		Local<Value> jsException = titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
		return;
	}


	Local<Boolean> v8Result = titanium::TypeConverter::javaBooleanToJsBoolean(isolate, env, jResult);



	args.GetReturnValue().Set(v8Result);

}
void ViewProxy::getData(const FunctionCallbackInfo<Value>& args)
{
	LOGD(TAG, "getData()");
	Isolate* isolate = args.GetIsolate();
	Local<Context> context = isolate->GetCurrentContext();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		titanium::JSException::GetJNIEnvironmentError(isolate);
		return;
	}
	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "getData", "()[Ljava/lang/Object;");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'getData' with signature '()[Ljava/lang/Object;'";
			LOGE(TAG, error);
				titanium::JSException::Error(isolate, error);
				return;
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		args.GetReturnValue().Set(Undefined(isolate));
		return;
	}

	jvalue* jArguments = 0;

	const char *deprecationMessage = "Getter method deprecated, please use \"obj.data;\" or \"obj['data'];\" instead.";
	LOGW(TAG, deprecationMessage);

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}
	jobjectArray jResult = (jobjectArray)env->CallObjectMethodA(javaProxy, methodID, jArguments);


	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		Local<Value> jsException = titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
		return;
	}

	if (jResult == NULL) {
		args.GetReturnValue().Set(Null(isolate));
		return;
	}

	Local<Array> v8Result = titanium::TypeConverter::javaArrayToJsArray(isolate, env, jResult);

	env->DeleteLocalRef(jResult);


	args.GetReturnValue().Set(v8Result);

}
void ViewProxy::getWaterFallLayout(const FunctionCallbackInfo<Value>& args)
{
	LOGD(TAG, "getWaterFallLayout()");
	Isolate* isolate = args.GetIsolate();
	Local<Context> context = isolate->GetCurrentContext();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		titanium::JSException::GetJNIEnvironmentError(isolate);
		return;
	}
	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "getWaterFallLayout", "()Z");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'getWaterFallLayout' with signature '()Z'";
			LOGE(TAG, error);
				titanium::JSException::Error(isolate, error);
				return;
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		args.GetReturnValue().Set(Undefined(isolate));
		return;
	}

	jvalue* jArguments = 0;

	const char *deprecationMessage = "Getter method deprecated, please use \"obj.waterFallLayout;\" or \"obj['waterFallLayout'];\" instead.";
	LOGW(TAG, deprecationMessage);

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}
	jboolean jResult = (jboolean)env->CallBooleanMethodA(javaProxy, methodID, jArguments);


	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		Local<Value> jsException = titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
		return;
	}


	Local<Boolean> v8Result = titanium::TypeConverter::javaBooleanToJsBoolean(isolate, env, jResult);



	args.GetReturnValue().Set(v8Result);

}
void ViewProxy::setData(const FunctionCallbackInfo<Value>& args)
{
	LOGD(TAG, "setData()");
	Isolate* isolate = args.GetIsolate();
	Local<Context> context = isolate->GetCurrentContext();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		titanium::JSException::GetJNIEnvironmentError(isolate);
		return;
	}
	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "setData", "([Ljava/lang/Object;)V");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'setData' with signature '([Ljava/lang/Object;)V'";
			LOGE(TAG, error);
				titanium::JSException::Error(isolate, error);
				return;
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		args.GetReturnValue().Set(Undefined(isolate));
		return;
	}


	jvalue jArguments[1];



	uint32_t length = args.Length() - 0;
	if (length < 0) {
		length = 0;
	}

	jobjectArray varArgs = env->NewObjectArray(length, titanium::JNIUtil::objectClass, NULL);
	for (uint32_t i = 0; i < length; ++i) {
		bool isNew;
		jobject arg = titanium::TypeConverter::jsValueToJavaObject(isolate, env, args[i+0], &isNew);
		env->SetObjectArrayElement(varArgs, i, arg);
		if (isNew) {
			env->DeleteLocalRef(arg);
		}
	}

	jArguments[0].l = varArgs;

	const char *deprecationMessage = "Setter method deprecated, please use \"obj.data = val;\" or \"obj['data'] = val;\" instead.";
	LOGW(TAG, deprecationMessage);

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}
	env->CallVoidMethodA(javaProxy, methodID, jArguments);

	proxy->unreferenceJavaObject(javaProxy);


			env->DeleteLocalRef(jArguments[0].l);

	if (env->ExceptionCheck()) {
		titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
	}




	args.GetReturnValue().Set(v8::Undefined(isolate));

}
void ViewProxy::scrollToBottom(const FunctionCallbackInfo<Value>& args)
{
	LOGD(TAG, "scrollToBottom()");
	Isolate* isolate = args.GetIsolate();
	Local<Context> context = isolate->GetCurrentContext();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		titanium::JSException::GetJNIEnvironmentError(isolate);
		return;
	}
	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "scrollToBottom", "()V");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'scrollToBottom' with signature '()V'";
			LOGE(TAG, error);
				titanium::JSException::Error(isolate, error);
				return;
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		args.GetReturnValue().Set(Undefined(isolate));
		return;
	}

	jvalue* jArguments = 0;


	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}
	env->CallVoidMethodA(javaProxy, methodID, jArguments);

	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
	}




	args.GetReturnValue().Set(v8::Undefined(isolate));

}
void ViewProxy::getItemsBadgeEnabled(const FunctionCallbackInfo<Value>& args)
{
	LOGD(TAG, "getItemsBadgeEnabled()");
	Isolate* isolate = args.GetIsolate();
	Local<Context> context = isolate->GetCurrentContext();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		titanium::JSException::GetJNIEnvironmentError(isolate);
		return;
	}
	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "getItemsBadgeEnabled", "()Z");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'getItemsBadgeEnabled' with signature '()Z'";
			LOGE(TAG, error);
				titanium::JSException::Error(isolate, error);
				return;
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		args.GetReturnValue().Set(Undefined(isolate));
		return;
	}

	jvalue* jArguments = 0;

	const char *deprecationMessage = "Getter method deprecated, please use \"obj.itemsBadgeEnabled;\" or \"obj['itemsBadgeEnabled'];\" instead.";
	LOGW(TAG, deprecationMessage);

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}
	jboolean jResult = (jboolean)env->CallBooleanMethodA(javaProxy, methodID, jArguments);


	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		Local<Value> jsException = titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
		return;
	}


	Local<Boolean> v8Result = titanium::TypeConverter::javaBooleanToJsBoolean(isolate, env, jResult);



	args.GetReturnValue().Set(v8Result);

}
void ViewProxy::setScrollEnabled(const FunctionCallbackInfo<Value>& args)
{
	LOGD(TAG, "setScrollEnabled()");
	Isolate* isolate = args.GetIsolate();
	Local<Context> context = isolate->GetCurrentContext();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		titanium::JSException::GetJNIEnvironmentError(isolate);
		return;
	}
	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "setScrollEnabled", "(Z)V");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'setScrollEnabled' with signature '(Z)V'";
			LOGE(TAG, error);
				titanium::JSException::Error(isolate, error);
				return;
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		args.GetReturnValue().Set(Undefined(isolate));
		return;
	}

	if (args.Length() < 1) {
		char errorStringBuffer[100];
		sprintf(errorStringBuffer, "setScrollEnabled: Invalid number of arguments. Expected 1 but got %d", args.Length());
		titanium::JSException::Error(isolate, errorStringBuffer);
		return;
	}

	jvalue jArguments[1];



	if (!args[0]->IsBoolean() && !args[0]->IsNull()) {
		const char *error = "Invalid value, expected type Boolean.";
		LOGE(TAG, error);
		titanium::JSException::Error(isolate, error);
		return;
	}
	
		if (!args[0]->IsNull()) {
		Local<Boolean> arg_0 = args[0]->ToBoolean(isolate);
		jArguments[0].z =
			titanium::TypeConverter::jsBooleanToJavaBoolean(
				env, arg_0);
	} else {
		jArguments[0].z = NULL;
	}

	const char *deprecationMessage = "Setter method deprecated, please use \"obj.scrollEnabled = val;\" or \"obj['scrollEnabled'] = val;\" instead.";
	LOGW(TAG, deprecationMessage);

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}
	env->CallVoidMethodA(javaProxy, methodID, jArguments);

	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
	}




	args.GetReturnValue().Set(v8::Undefined(isolate));

}
void ViewProxy::getCurrentPageIndicatorTintColor(const FunctionCallbackInfo<Value>& args)
{
	LOGD(TAG, "getCurrentPageIndicatorTintColor()");
	Isolate* isolate = args.GetIsolate();
	Local<Context> context = isolate->GetCurrentContext();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		titanium::JSException::GetJNIEnvironmentError(isolate);
		return;
	}
	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "getCurrentPageIndicatorTintColor", "()Ljava/lang/String;");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'getCurrentPageIndicatorTintColor' with signature '()Ljava/lang/String;'";
			LOGE(TAG, error);
				titanium::JSException::Error(isolate, error);
				return;
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		args.GetReturnValue().Set(Undefined(isolate));
		return;
	}

	jvalue* jArguments = 0;

	const char *deprecationMessage = "Getter method deprecated, please use \"obj.currentPageIndicatorTintColor;\" or \"obj['currentPageIndicatorTintColor'];\" instead.";
	LOGW(TAG, deprecationMessage);

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}
	jstring jResult = (jstring)env->CallObjectMethodA(javaProxy, methodID, jArguments);


	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		Local<Value> jsException = titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
		return;
	}

	if (jResult == NULL) {
		args.GetReturnValue().Set(Null(isolate));
		return;
	}

	Local<Value> v8Result = titanium::TypeConverter::javaStringToJsString(isolate, env, jResult);

	env->DeleteLocalRef(jResult);


	args.GetReturnValue().Set(v8Result);

}
void ViewProxy::setCurrentPage(const FunctionCallbackInfo<Value>& args)
{
	LOGD(TAG, "setCurrentPage()");
	Isolate* isolate = args.GetIsolate();
	Local<Context> context = isolate->GetCurrentContext();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		titanium::JSException::GetJNIEnvironmentError(isolate);
		return;
	}
	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "setCurrentPage", "(I)V");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'setCurrentPage' with signature '(I)V'";
			LOGE(TAG, error);
				titanium::JSException::Error(isolate, error);
				return;
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		args.GetReturnValue().Set(Undefined(isolate));
		return;
	}

	if (args.Length() < 1) {
		char errorStringBuffer[100];
		sprintf(errorStringBuffer, "setCurrentPage: Invalid number of arguments. Expected 1 but got %d", args.Length());
		titanium::JSException::Error(isolate, errorStringBuffer);
		return;
	}

	jvalue jArguments[1];



	
		if ((titanium::V8Util::isNaN(isolate, args[0]) && !args[0]->IsUndefined()) || args[0]->ToString(context).FromMaybe(String::Empty(isolate))->Length() == 0) {
			const char *error = "Invalid value, expected type Number.";
			LOGE(TAG, error);
			titanium::JSException::Error(isolate, error);
			return;
		}
	if (!args[0]->IsNull()) {
		MaybeLocal<Number> arg_0 = args[0]->ToNumber(context);
		if (arg_0.IsEmpty()) {
			const char *error = "Invalid argument at index 0, expected type Number and failed to coerce.";
			LOGE(TAG, error);
			titanium::JSException::Error(isolate, error);
			return;
		} else {
			jArguments[0].i =
				titanium::TypeConverter::jsNumberToJavaInt(
					env, arg_0.ToLocalChecked());
		}
	} else {
		jArguments[0].i = NULL;
	}

	const char *deprecationMessage = "Setter method deprecated, please use \"obj.currentPage = val;\" or \"obj['currentPage'] = val;\" instead.";
	LOGW(TAG, deprecationMessage);

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}
	env->CallVoidMethodA(javaProxy, methodID, jArguments);

	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
	}




	args.GetReturnValue().Set(v8::Undefined(isolate));

}
void ViewProxy::setPagerFollowsBottomInset(const FunctionCallbackInfo<Value>& args)
{
	LOGD(TAG, "setPagerFollowsBottomInset()");
	Isolate* isolate = args.GetIsolate();
	Local<Context> context = isolate->GetCurrentContext();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		titanium::JSException::GetJNIEnvironmentError(isolate);
		return;
	}
	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "setPagerFollowsBottomInset", "(Z)V");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'setPagerFollowsBottomInset' with signature '(Z)V'";
			LOGE(TAG, error);
				titanium::JSException::Error(isolate, error);
				return;
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		args.GetReturnValue().Set(Undefined(isolate));
		return;
	}

	if (args.Length() < 1) {
		char errorStringBuffer[100];
		sprintf(errorStringBuffer, "setPagerFollowsBottomInset: Invalid number of arguments. Expected 1 but got %d", args.Length());
		titanium::JSException::Error(isolate, errorStringBuffer);
		return;
	}

	jvalue jArguments[1];



	if (!args[0]->IsBoolean() && !args[0]->IsNull()) {
		const char *error = "Invalid value, expected type Boolean.";
		LOGE(TAG, error);
		titanium::JSException::Error(isolate, error);
		return;
	}
	
		if (!args[0]->IsNull()) {
		Local<Boolean> arg_0 = args[0]->ToBoolean(isolate);
		jArguments[0].z =
			titanium::TypeConverter::jsBooleanToJavaBoolean(
				env, arg_0);
	} else {
		jArguments[0].z = NULL;
	}

	const char *deprecationMessage = "Setter method deprecated, please use \"obj.pagerFollowsBottomInset = val;\" or \"obj['pagerFollowsBottomInset'] = val;\" instead.";
	LOGW(TAG, deprecationMessage);

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}
	env->CallVoidMethodA(javaProxy, methodID, jArguments);

	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
	}




	args.GetReturnValue().Set(v8::Undefined(isolate));

}
void ViewProxy::getVerticalSpacing(const FunctionCallbackInfo<Value>& args)
{
	LOGD(TAG, "getVerticalSpacing()");
	Isolate* isolate = args.GetIsolate();
	Local<Context> context = isolate->GetCurrentContext();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		titanium::JSException::GetJNIEnvironmentError(isolate);
		return;
	}
	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "getVerticalSpacing", "()I");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'getVerticalSpacing' with signature '()I'";
			LOGE(TAG, error);
				titanium::JSException::Error(isolate, error);
				return;
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		args.GetReturnValue().Set(Undefined(isolate));
		return;
	}

	jvalue* jArguments = 0;

	const char *deprecationMessage = "Getter method deprecated, please use \"obj.verticalSpacing;\" or \"obj['verticalSpacing'];\" instead.";
	LOGW(TAG, deprecationMessage);

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}
	jint jResult = (jint)env->CallIntMethodA(javaProxy, methodID, jArguments);


	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		Local<Value> jsException = titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
		return;
	}


	Local<Number> v8Result = titanium::TypeConverter::javaIntToJsNumber(isolate, env, jResult);



	args.GetReturnValue().Set(v8Result);

}
void ViewProxy::getMinHorizontalSpacing(const FunctionCallbackInfo<Value>& args)
{
	LOGD(TAG, "getMinHorizontalSpacing()");
	Isolate* isolate = args.GetIsolate();
	Local<Context> context = isolate->GetCurrentContext();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		titanium::JSException::GetJNIEnvironmentError(isolate);
		return;
	}
	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "getMinHorizontalSpacing", "()I");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'getMinHorizontalSpacing' with signature '()I'";
			LOGE(TAG, error);
				titanium::JSException::Error(isolate, error);
				return;
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		args.GetReturnValue().Set(Undefined(isolate));
		return;
	}

	jvalue* jArguments = 0;

	const char *deprecationMessage = "Getter method deprecated, please use \"obj.minHorizontalSpacing;\" or \"obj['minHorizontalSpacing'];\" instead.";
	LOGW(TAG, deprecationMessage);

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}
	jint jResult = (jint)env->CallIntMethodA(javaProxy, methodID, jArguments);


	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		Local<Value> jsException = titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
		return;
	}


	Local<Number> v8Result = titanium::TypeConverter::javaIntToJsNumber(isolate, env, jResult);



	args.GetReturnValue().Set(v8Result);

}
void ViewProxy::setScrollType(const FunctionCallbackInfo<Value>& args)
{
	LOGD(TAG, "setScrollType()");
	Isolate* isolate = args.GetIsolate();
	Local<Context> context = isolate->GetCurrentContext();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		titanium::JSException::GetJNIEnvironmentError(isolate);
		return;
	}
	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "setScrollType", "(Ljava/lang/String;)V");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'setScrollType' with signature '(Ljava/lang/String;)V'";
			LOGE(TAG, error);
				titanium::JSException::Error(isolate, error);
				return;
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		args.GetReturnValue().Set(Undefined(isolate));
		return;
	}

	if (args.Length() < 1) {
		char errorStringBuffer[100];
		sprintf(errorStringBuffer, "setScrollType: Invalid number of arguments. Expected 1 but got %d", args.Length());
		titanium::JSException::Error(isolate, errorStringBuffer);
		return;
	}

	jvalue jArguments[1];



	
	if (!args[0]->IsNull()) {
		Local<Value> arg_0 = args[0];
		jArguments[0].l =
			titanium::TypeConverter::jsValueToJavaString(
				isolate,
				env, arg_0);
	} else {
		jArguments[0].l = NULL;
	}

	const char *deprecationMessage = "Setter method deprecated, please use \"obj.scrollType = val;\" or \"obj['scrollType'] = val;\" instead.";
	LOGW(TAG, deprecationMessage);

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}
	env->CallVoidMethodA(javaProxy, methodID, jArguments);

	proxy->unreferenceJavaObject(javaProxy);



				env->DeleteLocalRef(jArguments[0].l);


	if (env->ExceptionCheck()) {
		titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
	}




	args.GetReturnValue().Set(v8::Undefined(isolate));

}
void ViewProxy::getShowHorizontalScrollIndicator(const FunctionCallbackInfo<Value>& args)
{
	LOGD(TAG, "getShowHorizontalScrollIndicator()");
	Isolate* isolate = args.GetIsolate();
	Local<Context> context = isolate->GetCurrentContext();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		titanium::JSException::GetJNIEnvironmentError(isolate);
		return;
	}
	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "getShowHorizontalScrollIndicator", "()Z");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'getShowHorizontalScrollIndicator' with signature '()Z'";
			LOGE(TAG, error);
				titanium::JSException::Error(isolate, error);
				return;
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		args.GetReturnValue().Set(Undefined(isolate));
		return;
	}

	jvalue* jArguments = 0;

	const char *deprecationMessage = "Getter method deprecated, please use \"obj.showHorizontalScrollIndicator;\" or \"obj['showHorizontalScrollIndicator'];\" instead.";
	LOGW(TAG, deprecationMessage);

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}
	jboolean jResult = (jboolean)env->CallBooleanMethodA(javaProxy, methodID, jArguments);


	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		Local<Value> jsException = titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
		return;
	}


	Local<Boolean> v8Result = titanium::TypeConverter::javaBooleanToJsBoolean(isolate, env, jResult);



	args.GetReturnValue().Set(v8Result);

}
void ViewProxy::setEditable(const FunctionCallbackInfo<Value>& args)
{
	LOGD(TAG, "setEditable()");
	Isolate* isolate = args.GetIsolate();
	Local<Context> context = isolate->GetCurrentContext();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		titanium::JSException::GetJNIEnvironmentError(isolate);
		return;
	}
	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "setEditable", "(Z)V");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'setEditable' with signature '(Z)V'";
			LOGE(TAG, error);
				titanium::JSException::Error(isolate, error);
				return;
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		args.GetReturnValue().Set(Undefined(isolate));
		return;
	}

	if (args.Length() < 1) {
		char errorStringBuffer[100];
		sprintf(errorStringBuffer, "setEditable: Invalid number of arguments. Expected 1 but got %d", args.Length());
		titanium::JSException::Error(isolate, errorStringBuffer);
		return;
	}

	jvalue jArguments[1];



	if (!args[0]->IsBoolean() && !args[0]->IsNull()) {
		const char *error = "Invalid value, expected type Boolean.";
		LOGE(TAG, error);
		titanium::JSException::Error(isolate, error);
		return;
	}
	
		if (!args[0]->IsNull()) {
		Local<Boolean> arg_0 = args[0]->ToBoolean(isolate);
		jArguments[0].z =
			titanium::TypeConverter::jsBooleanToJavaBoolean(
				env, arg_0);
	} else {
		jArguments[0].z = NULL;
	}

	const char *deprecationMessage = "Setter method deprecated, please use \"obj.editable = val;\" or \"obj['editable'] = val;\" instead.";
	LOGW(TAG, deprecationMessage);

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}
	env->CallVoidMethodA(javaProxy, methodID, jArguments);

	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
	}




	args.GetReturnValue().Set(v8::Undefined(isolate));

}
void ViewProxy::getWobble(const FunctionCallbackInfo<Value>& args)
{
	LOGD(TAG, "getWobble()");
	Isolate* isolate = args.GetIsolate();
	Local<Context> context = isolate->GetCurrentContext();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		titanium::JSException::GetJNIEnvironmentError(isolate);
		return;
	}
	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "getWobble", "()Z");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'getWobble' with signature '()Z'";
			LOGE(TAG, error);
				titanium::JSException::Error(isolate, error);
				return;
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		args.GetReturnValue().Set(Undefined(isolate));
		return;
	}

	jvalue* jArguments = 0;

	const char *deprecationMessage = "Getter method deprecated, please use \"obj.wobble;\" or \"obj['wobble'];\" instead.";
	LOGW(TAG, deprecationMessage);

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}
	jboolean jResult = (jboolean)env->CallBooleanMethodA(javaProxy, methodID, jArguments);


	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		Local<Value> jsException = titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
		return;
	}


	Local<Boolean> v8Result = titanium::TypeConverter::javaBooleanToJsBoolean(isolate, env, jResult);



	args.GetReturnValue().Set(v8Result);

}
void ViewProxy::deleteItem(const FunctionCallbackInfo<Value>& args)
{
	LOGD(TAG, "deleteItem()");
	Isolate* isolate = args.GetIsolate();
	Local<Context> context = isolate->GetCurrentContext();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		titanium::JSException::GetJNIEnvironmentError(isolate);
		return;
	}
	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "deleteItem", "(Ljava/lang/String;)V");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'deleteItem' with signature '(Ljava/lang/String;)V'";
			LOGE(TAG, error);
				titanium::JSException::Error(isolate, error);
				return;
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		args.GetReturnValue().Set(Undefined(isolate));
		return;
	}

	if (args.Length() < 1) {
		char errorStringBuffer[100];
		sprintf(errorStringBuffer, "deleteItem: Invalid number of arguments. Expected 1 but got %d", args.Length());
		titanium::JSException::Error(isolate, errorStringBuffer);
		return;
	}

	jvalue jArguments[1];



	
	if (!args[0]->IsNull()) {
		Local<Value> arg_0 = args[0];
		jArguments[0].l =
			titanium::TypeConverter::jsValueToJavaString(
				isolate,
				env, arg_0);
	} else {
		jArguments[0].l = NULL;
	}


	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}
	env->CallVoidMethodA(javaProxy, methodID, jArguments);

	proxy->unreferenceJavaObject(javaProxy);



				env->DeleteLocalRef(jArguments[0].l);


	if (env->ExceptionCheck()) {
		titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
	}




	args.GetReturnValue().Set(v8::Undefined(isolate));

}
void ViewProxy::scrollToItemAtIndex(const FunctionCallbackInfo<Value>& args)
{
	LOGD(TAG, "scrollToItemAtIndex()");
	Isolate* isolate = args.GetIsolate();
	Local<Context> context = isolate->GetCurrentContext();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		titanium::JSException::GetJNIEnvironmentError(isolate);
		return;
	}
	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "scrollToItemAtIndex", "(Ljava/lang/Object;)V");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'scrollToItemAtIndex' with signature '(Ljava/lang/Object;)V'";
			LOGE(TAG, error);
				titanium::JSException::Error(isolate, error);
				return;
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		args.GetReturnValue().Set(Undefined(isolate));
		return;
	}

	if (args.Length() < 1) {
		char errorStringBuffer[100];
		sprintf(errorStringBuffer, "scrollToItemAtIndex: Invalid number of arguments. Expected 1 but got %d", args.Length());
		titanium::JSException::Error(isolate, errorStringBuffer);
		return;
	}

	jvalue jArguments[1];



	bool isNew_0;
	if (!args[0]->IsNull()) {
		Local<Value> arg_0 = args[0];
		jArguments[0].l =
			titanium::TypeConverter::jsValueToJavaObject(
				isolate,
				env, arg_0, &isNew_0);
	} else {
		jArguments[0].l = NULL;
	}


	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}
	env->CallVoidMethodA(javaProxy, methodID, jArguments);

	proxy->unreferenceJavaObject(javaProxy);



			if (isNew_0) {
				env->DeleteLocalRef(jArguments[0].l);
			}


	if (env->ExceptionCheck()) {
		titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
	}




	args.GetReturnValue().Set(v8::Undefined(isolate));

}
void ViewProxy::setColumnCount(const FunctionCallbackInfo<Value>& args)
{
	LOGD(TAG, "setColumnCount()");
	Isolate* isolate = args.GetIsolate();
	Local<Context> context = isolate->GetCurrentContext();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		titanium::JSException::GetJNIEnvironmentError(isolate);
		return;
	}
	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "setColumnCount", "(I)V");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'setColumnCount' with signature '(I)V'";
			LOGE(TAG, error);
				titanium::JSException::Error(isolate, error);
				return;
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		args.GetReturnValue().Set(Undefined(isolate));
		return;
	}

	if (args.Length() < 1) {
		char errorStringBuffer[100];
		sprintf(errorStringBuffer, "setColumnCount: Invalid number of arguments. Expected 1 but got %d", args.Length());
		titanium::JSException::Error(isolate, errorStringBuffer);
		return;
	}

	jvalue jArguments[1];



	
		if ((titanium::V8Util::isNaN(isolate, args[0]) && !args[0]->IsUndefined()) || args[0]->ToString(context).FromMaybe(String::Empty(isolate))->Length() == 0) {
			const char *error = "Invalid value, expected type Number.";
			LOGE(TAG, error);
			titanium::JSException::Error(isolate, error);
			return;
		}
	if (!args[0]->IsNull()) {
		MaybeLocal<Number> arg_0 = args[0]->ToNumber(context);
		if (arg_0.IsEmpty()) {
			const char *error = "Invalid argument at index 0, expected type Number and failed to coerce.";
			LOGE(TAG, error);
			titanium::JSException::Error(isolate, error);
			return;
		} else {
			jArguments[0].i =
				titanium::TypeConverter::jsNumberToJavaInt(
					env, arg_0.ToLocalChecked());
		}
	} else {
		jArguments[0].i = NULL;
	}

	const char *deprecationMessage = "Setter method deprecated, please use \"obj.columnCount = val;\" or \"obj['columnCount'] = val;\" instead.";
	LOGW(TAG, deprecationMessage);

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}
	env->CallVoidMethodA(javaProxy, methodID, jArguments);

	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
	}




	args.GetReturnValue().Set(v8::Undefined(isolate));

}
void ViewProxy::getMinVerticalSpacing(const FunctionCallbackInfo<Value>& args)
{
	LOGD(TAG, "getMinVerticalSpacing()");
	Isolate* isolate = args.GetIsolate();
	Local<Context> context = isolate->GetCurrentContext();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		titanium::JSException::GetJNIEnvironmentError(isolate);
		return;
	}
	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "getMinVerticalSpacing", "()I");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'getMinVerticalSpacing' with signature '()I'";
			LOGE(TAG, error);
				titanium::JSException::Error(isolate, error);
				return;
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		args.GetReturnValue().Set(Undefined(isolate));
		return;
	}

	jvalue* jArguments = 0;

	const char *deprecationMessage = "Getter method deprecated, please use \"obj.minVerticalSpacing;\" or \"obj['minVerticalSpacing'];\" instead.";
	LOGW(TAG, deprecationMessage);

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}
	jint jResult = (jint)env->CallIntMethodA(javaProxy, methodID, jArguments);


	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		Local<Value> jsException = titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
		return;
	}


	Local<Number> v8Result = titanium::TypeConverter::javaIntToJsNumber(isolate, env, jResult);



	args.GetReturnValue().Set(v8Result);

}

// Dynamic property accessors -------------------------------------------------

void ViewProxy::getter_data(Local<Name> property, const PropertyCallbackInfo<Value>& args)
{
	Isolate* isolate = args.GetIsolate();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		titanium::JSException::GetJNIEnvironmentError(isolate);
		return;
	}

	Local<Context> context = isolate->GetCurrentContext();
	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "getData", "()[Ljava/lang/Object;");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'getData' with signature '()[Ljava/lang/Object;'";
			LOGE(TAG, error);
				titanium::JSException::Error(isolate, error);
				return;
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		args.GetReturnValue().Set(Undefined(isolate));
		return;
	}

	jvalue* jArguments = 0;

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}
	jobjectArray jResult = (jobjectArray)env->CallObjectMethodA(javaProxy, methodID, jArguments);


	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		Local<Value> jsException = titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
		return;
	}

	if (jResult == NULL) {
		args.GetReturnValue().Set(Null(isolate));
		return;
	}

	Local<Array> v8Result = titanium::TypeConverter::javaArrayToJsArray(isolate, env, jResult);

	env->DeleteLocalRef(jResult);


	args.GetReturnValue().Set(v8Result);

}

void ViewProxy::setter_data(Local<Name> property, Local<Value> value, const PropertyCallbackInfo<void>& args)
{
	Isolate* isolate = args.GetIsolate();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		LOGE(TAG, "Failed to get environment, data wasn't set");
		return;
	}

	Local<Context> context = isolate->GetCurrentContext();

	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "setData", "([Ljava/lang/Object;)V");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'setData' with signature '([Ljava/lang/Object;)V'";
			LOGE(TAG, error);
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		return;
	}

	jvalue jArguments[1];

	if (!value->IsArray() && !value->IsNull()) {
		const char *error = "Invalid value, expected type Array.";
		LOGE(TAG, error);
	}
	
 // Array
	if (!value->IsNull()) {
		Local<Array> arg_0 = value.As<Array>();
		jArguments[0].l =
			titanium::TypeConverter::jsArrayToJavaArray(
				isolate,
				env, arg_0);
	} else {
		jArguments[0].l = NULL;
	}

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		return;
	}
	env->CallVoidMethodA(javaProxy, methodID, jArguments);

	proxy->unreferenceJavaObject(javaProxy);


			env->DeleteLocalRef(jArguments[0].l);

	if (env->ExceptionCheck()) {
		titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
	}




}


void ViewProxy::getter_pagerEnabled(Local<Name> property, const PropertyCallbackInfo<Value>& args)
{
	Isolate* isolate = args.GetIsolate();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		titanium::JSException::GetJNIEnvironmentError(isolate);
		return;
	}

	Local<Context> context = isolate->GetCurrentContext();
	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "getPagerEnabled", "()Z");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'getPagerEnabled' with signature '()Z'";
			LOGE(TAG, error);
				titanium::JSException::Error(isolate, error);
				return;
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		args.GetReturnValue().Set(Undefined(isolate));
		return;
	}

	jvalue* jArguments = 0;

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}
	jboolean jResult = (jboolean)env->CallBooleanMethodA(javaProxy, methodID, jArguments);


	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		Local<Value> jsException = titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
		return;
	}


	Local<Boolean> v8Result = titanium::TypeConverter::javaBooleanToJsBoolean(isolate, env, jResult);



	args.GetReturnValue().Set(v8Result);

}

void ViewProxy::setter_pagerEnabled(Local<Name> property, Local<Value> value, const PropertyCallbackInfo<void>& args)
{
	Isolate* isolate = args.GetIsolate();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		LOGE(TAG, "Failed to get environment, pagerEnabled wasn't set");
		return;
	}

	Local<Context> context = isolate->GetCurrentContext();

	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "setPagerEnabled", "(Z)V");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'setPagerEnabled' with signature '(Z)V'";
			LOGE(TAG, error);
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		return;
	}

	jvalue jArguments[1];

	if (!value->IsBoolean() && !value->IsNull()) {
		const char *error = "Invalid value, expected type Boolean.";
		LOGE(TAG, error);
	}
	
		if (!value->IsNull()) {
		Local<Boolean> arg_0 = value->ToBoolean(isolate);
		jArguments[0].z =
			titanium::TypeConverter::jsBooleanToJavaBoolean(
				env, arg_0);
	} else {
		jArguments[0].z = NULL;
	}

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		return;
	}
	env->CallVoidMethodA(javaProxy, methodID, jArguments);

	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
	}




}


void ViewProxy::getter_dragItemShadowOpacity(Local<Name> property, const PropertyCallbackInfo<Value>& args)
{
	Isolate* isolate = args.GetIsolate();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		titanium::JSException::GetJNIEnvironmentError(isolate);
		return;
	}

	Local<Context> context = isolate->GetCurrentContext();
	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "getDragItemShadowOpacity", "()F");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'getDragItemShadowOpacity' with signature '()F'";
			LOGE(TAG, error);
				titanium::JSException::Error(isolate, error);
				return;
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		args.GetReturnValue().Set(Undefined(isolate));
		return;
	}

	jvalue* jArguments = 0;

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}
	jfloat jResult = (jfloat)env->CallFloatMethodA(javaProxy, methodID, jArguments);


	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		Local<Value> jsException = titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
		return;
	}


	Local<Number> v8Result = titanium::TypeConverter::javaFloatToJsNumber(isolate, env, jResult);



	args.GetReturnValue().Set(v8Result);

}

void ViewProxy::setter_dragItemShadowOpacity(Local<Name> property, Local<Value> value, const PropertyCallbackInfo<void>& args)
{
	Isolate* isolate = args.GetIsolate();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		LOGE(TAG, "Failed to get environment, dragItemShadowOpacity wasn't set");
		return;
	}

	Local<Context> context = isolate->GetCurrentContext();

	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "setDragItemShadowOpacity", "(F)V");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'setDragItemShadowOpacity' with signature '(F)V'";
			LOGE(TAG, error);
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		return;
	}

	jvalue jArguments[1];

	
		if ((titanium::V8Util::isNaN(isolate, value) && !value->IsUndefined()) || value->ToString(context).FromMaybe(String::Empty(isolate))->Length() == 0) {
			const char *error = "Invalid value, expected type Number.";
			LOGE(TAG, error);
		}
	if (!value->IsNull()) {
		MaybeLocal<Number> arg_0 = value->ToNumber(context);
		if (arg_0.IsEmpty()) {
			const char *error = "Invalid argument at index 0, expected type Number and failed to coerce.";
			LOGE(TAG, error);
			jArguments[0].f = NULL;
		} else {
			jArguments[0].f =
				titanium::TypeConverter::jsNumberToJavaFloat(
					env, arg_0.ToLocalChecked());
		}
	} else {
		jArguments[0].f = NULL;
	}

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		return;
	}
	env->CallVoidMethodA(javaProxy, methodID, jArguments);

	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
	}




}


void ViewProxy::getter_disableBounce(Local<Name> property, const PropertyCallbackInfo<Value>& args)
{
	Isolate* isolate = args.GetIsolate();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		titanium::JSException::GetJNIEnvironmentError(isolate);
		return;
	}

	Local<Context> context = isolate->GetCurrentContext();
	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "getDisableBounce", "()Z");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'getDisableBounce' with signature '()Z'";
			LOGE(TAG, error);
				titanium::JSException::Error(isolate, error);
				return;
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		args.GetReturnValue().Set(Undefined(isolate));
		return;
	}

	jvalue* jArguments = 0;

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}
	jboolean jResult = (jboolean)env->CallBooleanMethodA(javaProxy, methodID, jArguments);


	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		Local<Value> jsException = titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
		return;
	}


	Local<Boolean> v8Result = titanium::TypeConverter::javaBooleanToJsBoolean(isolate, env, jResult);



	args.GetReturnValue().Set(v8Result);

}

void ViewProxy::setter_disableBounce(Local<Name> property, Local<Value> value, const PropertyCallbackInfo<void>& args)
{
	Isolate* isolate = args.GetIsolate();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		LOGE(TAG, "Failed to get environment, disableBounce wasn't set");
		return;
	}

	Local<Context> context = isolate->GetCurrentContext();

	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "setDisableBounce", "(Z)V");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'setDisableBounce' with signature '(Z)V'";
			LOGE(TAG, error);
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		return;
	}

	jvalue jArguments[1];

	if (!value->IsBoolean() && !value->IsNull()) {
		const char *error = "Invalid value, expected type Boolean.";
		LOGE(TAG, error);
	}
	
		if (!value->IsNull()) {
		Local<Boolean> arg_0 = value->ToBoolean(isolate);
		jArguments[0].z =
			titanium::TypeConverter::jsBooleanToJavaBoolean(
				env, arg_0);
	} else {
		jArguments[0].z = NULL;
	}

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		return;
	}
	env->CallVoidMethodA(javaProxy, methodID, jArguments);

	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
	}




}



void ViewProxy::setter_refreshControl_(Local<Name> property, Local<Value> value, const PropertyCallbackInfo<void>& args)
{
	Isolate* isolate = args.GetIsolate();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		LOGE(TAG, "Failed to get environment, refreshControl_ wasn't set");
		return;
	}

	Local<Context> context = isolate->GetCurrentContext();

	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "setRefreshControl_", "(Ljava/lang/Object;)V");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'setRefreshControl_' with signature '(Ljava/lang/Object;)V'";
			LOGE(TAG, error);
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		return;
	}

	jvalue jArguments[1];

	bool isNew_0;
	if (!value->IsNull()) {
		Local<Value> arg_0 = value;
		jArguments[0].l =
			titanium::TypeConverter::jsValueToJavaObject(
				isolate,
				env, arg_0, &isNew_0);
	} else {
		jArguments[0].l = NULL;
	}

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		return;
	}
	env->CallVoidMethodA(javaProxy, methodID, jArguments);

	proxy->unreferenceJavaObject(javaProxy);



			if (isNew_0) {
				env->DeleteLocalRef(jArguments[0].l);
			}


	if (env->ExceptionCheck()) {
		titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
	}




	Proxy::setProperty(property, value, args);
}


void ViewProxy::getter_verticalSpacing(Local<Name> property, const PropertyCallbackInfo<Value>& args)
{
	Isolate* isolate = args.GetIsolate();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		titanium::JSException::GetJNIEnvironmentError(isolate);
		return;
	}

	Local<Context> context = isolate->GetCurrentContext();
	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "getVerticalSpacing", "()I");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'getVerticalSpacing' with signature '()I'";
			LOGE(TAG, error);
				titanium::JSException::Error(isolate, error);
				return;
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		args.GetReturnValue().Set(Undefined(isolate));
		return;
	}

	jvalue* jArguments = 0;

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}
	jint jResult = (jint)env->CallIntMethodA(javaProxy, methodID, jArguments);


	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		Local<Value> jsException = titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
		return;
	}


	Local<Number> v8Result = titanium::TypeConverter::javaIntToJsNumber(isolate, env, jResult);



	args.GetReturnValue().Set(v8Result);

}

void ViewProxy::setter_verticalSpacing(Local<Name> property, Local<Value> value, const PropertyCallbackInfo<void>& args)
{
	Isolate* isolate = args.GetIsolate();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		LOGE(TAG, "Failed to get environment, verticalSpacing wasn't set");
		return;
	}

	Local<Context> context = isolate->GetCurrentContext();

	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "setVerticalSpacing", "(I)V");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'setVerticalSpacing' with signature '(I)V'";
			LOGE(TAG, error);
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		return;
	}

	jvalue jArguments[1];

	
		if ((titanium::V8Util::isNaN(isolate, value) && !value->IsUndefined()) || value->ToString(context).FromMaybe(String::Empty(isolate))->Length() == 0) {
			const char *error = "Invalid value, expected type Number.";
			LOGE(TAG, error);
		}
	if (!value->IsNull()) {
		MaybeLocal<Number> arg_0 = value->ToNumber(context);
		if (arg_0.IsEmpty()) {
			const char *error = "Invalid argument at index 0, expected type Number and failed to coerce.";
			LOGE(TAG, error);
			jArguments[0].i = NULL;
		} else {
			jArguments[0].i =
				titanium::TypeConverter::jsNumberToJavaInt(
					env, arg_0.ToLocalChecked());
		}
	} else {
		jArguments[0].i = NULL;
	}

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		return;
	}
	env->CallVoidMethodA(javaProxy, methodID, jArguments);

	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
	}




}


void ViewProxy::getter_wobble(Local<Name> property, const PropertyCallbackInfo<Value>& args)
{
	Isolate* isolate = args.GetIsolate();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		titanium::JSException::GetJNIEnvironmentError(isolate);
		return;
	}

	Local<Context> context = isolate->GetCurrentContext();
	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "getWobble", "()Z");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'getWobble' with signature '()Z'";
			LOGE(TAG, error);
				titanium::JSException::Error(isolate, error);
				return;
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		args.GetReturnValue().Set(Undefined(isolate));
		return;
	}

	jvalue* jArguments = 0;

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}
	jboolean jResult = (jboolean)env->CallBooleanMethodA(javaProxy, methodID, jArguments);


	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		Local<Value> jsException = titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
		return;
	}


	Local<Boolean> v8Result = titanium::TypeConverter::javaBooleanToJsBoolean(isolate, env, jResult);



	args.GetReturnValue().Set(v8Result);

}

void ViewProxy::setter_wobble(Local<Name> property, Local<Value> value, const PropertyCallbackInfo<void>& args)
{
	Isolate* isolate = args.GetIsolate();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		LOGE(TAG, "Failed to get environment, wobble wasn't set");
		return;
	}

	Local<Context> context = isolate->GetCurrentContext();

	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "setWobble", "(Z)V");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'setWobble' with signature '(Z)V'";
			LOGE(TAG, error);
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		return;
	}

	jvalue jArguments[1];

	if (!value->IsBoolean() && !value->IsNull()) {
		const char *error = "Invalid value, expected type Boolean.";
		LOGE(TAG, error);
	}
	
		if (!value->IsNull()) {
		Local<Boolean> arg_0 = value->ToBoolean(isolate);
		jArguments[0].z =
			titanium::TypeConverter::jsBooleanToJavaBoolean(
				env, arg_0);
	} else {
		jArguments[0].z = NULL;
	}

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		return;
	}
	env->CallVoidMethodA(javaProxy, methodID, jArguments);

	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
	}




}


void ViewProxy::getter_waterFallLayout(Local<Name> property, const PropertyCallbackInfo<Value>& args)
{
	Isolate* isolate = args.GetIsolate();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		titanium::JSException::GetJNIEnvironmentError(isolate);
		return;
	}

	Local<Context> context = isolate->GetCurrentContext();
	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "getWaterFallLayout", "()Z");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'getWaterFallLayout' with signature '()Z'";
			LOGE(TAG, error);
				titanium::JSException::Error(isolate, error);
				return;
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		args.GetReturnValue().Set(Undefined(isolate));
		return;
	}

	jvalue* jArguments = 0;

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}
	jboolean jResult = (jboolean)env->CallBooleanMethodA(javaProxy, methodID, jArguments);


	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		Local<Value> jsException = titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
		return;
	}


	Local<Boolean> v8Result = titanium::TypeConverter::javaBooleanToJsBoolean(isolate, env, jResult);



	args.GetReturnValue().Set(v8Result);

}

void ViewProxy::setter_waterFallLayout(Local<Name> property, Local<Value> value, const PropertyCallbackInfo<void>& args)
{
	Isolate* isolate = args.GetIsolate();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		LOGE(TAG, "Failed to get environment, waterFallLayout wasn't set");
		return;
	}

	Local<Context> context = isolate->GetCurrentContext();

	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "setWaterFallLayout", "(Z)V");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'setWaterFallLayout' with signature '(Z)V'";
			LOGE(TAG, error);
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		return;
	}

	jvalue jArguments[1];

	if (!value->IsBoolean() && !value->IsNull()) {
		const char *error = "Invalid value, expected type Boolean.";
		LOGE(TAG, error);
	}
	
		if (!value->IsNull()) {
		Local<Boolean> arg_0 = value->ToBoolean(isolate);
		jArguments[0].z =
			titanium::TypeConverter::jsBooleanToJavaBoolean(
				env, arg_0);
	} else {
		jArguments[0].z = NULL;
	}

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		return;
	}
	env->CallVoidMethodA(javaProxy, methodID, jArguments);

	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
	}




}


void ViewProxy::getter_scrollEnabled(Local<Name> property, const PropertyCallbackInfo<Value>& args)
{
	Isolate* isolate = args.GetIsolate();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		titanium::JSException::GetJNIEnvironmentError(isolate);
		return;
	}

	Local<Context> context = isolate->GetCurrentContext();
	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "getScrollEnabled", "()Z");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'getScrollEnabled' with signature '()Z'";
			LOGE(TAG, error);
				titanium::JSException::Error(isolate, error);
				return;
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		args.GetReturnValue().Set(Undefined(isolate));
		return;
	}

	jvalue* jArguments = 0;

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}
	jboolean jResult = (jboolean)env->CallBooleanMethodA(javaProxy, methodID, jArguments);


	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		Local<Value> jsException = titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
		return;
	}


	Local<Boolean> v8Result = titanium::TypeConverter::javaBooleanToJsBoolean(isolate, env, jResult);



	args.GetReturnValue().Set(v8Result);

}

void ViewProxy::setter_scrollEnabled(Local<Name> property, Local<Value> value, const PropertyCallbackInfo<void>& args)
{
	Isolate* isolate = args.GetIsolate();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		LOGE(TAG, "Failed to get environment, scrollEnabled wasn't set");
		return;
	}

	Local<Context> context = isolate->GetCurrentContext();

	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "setScrollEnabled", "(Z)V");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'setScrollEnabled' with signature '(Z)V'";
			LOGE(TAG, error);
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		return;
	}

	jvalue jArguments[1];

	if (!value->IsBoolean() && !value->IsNull()) {
		const char *error = "Invalid value, expected type Boolean.";
		LOGE(TAG, error);
	}
	
		if (!value->IsNull()) {
		Local<Boolean> arg_0 = value->ToBoolean(isolate);
		jArguments[0].z =
			titanium::TypeConverter::jsBooleanToJavaBoolean(
				env, arg_0);
	} else {
		jArguments[0].z = NULL;
	}

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		return;
	}
	env->CallVoidMethodA(javaProxy, methodID, jArguments);

	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
	}




}


void ViewProxy::getter_itemsBadgeEnabled(Local<Name> property, const PropertyCallbackInfo<Value>& args)
{
	Isolate* isolate = args.GetIsolate();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		titanium::JSException::GetJNIEnvironmentError(isolate);
		return;
	}

	Local<Context> context = isolate->GetCurrentContext();
	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "getItemsBadgeEnabled", "()Z");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'getItemsBadgeEnabled' with signature '()Z'";
			LOGE(TAG, error);
				titanium::JSException::Error(isolate, error);
				return;
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		args.GetReturnValue().Set(Undefined(isolate));
		return;
	}

	jvalue* jArguments = 0;

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}
	jboolean jResult = (jboolean)env->CallBooleanMethodA(javaProxy, methodID, jArguments);


	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		Local<Value> jsException = titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
		return;
	}


	Local<Boolean> v8Result = titanium::TypeConverter::javaBooleanToJsBoolean(isolate, env, jResult);



	args.GetReturnValue().Set(v8Result);

}

void ViewProxy::setter_itemsBadgeEnabled(Local<Name> property, Local<Value> value, const PropertyCallbackInfo<void>& args)
{
	Isolate* isolate = args.GetIsolate();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		LOGE(TAG, "Failed to get environment, itemsBadgeEnabled wasn't set");
		return;
	}

	Local<Context> context = isolate->GetCurrentContext();

	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "setItemsBadgeEnabled", "(Z)V");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'setItemsBadgeEnabled' with signature '(Z)V'";
			LOGE(TAG, error);
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		return;
	}

	jvalue jArguments[1];

	if (!value->IsBoolean() && !value->IsNull()) {
		const char *error = "Invalid value, expected type Boolean.";
		LOGE(TAG, error);
	}
	
		if (!value->IsNull()) {
		Local<Boolean> arg_0 = value->ToBoolean(isolate);
		jArguments[0].z =
			titanium::TypeConverter::jsBooleanToJavaBoolean(
				env, arg_0);
	} else {
		jArguments[0].z = NULL;
	}

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		return;
	}
	env->CallVoidMethodA(javaProxy, methodID, jArguments);

	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
	}




}


void ViewProxy::getter_minVerticalSpacing(Local<Name> property, const PropertyCallbackInfo<Value>& args)
{
	Isolate* isolate = args.GetIsolate();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		titanium::JSException::GetJNIEnvironmentError(isolate);
		return;
	}

	Local<Context> context = isolate->GetCurrentContext();
	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "getMinVerticalSpacing", "()I");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'getMinVerticalSpacing' with signature '()I'";
			LOGE(TAG, error);
				titanium::JSException::Error(isolate, error);
				return;
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		args.GetReturnValue().Set(Undefined(isolate));
		return;
	}

	jvalue* jArguments = 0;

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}
	jint jResult = (jint)env->CallIntMethodA(javaProxy, methodID, jArguments);


	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		Local<Value> jsException = titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
		return;
	}


	Local<Number> v8Result = titanium::TypeConverter::javaIntToJsNumber(isolate, env, jResult);



	args.GetReturnValue().Set(v8Result);

}

void ViewProxy::setter_minVerticalSpacing(Local<Name> property, Local<Value> value, const PropertyCallbackInfo<void>& args)
{
	Isolate* isolate = args.GetIsolate();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		LOGE(TAG, "Failed to get environment, minVerticalSpacing wasn't set");
		return;
	}

	Local<Context> context = isolate->GetCurrentContext();

	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "setMinVerticalSpacing", "(I)V");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'setMinVerticalSpacing' with signature '(I)V'";
			LOGE(TAG, error);
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		return;
	}

	jvalue jArguments[1];

	
		if ((titanium::V8Util::isNaN(isolate, value) && !value->IsUndefined()) || value->ToString(context).FromMaybe(String::Empty(isolate))->Length() == 0) {
			const char *error = "Invalid value, expected type Number.";
			LOGE(TAG, error);
		}
	if (!value->IsNull()) {
		MaybeLocal<Number> arg_0 = value->ToNumber(context);
		if (arg_0.IsEmpty()) {
			const char *error = "Invalid argument at index 0, expected type Number and failed to coerce.";
			LOGE(TAG, error);
			jArguments[0].i = NULL;
		} else {
			jArguments[0].i =
				titanium::TypeConverter::jsNumberToJavaInt(
					env, arg_0.ToLocalChecked());
		}
	} else {
		jArguments[0].i = NULL;
	}

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		return;
	}
	env->CallVoidMethodA(javaProxy, methodID, jArguments);

	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
	}




}


void ViewProxy::getter_scrollType(Local<Name> property, const PropertyCallbackInfo<Value>& args)
{
	Isolate* isolate = args.GetIsolate();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		titanium::JSException::GetJNIEnvironmentError(isolate);
		return;
	}

	Local<Context> context = isolate->GetCurrentContext();
	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "getScrollType", "()Ljava/lang/String;");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'getScrollType' with signature '()Ljava/lang/String;'";
			LOGE(TAG, error);
				titanium::JSException::Error(isolate, error);
				return;
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		args.GetReturnValue().Set(Undefined(isolate));
		return;
	}

	jvalue* jArguments = 0;

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}
	jstring jResult = (jstring)env->CallObjectMethodA(javaProxy, methodID, jArguments);


	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		Local<Value> jsException = titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
		return;
	}

	if (jResult == NULL) {
		args.GetReturnValue().Set(Null(isolate));
		return;
	}

	Local<Value> v8Result = titanium::TypeConverter::javaStringToJsString(isolate, env, jResult);

	env->DeleteLocalRef(jResult);


	args.GetReturnValue().Set(v8Result);

}

void ViewProxy::setter_scrollType(Local<Name> property, Local<Value> value, const PropertyCallbackInfo<void>& args)
{
	Isolate* isolate = args.GetIsolate();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		LOGE(TAG, "Failed to get environment, scrollType wasn't set");
		return;
	}

	Local<Context> context = isolate->GetCurrentContext();

	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "setScrollType", "(Ljava/lang/String;)V");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'setScrollType' with signature '(Ljava/lang/String;)V'";
			LOGE(TAG, error);
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		return;
	}

	jvalue jArguments[1];

	
	if (!value->IsNull()) {
		Local<Value> arg_0 = value;
		jArguments[0].l =
			titanium::TypeConverter::jsValueToJavaString(
				isolate,
				env, arg_0);
	} else {
		jArguments[0].l = NULL;
	}

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		return;
	}
	env->CallVoidMethodA(javaProxy, methodID, jArguments);

	proxy->unreferenceJavaObject(javaProxy);



				env->DeleteLocalRef(jArguments[0].l);


	if (env->ExceptionCheck()) {
		titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
	}




}


void ViewProxy::getter_horizontalSpacing(Local<Name> property, const PropertyCallbackInfo<Value>& args)
{
	Isolate* isolate = args.GetIsolate();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		titanium::JSException::GetJNIEnvironmentError(isolate);
		return;
	}

	Local<Context> context = isolate->GetCurrentContext();
	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "getHorizontalSpacing", "()I");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'getHorizontalSpacing' with signature '()I'";
			LOGE(TAG, error);
				titanium::JSException::Error(isolate, error);
				return;
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		args.GetReturnValue().Set(Undefined(isolate));
		return;
	}

	jvalue* jArguments = 0;

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}
	jint jResult = (jint)env->CallIntMethodA(javaProxy, methodID, jArguments);


	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		Local<Value> jsException = titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
		return;
	}


	Local<Number> v8Result = titanium::TypeConverter::javaIntToJsNumber(isolate, env, jResult);



	args.GetReturnValue().Set(v8Result);

}

void ViewProxy::setter_horizontalSpacing(Local<Name> property, Local<Value> value, const PropertyCallbackInfo<void>& args)
{
	Isolate* isolate = args.GetIsolate();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		LOGE(TAG, "Failed to get environment, horizontalSpacing wasn't set");
		return;
	}

	Local<Context> context = isolate->GetCurrentContext();

	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "setHorizontalSpacing", "(I)V");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'setHorizontalSpacing' with signature '(I)V'";
			LOGE(TAG, error);
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		return;
	}

	jvalue jArguments[1];

	
		if ((titanium::V8Util::isNaN(isolate, value) && !value->IsUndefined()) || value->ToString(context).FromMaybe(String::Empty(isolate))->Length() == 0) {
			const char *error = "Invalid value, expected type Number.";
			LOGE(TAG, error);
		}
	if (!value->IsNull()) {
		MaybeLocal<Number> arg_0 = value->ToNumber(context);
		if (arg_0.IsEmpty()) {
			const char *error = "Invalid argument at index 0, expected type Number and failed to coerce.";
			LOGE(TAG, error);
			jArguments[0].i = NULL;
		} else {
			jArguments[0].i =
				titanium::TypeConverter::jsNumberToJavaInt(
					env, arg_0.ToLocalChecked());
		}
	} else {
		jArguments[0].i = NULL;
	}

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		return;
	}
	env->CallVoidMethodA(javaProxy, methodID, jArguments);

	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
	}




}



void ViewProxy::setter_scrollIndicatorInsets(Local<Name> property, Local<Value> value, const PropertyCallbackInfo<void>& args)
{
	Isolate* isolate = args.GetIsolate();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		LOGE(TAG, "Failed to get environment, scrollIndicatorInsets wasn't set");
		return;
	}

	Local<Context> context = isolate->GetCurrentContext();

	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "setScrollIndicatorInsets", "(Ljava/lang/Object;)V");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'setScrollIndicatorInsets' with signature '(Ljava/lang/Object;)V'";
			LOGE(TAG, error);
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		return;
	}

	jvalue jArguments[1];

	bool isNew_0;
	if (!value->IsNull()) {
		Local<Value> arg_0 = value;
		jArguments[0].l =
			titanium::TypeConverter::jsValueToJavaObject(
				isolate,
				env, arg_0, &isNew_0);
	} else {
		jArguments[0].l = NULL;
	}

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		return;
	}
	env->CallVoidMethodA(javaProxy, methodID, jArguments);

	proxy->unreferenceJavaObject(javaProxy);



			if (isNew_0) {
				env->DeleteLocalRef(jArguments[0].l);
			}


	if (env->ExceptionCheck()) {
		titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
	}




	Proxy::setProperty(property, value, args);
}


void ViewProxy::getter_columnWidth(Local<Name> property, const PropertyCallbackInfo<Value>& args)
{
	Isolate* isolate = args.GetIsolate();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		titanium::JSException::GetJNIEnvironmentError(isolate);
		return;
	}

	Local<Context> context = isolate->GetCurrentContext();
	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "getColumnWidth", "()I");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'getColumnWidth' with signature '()I'";
			LOGE(TAG, error);
				titanium::JSException::Error(isolate, error);
				return;
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		args.GetReturnValue().Set(Undefined(isolate));
		return;
	}

	jvalue* jArguments = 0;

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}
	jint jResult = (jint)env->CallIntMethodA(javaProxy, methodID, jArguments);


	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		Local<Value> jsException = titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
		return;
	}


	Local<Number> v8Result = titanium::TypeConverter::javaIntToJsNumber(isolate, env, jResult);



	args.GetReturnValue().Set(v8Result);

}

void ViewProxy::setter_columnWidth(Local<Name> property, Local<Value> value, const PropertyCallbackInfo<void>& args)
{
	Isolate* isolate = args.GetIsolate();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		LOGE(TAG, "Failed to get environment, columnWidth wasn't set");
		return;
	}

	Local<Context> context = isolate->GetCurrentContext();

	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "setColumnWidth", "(I)V");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'setColumnWidth' with signature '(I)V'";
			LOGE(TAG, error);
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		return;
	}

	jvalue jArguments[1];

	
		if ((titanium::V8Util::isNaN(isolate, value) && !value->IsUndefined()) || value->ToString(context).FromMaybe(String::Empty(isolate))->Length() == 0) {
			const char *error = "Invalid value, expected type Number.";
			LOGE(TAG, error);
		}
	if (!value->IsNull()) {
		MaybeLocal<Number> arg_0 = value->ToNumber(context);
		if (arg_0.IsEmpty()) {
			const char *error = "Invalid argument at index 0, expected type Number and failed to coerce.";
			LOGE(TAG, error);
			jArguments[0].i = NULL;
		} else {
			jArguments[0].i =
				titanium::TypeConverter::jsNumberToJavaInt(
					env, arg_0.ToLocalChecked());
		}
	} else {
		jArguments[0].i = NULL;
	}

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		return;
	}
	env->CallVoidMethodA(javaProxy, methodID, jArguments);

	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
	}




}


void ViewProxy::getter_pagingEnabled(Local<Name> property, const PropertyCallbackInfo<Value>& args)
{
	Isolate* isolate = args.GetIsolate();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		titanium::JSException::GetJNIEnvironmentError(isolate);
		return;
	}

	Local<Context> context = isolate->GetCurrentContext();
	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "getPagingEnabled", "()Z");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'getPagingEnabled' with signature '()Z'";
			LOGE(TAG, error);
				titanium::JSException::Error(isolate, error);
				return;
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		args.GetReturnValue().Set(Undefined(isolate));
		return;
	}

	jvalue* jArguments = 0;

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}
	jboolean jResult = (jboolean)env->CallBooleanMethodA(javaProxy, methodID, jArguments);


	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		Local<Value> jsException = titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
		return;
	}


	Local<Boolean> v8Result = titanium::TypeConverter::javaBooleanToJsBoolean(isolate, env, jResult);



	args.GetReturnValue().Set(v8Result);

}

void ViewProxy::setter_pagingEnabled(Local<Name> property, Local<Value> value, const PropertyCallbackInfo<void>& args)
{
	Isolate* isolate = args.GetIsolate();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		LOGE(TAG, "Failed to get environment, pagingEnabled wasn't set");
		return;
	}

	Local<Context> context = isolate->GetCurrentContext();

	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "setPagingEnabled", "(Z)V");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'setPagingEnabled' with signature '(Z)V'";
			LOGE(TAG, error);
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		return;
	}

	jvalue jArguments[1];

	if (!value->IsBoolean() && !value->IsNull()) {
		const char *error = "Invalid value, expected type Boolean.";
		LOGE(TAG, error);
	}
	
		if (!value->IsNull()) {
		Local<Boolean> arg_0 = value->ToBoolean(isolate);
		jArguments[0].z =
			titanium::TypeConverter::jsBooleanToJavaBoolean(
				env, arg_0);
	} else {
		jArguments[0].z = NULL;
	}

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		return;
	}
	env->CallVoidMethodA(javaProxy, methodID, jArguments);

	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
	}




}


void ViewProxy::getter_showDeleteButton(Local<Name> property, const PropertyCallbackInfo<Value>& args)
{
	Isolate* isolate = args.GetIsolate();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		titanium::JSException::GetJNIEnvironmentError(isolate);
		return;
	}

	Local<Context> context = isolate->GetCurrentContext();
	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "getShowDeleteButton", "()Z");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'getShowDeleteButton' with signature '()Z'";
			LOGE(TAG, error);
				titanium::JSException::Error(isolate, error);
				return;
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		args.GetReturnValue().Set(Undefined(isolate));
		return;
	}

	jvalue* jArguments = 0;

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}
	jboolean jResult = (jboolean)env->CallBooleanMethodA(javaProxy, methodID, jArguments);


	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		Local<Value> jsException = titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
		return;
	}


	Local<Boolean> v8Result = titanium::TypeConverter::javaBooleanToJsBoolean(isolate, env, jResult);



	args.GetReturnValue().Set(v8Result);

}

void ViewProxy::setter_showDeleteButton(Local<Name> property, Local<Value> value, const PropertyCallbackInfo<void>& args)
{
	Isolate* isolate = args.GetIsolate();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		LOGE(TAG, "Failed to get environment, showDeleteButton wasn't set");
		return;
	}

	Local<Context> context = isolate->GetCurrentContext();

	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "setShowDeleteButton", "(Z)V");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'setShowDeleteButton' with signature '(Z)V'";
			LOGE(TAG, error);
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		return;
	}

	jvalue jArguments[1];

	if (!value->IsBoolean() && !value->IsNull()) {
		const char *error = "Invalid value, expected type Boolean.";
		LOGE(TAG, error);
	}
	
		if (!value->IsNull()) {
		Local<Boolean> arg_0 = value->ToBoolean(isolate);
		jArguments[0].z =
			titanium::TypeConverter::jsBooleanToJavaBoolean(
				env, arg_0);
	} else {
		jArguments[0].z = NULL;
	}

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		return;
	}
	env->CallVoidMethodA(javaProxy, methodID, jArguments);

	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
	}




}


void ViewProxy::getter_showVerticalScrollIndicator(Local<Name> property, const PropertyCallbackInfo<Value>& args)
{
	Isolate* isolate = args.GetIsolate();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		titanium::JSException::GetJNIEnvironmentError(isolate);
		return;
	}

	Local<Context> context = isolate->GetCurrentContext();
	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "getShowVerticalScrollIndicator", "()Z");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'getShowVerticalScrollIndicator' with signature '()Z'";
			LOGE(TAG, error);
				titanium::JSException::Error(isolate, error);
				return;
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		args.GetReturnValue().Set(Undefined(isolate));
		return;
	}

	jvalue* jArguments = 0;

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}
	jboolean jResult = (jboolean)env->CallBooleanMethodA(javaProxy, methodID, jArguments);


	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		Local<Value> jsException = titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
		return;
	}


	Local<Boolean> v8Result = titanium::TypeConverter::javaBooleanToJsBoolean(isolate, env, jResult);



	args.GetReturnValue().Set(v8Result);

}

void ViewProxy::setter_showVerticalScrollIndicator(Local<Name> property, Local<Value> value, const PropertyCallbackInfo<void>& args)
{
	Isolate* isolate = args.GetIsolate();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		LOGE(TAG, "Failed to get environment, showVerticalScrollIndicator wasn't set");
		return;
	}

	Local<Context> context = isolate->GetCurrentContext();

	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "setShowVerticalScrollIndicator", "(Z)V");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'setShowVerticalScrollIndicator' with signature '(Z)V'";
			LOGE(TAG, error);
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		return;
	}

	jvalue jArguments[1];

	if (!value->IsBoolean() && !value->IsNull()) {
		const char *error = "Invalid value, expected type Boolean.";
		LOGE(TAG, error);
	}
	
		if (!value->IsNull()) {
		Local<Boolean> arg_0 = value->ToBoolean(isolate);
		jArguments[0].z =
			titanium::TypeConverter::jsBooleanToJavaBoolean(
				env, arg_0);
	} else {
		jArguments[0].z = NULL;
	}

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		return;
	}
	env->CallVoidMethodA(javaProxy, methodID, jArguments);

	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
	}




}


void ViewProxy::getter_pagerFollowsBottomInset(Local<Name> property, const PropertyCallbackInfo<Value>& args)
{
	Isolate* isolate = args.GetIsolate();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		titanium::JSException::GetJNIEnvironmentError(isolate);
		return;
	}

	Local<Context> context = isolate->GetCurrentContext();
	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "getPagerFollowsBottomInset", "()Z");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'getPagerFollowsBottomInset' with signature '()Z'";
			LOGE(TAG, error);
				titanium::JSException::Error(isolate, error);
				return;
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		args.GetReturnValue().Set(Undefined(isolate));
		return;
	}

	jvalue* jArguments = 0;

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}
	jboolean jResult = (jboolean)env->CallBooleanMethodA(javaProxy, methodID, jArguments);


	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		Local<Value> jsException = titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
		return;
	}


	Local<Boolean> v8Result = titanium::TypeConverter::javaBooleanToJsBoolean(isolate, env, jResult);



	args.GetReturnValue().Set(v8Result);

}

void ViewProxy::setter_pagerFollowsBottomInset(Local<Name> property, Local<Value> value, const PropertyCallbackInfo<void>& args)
{
	Isolate* isolate = args.GetIsolate();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		LOGE(TAG, "Failed to get environment, pagerFollowsBottomInset wasn't set");
		return;
	}

	Local<Context> context = isolate->GetCurrentContext();

	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "setPagerFollowsBottomInset", "(Z)V");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'setPagerFollowsBottomInset' with signature '(Z)V'";
			LOGE(TAG, error);
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		return;
	}

	jvalue jArguments[1];

	if (!value->IsBoolean() && !value->IsNull()) {
		const char *error = "Invalid value, expected type Boolean.";
		LOGE(TAG, error);
	}
	
		if (!value->IsNull()) {
		Local<Boolean> arg_0 = value->ToBoolean(isolate);
		jArguments[0].z =
			titanium::TypeConverter::jsBooleanToJavaBoolean(
				env, arg_0);
	} else {
		jArguments[0].z = NULL;
	}

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		return;
	}
	env->CallVoidMethodA(javaProxy, methodID, jArguments);

	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
	}




}


void ViewProxy::getter_currentPageIndicatorTintColor(Local<Name> property, const PropertyCallbackInfo<Value>& args)
{
	Isolate* isolate = args.GetIsolate();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		titanium::JSException::GetJNIEnvironmentError(isolate);
		return;
	}

	Local<Context> context = isolate->GetCurrentContext();
	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "getCurrentPageIndicatorTintColor", "()Ljava/lang/String;");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'getCurrentPageIndicatorTintColor' with signature '()Ljava/lang/String;'";
			LOGE(TAG, error);
				titanium::JSException::Error(isolate, error);
				return;
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		args.GetReturnValue().Set(Undefined(isolate));
		return;
	}

	jvalue* jArguments = 0;

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}
	jstring jResult = (jstring)env->CallObjectMethodA(javaProxy, methodID, jArguments);


	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		Local<Value> jsException = titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
		return;
	}

	if (jResult == NULL) {
		args.GetReturnValue().Set(Null(isolate));
		return;
	}

	Local<Value> v8Result = titanium::TypeConverter::javaStringToJsString(isolate, env, jResult);

	env->DeleteLocalRef(jResult);


	args.GetReturnValue().Set(v8Result);

}

void ViewProxy::setter_currentPageIndicatorTintColor(Local<Name> property, Local<Value> value, const PropertyCallbackInfo<void>& args)
{
	Isolate* isolate = args.GetIsolate();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		LOGE(TAG, "Failed to get environment, currentPageIndicatorTintColor wasn't set");
		return;
	}

	Local<Context> context = isolate->GetCurrentContext();

	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "setCurrentPageIndicatorTintColor", "(Ljava/lang/String;)V");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'setCurrentPageIndicatorTintColor' with signature '(Ljava/lang/String;)V'";
			LOGE(TAG, error);
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		return;
	}

	jvalue jArguments[1];

	
	if (!value->IsNull()) {
		Local<Value> arg_0 = value;
		jArguments[0].l =
			titanium::TypeConverter::jsValueToJavaString(
				isolate,
				env, arg_0);
	} else {
		jArguments[0].l = NULL;
	}

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		return;
	}
	env->CallVoidMethodA(javaProxy, methodID, jArguments);

	proxy->unreferenceJavaObject(javaProxy);



				env->DeleteLocalRef(jArguments[0].l);


	if (env->ExceptionCheck()) {
		titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
	}




}



void ViewProxy::setter_deleteButtonImage(Local<Name> property, Local<Value> value, const PropertyCallbackInfo<void>& args)
{
	Isolate* isolate = args.GetIsolate();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		LOGE(TAG, "Failed to get environment, deleteButtonImage wasn't set");
		return;
	}

	Local<Context> context = isolate->GetCurrentContext();

	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "setDeleteButtonImage", "(Ljava/lang/Object;)V");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'setDeleteButtonImage' with signature '(Ljava/lang/Object;)V'";
			LOGE(TAG, error);
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		return;
	}

	jvalue jArguments[1];

	bool isNew_0;
	if (!value->IsNull()) {
		Local<Value> arg_0 = value;
		jArguments[0].l =
			titanium::TypeConverter::jsValueToJavaObject(
				isolate,
				env, arg_0, &isNew_0);
	} else {
		jArguments[0].l = NULL;
	}

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		return;
	}
	env->CallVoidMethodA(javaProxy, methodID, jArguments);

	proxy->unreferenceJavaObject(javaProxy);



			if (isNew_0) {
				env->DeleteLocalRef(jArguments[0].l);
			}


	if (env->ExceptionCheck()) {
		titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
	}




	Proxy::setProperty(property, value, args);
}


void ViewProxy::getter_pageCount(Local<Name> property, const PropertyCallbackInfo<Value>& args)
{
	Isolate* isolate = args.GetIsolate();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		titanium::JSException::GetJNIEnvironmentError(isolate);
		return;
	}

	Local<Context> context = isolate->GetCurrentContext();
	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "getPageCount", "()I");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'getPageCount' with signature '()I'";
			LOGE(TAG, error);
				titanium::JSException::Error(isolate, error);
				return;
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		args.GetReturnValue().Set(Undefined(isolate));
		return;
	}

	jvalue* jArguments = 0;

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}
	jint jResult = (jint)env->CallIntMethodA(javaProxy, methodID, jArguments);


	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		Local<Value> jsException = titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
		return;
	}


	Local<Number> v8Result = titanium::TypeConverter::javaIntToJsNumber(isolate, env, jResult);



	args.GetReturnValue().Set(v8Result);

}



void ViewProxy::getter_editable(Local<Name> property, const PropertyCallbackInfo<Value>& args)
{
	Isolate* isolate = args.GetIsolate();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		titanium::JSException::GetJNIEnvironmentError(isolate);
		return;
	}

	Local<Context> context = isolate->GetCurrentContext();
	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "getEditable", "()Z");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'getEditable' with signature '()Z'";
			LOGE(TAG, error);
				titanium::JSException::Error(isolate, error);
				return;
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		args.GetReturnValue().Set(Undefined(isolate));
		return;
	}

	jvalue* jArguments = 0;

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}
	jboolean jResult = (jboolean)env->CallBooleanMethodA(javaProxy, methodID, jArguments);


	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		Local<Value> jsException = titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
		return;
	}


	Local<Boolean> v8Result = titanium::TypeConverter::javaBooleanToJsBoolean(isolate, env, jResult);



	args.GetReturnValue().Set(v8Result);

}

void ViewProxy::setter_editable(Local<Name> property, Local<Value> value, const PropertyCallbackInfo<void>& args)
{
	Isolate* isolate = args.GetIsolate();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		LOGE(TAG, "Failed to get environment, editable wasn't set");
		return;
	}

	Local<Context> context = isolate->GetCurrentContext();

	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "setEditable", "(Z)V");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'setEditable' with signature '(Z)V'";
			LOGE(TAG, error);
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		return;
	}

	jvalue jArguments[1];

	if (!value->IsBoolean() && !value->IsNull()) {
		const char *error = "Invalid value, expected type Boolean.";
		LOGE(TAG, error);
	}
	
		if (!value->IsNull()) {
		Local<Boolean> arg_0 = value->ToBoolean(isolate);
		jArguments[0].z =
			titanium::TypeConverter::jsBooleanToJavaBoolean(
				env, arg_0);
	} else {
		jArguments[0].z = NULL;
	}

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		return;
	}
	env->CallVoidMethodA(javaProxy, methodID, jArguments);

	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
	}




}



void ViewProxy::setter_contentInsets(Local<Name> property, Local<Value> value, const PropertyCallbackInfo<void>& args)
{
	Isolate* isolate = args.GetIsolate();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		LOGE(TAG, "Failed to get environment, contentInsets wasn't set");
		return;
	}

	Local<Context> context = isolate->GetCurrentContext();

	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "setContentInsets", "(Ljava/lang/Object;)V");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'setContentInsets' with signature '(Ljava/lang/Object;)V'";
			LOGE(TAG, error);
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		return;
	}

	jvalue jArguments[1];

	bool isNew_0;
	if (!value->IsNull()) {
		Local<Value> arg_0 = value;
		jArguments[0].l =
			titanium::TypeConverter::jsValueToJavaObject(
				isolate,
				env, arg_0, &isNew_0);
	} else {
		jArguments[0].l = NULL;
	}

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		return;
	}
	env->CallVoidMethodA(javaProxy, methodID, jArguments);

	proxy->unreferenceJavaObject(javaProxy);



			if (isNew_0) {
				env->DeleteLocalRef(jArguments[0].l);
			}


	if (env->ExceptionCheck()) {
		titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
	}




	Proxy::setProperty(property, value, args);
}



void ViewProxy::setter_columnCount(Local<Name> property, Local<Value> value, const PropertyCallbackInfo<void>& args)
{
	Isolate* isolate = args.GetIsolate();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		LOGE(TAG, "Failed to get environment, columnCount wasn't set");
		return;
	}

	Local<Context> context = isolate->GetCurrentContext();

	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "setColumnCount", "(I)V");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'setColumnCount' with signature '(I)V'";
			LOGE(TAG, error);
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		return;
	}

	jvalue jArguments[1];

	
		if ((titanium::V8Util::isNaN(isolate, value) && !value->IsUndefined()) || value->ToString(context).FromMaybe(String::Empty(isolate))->Length() == 0) {
			const char *error = "Invalid value, expected type Number.";
			LOGE(TAG, error);
		}
	if (!value->IsNull()) {
		MaybeLocal<Number> arg_0 = value->ToNumber(context);
		if (arg_0.IsEmpty()) {
			const char *error = "Invalid argument at index 0, expected type Number and failed to coerce.";
			LOGE(TAG, error);
			jArguments[0].i = NULL;
		} else {
			jArguments[0].i =
				titanium::TypeConverter::jsNumberToJavaInt(
					env, arg_0.ToLocalChecked());
		}
	} else {
		jArguments[0].i = NULL;
	}

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		return;
	}
	env->CallVoidMethodA(javaProxy, methodID, jArguments);

	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
	}




	Proxy::setProperty(property, value, args);
}


void ViewProxy::getter_minHorizontalSpacing(Local<Name> property, const PropertyCallbackInfo<Value>& args)
{
	Isolate* isolate = args.GetIsolate();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		titanium::JSException::GetJNIEnvironmentError(isolate);
		return;
	}

	Local<Context> context = isolate->GetCurrentContext();
	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "getMinHorizontalSpacing", "()I");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'getMinHorizontalSpacing' with signature '()I'";
			LOGE(TAG, error);
				titanium::JSException::Error(isolate, error);
				return;
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		args.GetReturnValue().Set(Undefined(isolate));
		return;
	}

	jvalue* jArguments = 0;

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}
	jint jResult = (jint)env->CallIntMethodA(javaProxy, methodID, jArguments);


	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		Local<Value> jsException = titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
		return;
	}


	Local<Number> v8Result = titanium::TypeConverter::javaIntToJsNumber(isolate, env, jResult);



	args.GetReturnValue().Set(v8Result);

}

void ViewProxy::setter_minHorizontalSpacing(Local<Name> property, Local<Value> value, const PropertyCallbackInfo<void>& args)
{
	Isolate* isolate = args.GetIsolate();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		LOGE(TAG, "Failed to get environment, minHorizontalSpacing wasn't set");
		return;
	}

	Local<Context> context = isolate->GetCurrentContext();

	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "setMinHorizontalSpacing", "(I)V");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'setMinHorizontalSpacing' with signature '(I)V'";
			LOGE(TAG, error);
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		return;
	}

	jvalue jArguments[1];

	
		if ((titanium::V8Util::isNaN(isolate, value) && !value->IsUndefined()) || value->ToString(context).FromMaybe(String::Empty(isolate))->Length() == 0) {
			const char *error = "Invalid value, expected type Number.";
			LOGE(TAG, error);
		}
	if (!value->IsNull()) {
		MaybeLocal<Number> arg_0 = value->ToNumber(context);
		if (arg_0.IsEmpty()) {
			const char *error = "Invalid argument at index 0, expected type Number and failed to coerce.";
			LOGE(TAG, error);
			jArguments[0].i = NULL;
		} else {
			jArguments[0].i =
				titanium::TypeConverter::jsNumberToJavaInt(
					env, arg_0.ToLocalChecked());
		}
	} else {
		jArguments[0].i = NULL;
	}

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		return;
	}
	env->CallVoidMethodA(javaProxy, methodID, jArguments);

	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
	}




}


void ViewProxy::getter_lazyLoadingEnabled(Local<Name> property, const PropertyCallbackInfo<Value>& args)
{
	Isolate* isolate = args.GetIsolate();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		titanium::JSException::GetJNIEnvironmentError(isolate);
		return;
	}

	Local<Context> context = isolate->GetCurrentContext();
	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "getLazyLoadingEnabled", "()Z");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'getLazyLoadingEnabled' with signature '()Z'";
			LOGE(TAG, error);
				titanium::JSException::Error(isolate, error);
				return;
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		args.GetReturnValue().Set(Undefined(isolate));
		return;
	}

	jvalue* jArguments = 0;

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}
	jboolean jResult = (jboolean)env->CallBooleanMethodA(javaProxy, methodID, jArguments);


	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		Local<Value> jsException = titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
		return;
	}


	Local<Boolean> v8Result = titanium::TypeConverter::javaBooleanToJsBoolean(isolate, env, jResult);



	args.GetReturnValue().Set(v8Result);

}

void ViewProxy::setter_lazyLoadingEnabled(Local<Name> property, Local<Value> value, const PropertyCallbackInfo<void>& args)
{
	Isolate* isolate = args.GetIsolate();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		LOGE(TAG, "Failed to get environment, lazyLoadingEnabled wasn't set");
		return;
	}

	Local<Context> context = isolate->GetCurrentContext();

	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "setLazyLoadingEnabled", "(Z)V");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'setLazyLoadingEnabled' with signature '(Z)V'";
			LOGE(TAG, error);
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		return;
	}

	jvalue jArguments[1];

	if (!value->IsBoolean() && !value->IsNull()) {
		const char *error = "Invalid value, expected type Boolean.";
		LOGE(TAG, error);
	}
	
		if (!value->IsNull()) {
		Local<Boolean> arg_0 = value->ToBoolean(isolate);
		jArguments[0].z =
			titanium::TypeConverter::jsBooleanToJavaBoolean(
				env, arg_0);
	} else {
		jArguments[0].z = NULL;
	}

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		return;
	}
	env->CallVoidMethodA(javaProxy, methodID, jArguments);

	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
	}




}


void ViewProxy::getter_scrollToBottomAfterSetData(Local<Name> property, const PropertyCallbackInfo<Value>& args)
{
	Isolate* isolate = args.GetIsolate();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		titanium::JSException::GetJNIEnvironmentError(isolate);
		return;
	}

	Local<Context> context = isolate->GetCurrentContext();
	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "getScrollToBottomAfterSetData", "()Z");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'getScrollToBottomAfterSetData' with signature '()Z'";
			LOGE(TAG, error);
				titanium::JSException::Error(isolate, error);
				return;
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		args.GetReturnValue().Set(Undefined(isolate));
		return;
	}

	jvalue* jArguments = 0;

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}
	jboolean jResult = (jboolean)env->CallBooleanMethodA(javaProxy, methodID, jArguments);


	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		Local<Value> jsException = titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
		return;
	}


	Local<Boolean> v8Result = titanium::TypeConverter::javaBooleanToJsBoolean(isolate, env, jResult);



	args.GetReturnValue().Set(v8Result);

}

void ViewProxy::setter_scrollToBottomAfterSetData(Local<Name> property, Local<Value> value, const PropertyCallbackInfo<void>& args)
{
	Isolate* isolate = args.GetIsolate();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		LOGE(TAG, "Failed to get environment, scrollToBottomAfterSetData wasn't set");
		return;
	}

	Local<Context> context = isolate->GetCurrentContext();

	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "setScrollToBottomAfterSetData", "(Z)V");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'setScrollToBottomAfterSetData' with signature '(Z)V'";
			LOGE(TAG, error);
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		return;
	}

	jvalue jArguments[1];

	if (!value->IsBoolean() && !value->IsNull()) {
		const char *error = "Invalid value, expected type Boolean.";
		LOGE(TAG, error);
	}
	
		if (!value->IsNull()) {
		Local<Boolean> arg_0 = value->ToBoolean(isolate);
		jArguments[0].z =
			titanium::TypeConverter::jsBooleanToJavaBoolean(
				env, arg_0);
	} else {
		jArguments[0].z = NULL;
	}

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		return;
	}
	env->CallVoidMethodA(javaProxy, methodID, jArguments);

	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
	}




}


void ViewProxy::getter_layoutManager(Local<Name> property, const PropertyCallbackInfo<Value>& args)
{
	Isolate* isolate = args.GetIsolate();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		titanium::JSException::GetJNIEnvironmentError(isolate);
		return;
	}

	Local<Context> context = isolate->GetCurrentContext();
	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "getLayoutManager", "()Landroidx/recyclerview/widget/RecyclerView/LayoutManager;");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'getLayoutManager' with signature '()Landroidx/recyclerview/widget/RecyclerView/LayoutManager;'";
			LOGE(TAG, error);
				titanium::JSException::Error(isolate, error);
				return;
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		args.GetReturnValue().Set(Undefined(isolate));
		return;
	}

	jvalue* jArguments = 0;

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}
	jobject jResult = (jobject)env->CallObjectMethodA(javaProxy, methodID, jArguments);


	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		Local<Value> jsException = titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
		return;
	}

	if (jResult == NULL) {
		args.GetReturnValue().Set(Null(isolate));
		return;
	}

	Local<Value> v8Result = titanium::TypeConverter::javaObjectToJsValue(isolate, env, jResult);

	env->DeleteLocalRef(jResult);


	args.GetReturnValue().Set(v8Result);

}



void ViewProxy::getter_showHorizontalScrollIndicator(Local<Name> property, const PropertyCallbackInfo<Value>& args)
{
	Isolate* isolate = args.GetIsolate();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		titanium::JSException::GetJNIEnvironmentError(isolate);
		return;
	}

	Local<Context> context = isolate->GetCurrentContext();
	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "getShowHorizontalScrollIndicator", "()Z");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'getShowHorizontalScrollIndicator' with signature '()Z'";
			LOGE(TAG, error);
				titanium::JSException::Error(isolate, error);
				return;
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		args.GetReturnValue().Set(Undefined(isolate));
		return;
	}

	jvalue* jArguments = 0;

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}
	jboolean jResult = (jboolean)env->CallBooleanMethodA(javaProxy, methodID, jArguments);


	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		Local<Value> jsException = titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
		return;
	}


	Local<Boolean> v8Result = titanium::TypeConverter::javaBooleanToJsBoolean(isolate, env, jResult);



	args.GetReturnValue().Set(v8Result);

}

void ViewProxy::setter_showHorizontalScrollIndicator(Local<Name> property, Local<Value> value, const PropertyCallbackInfo<void>& args)
{
	Isolate* isolate = args.GetIsolate();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		LOGE(TAG, "Failed to get environment, showHorizontalScrollIndicator wasn't set");
		return;
	}

	Local<Context> context = isolate->GetCurrentContext();

	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "setShowHorizontalScrollIndicator", "(Z)V");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'setShowHorizontalScrollIndicator' with signature '(Z)V'";
			LOGE(TAG, error);
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		return;
	}

	jvalue jArguments[1];

	if (!value->IsBoolean() && !value->IsNull()) {
		const char *error = "Invalid value, expected type Boolean.";
		LOGE(TAG, error);
	}
	
		if (!value->IsNull()) {
		Local<Boolean> arg_0 = value->ToBoolean(isolate);
		jArguments[0].z =
			titanium::TypeConverter::jsBooleanToJavaBoolean(
				env, arg_0);
	} else {
		jArguments[0].z = NULL;
	}

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		return;
	}
	env->CallVoidMethodA(javaProxy, methodID, jArguments);

	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
	}




}



void ViewProxy::setter_currentPage(Local<Name> property, Local<Value> value, const PropertyCallbackInfo<void>& args)
{
	Isolate* isolate = args.GetIsolate();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		LOGE(TAG, "Failed to get environment, currentPage wasn't set");
		return;
	}

	Local<Context> context = isolate->GetCurrentContext();

	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "setCurrentPage", "(I)V");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'setCurrentPage' with signature '(I)V'";
			LOGE(TAG, error);
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		return;
	}

	jvalue jArguments[1];

	
		if ((titanium::V8Util::isNaN(isolate, value) && !value->IsUndefined()) || value->ToString(context).FromMaybe(String::Empty(isolate))->Length() == 0) {
			const char *error = "Invalid value, expected type Number.";
			LOGE(TAG, error);
		}
	if (!value->IsNull()) {
		MaybeLocal<Number> arg_0 = value->ToNumber(context);
		if (arg_0.IsEmpty()) {
			const char *error = "Invalid argument at index 0, expected type Number and failed to coerce.";
			LOGE(TAG, error);
			jArguments[0].i = NULL;
		} else {
			jArguments[0].i =
				titanium::TypeConverter::jsNumberToJavaInt(
					env, arg_0.ToLocalChecked());
		}
	} else {
		jArguments[0].i = NULL;
	}

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		return;
	}
	env->CallVoidMethodA(javaProxy, methodID, jArguments);

	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
	}




	Proxy::setProperty(property, value, args);
}



void ViewProxy::setter_items(Local<Name> property, Local<Value> value, const PropertyCallbackInfo<void>& args)
{
	Isolate* isolate = args.GetIsolate();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		LOGE(TAG, "Failed to get environment, items wasn't set");
		return;
	}

	Local<Context> context = isolate->GetCurrentContext();

	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "setItems", "(Lorg/appcelerator/kroll/KrollDict;)V");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'setItems' with signature '(Lorg/appcelerator/kroll/KrollDict;)V'";
			LOGE(TAG, error);
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		return;
	}

	jvalue jArguments[1];

	bool isNew_0;
	if (!value->IsNull()) {
		Local<Value> arg_0 = value;
		jArguments[0].l =
			titanium::TypeConverter::jsObjectToJavaKrollDict(
				isolate,
				env, arg_0, &isNew_0);
	} else {
		jArguments[0].l = NULL;
	}

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		return;
	}
	env->CallVoidMethodA(javaProxy, methodID, jArguments);

	proxy->unreferenceJavaObject(javaProxy);



			if (isNew_0) {
				env->DeleteLocalRef(jArguments[0].l);
			}


	if (env->ExceptionCheck()) {
		titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
	}




	Proxy::setProperty(property, value, args);
}


void ViewProxy::getter_pageIndicatorTintColor(Local<Name> property, const PropertyCallbackInfo<Value>& args)
{
	Isolate* isolate = args.GetIsolate();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		titanium::JSException::GetJNIEnvironmentError(isolate);
		return;
	}

	Local<Context> context = isolate->GetCurrentContext();
	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "getPageIndicatorTintColor", "()Ljava/lang/String;");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'getPageIndicatorTintColor' with signature '()Ljava/lang/String;'";
			LOGE(TAG, error);
				titanium::JSException::Error(isolate, error);
				return;
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		args.GetReturnValue().Set(Undefined(isolate));
		return;
	}

	jvalue* jArguments = 0;

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}
	jstring jResult = (jstring)env->CallObjectMethodA(javaProxy, methodID, jArguments);


	proxy->unreferenceJavaObject(javaProxy);



	if (env->ExceptionCheck()) {
		Local<Value> jsException = titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
		return;
	}

	if (jResult == NULL) {
		args.GetReturnValue().Set(Null(isolate));
		return;
	}

	Local<Value> v8Result = titanium::TypeConverter::javaStringToJsString(isolate, env, jResult);

	env->DeleteLocalRef(jResult);


	args.GetReturnValue().Set(v8Result);

}

void ViewProxy::setter_pageIndicatorTintColor(Local<Name> property, Local<Value> value, const PropertyCallbackInfo<void>& args)
{
	Isolate* isolate = args.GetIsolate();
	HandleScope scope(isolate);

	JNIEnv *env = titanium::JNIScope::getEnv();
	if (!env) {
		LOGE(TAG, "Failed to get environment, pageIndicatorTintColor wasn't set");
		return;
	}

	Local<Context> context = isolate->GetCurrentContext();

	static jmethodID methodID = NULL;
	if (!methodID) {
		methodID = env->GetMethodID(ViewProxy::javaClass, "setPageIndicatorTintColor", "(Ljava/lang/String;)V");
		if (!methodID) {
			const char *error = "Couldn't find proxy method 'setPageIndicatorTintColor' with signature '(Ljava/lang/String;)V'";
			LOGE(TAG, error);
		}
	}

	Local<Object> holder = args.Holder();
	if (!JavaObject::isJavaObject(holder)) {
		holder = holder->FindInstanceInPrototypeChain(getProxyTemplate(isolate));
	}
	if (holder.IsEmpty() || holder->IsNull()) {
		if (!moduleInstance.IsEmpty()) {
			holder = moduleInstance.Get(isolate);
			if (holder.IsEmpty() || holder->IsNull()) {
				LOGE(TAG, "Couldn't obtain argument holder");
				args.GetReturnValue().Set(v8::Undefined(isolate));
				return;
			}
		} else {
			LOGE(TAG, "Couldn't obtain argument holder");
			args.GetReturnValue().Set(v8::Undefined(isolate));
			return;
		}
	}
	titanium::Proxy* proxy = NativeObject::Unwrap<titanium::Proxy>(holder);
	if (!proxy) {
		return;
	}

	jvalue jArguments[1];

	
	if (!value->IsNull()) {
		Local<Value> arg_0 = value;
		jArguments[0].l =
			titanium::TypeConverter::jsValueToJavaString(
				isolate,
				env, arg_0);
	} else {
		jArguments[0].l = NULL;
	}

	jobject javaProxy = proxy->getJavaObject();
	if (javaProxy == NULL) {
		return;
	}
	env->CallVoidMethodA(javaProxy, methodID, jArguments);

	proxy->unreferenceJavaObject(javaProxy);



				env->DeleteLocalRef(jArguments[0].l);


	if (env->ExceptionCheck()) {
		titanium::JSException::fromJavaException(isolate);
		env->ExceptionClear();
	}




}



	} // namespace tisortablegrid
} // sortablegrid
} // marcbender
} // de

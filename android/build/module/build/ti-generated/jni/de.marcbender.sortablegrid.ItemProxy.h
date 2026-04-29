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

class ItemProxy : public titanium::Proxy
{
public:
	explicit ItemProxy();

	static void bindProxy(v8::Local<v8::Object>, v8::Local<v8::Context>);
	static v8::Local<v8::FunctionTemplate> getProxyTemplate(v8::Isolate*);
	static v8::Local<v8::FunctionTemplate> getProxyTemplate(v8::Local<v8::Context>);
	static void dispose(v8::Isolate*);

	static jclass javaClass;

private:
	static v8::Persistent<v8::FunctionTemplate> proxyTemplate;
	static v8::Persistent<v8::Object> moduleInstance;

	// Methods -----------------------------------------------------------
	static void getBadgeTintColor(const v8::FunctionCallbackInfo<v8::Value>&);
	static void getBadgeValue(const v8::FunctionCallbackInfo<v8::Value>&);
	static void setCanBeMoved(const v8::FunctionCallbackInfo<v8::Value>&);
	static void getPosition(const v8::FunctionCallbackInfo<v8::Value>&);
	static void getCanBeDeleted(const v8::FunctionCallbackInfo<v8::Value>&);
	static void setBadgeTintColor(const v8::FunctionCallbackInfo<v8::Value>&);
	static void setBadgeValue(const v8::FunctionCallbackInfo<v8::Value>&);
	static void setCanBeDeleted(const v8::FunctionCallbackInfo<v8::Value>&);
	static void getCanBeMoved(const v8::FunctionCallbackInfo<v8::Value>&);
	static void getBadge(const v8::FunctionCallbackInfo<v8::Value>&);
	static void setBadge(const v8::FunctionCallbackInfo<v8::Value>&);

	// Dynamic property accessors ----------------------------------------
	static void getter_badge(v8::Local<v8::Name> name, const v8::PropertyCallbackInfo<v8::Value>& info);
	static void setter_badge(v8::Local<v8::Name> name, v8::Local<v8::Value> value, const v8::PropertyCallbackInfo<void>& info);
	static void getter_canBeDeleted(v8::Local<v8::Name> name, const v8::PropertyCallbackInfo<v8::Value>& info);
	static void setter_canBeDeleted(v8::Local<v8::Name> name, v8::Local<v8::Value> value, const v8::PropertyCallbackInfo<void>& info);
	static void getter_badgeTintColor(v8::Local<v8::Name> name, const v8::PropertyCallbackInfo<v8::Value>& info);
	static void setter_badgeTintColor(v8::Local<v8::Name> name, v8::Local<v8::Value> value, const v8::PropertyCallbackInfo<void>& info);
	static void getter_badgeValue(v8::Local<v8::Name> name, const v8::PropertyCallbackInfo<v8::Value>& info);
	static void setter_badgeValue(v8::Local<v8::Name> name, v8::Local<v8::Value> value, const v8::PropertyCallbackInfo<void>& info);
	static void getter_position(v8::Local<v8::Name> name, const v8::PropertyCallbackInfo<v8::Value>& info);
	static void getter_canBeMoved(v8::Local<v8::Name> name, const v8::PropertyCallbackInfo<v8::Value>& info);
	static void setter_canBeMoved(v8::Local<v8::Name> name, v8::Local<v8::Value> value, const v8::PropertyCallbackInfo<void>& info);

};

	} // namespace tisortablegrid
} // sortablegrid
} // marcbender
} // de

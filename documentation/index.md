# de.marcbender.sortablegrid

A Titanium module providing a sortable grid view (similar to the iOS home screen) with drag-and-drop reordering, edit mode, badges, and both vertical and horizontal scroll layouts.

## Demo

| iOS | Android |
|-----|---------|
| ![iOS Screenshot](iOS-Screenshot.png) | ![Android Screenshot](Android-Screenshot.png) |

## Quick Start

```javascript
var sortableGridModule = require('de.marcbender.sortablegrid');

var gridView = sortableGridModule.createView({
    top: 0,
    left: 0,
    width: Ti.UI.FILL,
    height: Ti.UI.FILL,
    columnCount: 3,
    minHorizontalSpacing: 10,
    minVerticalSpacing: 10,
    wobble: true,
    showDeleteButton: true,
    itemsBadgeEnabled: true
});

// Create items
var items = [];
for (var i = 0; i < 12; i++) {
    var item = sortableGridModule.createItem({
        id: i + 1,
        height: Ti.UI.SIZE,
        width: Ti.UI.FILL,
        canBeDeleted: true,
        canBeMoved: true,
        badge: true,
        badgeValue: i * 5
    });

    item.add(Ti.UI.createLabel({
        text: 'Cell ' + (i + 1),
        backgroundColor: '#3498db',
        width: Ti.UI.FILL,
        height: 120,
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        color: '#fff'
    }));

    items.push(item);
}

gridView.data = items;
win.add(gridView);
```

## Grid View Properties

All properties can be set at creation time or changed at runtime.

### columnCount

Number of columns in vertical layout. In horizontal layout, controls the number of columns per page.

- **Type:** Number
- **Default:** 3
- **Platforms:** iOS, Android

```javascript
// At creation
var gridView = sortableGridModule.createView({ columnCount: 4 });

// At runtime
gridView.columnCount = 4;
```

### rowCount

Number of rows per page in horizontal layout. When `waterFallLayout` is `false`, items are arranged in a grid with `rowCount` rows and `columnCount` columns per page. When `waterFallLayout` is `true`, items keep their natural heights with `rowCount` items per column per page.

- **Type:** Number
- **Default:** 0 (disabled)
- **Platforms:** iOS, Android

```javascript
// 3 columns × 4 rows per page in horizontal mode
var gridView = sortableGridModule.createView({
    scrollType: 'horizontal',
    columnCount: 3,
    rowCount: 4
});

// At runtime
gridView.rowCount = 4;
```

### minHorizontalSpacing

Minimum horizontal spacing between cells.

- **Type:** Number
- **Default:** 0
- **Platforms:** iOS, Android

```javascript
var gridView = sortableGridModule.createView({ minHorizontalSpacing: 10 });

// At runtime
gridView.minHorizontalSpacing = 10;
```

### minVerticalSpacing

Minimum vertical spacing between cells.

- **Type:** Number
- **Default:** 0
- **Platforms:** iOS, Android

```javascript
var gridView = sortableGridModule.createView({ minVerticalSpacing: 10 });

// At runtime
gridView.minVerticalSpacing = 10;
```

### scrollType

Scroll direction of the grid.

- **Type:** String
- **Default:** `"vertical"`
- **Values:** `"vertical"` or `"horizontal"`
- **Platforms:** iOS, Android

```javascript
// Vertical scrolling (default)
gridView.scrollType = 'vertical';

// Horizontal scrolling
gridView.scrollType = 'horizontal';
```

When `scrollType` is `"horizontal"`:
- `columnCount` controls the number of columns visible per page
- `rowCount` controls the number of rows per column per page
- Items scroll horizontally, with `rowCount × columnCount` items per page

### waterFallLayout

Enable waterfall (Pinterest-style) staggered layout where items have varying heights.

- **Type:** Boolean
- **Default:** false
- **Platforms:** iOS, Android

```javascript
var gridView = sortableGridModule.createView({
    waterFallLayout: true,
    columnCount: 3,
    scrollType: 'vertical'
});
```

### wobble

Enable wobble animation on items when in edit mode.

- **Type:** Boolean
- **Default:** false
- **Platforms:** iOS, Android

```javascript
var gridView = sortableGridModule.createView({ wobble: true });

// At runtime
gridView.wobble = true;
```

### showDeleteButton

Show delete buttons on items when in edit mode.

- **Type:** Boolean
- **Default:** false
- **Platforms:** iOS, Android

```javascript
var gridView = sortableGridModule.createView({ showDeleteButton: true });

// At runtime
gridView.showDeleteButton = true;
```

### deleteButtonImage

Custom image for the delete button. If not set, a default red circle is used.

- **Type:** Image (Ti.Blob or String path)
- **Default:** null (red circle)
- **Platforms:** iOS, Android

```javascript
var gridView = sortableGridModule.createView({
    showDeleteButton: true,
    deleteButtonImage: '/images/close.png'
});

// At runtime
gridView.deleteButtonImage = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, 'images/close.png').read();
```

### itemsBadgeEnabled

Enable badge display on items.

- **Type:** Boolean
- **Default:** false
- **Platforms:** iOS, Android

```javascript
var gridView = sortableGridModule.createView({ itemsBadgeEnabled: true });

// At runtime
gridView.itemsBadgeEnabled = true;
```

### pagingEnabled

Enable snap-to-page scrolling. Each page fits `rowCount × columnCount` items (horizontal) or a screenful of items (vertical).

- **Type:** Boolean
- **Default:** false
- **Platforms:** iOS, Android

```javascript
var gridView = sortableGridModule.createView({ pagingEnabled: true });
```

### pagerEnabled

Show a page indicator (UIPageControl on iOS, PageIndicatorView on Android) at the bottom of the grid.

- **Type:** Boolean
- **Default:** false
- **Platforms:** iOS, Android

```javascript
var gridView = sortableGridModule.createView({ pagerEnabled: true });
```

### pagerFollowsBottomInset

Pager repositions when content insets change (e.g., when the keyboard appears). Useful for grids inside scrollable containers.

- **Type:** Boolean
- **Default:** false
- **Platforms:** iOS

```javascript
var gridView = sortableGridModule.createView({
    pagerEnabled: true,
    pagerFollowsBottomInset: true
});
```

### pageIndicatorTintColor

Color for inactive page indicator dots.

- **Type:** String (hex color)
- **Default:** System default
- **Platforms:** iOS, Android

```javascript
gridView.pageIndicatorTintColor = '#cccccc';
```

### currentPageIndicatorTintColor

Color for the current page indicator dot.

- **Type:** String (hex color)
- **Default:** System default
- **Platforms:** iOS, Android

```javascript
gridView.currentPageIndicatorTintColor = '#3498db';
```

### currentPage

Get or set the current page (0-based index).

- **Type:** Number (read/write)
- **Platforms:** iOS, Android

```javascript
// Set current page
gridView.currentPage = 2;

// Get current page
var page = gridView.currentPage;
```

### pageCount

Get the total number of pages (read-only).

- **Type:** Number (read-only)
- **Platforms:** iOS, Android

```javascript
var totalPages = gridView.pageCount;
```

### contentInsets

Content insets for the grid — padding inside the scroll view.

- **Type:** Object `{ top, left, bottom, right }`
- **Default:** `{ top: 0, left: 0, bottom: 0, right: 0 }`
- **Platforms:** iOS, Android

```javascript
// At creation
var gridView = sortableGridModule.createView({
    contentInsets: { top: 20, left: 10, bottom: 20, right: 10 }
});

// At runtime
gridView.setContentInsets({ top: 20, left: 10, bottom: 20, right: 10 });

// With animated option (iOS only)
gridView.setContentInsets({
    top: 20, left: 10, bottom: 20, right: 10
}, { animated: true, duration: 300 });
```

### scrollIndicatorInsets

Insets for the scroll indicator, allowing it to be offset from the content area.

- **Type:** Object `{ top, left, bottom, right }`
- **Default:** `{ top: 0, left: 0, bottom: 0, right: 0 }`
- **Platforms:** iOS, Android

```javascript
gridView.setScrollIndicatorInsets({ top: 20, left: 0, bottom: 0, right: 0 });
```

### disableBounce

Disable the scroll view bounce effect.

- **Type:** Boolean
- **Default:** false
- **Platforms:** iOS, Android

```javascript
var gridView = sortableGridModule.createView({ disableBounce: true });
```

### showVerticalScrollIndicator

Show the vertical scroll indicator.

- **Type:** Boolean
- **Default:** false
- **Platforms:** iOS, Android

```javascript
gridView.showVerticalScrollIndicator = true;
```

### showHorizontalScrollIndicator

Show the horizontal scroll indicator.

- **Type:** Boolean
- **Default:** false
- **Platforms:** iOS, Android

```javascript
gridView.showHorizontalScrollIndicator = true;
```

### scrollEnabled

Enable or disable scrolling.

- **Type:** Boolean
- **Default:** true
- **Platforms:** iOS, Android

```javascript
gridView.scrollEnabled = false;
```

### scrollToBottomAfterSetData

Automatically scroll to the bottom after setting data.

- **Type:** Boolean
- **Default:** false
- **Platforms:** iOS, Android

```javascript
var gridView = sortableGridModule.createView({ scrollToBottomAfterSetData: true });
```

### dragItemShadowOpacity

Opacity of the shadow shown beneath the item being dragged (0.0 = invisible, 1.0 = fully opaque).

- **Type:** Number
- **Default:** 1.0
- **Platforms:** iOS, Android

```javascript
gridView.dragItemShadowOpacity = 0.5;
```

### lazyLoadingEnabled

Suspend image loading during scrolling to improve performance.

- **Type:** Boolean
- **Default:** true
- **Platforms:** iOS, Android (placeholder on Android)

```javascript
var gridView = sortableGridModule.createView({ lazyLoadingEnabled: true });
```

### refreshControl

A Titanium RefreshControl for pull-to-refresh functionality.

- **Type:** Ti.UI.RefreshControl
- **Default:** null
- **Platforms:** iOS, Android

```javascript
var refreshControl = Ti.UI.createRefreshControl({
    tintColor: '#3498db'
});

var gridView = sortableGridModule.createView({
    refreshControl: refreshControl
});

refreshControl.addEventListener('refreshstart', function() {
    // Fetch new data
    loadNewData(function(items) {
        gridView.data = items;
        refreshControl.endRefreshing();
    });
});
```

### editable

Set whether the grid is in edit mode. Prefer using `startEditing()` / `stopEditing()` methods.

- **Type:** Boolean
- **Default:** false
- **Platforms:** iOS, Android

```javascript
gridView.editable = true;
```

## Grid View Methods

### startEditing()

Enter edit mode — shows delete buttons, enables drag reordering, starts wobble animation (if enabled). Items remain tappable during edit mode; click events on child views continue to fire.

- **Platforms:** iOS, Android

```javascript
gridView.startEditing();
```

### stopEditing()

Exit edit mode — hides delete buttons, stops wobble, saves reordered data.

- **Platforms:** iOS, Android

```javascript
gridView.stopEditing();
```

### insertItemAtIndex(args)

Insert an item at a specific index.

- **Parameters:** `{ item: ItemProxy, index: Number, animated: Boolean }`
- **Platforms:** iOS, Android

```javascript
var newItem = sortableGridModule.createItem({
    id: 99,
    height: Ti.UI.SIZE,
    width: Ti.UI.FILL,
    canBeDeleted: true,
    canBeMoved: true
});

newItem.add(Ti.UI.createLabel({ text: 'New Cell' }));

gridView.insertItemAtIndex({
    item: newItem,
    index: 0,
    animated: true
});
```

### deleteItemAtIndex(args)

Delete the item at a specific index.

- **Parameters:** `{ index: Number, animated: Boolean }`
- **Platforms:** iOS, Android

```javascript
gridView.deleteItemAtIndex({ index: 0, animated: true });
```

### scrollToItemAtIndex(args)

Scroll to make the item at the given index visible.

- **Parameters:** `{ index: Number, animated: Boolean }`
- **Platforms:** iOS, Android

```javascript
gridView.scrollToItemAtIndex({
    index: gridView.data.length - 1,
    animated: true
});
```

### scrollToBottom(args)

Scroll to the bottom of the grid.

- **Parameters:** `{ animated: Boolean }`
- **Platforms:** iOS, Android

```javascript
gridView.scrollToBottom({ animated: true });
```

### scrollToTop(args)

Scroll to the top of the grid.

- **Parameters:** `{ animated: Boolean }`
- **Platforms:** iOS, Android

```javascript
gridView.scrollToTop({ animated: true });
```

## Grid View Data

### Setting Data

```javascript
// Set all items at once
gridView.data = items;

// Clear all items
gridView.data = [];

// Re-add items after clearing
gridView.data = savedItems;
```

### Reading Data

```javascript
// Get all items (returns an array of ItemProxy objects)
var items = gridView.data;

// Each item has a 'position' property reflecting its current index
items.forEach(function(item) {
    console.log('Item ' + item.id + ' is at position ' + item.position);
});
```

### Updating Item Properties at Runtime

You can change item properties directly on the data array:

```javascript
// Update badge value
gridView.data[0].badgeValue = 5;

// Update badge color
gridView.data[0].badgeTintColor = '#cc0000';

// Toggle badge visibility
gridView.data[0].badge = true;

// Toggle whether item can be deleted
gridView.data[0].canBeDeleted = false;

// Toggle whether item can be moved/reordered
gridView.data[0].canBeMoved = false;
```

## Grid View Events

### itemsReordered

Fired after a drag-and-drop reorder completes.

- **Platforms:** iOS, Android

```javascript
gridView.addEventListener('itemsReordered', function(e) {
    gridView.data.forEach(function(item) {
        console.log('Item ' + item.id + ' is now at position ' + item.position);
    });
});
```

### itemAdded

Fired after an item is inserted.

- **Event data:** `{ itemId }` (iOS) / `{ itemId, index }` (Android)
- **Platforms:** iOS, Android

```javascript
gridView.addEventListener('itemAdded', function(e) {
    console.log('Item added: ' + e.itemId);
});
```

### itemDeleted

Fired after an item is deleted.

- **Event data:** `{ itemId }`
- **Platforms:** iOS, Android

```javascript
gridView.addEventListener('itemDeleted', function(e) {
    console.log('Item deleted: ' + e.itemId);
});
```

### editingStart

Fired when edit mode begins.

- **Platforms:** iOS, Android

```javascript
gridView.addEventListener('editingStart', function(e) {
    console.log('Editing started');
});
```

### editingEnd

Fired when edit mode ends.

- **Platforms:** iOS, Android

```javascript
gridView.addEventListener('editingEnd', function(e) {
    console.log('Editing ended');
});
```

### pageChanged

Fired when the current page changes.

- **Event data:** `{ pageNo }`
- **Platforms:** iOS, Android

```javascript
gridView.addEventListener('pageChanged', function(e) {
    console.log('Current page: ' + e.pageNo);
});
```

### pageCountChanged

Fired when the total number of pages changes.

- **Event data:** `{ pageCount }`
- **Platforms:** iOS, Android

```javascript
gridView.addEventListener('pageCountChanged', function(e) {
    console.log('Total pages: ' + e.pageCount);
});
```

### scroll

Fired on scroll, throttled to ~30fps on iOS to reduce overhead.

- **Event data:** `{ contentOffset: { x, y }, contentSize: { width, height } }`
- **Platforms:** iOS, Android

```javascript
gridView.addEventListener('scroll', function(e) {
    console.log('Scrolled to x:' + e.contentOffset.x + ' y:' + e.contentOffset.y);
});
```

## Creating Items

### `sortableGridModule.createItem(properties)`

Creates a grid item proxy. Items are standard Ti.UI.View containers that can hold any child views.

### Item Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `id` | Number | — | Optional identifier for the item |
| `width` | Number / Ti.UI.FILL / Ti.UI.SIZE | Ti.UI.FILL | Item width. Use `Ti.UI.FILL` to fill the column width |
| `height` | Number / Ti.UI.SIZE | Ti.UI.SIZE | Item height |
| `canBeDeleted` | Boolean | true | Whether the delete button is shown in edit mode |
| `canBeMoved` | Boolean | true | Whether the item can be drag-reordered |
| `badge` | Boolean | false | Whether to display a badge on this item |
| `badgeValue` | Number | 0 | Numeric value displayed in the badge (>=100 shows "99+") |
| `badgeTintColor` | String | Red | Background color for the badge (hex color string) |

### Adding Child Views

Items are view containers — add any Ti.UI views as children:

```javascript
var item = sortableGridModule.createItem({
    id: 1,
    height: Ti.UI.SIZE,
    width: Ti.UI.FILL,
    canBeDeleted: true,
    canBeMoved: true,
    badge: true,
    badgeValue: 3
});

var card = Ti.UI.createView({
    backgroundColor: '#2ecc71',
    borderRadius: 8,
    width: Ti.UI.FILL,
    height: 120
});

card.add(Ti.UI.createLabel({
    text: 'Hello',
    color: '#fff',
    textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
}));

item.add(card);
```

## Feature Comparison: iOS vs Android

| Feature | iOS | Android |
|---------|:---:|:-------:|
| **Grid View** | | |
| Vertical scrolling | ✅ | ✅ |
| Horizontal scrolling | ✅ | ✅ |
| Column count | ✅ | ✅ |
| Row count (horizontal) | ✅ | ✅ |
| Waterfall / staggered layout | ✅ | ✅ |
| Min horizontal / vertical spacing | ✅ | ✅ |
| Content insets | ✅ | ✅ |
| Scroll indicator insets | ✅ | ✅ |
| Disable bounce | ✅ | ✅ |
| Background color | ✅ | ✅ |
| Scroll enabled toggle | ✅ | ✅ |
| **Paging** | | |
| Paging enabled | ✅ | ✅ |
| Page indicator (pager) | ✅ | ✅ |
| Pager follows bottom inset | ✅ | ✅ |
| Page indicator tint color | ✅ | ✅ |
| Current page indicator tint color | ✅ | ✅ |
| **Edit Mode** | | |
| Start / stop editing | ✅ | ✅ |
| Wobble animation | ✅ | ✅ |
| Delete button | ✅ | ✅ |
| Custom delete button image | ✅ | ✅ |
| Drag to reorder | ✅ | ✅ |
| `canBeDeleted` per item | ✅ | ✅ |
| `canBeMoved` per item | ✅ | ✅ |
| **Badges** | | |
| Badge display | ✅ | ✅ |
| Badge value | ✅ | ✅ |
| Badge tint color | ✅ | ✅ |
| Badge remains visible in edit mode | ✅ | ✅ |
| Update badge at runtime | ✅ | ✅ |
| **Data** | | |
| Set data (`gridView.data = [...]`) | ✅ | ✅ |
| Clear data (`gridView.data = []`) | ✅ | ✅ |
| Re-add data after clearing | ✅ | ✅ |
| `insertItemAtIndex` | ✅ | ✅ |
| `deleteItemAtIndex` | ✅ | ✅ |
| Item position auto-updated | ✅ | ✅ |
| **Scroll** | | |
| `scrollToItemAtIndex` | ✅ | ✅ |
| `scrollToBottom` | ✅ | ✅ |
| `scrollToTop` | ✅ | ✅ |
| **Pull to Refresh** | ✅ | ✅ |
| **Drag shadow opacity** | ✅ | ✅ |
| **Lazy loading** | ✅ | ✅ (placeholder) |
| **Scroll event** | ✅ | ✅ |
| **Page events** | ✅ | ✅ |

## Performance

### iOS Optimizations

The module includes several optimizations for smooth scrolling performance:

- **Cell reuse** — Cells are reused efficiently when scrolling; only cells whose content actually changes are reconfigured
- **Layout caching** — Waterfall and non-waterfall layouts cache computed attributes and only recompute when data changes
- **Wobble optimization** — Wobble animations are skipped entirely when `wobble` is not enabled, avoiding unnecessary main thread work during scrolling
- **Scroll event throttling** — `scroll` events are throttled to ~30fps to reduce JavaScript bridge overhead
- **Prefetching disabled** — UICollectionView prefetching is disabled since the module doesn't implement prefetch data source conformance, eliminating wasted prefetch work
- **Direct position updates during drag** — Drag reordering sets the snapshot view position directly instead of creating overlapping animation blocks that cause lag
- **Rect-filtered layout attributes** — Layout attribute queries return only items within the visible rect rather than all items, reducing per-frame work during scrolling
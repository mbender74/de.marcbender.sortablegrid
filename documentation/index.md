# de.marcbender.sortablegrid

A Titanium module providing a sortable grid view (similar to the iOS home screen) with drag-and-drop reordering, edit mode, badges, and both vertical and horizontal scroll layouts.

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

## Creating the Grid View

### `sortableGridModule.createView(properties)`

Creates the grid view with the specified properties.

## Grid View Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `columnCount` | Number | 3 | Number of columns in vertical layout, or number of rows in horizontal layout |
| `rowCount` | Number | 0 | Number of rows per page in horizontal layout. On iOS with `waterFallLayout: false`, items use natural heights within rows. On iOS with `waterFallLayout: true`, items keep natural heights with rowCount items per column per page |
| `minHorizontalSpacing` | Number | 0 | Minimum horizontal spacing between cells |
| `minVerticalSpacing` | Number | 0 | Minimum vertical spacing between cells |
| `wobble` | Boolean | false | Wobble animation in edit mode |
| `showDeleteButton` | Boolean | false | Show delete buttons on items in edit mode |
| `deleteButtonImage` | Image | null | Custom image for the delete button |
| `itemsBadgeEnabled` | Boolean | false | Enable badge display on items |
| `scrollType` | String | "vertical" | Scroll direction: `"vertical"` or `"horizontal"` |
| `waterFallLayout` | Boolean | false | Enable waterfall (Pinterest-style) staggered layout |
| `pagingEnabled` | Boolean | false | Enable snap-to-page scrolling |
| `pagerEnabled` | Boolean | false | Show a page indicator (UIPageControl) |
| `pagerFollowsBottomInset` | Boolean | false | Pager repositions when content insets change (e.g., keyboard) |
| `pageIndicatorTintColor` | Color | — | Color for inactive page indicator dots |
| `currentPageIndicatorTintColor` | Color | — | Color for the current page indicator dot |
| `contentInsets` | Object | — | Content insets `{top, left, bottom, right}` |
| `scrollIndicatorInsets` | Object | — | Scroll indicator insets `{top, left, bottom, right}` |
| `disableBounce` | Boolean | false | Disable scroll view bounce |
| `showVerticalScrollIndicator` | Boolean | false | Show vertical scroll indicator |
| `showHorizontalScrollIndicator` | Boolean | false | Show horizontal scroll indicator |
| `lazyLoadingEnabled` | Boolean | true | Suspend image loading during scrolling (iOS only) |
| `scrollToBottomAfterSetData` | Boolean | false | Auto-scroll to bottom after setting data |
| `dragItemShadowOpacity` | Number | 1.0 | Opacity of the drag item shadow (0.0–1.0) |
| `scrollEnabled` | Boolean | true | Enable or disable scrolling |
| `backgroundColor` | String | — | Background color of the grid |
| `refreshControl` | Ti.UI.RefreshControl | null | Pull-to-refresh control (iOS only) |

### Layout Direction

Use `scrollType` to control the layout direction:

```javascript
// Vertical scrolling (default)
gridView.scrollType = 'vertical';

// Horizontal scrolling — items flow left to right, wrapping to next row
gridView.scrollType = 'horizontal';
```

When `scrollType` is `"horizontal"`:
- `columnCount` controls the number of columns visible per page
- `rowCount` controls the number of rows per column per page (iOS and Android)
- Items scroll horizontally, with `rowCount × columnCount` items per page

### Waterfall Layout

```javascript
var gridView = sortableGridModule.createView({
    waterFallLayout: true,  // Pinterest-style staggered layout
    columnCount: 3,
    scrollType: 'vertical'
});
```

## Grid View Methods

| Method | Parameters | Description |
|--------|-----------|-------------|
| `startEditing()` | none | Enter edit mode — shows delete buttons, enables drag reordering |
| `stopEditing()` | none | Exit edit mode — hides delete buttons, stops wobble |
| `insertItemAtIndex({item, index, animated})` | ItemProxy, Number, Boolean | Insert an item at the given index |
| `deleteItemAtIndex({index, animated})` | Number, Boolean | Delete the item at the given index |
| `scrollToItemAtIndex({index, animated})` | Number, Boolean | Scroll to make the item at index visible |
| `scrollToBottom({animated})` | Boolean | Scroll to the bottom of the grid |
| `scrollToTop({animated})` | Boolean | Scroll to the top of the grid |
| `createItem(options)` | Object | Create an item HashMap (Android only — on iOS use `sortableGridModule.createItem()`) |

### Edit Mode

```javascript
// Enter edit mode
gridView.startEditing();

// Exit edit mode
gridView.stopEditing();
```

In edit mode:
- Delete buttons appear on items where `canBeDeleted` is true
- Items wobble if `wobble` is true
- Items can be drag-reordered if `canBeMoved` is true
- Badges remain visible

### Inserting Items

```javascript
var newItem = sortableGridModule.createItem({
    id: 99,
    height: Ti.UI.SIZE,
    width: Ti.UI.FILL,
    canBeDeleted: true,
    canBeMoved: true,
    badge: true,
    badgeValue: 42
});

newItem.add(Ti.UI.createLabel({ text: 'New Cell' }));

gridView.insertItemAtIndex({
    item: newItem,
    index: 0,
    animated: true
});
```

### Deleting Items

```javascript
// Delete the first item with animation
gridView.deleteItemAtIndex({ index: 0, animated: true });
```

### Scrolling

```javascript
// Scroll to the last item
gridView.scrollToItemAtIndex({
    index: gridView.data.length - 1,
    animated: true
});

// Scroll to bottom
gridView.scrollToBottom({ animated: true });

// Scroll to top
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

| Event | Event Data | Description |
|-------|-----------|-------------|
| `itemsReordered` | — | Fired after a drag-and-drop reorder completes |
| `itemAdded` | `{ itemId }` (iOS) / `{ itemId, index }` (Android) | Fired after an item is inserted |
| `itemDeleted` | `{ itemId }` | Fired after an item is deleted |
| `editingStart` | — | Fired when edit mode begins |
| `editingEnd` | — | Fired when edit mode ends |
| `pageChanged` | `{ pageNo }` | Fired when the current page changes |
| `pageCountChanged` | `{ pageCount }` | Fired when the total page count changes |
| `scroll` | `{ contentOffset: {x, y}, contentSize: {width, height} }` | Fired on scroll (throttled to ~30fps on iOS) |

### Listening for Events

```javascript
gridView.addEventListener('itemsReordered', function(e) {
    gridView.data.forEach(function(item) {
        console.log('Item ' + item.id + ' is now at position ' + item.position);
    });
});

gridView.addEventListener('itemAdded', function(e) {
    console.log('Item added: ' + e.itemId);
});

gridView.addEventListener('itemDeleted', function(e) {
    console.log('Item deleted: ' + e.itemId);
});

gridView.addEventListener('editingStart', function(e) {
    console.log('Editing started');
});

gridView.addEventListener('editingEnd', function(e) {
    console.log('Editing ended');
});
```

## Creating Items

### `sortableGridModule.createItem(properties)`

Creates a grid item proxy. Items are standard Ti.UI.View containers that can hold any child views.

### Item Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `id` | Number | — | Optional identifier for the item |
| `width` | Number / Ti.UI.FILL / Ti.UI.SIZE | Ti.UI.FILL | Item width. Use Ti.UI.FILL to fill the column width |
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
| **Pull to Refresh** | ✅ | ✖️ |
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
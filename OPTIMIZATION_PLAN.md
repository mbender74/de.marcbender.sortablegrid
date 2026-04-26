# iOS Module Optimization Plan

## Projektstatus

| Metrik | Wert |
|--------|------|
| Gesamtzeilen (Objective-C) | 4.321 |
| Größte Datei | `DeMarcbenderSortablegridView.m` (2.444 Zeilen) |
| 3rd-Party Libraries | BMDragCellCollectionView (~779), XHWaterfallFlowLayout (~397), BMDragCollectionViewCell (~174) |
| Eigener Code | ~2.969 Zeilen |

---

## 1. Kritische Probleme

### 1.1 Cell-Reuse ist kaputt (Performance)

**Datei:** `DeMarcbenderSortablegridView.m`, Zeile ~1923

```objc
- (UICollectionViewCell *)collectionView:(UICollectionView *)collectionView cellForItemAtIndexPath:(NSIndexPath *)indexPath{
    BMDragCollectionViewCell *cell = [collectionView dequeueReusableCellWithReuseIdentifier:reuseIdentifier forIndexPath:indexPath];
    // ...
    if ([cell contentView].subviews.count > 0){
        NSArray *viewsToRemove = [cell contentView].subviews;
        for (UIView *v in viewsToRemove) {
            [v removeFromSuperview];  // ← zerstört wiederverwendete Subviews
        }
    }
    // ...
    [[cell contentView] addSubview:content];  // ← fügt jedes Mal neue Views hinzu
}
```

**Problem:** Der Cell-Reuse-Mechanismus wird subvertiert — alte Subviews werden zerstört und neue Views werden jedes Mal allocated. Das führt zu:
- Exzessivem Memory Allocation
- GC-Pressure (autorefcount pool)
- Scroll-Jank bei schnellen Swipe-Gesten

**Lösung:** Speichere `cellView`, `closeButton` und `badge` in der Cell selbst (z.B. als `@property`) und konfiguriere sie bei der Wiederverwendung statt neu zu erstellen. Alternativ: speichere die Views in der dataSource und weise sie der Cell zu.

---

### 1.2 Massive Code-Duplizierung (Data-Source Synchronisation)

**Datei:** `DeMarcbenderSortablegridView.m`

Die Logik zum Synchronisieren der `cellData` mit dem dataSource und dem Fire von `position` Properties ist an **6 Stellen** dupliziert:

1. `setData_:` (Zeile ~730)
2. `startEditing` (Zeile ~955)
3. `stopEditing` (Zeile ~1005)
4. `addItem:` (Zeile ~1155)
5. `deleteItemAtIndex:` (Zeile ~1930)
6. `dragCellCollectionView:newDataArrayAfterMove:` (Zeile ~1975)
7. `dragCellCollectionViewDidEndDrag:` (Zeile ~1990)

**Problem:** Jede Änderung an dieser Logik muss an allen Stellen durchgeführt werden. Hohe Fehleranfälligkeit.

**Lösung:** Extrahiere eine private Methode:
```objc
- (void)synchronizeCellDataFromDataSource
```

---

### 1.3 `dispatch_after` als Workaround für Timing-Probleme

**Datei:** `DeMarcbenderSortablegridView.m`, mehrmals

```objc
dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.1 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
    // scrollToItemAtIndexPath ...
});
```

**Problem:** Race Conditions werden mit delays umgangen statt gelöst. Führt zu flackernden Scrolling und unzuverlässigem Verhalten.

**Lösung:** Nutze `collectionView:didFinishUpdatingItemsAtIndexPaths:` Completion-Handler oder `UIView.performWithoutAnimation:`.

---

## 2. Performance-Optimierungen

### 2.1 `createItem:` alloziert zu viel (Zeile ~1250)

Jeder Aufruf von `createItem:` erstellt:
- `UIButton` (closeButton) — `[cbutton retain]` manuell
- `UIButton` (badge)
- `UIView` (cellViewContainer)
- Multiple `NSNumber` Objekte für das Dictionary

Bei 100 Items = **500+ Allocationen pro Reload**.

**Lösung:**
- Badge- und Close-Buttons als Singletons mit konfigurierbarem Aussehen
- `NSNumber` Caches (`[NSNumber numberWithInt:]` ist bereits gecacht, aber das Dictionary selbst kann optimiert werden)
- Struct statt Dictionary für Cell-Daten

### 2.2 `calcMaxCellWidth` rekursiver Aufruf (Zeile ~1070)

```objc
if (insetsCalcDone == NO) {
    // ... Berechnung ...
    return ([self calcMaxCellWidth]);  // ← rekursiver Aufruf!
}
```

**Problem:** Rekursion statt direkter Rückgabe. Bei komplexen Layouts potenzieller Stack-Overflow.

**Lösung:** Iterativ umschreiben, `insetsCalcDone` vor der Rückgabe setzen und den berechneten Wert direkt returnen.

### 2.3 `UICollectionView` ohne Prefetching

**Problem:** Der `UICollectionView` nutzt kein Prefetching. Bei großen Datenmengen kann dies zu Scroll-Jank führen.

**Lösung:** Implementiere `UICollectionViewDataSourcePrefetching` und nutze `indexPathsForPreferredItemSizes`.

### 2.4 `TiThreadPerformOnMainThread` Overhead (mehrfach)

**Datei:** `DeMarcbenderSortablegridView.m`, Zeile ~2015, ~2028

```objc
- (void)collectionView:(UICollectionView *)collectionView didEndDisplayingCell:(UICollectionViewCell *)cell forItemAtIndexPath:(NSIndexPath *)indexPath {
    if (editing == YES && _wobble == YES){
        TiThreadPerformOnMainThread(^{
            [cell performSelector:@selector(stopWobble)];
        },NO);
    }
    // ...
}
```

**Problem:** Diese Delegate-Methoden werden bereits auf dem Main-Thread aufgerufen. `TiThreadPerformOnMainThread` fügt unnötigen Dispatch-Overhead hinzu.

**Lösung:** Direkt aufrufen, da wir uns bereits auf dem Main-Thread befinden.

---

## 3. Memory Management

### 3.1 Manuelles `retain` ohne `release`

**Datei:** `DeMarcbenderSortablegridView.m`, Zeile ~1060

```objc
- (UIButton *)createCloseButton {
    // ...
    return [cbutton retain];  // ← manuelles retain
}
```

**Problem:** Unter ARC sollte man kein manuelles `retain` verwenden. Wenn ARC enabled ist, wird dies ignoriert. Wenn nicht, ist es ein Memory Leak (kein korrespondierendes `release`).

**Lösung:** `[cbutton retain]` entfernen, ARC übernehmen lassen.

### 3.2 `dataSource` hält alle Cell-Views im Speicher

**Problem:** Das `dataSource` Array hält für jedes Item ein Dictionary, das `cellview` (UIView), `closebutton` (UIButton) und `badge` (UIButton) referenziert. Bei 200 Items = **600 UIView-Objekte im Speicher** — auch für nicht sichtbare Zellen.

**Lösung:** Nur die Proxies im dataSource speichern, Views nur für sichtbare Zellen halten (via Cell-Reuse).

### 3.3 Weak-Reference für `window`

**Datei:** `DeMarcbenderSortablegridView.h`

```objc
UIWindow *window;  // ← strong reference
```

**Problem:** Strong Reference auf `UIApplication.sharedApplication.windows.firstObject` kann Reference Cycles verursachen.

**Lösung:** Als `__weak` property deklarieren oder bei jedem Zugriff frisch holen.

---

## 4. Dead Code

### 4.1 Kommentierter Code in `TopAlignedCollectionViewFlowLayout` (Zeile ~30-120)

- `UIDynamicAnimator` Integration (komplett auskommentiert)
- `layoutAttributesForElementsInRect` (2 Varianten auskommentiert)
- `shouldInvalidateLayoutForBoundsChange` (auskommentiert)
- `alignToTopForSameLineElements` (auskommentiert)

**Umfang:** ~150 Zeilen toter Code

**Lösung:** In separaten Branch oder Comment-Block mit klarer Kennzeichnung archivieren oder komplett entfernen.

### 4.2 Kommentierte Methoden in `DeMarcbenderSortablegridView.m`

- `image:withMaskWithColor:` (Zeile ~290) — ~30 Zeilen
- `badgeButtonImage` getter (Zeile ~1100) — ~15 Zeilen
- `setData_` alte Version (Zeile ~670) — ~15 Zeilen
- `performBatchUpdates` Completion-Handler (mehrmals) — ~50 Zeilen

**Lösung:** Entfernen oder in separate Feature-Branches verschieben.

### 4.3 Veraltete `DISPATCH_TIME_NOW` Deprecation

**Datei:** `DeMarcbenderSortablegridView.m`, mehrmals

```objc
dispatch_after(dispatch_time(DISPATCH_TIME_NOW, ...), ...)
```

`DISPATCH_TIME_NOW` ist seit macOS 10.12 / iOS 10 deprecated.

**Lösung:** Durch `DISPATCH_TIME_NOW` → `DISPATCH_TIME_NOW` (constant) ersetzen oder `dispatch_time(DISPATCH_TIME_NOW, ...)` → `dispatch_walltime(NULL, 0)` umschreiben.

---

## 5. Architektur & Wartbarkeit

### 5.1 God-Class Pattern

`DeMarcbenderSortablegridView` (2.444 Zeilen) ist eine God-Class:
- Layout-Logik
- Event-Handling
- Data-Source Management
- Cell-Erstellung
- Pagination
- Editing-Mode
- Scroll-Handling
- Content Insets
- Pager

**Lösung:** Verantwortlichkeiten aufteilen:
```
DeMarcbenderSortablegridView          (Koordinierung, ~500 Zeilen)
├── DeMarcbenderSortablegridCellFactory (Cell-Erstellung, ~300 Zeilen)
├── DeMarcbenderSortablegridDataSource  (Data-Sync, ~200 Zeilen)
├── DeMarcbenderSortablegridPager       (Page-Handling, ~150 Zeilen)
└── DeMarcbenderSortablegridEditingController (Edit-Mode, ~200 Zeilen)
```

### 5.2 Inconsistent Naming Conventions

| Pattern | Beispiel |
|---------|---------|
|匈牙利命名 | `_refreshControl`, `_dataSource` |
|camelCase ohne Prefix | `launcher`, `waterfallLayout` |
| gemischte Sprache | `waterfallLayout.sDelegate` |
| Single-Char Variablen | `cbutton`, `v` |
| Uppercase Konstanten vs. lowercase | `reuseIdentifier` vs. `kGridDashboardViewDefaultColumnCount` |

**Lösung:** Konsistente Konvention einführen (z.B. Apple's Human Interface Guidelines + ObjC conventions).

### 5.3 Magic Numbers

**Datei:** `DeMarcbenderSortablegridView.m`, durchgängig

```objc
badge.frame = CGRectMake(0, 0, 28, 28);      // ← 28, 28
[badge.layer setCornerRadius:14];              // ← 14
badge.titleLabel.font = [UIFont boldSystemFontOfSize:12];  // ← 12
closeButton.frame = CGRectMake(0, 0, 34, 34); // ← 34, 34
[closeButton.layer setCornerRadius:17];        // ← 17
pager.frame = CGRectMake(0, ..., 25);          // ← 25
-(badge.bounds.size.height/3)                  // ← /3
-(badge.bounds.size.height/1.3)                // ← /1.3
```

**Lösung:** Named constants oder `#define` für alle UI-Dimensionen.

### 5.4 `@property` vs. Instance Variables

**Datei:** `DeMarcbenderSortablegridView.h`

Die Klasse verwendet eine Mischung aus:
- Instance Variables im `@interface` block (C-style)
- `@property` declarations
- Synthesized properties

**Problem:** Inkonsistenter Zugriff (`self.property` vs. `_property` vs. direct ivar).

**Lösung:** Alle ivars zu `@property` konvertieren, direkte ivar-Zugriffe eliminieren.

---

## 6. Modernisierung

### 6.1 `makeObjectsPerformSelector:` Deprecation

**Datei:** `DeMarcbenderSortablegridView.m`, Zeile ~990

```objc
[launcher.visibleCells makeObjectsPerformSelector:@selector(wobble)];
```

Depreciert seit iOS 9.

**Lösung:** Durch `enumerateObjectsUsingBlock:` ersetzen:
```objc
[launcher.visibleCells enumerateObjectsUsingBlock:^(BMDragCollectionViewCell *cell, NSUInteger idx, BOOL *stop) {
    [cell wobble];
}];
```

### 6.2 `performSelector:` Warning-Suppression

**Datei:** `DeMarcbenderSortablegridView.m`, Zeile ~2015

```objc
[cell performSelector:@selector(stopWobble)];
```

**Problem:** `performSelector:` kann ein potenzieller Security-Risiko sein (Clang Warning: `-Wunguarded-availability`).

**Lösung:** Direkt aufrufen: `[cell stopWobble];`

### 6.3 Legacy Titanium APIs

**Datei:** `DeMarcbenderSortablegridView.m`, mehrmals

```objc
TiThreadPerformOnMainThread(..., [NSThread isMainThread]);  // ← legacy
```

**Lösung:** Auf modernen Titanium-SDK-APIs aktualisieren (SDK 13.x).

---

## 7. 3rd-Party Dependencies

### 7.1 BMDragCellCollectionView (2017, unverändert)

- **Quelle:** github.com/asiosldh/BMDragCellCollectionView
- **Alter:** 9 Jahre (Stand 2026)
- **Problem:** Nutzt deprecated APIs, kein UICollectionViewCompositionalLayout Support
- **Risiko:** Inkompatibilität mit iOS 18+

**Lösung:** Fork erstellen und modernisieren, oder zu `UICollectionViewDiffableDataSource` + `UIContextMenuInteraction` migrieren.

### 7.2 XHWaterfallFlowLayout (2016, unverändert)

- **Quelle:** github.com/echo/WaterfallFlowDemo
- **Alter:** 10 Jahre
- **Problem:** Eigene Layout-Implementierung statt `UICollectionViewCompositionalLayout` mit `NSCollectionLayoutSection` (seit iOS 14)

**Lösung:** Auf `UICollectionViewCompositionalLayout` migrieren (native iOS 14+ API).

---

## 8. Fehlerbehandlung & Robustheit

### 8.1 Keine Bounds-Checks bei Array-Zugriffen

**Datei:** `DeMarcbenderSortablegridView.m`, durchgängig

```objc
self.dataSource[0][indexPath.item][@"cellItemProxy"]
```

**Problem:** Wenn `dataSource` leer ist oder das Item fehlt → **crash**.

**Lösung:** Defensive Programming mit nil-Checks und `if (indexPath.item < self.dataSource[0].count)`.

### 8.2 Keine Error-Handling bei `ENSURE_TYPE`

**Datei:** `DeMarcbenderSortablegridView.m`, mehrmals

```objc
ENSURE_TYPE(proxy, DeMarcbenderSortablegridItemProxy)
```

**Problem:** Wenn der Typ nicht passt, wird die Exception geworfen aber nicht dokumentiert was auf JS-Seite passiert.

**Lösung:** Klare JavaScript-Exceptions werfen mit aussagekräftigen Fehlermeldungen.

---

## 9. Priorisierte Implementierungsreihenfolge (Gesamt)

| Priority | Aufgabe | Aufwand | Impact |
|----------|---------|---------|--------|
| **P0** | `scrollViewDidScroll:` Throttling (10.2) | Niedrig | **Sehr Hoch** (CPU, JS-Bridge, beide Layouts) |
| **P0** | Waterfall malloc-Leak fixen (10.3) | Niedrig | **Sehr Hoch** (Memory, Waterfall) |
| **P0** | Cell-Reuse fixen (1.1) | Mittel | Hoch (Performance, beide Layouts) |
| **P0** | Memory Leak: manuelles `retain` (3.1) | Niedrig | Hoch (Stabilität) |
| **P1** | Custom Paging → native Deceleration (10.1) | Mittel | Hoch (UX, beide Layouts) |
| **P1** | Waterfall Layout-Cache (10.4) | Mittel | Hoch (Jank, Waterfall) |
| **P1** | `dispatch_after` → Completion-Handler (10.6) | Mittel | Mittel (Zuverlässigkeit) |
| **P1** | Code-Duplizierung eliminieren (1.2) | Mittel | Mittel (Wartbarkeit) |
| **P1** | Bounds-Checks hinzufügen (8.1) | Niedrig | Hoch (Stabilität) |
| **P1** | Dead Code entfernen (4.1, 4.2) | Niedrig | Mittel (Build-Size) |
| **P2** | Page-Control Animation (10.5) | Niedrig | Mittel (UX) |
| **P2** | Content-Size Berechnung fixen (10.9) | Mittel | Mittel (Scroll-Bounds) |
| **P2** | Magic Numbers → Konstanten (5.3) | Niedrig | Mittel (Wartbarkeit) |
| **P2** | `performSelector` / `makeObjectsPerformSelector` ersetzen (6.1, 6.2) | Niedrig | Niedrig (Warnings) |
| **P3** | God-Class aufteilen (5.1) | Hoch | Hoch (Langfrist) |
| **P3** | Lazy Layout für Waterfall (10.3) | Hoch | Hoch (große Datenmengen) |
| **P3** | 3rd-Party Libraries modernisieren (7.1, 7.2) | Hoch | Hoch (Zukunft) |
| **P4** | Prefetching implementieren (2.3) | Mittel | Mittel (Performance) |
| **P4** | DataSource-Memory-Optimierung (3.2) | Hoch | Hoch (Memory) |
| **P4** | Dynamic Type Support (10.10) | Mittel | Mittel (Accessibility) |

---

## 10. Scrolling-Optimierung (Vertikal + Horizontal, Standard + Waterfall)

### 10.1 Custom Paging überschreibt native Deceleration (Beide Layouts)

**Datei:** `DeMarcbenderSortablegridView.m`, Zeile ~2048

```objc
- (void)scrollViewWillEndDragging:(UIScrollView *)scrollView withVelocity:(CGPoint)velocity targetContentOffset:(inout CGPoint *)targetContentOffset
{
    if (pagingEnabled == YES){
        // ... manuelle Berechnung ...
        targetContentOffset->x = currentOffset;  // ← ignoriert native Deceleration
        [scrollView setContentOffset:CGPointMake(newTargetOffset, ...) animated:YES];
    }
}
```

**Problem:**
- Native iOS Deceleration-Kurve wird komplett umgangen
- `targetContentOffset` wird auf `currentOffset` gesetzt → Scroll-Physik bricht abrupt ab
- `[scrollView setContentOffset:...]` innerhalb von `scrollViewWillEndDragging` erzeugt einen Race-Condition mit dem nativen Scroll-System
- Horizontal: selbes Problem, nur auf X-Achse

**Lösung:** Nutze `UIScrollViewDecelerationRateNormal` + `scrollViewDidScroll:` zum Snappen:
```objc
// In init:
launcher.decelerationRate = UIScrollViewDecelerationRateFast;

// In scrollViewDidScroll: (nur wenn pagingEnabled)
- (void)scrollViewDidScroll:(UIScrollView *)scrollView {
    // ... existing code ...
    if (pagingEnabled && !scrollView.isDecelerating) {
        [self snapToNearestPageIfNeeded:scrollView];  // nur wenn außerhalb der Page
    }
}
```

**Impact:** Butter-glattes Paging mit nativer Scroll-Physik.

---

### 10.2 `scrollViewDidScroll:` feuert pro Pixel (beide Layouts)

**Datei:** `DeMarcbenderSortablegridView.m`, Zeile ~2155

```objc
- (void) scrollViewDidScroll:(UIScrollView *)scrollView {
    [self updatePagerWithContentOffset:launcher.contentOffset];  // ← jedes Frame!
    [self fireScrollEvent:launcher];                              // ← jedes Frame!
}
```

**Problem:**
- Bei 120Hz ProMotion: **120× pro Sekunde** wird `updatePagerWithContentOffset:` + `fireScrollEvent:` aufgerufen
- `fireScrollEvent` erstellt jedes Mal ein neues NSDictionary (`eventObjectForScrollView:`)
- JS-Bridge-Overhead für jedes Event
- `updatePagerWithContentOffset` macht `floor()`-Mathematik und feuert `didChangePage:` — auch wenn sich die Page nicht geändert hat

**Lösung:** Throttling + Diff-basierte Events:
```objc
- (void)scrollViewDidScroll:(UIScrollView *)scrollView {
    // Throttle to ~30fps for JS events
    CFAbsoluteTime now = CFAbsoluteTimeGetCurrent();
    if (now - lastScrollEventTime < 0.033) return;
    lastScrollEventTime = now;
    
    [self fireScrollEvent:launcher];
    
    // Pager nur updaten wenn Page sich tatsächlich geändert hat
    NSInteger newPage = [self pageForContentOffset:scrollView.contentOffset];
    if (newPage != currentPage) {
        currentPage = newPage;
        [self updatePagerToPage:newPage];
    }
}
```

**Impact:** ~75% weniger JS-Bridge-Calls, reduzierter Memory-Pressure.

---

### 10.3 Waterfall: ALLE Layout-Attributes auf einmal berechnet

**Datei:** `XHWaterfallFlowLayout.m`, Zeile ~120

```objc
- (void)computeAttributesWithItemWidth:(CGFloat)itemWidth {
    // ...
    NSUInteger count = [self.collectionView numberOfItemsInSection:0];
    for (NSUInteger index = 0; index < count; index++) {  // ← ALLE Items!
        // ... frame berechnen ...
        [attributesArray addObject:attributes];
    }
    self.layoutAttributesArray = attributesArray.copy;
}
```

**Problem:**
- Bei 200 Items: **200 `UICollectionViewLayoutAttributes`** werden auf einmal alloc+computed
- `layoutAttributesForElementsInRect:` ignoriert den `rect`-Parameter und gibt **alle** Attributes zurück:
  ```objc
  - (NSArray *)layoutAttributesForElementsInRect:(CGRect)rect {
      // rect wird ignoriert!
      return self.layoutAttributesArray;  // ← alles!
  }
  ```
- `malloc()` für `columnHeight` und `columnItemCount` wird in `computeAttributesWithItemWidth` gemacht, aber **niemals `free()`d** → Memory Leak bei jedem `invalidateLayout`

**Lösung:**
1. **Lazy Layout:** Berechne nur Attributes für den sichtbaren Rect + Padding:
   ```objc
   - (NSArray *)layoutAttributesForElementsInRect:(CGRect)rect {
       NSMutableArray *visible = [NSMutableArray array];
       for (UICollectionViewLayoutAttributes *attr in self.layoutAttributesArray) {
           if (CGRectIntersectsRect(rect, attr.frame)) {
               [visible addObject:attr];
           }
       }
       return visible;
   }
   ```
2. **Infinite Scrolling:** Statt alle Attributes vorzuberechnen, berechne nur die nächsten N Pages. Nutze `prepareLayout` inkrementell.
3. **Memory-Leak fixen:** `free(columnHeight)` und `free(columnItemCount)` am Ende von `computeAttributesWithItemWidth:`.

**Impact:** Reduzierte Initialisierungszeit bei großen Datenmengen, kein Memory-Leak.

---

### 10.4 Waterfall: Layout-Berechnung blockiert Main-Thread

**Datei:** `XHWaterfallFlowLayout.m`, `prepareLayout`

```objc
- (void)prepareLayout {
    [super prepareLayout];
    // ...
    [self computeAttributesWithItemWidth:itemwidth];  // ← synchron, blockiert
}
```

**Problem:**
- `prepareLayout` wird **bei jedem Scroll-Invalidate** aufgerufen
- Die gesamte Layout-Berechnung (alle Items) läuft synchron auf dem Main-Thread
- Bei Frame-Drops wird `prepareLayout` nochmal aufgerufen → Snowball-Effekt

**Lösung:** Cached Layout + inkrementelle Updates:
```objc
- (void)prepareLayout {
    [super prepareLayout];
    
    // Nur neu berechnen wenn sich die Breite oder Item-Anzahl geändert hat
    CGSize currentSize = self.collectionView.bounds.size;
    if (CGSizeEqualToSize(currentSize, lastContentSize) && 
        [self.collectionView numberOfItemsInSection:0] == lastItemCount) {
        return; // Cache treffer
    }
    
    lastContentSize = currentSize;
    lastItemCount = [self.collectionView numberOfItemsInSection:0];
    [self computeAttributesWithItemWidth:itemwidth];
}
```

**Impact:** Layout-Berechnung nur bei tatsächlichen Änderungen, kein Main-Thread-Block beim Scrollen.

---

### 10.5 Paging: `pageChanged` macht harte Sprünge (beide Layouts)

**Datei:** `DeMarcbenderSortablegridView.m`, Zeile ~2183

```objc
- (void)pageChanged {
    // ...
    [launcher setContentOffset:CGPointMake(newTargetOffset, ...) animated:NO];  // ← hart!
}
```

**Problem:**
- Wenn der User auf den Page-Control-Dot tippt → **instant Jump** ohne Animation
- Visuell ruckartig, besonders bei horizontaler Scrollrichtung
- In `scrollViewWillEndDragging` wird zwar `animated:YES` verwendet, aber der Target-Offset ist oft falsch berechnet (s.o. 10.1)

**Lösung:**
```objc
- (void)pageChanged {
    CGPoint targetOffset = [self contentOffsetForPage:pager.currentPage];
    [launcher setContentOffset:targetOffset animated:YES];
}
```

Zusätzlich: Den Page-Control mit dem tatsächlichen Scroll-Offset synchronisieren (nicht umgekehrt).

---

### 10.6 `dispatch_after` Workarounds für `scrollToBottom` (beide Layouts)

**Datei:** `DeMarcbenderSortablegridView.m`, Zeile ~1520

```objc
- (void)pushVCWithArray:(NSArray *)array {
    // ...
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.1 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        [launcher scrollToItemAtIndexPath:indexPath atScrollPosition:scrollPosition animated:NO];
    });
}
```

**Problem:**
- `scrollToBottomAfterSetData` nutzt einen 100ms-Delay um auf den Reload zu warten
- Bei langsamen Devices oder großen Datenmengen reicht 100ms nicht → Scroll wird ignoriert
- `DISPATCH_TIME_NOW` ist deprecated (macOS 10.12+)

**Lösung:**
```objc
[launcher performBatchUpdates:^{
    self.dataSource = [array mutableCopy];
    [launcher reloadSections:[NSIndexSet indexSetWithIndex:0]];
} completion:^(BOOL finished) {
    if (scrollToBottomAfterSetData) {
        [launcher scrollToItemAtIndexPath:lastIndexPath atScrollPosition:UICollectionViewScrollPositionBottom animated:NO];
    }
}];
```

---

### 10.7 `scrollToBottom` hat Magic Number Offset

**Datei:** `DeMarcbenderSortablegridView.m`, Zeile ~2127

```objc
CGFloat bottomHeight = svContentSize.height - svBoundSize.height + svBottomInsets + 34;  // ← 34?!
```

**Problem:** Der Offset `+34` ist ein Hardcoded-Magic-Number. Wahrscheinlich für den Safe-Area-Inset, aber funktioniert nicht auf allen Device-Größen.

**Lösung:** `+34` durch `+ bottomSafeAreaPadding` ersetzen oder `UICollectionViewScrollPositionBottom` nutzen.

---

### 10.8 Horizontal Scrolling: Waterfall Paging neu berechnet alles

**Datei:** `XHWaterfallFlowLayout.m`, Zeile ~200

```objc
if ((columnHeight[column]+(itemH)) > maxHeight){
    // ... neue Page ...
    self.pagesCount = self.pagesCount + 1;
    columnHeight = (CGFloat *) malloc(self.columnCount * sizeof(CGFloat));  // ← neues malloc ohne free!
    // ...
}
```

**Problem:**
- Beim Horizontal-Scroll in Waterfall-Modus wird die Page-Erkennung in `computeAttributesWithItemWidth` gemacht
- Jede neue Page = neues `malloc()` ohne `free()` der alten Spalten-Arrays
- Beim Scrollen zwischen Pages flackert das Layout, weil `prepareLayout` komplett neu rechnet

**Lösung:** Page-Struktur vorab berechnen, Spalten-Arrays als `@property` mit AutoMemory-Management (`NSMutableArray` statt raw `CGFloat *`).

---

### 10.9 `TopAlignedCollectionViewFlowLayout` berechnet Content-Size falsch

**Datei:** `DeMarcbenderSortablegridView.m`, Zeile ~160

```objc
- (CGSize)collectionViewContentSize {
    CGSize size = [super collectionViewContentSize];
    NSInteger pagesCount = ceil(size.height / self.collectionView.frame.size.height);
    // ...
    CGFloat contentHeight = (pagesCount * (self.collectionView.frame.size.height)) 
        - self.collectionView.contentInset.top - self.collectionView.contentInset.bottom;
    return CGSizeMake(..., contentHeight);
}
```

**Problem:**
- Content-Size wird **auf die nächste Page aufgerundet** — selbst wenn die letzte Page nur 1 Item hat
- Bei `pagingEnabled:NO` wird dieser Code trotzdem ausgeführt (die `if` ist auskommentiert)
- Der Content-Inset wird doppelt abgezogen (einmal vom UICollectionView, einmal hier)
- Horizontal: selbes Problem auf X-Achse

**Lösung:** Content-Size nur bei `pagingEnabled:YES` anpassen. Invertiere die Inset-Korrektur:
```objc
- (CGSize)collectionViewContentSize {
    CGSize size = [super collectionViewContentSize];
    if (!self.pagingEnabled) return size;
    
    if (self.scrolldirection == mkScrollVertical) {
        NSInteger pagesCount = ceil(size.height / self.collectionView.frame.size.height);
        CGFloat pagedHeight = pagesCount * self.collectionView.frame.size.height;
        return CGSizeMake(size.width, pagedHeight);
    }
    // ... horizontal equivalent ...
}
```

---

### 10.10 Keine `preferredContentSize` für Dynamic Type / Accessibility

**Problem:** Weder Standard- noch Waterfall-Layout unterstützen `UICollectionViewCell` mit `preferredContentSize`. Bei aktiviertem Dynamic Type (größere Schrift) bricht das Layout.

**Lösung:** `estimatedItemSize` + `invalidateLayout` bei `UIContentSizeCategoryDidChangeNotification`.

---

### Scrolling Optimierungs-Priorisierung

| Priority | Aufgabe | Layout | Richtung | Impact |
|----------|---------|--------|----------|--------|
| **P0** | `scrollViewDidScroll:` Throttling (10.2) | beide | beide | Hoch (CPU, JS-Bridge) |
| **P0** | Waterfall malloc-Leak fixen (10.3) | waterfall | beide | Hoch (Memory) |
| **P1** | Custom Paging → native Deceleration (10.1) | beide | beide | Hoch (UX) |
| **P1** | Waterfall Layout-Cache (10.4) | waterfall | beide | Hoch (Jank) |
| **P1** | `dispatch_after` → Completion-Handler (10.6) | beide | beide | Mittel (Zuverlässigkeit) |
| **P2** | Page-Control Animation (10.5) | beide | beide | Mittel (UX) |
| **P2** | Content-Size Berechnung fixen (10.9) | standard | beide | Mittel (Scroll-Bounds) |
| **P2** | Magic Number entfernen (10.7) | beide | beide | Niedrig |
| **P3** | Lazy Layout für Waterfall (10.3) | waterfall | beide | Hoch (große Daten) |
| **P3** | Dynamic Type Support (10.10) | beide | beide | Mittel (Accessibility) |

---

## 11. Test-Strategie

Derzeit existieren keine automatisierten Tests. Empfohlene Abdeckung:

| Test-Typ | Ziel |
|----------|------|
| Unit Tests | Property-Whitelist in `DeMarcbenderSortablegridItemProxy` |
| Unit Tests | `setData_` mit verschiedenen Input-Szenarien (empty, nil, wrong type) |
| Integration Tests | Cell-Reuse: Scroll-Test mit 100+ Items |
| Integration Tests | Data-Sync: Items reordern, `position` Property validieren |
| Integration Tests | Scrolling: Paging-Snapping (vertikal + horizontal, beide Layouts) |
| Integration Tests | Scrolling: Waterfall mit 500+ Items (Performance) |
| Memory Tests | Heap-Snapshot vor/nach `setData_` mit 200 Items |
| Memory Tests | Waterfall malloc-Leak: vor/nach 10× `invalidateLayout` |
| UI Tests | Edit-Mode Toggle, Item-Delete, Badge-Sichtbarkeit |
| UI Tests | Page-Control Interaction (Dot-Tap → smooth animation) |

---

## 12. Dokumentation

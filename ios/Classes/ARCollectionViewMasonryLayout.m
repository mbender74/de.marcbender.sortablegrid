#import "ARCollectionViewMasonryLayout.h"
#import "_ARCollectionViewMasonryAttributesGrid.h"

NSString *const ARCollectionElementKindSectionStickyHeader = @"ARCollectionElementKindSectionStickyHeader";



@interface ARCollectionViewMasonryLayout()
@property (nonatomic, assign) enum ARCollectionViewMasonryLayoutDirection direction;

@property (nonatomic, assign) NSInteger itemCount;

@property (nonatomic, assign) BOOL stickyHeaderIsScrolling;

@property (nonatomic, strong) UICollectionViewLayoutAttributes *headerAttributes;
@property (nonatomic, strong) UICollectionViewLayoutAttributes *footerAttributes;
@property (nonatomic, strong) UICollectionViewLayoutAttributes *stickyHeaderAttributes;

@property (nonatomic, strong) _ARCollectionViewMasonryAttributesGrid *attributesGrid;

@end

@implementation ARCollectionViewMasonryLayout

- (instancetype)initWithDirection:(enum ARCollectionViewMasonryLayoutDirection)direction
{
    self = [super init];
    if (!self) return nil;

    
    _direction = direction;
    _rank = 3;
    _dimensionLength = 120;
    _contentInset = UIEdgeInsetsZero;
    _itemMargins = CGSizeZero;

    return self;
}

#pragma mark - Custom Accessors that Invalidate layout

- (void)setRank:(NSUInteger)rank
{
    NSLog(@"[INFO] setRank: ");

    if (_rank != rank) {
        _rank = rank;
        [self invalidateLayout];
    }
}


- (void)setDimensionLength:(CGFloat)dimensionLength
{
    NSLog(@"[INFO] setDimensionLength: ");

    if (_dimensionLength != dimensionLength) {
        _dimensionLength = dimensionLength;
        [self invalidateLayout];
    }
}

- (void)setContentInset:(UIEdgeInsets)contentInset
{
    NSLog(@"[INFO] setContentInset: ");

    if (!UIEdgeInsetsEqualToEdgeInsets(_contentInset, contentInset)) {
        _contentInset = contentInset;
        [self invalidateLayout];
    }
}

- (void)setItemMargins:(CGSize)itemMargins
{
    NSLog(@"[INFO] setItemMargins: ");

    if (!CGSizeEqualToSize(_itemMargins, itemMargins)) {
        _itemMargins = itemMargins;
        [self invalidateLayout];
    }
}

#pragma mark - Layout

- (void)prepareLayout
{
    [super prepareLayout];

    if ([self collectionView]) {
        NSLog(@"[INFO] prepareLayout: ");

       // NSAssert(self.delegate != nil, @"Delegate is nil, most likely because the collection view's delegate does not conform to ARCollectionViewMasonryLayoutDelegate.");

        // We need to pre-load the heights and the widths from the collectionview
        // and our delegate in order to pass these through to setupLayoutWithWidth

        NSInteger itemCount = [self.collectionView.dataSource collectionView:self.collectionView numberOfItemsInSection:0];

        NSMutableArray *variableDimensions = [NSMutableArray arrayWithCapacity:itemCount];
        CGFloat staticDimension = self.isHorizontal ? self.collectionView.frame.size.height : self.collectionView.frame.size.width;

        // Ask delegates for all the dimensions
        for (int i = 0; i < itemCount; i++) {
            NSIndexPath *indexPath = [NSIndexPath indexPathForItem:i inSection:0];

            

            
            CGSize variableDimension = [self.delegate collectionView:self.collectionView
                                                               layout:self
                                               sizeForItemAtIndexPath:indexPath];

            
            NSValue *sizeValue = [NSValue valueWithCGSize:variableDimension];

            
            [variableDimensions addObject:sizeValue];
        }

        [self setupLayoutWithStaticDimension:staticDimension andVariableDimensions:variableDimensions];
    }
}

- (id<ARCollectionViewMasonryLayoutDelegate>)delegate
{
    NSLog(@"[INFO] ARCollectionViewMasonryLayoutDelegate: ");

    id<ARCollectionViewMasonryLayoutDelegate> delegate = nil;
    if ([self.collectionView.delegate conformsToProtocol:@protocol(ARCollectionViewMasonryLayoutDelegate)]) {
        delegate = (id<ARCollectionViewMasonryLayoutDelegate>)(self.collectionView.delegate);
    }
    return delegate;
}

- (CGFloat)longestDimensionWithLengths:(NSArray *)variableDimensions withOppositeDimension:(CGFloat)staticDimension;
{
    NSLog(@"[INFO] longestDimensionWithLengths: ");

    if ([self collectionView]) {
        [self setupLayoutWithStaticDimension:staticDimension andVariableDimensions:variableDimensions];
    }

    if (self.isHorizontal) {
        return  [self collectionViewContentSize].width;
    } else {
        return  [self collectionViewContentSize].height;
    }
}

- (void)setupLayoutWithStaticDimension:(CGFloat)staticDimension andVariableDimensions:(NSArray *)variableDimensions
{
    NSLog(@"[INFO] setupLayoutWithStaticDimension: ");

    UICollectionViewFlowLayoutInvalidationContext *invalidationContext = [[UICollectionViewFlowLayoutInvalidationContext alloc] init];

    self.dimensionLength = ceilf(self.dimensionLength);
    self.itemCount = variableDimensions.count;
    CGFloat centeringOffset = [self generateCenteringOffsetWithMainDimension:staticDimension];

    BOOL isHorizontal = self.isHorizontal;
    BOOL hasContentInset = self.hasContentInset;

    CGFloat leadingInset = 0;
    CGFloat orthogonalInset = 0;

    if (isHorizontal) {
        if (hasContentInset) {
            leadingInset = self.contentInset.left;
            orthogonalInset = self.contentInset.top;
        } else {
            leadingInset = self.itemMargins.width;
            orthogonalInset = self.itemMargins.height;
        }
    } else {
        if (hasContentInset) {
            leadingInset = self.contentInset.top;
            orthogonalInset = self.contentInset.left;
        } else {
            leadingInset = self.itemMargins.height;
            orthogonalInset = self.itemMargins.width;
        }
    }


    self.attributesGrid = [[_ARCollectionViewMasonryAttributesGrid alloc] initWithSectionCount:self.rank
                                                                                  isHorizontal:isHorizontal
                                                                                  leadingInset:leadingInset
                                                                               orthogonalInset:orthogonalInset
                                                                                mainItemMargin:self.mainItemMargin
                                                                           alternateItemMargin:self.alternateItemMargin
                                                                               centeringOffset:centeringOffset];

    [variableDimensions enumerateObjectsUsingBlock:^(id dimension, NSUInteger index, BOOL *stop) {
        
        NSIndexPath *indexPath = [NSIndexPath indexPathForItem:index inSection:0];
        UICollectionViewLayoutAttributes *attributes = [UICollectionViewLayoutAttributes layoutAttributesForCellWithIndexPath:indexPath];

        
        
        CGSize size = [dimension CGSizeValue];

        
        if (isHorizontal) {
            attributes.size = CGSizeMake(size.width, self.dimensionLength);
        } else {
            attributes.size = CGSizeMake(self.dimensionLength, size.height);
        }

        [self.attributesGrid addAttributes:attributes];
    }];

    [self.attributesGrid ensureTrailingItemsDoNotStickOut];


    [self invalidateLayoutWithContext:invalidationContext];
}

- (CGFloat)headerDimensionAtIndexPath:(NSIndexPath *)indexPath
{
    NSLog(@"[INFO] headerDimensionAtIndexPath: ");

    CGSize size = [self headerSizeAtIndexPath:indexPath];
    if (CGSizeEqualToSize(size, CGSizeZero)) { return NSNotFound; }

    if ([self isHorizontal]) {
        return size.width;
    } else {
        return size.height;
    }
}

- (CGFloat)stickyHeaderDimensionAtIndexPath:(NSIndexPath *)indexPath
{
    NSLog(@"[INFO] stickyHeaderDimensionAtIndexPath: ");

    CGSize size = [self stickyHeaderSizeAtIndexPath:indexPath];
    if (CGSizeEqualToSize(size, CGSizeZero)) { return NSNotFound; }

    if ([self isHorizontal]) {
        return size.width;
    } else {
        return size.height;
    }
}

- (CGFloat)footerDimensionAtIndexPath:(NSIndexPath *)indexPath
{
    NSLog(@"[INFO] footerDimensionAtIndexPath: ");

    CGSize size = [self footerSizeAtIndexPath:indexPath];
    if (CGSizeEqualToSize(size, CGSizeZero)) { return NSNotFound; }

    if ([self isHorizontal]) {
        return size.width;
    } else {
        return size.height;
    }
}

- (CGSize)headerSizeAtIndexPath:(NSIndexPath *)indexPath
{
    NSLog(@"[INFO] headerSizeAtIndexPath: ");

    id<ARCollectionViewMasonryLayoutDelegate> delegate = self.delegate;
    CGSize size = CGSizeZero;

    if (delegate && [delegate respondsToSelector:@selector(collectionView:layout:referenceSizeForHeaderInSection:)]) {
        size = [delegate collectionView:self.collectionView layout:self referenceSizeForHeaderInSection:indexPath.section];
    }

    return size;
}

- (CGSize)stickyHeaderSizeAtIndexPath:(NSIndexPath *)indexPath
{
    NSLog(@"[INFO] stickyHeaderSizeAtIndexPath: ");

    id<ARCollectionViewMasonryLayoutDelegate> delegate = self.delegate;
    CGSize size = CGSizeZero;

    if (delegate && [delegate respondsToSelector:@selector(collectionView:layout:referenceSizeForStickyHeaderInSection:)]) {
        size = [delegate collectionView:self.collectionView layout:self referenceSizeForStickyHeaderInSection:indexPath.section];
    }

    return size;
}

- (CGSize)footerSizeAtIndexPath:(NSIndexPath *)indexPath
{
    NSLog(@"[INFO] footerSizeAtIndexPath: ");

    id<UICollectionViewDelegateFlowLayout> delegate = self.delegate;
    CGSize size = CGSizeZero;

    if (delegate && [delegate respondsToSelector:@selector(collectionView:layout:referenceSizeForFooterInSection:)]) {
        size = [delegate collectionView:self.collectionView layout:self referenceSizeForFooterInSection:indexPath.section];
    }

    return size;
}

- (void)setupHeaderAtIndexPath:(NSIndexPath *)indexPath
{
    NSLog(@"[INFO] setupHeaderAtIndexPath: ");

    UICollectionViewLayoutAttributes *attributes = [UICollectionViewLayoutAttributes layoutAttributesForSupplementaryViewOfKind:UICollectionElementKindSectionHeader withIndexPath:indexPath];

    CGSize size = [self headerSizeAtIndexPath:indexPath];
    if ([self isHorizontal]) {
        attributes.frame = CGRectMake(0, 0, size.width, CGRectGetHeight(self.collectionView.bounds));
    } else {
        attributes.frame = CGRectMake(0, 0, CGRectGetWidth(self.collectionView.bounds), size.height);
    }

    [self.collectionView registerClass:[UICollectionReusableView class] forSupplementaryViewOfKind:UICollectionElementKindSectionHeader withReuseIdentifier:UICollectionElementKindSectionHeader];
    self.headerAttributes = attributes;
}

- (void)setupFooterAtIndexPath:(NSIndexPath *)indexPath
{
    NSLog(@"[INFO] setupFooterAtIndexPath: ");

    UICollectionViewLayoutAttributes *attributes = [UICollectionViewLayoutAttributes layoutAttributesForSupplementaryViewOfKind:UICollectionElementKindSectionFooter withIndexPath:indexPath];

    CGSize size = [self footerSizeAtIndexPath:indexPath];
    CGFloat longestDimension = self.attributesGrid.longestSectionDimension;
    if ([self isHorizontal]) {
        attributes.frame = CGRectMake(longestDimension, 0, size.width, CGRectGetHeight(self.collectionView.bounds));
    } else {
        attributes.frame = CGRectMake(0, longestDimension, CGRectGetWidth(self.collectionView.bounds), size.height);
    }

    [self.collectionView registerClass:[UICollectionReusableView class] forSupplementaryViewOfKind:UICollectionElementKindSectionFooter withReuseIdentifier:UICollectionElementKindSectionFooter];
    self.footerAttributes = attributes;
}

- (CGSize)collectionViewContentSize
{
    NSLog(@"[INFO] collectionViewContentSize: ");

    NSIndexPath *indexPathZero = [NSIndexPath indexPathForItem:0 inSection:0];
    BOOL isHorizontal = self.isHorizontal;
    CGFloat alternateDimension = 0;

    // This includes the header height even if there are no items.
    alternateDimension = self.attributesGrid.longestSectionDimension;

    if (self.itemCount > 0) {
        // Add trailing inset/margin
        if (isHorizontal) {
            alternateDimension += (self.hasContentInset ? self.contentInset.right : self.itemMargins.width);
        } else {
            alternateDimension += (self.hasContentInset ? self.contentInset.bottom : self.itemMargins.height);
        }
    }


    CGSize contentSize = self.collectionView.frame.size;
    if (isHorizontal) {
        contentSize.width = alternateDimension;
    } else {
        contentSize.height = alternateDimension;
    }

    return contentSize;
}

- (UICollectionViewLayoutAttributes *)layoutAttributesForItemAtIndexPath:(NSIndexPath *)path
{
    NSLog(@"[INFO] layoutAttributesForItemAtIndexPath: ");

    NSArray *attributes = self.attributesGrid.allItemAttributes;
    // This can happen during a reload, returning nil is no problem.
    if (path.row > attributes.count - 1) return nil;
    return attributes[path.row];
}

- (NSArray *)layoutAttributesForElementsInRect:(CGRect)rect
{
    NSLog(@"[INFO] layoutAttributesForElementsInRect: ");

    // Lays out all of the cells in the collection view
    // extremely performance critical code.
    NSArray *attributes = self.attributesGrid.allItemAttributes;
    return [attributes filteredArrayUsingPredicate:[NSPredicate predicateWithBlock:^BOOL(id evaluatedObject, NSDictionary *bindings) {
        return CGRectIntersectsRect(rect, [evaluatedObject frame]);
    }]];
}

- (UICollectionViewLayoutAttributes *)layoutAttributesForSupplementaryViewOfKind:(NSString *)kind atIndexPath:(NSIndexPath *)indexPath
{
    NSLog(@"[INFO] layoutAttributesForSupplementaryViewOfKind: ");

    if ([kind isEqualToString: ARCollectionElementKindSectionStickyHeader]) {
        return [self attributesForStickyHeader];
    } else if ([kind isEqualToString:UICollectionElementKindSectionHeader]) {
        return self.headerAttributes;
    } else if ([kind isEqualToString:UICollectionElementKindSectionFooter]) {
        return self.footerAttributes;
    }

    return nil;
}

- (UICollectionViewLayoutAttributes *)attributesForStickyHeader
{
    NSLog(@"[INFO] attributesForStickyHeader: ");

    NSIndexPath *indexPathZero = [NSIndexPath indexPathForRow:0 inSection:0];
    CGFloat maxDistanceFromLeadingEdge = [self headerDimensionAtIndexPath:indexPathZero];
    CGFloat edge = MAX(maxDistanceFromLeadingEdge, self.collectionView.contentOffset.y);

    BOOL isScrolling = edge != maxDistanceFromLeadingEdge;
    if (isScrolling != self.stickyHeaderIsScrolling && self.delegate && [self.delegate respondsToSelector:@selector(collectionView:layout:stickyHeaderHasChangedStickyness:)]) {
        [self.delegate collectionView:self.collectionView layout:self stickyHeaderHasChangedStickyness:isScrolling];
    }
    self.stickyHeaderIsScrolling = isScrolling;

    CGSize stickySize = CGSizeZero;
    if (self.delegate && [self.delegate respondsToSelector:@selector(collectionView:layout:referenceSizeForStickyHeaderInSection:)]) {
        stickySize = [self.delegate collectionView:self.collectionView layout:self referenceSizeForStickyHeaderInSection:0];
    }

    if (!self.stickyHeaderAttributes) {
        _stickyHeaderAttributes = [UICollectionViewLayoutAttributes layoutAttributesForSupplementaryViewOfKind:ARCollectionElementKindSectionStickyHeader withIndexPath:indexPathZero];

        _stickyHeaderAttributes.zIndex = 1024;
        [self.collectionView registerClass:[UICollectionReusableView class] forSupplementaryViewOfKind:ARCollectionElementKindSectionStickyHeader withReuseIdentifier:ARCollectionElementKindSectionStickyHeader];
    }

    if ([self isHorizontal]) {
        self.stickyHeaderAttributes.frame = CGRectMake(edge, 0, stickySize.width, CGRectGetHeight(self.collectionView.bounds));
    } else {
        self.stickyHeaderAttributes.frame = CGRectMake(0, edge, CGRectGetWidth(self.collectionView.bounds), stickySize.height);
    }

    return self.stickyHeaderAttributes;
}

/// We allow this to always pass through (this is called on
/// every scroll tick ) so we can do invalidation on the
/// ARCollectionElementKindSectionStickyHeader

- (BOOL)shouldInvalidateLayoutForBoundsChange:(CGRect)newBounds
{
    NSLog(@"[INFO] shouldInvalidateLayoutForBoundsChange: ");

    return YES;
}

- (UICollectionViewLayoutInvalidationContext *)invalidationContextForBoundsChange:(CGRect)newBounds
{
    NSLog(@"[INFO] UICollectionViewLayoutInvalidationContext: ");

    NSIndexPath *indexPathZero = [NSIndexPath indexPathForRow:0 inSection:0];

    UICollectionViewFlowLayoutInvalidationContext *context = (UICollectionViewFlowLayoutInvalidationContext *)[super invalidationContextForBoundsChange:newBounds];

    // Only invalidate the flow layout (masonry bits) when something drastic has happened
    BOOL needsEverything = !CGSizeEqualToSize(newBounds.size, self.collectionView.bounds.size);
    context.invalidateFlowLayoutDelegateMetrics = needsEverything;

    return context;
}

// The offset used on the non-main direction to ensure centering
- (CGFloat)generateCenteringOffsetWithMainDimension:(CGFloat)dimension
{
    NSLog(@"[INFO] generateCenteringOffsetWithMainDimension: ");

    NSInteger numberOfLines = self.rank;
    CGFloat contentWidth = numberOfLines * self.dimensionLength;

    CGFloat contentMargin = [self mainItemMargin];
    contentWidth += (numberOfLines - 1) * contentMargin;

    return (dimension / 2) - (contentWidth / 2);
}

- (BOOL)hasContentInset
{
    NSLog(@"[INFO] hasContentInset: ");

    return !UIEdgeInsetsEqualToEdgeInsets(self.contentInset, UIEdgeInsetsZero);
}

- (BOOL)isHorizontal
{
    NSLog(@"[INFO] isHorizontal: ");

    return (self.direction == ARCollectionViewMasonryLayoutDirectionHorizontal);
}

/// When vertical this is the horizontal item margin, when
/// horizontal its the vertical

- (CGFloat)mainItemMargin
{
    NSLog(@"[INFO] mainItemMargin: ");

    return (self.isHorizontal) ? self.itemMargins.height : self.itemMargins.width;
}

/// The opposite of above, the space vertically when in vertical mode

- (CGFloat)alternateItemMargin
{
    NSLog(@"[INFO] alternateItemMargin: ");

    return (self.isHorizontal) ? self.itemMargins.width : self.itemMargins.height;
}

@end

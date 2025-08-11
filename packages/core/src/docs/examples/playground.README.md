# DataEditor Playground

A comprehensive Storybook playground for exploring all available properties and features of the Glide Data Grid's DataEditor component.

## Overview

The DataEditor Playground provides an interactive interface to experiment with all DataEditor props. Use the Storybook controls panel to modify properties and see how they affect the grid's behavior and appearance in real-time.

## Available Categories

### Basic Configuration
- **columnsCount**: Number of columns to display (1-50)
- **rows**: Number of rows in the data grid (1-10,000)
- **width**: Grid width (e.g., '100%', 800)
- **height**: Grid height (e.g., '100%', 600)

### Row Markers
- **rowMarkers**: Type of row markers on the left side
  - `none`: No row markers
  - `number`: Show row numbers
  - `clickable-number`: Clickable row numbers for selection
  - `checkbox`: Show checkboxes
  - `checkbox-visible`: Always visible checkboxes
  - `both`: Numbers that reveal checkboxes on hover
- **rowMarkerWidth**: Width of the row marker column
- **rowMarkerStartIndex**: Starting index for row numbering

### Headers
- **headerHeight**: Height of the column header row
- **groupHeaderHeight**: Height of the group header row (optional)

### Scrolling
- **smoothScrollX**: Enable smooth horizontal scrolling
- **smoothScrollY**: Enable smooth vertical scrolling
- **preventDiagonalScrolling**: Prevent diagonal scrolling

### Column Properties
- **freezeColumns**: Number of columns to freeze on the left
- **minColumnWidth**: Minimum width for column resizing
- **maxColumnWidth**: Maximum width for column resizing
- **maxColumnAutoWidth**: Maximum width for auto-sizing

### Row Properties
- **rowHeight**: Height of each row in pixels
- **freezeRows**: Number of rows to freeze at the top

### Selection
- **rangeSelect**: Controls range selection behavior
  - `none`: No range selection
  - `cell`: Single cell selection
  - `rect`: Rectangle selection
  - `multi-cell`: Multiple cells
  - `multi-rect`: Multiple rectangles
- **columnSelect**: Column selection mode (none/single/multi)
- **rowSelect**: Row selection mode (none/single/multi)
- **rangeSelectionBlending**: How selections blend with other types
- **rangeSelectionColumnSpanning**: Allow ranges across columns

### Editing
- **editOnType**: Start editing when typing on selected cell
- **copyHeaders**: Include headers when copying data
- **getCellsForSelection**: Enable copy/paste functionality

### Fill Handle
- **fillHandle**: Show fill handle for auto-filling cells

### Visual Effects
- **verticalBorder**: Show vertical borders between columns
- **drawFocusRing**: Draw focus ring around selected cells
- **scaleToRem**: Scale elements to match rem scaling
- **fixedShadowX**: Show shadow behind frozen columns
- **fixedShadowY**: Show shadow behind frozen rows/headers

### Search
- **showSearch**: Show the search interface

### Theme Colors
Customize the grid's appearance with color controls:
- **accentColor**: Primary accent color for selections
- **accentLight**: Light accent color for highlights
- **textDark/Medium/Light**: Text colors
- **bgCell/bgCellMedium**: Cell background colors
- **bgHeader/bgHeaderHasFocus**: Header background colors
- **borderColor**: Grid lines and borders

### Trailing Row
- **enableTrailingRow**: Enable trailing row for adding new data
- **trailingRowTint**: Apply tint to the trailing row
- **trailingRowSticky**: Make trailing row always visible
- **trailingRowHint**: Hint text on hover

### Keybindings
Control which keyboard shortcuts are enabled:
- **enableSelectAll**: Ctrl+A to select all
- **enableSelectRow**: Shift+Space to select row
- **enableSelectColumn**: Ctrl+Space to select column
- **enableClear**: Delete/Backspace to clear cells
- **enableCopy**: Ctrl+C to copy
- **enablePaste**: Ctrl+V to paste
- **enableSearch**: Ctrl+F to search

### Drag and Drop
- **onColumnMoved**: Enable column reordering
- **onRowMoved**: Enable row reordering

### Advanced Features
- **experimental**: Enable experimental features (strict mode)
- **trapFocus**: Trap focus within the grid
- **scrollToActiveCell**: Auto-scroll to keep active cell in view
- **cellActivationBehavior**: How cells are activated for editing
- **rowSelectionMode**: Row selection modifier key behavior
- **spanRangeBehavior**: How spanned cells behave in selections

### Additional Features
- **showRightElement**: Display a custom element on the right
- **showMinimap**: Show interactive minimap for navigation
- **overscrollX/Y**: Enable overscrolling behavior

## Usage Tips

1. **Start with defaults**: The playground begins with sensible defaults
2. **Experiment by category**: Focus on one category at a time
3. **Check console**: Event handlers log to the browser console
4. **Performance testing**: Try large datasets (high row/column counts)
5. **Theme customization**: Use color controls to create custom themes

## Event Logging

The playground logs various events to the browser console:
- Cell clicks and edits
- Header clicks
- Row/column moves
- Row append requests

Open your browser's developer console to see these events in action.

## Example Configurations

### Minimal Grid
- columnsCount: 3
- rows: 100
- rowMarkers: none
- editOnType: false

### Excel-like Experience
- rowMarkers: both
- fillHandle: true
- editOnType: true
- smoothScrollX/Y: true
- enableSelectAll: true

### Read-only Dashboard
- editOnType: false
- getCellsForSelection: true
- showSearch: true
- fixedShadowX/Y: true

### Data Entry Form
- enableTrailingRow: true
- trailingRowSticky: true
- trapFocus: true
- scrollToActiveCell: true
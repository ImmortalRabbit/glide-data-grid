import React from "react";
import { DataEditorAll as DataEditor } from "../../data-editor-all.js";
import {
    BeautifulWrapper,
    Description,
    useMockDataGenerator,
    defaultProps,
} from "../../data-editor/stories/utils.js";
import { SimpleThemeWrapper } from "../../stories/story-utils.js";
import { GridCellKind, type GridSelection, type Theme, CompactSelection } from "../../internal/data-grid/data-grid-types.js";

export default {
    title: "Glide-Data-Grid/DataEditor Playground",
    decorators: [
        (Story: React.ComponentType) => (
            <SimpleThemeWrapper>
                <BeautifulWrapper
                    title="DataEditor Playground"
                    description={
                        <>
                            <Description>
                                Comprehensive playground to test all DataEditor props. Use the controls panel to experiment with different configurations.
                            </Description>
                        </>
                    }>
                    <Story />
                </BeautifulWrapper>
            </SimpleThemeWrapper>
        ),
    ],
    parameters: {
        docs: {
            source: {
                code: `import React from "react";
import { DataEditorAll as DataEditor } from "@glideapps/glide-data-grid";
import "@glideapps/glide-data-grid/dist/index.css";

// Sample data generator
const generateColumns = (count) => {
    return Array.from({ length: count }, (_, i) => ({
        title: \`Column \${i + 1}\`,
        id: \`column-\${i + 1}\`,
        width: 120,
    }));
};

const getCellContent = ([col, row]) => {
    return {
        kind: "text", // or "number", "boolean", "image", etc.
        data: \`Cell \${col},\${row}\`,
        displayData: \`Cell \${col},\${row}\`,
        allowOverlay: true,
    };
};

function MyDataGrid() {
    const [selection, setSelection] = React.useState({
        columns: { items: [] },
        rows: { items: [] },
        current: undefined,
    });

    const columns = generateColumns(10);

    return (
        <DataEditor
            columns={columns}
            rows={1000}
            getCellContent={getCellContent}
            width="100%"
            height="400px"
            smoothScrollX={true}
            smoothScrollY={true}
            rowMarkers="number"
            gridSelection={selection}
            onGridSelectionChange={setSelection}
            getCellsForSelection={true}
        />
    );
}

export default MyDataGrid;`,
                language: "tsx",
                type: "code",
            },
        },
    },
};

interface PlaygroundProps {
    // Basic Configuration
    columnsCount: number;
    rows: number;
    width: number | string;
    height: number | string;
    
    // Row Markers
    rowMarkers: "none" | "number" | "clickable-number" | "checkbox" | "checkbox-visible" | "both";
    rowMarkerWidth?: number;
    rowMarkerStartIndex: number;
    
    // Headers
    headerHeight: number;
    groupHeaderHeight?: number;
    
    // Scrolling
    smoothScrollX: boolean;
    smoothScrollY: boolean;
    preventDiagonalScrolling: boolean;
    
    // Column Properties
    freezeColumns: number;
    minColumnWidth: number;
    maxColumnWidth: number;
    maxColumnAutoWidth?: number;
    
    // Row Properties
    rowHeight: number;
    
    // Selection
    rangeSelect: "none" | "cell" | "rect" | "multi-cell" | "multi-rect";
    columnSelect: "none" | "single" | "multi";
    rowSelect: "none" | "single" | "multi";
    rangeSelectionBlending: "exclusive" | "mixed";
    columnSelectionBlending: "exclusive" | "mixed";
    rowSelectionBlending: "exclusive" | "mixed";
    rangeSelectionColumnSpanning: boolean;
    
    // Editing
    editOnType: boolean;
    copyHeaders: boolean;
    getCellsForSelection: boolean;
    
    // Fill Handle
    fillHandle: boolean;
    
    // Visual Effects
    verticalBorder: boolean;
    drawFocusRing: boolean | "no-editor";
    scaleToRem: boolean;
    
    // Search
    showSearch: boolean;
    
    // Scrolling Behavior
    overscrollX?: number;
    overscrollY?: number;
    
    // Theme Colors (simplified subset)
    accentColor: string;
    accentLight: string;
    textDark: string;
    textMedium: string;
    textLight: string;
    bgCell: string;
    bgCellMedium: string;
    bgHeader: string;
    bgHeaderHasFocus: string;
    borderColor: string;
    
    // Advanced Features
    experimental: boolean;
    trapFocus: boolean;
    scrollToActiveCell: boolean;
    
    // Cell Activation
    cellActivationBehavior: "double-click" | "single-click" | "second-click";
    
    // Row Selection Mode
    rowSelectionMode: "auto" | "multi";
    
    // Span Behavior
    spanRangeBehavior: "default" | "allowPartial";
    
    // Trailing Row
    enableTrailingRow: boolean;
    trailingRowTint: boolean;
    trailingRowSticky: boolean;
    trailingRowHint: string;
    
    // Keybindings
    enableSelectAll: boolean;
    enableSelectRow: boolean;
    enableSelectColumn: boolean;
    enableClear: boolean;
    enableCopy: boolean;
    enablePaste: boolean;
    enableSearch: boolean;
    
    // Drag and Drop
    onColumnMoved: boolean;
    onRowMoved: boolean;
    
    // Right Element
    showRightElement: boolean;
    
    // Overscroll
    enableOverscrollX: boolean;
    enableOverscrollY: boolean;
    
    // Additional Visual
    fixedShadowX: boolean;
    fixedShadowY: boolean;
    
    // Minimap
    showMinimap: boolean;
    
    // Freeze Rows
    freezeRows: number;
}

// Utility function to generate copy-paste ready code
const generateCodeSnippet = (props: PlaygroundProps) => {
    const nonDefaultProps = [];
    
    // Add non-default props to the code snippet
    if (props.rows !== 1000) nonDefaultProps.push(`rows={${props.rows}}`);
    if (props.width !== "100%") nonDefaultProps.push(`width="${props.width}"`);
    if (props.height !== "100%") nonDefaultProps.push(`height="${props.height}"`);
    if (props.rowMarkers !== "number") nonDefaultProps.push(`rowMarkers="${props.rowMarkers}"`);
    if (props.headerHeight !== 36) nonDefaultProps.push(`headerHeight={${props.headerHeight}}`);
    if (props.rowHeight !== 34) nonDefaultProps.push(`rowHeight={${props.rowHeight}}`);
    if (props.freezeColumns !== 0) nonDefaultProps.push(`freezeColumns={${props.freezeColumns}}`);
    if (!props.smoothScrollX) nonDefaultProps.push(`smoothScrollX={false}`);
    if (!props.smoothScrollY) nonDefaultProps.push(`smoothScrollY={false}`);
    if (props.preventDiagonalScrolling) nonDefaultProps.push(`preventDiagonalScrolling={true}`);
    if (!props.editOnType) nonDefaultProps.push(`editOnType={false}`);
    if (!props.fillHandle) nonDefaultProps.push(`fillHandle={false}`);
    if (props.showSearch) nonDefaultProps.push(`showSearch={true}`);
    
    return `import React from "react";
import { DataEditorAll as DataEditor } from "@glideapps/glide-data-grid";
import "@glideapps/glide-data-grid/dist/index.css";

const columns = Array.from({ length: ${props.columnsCount} }, (_, i) => ({
    title: \`Column \${i + 1}\`,
    id: \`column-\${i + 1}\`,
    width: 120,
}));

const getCellContent = ([col, row]) => ({
    kind: "text",
    data: \`Cell \${col},\${row}\`,
    displayData: \`Cell \${col},\${row}\`,
    allowOverlay: true,
});

function MyDataGrid() {
    const [selection, setSelection] = React.useState({
        columns: { items: [] },
        rows: { items: [] },
        current: undefined,
    });

    return (
        <DataEditor
            columns={columns}
            getCellContent={getCellContent}
            gridSelection={selection}
            onGridSelectionChange={setSelection}
            getCellsForSelection={true}
            ${nonDefaultProps.join('\n            ')}
        />
    );
}`;
};

export const Playground: React.FC<PlaygroundProps> = p => {
    const { cols, getCellContent } = useMockDataGenerator(p.columnsCount);
    
    const [gridSelection, setGridSelection] = React.useState<GridSelection>({
        columns: CompactSelection.empty(),
        rows: CompactSelection.empty(),
        current: undefined,
    });
    
    const [searchValue, setSearchValue] = React.useState("");
    
    // Build keybindings from props
    const keybindings = React.useMemo(() => ({
        selectAll: p.enableSelectAll,
        selectRow: p.enableSelectRow,
        selectColumn: p.enableSelectColumn,
        clear: p.enableClear,
        copy: p.enableCopy,
        paste: p.enablePaste,
        search: p.enableSearch,
    }), [p.enableSelectAll, p.enableSelectRow, p.enableSelectColumn, p.enableClear, p.enableCopy, p.enablePaste, p.enableSearch]);
    
    // Build trailing row options from props
    const trailingRowOptions = React.useMemo(() => {
        if (!p.enableTrailingRow) return undefined;
        return {
            tint: p.trailingRowTint,
            sticky: p.trailingRowSticky,
            hint: p.trailingRowHint,
        };
    }, [p.enableTrailingRow, p.trailingRowTint, p.trailingRowSticky, p.trailingRowHint]);
    
    // Build theme from props
    const theme: Partial<Theme> = {
        accentColor: p.accentColor,
        accentLight: p.accentLight,
        textDark: p.textDark,
        textMedium: p.textMedium,
        textLight: p.textLight,
        bgCell: p.bgCell,
        bgCellMedium: p.bgCellMedium,
        bgHeader: p.bgHeader,
        bgHeaderHasFocus: p.bgHeaderHasFocus,
        borderColor: p.borderColor,
    };

    // Log the current code snippet for easy copying
    React.useEffect(() => {
        const codeSnippet = generateCodeSnippet(p);
        console.log("📋 Copy this code to use the current configuration:");
        console.log(codeSnippet);
    }, [p]);

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <div style={{ 
                padding: "8px 12px", 
                background: "#f5f5f5", 
                borderBottom: "1px solid #ddd",
                fontSize: "12px",
                fontFamily: "monospace"
            }}>
                💡 Check the browser console for copy-paste ready code with your current settings
            </div>
            <DataEditor
                {...defaultProps}
            // Basic Configuration
            columns={cols}
            rows={p.rows}
            width={p.width}
            height={p.height}
            
            // Row Markers
            rowMarkers={p.rowMarkers === "none" ? undefined : p.rowMarkers}
            
            // Headers  
            headerHeight={p.headerHeight}
            groupHeaderHeight={p.groupHeaderHeight}
            
            // Scrolling
            smoothScrollX={p.smoothScrollX}
            smoothScrollY={p.smoothScrollY}
            preventDiagonalScrolling={p.preventDiagonalScrolling}
            
            // Column Properties
            freezeColumns={p.freezeColumns}
            minColumnWidth={p.minColumnWidth}
            maxColumnWidth={p.maxColumnWidth}
            maxColumnAutoWidth={p.maxColumnAutoWidth}
            
            // Row Properties
            rowHeight={p.rowHeight}
            freezeRows={p.freezeRows}
            
            // Selection
            rangeSelect={p.rangeSelect}
            columnSelect={p.columnSelect}
            rowSelect={p.rowSelect}
            rangeSelectionBlending={p.rangeSelectionBlending}
            columnSelectionBlending={p.columnSelectionBlending}
            rowSelectionBlending={p.rowSelectionBlending}
            rangeSelectionColumnSpanning={p.rangeSelectionColumnSpanning}
            
            // Editing
            editOnType={p.editOnType}
            copyHeaders={p.copyHeaders}
            getCellsForSelection={p.getCellsForSelection}
            
            // Visual Effects
            verticalBorder={p.verticalBorder}
            drawFocusRing={p.drawFocusRing}
            scaleToRem={p.scaleToRem}
            
            // Search
            showSearch={p.showSearch}
            searchValue={searchValue}
            onSearchValueChange={setSearchValue}
            
            // Scrolling Behavior
            overscrollX={p.enableOverscrollX ? p.overscrollX : undefined}
            overscrollY={p.enableOverscrollY ? p.overscrollY : undefined}
            
            // Additional Visual
            fixedShadowX={p.fixedShadowX}
            fixedShadowY={p.fixedShadowY}
            
            // Theme
            theme={theme}
            
            // Keybindings
            keybindings={keybindings}
            
            // Trailing Row
            trailingRowOptions={trailingRowOptions}
            
            // Minimap
            showMinimap={p.showMinimap}
            
            // Advanced Features
            experimental={p.experimental ? { strict: true } : undefined}
            trapFocus={p.trapFocus}
            scrollToActiveCell={p.scrollToActiveCell}
            
            // Cell Activation
            cellActivationBehavior={p.cellActivationBehavior}
            
            // Row Selection Mode
            rowSelectionMode={p.rowSelectionMode}
            
            // Span Behavior
            spanRangeBehavior={p.spanRangeBehavior}
            
            // Data callbacks
            getCellContent={getCellContent}
            
            // Selection handling
            gridSelection={gridSelection}
            onGridSelectionChange={setGridSelection}
            
            // Fill Handle
            fillHandle={p.fillHandle}
            
            // Event handlers for demonstration
            onCellClicked={(cell, event) => {
                console.log("Cell clicked:", cell, event);
            }}
            onCellEdited={(cell, newValue) => {
                console.log("Cell edited:", cell, newValue);
            }}
            onHeaderClicked={(colIndex, event) => {
                console.log("Header clicked:", colIndex, event);
            }}
            onRowAppended={() => {
                console.log("Row append requested");
            }}
            onColumnMoved={p.onColumnMoved ? (startIndex, endIndex) => {
                console.log("Column moved:", startIndex, "to", endIndex);
            } : undefined}
            onRowMoved={p.onRowMoved ? (startIndex, endIndex) => {
                console.log("Row moved:", startIndex, "to", endIndex);
            } : undefined}
            rightElement={p.showRightElement ? <div style={{ padding: 8, background: "#f0f0f0", fontSize: 12 }}>Right Element</div> : undefined}
            />
        </div>
    );
};

(Playground as any).args = {
    // Basic Configuration
    columnsCount: 10,
    rows: 1000,
    width: "100%",
    height: "100%",
    
    // Row Markers
    rowMarkers: "number",
    rowMarkerWidth: undefined,
    rowMarkerStartIndex: 1,
    
    // Headers
    headerHeight: 36,
    groupHeaderHeight: undefined,
    
    // Scrolling
    smoothScrollX: true,
    smoothScrollY: true,
    preventDiagonalScrolling: false,
    
    // Column Properties
    freezeColumns: 0,
    minColumnWidth: 50,
    maxColumnWidth: 500,
    maxColumnAutoWidth: undefined,
    
    // Row Properties
    rowHeight: 34,
    
    // Selection
    rangeSelect: "rect",
    columnSelect: "multi",
    rowSelect: "multi",
    rangeSelectionBlending: "exclusive",
    columnSelectionBlending: "exclusive",
    rowSelectionBlending: "exclusive",
    rangeSelectionColumnSpanning: true,
    
    // Editing
    editOnType: true,
    copyHeaders: false,
    getCellsForSelection: true,
    
    // Fill Handle
    fillHandle: true,
    
    // Visual Effects
    verticalBorder: true,
    drawFocusRing: true,
    scaleToRem: false,
    
    // Search
    showSearch: false,
    
    // Scrolling Behavior
    overscrollX: undefined,
    overscrollY: undefined,
    
    // Theme Colors
    accentColor: "#4F5DFF",
    accentLight: "#B8C5FF",
    textDark: "#313139",
    textMedium: "#737383",
    textLight: "#B2B2C0",
    bgCell: "#FFFFFF",
    bgCellMedium: "#FAFAFB",
    bgHeader: "#F7F7F8",
    bgHeaderHasFocus: "#E9E9EB",
    borderColor: "#E1E2E5",
    
    // Advanced Features
    experimental: false,
    trapFocus: true,
    scrollToActiveCell: true,
    
    // Cell Activation
    cellActivationBehavior: "double-click",
    
    // Row Selection Mode
    rowSelectionMode: "auto",
    
    // Span Behavior
    spanRangeBehavior: "default",
    
    // Trailing Row
    enableTrailingRow: false,
    trailingRowTint: true,
    trailingRowSticky: false,
    trailingRowHint: "New row",
    
    // Keybindings
    enableSelectAll: true,
    enableSelectRow: true,
    enableSelectColumn: true,
    enableClear: true,
    enableCopy: true,
    enablePaste: true,
    enableSearch: true,
    
    // Drag and Drop
    onColumnMoved: false,
    onRowMoved: false,
    
    // Right Element
    showRightElement: false,
    
    // Overscroll
    enableOverscrollX: false,
    enableOverscrollY: false,
    
    // Additional Visual
    fixedShadowX: true,
    fixedShadowY: true,
    
    // Minimap
    showMinimap: false,
    
    // Freeze Rows
    freezeRows: 0,
};

(Playground as any).argTypes = {
    // Basic Configuration
    columnsCount: {
        control: {
            type: "range",
            min: 1,
            max: 50,
            step: 1,
        },
        description: "Number of columns to display in the grid",
        table: { category: "Basic Configuration" },
    },
    rows: {
        control: {
            type: "range",
            min: 1,
            max: 10000,
            step: 1,
        },
        description: "Number of rows in the data grid",
        table: { category: "Basic Configuration" },
    },
    width: {
        control: { type: "text" },
        description: "Width of the data grid (e.g., '100%', 800)",
        table: { category: "Basic Configuration" },
    },
    height: {
        control: { type: "text" },
        description: "Height of the data grid (e.g., '100%', 600)",
        table: { category: "Basic Configuration" },
    },
    
    // Row Markers
    rowMarkers: {
        control: { type: "select" },
        options: ["none", "number", "clickable-number", "checkbox", "checkbox-visible", "both"],
        description: "Type of row markers to display on the left side",
        table: { category: "Row Markers" },
    },
    rowMarkerWidth: {
        control: { type: "number", min: 20, max: 200, step: 5 },
        description: "Width of the row marker column in pixels",
        table: { category: "Row Markers" },
    },
    rowMarkerStartIndex: {
        control: { type: "number", min: 0, max: 100, step: 1 },
        description: "Starting index for row marker numbering",
        table: { category: "Row Markers" },
    },
    
    // Headers
    headerHeight: {
        control: { type: "range", min: 20, max: 100, step: 2 },
        description: "Height of the column header row in pixels",
        table: { category: "Headers" },
    },
    groupHeaderHeight: {
        control: { type: "number", min: 20, max: 100, step: 2 },
        description: "Height of the group header row in pixels (optional)",
        table: { category: "Headers" },
    },
    
    // Scrolling
    smoothScrollX: {
        control: { type: "boolean" },
        description: "Enable smooth horizontal scrolling",
        table: { category: "Scrolling" },
    },
    smoothScrollY: {
        control: { type: "boolean" },
        description: "Enable smooth vertical scrolling",
        table: { category: "Scrolling" },
    },
    preventDiagonalScrolling: {
        control: { type: "boolean" },
        description: "Prevent diagonal scrolling, scroll only horizontally or vertically at a time",
        table: { category: "Scrolling" },
    },
    
    // Column Properties
    freezeColumns: {
        control: { type: "range", min: 0, max: 10, step: 1 },
        description: "Number of columns to freeze on the left side when scrolling horizontally",
        table: { category: "Column Properties" },
    },
    minColumnWidth: {
        control: { type: "range", min: 20, max: 200, step: 5 },
        description: "Minimum width a column can be resized to",
        table: { category: "Column Properties" },
    },
    maxColumnWidth: {
        control: { type: "range", min: 100, max: 1000, step: 10 },
        description: "Maximum width a column can be resized to",
        table: { category: "Column Properties" },
    },
    maxColumnAutoWidth: {
        control: { type: "number", min: 100, max: 1000, step: 10 },
        description: "Maximum width a column can be auto-sized to",
        table: { category: "Column Properties" },
    },
    
    // Row Properties
    rowHeight: {
        control: { type: "range", min: 20, max: 100, step: 2 },
        description: "Height of each row in pixels",
        table: { category: "Row Properties" },
    },
    
    // Selection
    rangeSelect: {
        control: { type: "select" },
        options: ["none", "cell", "rect", "multi-cell", "multi-rect"],
        description: "Controls range selection behavior",
        table: { category: "Selection" },
    },
    columnSelect: {
        control: { type: "select" },
        options: ["none", "single", "multi"],
        description: "Controls column selection behavior",
        table: { category: "Selection" },
    },
    rowSelect: {
        control: { type: "select" },
        options: ["none", "single", "multi"],
        description: "Controls row selection behavior",
        table: { category: "Selection" },
    },
    rangeSelectionBlending: {
        control: { type: "select" },
        options: ["exclusive", "mixed"],
        description: "How range selections blend with other selection types",
        table: { category: "Selection" },
    },
    columnSelectionBlending: {
        control: { type: "select" },
        options: ["exclusive", "mixed"],
        description: "How column selections blend with other selection types",
        table: { category: "Selection" },
    },
    rowSelectionBlending: {
        control: { type: "select" },
        options: ["exclusive", "mixed"],
        description: "How row selections blend with other selection types",
        table: { category: "Selection" },
    },
    rangeSelectionColumnSpanning: {
        control: { type: "boolean" },
        description: "Allow range selections to span across multiple columns",
        table: { category: "Selection" },
    },
    
    // Editing
    editOnType: {
        control: { type: "boolean" },
        description: "Start editing when user types on a selected cell",
        table: { category: "Editing" },
    },
    copyHeaders: {
        control: { type: "boolean" },
        description: "Include column headers when copying data",
        table: { category: "Editing" },
    },
    getCellsForSelection: {
        control: { type: "boolean" },
        description: "Enable copy/paste functionality",
        table: { category: "Editing" },
    },
    
    // Fill Handle
    fillHandle: {
        control: { type: "boolean" },
        description: "Show fill handle for auto-filling cells",
        table: { category: "Fill Handle" },
    },
    
    // Visual Effects
    verticalBorder: {
        control: { type: "boolean" },
        description: "Show vertical borders between columns",
        table: { category: "Visual Effects" },
    },
    drawFocusRing: {
        control: { type: "select" },
        options: [true, false, "no-editor"],
        description: "Draw focus ring around selected cells",
        table: { category: "Visual Effects" },
    },
    scaleToRem: {
        control: { type: "boolean" },
        description: "Scale elements to match rem scaling",
        table: { category: "Visual Effects" },
    },
    
    // Search
    showSearch: {
        control: { type: "boolean" },
        description: "Show the search interface",
        table: { category: "Search" },
    },
    
    // Scrolling Behavior
    overscrollX: {
        control: { type: "number", min: 0, max: 500, step: 10 },
        description: "Allow horizontal overscrolling by specified pixels",
        table: { category: "Scrolling Behavior" },
    },
    overscrollY: {
        control: { type: "number", min: 0, max: 500, step: 10 },
        description: "Allow vertical overscrolling by specified pixels",
        table: { category: "Scrolling Behavior" },
    },
    
    // Theme Colors
    accentColor: {
        control: { type: "color" },
        description: "Primary accent color for selections and highlights",
        table: { category: "Theme Colors" },
    },
    accentLight: {
        control: { type: "color" },
        description: "Light accent color for secondary highlights",
        table: { category: "Theme Colors" },
    },
    textDark: {
        control: { type: "color" },
        description: "Dark text color",
        table: { category: "Theme Colors" },
    },
    textMedium: {
        control: { type: "color" },
        description: "Medium text color",
        table: { category: "Theme Colors" },
    },
    textLight: {
        control: { type: "color" },
        description: "Light text color",
        table: { category: "Theme Colors" },
    },
    bgCell: {
        control: { type: "color" },
        description: "Background color for cells",
        table: { category: "Theme Colors" },
    },
    bgCellMedium: {
        control: { type: "color" },
        description: "Medium background color for alternating cells",
        table: { category: "Theme Colors" },
    },
    bgHeader: {
        control: { type: "color" },
        description: "Background color for headers",
        table: { category: "Theme Colors" },
    },
    bgHeaderHasFocus: {
        control: { type: "color" },
        description: "Background color for focused headers",
        table: { category: "Theme Colors" },
    },
    borderColor: {
        control: { type: "color" },
        description: "Color of grid lines and borders",
        table: { category: "Theme Colors" },
    },
    
    // Advanced Features
    experimental: {
        control: { type: "boolean" },
        description: "Enable experimental features (strict mode)",
        table: { category: "Advanced Features" },
    },
    trapFocus: {
        control: { type: "boolean" },
        description: "Trap focus within the grid during navigation",
        table: { category: "Advanced Features" },
    },
    scrollToActiveCell: {
        control: { type: "boolean" },
        description: "Automatically scroll to keep active cell in view",
        table: { category: "Advanced Features" },
    },
    
    // Cell Activation
    cellActivationBehavior: {
        control: { type: "select" },
        options: ["double-click", "single-click", "second-click"],
        description: "How cells are activated for editing",
        table: { category: "Cell Activation" },
    },
    
    // Row Selection Mode
    rowSelectionMode: {
        control: { type: "select" },
        options: ["auto", "multi"],
        description: "Row selection modifier key behavior",
        table: { category: "Row Selection" },
    },
    
    // Span Behavior
    spanRangeBehavior: {
        control: { type: "select" },
        options: ["default", "allowPartial"],
        description: "How spanned cells behave in selections",
        table: { category: "Span Behavior" },
    },
    
    // Trailing Row
    enableTrailingRow: {
        control: { type: "boolean" },
        description: "Enable trailing row for adding new data",
        table: { category: "Trailing Row" },
    },
    trailingRowTint: {
        control: { type: "boolean" },
        description: "Apply tint to the trailing row",
        table: { category: "Trailing Row" },
    },
    trailingRowSticky: {
        control: { type: "boolean" },
        description: "Make trailing row always visible",
        table: { category: "Trailing Row" },
    },
    trailingRowHint: {
        control: { type: "text" },
        description: "Hint text to show on trailing row hover",
        table: { category: "Trailing Row" },
    },
    
    // Keybindings
    enableSelectAll: {
        control: { type: "boolean" },
        description: "Enable Ctrl+A to select all",
        table: { category: "Keybindings" },
    },
    enableSelectRow: {
        control: { type: "boolean" },
        description: "Enable Shift+Space to select row",
        table: { category: "Keybindings" },
    },
    enableSelectColumn: {
        control: { type: "boolean" },
        description: "Enable Ctrl+Space to select column",
        table: { category: "Keybindings" },
    },
    enableClear: {
        control: { type: "boolean" },
        description: "Enable Delete/Backspace to clear cells",
        table: { category: "Keybindings" },
    },
    enableCopy: {
        control: { type: "boolean" },
        description: "Enable Ctrl+C to copy",
        table: { category: "Keybindings" },
    },
    enablePaste: {
        control: { type: "boolean" },
        description: "Enable Ctrl+V to paste",
        table: { category: "Keybindings" },
    },
    enableSearch: {
        control: { type: "boolean" },
        description: "Enable Ctrl+F to search",
        table: { category: "Keybindings" },
    },
    
    // Drag and Drop
    onColumnMoved: {
        control: { type: "boolean" },
        description: "Enable column reordering via drag and drop",
        table: { category: "Drag and Drop" },
    },
    onRowMoved: {
        control: { type: "boolean" },
        description: "Enable row reordering via drag and drop",
        table: { category: "Drag and Drop" },
    },
    
    // Right Element
    showRightElement: {
        control: { type: "boolean" },
        description: "Show a custom element on the right side of the grid",
        table: { category: "Right Element" },
    },
    
    // Overscroll
    enableOverscrollX: {
        control: { type: "boolean" },
        description: "Enable horizontal overscrolling",
        table: { category: "Overscroll" },
    },
    enableOverscrollY: {
        control: { type: "boolean" },
        description: "Enable vertical overscrolling",
        table: { category: "Overscroll" },
    },
    
    // Additional Visual
    fixedShadowX: {
        control: { type: "boolean" },
        description: "Show shadow behind frozen columns",
        table: { category: "Additional Visual" },
    },
    fixedShadowY: {
        control: { type: "boolean" },
        description: "Show shadow behind frozen rows/headers",
        table: { category: "Additional Visual" },
    },
    
    // Minimap
    showMinimap: {
        control: { type: "boolean" },
        description: "Show interactive minimap for navigation",
        table: { category: "Minimap" },
    },
    
    // Freeze Rows
    freezeRows: {
        control: { type: "range", min: 0, max: 10, step: 1 },
        description: "Number of rows to freeze at the top",
        table: { category: "Freeze Rows" },
    },
};

export { Playground as DataEditorPlayground };
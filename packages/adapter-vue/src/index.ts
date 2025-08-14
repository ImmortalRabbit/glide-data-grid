// Main Vue component
export { default as DataGrid } from './DataGrid.vue'

// Vue composables
export { useDataGrid, useSimpleDataGrid } from './composables/useDataGrid.js'

// Re-export types from core for convenience
export type {
  GridEngineConfig,
  GridEngine,
  GridCell,
  GridColumn,
  GridSelection,
  TextCell,
  NumberCell,
  BooleanCell,
  ImageCell,
  UriCell,
  MarkdownCell
} from '@glideapps/glide-data-grid-adapter-core'

// Vue-specific types
export interface VueDataGridProps {
  data: any[][]
  columns: any[]
  width: number
  height: number
  selection?: any
  freezeColumns?: number
  rowHeight?: number
  headerHeight?: number
  smoothScrollX?: boolean
  smoothScrollY?: boolean
  theme?: any
}

export interface VueDataGridEmits {
  'selection-change': (selection: any) => void
  'cell-edit': (payload: { col: number; row: number; newValue: any }) => void
  'cell-click': (payload: { col: number; row: number; cell: any }) => void
}
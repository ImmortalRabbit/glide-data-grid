import type { 
  GridColumn, 
  GridSelection, 
  GridCell 
} from '@glideapps/glide-data-grid'

/**
 * Simplified configuration for grid engine
 * Maps to DataEditor props but in a framework-agnostic way
 */
export interface GridEngineConfig {
  // Data configuration
  data: GridCell[][]
  columns: GridColumn[]
  rows?: number // optional, defaults to data.length
  
  // Dimensions
  width: number
  height: number
  
  // Selection state
  selection?: GridSelection
  
  // Event handlers (framework-agnostic callbacks)
  onSelectionChange?: (selection: GridSelection) => void
  onCellEdit?: (col: number, row: number, newValue: GridCell) => void
  onCellClick?: (col: number, row: number, cell: GridCell) => void
  
  // Optional configuration
  smoothScrollX?: boolean
  smoothScrollY?: boolean
  freezeColumns?: number
  rowHeight?: number
  headerHeight?: number
  theme?: any // Will be typed more specifically later
}

/**
 * Core grid engine interface that all implementations must follow
 * This provides a consistent API across all frameworks
 */
export interface GridEngine {
  // Lifecycle
  mount(container: HTMLElement): void
  unmount(): void
  destroy(): void
  
  // Configuration
  updateConfig(config: Partial<GridEngineConfig>): void
  getConfig(): GridEngineConfig
  
  // Data operations
  getData(): GridCell[][]
  setData(data: GridCell[][]): void
  getCellValue(col: number, row: number): GridCell | undefined
  setCellValue(col: number, row: number, value: GridCell): void
  
  // Selection
  getSelection(): GridSelection | undefined
  setSelection(selection: GridSelection | undefined): void
  
  // Viewport
  scrollTo(x: number, y: number, animated?: boolean): void
  scrollToCell(col: number, row: number, animated?: boolean): void
  getViewport(): { x: number; y: number; width: number; height: number }
  
  // Utility
  getVisibleCellRange(): { startCol: number; endCol: number; startRow: number; endRow: number }
  invalidate(): void // Force re-render
}

/**
 * Framework adapter interface - each framework implements this
 * to provide framework-specific capabilities to the grid engine
 */
export interface FrameworkAdapter {
  // Lifecycle hooks
  onMount(callback: () => void): void
  onUnmount(callback: () => void): void
  onUpdate(callback: () => void): void
  
  // State management
  createState<T>(initialValue: T): StateManager<T>
  
  // Event handling
  addEventListener(element: HTMLElement, event: string, handler: EventListener): void
  removeEventListener(element: HTMLElement, event: string, handler: EventListener): void
  
  // Animation/RAF
  requestAnimationFrame(callback: () => void): number
  cancelAnimationFrame(id: number): void
  
  // DOM utilities
  createElement(tag: string): HTMLElement
  measureText(text: string, font: string): { width: number; height: number }
}

/**
 * State management interface for framework adapters
 */
export interface StateManager<T> {
  get(): T
  set(value: T): void
  subscribe(callback: (value: T) => void): () => void
}

/**
 * Event types that the grid engine can emit
 */
export interface GridEngineEvents {
  'selection-change': (selection: GridSelection | undefined) => void
  'cell-edit': (col: number, row: number, newValue: GridCell, oldValue: GridCell) => void
  'cell-click': (col: number, row: number, cell: GridCell) => void
  'viewport-change': (viewport: { x: number; y: number; width: number; height: number }) => void
  'data-change': (data: GridCell[][]) => void
}

/**
 * Grid engine factory interface
 */
export interface GridEngineFactory {
  createEngine(config: GridEngineConfig, adapter: FrameworkAdapter): GridEngine
}
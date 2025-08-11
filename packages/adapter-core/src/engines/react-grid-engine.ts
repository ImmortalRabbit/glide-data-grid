import React from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { 
  DataEditor, 
  type GridColumn, 
  type GridSelection, 
  type GridCell,
  type Item
} from '@glideapps/glide-data-grid'
import type { 
  GridEngine, 
  GridEngineConfig, 
  FrameworkAdapter 
} from '../interfaces/grid-engine.js'

/**
 * React-based grid engine implementation
 * 
 * This wraps the existing DataEditor component without modifying it,
 * providing a framework-agnostic interface while leveraging all
 * existing functionality.
 * 
 * KEY: This is a WRAPPER, not a rewrite. Zero risk to existing code.
 */
export class ReactGridEngine implements GridEngine {
  private root: Root | null = null
  private container: HTMLElement | null = null
  private config: GridEngineConfig
  private adapter: FrameworkAdapter
  
  // State tracking
  private currentSelection: GridSelection | undefined
  private currentData: GridCell[][]
  
  // Event listeners for cleanup
  private eventListeners: Array<() => void> = []
  
  constructor(config: GridEngineConfig, adapter: FrameworkAdapter) {
    this.config = { ...config }
    this.adapter = adapter
    this.currentSelection = config.selection
    this.currentData = [...config.data]
  }
  
  mount(container: HTMLElement): void {
    if (this.container) {
      console.warn('GridEngine already mounted')
      return
    }
    
    this.container = container
    this.root = createRoot(container)
    this.render()
  }
  
  unmount(): void {
    if (this.root) {
      this.root.unmount()
      this.root = null
    }
    
    // Cleanup event listeners
    this.eventListeners.forEach(cleanup => cleanup())
    this.eventListeners = []
    
    this.container = null
  }
  
  destroy(): void {
    this.unmount()
  }
  
  private render(): void {
    if (!this.root) return
    
    // Create the React element using the existing DataEditor
    // This is the key: we use the existing component as-is
    const element = React.createElement(DataEditor, {
      // Map our simplified config to DataEditor props
      getCellContent: this.getCellContent,
      columns: this.config.columns,
      rows: this.config.rows ?? this.currentData.length,
      width: this.config.width,
      height: this.config.height,
      
      // Selection handling
      gridSelection: this.currentSelection,
      onGridSelectionChange: this.handleSelectionChange,
      
      // Cell editing
      onCellEdited: this.handleCellEdit,
      
      // Cell clicking
      onCellClicked: this.handleCellClick,
      
      // Optional config
      smoothScrollX: this.config.smoothScrollX ?? true,
      smoothScrollY: this.config.smoothScrollY ?? true,
      freezeColumns: this.config.freezeColumns ?? 0,
      rowHeight: this.config.rowHeight ?? 34,
      headerHeight: this.config.headerHeight ?? 36,
      theme: this.config.theme,
      
      // Enable all features by default for MVP
      getCellsForSelection: true,
      keybindings: {},
      rightElement: undefined,
      rightElementProps: {},
    })
    
    this.root.render(element)
  }
  
  private getCellContent = ([col, row]: Item): GridCell => {
    // Return cell data from our internal state
    return this.currentData[row]?.[col] ?? {
      kind: 'text' as const,
      data: '',
      allowOverlay: false
    }
  }
  
  private handleSelectionChange = (selection: GridSelection) => {
    this.currentSelection = selection
    this.config.onSelectionChange?.(selection)
  }
  
  private handleCellEdit = (cell: Item, newValue: GridCell) => {
    const [col, row] = cell
    const oldValue = this.currentData[row]?.[col]
    
    // Update internal state
    if (!this.currentData[row]) {
      this.currentData[row] = []
    }
    this.currentData[row][col] = newValue
    
    // Notify callback
    this.config.onCellEdit?.(col, row, newValue)
  }
  
  private handleCellClick = (cell: Item) => {
    const [col, row] = cell
    const cellValue = this.currentData[row]?.[col]
    if (cellValue) {
      this.config.onCellClick?.(col, row, cellValue)
    }
  }
  
  // GridEngine interface implementation
  
  updateConfig(newConfig: Partial<GridEngineConfig>): void {
    // Merge new config
    this.config = { ...this.config, ...newConfig }
    
    // Update internal state if data changed
    if (newConfig.data) {
      this.currentData = [...newConfig.data]
    }
    
    // Update selection if changed
    if (newConfig.selection !== undefined) {
      this.currentSelection = newConfig.selection
    }
    
    // Re-render with new config
    this.render()
  }
  
  getConfig(): GridEngineConfig {
    return { ...this.config }
  }
  
  getData(): GridCell[][] {
    return [...this.currentData]
  }
  
  setData(data: GridCell[][]): void {
    this.currentData = [...data]
    this.config.data = data
    this.render()
  }
  
  getCellValue(col: number, row: number): GridCell | undefined {
    return this.currentData[row]?.[col]
  }
  
  setCellValue(col: number, row: number, value: GridCell): void {
    if (!this.currentData[row]) {
      this.currentData[row] = []
    }
    this.currentData[row][col] = value
    this.render()
  }
  
  getSelection(): GridSelection | undefined {
    return this.currentSelection
  }
  
  setSelection(selection: GridSelection | undefined): void {
    this.currentSelection = selection
    this.config.selection = selection
    this.render()
  }
  
  scrollTo(x: number, y: number, animated?: boolean): void {
    // For MVP, we'll implement basic scrolling
    // The DataEditor component handles most of this internally
    console.log('ScrollTo not fully implemented in MVP:', { x, y, animated })
  }
  
  scrollToCell(col: number, row: number, animated?: boolean): void {
    // For MVP, we'll implement basic scrolling
    console.log('ScrollToCell not fully implemented in MVP:', { col, row, animated })
  }
  
  getViewport(): { x: number; y: number; width: number; height: number } {
    // For MVP, return basic viewport info
    return {
      x: 0,
      y: 0,
      width: this.config.width,
      height: this.config.height
    }
  }
  
  getVisibleCellRange(): { startCol: number; endCol: number; startRow: number; endRow: number } {
    // For MVP, return basic range
    // The DataEditor component handles virtualization internally
    return {
      startCol: 0,
      endCol: this.config.columns.length - 1,
      startRow: 0,
      endRow: Math.min(this.currentData.length - 1, 100) // Rough estimate
    }
  }
  
  invalidate(): void {
    // Force re-render
    this.render()
  }
}
import { ref, onMounted, onUnmounted, type Ref } from 'vue'
import {
  GridFactory,
  type GridEngine,
  type GridEngineConfig,
  type GridSelection,
  type GridCell
} from '@glideapps/glide-data-grid-adapter-core'

/**
 * Vue composable for using the data grid
 * 
 * This provides a more Vue-like way to work with the grid engine
 * for users who prefer composables over components
 */
export function useDataGrid(
  containerRef: Ref<HTMLElement | undefined>,
  config: GridEngineConfig
) {
  const engine = ref<GridEngine | null>(null)
  const isReady = ref(false)
  
  // Grid state
  const selection = ref<GridSelection | undefined>(config.selection)
  const data = ref<GridCell[][]>(config.data)
  
  // Initialize the grid engine
  onMounted(() => {
    if (containerRef.value) {
      engine.value = GridFactory.createVueEngine({
        ...config,
        onSelectionChange: (newSelection) => {
          selection.value = newSelection
          config.onSelectionChange?.(newSelection)
        },
        onCellEdit: (col, row, newValue) => {
          // Update local data
          if (!data.value[row]) {
            data.value[row] = []
          }
          data.value[row][col] = newValue
          config.onCellEdit?.(col, row, newValue)
        }
      })
      
      engine.value.mount(containerRef.value)
      isReady.value = true
    }
  })
  
  // Cleanup
  onUnmounted(() => {
    if (engine.value) {
      engine.value.unmount()
      engine.value = null
    }
    isReady.value = false
  })
  
  // Grid operations
  const updateConfig = (newConfig: Partial<GridEngineConfig>) => {
    engine.value?.updateConfig(newConfig)
  }
  
  const setData = (newData: GridCell[][]) => {
    data.value = newData
    engine.value?.setData(newData)
  }
  
  const setSelection = (newSelection: GridSelection | undefined) => {
    selection.value = newSelection
    engine.value?.setSelection(newSelection)
  }
  
  const getCellValue = (col: number, row: number) => {
    return engine.value?.getCellValue(col, row)
  }
  
  const setCellValue = (col: number, row: number, value: GridCell) => {
    // Update local data
    if (!data.value[row]) {
      data.value[row] = []
    }
    data.value[row][col] = value
    
    // Update engine
    engine.value?.setCellValue(col, row, value)
  }
  
  const scrollTo = (x: number, y: number, animated = true) => {
    engine.value?.scrollTo(x, y, animated)
  }
  
  const scrollToCell = (col: number, row: number, animated = true) => {
    engine.value?.scrollToCell(col, row, animated)
  }
  
  const invalidate = () => {
    engine.value?.invalidate()
  }
  
  const getViewport = () => {
    return engine.value?.getViewport()
  }
  
  const getVisibleCellRange = () => {
    return engine.value?.getVisibleCellRange()
  }
  
  return {
    // State
    engine: engine as Ref<GridEngine | null>,
    isReady,
    selection,
    data,
    
    // Operations
    updateConfig,
    setData,
    setSelection,
    getCellValue,
    setCellValue,
    scrollTo,
    scrollToCell,
    invalidate,
    getViewport,
    getVisibleCellRange
  }
}

/**
 * Simple composable for basic grid usage
 */
export function useSimpleDataGrid(
  containerRef: Ref<HTMLElement | undefined>,
  initialData: GridCell[][],
  columns: any[],
  width: number,
  height: number
) {
  return useDataGrid(containerRef, {
    data: initialData,
    columns,
    width,
    height
  })
}
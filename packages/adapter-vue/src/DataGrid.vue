<template>
  <div 
    ref="gridContainer" 
    class="glide-data-grid-vue"
    :style="containerStyle"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed, type PropType } from 'vue'
import { 
  GridFactory,
  type GridEngineConfig, 
  type GridEngine,
  type GridColumn,
  type GridCell,
  type GridSelection
} from '@glideapps/glide-data-grid-adapter-core'

// Props interface that feels natural to Vue developers
interface Props {
  data: GridCell[][]
  columns: GridColumn[]
  width: number
  height: number
  selection?: GridSelection
  freezeColumns?: number
  rowHeight?: number
  headerHeight?: number
  smoothScrollX?: boolean
  smoothScrollY?: boolean
  theme?: any
}

// Define props with proper Vue 3 typing
const props = defineProps<Props>()

// Define emits for Vue 3
const emit = defineEmits<{
  'selection-change': [selection: GridSelection | undefined]
  'cell-edit': [payload: { col: number; row: number; newValue: GridCell }]
  'cell-click': [payload: { col: number; row: number; cell: GridCell }]
}>()

// Template refs
const gridContainer = ref<HTMLElement>()

// Grid engine instance
let engine: GridEngine | null = null

// Computed style for container
const containerStyle = computed(() => ({
  width: `${props.width}px`,
  height: `${props.height}px`,
  position: 'relative' as const,
  overflow: 'hidden' as const
}))

// Create grid engine configuration from props
const createConfig = (): GridEngineConfig => ({
  data: props.data,
  columns: props.columns,
  width: props.width,
  height: props.height,
  selection: props.selection,
  freezeColumns: props.freezeColumns,
  rowHeight: props.rowHeight,
  headerHeight: props.headerHeight,
  smoothScrollX: props.smoothScrollX,
  smoothScrollY: props.smoothScrollY,
  theme: props.theme,
  
  // Event handlers that emit Vue events
  onSelectionChange: (selection) => {
    emit('selection-change', selection)
  },
  
  onCellEdit: (col, row, newValue) => {
    emit('cell-edit', { col, row, newValue })
  },
  
  onCellClick: (col, row, cell) => {
    emit('cell-click', { col, row, cell })
  }
})

// Initialize grid engine
onMounted(() => {
  if (gridContainer.value) {
    // Create engine using the factory
    // This internally uses React but provides Vue-friendly API
    engine = GridFactory.createVueEngine(createConfig())
    
    // Mount the engine to our container
    engine.mount(gridContainer.value)
  }
})

// Cleanup
onUnmounted(() => {
  if (engine) {
    engine.unmount()
    engine = null
  }
})

// Watch for data changes and update engine
watch(() => props.data, (newData) => {
  if (engine) {
    engine.updateConfig({ data: newData })
  }
}, { deep: true })

// Watch for column changes
watch(() => props.columns, (newColumns) => {
  if (engine) {
    engine.updateConfig({ columns: newColumns })
  }
}, { deep: true })

// Watch for selection changes
watch(() => props.selection, (newSelection) => {
  if (engine) {
    engine.updateConfig({ selection: newSelection })
  }
})

// Watch for dimension changes
watch([() => props.width, () => props.height], ([newWidth, newHeight]) => {
  if (engine) {
    engine.updateConfig({ width: newWidth, height: newHeight })
  }
})

// Watch for other config changes
watch([
  () => props.freezeColumns,
  () => props.rowHeight,
  () => props.headerHeight,
  () => props.smoothScrollX,
  () => props.smoothScrollY,
  () => props.theme
], () => {
  if (engine) {
    engine.updateConfig({
      freezeColumns: props.freezeColumns,
      rowHeight: props.rowHeight,
      headerHeight: props.headerHeight,
      smoothScrollX: props.smoothScrollX,
      smoothScrollY: props.smoothScrollY,
      theme: props.theme
    })
  }
})

// Expose engine methods to parent component via template ref
defineExpose({
  scrollTo: (x: number, y: number, animated?: boolean) => {
    engine?.scrollTo(x, y, animated)
  },
  
  scrollToCell: (col: number, row: number, animated?: boolean) => {
    engine?.scrollToCell(col, row, animated)
  },
  
  getSelection: () => engine?.getSelection(),
  
  setSelection: (selection: GridSelection | undefined) => {
    engine?.setSelection(selection)
  },
  
  getCellValue: (col: number, row: number) => {
    return engine?.getCellValue(col, row)
  },
  
  setCellValue: (col: number, row: number, value: GridCell) => {
    engine?.setCellValue(col, row, value)
  },
  
  invalidate: () => {
    engine?.invalidate()
  }
})
</script>

<style scoped>
.glide-data-grid-vue {
  /* Basic container styles */
  box-sizing: border-box;
}

/* Import the main grid CSS */
@import '@glideapps/glide-data-grid/dist/index.css';
</style>
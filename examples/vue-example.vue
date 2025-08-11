<template>
  <div class="vue-example">
    <h2>Vue.js DataGrid Example</h2>
    <p>This demonstrates glide-data-grid running in Vue.js via the adapter</p>
    
    <!-- Controls -->
    <div class="controls">
      <button @click="addRow">Add Row</button>
      <button @click="clearSelection">Clear Selection</button>
      <button @click="selectFirstCell">Select First Cell</button>
    </div>
    
    <!-- Grid using component approach -->
    <div class="grid-section">
      <h3>Component Approach</h3>
      <DataGrid
        :data="gridData"
        :columns="columns"
        :width="800"
        :height="400"
        :selection="selection"
        :freeze-columns="1"
        @selection-change="handleSelectionChange"
        @cell-edit="handleCellEdit"
        @cell-click="handleCellClick"
      />
    </div>
    
    <!-- Grid using composable approach -->
    <div class="grid-section">
      <h3>Composable Approach</h3>
      <div 
        ref="composableGridRef" 
        class="grid-container"
      />
    </div>
    
    <!-- Status -->
    <div class="status">
      <h3>Status</h3>
      <p><strong>Selection:</strong> {{ selectionDisplay }}</p>
      <p><strong>Rows:</strong> {{ gridData.length }}</p>
      <p><strong>Last Action:</strong> {{ lastAction }}</p>
      <p><strong>Composable Ready:</strong> {{ isComposableReady ? 'Yes' : 'No' }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { DataGrid, useDataGrid, type GridCell, type GridColumn, type GridSelection } from '@glideapps/glide-data-grid-adapter-vue'

// Sample data
const initialData: GridCell[][] = [
  [
    { kind: 'text', data: 'Alice', allowOverlay: true },
    { kind: 'number', data: 25 },
    { kind: 'text', data: 'Engineer', allowOverlay: true },
    { kind: 'boolean', data: true }
  ],
  [
    { kind: 'text', data: 'Bob', allowOverlay: true },
    { kind: 'number', data: 30 },
    { kind: 'text', data: 'Designer', allowOverlay: true },
    { kind: 'boolean', data: false }
  ],
  [
    { kind: 'text', data: 'Charlie', allowOverlay: true },
    { kind: 'number', data: 28 },
    { kind: 'text', data: 'Manager', allowOverlay: true },
    { kind: 'boolean', data: true }
  ]
]

const columns: GridColumn[] = [
  { title: 'Name', width: 150 },
  { title: 'Age', width: 100 },
  { title: 'Role', width: 150 },
  { title: 'Active', width: 100 }
]

// Reactive state
const gridData = ref<GridCell[][]>([...initialData])
const selection = ref<GridSelection>()
const lastAction = ref('None')

// Composable approach
const composableGridRef = ref<HTMLElement>()
const {
  isReady: isComposableReady,
  setData: setComposableData,
  setSelection: setComposableSelection
} = useDataGrid(composableGridRef, {
  data: gridData.value,
  columns,
  width: 800,
  height: 300,
  onSelectionChange: (sel) => {
    console.log('Composable selection change:', sel)
  },
  onCellEdit: (col, row, newValue) => {
    console.log('Composable cell edit:', { col, row, newValue })
    lastAction.value = `Composable: Edited cell [${col}, ${row}]`
  }
})

// Computed
const selectionDisplay = computed(() => {
  if (!selection.value?.current) return 'None'
  const { cell } = selection.value.current
  return `[${cell[0]}, ${cell[1]}]`
})

// Event handlers
const handleSelectionChange = (newSelection: GridSelection | undefined) => {
  selection.value = newSelection
  lastAction.value = `Selection changed to: ${selectionDisplay.value}`
}

const handleCellEdit = (payload: { col: number; row: number; newValue: GridCell }) => {
  const { col, row, newValue } = payload
  
  // Update data
  if (!gridData.value[row]) {
    gridData.value[row] = []
  }
  gridData.value[row][col] = newValue
  
  lastAction.value = `Component: Edited cell [${col}, ${row}] to "${newValue.data}"`
}

const handleCellClick = (payload: { col: number; row: number; cell: GridCell }) => {
  const { col, row } = payload
  lastAction.value = `Clicked cell [${col}, ${row}]`
}

// Actions
const addRow = () => {
  const newRow: GridCell[] = [
    { kind: 'text', data: `User ${gridData.value.length + 1}`, allowOverlay: true },
    { kind: 'number', data: Math.floor(Math.random() * 50) + 20 },
    { kind: 'text', data: 'New Role', allowOverlay: true },
    { kind: 'boolean', data: Math.random() > 0.5 }
  ]
  
  gridData.value.push(newRow)
  lastAction.value = `Added row ${gridData.value.length}`
}

const clearSelection = () => {
  selection.value = undefined
  setComposableSelection(undefined)
  lastAction.value = 'Cleared selection'
}

const selectFirstCell = () => {
  const newSelection = {
    current: {
      cell: [0, 0] as [number, number],
      range: { x: 0, y: 0, width: 1, height: 1 },
      rangeStack: []
    },
    columns: { hasIndex: () => false, hasAll: () => false, toArray: () => [], length: 0 },
    rows: { hasIndex: () => false, hasAll: () => false, toArray: () => [], length: 0 }
  }
  
  selection.value = newSelection
  setComposableSelection(newSelection)
  lastAction.value = 'Selected first cell'
}

// Watch for data changes to sync with composable
watch(gridData, (newData) => {
  setComposableData([...newData])
}, { deep: true })
</script>

<style scoped>
.vue-example {
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.controls {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
}

.controls button {
  padding: 8px 16px;
  background: #007acc;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.controls button:hover {
  background: #005a9f;
}

.grid-section {
  margin-bottom: 30px;
}

.grid-section h3 {
  margin-bottom: 10px;
  color: #333;
}

.grid-container {
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 800px;
  height: 300px;
}

.status {
  background: #f5f5f5;
  padding: 15px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.status h3 {
  margin-top: 0;
  margin-bottom: 10px;
  color: #333;
}

.status p {
  margin: 5px 0;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 12px;
}
</style>
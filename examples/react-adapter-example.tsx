import React, { useEffect, useRef, useState } from 'react'
import { createReactGridEngine, type GridCell, type GridColumn } from '@glideapps/glide-data-grid-adapter-core'

// Sample data for demonstration
const sampleData: GridCell[][] = [
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

/**
 * Example using the NEW adapter API
 * 
 * This demonstrates how the new framework-agnostic API works
 * while internally using the existing DataEditor component
 */
export function ReactAdapterExample() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [selection, setSelection] = useState<any>()
  const [data, setData] = useState(sampleData)
  
  useEffect(() => {
    if (containerRef.current) {
      // Create grid engine using the new adapter API
      const engine = createReactGridEngine({
        data: data,
        columns: columns,
        width: 600,
        height: 400,
        selection: selection,
        
        // Event handlers
        onSelectionChange: (newSelection) => {
          console.log('Selection changed:', newSelection)
          setSelection(newSelection)
        },
        
        onCellEdit: (col, row, newValue) => {
          console.log('Cell edited:', { col, row, newValue })
          
          // Update data
          const newData = [...data]
          if (!newData[row]) newData[row] = []
          newData[row][col] = newValue
          setData(newData)
        },
        
        onCellClick: (col, row, cell) => {
          console.log('Cell clicked:', { col, row, cell })
        }
      })
      
      // Mount the engine
      engine.mount(containerRef.current)
      
      // Cleanup function
      return () => {
        engine.unmount()
      }
    }
  }, [data, selection])
  
  const addRow = () => {
    const newRow: GridCell[] = [
      { kind: 'text', data: `User ${data.length + 1}`, allowOverlay: true },
      { kind: 'number', data: Math.floor(Math.random() * 50) + 20 },
      { kind: 'text', data: 'New Role', allowOverlay: true },
      { kind: 'boolean', data: Math.random() > 0.5 }
    ]
    setData([...data, newRow])
  }
  
  return (
    <div style={{ padding: '20px' }}>
      <h2>React Adapter Example</h2>
      <p>This uses the new framework-agnostic adapter API</p>
      
      <div style={{ marginBottom: '10px' }}>
        <button onClick={addRow}>Add Row</button>
      </div>
      
      {/* Grid container */}
      <div 
        ref={containerRef} 
        style={{ 
          border: '1px solid #ccc',
          borderRadius: '4px'
        }} 
      />
      
      <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
        <p>Selection: {selection ? JSON.stringify(selection.current?.cell) : 'None'}</p>
        <p>Rows: {data.length}</p>
      </div>
    </div>
  )
}

/**
 * Comparison: Traditional DataEditor usage (UNCHANGED)
 */
import { DataEditor } from '@glideapps/glide-data-grid'

export function TraditionalDataEditorExample() {
  const [selection, setSelection] = useState<any>()
  const [data, setData] = useState(sampleData)
  
  const getCellContent = ([col, row]: [number, number]) => {
    return data[row]?.[col] ?? { kind: 'text' as const, data: '', allowOverlay: false }
  }
  
  const onCellEdited = ([col, row]: [number, number], newValue: GridCell) => {
    const newData = [...data]
    if (!newData[row]) newData[row] = []
    newData[row][col] = newValue
    setData(newData)
  }
  
  const addRow = () => {
    const newRow: GridCell[] = [
      { kind: 'text', data: `User ${data.length + 1}`, allowOverlay: true },
      { kind: 'number', data: Math.floor(Math.random() * 50) + 20 },
      { kind: 'text', data: 'New Role', allowOverlay: true },
      { kind: 'boolean', data: Math.random() > 0.5 }
    ]
    setData([...data, newRow])
  }
  
  return (
    <div style={{ padding: '20px' }}>
      <h2>Traditional DataEditor Example</h2>
      <p>This uses the existing React API (completely unchanged)</p>
      
      <div style={{ marginBottom: '10px' }}>
        <button onClick={addRow}>Add Row</button>
      </div>
      
      {/* Traditional DataEditor usage */}
      <DataEditor
        getCellContent={getCellContent}
        columns={columns}
        rows={data.length}
        width={600}
        height={400}
        gridSelection={selection}
        onGridSelectionChange={setSelection}
        onCellEdited={onCellEdited}
      />
      
      <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
        <p>Selection: {selection ? JSON.stringify(selection.current?.cell) : 'None'}</p>
        <p>Rows: {data.length}</p>
      </div>
    </div>
  )
}

/**
 * Side-by-side comparison component
 */
export function ComparisonExample() {
  return (
    <div style={{ display: 'flex', gap: '40px' }}>
      <div style={{ flex: 1 }}>
        <TraditionalDataEditorExample />
      </div>
      <div style={{ flex: 1 }}>
        <ReactAdapterExample />
      </div>
    </div>
  )
}
# Glide Data Grid Framework Split Design Document

## Executive Summary

This document outlines a comprehensive approach to split the glide-data-grid library into two distinct packages:
1. **Framework-Agnostic Core** (`@glideapps/glide-data-grid-core`): Pure JavaScript/TypeScript logic for data handling, virtualization, rendering, and grid operations
2. **React Framework Adapter** (`@glideapps/glide-data-grid-react`): React-specific components, hooks, and lifecycle management

This split will enable easy porting to other frameworks (Vue, Angular, Svelte, etc.) while maintaining a single source of truth for core grid functionality.

## Current Architecture Analysis

### React-Dependent Components Identified
- `DataEditor` main component (`data-editor/data-editor.tsx`)
- `DataEditorAll` wrapper (`data-editor-all.tsx`) 
- Cell renderers with React components (`cells/*.tsx`)
- Overlay editors (`internal/data-grid-overlay-editor/`)
- React hooks (`use-*.ts` files)
- Event handlers using React synthetic events
- Component lifecycle management

### Framework-Agnostic Components Identified
- Core data types (`data-grid-types.ts`)
- Canvas rendering engine (`internal/data-grid/render/`)
- Animation manager (`animation-manager.ts`)
- Data structures (`cell-set.ts`, `CompactSelection`)
- Math utilities (`common/math.ts`)
- Virtualization logic (`data-grid-lib.ts`)
- Cell data models and validation
- Color parsing and theming engine
- Image loading and caching
- Copy/paste logic (data processing part)

## Proposed Architecture

### 1. Framework-Agnostic Core Package (`@glideapps/glide-data-grid-core`)

```
glide-data-grid-core/
├── src/
│   ├── engine/              # Core grid engine
│   │   ├── grid-engine.ts   # Main grid controller
│   │   ├── viewport.ts      # Viewport management  
│   │   ├── selection.ts     # Selection handling
│   │   └── virtualization.ts # Row/column virtualization
│   ├── rendering/           # Canvas rendering system
│   │   ├── renderer.ts      # Main renderer
│   │   ├── cell-renderer.ts # Cell rendering engine
│   │   ├── header-renderer.ts # Header rendering
│   │   └── overlay-renderer.ts # Overlays and effects
│   ├── data/               # Data management
│   │   ├── cell-types.ts   # Cell type definitions
│   │   ├── grid-data.ts    # Grid data models
│   │   ├── selection-model.ts # Selection data structures
│   │   └── validation.ts   # Data validation
│   ├── events/             # Event system
│   │   ├── event-manager.ts # Event coordination
│   │   ├── event-types.ts  # Event definitions
│   │   └── handlers/       # Default event handlers
│   ├── utils/              # Utilities
│   │   ├── math.ts         # Mathematical utilities
│   │   ├── colors.ts       # Color handling
│   │   ├── animation.ts    # Animation system
│   │   └── performance.ts  # Performance utilities
│   └── adapters/           # Framework adapter interfaces
│       ├── framework-adapter.ts # Base adapter interface
│       ├── rendering-adapter.ts # Rendering adapter interface
│       └── event-adapter.ts     # Event adapter interface
```

#### Core Engine API

```typescript
// Main grid engine
export class GridEngine {
  constructor(config: GridEngineConfig, adapter: FrameworkAdapter)
  
  // Data operations
  setData(data: GridData): void
  getData(): GridData
  getCellValue(col: number, row: number): GridCell
  setCellValue(col: number, row: number, value: GridCell): void
  
  // Selection
  getSelection(): GridSelection
  setSelection(selection: GridSelection): void
  
  // Viewport
  scrollTo(x: number, y: number): void
  getViewport(): ViewportInfo
  
  // Rendering
  render(force?: boolean): void
  resize(width: number, height: number): void
  
  // Events
  on<T extends keyof GridEvents>(event: T, handler: GridEvents[T]): void
  off<T extends keyof GridEvents>(event: T, handler: GridEvents[T]): void
  
  // Lifecycle
  mount(container: HTMLElement): void
  unmount(): void
  destroy(): void
}
```

#### Framework Adapter Interface

```typescript
export interface FrameworkAdapter {
  // Lifecycle hooks
  onMount?(callback: () => void): void
  onUnmount?(callback: () => void): void
  onUpdate?(callback: () => void): void
  
  // State management
  createState<T>(initialValue: T): StateManager<T>
  
  // Event handling
  addEventListener(element: HTMLElement, event: string, handler: Function): void
  removeEventListener(element: HTMLElement, event: string, handler: Function): void
  
  // Animation
  requestAnimationFrame(callback: () => void): number
  cancelAnimationFrame(id: number): void
  
  // DOM utilities
  createElement(tag: string): HTMLElement
  measureText(text: string, font: string): TextMetrics
}

export interface StateManager<T> {
  get(): T
  set(value: T): void
  subscribe(callback: (value: T) => void): () => void
}
```

### 2. React Framework Adapter (`@glideapps/glide-data-grid-react`)

```
glide-data-grid-react/
├── src/
│   ├── components/          # React components
│   │   ├── DataEditor.tsx   # Main React component
│   │   ├── DataGrid.tsx     # Core grid component
│   │   └── overlays/        # Overlay components
│   ├── hooks/              # React hooks
│   │   ├── useDataEditor.ts # Main hook
│   │   ├── useGridSelection.ts # Selection hook
│   │   ├── useGridData.ts   # Data management hook
│   │   └── useGridEvents.ts # Event handling hook
│   ├── adapters/           # React-specific adapters
│   │   ├── react-adapter.ts # React framework adapter
│   │   └── react-state.ts   # React state management
│   ├── renderers/          # React cell renderers
│   │   ├── cell-renderers.tsx # React cell components
│   │   └── overlay-renderers.tsx # React overlay components
│   └── utils/              # React utilities
│       ├── react-utils.ts   # React-specific utilities
│       └── event-bridge.ts  # Event bridging
```

#### React Adapter Implementation

```typescript
// React-specific adapter
export class ReactAdapter implements FrameworkAdapter {
  private effects: Array<() => void> = []
  private states: Map<string, any> = new Map()
  
  onMount(callback: () => void): void {
    React.useEffect(() => {
      callback()
      return () => this.cleanup()
    }, [])
  }
  
  onUpdate(callback: () => void): void {
    React.useEffect(callback)
  }
  
  createState<T>(initialValue: T): StateManager<T> {
    const [value, setValue] = React.useState(initialValue)
    return {
      get: () => value,
      set: setValue,
      subscribe: (callback) => {
        React.useEffect(() => callback(value), [value])
        return () => {}
      }
    }
  }
  
  // ... other adapter methods
}
```

#### Main React Component

```typescript
export interface DataEditorProps {
  // Core props that map to GridEngineConfig
  data: GridData
  columns: GridColumn[]
  selection?: GridSelection
  onSelectionChange?: (selection: GridSelection) => void
  onCellEdit?: (col: number, row: number, value: GridCell) => void
  
  // React-specific props
  width: number
  height: number
  theme?: Theme
  className?: string
  style?: React.CSSProperties
  
  // Event handlers (React synthetic events)
  onCellClick?: (event: CellClickEvent) => void
  onCellDoubleClick?: (event: CellDoubleClickEvent) => void
  onKeyDown?: (event: React.KeyboardEvent) => void
}

export const DataEditor = React.forwardRef<DataEditorRef, DataEditorProps>((props, ref) => {
  const adapter = React.useMemo(() => new ReactAdapter(), [])
  const engine = React.useMemo(() => new GridEngine(
    mapPropsToConfig(props), 
    adapter
  ), [])
  
  // Sync props to engine
  React.useEffect(() => {
    engine.setData(props.data)
  }, [props.data])
  
  React.useEffect(() => {
    engine.setSelection(props.selection)
  }, [props.selection])
  
  // Event handling
  React.useEffect(() => {
    const unsubscribe = engine.on('selectionChange', props.onSelectionChange)
    return unsubscribe
  }, [props.onSelectionChange])
  
  // Render
  const containerRef = React.useRef<HTMLDivElement>(null)
  
  React.useEffect(() => {
    if (containerRef.current) {
      engine.mount(containerRef.current)
    }
    return () => engine.unmount()
  }, [])
  
  return <div ref={containerRef} className={props.className} style={props.style} />
})
```

## Migration Strategy

### Phase 1: Extract Core Types and Utilities (Week 1-2)

1. **Create core package structure**
   - Set up `@glideapps/glide-data-grid-core` package
   - Move type definitions from `data-grid-types.ts`
   - Extract math utilities, color parsing, animation manager

2. **Extract data structures**
   - Move `CellSet`, `CompactSelection` classes
   - Extract grid data models and validation logic
   - Move cell type definitions and interfaces

### Phase 2: Extract Rendering Engine (Week 3-4)

1. **Canvas rendering system**
   - Move all `render/` directory contents
   - Extract sprite management and image loading
   - Create rendering adapter interface

2. **Cell rendering system**
   - Extract cell rendering logic from React components
   - Create framework-agnostic cell renderer interface
   - Move drawing functions to core

### Phase 3: Extract Core Grid Logic (Week 5-6)

1. **Grid engine**
   - Extract virtualization logic
   - Move selection handling
   - Create viewport management system

2. **Event system**
   - Extract event types and handling logic
   - Create framework-agnostic event system
   - Implement event adapter interface

### Phase 4: Create React Adapter (Week 7-8)

1. **Implement React adapter**
   - Create `ReactAdapter` class
   - Implement state management bridge
   - Create event bridging system

2. **React components**
   - Refactor existing components to use core engine
   - Create React-specific hooks
   - Implement overlay system

### Phase 5: Testing and Optimization (Week 9-10)

1. **Comprehensive testing**
   - Unit tests for core package
   - Integration tests for React adapter
   - Performance testing and optimization

2. **Documentation and examples**
   - Update API documentation
   - Create migration guide
   - Provide example implementations for other frameworks

## Framework Portability Examples

### Vue.js Adapter Example

```typescript
// Vue adapter implementation
export class VueAdapter implements FrameworkAdapter {
  createState<T>(initialValue: T): StateManager<T> {
    const state = Vue.ref(initialValue)
    return {
      get: () => state.value,
      set: (value) => { state.value = value },
      subscribe: (callback) => {
        Vue.watch(state, callback)
        return () => {} // cleanup
      }
    }
  }
  
  onMount(callback: () => void): void {
    Vue.onMounted(callback)
  }
  
  // ... other methods
}

// Vue component
export default Vue.defineComponent({
  props: { data: Object, columns: Array },
  setup(props) {
    const adapter = new VueAdapter()
    const engine = new GridEngine(mapPropsToConfig(props), adapter)
    const containerRef = Vue.ref<HTMLElement>()
    
    Vue.onMounted(() => {
      engine.mount(containerRef.value!)
    })
    
    return { containerRef }
  },
  template: '<div ref="containerRef"></div>'
})
```

### Angular Adapter Example

```typescript
// Angular adapter implementation
@Injectable()
export class AngularAdapter implements FrameworkAdapter {
  constructor(private zone: NgZone, private cdr: ChangeDetectorRef) {}
  
  createState<T>(initialValue: T): StateManager<T> {
    const subject = new BehaviorSubject(initialValue)
    return {
      get: () => subject.value,
      set: (value) => { 
        this.zone.run(() => {
          subject.next(value)
          this.cdr.detectChanges()
        })
      },
      subscribe: (callback) => {
        const sub = subject.subscribe(callback)
        return () => sub.unsubscribe()
      }
    }
  }
  
  // ... other methods
}

// Angular component
@Component({
  selector: 'data-editor',
  template: '<div #container></div>'
})
export class DataEditorComponent implements OnInit, OnDestroy {
  @ViewChild('container') containerRef!: ElementRef
  private engine!: GridEngine
  
  constructor(private adapter: AngularAdapter) {}
  
  ngOnInit() {
    this.engine = new GridEngine(this.getConfig(), this.adapter)
    this.engine.mount(this.containerRef.nativeElement)
  }
  
  ngOnDestroy() {
    this.engine.destroy()
  }
}
```

## Benefits of This Architecture

### 1. **Framework Agnostic Core**
- Single source of truth for grid logic
- Consistent behavior across all frameworks
- Easier testing and maintenance
- Performance optimizations benefit all frameworks

### 2. **Easy Framework Porting**
- Clear adapter interface for new frameworks
- Minimal framework-specific code required
- Consistent API across frameworks
- Reduced duplication of effort

### 3. **Improved Maintainability**
- Separation of concerns
- Smaller, focused packages
- Independent versioning possible
- Clear boundaries between framework and core logic

### 4. **Better Performance**
- Core logic optimized without framework constraints
- Efficient state management per framework
- Reduced bundle size for specific frameworks
- Better tree-shaking capabilities

### 5. **Enhanced Testing**
- Core logic testable without framework dependencies
- Framework adapters tested independently
- Better unit test coverage
- Easier integration testing

## Migration Impact

### Breaking Changes
- Package names and import paths will change
- Some React-specific APIs may be restructured
- Event handler signatures may change slightly

### Backward Compatibility
- Provide compatibility layer for major version transition
- Clear migration guide with code examples
- Deprecation warnings for old APIs
- Support both old and new packages during transition period

### Bundle Size Impact
- Core package: ~200KB (framework-agnostic logic)
- React adapter: ~50KB (React-specific code)
- Total size similar to current implementation
- Better tree-shaking for unused features

## Implementation Checklist

### Core Package (`@glideapps/glide-data-grid-core`)
- [ ] Extract type definitions and interfaces
- [ ] Implement GridEngine class
- [ ] Extract rendering system
- [ ] Implement event system
- [ ] Create adapter interfaces
- [ ] Extract utilities and data structures
- [ ] Implement animation system
- [ ] Create performance optimization layer

### React Package (`@glideapps/glide-data-grid-react`)
- [ ] Implement ReactAdapter class
- [ ] Create DataEditor component
- [ ] Implement React hooks
- [ ] Create cell renderer components
- [ ] Implement overlay system
- [ ] Create event bridging
- [ ] Add React-specific optimizations

### Documentation and Testing
- [ ] API documentation for core package
- [ ] React adapter documentation
- [ ] Migration guide
- [ ] Framework porting guide
- [ ] Comprehensive test suite
- [ ] Performance benchmarks
- [ ] Example implementations

## Conclusion

This architecture split will transform glide-data-grid from a React-specific library into a universal data grid solution. The framework-agnostic core ensures consistent behavior and easy maintenance, while framework adapters provide optimal integration with each ecosystem. This approach will significantly reduce the effort required to support multiple frameworks while maintaining the high performance and rich feature set that makes glide-data-grid exceptional.

The modular design also opens possibilities for:
- Server-side rendering optimizations
- Web Worker support for large datasets  
- Native mobile implementations
- Desktop application integration
- Custom framework adapters for specialized use cases

This split positions glide-data-grid as the definitive cross-framework data grid solution while maintaining its current excellence in the React ecosystem.
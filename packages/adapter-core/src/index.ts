// Core interfaces
export type {
  GridEngine,
  GridEngineConfig,
  FrameworkAdapter,
  StateManager,
  GridEngineEvents,
  GridEngineFactory
} from './interfaces/grid-engine.js'

// Factory and convenience functions
export {
  GridFactory,
  GridEngines,
  createReactGridEngine,
  createVueGridEngine,
  type SupportedFramework
} from './grid-factory.js'

// Adapters (for advanced users who want to create custom implementations)
export { ReactAdapter } from './adapters/react-adapter.js'

// Engines (for advanced users)
export { ReactGridEngine } from './engines/react-grid-engine.js'

// Re-export types from the main grid package for convenience
export type {
  GridCell,
  GridColumn, 
  GridSelection,
  Item,
  TextCell,
  NumberCell,
  BooleanCell,
  ImageCell,
  UriCell,
  MarkdownCell
} from '@glideapps/glide-data-grid'
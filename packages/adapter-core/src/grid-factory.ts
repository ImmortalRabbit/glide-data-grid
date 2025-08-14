import type { 
  GridEngine, 
  GridEngineConfig, 
  FrameworkAdapter, 
  GridEngineFactory 
} from './interfaces/grid-engine.js'
import { ReactGridEngine } from './engines/react-grid-engine.js'
import { ReactAdapter } from './adapters/react-adapter.js'

/**
 * Factory for creating grid engines for different frameworks
 * 
 * This is the main entry point for creating framework-specific
 * grid engines. Each framework gets its own factory method.
 */
export class GridFactory implements GridEngineFactory {
  
  /**
   * Create a grid engine with a custom adapter
   */
  createEngine(config: GridEngineConfig, adapter: FrameworkAdapter): GridEngine {
    // For MVP, we only have React implementation
    // Future: detect adapter type and create appropriate engine
    return new ReactGridEngine(config, adapter)
  }
  
  /**
   * Create a React-based grid engine
   * 
   * This is the primary method for React users in the MVP
   */
  static createReactEngine(config: GridEngineConfig): GridEngine {
    const adapter = new ReactAdapter()
    return new ReactGridEngine(config, adapter)
  }
  
  /**
   * Create a Vue-based grid engine (for MVP demonstration)
   * 
   * Note: This will internally use React engine but provide Vue adapter
   */
  static createVueEngine(config: GridEngineConfig): GridEngine {
    // For MVP, this creates a React engine that can be used by Vue
    // The Vue adapter will handle Vue-specific lifecycle
    const adapter = new ReactAdapter() // Vue adapter would be similar
    return new ReactGridEngine(config, adapter)
  }
  
  /**
   * Future: Angular engine
   */
  static createAngularEngine(config: GridEngineConfig): GridEngine {
    throw new Error('Angular adapter not implemented in MVP')
  }
  
  /**
   * Future: Svelte engine
   */
  static createSvelteEngine(config: GridEngineConfig): GridEngine {
    throw new Error('Svelte adapter not implemented in MVP')
  }
  
  /**
   * Future: Vanilla JS engine
   */
  static createVanillaEngine(config: GridEngineConfig): GridEngine {
    throw new Error('Vanilla JS adapter not implemented in MVP')
  }
}

/**
 * Convenience function for creating React engines
 */
export function createReactGridEngine(config: GridEngineConfig): GridEngine {
  return GridFactory.createReactEngine(config)
}

/**
 * Convenience function for creating Vue engines
 */
export function createVueGridEngine(config: GridEngineConfig): GridEngine {
  return GridFactory.createVueEngine(config)
}

/**
 * Type-safe factory methods for each framework
 */
export const GridEngines = {
  React: GridFactory.createReactEngine,
  Vue: GridFactory.createVueEngine,
  Angular: GridFactory.createAngularEngine,
  Svelte: GridFactory.createSvelteEngine,
  Vanilla: GridFactory.createVanillaEngine,
} as const

export type SupportedFramework = keyof typeof GridEngines
import React from 'react'
import type { FrameworkAdapter, StateManager } from '../interfaces/grid-engine.js'

/**
 * React-specific adapter implementation
 * This provides React-specific functionality to the grid engine
 * 
 * NOTE: This is designed to be used inside React components
 * and relies on React hooks being available
 */
export class ReactAdapter implements FrameworkAdapter {
  private mountCallbacks: Array<() => void> = []
  private unmountCallbacks: Array<() => void> = []
  private updateCallbacks: Array<() => void> = []
  
  onMount(callback: () => void): void {
    this.mountCallbacks.push(callback)
  }
  
  onUnmount(callback: () => void): void {
    this.unmountCallbacks.push(callback)
  }
  
  onUpdate(callback: () => void): void {
    this.updateCallbacks.push(callback)
  }
  
  createState<T>(initialValue: T): StateManager<T> {
    // This would typically be called inside a React component
    // where hooks are available
    const [value, setValue] = React.useState(initialValue)
    
    return {
      get: () => value,
      set: setValue,
      subscribe: (callback) => {
        // In React, we use useEffect for subscriptions
        React.useEffect(() => {
          callback(value)
        }, [value])
        
        return () => {} // React handles cleanup automatically
      }
    }
  }
  
  addEventListener(element: HTMLElement, event: string, handler: EventListener): void {
    element.addEventListener(event, handler)
  }
  
  removeEventListener(element: HTMLElement, event: string, handler: EventListener): void {
    element.removeEventListener(event, handler)
  }
  
  requestAnimationFrame(callback: () => void): number {
    return window.requestAnimationFrame(callback)
  }
  
  cancelAnimationFrame(id: number): void {
    window.cancelAnimationFrame(id)
  }
  
  createElement(tag: string): HTMLElement {
    return document.createElement(tag)
  }
  
  measureText(text: string, font: string): { width: number; height: number } {
    // Create temporary canvas for text measurement
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Could not get canvas context')
    
    ctx.font = font
    const metrics = ctx.measureText(text)
    
    return {
      width: metrics.width,
      height: metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent
    }
  }
  
  // Internal methods for React component integration
  
  /**
   * Call this in React.useEffect(() => {}, []) to trigger mount callbacks
   */
  triggerMount(): void {
    this.mountCallbacks.forEach(callback => callback())
  }
  
  /**
   * Call this in the cleanup function of React.useEffect to trigger unmount callbacks
   */
  triggerUnmount(): void {
    this.unmountCallbacks.forEach(callback => callback())
  }
  
  /**
   * Call this in React.useEffect when dependencies change
   */
  triggerUpdate(): void {
    this.updateCallbacks.forEach(callback => callback())
  }
}
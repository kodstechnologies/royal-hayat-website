import { lazy, type ComponentType, type LazyExoticComponent } from "react";
import { clearChunkReloadFlag, isChunkLoadError, reloadForStaleChunks } from "./chunkReload";

type ModuleDefault<T> = { default: T };

export function lazyWithRetry<T extends ComponentType<unknown>>(
  importer: () => Promise<ModuleDefault<T>>,
): LazyExoticComponent<T> {
  return lazy(async () => {
    try {
      const module = await importer();
      clearChunkReloadFlag();
      return module;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (isChunkLoadError(message) && reloadForStaleChunks()) {
        return new Promise<ModuleDefault<T>>(() => {});
      }
      clearChunkReloadFlag();
      throw error;
    }
  });
}

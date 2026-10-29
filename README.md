# Virtualized Photo Browser

A React application capable of rendering and browsing massive local image folders (20,000+ files) smoothly using windowing virtualization[cite: 1, 2].

## How Virtualization is Implemented
- Utilizes `react-window` (`FixedSizeGrid`) to render only the grid elements currently intersecting the viewable DOM area.
- Prevents memory consumption spikes by avoiding DOM overload when parsing thousands of items.

## Edge Cases Handled
- **Non-Image Filtering:** Automatically detects file MIME types and skips text, code, or corrupt formats while reporting skipped file counts.
- **Memory Management:** Implements cleanup routines via `URL.revokeObjectURL()` to prevent memory leaks during folder switching.

# Mobile Service

Author: Matt Hudson

### Purpose

The Mobile Service contains data representing whether the client is on a desktop or mobile device, and is used by other components to alter UI based on that.

### Properties

`opaque: boolean`: determines whether the NavBar background should be opaque or not. Default: `true`

`minWidth: number`: sets the minimum width in pixels that the display is considered a desktop display (not mobile).

`minHeight: number`: sets the minimum height in pxels that the display is considered a desktop display (not mobile).

## Methods

`isMobile(): boolean`: returns whether the client display is mobile or not. Checks the screen width and height, and a really long RegEx.
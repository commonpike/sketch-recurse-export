# RecursiveExport
Plugin for Sketch.app to recursively export layers in a selected file structure

## What it does 
When selecting a layer in your canvas and running the script, the script
will prompt for an export directory and a desired export structure.
Then it traverses your layers and exports each layer that has been
marked exportable in all of the export formats defined for that layer.

## Screenshots

So given

<img width="229" alt="Screenshot 2024-12-14 at 11 14 45" src="https://github.com/user-attachments/assets/54c83fe2-aed5-40c3-881d-484d563c5aee" />

It asks

<img width="338" alt="Screenshot 2024-12-14 at 11 01 22" src="https://github.com/user-attachments/assets/98180df5-1991-458e-92c4-e651700a8008" />

And exports either 

<img width="431" alt="Screenshot 2024-12-14 at 11 15 15" src="https://github.com/user-attachments/assets/ed6ad854-3344-4e8e-9b0e-1aa0085f8cf4" />

or 

<img width="278" alt="Screenshot 2024-12-14 at 11 16 45" src="https://github.com/user-attachments/assets/fc10b2af-b52e-4d8a-bbb3-9bc0fef7c5ff" />

or just a flat list of files named as the layer. 
But you can do the latter without the plugin, just in Sketch > File > Export

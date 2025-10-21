# AjedrezSG

AjedrezSG is a Three.js-based project created as part of the "Sistemas Gráficos" (Computer Graphics) course. The goal of this assignment was to learn how to model, articulate and animate 3D objects using Three.js. Each chess piece was modeled with a different technique (sweep, revolution, handcrafted primitives, etc.), we animated them to reflect their legal chess movement, and the queen includes a custom "battle" animation that plays before a capture. We also set up cameras and multiple lighting types in the scene to properly showcase the models and their animations.

Overview
--------
This repository collects the models, animations and supporting utilities used to build an interactive demo of animated chess pieces with Three.js. It is intended as a learning artifact and a showcase of modeling and animation techniques applied to familiar pieces.

Highlights
----------
- Piece modeling using a variety of geometric techniques: lathe/revolution, sweep/extrusion, and constructive modeling from primitives.  
- Movement animations that represent each piece's legal chess moves.  
- A special, expressive battle animation for the queen that plays before capturing another piece.  
- Scene composed with cameras and different light setups to enhance depth, materials and animation readability.  
- Modular structure separating each piece, shared utilities, and assets so you can inspect or extend individual components.

Course context
--------------
This project was developed for the Sistemas Gráficos course of the Computer Science degree to practice 3D modeling, hierarchical articulation and keyframe/behavioral animation in a WebGL environment (Three.js). The work was carried out collaboratively by two students as part of the course assignment.

Repository structure (high level)
---------------------------------
- Ajedrez/ — global scene/board setup and main scene logic  
- Alfil/ — bishop model, materials and animations  
- Caballo/ — knight model, materials and animations  
- Torre/ — rook model, materials and animations  
- Rey/ — king model, materials and animations  
- Reina/ — queen model and its custom battle animation  
- peon/ — pawn model, materials and animations  
- libs/ — auxiliary libraries and helpers  
- models/ — shared model definitions or exported assets  
- utils/ — utility scripts and helpers  
- imgs/ — images and demo assets  
- server-launcher.py — helper script to run a local server or demo environment

Prerequisites
-------------
- Node.js and npm (for frontend tooling, building or dev servers)  
- A modern browser with WebGL support (Chrome, Firefox, Edge, Safari)  
- Optionally Python 3 if you prefer using the included server-launcher.py to serve static files

Quick start
-----------
1. Clone the repository:
   git clone https://github.com/claraagrcia/AjedrezSG.git
2. Enter the project directory:
   cd AjedrezSG
3. Install frontend dependencies (if a package.json is present):
   npm install
4. Serve the demo locally (choose one):
   - If package.json includes a dev script:
       npm run dev
   - Or use a simple static server for the demo folder (e.g., npx serve or live-server)
   - Or use the included Python helper:
       python server-launcher.py
5. Open the demo page shown by the server in your web browser and explore the models and animations.

Modeling & animation notes
--------------------------
- Each piece folder contains the code/assets used to generate its mesh and define its articulation and animation. Check those folders to see the specific modeling approach used.  
- Animations are implemented to reflect the movement semantics of chess pieces (linear translations for rook, diagonal for bishop, L-shaped for knight, etc.), and are designed to blend naturally with the scene.  
- We used cameras and a combination of lights (ambient, directional, and point lights) to improve material perception, shadows and the overall presentation of motion.  
- The queen has a bespoke pre-capture sequence — a short "battle" animation that adds personality to the demo before executing a capture.

Authors
------
- claraagrcia — Developed as part of the Sistemas Gráficos course.  
- evalopvl — Developed as part of the Sistemas Gráficos course.

Thank you for exploring AjedrezSG — We hope this project helps others learn Three.js modeling and animation techniques.
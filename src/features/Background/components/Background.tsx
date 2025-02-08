import React, { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";
import { DisplacementFilter } from "pixi.js";

const Background: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    console.log("Initializing Background component");

    // Create canvas element first
    const canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    containerRef.current.appendChild(canvas);

    // Initialize PIXI application
    const app = new PIXI.Application();
    app.init({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0x000000,
      resizeTo: window,
      antialias: true,
      view: canvas,
    });

    appRef.current = app;
    console.log("PIXI Application created");

    const setup = async () => {
      try {
        console.log("Loading textures...");
        // Load textures
        const [mainTexture, depthTexture] = await Promise.all([
          PIXI.Assets.load("/background/image/cyber1.png"),
          PIXI.Assets.load("/background/depthmap/cyber-depthmap.png"),
        ]);

        console.log("Textures loaded successfully");

        // Create sprites using the loaded textures
        const background = new PIXI.Sprite(mainTexture);
        const depthMap = new PIXI.Sprite(depthTexture);

        console.log("Sprites created");

        // Set up background
        background.width = window.innerWidth;
        background.height = window.innerHeight;
        app.stage.addChild(background);

        // Set up depth map
        depthMap.width = window.innerWidth;
        depthMap.height = window.innerHeight;
        depthMap.visible = false;
        app.stage.addChild(depthMap);

        console.log("Sprites added to stage");

        // Set up displacement filter
        const displacementFilter = new DisplacementFilter(depthMap);
        displacementFilter.scale.x = 20;
        displacementFilter.scale.y = 20;
        background.filters = [displacementFilter];

        console.log("Displacement filter set up");

        // Mouse move handler for parallax effect
        const onMouseMove = (e: MouseEvent) => {
          const { clientX, clientY } = e;
          const centerX = window.innerWidth / 2;
          const centerY = window.innerHeight / 2;

          // Calculate displacement based on mouse position
          displacementFilter.scale.x = (clientX - centerX) * 0.05;
          displacementFilter.scale.y = (clientY - centerY) * 0.05;
        };

        window.addEventListener("mousemove", onMouseMove);

        // Handle window resize
        const onResize = () => {
          if (!appRef.current) return;
          background.width = window.innerWidth;
          background.height = window.innerHeight;
          depthMap.width = window.innerWidth;
          depthMap.height = window.innerHeight;
        };

        window.addEventListener("resize", onResize);

        return () => {
          window.removeEventListener("mousemove", onMouseMove);
          window.removeEventListener("resize", onResize);
        };
      } catch (error) {
        console.error("Error in setup:", error);
        if (error instanceof Error) {
          console.error("Error message:", error.message);
          console.error("Error stack:", error.stack);
        }
        throw error;
      }
    };

    // Run setup
    let cleanup: (() => void) | undefined;
    setup()
      .then((cleanupFn) => {
        cleanup = cleanupFn;
        console.log("Setup completed successfully");
      })
      .catch((error) => {
        console.error("Failed to complete setup:", error);
      });

    // Cleanup
    return () => {
      cleanup?.();
      if (appRef.current) {
        console.log("Destroying PIXI application");
        appRef.current.destroy(true);
      }
      canvas.remove();
    };
  }, []);

  return <div ref={containerRef} className="fixed inset-0 -z-10" />;
};

export default Background;

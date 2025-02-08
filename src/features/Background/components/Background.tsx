import React, { useEffect, useRef, useState } from "react";
import * as PIXI from "pixi.js";
import { DisplacementFilter } from "pixi.js";

// Available wallpapers and their depth maps
const WALLPAPERS = [
  { image: "anime", ext: "png" },
  { image: "astro", ext: "jpg" },
  { image: "car", ext: "jpg" },
  { image: "castle", ext: "jpg" },
  { image: "cave", ext: "jpg" },
  { image: "cyber", ext: "png" },
  { image: "fantasy", ext: "jpg" },
  { image: "fantasy2", ext: "jpg" },
  { image: "northernlights", ext: "jpg" },
  { image: "onepiece", ext: "jpg" },
  { image: "sunrise", ext: "jpg" },
  { image: "waterfall", ext: "jpg" },
];

const Background: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);
  const backgroundRef = useRef<PIXI.Sprite | null>(null);
  const displacementFilterRef = useRef<DisplacementFilter | null>(null);
  // Add refs for smooth movement
  const targetValues = useRef({ x: 0, y: 0 });
  const currentValues = useRef({ x: 0, y: 0 });
  const [currentWallpaper, setCurrentWallpaper] = useState(
    () => WALLPAPERS[Math.floor(Math.random() * WALLPAPERS.length)]
  );

  const changeWallpaper = async () => {
    if (!backgroundRef.current) return;

    // Fade out
    const fadeOutTween = { alpha: 1 };
    const fadeOutDuration = 300; // 0.3 seconds
    const startTime = Date.now();

    const fadeOut = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / fadeOutDuration, 1);
      fadeOutTween.alpha = 1 - progress;

      if (backgroundRef.current) {
        backgroundRef.current.alpha = fadeOutTween.alpha;
      }

      if (progress < 1) {
        requestAnimationFrame(fadeOut);
      } else {
        // After fade out, load new wallpaper
        loadNewWallpaper();
      }
    };

    fadeOut();

    const loadNewWallpaper = async () => {
      // Choose new random wallpaper (different from current)
      let newWallpaper;
      do {
        newWallpaper =
          WALLPAPERS[Math.floor(Math.random() * WALLPAPERS.length)];
      } while (newWallpaper.image === currentWallpaper.image);

      try {
        const [mainTexture, depthTexture] = await Promise.all([
          PIXI.Assets.load(
            `/background/image/${newWallpaper.image}.${newWallpaper.ext}`
          ),
          PIXI.Assets.load(`/background/depthmap/${newWallpaper.image}.png`),
        ]);

        if (backgroundRef.current) {
          backgroundRef.current.texture = mainTexture;
          // Apply dark tint to new background
          backgroundRef.current.tint = 0xcccccc;
          backgroundRef.current.alpha = 0.8;
          // Create a new displacement filter with the new depth map
          const newDisplacementFilter = new DisplacementFilter(
            new PIXI.Sprite(depthTexture)
          );
          newDisplacementFilter.scale.x = 15;
          newDisplacementFilter.scale.y = 15;
          backgroundRef.current.filters = [newDisplacementFilter];
          displacementFilterRef.current = newDisplacementFilter;
        }

        setCurrentWallpaper(newWallpaper);

        // Fade in
        const fadeInTween = { alpha: 0 };
        const fadeInDuration = 300; // 0.3 seconds
        const fadeInStart = Date.now();

        const fadeIn = () => {
          const elapsed = Date.now() - fadeInStart;
          const progress = Math.min(elapsed / fadeInDuration, 1);
          fadeInTween.alpha = progress;

          if (backgroundRef.current) {
            backgroundRef.current.alpha = fadeInTween.alpha;
          }

          if (progress < 1) {
            requestAnimationFrame(fadeIn);
          }
        };

        fadeIn();
      } catch (error) {
        console.error("Error loading new wallpaper:", error);
      }
    };
  };

  useEffect(() => {
    if (!containerRef.current) return;

    console.log("Initializing Background component");

    const canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    containerRef.current.appendChild(canvas);

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
        const [mainTexture, depthTexture] = await Promise.all([
          PIXI.Assets.load(
            `/background/image/${currentWallpaper.image}.${currentWallpaper.ext}`
          ),
          PIXI.Assets.load(
            `/background/depthmap/${currentWallpaper.image}.png`
          ),
        ]);

        console.log("Textures loaded successfully");

        const background = new PIXI.Sprite(mainTexture);
        const depthMap = new PIXI.Sprite(depthTexture);
        backgroundRef.current = background;

        console.log("Sprites created");

        // Apply dark tint to background
        background.tint = 0xcccccc; // Lighter gray tint (80% of white)
        background.alpha = 0.8; // 80% opacity

        background.width = window.innerWidth;
        background.height = window.innerHeight;
        // Set pivot point to center for rotation
        background.anchor.set(0.5);
        // Adjust position to compensate for centered anchor
        background.position.set(window.innerWidth / 2, window.innerHeight / 2);
        app.stage.addChild(background);

        depthMap.width = window.innerWidth;
        depthMap.height = window.innerHeight;
        // Also center the depth map
        depthMap.anchor.set(0.5);
        depthMap.position.set(window.innerWidth / 2, window.innerHeight / 2);
        depthMap.visible = false;
        app.stage.addChild(depthMap);

        console.log("Sprites added to stage");

        const displacementFilter = new DisplacementFilter(depthMap);
        displacementFilter.scale.x = 15;
        displacementFilter.scale.y = 15;
        background.filters = [displacementFilter];
        displacementFilterRef.current = displacementFilter;

        console.log("Displacement filter set up");

        // Set up animation loop for smooth transitions
        const animate = () => {
          if (backgroundRef.current && displacementFilterRef.current) {
            // Smooth displacement movement
            currentValues.current.x +=
              (targetValues.current.x - currentValues.current.x) * 0.1;
            currentValues.current.y +=
              (targetValues.current.y - currentValues.current.y) * 0.1;

            // Apply values
            displacementFilterRef.current.scale.x = currentValues.current.x;
            displacementFilterRef.current.scale.y = currentValues.current.y;
          }
          requestAnimationFrame(animate);
        };

        animate();

        // Set up wallpaper rotation interval
        const wallpaperInterval = setInterval(() => {
          changeWallpaper();
        }, 10000);

        const onMouseMove = (e: MouseEvent) => {
          if (!displacementFilterRef.current) return;

          const { clientX, clientY } = e;
          const centerX = window.innerWidth / 2;
          const centerY = window.innerHeight / 2;

          // Calculate normalized position (-1 to 1)
          const normalizedX = (clientX - centerX) / (window.innerWidth / 2);
          const normalizedY = (clientY - centerY) / (window.innerHeight / 2);

          // Update target values with displacement only
          targetValues.current.x = normalizedX * 20;
          targetValues.current.y = normalizedY * 20;
        };

        window.addEventListener("mousemove", onMouseMove);

        const onResize = () => {
          if (!appRef.current) return;
          background.width = window.innerWidth;
          background.height = window.innerHeight;
          // Update position on resize
          background.position.set(
            window.innerWidth / 2,
            window.innerHeight / 2
          );

          depthMap.width = window.innerWidth;
          depthMap.height = window.innerHeight;
          depthMap.position.set(window.innerWidth / 2, window.innerHeight / 2);
        };

        window.addEventListener("resize", onResize);

        return () => {
          window.removeEventListener("mousemove", onMouseMove);
          window.removeEventListener("resize", onResize);
          clearInterval(wallpaperInterval);
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

    let cleanup: (() => void) | undefined;
    setup()
      .then((cleanupFn) => {
        cleanup = cleanupFn;
        console.log("Setup completed successfully");
      })
      .catch((error) => {
        console.error("Failed to complete setup:", error);
      });

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

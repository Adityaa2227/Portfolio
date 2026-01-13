import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import './loader.css';
import api from '../../api/axios'; // Import your axios instance

gsap.registerPlugin(TextPlugin);

const Loader = ({ onComplete, onBackendFound }) => {
    const [progress, setProgress] = useState(0);
    const [logs, setLogs] = useState([]);
    const containerRef = useRef(null);
    const nameRef = useRef(null);
    const roleRef = useRef(null);
    const progressRef = useRef(null);
    const progressFillRef = useRef(null);
    const percentageRef = useRef(null);
    
    // Track if backend is actually ready
    const isBackendReady = useRef(false);
    const pollingInterval = useRef(null);

    // Boot logs to cycle through
    const bootSequence = [
        "INITIALIZING KERNEL...",
        "LOADING MODULES...",
        "VERIFYING INTEGRITY...",
        "ESTABLISHING SECURE CONNECTION...",
        "DECRYPTING ASSETS...",
        "MOUNTING UI COMPONENTS...",
        "OPTIMIZING GRAPHICS...",
        "SYSTEM CHECK COMPLETE."
    ];

    // Add a log to the screen
    const addLog = (msg) => {
        setLogs(prev => [...prev.slice(-4), `> ${msg}`]);
    };

    // ------------------------------------------
    // 1. Backend Polling Logic
    // ------------------------------------------
    useEffect(() => {
        const checkBackend = async () => {
            try {
                // Ping valid endpoint to avoid 404
                await api.get('/projects'); 
                console.log("[Loader] Backend is ONLINE.");
                isBackendReady.current = true;
                if (onBackendFound) onBackendFound(); // Signal that backend is ready
                clearInterval(pollingInterval.current);
            } catch (error) {
                console.log("[Loader] Backend sleeping/error...", error.message);
                // Even on 404/500, it means it's awake enough to respond. 
                if (error.response) {
                    isBackendReady.current = true;
                    if (onBackendFound) onBackendFound(); 
                    clearInterval(pollingInterval.current);
                }
            }
        };

        // Check immediately
        checkBackend();
        // Then poll every 2s
        pollingInterval.current = setInterval(checkBackend, 2000);

        return () => clearInterval(pollingInterval.current);
    }, []);


    // ------------------------------------------
    // 2. Animation Timeline
    // ------------------------------------------
    const introDone = useRef(false);

    // ------------------------------------------
    // 2. Animation Timeline
    // ------------------------------------------
    useEffect(() => {
        const tl = gsap.timeline({
            onComplete: () => {
                introDone.current = true;
            }
        });

        // PART 1: INTRO (0s - 3.5s)
        tl.to(containerRef.current, { opacity: 1, duration: 1 })
          .fromTo(nameRef.current, 
            { y: 20, opacity: 0 }, 
            { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
          )
          .to(nameRef.current, { 
             text: { value: "ADITYA AGARWAL", delimiter: "" }, 
             duration: 1.5, 
             ease: "none" 
          }, "-=0.5")
          .fromTo(roleRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 0.8, text: "FULL STACK DEVELOPER" },
            "-=0.5"
          );

        // PART 2: LOADING LOOP (Unlimited duration until ready)
        return () => tl.kill();
    }, []);


    // ------------------------------------------
    // 3. Progress Logic (The "Fake" Loader)
    // ------------------------------------------
    useEffect(() => {
        let currentProgress = 0;
        let logIndex = 0;
        
        const updateProgress = () => {
            // Only finish if Backend is Ready AND Intro Animation is Done
            if (isBackendReady.current && introDone.current) {
                // Backend ready: Accelerate to 100%
                currentProgress += (100 - currentProgress) * 0.1;
                if (currentProgress > 99.5) {
                    currentProgress = 100;
                    finishAnimation();
                    return; // Stop loop
                }
            } else {
                // Backend sleeping OR Intro still playing: Stall at ~90%
                if (currentProgress < 90) {
                    // Slow down as we get closer to 90
                    const remaining = 90 - currentProgress;
                    currentProgress += remaining * 0.02; // Very slow increment
                }
            }

            // Update DOM directly for performance / GSAP feel
            if (progressFillRef.current) {
                progressFillRef.current.style.width = `${currentProgress}%`;
            }
            if (percentageRef.current) {
                percentageRef.current.innerText = `${Math.floor(currentProgress)}%`;
            }

            // Cycle logs based on progress chunks
            if (logIndex < bootSequence.length && currentProgress > (logIndex + 1) * 10) {
                addLog(bootSequence[logIndex]);
                logIndex++;
            }

            requestAnimationFrame(updateProgress);
        };

        const animationFrame = requestAnimationFrame(updateProgress);

        // Helper to cleanly exit
        const finishAnimation = () => {
            cancelAnimationFrame(animationFrame);
            
            // Final GSAP Exit Sequence
            const exitTl = gsap.timeline({
                onComplete: onComplete
            });

            exitTl
                .to(roleRef.current, { opacity: 0, duration: 0.5 })
                .to(nameRef.current, { opacity: 0, duration: 0.5 }, "-=0.3")
                .to(progressRef.current, { width: 0, opacity: 0, duration: 0.5 }, "-=0.3")
                .to(".boot-log", { opacity: 0, duration: 0.5 }, "-=0.5")
                .to(containerRef.current, { 
                    height: 0, 
                    duration: 1, 
                    ease: "power4.inOut" 
                });
        };

        return () => cancelAnimationFrame(animationFrame);
    }, []);

    return (
        <div className="loader-container" ref={containerRef}>
            <div className="scanline"></div>
            
            <div className="z-20 text-center flex flex-col items-center">
                <h1 className="cinematic-text text-4xl md:text-6xl mb-2 text-white" ref={nameRef}></h1>
                <p className="mono-text text-blue-500 text-sm tracking-widest" ref={roleRef}></p>

                <div className="loader-progress-bar" ref={progressRef}>
                    <div className="loader-progress-fill" ref={progressFillRef}></div>
                </div>
                
                <div className="mono-text mt-2 text-xs text-gray-500" ref={percentageRef}>0%</div>
            </div>

            <div className="boot-log mono-text">
                {logs.map((log, i) => (
                    <div key={i}>{log}</div>
                ))}
            </div>
        </div>
    );
};

export default Loader;

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import './loader.css';

gsap.registerPlugin(TextPlugin);

const Loader = ({ onComplete }) => {
    const [logs, setLogs] = useState([]);
    const containerRef = useRef(null);
    const nameRef = useRef(null);
    const roleRef = useRef(null);
    const progressRef = useRef(null);
    const progressFillRef = useRef(null);
    const percentageRef = useRef(null);

    const bootSequence = [
        "INITIALIZING KERNEL...",
        "LOADING MODULES...",
        "VERIFYING INTEGRITY...",
        "DECRYPTING ASSETS...",
        "MOUNTING UI COMPONENTS...",
        "OPTIMIZING GRAPHICS...",
        "SYSTEM CHECK COMPLETE."
    ];

    const addLog = (msg) => {
        setLogs(prev => [...prev.slice(-4), `> ${msg}`]);
    };

    useEffect(() => {
        const tl = gsap.timeline();

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

        return () => tl.kill();
    }, []);

    useEffect(() => {
        let currentProgress = 0;
        let logIndex = 0;
        let animationFrameId;

        const updateProgress = () => {
            // Fast smooth progress to 100%
            currentProgress += (100 - currentProgress) * 0.025;

            if (currentProgress > 99.5) {
                currentProgress = 100;
                if (progressFillRef.current) progressFillRef.current.style.width = `100%`;
                if (percentageRef.current) percentageRef.current.innerText = `100%`;
                finishAnimation();
                return;
            }

            if (progressFillRef.current) progressFillRef.current.style.width = `${currentProgress}%`;
            if (percentageRef.current) percentageRef.current.innerText = `${Math.floor(currentProgress)}%`;

            if (logIndex < bootSequence.length && currentProgress > (logIndex + 1) * 13) {
                addLog(bootSequence[logIndex]);
                logIndex++;
            }

            animationFrameId = requestAnimationFrame(updateProgress);
        };

        animationFrameId = requestAnimationFrame(updateProgress);

        const finishAnimation = () => {
            cancelAnimationFrame(animationFrameId);

            const exitTl = gsap.timeline({ onComplete });
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

        return () => cancelAnimationFrame(animationFrameId);
    }, []);

    return (
        <div className="loader-container" ref={containerRef}>
            <div className="scanline"></div>

            <div className="z-20 text-center flex flex-col items-center">
                <h1 className="cinematic-text text-4xl md:text-6xl mb-2 text-white" ref={nameRef}></h1>
                <p className="mono-text text-orange-500 text-sm tracking-widest" ref={roleRef}></p>

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

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/** Fixed, full-viewport star field behind the site. Drifts slowly and parallaxes with the pointer. */
const Starfield = () => {
  const mount = useRef(null);

  useEffect(() => {
    const el = mount.current;
    if (!el) return undefined;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: 'low-power' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 1;

    // Round, soft star sprite
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const g = c.getContext('2d');
    const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.25, 'rgba(255,255,255,0.8)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grad;
    g.fillRect(0, 0, 64, 64);
    const sprite = new THREE.CanvasTexture(c);

    const makeLayer = (count, size, spread, palette) => {
      const pos = new Float32Array(count * 3);
      const col = new Float32Array(count * 3);
      const color = new THREE.Color();
      for (let i = 0; i < count; i += 1) {
        pos[i * 3] = (Math.random() - 0.5) * spread;
        pos[i * 3 + 1] = (Math.random() - 0.5) * spread;
        pos[i * 3 + 2] = -Math.random() * spread;
        color.set(palette[Math.floor(Math.random() * palette.length)]);
        col.set([color.r, color.g, color.b], i * 3);
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
      const mat = new THREE.PointsMaterial({
        size,
        map: sprite,
        vertexColors: true,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        opacity: 0.9,
        sizeAttenuation: false,
      });
      const pts = new THREE.Points(geo, mat);
      scene.add(pts);
      return pts;
    };

    const far = makeLayer(1800, 2.2, 900, ['#ffffff', '#c4b5fd', '#a78bfa', '#e9d5ff']);
    const near = makeLayer(300, 3.6, 600, ['#ffffff', '#ddd6fe', '#f0abfc']);

    const target = { x: 0, y: 0 };
    const onPointer = (e) => {
      target.x = (e.clientX / window.innerWidth - 0.5) * 2;
      target.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      if (reduce) renderer.render(scene, camera);
    };

    let raf = 0;
    const loop = () => {
      const scroll = window.scrollY * 0.00025;
      far.rotation.z += 0.00012;
      near.rotation.z += 0.0002;
      camera.position.x += (target.x * 6 - camera.position.x) * 0.03;
      camera.position.y += (-target.y * 6 - camera.position.y) * 0.03;
      camera.rotation.x = scroll;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    };
    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden && !reduce) raf = requestAnimationFrame(loop);
    };

    window.addEventListener('resize', onResize);
    if (reduce) {
      renderer.render(scene, camera);
    } else {
      window.addEventListener('pointermove', onPointer, { passive: true });
      document.addEventListener('visibilitychange', onVisibility);
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onPointer);
      document.removeEventListener('visibilitychange', onVisibility);
      [far, near].forEach((p) => { p.geometry.dispose(); p.material.dispose(); });
      sprite.dispose();
      renderer.dispose();
      el.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <>
      <div className="aurora" aria-hidden><span /><span /><span /></div>
      <div ref={mount} aria-hidden className="pointer-events-none fixed inset-0 -z-10" />
    </>
  );
};

export default Starfield;

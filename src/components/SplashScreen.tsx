"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useI18n } from "@/lib/i18n";

interface Props {
  onEnter: () => void;
}

const BOOT_SEQUENCES = {
  en: [
    "CIPHERLAB OS v1.0.0 [Build 20250101]",
    "Initializing cryptographic engine...",
    "Loading Vigenere module............. OK",
    "Loading Affine module............... OK",
    "Loading Playfair module............. OK",
    "Loading Hill matrix module.......... OK",
    "Loading Enigma rotor simulation..... OK",
    "Connecting to Supabase vault........ OK",
    "CRT display driver loaded.",
    "All systems operational.",
    "",
    ">> CIPHERLAB READY",
  ],
  id: [
    "CIPHERLAB OS v1.0.0 [Build 20250101]",
    "Inisialisasi mesin kriptografi...",
    "Memuat modul Vigenere.............. OK",
    "Memuat modul Affine................ OK",
    "Memuat modul Playfair.............. OK",
    "Memuat modul matriks Hill.......... OK",
    "Memuat simulasi rotor Enigma....... OK",
    "Menghubungkan ke vault Supabase.... OK",
    "Driver layar CRT dimuat.",
    "Semua sistem berjalan normal.",
    "",
    ">> CIPHERLAB SIAP",
  ],
};

export default function SplashScreen({ onEnter }: Props) {
  const { t, locale } = useI18n();
  const mountRef = useRef<HTMLDivElement>(null);
  const [booting, setBooting] = useState(true);
  const [bootLines, setBootLines] = useState<string[]>([]);
  const [showEnter, setShowEnter] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const lines = BOOT_SEQUENCES[locale] ?? BOOT_SEQUENCES.en;

    setBootLines([]);
    setBooting(true);
    setShowEnter(false);

    let lineIndex = 0;
    const interval = setInterval(() => {
      if (lineIndex < lines.length) {
        const currentLine = lines[lineIndex];
        setBootLines((prev) => [...prev, currentLine]);
        lineIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setBooting(false);
          setTimeout(() => setShowEnter(true), 600);
        }, 400);
      }
    }, 120);

    return () => clearInterval(interval);
  }, [locale]); 

  useEffect(() => {
    if (!mountRef.current) return;
    const mount = mountRef.current;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0f);
    scene.fog = new THREE.FogExp2(0x0a0a0f, 0.04);

    const camera = new THREE.PerspectiveCamera(60, mount.clientWidth / mount.clientHeight, 0.1, 200);
    camera.position.set(0, 1.5, 12);
    camera.lookAt(0, 0, 0);

    const ambientLight = new THREE.AmbientLight(0x111122, 2);
    scene.add(ambientLight);
    const greenLight = new THREE.PointLight(0x00ff88, 80, 30);
    greenLight.position.set(0, 2, 4);
    scene.add(greenLight);
    const amberLight = new THREE.PointLight(0xffb700, 30, 20);
    amberLight.position.set(-6, 3, 0);
    scene.add(amberLight);
    const cyanLight = new THREE.PointLight(0x00d4ff, 30, 20);
    cyanLight.position.set(6, 3, 0);
    scene.add(cyanLight);

    function makeTextTexture(text: string, size: number, color: string, bgColor: string, font = "bold 36px 'Courier New'"): THREE.CanvasTexture {
      const canvas = document.createElement("canvas");
      canvas.width = size; canvas.height = size;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = bgColor; ctx.fillRect(0, 0, size, size);
      ctx.fillStyle = color; ctx.font = font;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(text, size / 2, size / 2);
      return new THREE.CanvasTexture(canvas);
    }

    // Central Monolith
    const monolithGeo = new THREE.BoxGeometry(5, 3.2, 0.15);
    const monolithMat = new THREE.MeshStandardMaterial({ color: 0x050510, emissive: 0x00ff88, emissiveIntensity: 0.08, roughness: 0.3, metalness: 0.8 });
    const monolith = new THREE.Mesh(monolithGeo, monolithMat);
    monolith.position.set(0, 0.5, 0);
    scene.add(monolith);

    const borderGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(5.1, 3.3, 0.18));
    const borderMat = new THREE.LineBasicMaterial({ color: 0x00ff88, transparent: true, opacity: 0.8 });
    const border = new THREE.LineSegments(borderGeo, borderMat);
    border.position.copy(monolith.position);
    scene.add(border);

    // Monolith text canvas
    const titleCanvas = document.createElement("canvas");
    titleCanvas.width = 1024; titleCanvas.height = 512;
    const tCtx = titleCanvas.getContext("2d")!;
    tCtx.fillStyle = "rgba(0,0,0,0)"; tCtx.fillRect(0, 0, 1024, 512);
    tCtx.shadowBlur = 30; tCtx.shadowColor = "#00ff88";
    tCtx.fillStyle = "#00ff88"; tCtx.font = "bold 100px 'Courier New'";
    tCtx.textAlign = "center"; tCtx.fillText("CIPHERLAB", 512, 160);
    tCtx.shadowBlur = 0;
    tCtx.fillStyle = "#c8c8e8"; tCtx.font = "30px 'Courier New'";
    tCtx.fillText("Classical Cryptography Suite", 512, 240);
    tCtx.fillStyle = "#6b6b9a"; tCtx.font = "22px 'Courier New'";
    tCtx.fillText("[ SYSTEM ONLINE ]  \u25CF  v1.0.0", 512, 340);
    for (let y = 0; y < 512; y += 4) { tCtx.fillStyle = "rgba(0,0,0,0.15)"; tCtx.fillRect(0, y, 1024, 2); }

    const titlePlane = new THREE.Mesh(
      new THREE.PlaneGeometry(4.8, 2.8),
      new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(titleCanvas), transparent: true })
    );
    titlePlane.position.set(0, 0.5, 0.1);
    scene.add(titlePlane);

    // Enigma Rotors
    const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    function createRotor(radius: number, color: number): THREE.Group {
      const group = new THREE.Group();
      group.add(new THREE.Mesh(new THREE.TorusGeometry(radius, 0.18, 16, 52), new THREE.MeshStandardMaterial({ color: 0x1a1a2e, emissive: color, emissiveIntensity: 0.3, metalness: 0.9, roughness: 0.2 })));
      const disc = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.6, radius * 0.6, 0.05, 32), new THREE.MeshStandardMaterial({ color: 0x0d0d1a, metalness: 0.95, roughness: 0.1 }));
      disc.rotation.x = Math.PI / 2; group.add(disc);
      for (let i = 0; i < 26; i++) {
        const angle = (i / 26) * Math.PI * 2;
        const letterMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 0.22), new THREE.MeshBasicMaterial({ map: makeTextTexture(ALPHABET[i], 64, `#${color.toString(16).padStart(6, "0")}`, "transparent", "bold 40px Courier New"), transparent: true, side: THREE.DoubleSide }));
        letterMesh.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
        letterMesh.lookAt(Math.cos(angle) * (radius + 1), Math.sin(angle) * (radius + 1), 0);
        group.add(letterMesh);
      }
      return group;
    }
    const rotor1 = createRotor(1.3, 0x00ff88); rotor1.position.set(-4.5, 1, -3); rotor1.rotation.y = 0.4; scene.add(rotor1);
    const rotor2 = createRotor(1.1, 0xffb700); rotor2.position.set(4.5, 0.5, -4); rotor2.rotation.y = -0.4; scene.add(rotor2);
    const rotor3 = createRotor(0.9, 0x00d4ff); rotor3.position.set(0, -2.5, -5); rotor3.rotation.x = 0.3; scene.add(rotor3);

    // Playfair grid
    const playfairGroup = new THREE.Group();
    const gridLetters = "KEYWORDABCFGHILMNPQRSTUVXZ";
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 5; c++) {
        const cell = new THREE.Mesh(new THREE.PlaneGeometry(0.55, 0.55), new THREE.MeshBasicMaterial({ map: makeTextTexture(gridLetters[r * 5 + c], 64, "#00d4ff", "rgba(0,212,255,0.05)", "bold 36px Courier New"), transparent: true, opacity: 0.7, side: THREE.DoubleSide }));
        cell.position.set(c * 0.6 - 1.2, r * -0.6 + 1.2, 0);
        const cb = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.PlaneGeometry(0.55, 0.55)), new THREE.LineBasicMaterial({ color: 0x00d4ff, transparent: true, opacity: 0.3 }));
        cb.position.copy(cell.position);
        playfairGroup.add(cb); playfairGroup.add(cell);
      }
    }
    playfairGroup.position.set(-7, 1, -6); playfairGroup.rotation.y = 0.6; scene.add(playfairGroup);

    // Hill matrix panel
    const matCanvas = document.createElement("canvas");
    matCanvas.width = 256; matCanvas.height = 256;
    const mCtx = matCanvas.getContext("2d")!;
    mCtx.fillStyle = "rgba(0,0,0,0)"; mCtx.fillRect(0, 0, 256, 256);
    mCtx.fillStyle = "#ffb700"; mCtx.font = "bold 28px Courier New"; mCtx.textAlign = "center";
    mCtx.fillText("C = K\u00B7P", 128, 70); mCtx.fillText("mod 26", 128, 110);
    mCtx.font = "20px Courier New"; mCtx.fillStyle = "#6b6b9a";
    mCtx.fillText("[ 6  24 ]", 128, 160); mCtx.fillText("[ 1  13 ]", 128, 195);
    const matPlane = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(matCanvas), transparent: true, opacity: 0.8 }));
    matPlane.position.set(7, 1, -5); matPlane.rotation.y = -0.5; scene.add(matPlane);

    // Matrix rain particles
    const RAIN_COUNT = 800;
    const rainPositions = new Float32Array(RAIN_COUNT * 3);
    const rainVelocities = new Float32Array(RAIN_COUNT);
    const rainColors = new Float32Array(RAIN_COUNT * 3);
    for (let i = 0; i < RAIN_COUNT; i++) {
      rainPositions[i * 3] = (Math.random() - 0.5) * 40;
      rainPositions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      rainPositions[i * 3 + 2] = -8 - Math.random() * 10;
      rainVelocities[i] = 0.02 + Math.random() * 0.05;
      const isAmber = Math.random() > 0.8;
      rainColors[i * 3] = isAmber ? 1.0 : 0.0;
      rainColors[i * 3 + 1] = isAmber ? 0.72 : 1.0;
      rainColors[i * 3 + 2] = isAmber ? 0.0 : 0.53;
    }
    const rainGeo = new THREE.BufferGeometry();
    rainGeo.setAttribute("position", new THREE.BufferAttribute(rainPositions, 3));
    rainGeo.setAttribute("color", new THREE.BufferAttribute(rainColors, 3));
    const rain = new THREE.Points(rainGeo, new THREE.PointsMaterial({ size: 0.12, vertexColors: true, transparent: true, opacity: 0.6 }));
    scene.add(rain);

    // Floating particles
    const PARTICLE_COUNT = 200;
    const particlePos = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particlePos[i * 3] = (Math.random() - 0.5) * 20;
      particlePos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      particlePos[i * 3 + 2] = (Math.random() - 0.5) * 8 - 2;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePos, 3));
    const particles = new THREE.Points(particleGeo, new THREE.PointsMaterial({ size: 0.05, color: 0x00ff88, transparent: true, opacity: 0.4 }));
    scene.add(particles);

    // Grid floor
    const gridHelper = new THREE.GridHelper(40, 40, 0x00ff88, 0x1a1a2e);
    (gridHelper.material as THREE.Material & { transparent: boolean; opacity: number }).transparent = true;
    (gridHelper.material as THREE.Material & { transparent: boolean; opacity: number }).opacity = 0.15;
    gridHelper.position.y = -4;
    scene.add(gridHelper);

    // Animation loop
    let frameId: number;
    const clock = new THREE.Clock();
    function animate() {
      frameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      rotor1.rotation.z = elapsed * 0.3;
      rotor2.rotation.z = -elapsed * 0.25;
      rotor3.rotation.z = elapsed * 0.2;
      playfairGroup.position.y = 1 + Math.sin(elapsed * 0.5) * 0.2;
      playfairGroup.rotation.y = 0.6 + Math.sin(elapsed * 0.3) * 0.05;
      matPlane.position.y = 1 + Math.sin(elapsed * 0.4 + 1) * 0.15;
      const rainPos = rainGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < RAIN_COUNT; i++) {
        rainPos[i * 3 + 1] -= rainVelocities[i];
        if (rainPos[i * 3 + 1] < -12) { rainPos[i * 3 + 1] = 12; rainPos[i * 3] = (Math.random() - 0.5) * 40; }
      }
      rainGeo.attributes.position.needsUpdate = true;
      greenLight.intensity = 60 + Math.sin(elapsed * 2) * 20;
      camera.position.x = Math.sin(elapsed * 0.15) * 0.5;
      camera.position.y = 1.5 + Math.sin(elapsed * 0.1) * 0.3;
      camera.lookAt(0, 0.3, 0);
      borderMat.opacity = 0.5 + Math.sin(elapsed * 3) * 0.3;
      particles.rotation.y = elapsed * 0.03;
      renderer.render(scene, camera);
    }
    animate();

    const handleResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []); // ← Three.js runs only once on mount

  function handleEnter() {
    setExiting(true);
    setTimeout(onEnter, 800);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{ opacity: exiting ? 0 : 1, transition: "opacity 0.8s ease", background: "#0a0a0f" }}
    >
      {/* Three.js canvas */}
      <div ref={mountRef} className="absolute inset-0" />

      {/* CRT scanline overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px)", zIndex: 2 }} />

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.8) 100%)", zIndex: 3 }} />

      {/* Boot terminal */}
      {booting && (
        <div className="absolute bottom-8 left-8 right-8 md:right-auto md:w-[480px] font-mono text-xs leading-6" style={{ zIndex: 10 }}>
          <div className="rounded border p-4 space-y-0.5" style={{ background: "rgba(0,0,0,0.85)", borderColor: "rgba(0,255,136,0.3)", backdropFilter: "blur(4px)" }}>
            {bootLines.map((line, i) => (
              <div
                key={`${locale}-${i}`}
                className={line.startsWith(">>") ? "text-terminal-green font-bold" : line === "" ? "h-3" : "text-terminal-dim"}
              >
                {line.startsWith(">>") ? (
                  <span>
                    <span style={{ color: "#00ff88" }}>{line}</span>
                    {i === bootLines.length - 1 && (
                      <span style={{ color: "#00ff88", animation: "blink 1s step-end infinite" }}> \u2588</span>
                    )}
                  </span>
                ) : line}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Enter button */}
      {showEnter && !booting && (
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-16" style={{ zIndex: 10 }}>
          <div className="text-center" style={{ animation: "fadeInUp 0.6s ease forwards" }}>
            <p className="text-xs mb-4 tracking-widest uppercase" style={{ color: "#3a3a5c" }}>
              {t("splash.allSystems")}
            </p>
            <button
              onClick={handleEnter}
              className="btn-terminal px-12 py-3 rounded text-sm font-bold tracking-widest uppercase"
              style={{ background: "rgba(0,255,136,0.08)", border: "1px solid #00ff88", color: "#00ff88", boxShadow: "0 0 20px rgba(0,255,136,0.2), inset 0 0 20px rgba(0,255,136,0.05)", transition: "all 0.3s" }}
              onMouseEnter={(e) => { const b = e.currentTarget; b.style.background = "rgba(0,255,136,0.18)"; b.style.boxShadow = "0 0 40px rgba(0,255,136,0.4), inset 0 0 30px rgba(0,255,136,0.1)"; }}
              onMouseLeave={(e) => { const b = e.currentTarget; b.style.background = "rgba(0,255,136,0.08)"; b.style.boxShadow = "0 0 20px rgba(0,255,136,0.2), inset 0 0 20px rgba(0,255,136,0.05)"; }}
            >
              {t("splash.enter")}
            </button>
            <div className="mt-3 text-xs" style={{ color: "#3a3a5c" }}>
              {t("splash.subtitle")}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
      `}</style>
    </div>
  );
}

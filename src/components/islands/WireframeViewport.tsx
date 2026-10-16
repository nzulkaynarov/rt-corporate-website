import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

interface WireframeViewportProps {
  modelType: 'mechanism' | 'container' | 'network' | 'hypercube';
  rotationDeg: number;
  onRotationChange: (deg: number) => void;
  pitchDeg: number;
  onPitchChange?: (pitch: number) => void;
  onSelectHotspot?: (id: string) => void;
  selectedHotspotId?: string;
  isExploded?: boolean;
}

export const WireframeViewport: React.FC<WireframeViewportProps> = ({
  modelType,
  rotationDeg,
  onRotationChange,
  pitchDeg,
  onPitchChange,
  isExploded = false,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const groupRef = useRef<THREE.Group | null>(null);
  const isDraggingRef = useRef<boolean>(false);
  const isHoveredRef = useRef<boolean>(false);
  const isAutoSpinRef = useRef<boolean>(false);
  const prevXRef = useRef<number>(0);
  const currentRotRef = useRef<number>(rotationDeg);
  const currentPitchRef = useRef<number>(pitchDeg);
  const onRotationChangeRef = useRef(onRotationChange);
  const [modelSource, setModelSource] = useState<'procedural' | 'glb'>('procedural');
  const [displayMode, setDisplayMode] = useState<'CAD' | 'BLUEPRINT' | 'EXPLODED'>(isExploded ? 'EXPLODED' : 'CAD');

  useEffect(() => {
    onRotationChangeRef.current = onRotationChange;
  }, [onRotationChange]);

  useEffect(() => {
    currentRotRef.current = rotationDeg;
    currentPitchRef.current = pitchDeg;
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.degToRad(rotationDeg);
      groupRef.current.rotation.x = THREE.MathUtils.degToRad(pitchDeg);
    }
  }, [rotationDeg, pitchDeg]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 560;
    const height = container.clientHeight || 420;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, width / height, 0.1, 1000);
    camera.position.set(0, 2.8, 8.4);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(5, 8, 6);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xd4d8dc, 0.6);
    fillLight.position.set(-6, 3, -4);
    scene.add(fillLight);

    const mainGroup = new THREE.Group();
    groupRef.current = mainGroup;
    scene.add(mainGroup);

    // High-Precision Materials
    const inkLineMaterial = new THREE.LineBasicMaterial({
      color: 0x0a0a0a,
      linewidth: 2,
    });
    const subtleLineMaterial = new THREE.LineBasicMaterial({
      color: 0x4a5056,
      transparent: true,
      opacity: 0.35,
    });
    const dashedLineMaterial = new THREE.LineDashedMaterial({
      color: 0x0a0a0a,
      dashSize: 0.15,
      gapSize: 0.08,
    });

    const titaniumSurface = new THREE.MeshStandardMaterial({
      color: 0xd0d5da,
      roughness: 0.35,
      metalness: 0.25,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
    });

    const blueprintSurface = new THREE.MeshBasicMaterial({
      color: 0xc8cdd2,
      transparent: true,
      opacity: 0.38,
      side: THREE.DoubleSide,
    });

    const addAssemblyPart = (
      geom: THREE.BufferGeometry,
      parent: THREE.Object3D,
      pos: [number, number, number] = [0, 0, 0],
      rot: [number, number, number] = [0, 0, 0],
      isTechnical = true
    ) => {
      const g = new THREE.Group();
      g.position.set(...pos);
      g.rotation.set(...rot);

      const activeMaterial = displayMode === 'BLUEPRINT' ? blueprintSurface : titaniumSurface;
      const mesh = new THREE.Mesh(geom, activeMaterial);
      g.add(mesh);

      if (isTechnical) {
        const edges = new THREE.EdgesGeometry(geom, 22);
        const wire = new THREE.LineSegments(edges, inkLineMaterial);
        g.add(wire);
      }
      parent.add(g);
      return g;
    };

    // Check if real custom .glb model exists in public/models/
    const base = (typeof window !== 'undefined' && window.location.pathname.startsWith('/rt-corporate-website'))
      ? '/rt-corporate-website'
      : (import.meta.env.BASE_URL?.replace(/\/$/, '') || '');
    const glbPath = `${base}/models/${modelType}.glb`;

    fetch(glbPath, { method: 'HEAD' })
      .then((res) => {
        if (res.ok && res.status === 200) {
          const loader = new GLTFLoader();
          loader.load(glbPath, (gltf) => {
            setModelSource('glb');
            // Clean up mainGroup children
            while (mainGroup.children.length > 0) {
              mainGroup.remove(mainGroup.children[0]);
            }
            const glbScene = gltf.scene;

            // Fit to normalized bounds
            const box = new THREE.Box3().setFromObject(glbScene);
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = 3.2 / (maxDim || 1);
            glbScene.scale.set(scale, scale, scale);

            // Center
            const center = box.getCenter(new THREE.Vector3());
            glbScene.position.sub(center.multiplyScalar(scale));

            // Traverse and apply technical CAD wireframe edges
            glbScene.traverse((child) => {
              if ((child as THREE.Mesh).isMesh) {
                const m = child as THREE.Mesh;
                m.material = displayMode === 'BLUEPRINT' ? blueprintSurface : titaniumSurface;
                const edges = new THREE.EdgesGeometry(m.geometry, 24);
                const wire = new THREE.LineSegments(edges, inkLineMaterial);
                m.add(wire);
              }
            });

            mainGroup.add(glbScene);
          });
        } else {
          buildHighPrecisionProceduralModel();
        }
      })
      .catch(() => {
        buildHighPrecisionProceduralModel();
      });

    // High-Precision Procedural Assembly (Default Fallback with authentic CAD details)
    const buildHighPrecisionProceduralModel = () => {
      setModelSource('procedural');

      if (modelType === 'mechanism') {
        // High-Precision Bogie 18-100 (ГОСТ 9246-2013)
        const explodeY = displayMode === 'EXPLODED' ? 0.7 : 0;
        const explodeZ = displayMode === 'EXPLODED' ? 0.8 : 0;

        // Two Wheelsets (Колесные пары РУ1Ш-957-Г)
        const zOffsets = [-1.45 - explodeZ, 1.45 + explodeZ];
        zOffsets.forEach((zOff) => {
          // Stepped Axle shaft
          const centerAxle = new THREE.CylinderGeometry(0.16, 0.16, 2.2, 24);
          addAssemblyPart(centerAxle, mainGroup, [0, 0, zOff], [0, 0, Math.PI / 2]);

          [-1.38, 1.38].forEach((xOff) => {
            // Conical wheel tread disc
            const wheelTread = new THREE.CylinderGeometry(0.82, 0.86, 0.18, 32);
            addAssemblyPart(wheelTread, mainGroup, [xOff, 0, zOff], [0, 0, Math.PI / 2]);

            // Flange (гребень колеса)
            const flange = new THREE.CylinderGeometry(0.92, 0.92, 0.05, 32);
            const flangeX = xOff < 0 ? xOff + 0.1 : xOff - 0.1;
            addAssemblyPart(flange, mainGroup, [flangeX, 0, zOff], [0, 0, Math.PI / 2]);

            // Axle box housing (Букса)
            const axleBox = new THREE.BoxGeometry(0.38, 0.44, 0.46);
            addAssemblyPart(axleBox, mainGroup, [xOff, 0.02, zOff]);
          });
        });

        // Cast Steel Side Frames (Боковые рамы 18-100)
        [-1.6, 1.6].forEach((xSide) => {
          const topChord = new THREE.BoxGeometry(0.24, 0.32, 3.5);
          addAssemblyPart(topChord, mainGroup, [xSide, 0.22, 0]);

          const jawColumns = new THREE.BoxGeometry(0.22, 0.5, 0.35);
          addAssemblyPart(jawColumns, mainGroup, [xSide, -0.05, -1.1]);
          addAssemblyPart(jawColumns, mainGroup, [xSide, -0.05, 1.1]);

          // Spring nest opening (Рессорный проем)
          const bottomChord = new THREE.BoxGeometry(0.26, 0.24, 2.4);
          addAssemblyPart(bottomChord, mainGroup, [xSide, -0.22, 0]);

          // Springs (Двухрядные цилиндрические пружины)
          [-0.22, 0.22].forEach((zSpring) => {
            const spring = new THREE.CylinderGeometry(0.12, 0.12, 0.34, 16);
            addAssemblyPart(spring, mainGroup, [xSide, -0.05, zSpring]);
          });
        });

        // Bolster Beam (Надрессорная балка)
        const bolster = new THREE.BoxGeometry(3.45, 0.38, 0.65);
        addAssemblyPart(bolster, mainGroup, [0, 0.28 + explodeY, 0]);

        // Center Pivot Plate (Подпятник)
        const centerPivot = new THREE.CylinderGeometry(0.42, 0.46, 0.22, 24);
        addAssemblyPart(centerPivot, mainGroup, [0, 0.54 + explodeY, 0]);

        // Brake rigging beams (Тормозная рычажная передача)
        [-0.85, 0.85].forEach((zBrake) => {
          const brakeBeam = new THREE.BoxGeometry(2.9, 0.14, 0.14);
          addAssemblyPart(brakeBeam, mainGroup, [0, -0.08, zBrake]);

          // Composite brake shoes (Тормозные колодки 25610-Н)
          [-1.38, 1.38].forEach((xBrake) => {
            const shoe = new THREE.BoxGeometry(0.14, 0.28, 0.18);
            addAssemblyPart(shoe, mainGroup, [xBrake, -0.04, zBrake]);
          });
        });

        // Dimensional CAD Callouts
        const gaugeLineGeom = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(-1.38, -0.65, 0),
          new THREE.Vector3(1.38, -0.65, 0),
        ]);
        const gaugeLine = new THREE.Line(gaugeLineGeom, dashedLineMaterial);
        gaugeLine.computeLineDistances();
        mainGroup.add(gaugeLine);
      } else if (modelType === 'container') {
        // High-Precision 40ft Intermodal Container (ISO 668)
        const outerFrame = new THREE.BoxGeometry(3.6, 1.85, 1.95);
        addAssemblyPart(outerFrame, mainGroup, [0, 0.1, 0]);

        // Corrugated Side Panels (Ребра жесткости)
        for (let i = -1.55; i <= 1.55; i += 0.38) {
          const rib = new THREE.BoxGeometry(0.06, 1.86, 1.96);
          addAssemblyPart(rib, mainGroup, [i, 0.1, 0], [0, 0, 0], false);
        }

        // Corner Castings (Угловые фитинги ISO)
        const corners = [-1.75, 1.75];
        const cornerY = [-0.78, 0.98];
        const cornerZ = [-0.94, 0.94];
        corners.forEach((cx) =>
          cornerY.forEach((cy) =>
            cornerZ.forEach((cz) => {
              const casting = new THREE.BoxGeometry(0.2, 0.2, 0.2);
              addAssemblyPart(casting, mainGroup, [cx, cy, cz]);
            })
          )
        );

        // Modular Cargo Pallet Units
        [-0.9, 0, 0.9].forEach((xPos) => {
          const cargo = new THREE.BoxGeometry(0.72, 0.74, 1.45);
          addAssemblyPart(cargo, mainGroup, [xPos, -0.32, 0]);
        });
      } else if (modelType === 'network') {
        // Neural Architecture & B2B Server Topography
        const coreOcta = new THREE.OctahedronGeometry(1.05, 0);
        addAssemblyPart(coreOcta, mainGroup, [0, 0.1, 0]);

        const outerCage = new THREE.BoxGeometry(2.4, 2.4, 2.4);
        const edges = new THREE.EdgesGeometry(outerCage);
        const cage = new THREE.LineSegments(edges, subtleLineMaterial);
        cage.position.set(0, 0.1, 0);
        mainGroup.add(cage);

        // Satellite Nodes
        const c = [-1.2, 1.2];
        c.forEach((cx) =>
          c.forEach((cy) =>
            c.forEach((cz) => {
              const node = new THREE.BoxGeometry(0.28, 0.28, 0.28);
              addAssemblyPart(node, mainGroup, [cx, cy + 0.1, cz]);

              // Connecting vector line to core
              const connGeom = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(0, 0.1, 0),
                new THREE.Vector3(cx, cy + 0.1, cz),
              ]);
              const conn = new THREE.Line(connGeom, subtleLineMaterial);
              mainGroup.add(conn);
            })
          )
        );
      } else {
        // Architectural Hypercube & Kinetic Tesseract
        const outer = new THREE.BoxGeometry(2.25, 2.25, 2.25);
        addAssemblyPart(outer, mainGroup, [0, 0.12, 0]);

        const inner = new THREE.BoxGeometry(1.2, 1.2, 1.2);
        addAssemblyPart(inner, mainGroup, [0, 0.12, 0], [Math.PI / 4, Math.PI / 4, 0]);

        // Rotating gimbal rings
        const ring1 = new THREE.TorusGeometry(1.7, 0.02, 16, 64);
        addAssemblyPart(ring1, mainGroup, [0, 0.12, 0], [Math.PI / 2, 0, 0]);
      }
    };

    // Base Rotating Turntable Ring
    const turntableCurve = new THREE.EllipseCurve(0, 0, 2.55, 2.55, 0, Math.PI * 2, false, 0);
    const turntablePoints = turntableCurve.getPoints(64);
    const turntableGeom = new THREE.BufferGeometry().setFromPoints(turntablePoints);
    const turntableLine = new THREE.Line(turntableGeom, subtleLineMaterial);
    turntableLine.rotation.x = Math.PI / 2;
    turntableLine.position.y = -1.35;
    scene.add(turntableLine);

    // Active Azimuth Calibration Arc
    const arcCurve = new THREE.EllipseCurve(0, 0, 2.55, 2.55, Math.PI * 0.35, Math.PI * 0.65, false, 0);
    const arcGeom = new THREE.BufferGeometry().setFromPoints(arcCurve.getPoints(32));
    const arcLine = new THREE.Line(arcGeom, inkLineMaterial);
    arcLine.rotation.x = Math.PI / 2;
    arcLine.position.y = -1.34;
    scene.add(arcLine);

    let reqId: number;
    let lastTime = performance.now();

    const animate = (time: number) => {
      reqId = requestAnimationFrame(animate);
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      if ((isAutoSpinRef.current || (!isHoveredRef.current && !isDraggingRef.current)) && groupRef.current) {
        const spinSpeed = isAutoSpinRef.current ? 16 : 2.5; // deg/s
        currentRotRef.current = (currentRotRef.current + spinSpeed * dt) % 360;
        onRotationChangeRef.current(Math.round(currentRotRef.current));
      }

      if (groupRef.current) {
        groupRef.current.rotation.y = THREE.MathUtils.degToRad(currentRotRef.current);
        groupRef.current.rotation.x = THREE.MathUtils.degToRad(currentPitchRef.current);
      }

      renderer.render(scene, camera);
    };
    reqId = requestAnimationFrame(animate);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 560;
      const h = container.clientHeight || 420;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [modelType, displayMode]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    prevXRef.current = e.clientX;
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    const delta = e.clientX - prevXRef.current;
    prevXRef.current = e.clientX;
    const nextDeg = ((currentRotRef.current + Math.round(delta * 0.75)) % 360 + 360) % 360;
    currentRotRef.current = nextDeg;
    onRotationChangeRef.current(nextDeg);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = false;
    try {
      (e.currentTarget as HTMLDivElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignore
    }
  };

  const setViewProjection = (preset: 'ISO' | 'TOP' | 'FRONT' | 'SPIN') => {
    if (preset === 'ISO') {
      isAutoSpinRef.current = false;
      currentRotRef.current = 38;
      currentPitchRef.current = 18;
      onRotationChange(38);
      onPitchChange?.(18);
    } else if (preset === 'TOP') {
      isAutoSpinRef.current = false;
      currentRotRef.current = 0;
      currentPitchRef.current = 88;
      onRotationChange(0);
      onPitchChange?.(88);
    } else if (preset === 'FRONT') {
      isAutoSpinRef.current = false;
      currentRotRef.current = 0;
      currentPitchRef.current = 0;
      onRotationChange(0);
      onPitchChange?.(0);
    } else if (preset === 'SPIN') {
      isAutoSpinRef.current = !isAutoSpinRef.current;
    }
  };

  return (
    <div
      className="w-full relative flex flex-col items-center select-none"
      onMouseEnter={() => {
        isHoveredRef.current = true;
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
      }}
    >
      {/* Top Toolbar: Render Mode & Projections */}
      <div className="absolute top-2 left-2 z-20 flex flex-wrap items-center gap-1.5 font-mono text-[10px]">
        {/* Visual Style: Solid CAD vs Blueprint vs Exploded */}
        <div className="flex border border-[#0A0A0A] bg-[#D4D8DC] p-0.5">
          <button
            onClick={() => setDisplayMode('CAD')}
            className={`px-1.5 py-0.5 uppercase transition-colors ${
              displayMode === 'CAD' ? 'bg-[#0A0A0A] text-white font-bold' : 'hover:bg-[#0A0A0A]/10 text-[#0A0A0A]'
            }`}
          >
            3D CAD
          </button>
          <button
            onClick={() => setDisplayMode('BLUEPRINT')}
            className={`px-1.5 py-0.5 uppercase transition-colors ${
              displayMode === 'BLUEPRINT' ? 'bg-[#0A0A0A] text-white font-bold' : 'hover:bg-[#0A0A0A]/10 text-[#0A0A0A]'
            }`}
          >
            Чертеж
          </button>
          {modelType === 'mechanism' && (
            <button
              onClick={() => setDisplayMode(displayMode === 'EXPLODED' ? 'CAD' : 'EXPLODED')}
              className={`px-1.5 py-0.5 uppercase transition-colors ${
                displayMode === 'EXPLODED' ? 'bg-[#0A0A0A] text-white font-bold' : 'hover:bg-[#0A0A0A]/10 text-[#0A0A0A]'
              }`}
            >
              Взрыв-схема
            </button>
          )}
        </div>

        {/* View Projections */}
        <div className="flex border border-[#0A0A0A] bg-[#D4D8DC] p-0.5">
          <button
            onClick={() => setViewProjection('ISO')}
            className="px-1.5 py-0.5 hover:bg-[#0A0A0A] hover:text-white transition-colors"
          >
            ISO
          </button>
          <button
            onClick={() => setViewProjection('TOP')}
            className="px-1.5 py-0.5 hover:bg-[#0A0A0A] hover:text-white transition-colors"
          >
            TOP
          </button>
          <button
            onClick={() => setViewProjection('FRONT')}
            className="px-1.5 py-0.5 hover:bg-[#0A0A0A] hover:text-white transition-colors"
          >
            FRONT
          </button>
        </div>

        <button
          onClick={() => setViewProjection('SPIN')}
          className={`border border-[#0A0A0A] px-2 py-0.5 transition-colors ${
            isAutoSpinRef.current ? 'bg-[#0A0A0A] text-white font-bold' : 'bg-[#D4D8DC] hover:bg-[#0A0A0A] hover:text-white'
          }`}
        >
          {isAutoSpinRef.current ? 'SPIN: ON' : 'SPIN: OFF'}
        </button>
      </div>

      {/* Model source badge (Shows if ready .glb is active or procedural CAD) */}
      <div className="absolute top-2 right-2 z-20 font-mono text-[9px] text-[#4A5056] border border-[#0A0A0A]/30 px-1.5 py-0.5 bg-white/70">
        {modelSource === 'glb' ? 'SOURCE: CUSTOM .GLB MODEL' : 'ENGINE: PROCEDURAL CAD ASSEMBLY'}
      </div>

      {/* Three.js Canvas */}
      <div
        ref={mountRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="w-full h-[360px] md:h-[400px] cursor-grab active:cursor-grabbing relative touch-none"
        title="Зажмите и перемещайте для 3D-вращения чертежа"
      />
    </div>
  );
};

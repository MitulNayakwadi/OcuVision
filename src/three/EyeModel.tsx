import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { pointer, useMousePointer } from '@/hooks/useMousePointer';

const MODEL_URL = '/eyeball.glb';

/** Warm the cache the moment this chunk is parsed, before React mounts anything. */
useGLTF.preload(MODEL_URL);

/**
 * The model's iris, pupil and cornea all face local −Z and the optic nerve exits
 * +Z, so a base yaw near π turns the eye toward a camera sitting at +Z. The 0.78
 * offset is what gives the three-quarter view rather than a dead-on stare.
 */
const BASE_ROT = { x: 0.1, y: Math.PI - 0.78, z: 0.04 };

/** How far the pointer can swing the eye, in radians. */
const YAW_RANGE = 0.42;
const PITCH_RANGE = 0.26;

/** Per-frame lerp weight at 60fps. Elastic follow, never a snap. */
const FOLLOW = 0.06;
/** Slower still, so the idle drift eases in rather than switching over. */
const BLEND = 0.02;

/** Pointer stillness that counts as idle, in milliseconds. */
const IDLE_AFTER_MS = 2400;

/**
 * Frame-rate-normalised lerp weight. `alpha` is expressed per 60fps frame, so a
 * 120Hz display takes two half-sized steps and lands in the same place.
 */
function step(alpha: number, dt: number) {
  return 1 - (1 - alpha) ** (dt * 60);
}

/**
 * The finished eyeball asset, mouse-reactive.
 *
 * Rotation is driven from the module-level pointer store rather than R3F's
 * `state.pointer`, because the canvas is `pointer-events: none` — the copy and
 * buttons underneath have to stay clickable, which means the canvas never receives
 * the pointer events `state.pointer` is built from.
 */
export function EyeModel({ simplified = false }: { simplified?: boolean }) {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF(MODEL_URL);
  useMousePointer();

  // One clone per mount: useGLTF caches the scene graph, so mutating materials on
  // the shared instance would leak across mounts and double-apply on remount.
  const model = useMemo(() => scene.clone(true), [scene]);

  /**
   * GLTFLoader leaves `envMapIntensity` at 1, which reads as flat grey against a
   * Lightformer studio — the chrome needs it pushed up to catch the strips. The
   * cornea's transmission is the expensive part of this scene (it wants its own
   * render target every frame), so on low-power devices it becomes plain alpha
   * blending instead.
   */
  useEffect(() => {
    const disposables: THREE.Material[] = [];

    model.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      child.castShadow = false;
      child.receiveShadow = false;

      const materials = Array.isArray(child.material) ? child.material : [child.material];

      materials.forEach((base) => {
        if (!(base instanceof THREE.MeshStandardMaterial)) return;

        // Cloned so the tweaks below stay local to this mount.
        const material = base.clone();
        disposables.push(material);
        material.envMapIntensity = material.metalness > 0.5 ? 2.1 : 1.25;

        if (material instanceof THREE.MeshPhysicalMaterial && material.transmission > 0) {
          if (simplified) {
            material.transmission = 0;
            material.transparent = true;
            material.opacity = 0.3;
            material.roughness = 0.08;
          } else {
            material.thickness = 0.32;
            material.envMapIntensity = 1.6;
          }
        }

        if (Array.isArray(child.material)) {
          const index = child.material.indexOf(base);
          child.material[index] = material;
        } else {
          child.material = material;
        }
      });
    });

    return () => disposables.forEach((material) => material.dispose());
  }, [model, simplified]);

  // Idle blend weight: 0 while the pointer is live, 1 once it has been still.
  const idle = useRef(1);

  useFrame((_, delta) => {
    const node = group.current;
    if (!node) return;

    // Clamped so a dropped frame or a backgrounded tab cannot fling the model.
    const dt = Math.min(delta, 1 / 30);
    const t = performance.now();

    const isIdle = !pointer.active || t - pointer.lastMove > IDLE_AFTER_MS ? 1 : 0;
    idle.current = THREE.MathUtils.lerp(idle.current, isIdle, step(BLEND, dt));
    const w = idle.current;

    // Autonomous drift and pointer follow are crossfaded rather than switched, so
    // the eye is never static and never jumps when the mouse comes back.
    const seconds = t / 1000;
    const targetY =
      BASE_ROT.y + Math.sin(seconds * 0.24) * 0.3 * w + pointer.x * YAW_RANGE * (1 - w);
    const targetX =
      BASE_ROT.x + Math.sin(seconds * 0.17) * 0.09 * w - pointer.y * PITCH_RANGE * (1 - w);
    const targetZ = BASE_ROT.z + Math.sin(seconds * 0.11) * 0.03;

    const k = step(FOLLOW, dt);
    node.rotation.y = THREE.MathUtils.lerp(node.rotation.y, targetY, k);
    node.rotation.x = THREE.MathUtils.lerp(node.rotation.x, targetX, k);
    node.rotation.z = THREE.MathUtils.lerp(node.rotation.z, targetZ, k);

    // A few hundredths of a unit of positional lean, which is what stops the
    // rotation reading as a turntable.
    node.position.x = THREE.MathUtils.lerp(node.position.x, pointer.x * 0.1 * (1 - w), k);
    node.position.y = THREE.MathUtils.lerp(node.position.y, -0.24 + pointer.y * 0.07 * (1 - w), k);
  });

  return (
    <group ref={group} position={[0, -0.24, 0]} rotation={[BASE_ROT.x, BASE_ROT.y, BASE_ROT.z]}>
      <primitive object={model} />
    </group>
  );
}

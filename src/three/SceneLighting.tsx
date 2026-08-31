import { Environment, Lightformer } from '@react-three/drei';

/**
 * Studio environment built entirely from Lightformers rather than a preset HDR.
 * Two reasons: no network fetch on first paint, and the bright strips against
 * dark gaps are what give polished chrome its streaked specular signature —
 * a uniform HDR reads as dull pewter.
 *
 * `frames={1}` bakes the cubemap once; nothing in the environment moves.
 */
export function SceneLighting({ simplified = false }: { simplified?: boolean }) {
  return (
    <>
      <ambientLight intensity={0.55} />

      <Environment resolution={simplified ? 128 : 256} frames={1}>
        {/* Mid-grey base so reflections have somewhere dark to fall. */}
        <color attach="background" args={['#9a9a99']} />

        {/* Broad soft key from above — the main body highlight. */}
        <Lightformer
          intensity={3.2}
          color="#ffffff"
          position={[0, 5, -4]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[14, 8, 1]}
        />

        {/* Hard vertical strips: these become the travelling chrome streaks. */}
        <Lightformer
          intensity={5}
          color="#ffffff"
          position={[-4.5, 1.5, 2.5]}
          rotation={[0, Math.PI / 2, 0]}
          scale={[8, 0.55, 1]}
        />
        <Lightformer
          intensity={4}
          color="#f7f4f2"
          position={[-4.5, -1.2, 1.5]}
          rotation={[0, Math.PI / 2, 0]}
          scale={[8, 0.35, 1]}
        />
        <Lightformer
          intensity={3.4}
          color="#ffffff"
          position={[4.5, 2.2, 1.5]}
          rotation={[0, -Math.PI / 2, 0]}
          scale={[8, 0.45, 1]}
        />

        {/* Warm bounce, mirroring the page's bottom-right ambient bloom. */}
        <Lightformer
          form="circle"
          intensity={2.6}
          color="#FFD9CE"
          position={[3.5, -3, 2]}
          scale={5}
        />

        {/* Copper fill from below-left, ties the metal to the palette. */}
        <Lightformer
          form="circle"
          intensity={1.6}
          color="#E0B48C"
          position={[-3.5, -2.5, -1]}
          scale={4}
        />

        {/* Vitality-red rim, kept behind the subject so it reads as an edge. */}
        <Lightformer
          form="ring"
          intensity={2.2}
          color="#FF5A3C"
          position={[2.5, 1, -3.5]}
          scale={3}
        />
      </Environment>

      {/* Direct lights for the copper detail, which env light alone leaves flat. */}
      <pointLight position={[3, 2, 4]} intensity={18} color="#FFEDE7" distance={14} decay={2} />
      <pointLight position={[-3, -1, 3]} intensity={10} color="#FFC79E" distance={12} decay={2} />
      <directionalLight position={[-2, 3, 2]} intensity={0.8} color="#ffffff" />
    </>
  );
}

/**
 * CSS-and-SVG chrome eye, shown when WebGL is unavailable or the visitor asks
 * for reduced motion. This is a real fallback, not a grey box: the conic
 * gradient supplies the streaked specular, the radial overlays supply the
 * spherical falloff, and the SVG paths keep the copper vessel motif.
 */
export function CanvasFallback({ label = 'Chrome model of the human eye' }: { label?: string }) {
  return (
    <div className="grid h-full w-full place-items-center" role="img" aria-label={label}>
      <div className="relative aspect-square w-[min(78%,30rem)]">
        {/* Ambient contact shadow — a soft field, not a drop shadow. */}
        <div
          className="absolute -inset-[12%] rounded-full opacity-70"
          style={{
            background:
              'radial-gradient(circle at 58% 62%, rgba(255,150,120,0.22) 0%, rgba(255,199,158,0.1) 42%, transparent 72%)',
          }}
        />

        {/* Globe */}
        <div
          className="absolute inset-0 overflow-hidden rounded-full"
          style={{
            background:
              'conic-gradient(from 210deg at 50% 45%, #cfcfcf 0deg, #ffffff 26deg, #b9b9b9 58deg, #f2f2f2 92deg, #a9a9a9 128deg, #ededed 168deg, #c2c2c2 208deg, #fbfbfb 246deg, #b0b0b0 288deg, #e6e6e6 322deg, #cfcfcf 360deg)',
          }}
        >
          {/* Spherical shading: bright upper-left, terminator lower-right. */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                'radial-gradient(circle at 32% 26%, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.28) 24%, transparent 46%), radial-gradient(circle at 74% 82%, rgba(26,28,28,0.4) 0%, transparent 52%)',
            }}
          />

          {/* Warm bounce from the page bloom. */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                'radial-gradient(circle at 78% 74%, rgba(255,178,140,0.5) 0%, transparent 44%)',
              mixBlendMode: 'soft-light',
            }}
          />

          {/* Copper vessel tree, converging bottom-right like the 3D model. */}
          <svg
            viewBox="0 0 200 200"
            className="absolute inset-0 h-full w-full"
            aria-hidden="true"
          >
            <g
              fill="none"
              stroke="#B87A4B"
              strokeLinecap="round"
              opacity="0.82"
            >
              <path d="M150 148 C128 132 106 122 78 118" strokeWidth="2.6" />
              <path d="M78 118 C60 116 46 108 36 96" strokeWidth="1.7" />
              <path d="M106 122 C96 106 92 88 96 66" strokeWidth="1.9" />
              <path d="M96 66 C98 52 106 42 118 34" strokeWidth="1.2" />
              <path d="M96 66 C86 54 74 48 60 46" strokeWidth="1.1" />
              <path d="M150 148 C138 158 120 164 100 164" strokeWidth="2.2" />
              <path d="M100 164 C82 164 68 158 56 148" strokeWidth="1.4" />
              <path d="M150 148 C154 128 152 108 142 90" strokeWidth="2.1" />
              <path d="M142 90 C136 76 138 62 146 50" strokeWidth="1.3" />
              <path d="M128 132 C122 116 122 100 130 84" strokeWidth="1.2" />
              <path d="M78 118 C70 130 66 142 68 156" strokeWidth="1.1" />
            </g>
          </svg>

          {/* Iris assembly, offset left — the eye is looking off-camera. */}
          <div className="absolute left-[14%] top-1/2 h-[46%] w-[46%] -translate-y-1/2">
            {/* Limbal bezel */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  'conic-gradient(from 140deg, #8f5a33, #E6C09A, #B87A4B, #FFE6CE, #96603a, #D3A177, #8f5a33)',
              }}
            />
            {/* Inner bezel */}
            <div
              className="absolute inset-[9%] rounded-full"
              style={{
                background:
                  'conic-gradient(from 300deg, #D3A177, #fff3e6, #B87A4B, #E6C09A, #D3A177)',
              }}
            />
            {/* Stroma */}
            <div
              className="absolute inset-[16%] overflow-hidden rounded-full bg-iris-fibre"
              style={{
                boxShadow: 'inset 0 0 18px rgba(20,12,6,0.75)',
              }}
            >
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    'radial-gradient(circle at 50% 50%, rgba(12,8,5,0.94) 0%, rgba(70,40,22,0.42) 30%, rgba(255,226,198,0.16) 70%, rgba(120,70,40,0.5) 100%)',
                }}
              />
            </div>
            {/* Pupil */}
            <div
              className="absolute left-1/2 top-1/2 h-[30%] w-[30%] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                background:
                  'radial-gradient(circle at 36% 30%, #4a4a4e 0%, #121214 40%, #07070880 100%)',
              }}
            />
            {/* Corneal specular */}
            <div className="absolute left-[24%] top-[18%] h-[16%] w-[22%] -rotate-[18deg] rounded-full bg-white/85 blur-[1px]" />
          </div>

          {/* Corneal dome glaze over the iris side. */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                'radial-gradient(ellipse 34% 40% at 26% 50%, rgba(255,255,255,0.34) 0%, rgba(255,255,255,0.06) 58%, transparent 76%)',
            }}
          />

          {/* Rim light — the vitality-red edge from the scene's ring lightformer. */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              boxShadow:
                'inset -6px -8px 22px rgba(255,90,60,0.28), inset 8px 10px 26px rgba(255,255,255,0.55)',
            }}
          />
        </div>

        {/* Optic nerve stub, bottom-right. */}
        <div
          className="absolute bottom-[6%] right-[2%] h-[22%] w-[13%] rotate-[38deg] rounded-b-full rounded-t-[40%]"
          style={{
            background:
              'linear-gradient(100deg, #a8a8a8 0%, #f4f4f4 34%, #cfcfcf 62%, #9d9d9d 100%)',
          }}
        />

        {/* Orbital instrument ring. */}
        <div
          className="absolute -inset-[9%] rounded-full border border-[rgba(26,28,28,0.14)]"
          style={{ transform: 'rotate3d(1, 0.3, 0, 68deg)' }}
        />
      </div>
    </div>
  );
}

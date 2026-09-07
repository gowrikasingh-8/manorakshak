import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTheme } from "../ThemeContext";

function Particles() {
  const pointsRef = useRef();
  const count = 300;
  const { theme } = useTheme();
  const particleColor = theme === "light" ? "#0d9488" : "#2dd4bf";

  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
  }

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      pointsRef.current.rotation.x = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color={particleColor} transparent opacity={0.6} />
    </points>
  );
}

export default function ParticleField() {
  return (
    <Canvas camera={{ position: [0, 0, 8], fov: 60 }} style={{ pointerEvents: "none" }}>
      <Particles />
    </Canvas>
  );
}
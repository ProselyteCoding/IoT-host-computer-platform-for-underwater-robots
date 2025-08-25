import { Canvas } from "@react-three/fiber";
import { useEffect, useState } from "react";
import { Sphere, Text, Line } from "@react-three/drei";
import * as THREE from "three";

export default function GamePadViewer() {
  const [buttonStates, setButtonStates] = useState<boolean[]>(new Array(16).fill(false));
  const [leftStick, setLeftStick] = useState<[number, number]>([0, 0]);
  const [rightStick, setRightStick] = useState<[number, number]>([0, 0]);

  useEffect(() => {
    const updateGamepadState = () => {
      const gamepads = navigator.getGamepads();
      if (gamepads[0]) {
        const gp = gamepads[0];

        // 读取手柄按钮状态
        setButtonStates(gp.buttons.map((button) => button.pressed));

        // 读取摇杆数据
        setLeftStick([gp.axes[0], gp.axes[1]]);
        setRightStick([gp.axes[2], gp.axes[3]]);
      }
      requestAnimationFrame(updateGamepadState);
    };

    requestAnimationFrame(updateGamepadState);
  }, []);

  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 2, 2]} />

      {/* 手柄按钮 */}
      <Button position={[1, -0.5, 0]} label="A" active={buttonStates[0]} />
      <Button position={[1.5, 0, 0]} label="B" active={buttonStates[1]} />
      <Button position={[0.5, 0, 0]} label="X" active={buttonStates[2]} />
      <Button position={[1, 0.5, 0]} label="Y" active={buttonStates[3]} />

      {/* LB / RB  */}
      <Button position={[-2, 1.5, 0]} label="LB" active={buttonStates[4]} />
      <Button position={[2, 1.5, 0]} label="RB" active={buttonStates[5]} />

      {/* LT / RT  */}
      <Button position={[-2, 2, 0]} label="LT" active={buttonStates[6]} />
      <Button position={[2, 2, 0]} label="RT" active={buttonStates[7]} />

      {/* SELECT / START */}
      <Button position={[-0.5, 1, 0]} label="Select" active={buttonStates[8]} />
      <Button position={[0.5, 1, 0]} label="Start" active={buttonStates[9]} />

      {/* 左 / 右摇杆按键 */}
      <Button position={[-1, -1.5, 0]} label="L3" active={buttonStates[10]} />
      <Button position={[1, -1.5, 0]} label="R3" active={buttonStates[11]} />

      {/* 方向键 */}
      <Button position={[-1.5, 0.5, 0]} label="↑" active={buttonStates[12]} />
      <Button position={[-1.5, -0.5, 0]} label="↓" active={buttonStates[13]} />
      <Button position={[-2, 0, 0]} label="←" active={buttonStates[14]} />
      <Button position={[-1, 0, 0]} label="→" active={buttonStates[15]} />

      {/* 左摇杆 */}
      <Joystick position={[-1, -2, 0]} stickPos={leftStick} label="左摇杆" />

      {/* 右摇杆 */}
      <Joystick position={[1, -2, 0]} stickPos={rightStick} label="右摇杆" />
    </Canvas>
  );
}

// **按钮组件**
function Button({ position, label, active }: { position: [number, number, number]; label: string; active: boolean }) {
  return (
    <group position={position}>
      <Sphere args={[0.3, 32, 32]}>
        <meshStandardMaterial color={active ? "red" : "gray"} />
      </Sphere>
      <Text position={[0, 0.5, 0]} fontSize={0.2} color="black">
        {label}
      </Text>
    </group>
  );
}

// **摇杆组件**
function Joystick({ position, stickPos, label }: { position: [number, number, number]; stickPos: [number, number]; label: string }) {
  const [x, y] = stickPos;
  const angle = Math.atan2(y, x) * (180 / Math.PI);
  const magnitude = Math.sqrt(x ** 2 + y ** 2);

  return (
    <group position={position}>
      {/* 摇杆基座 */}
      <Sphere args={[0.4, 32, 32]}>
        <meshStandardMaterial color="black" />
      </Sphere>

      {/* 摇杆位置 */}
      <Sphere position={[x * 0.5, -y * 0.5, 0]} args={[0.2, 32, 32]}>
        <meshStandardMaterial color="blue" />
      </Sphere>

      {/* 方向箭头 */}
      <Line points={[[0, 0, 0], [x * 0.5, -y * 0.5, 0]]} color="yellow" lineWidth={2} />

      {/* 角度和幅度信息 */}
      <Text position={[0, 0.6, 0]} fontSize={0.2} color="black">
        {label}: {angle.toFixed(1)}° | {magnitude.toFixed(2)}
      </Text>
    </group>
  );
}

// src/components/FlagCanvas.tsx
'use client';

import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FlagManager } from '@/lib/FlagManager';
import { CameraController } from '@/lib/CameraController';
import { getFlagDataList } from '@/lib/imageUtils';
import { Flag } from '@/lib/Flag';
import { FlagData } from '@/lib/FlagMockData';
import { SceneBackground } from '@/lib/SceneBackground';
import FlagDetailModal from './FlagDetailModal';

interface FlagCanvasProps {
    windStrength: number;
    windDirection: number;
}

export default function FlagCanvas({ windStrength, windDirection }: FlagCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const controlsRef = useRef<OrbitControls | null>(null);
    const flagManagerRef = useRef<FlagManager | null>(null);
    const cameraControllerRef = useRef<CameraController | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const backgroundRef = useRef<SceneBackground | null>(null);

    // 깃발 데이터 상태
    const [flagDataList, setFlagDataList] = useState<FlagData[]>([]);
    const [focusedFlag, setFocusedFlag] = useState<Flag | null>(null);
    const [isCameraAnimating, setIsCameraAnimating] = useState(false);

    // 레이캐스팅 상태
    const [raycaster] = useState(new THREE.Raycaster());
    const [pointer] = useState(new THREE.Vector2());

    // 이미지 목록 가져오기
    useEffect(() => {
        async function loadFlagData() {
            const flags = await getFlagDataList();
            setFlagDataList(flags);
        }

        loadFlagData();
    }, []);

    // Three.js 초기화
    useEffect(() => {
        if (!canvasRef.current) return;

        // 3D 씬 설정
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x333333);

        // 카메라
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 15;

        // 렌더러
        const renderer = new THREE.WebGLRenderer({
            canvas: canvasRef.current,
            antialias: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);

        // 조명
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);

        // 배경
        const background = new SceneBackground(scene);
        background.addStarField();
        background.addGradientBackground();

        // OrbitControls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;

        // FlagManager 생성
        const flagManager = new FlagManager(scene);

        // CameraController 초기화
        const cameraController = new CameraController(camera, controls);

        // 깃발 클릭 핸들러 설정
        flagManager.setFlagClickHandler((flag) => {
            setIsCameraAnimating(true);
            cameraController.focusOnObject(flag.mesh, 3, () => {
                setFocusedFlag(flag);
                setIsCameraAnimating(false);
            });
        });

        // 참조 저장
        sceneRef.current = scene;
        cameraRef.current = camera;
        rendererRef.current = renderer;
        controlsRef.current = controls;
        flagManagerRef.current = flagManager;
        cameraControllerRef.current = cameraController;
        backgroundRef.current = background;

        // 리사이즈 핸들러
        const handleResize = () => {
            if (camera && renderer) {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            }
        };

        // 클릭 이벤트 핸들러
        const handleClick = (event: MouseEvent) => {
            // 마우스 좌표를 정규화된 디바이스 좌표로 변환 (-1 ~ +1)
            pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
            pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

            // 레이캐스팅
            raycaster.setFromCamera(pointer, camera);
            const intersects = raycaster.intersectObjects(scene.children, true);

            if (intersects.length > 0) {
                const clickedObject = intersects[0].object;
                flagManager.handleObjectClick(clickedObject);
            }
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('click', handleClick);

        // 애니메이션 루프
        const animate = () => {
            animationFrameRef.current = requestAnimationFrame(animate);

            if (controlsRef.current) {
                controlsRef.current.update();
            }

            if (flagManagerRef.current) {
                flagManagerRef.current.update();
            }
            if (backgroundRef.current) {
                backgroundRef.current.update();
            }

            if (rendererRef.current && sceneRef.current && cameraRef.current) {
                rendererRef.current.render(sceneRef.current, cameraRef.current);
            }
        };

        animate();

        return () => {
            if (animationFrameRef.current !== null) {
                cancelAnimationFrame(animationFrameRef.current);
            }

            window.removeEventListener('resize', handleResize);
            window.removeEventListener('click', handleClick);

            if (controlsRef.current) controlsRef.current.dispose();
            if (rendererRef.current) rendererRef.current.dispose();
            if (flagManagerRef.current) flagManagerRef.current.dispose();
        };
    }, []);

    // 깃발 데이터가 로드되면 깃발 생성 (최초 1회만)
    useEffect(() => {
        if (flagDataList.length === 0 || !flagManagerRef.current) return;

        // 최초 1회만 깃발 생성
        if (flagManagerRef.current.flags.length === 0) {
            flagManagerRef.current.createFlags(flagDataList, windStrength, windDirection);
        }
    }, [flagDataList]);

    // 바람 세기/방향 변경 시 기존 깃발 업데이트
    useEffect(() => {
        if (flagManagerRef.current && flagManagerRef.current.flags.length > 0) {
            flagManagerRef.current.updateAllFlags(windStrength, windDirection);
        }
    }, [windStrength, windDirection]);

    // 원래 위치로 돌아가기
    const handleResetCamera = () => {
        if (cameraControllerRef.current) {
            setIsCameraAnimating(true);
            cameraControllerRef.current.resetToOriginal(() => {
                setFocusedFlag(null);
                setIsCameraAnimating(false);
            });
        }
    };

    return (
        <>
            <canvas
                ref={canvasRef}
                style={{ touchAction: 'none' }}
            />

            {/* 깃발 상세 정보 모달 */}
            <FlagDetailModal 
                flag={focusedFlag} 
                onClose={handleResetCamera} 
                isAnimating={isCameraAnimating}
            />

            
        </>
    );
}
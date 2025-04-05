import * as THREE from 'three';

export class SceneBackground {
    scene: THREE.Scene;
    particlesMesh: THREE.Points | null = null;

    constructor(scene: THREE.Scene) {
        this.scene = scene;
    }

    addStarField(count: number = 1000, size: number = 0.05) {
        // 별 파티클 시스템 생성
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = count;
        const posArray = new Float32Array(particlesCount * 3);

        for (let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 50;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

        const particlesMaterial = new THREE.PointsMaterial({
            size: size,
            color: 0xffffff,
            transparent: true,
            blending: THREE.AdditiveBlending
        });

        this.particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        this.scene.add(this.particlesMesh);

        return this.particlesMesh;
    }

    addGradientBackground() {
        // 그라데이션 배경 생성 코드
        // 구현 필요
    }

    addSkybox(path: string) {
        // 스카이박스 추가 코드
        // 구현 필요
    }

    update() {
        // 배경 애니메이션 업데이트
        if (this.particlesMesh) {
            this.particlesMesh.rotation.x += 0.0001;
            this.particlesMesh.rotation.y += 0.0001;
        }
    }

    dispose() {
        // 메모리 정리
        if (this.particlesMesh) {
            // 지오메트리와 머티리얼 해제
            this.particlesMesh.geometry.dispose();
            (this.particlesMesh.material as THREE.PointsMaterial).dispose();
            
            // 씬에서 제거
            this.scene.remove(this.particlesMesh);
            this.particlesMesh = null;
        }
    }
}
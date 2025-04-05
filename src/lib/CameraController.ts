// src/lib/CameraController.ts
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export class CameraController {
    private _camera: THREE.PerspectiveCamera;
    private _controls: OrbitControls;
    private _originalPosition: THREE.Vector3;
    private _originalTarget: THREE.Vector3;

    constructor(camera: THREE.PerspectiveCamera, controls: OrbitControls) {
        this._camera = camera;
        this._controls = controls;
        
        // 원본 위치 저장
        this._originalPosition = camera.position.clone();
        this._originalTarget = controls.target.clone();
    }

    // 콜백 옵션 추가
    resetToOriginal(callback?: () => void) {
        // 카메라 위치 애니메이션
        const duration = 1000; // 애니메이션 지속 시간 (ms)
        const startPosition = this._camera.position.clone();
        const startTarget = this._controls.target.clone();
        const startTime = performance.now();

        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // 부드러운 보간(Lerp) 사용
            const easedProgress = this.easeInOutCubic(progress);
            
            // 위치 보간
            this._camera.position.lerpVectors(startPosition, this._originalPosition, easedProgress);
            
            // 타겟 보간
            this._controls.target.lerpVectors(startTarget, this._originalTarget, easedProgress);
            
            this._controls.update();

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // 최종 위치 정확히 설정
                this._camera.position.copy(this._originalPosition);
                this._controls.target.copy(this._originalTarget);
                this._controls.update();

                // 콜백 호출
                if (callback) {
                    callback();
                }
            }
        };

        // 애니메이션 시작
        requestAnimationFrame(animate);
    }

    // 부드러운 이징 함수 (큐빅)
    private easeInOutCubic(t: number): number {
        return t < 0.5 
            ? 4 * t * t * t 
            : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    // 객체에 포커스
    focusOnObject(
        object: THREE.Object3D, 
        distance: number = 3, 
        callback?: () => void
    ) {
        const boundingBox = new THREE.Box3().setFromObject(object);
        const center = boundingBox.getCenter(new THREE.Vector3());
        
        // 목표 위치 계산
        const direction = this._camera.position.clone().sub(this._controls.target).normalize();
        const targetPosition = center.clone().add(direction.multiplyScalar(distance));

        const startPosition = this._camera.position.clone();
        const startTarget = this._controls.target.clone();
        const duration = 1000; // 애니메이션 지속 시간 (ms)
        const startTime = performance.now();

        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // 부드러운 보간
            const easedProgress = this.easeInOutCubic(progress);
            
            // 위치 보간
            this._camera.position.lerpVectors(startPosition, targetPosition, easedProgress);
            
            // 타겟 보간
            this._controls.target.lerpVectors(startTarget, center, easedProgress);
            
            this._controls.update();

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // 최종 위치 정확히 설정
                this._camera.position.copy(targetPosition);
                this._controls.target.copy(center);
                this._controls.update();

                // 콜백 호출
                if (callback) {
                    callback();
                }
            }
        };

        // 애니메이션 시작
        requestAnimationFrame(animate);
    }
}
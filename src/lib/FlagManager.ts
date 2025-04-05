// src/lib/FlagManager.ts
import * as THREE from 'three';
import { Flag } from './Flag';
import { FlagData } from './FlagMockData';

interface FlagPlacement {
    x: number;
    y: number;
    z: number;
    angle: number;
    distance: number;
}

export class FlagManager {
    private _flags: Flag[] = [];
    private _scene: THREE.Scene;
    private _flagPlacements: FlagPlacement[] = [];

    private _onFlagClick: ((flag: Flag) => void) | null = null;

    constructor(scene: THREE.Scene) {
        this._scene = scene;
    }

    // Getter 메서드들
    get flags(): Flag[] { return this._flags; }
    get scene(): THREE.Scene { return this._scene; }

    // 깃발 클릭 핸들러 설정
    setFlagClickHandler(handler: (flag: Flag) => void): this {
        this._onFlagClick = handler;
        return this;
    }

    // 깃발 생성 및 공간에 배치
    createFlags(flagDataList: FlagData[], windStrength: number = 0.5, windDirection: number = 0): this {
        // 원본 깃발 데이터를 20배로 확장
        const expandedFlagDataList: FlagData[] = [];

        // 20번 반복하며 원본 깃발 데이터 복제
        for (let i = 0; i < 20; i++) {
            const copiedFlagDataList = flagDataList.map(flagData => ({
                ...flagData,
                // 고유성을 위해 ID에 인덱스 추가
                id: `${flagData.id}-${i}`,
                // 이름에도 인덱스 추가하여 구분
                flagName: `${flagData.flagName} (${i + 1})`
            }));

            expandedFlagDataList.push(...copiedFlagDataList);
        }

        // 기존 로직 그대로 유지
        // 기존 깃발 제거
        this.removeAllFlags();

        // 이미지 개수에 따라 반지름 조정
        const baseRadius = 8;
        const flagCount = expandedFlagDataList.length;

        // 이미지 개수가 증가함에 따라 반지름도 증가
        const scaleFactor = Math.sqrt(flagCount / 10);
        const radius = baseRadius * Math.max(1, scaleFactor);

        // Z축 범위도 이미지 개수에 따라 조정
        const zRangeBase = 10;
        const zRange = zRangeBase * Math.max(1, scaleFactor * 0.8);

        console.log(`Placing ${flagCount} flags with radius: ${radius.toFixed(2)}, Z range: ${zRange.toFixed(2)}`);

        // 배치 정보 초기화
        this._flagPlacements = [];

        // 각 깃발 데이터에 대해 깃발 생성
        expandedFlagDataList.forEach((flagData, index) => {
            const flag = new Flag(flagData, windStrength, windDirection);

            // 균일한 분포를 위해 골든 앵글(황금각) 사용
            const goldenAngle = Math.PI * (3 - Math.sqrt(5)); // 약 137.5도
            const angle = index * goldenAngle;

            // 거리도 약간 랜덤화하여 고른 분포 생성
            const distance = radius * (0.7 + 0.3 * Math.random());

            // 좌표 계산
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;

            // Z 좌표도 범위에 맞게 랜덤화
            const z = (Math.random() - 0.5) * zRange;

            // 배치 정보 저장
            this._flagPlacements.push({ x, y, z, angle, distance });

            flag.setPosition(x, y, z);

            // 씬에 추가
            this._scene.add(flag.mesh);
            this._flags.push(flag);
        });

        return this;
    }

    // 특정 ID의 깃발 찾기
    getFlagById(id: string): Flag | undefined {
        return this._flags.find(flag => flag.flagData.id === id);
    }

    // 클릭한 객체가 깃발인지 확인하고 핸들러 호출
    handleObjectClick(object: THREE.Object3D): void {
        if (object.userData && object.userData.isFlag && this._onFlagClick) {
            const flagId = object.userData.flagId;
            const flag = this.getFlagById(flagId);
            if (flag) {
                this._onFlagClick(flag);
            }
        }
    }

    // 모든 깃발 업데이트
    updateAllFlags(windStrength: number, windDirection: number): this {
        this._flags.forEach((flag, index) => {
            // 풍력만 업데이트하고 위치는 유지
            flag.updateWind(windStrength, windDirection);
        });
        return this;
    }

    // 애니메이션 업데이트
    update(): void {
        this._flags.forEach(flag => {
            flag.update();
        });
    }

    // 모든 깃발 제거
    removeAllFlags(): this {
        this._flags.forEach(flag => {
            this._scene.remove(flag.mesh);
            flag.dispose();
        });
        this._flags = [];
        this._flagPlacements = [];
        return this;
    }

    // 메모리 정리
    dispose(): void {
        this.removeAllFlags();
    }
}
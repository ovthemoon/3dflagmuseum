// src/lib/Flag.ts
import * as THREE from 'three';
import { FlagData } from './FlagMockData';

export class Flag {
  mesh: THREE.Mesh;
  geometry: THREE.PlaneGeometry;
  material: THREE.MeshStandardMaterial;
  
  // 바람 관련 속성
  private _windStrength: number;
  private _windDirection: number;
  
  // 깃발 데이터 속성 추가
  flagData: FlagData;

  // 애니메이션 상태 추적을 위한 변수들
  private _baseVertices: number[];
  private _animationOffset: number;

  constructor(
    flagData: FlagData,
    windStrength: number = 0.5, 
    windDirection: number = 0
  ) {
    // 깃발 데이터 저장
    this.flagData = flagData;

    // 깃발 지오메트리 생성 (웨이브 효과를 위해 세그먼트 수 증가)
    this.geometry = new THREE.PlaneGeometry(3, 2, 30, 20);

    // 기본 정점 위치 저장 (원본 형태 보존)
    const positionArray = this.geometry.attributes.position.array;
    this._baseVertices = Array.from(positionArray);

    // 랜덤한 초기 애니메이션 오프셋 생성 (각 깃발마다 다른 애니메이션)
    this._animationOffset = Math.random() * 1000;

    // 텍스처 로드
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(flagData.imagePath);

    // 재질 생성
    this.material = new THREE.MeshStandardMaterial({
      map: texture,
      side: THREE.DoubleSide,
      transparent: true
    });

    // 메시 생성
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    
    // 메시에 사용자 데이터 추가 (클릭 이벤트에서 식별용)
    this.mesh.userData.flagId = flagData.id;
    this.mesh.userData.isFlag = true;
    this.mesh.userData.flagData = this.flagData;

    // 바람 속성 설정
    this._windStrength = windStrength;
    this._windDirection = windDirection;
  }

  // Getter 메서드들
  get windStrength(): number { return this._windStrength; }
  get windDirection(): number { return this._windDirection; }

  // 깃발 위치 설정
  setPosition(x: number, y: number, z: number) {
    this.mesh.position.set(x, y, z);
  }

  // 깃발 회전 설정
  setRotation(x: number, y: number, z: number) {
    this.mesh.rotation.set(x, y, z);
  }

  // 바람 속성 업데이트
  updateWind(strength: number, direction: number) {
    this._windStrength = strength;
    this._windDirection = direction;
  }

  // 애니메이션 업데이트 (매 프레임마다 호출)
  update() {
    if (!this.geometry || !this.mesh) return;

    const now = Date.now() * 0.001;
    const position = this.geometry.attributes.position;
    const directionRad = this._windDirection * (Math.PI / 180);

    for (let i = 0; i < position.count; i++) {
      // 원본 기하학적 위치 복원
      const baseX = this._baseVertices[i * 3];
      const baseY = this._baseVertices[i * 3 + 1];

      // 중심에서 거리 계산 (이제 깃발의 중심이 기준)
      const distanceFromCenter = Math.sqrt(baseX * baseX + baseY * baseY);
      const waveIntensity = distanceFromCenter * this._windStrength;

      // 더 부드러운 웨이브 효과 (고유 오프셋 사용)
      const waveX = Math.sin(baseY * 2 + (now + this._animationOffset) * 2) * 0.1 * waveIntensity;
      const waveY = Math.sin(baseX * 3 + (now + this._animationOffset) * 1.5) * 0.05 * waveIntensity;

      // 바람 방향 적용
      const directedWaveZ = waveX * Math.cos(directionRad) + waveY * Math.sin(directionRad);

      // 기본 위치에서 파생된 Z 좌표 설정
      position.setZ(i, directedWaveZ);
    }

    position.needsUpdate = true;
    this.geometry.computeVertexNormals();
  }

  // 메모리 정리
  dispose() {
    if (this.geometry) this.geometry.dispose();
    if (this.material.map) this.material.map.dispose();
    this.material.dispose();
  }
}

// 깃발 생성 예시
export function createFlag(
  flagData: FlagData, 
  windStrength?: number, 
  windDirection?: number
): Flag {
  return new Flag(flagData, windStrength, windDirection);
}
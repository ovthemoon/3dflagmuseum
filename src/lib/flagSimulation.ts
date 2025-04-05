import * as THREE from 'three';

/**
 * 깃발 메시에 웨이브 애니메이션을 적용하는 함수
 */
export function simulateFlag(
  flagMesh: THREE.Mesh, 
  windStrength: number = 0.5, 
  windDirection: number = 0
) {
  if (!flagMesh.geometry.isBufferGeometry) return;
  
  const geometry = flagMesh.geometry;
  const positionAttribute = geometry.getAttribute('position');
  
  // 깃발의 피지컬한 움직임 계산
  const now = Date.now() * 0.001; // 시간을 초 단위로 변환
  
  for (let i = 0; i < positionAttribute.count; i++) {
    const x = positionAttribute.getX(i);
    const y = positionAttribute.getY(i);
    
    // x 좌표가 클수록(깃대에서 멀수록) 더 큰 움직임
    // 바람의 세기에 따라 움직임 조절
    const waveX = Math.sin(x * 2 + now) * 0.1 * (x + 2) * windStrength;
    const waveY = Math.sin(x * 3 + now * 1.5) * 0.05 * (x + 2) * windStrength;
    
    // 바람 방향에 따른 웨이브 조정
    const directionRad = windDirection * (Math.PI / 180);
    const waveZ = waveX * Math.cos(directionRad) + waveY * Math.sin(directionRad);
    
    positionAttribute.setZ(i, waveZ);
  }
  
  positionAttribute.needsUpdate = true;
  
  // 노멀 재계산으로 조명 효과 개선
  geometry.computeVertexNormals();
}
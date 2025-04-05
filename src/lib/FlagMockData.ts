// src/lib/FlagMockData.ts

export interface FlagData {
    id: string;             // 고유 식별자
    username: string;       // 깃발을 업로드한 사용자 이름
    flagName: string;       // 깃발의 이름
    description: string;    // 깃발에 대한 설명
    imagePath: string;      // 깃발 이미지 경로
    createdAt: Date;        // 깃발 생성 일자
  }
  
  export const flagMockData: FlagData[] = [
    {
      id: 'flag_001',
      username: '김해양',
      flagName: '태극기',
      description: '대한민국의 국기로, 하늘색과 빨간색의 조화를 담고 있습니다.',
      imagePath: '/images/flag1.png',
      createdAt: new Date('2024-01-15T10:30:00')
    },
    {
      id: 'flag_002',
      username: 'John Doe',
      flagName: 'UN Flag',
      description: '세계 평화와 국제 협력을 상징하는 깃발',
      imagePath: '/images/flag2.png',
      createdAt: new Date('2024-02-20T14:45:00')
    },
    {
      id: 'flag_003',
      username: '마린',
      flagName: '해양 탐험가의 꿈',
      description: '푸른 바다와 모험을 꿈꾸는 마음을 담은 깃발',
      imagePath: '/images/flag3.png',
      createdAt: new Date('2024-03-10T09:15:00')
    }
  ];
  
  // 고유 ID로 깃발 데이터 찾기
  export function getFlagDataById(id: string): FlagData | undefined {
    return flagMockData.find(flag => flag.id === id);
  }
  
  // 랜덤 깃발 데이터 생성 함수
  export function getRandomFlagData(): FlagData {
    const randomIndex = Math.floor(Math.random() * flagMockData.length);
    return flagMockData[randomIndex];
  }
  
  // 특정 사용자의 깃발 데이터 가져오기
  export function getFlagDataByUsername(username: string): FlagData[] {
    return flagMockData.filter(flag => flag.username === username);
  }
  
  // 새로운 깃발 데이터 생성 함수
  export function createNewFlagData(
    username: string, 
    flagName: string, 
    description: string, 
    imagePath: string
  ): FlagData {
    const newId = `flag_${(flagMockData.length + 1).toString().padStart(3, '0')}`;
    return {
      id: newId,
      username,
      flagName,
      description,
      imagePath,
      createdAt: new Date()
    };
  }
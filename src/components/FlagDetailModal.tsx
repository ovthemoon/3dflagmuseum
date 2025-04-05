// src/components/FlagDetailModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { Flag } from '@/lib/Flag';

interface FlagDetailModalProps {
  flag: Flag | null;
  onClose: () => void;
  isAnimating: boolean;
}

export default function FlagDetailModal({ 
  flag, 
  onClose, 
  isAnimating 
}: FlagDetailModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // 깃발 변경 시 애니메이션 효과
  useEffect(() => {
    if (flag && !isAnimating) {
      setIsVisible(true);
      setIsClosing(false);
    }
  }, [flag, isAnimating]);

  // 닫기 핸들러
  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // 애니메이션 상태 변경
    setIsClosing(true);

    // 애니메이션 종료 후 onClose 호출
    setTimeout(() => {
      onClose();
    }, 300); // CSS 애니메이션 시간과 일치
  };

  if (!flag) return null;

  const { username, flagName, description, createdAt } = flag.flagData;

  return (
    <div 
      className={`
        fixed bottom-0 left-0 right-0 z-50 
        transition-transform duration-300 ease-in-out
        ${isVisible && !isAnimating && !isClosing
          ? 'translate-y-0' 
          : 'translate-y-full'}
      `}
    >
      <div 
        className="
          bg-white dark:bg-gray-800 
          rounded-t-2xl 
          shadow-2xl
          max-w-md
          mx-auto
          w-full
        "
      >
        {/* 모달 상단 핸들바 */}
        <div className="flex justify-center py-2">
          <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
        </div>

        <div className="p-6 pt-2 space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {flagName}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {`업로드한 사용자: ${username}`}
            </p>
          </div>

          <p className="text-gray-700 dark:text-gray-300">
            {description}
          </p>

          <div className="text-sm text-gray-500 dark:text-gray-400">
            <p>
              생성 일자: {' '}
              {createdAt.toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>

          {/* 하단 돌아가기 버튼 */}
          <div className="pt-4">
            <button 
              onClick={handleClose}
              className="
                w-full 
                bg-blue-500 
                text-white 
                py-3 
                rounded-lg 
                hover:bg-blue-600 
                transition-colors
                focus:outline-none
                focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              "
            >
              돌아가기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
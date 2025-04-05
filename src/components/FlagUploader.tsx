'use client';

import { useState } from 'react';

interface FlagUploaderProps {
  onUpload: (imageUrl: string) => void;
}

export default function FlagUploader({ onUpload }: FlagUploaderProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    if (!file.type.match('image.*')) {
      setError('이미지 파일만 업로드 가능합니다.');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        onUpload(e.target.result as string);
      }
      setLoading(false);
    };
    
    reader.onerror = () => {
      setError('파일을 읽는 중 오류가 발생했습니다.');
      setLoading(false);
    };
    
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col space-y-3">
      <h2 className="text-lg font-bold">깃발 도면 업로더</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        깃발 이미지를 업로드하면 3D로 표시됩니다.
      </p>
      
      <label className="block">
        <span className="sr-only">깃발 이미지 선택</span>
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFileChange}
          disabled={loading}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </label>
      
      {loading && <p className="text-sm">로딩 중...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
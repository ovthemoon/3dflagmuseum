'use client';
// src/app/upload/page.tsx
import { useState } from 'react';
import { uploadNewFlag } from '@/lib/imageUtils';

export default function UploadPage() {
  const [username, setUsername] = useState('');
  const [flagName, setFlagName] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setImageFile(files[0]);
      setUploadError(null);
      setUploadSuccess(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!username || !flagName || !description || !imageFile) {
      setUploadError('모든 필드를 입력하고 이미지를 선택해주세요');
      return;
    }

    try {
      const result = await uploadNewFlag(
        username, 
        flagName, 
        description, 
        imageFile
      );

      if (result) {
        // Reset form
        setUsername('');
        setFlagName('');
        setDescription('');
        setImageFile(null);
        
        // Clear file input
        const fileInput = document.getElementById('imageUpload') as HTMLInputElement;
        if (fileInput) fileInput.value = '';

        setUploadSuccess(true);
        setUploadError(null);
      } else {
        setUploadError('깃발 업로드에 실패했습니다');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError('업로드 중 오류가 발생했습니다');
    }
  };

  return (
    <div className="fixed inset-0 bg-neutral-900 flex flex-col">
      {/* Navbar */}
      <div className="bg-blue-500 text-white py-4 px-4 flex justify-between items-center">
        <span className="text-lg font-bold">깃발 프로젝트</span>
        <div className="space-x-4">
          <span>깃발 목록</span>
          <span className="font-semibold">깃발 업로드</span>
          <span>소개</span>
        </div>
      </div>

      {/* Upload Form */}
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-8 w-full max-w-md shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label 
                htmlFor="username" 
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                사용자 이름
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                placeholder="사용자 이름을 입력하세요"
              />
            </div>

            <div>
              <label 
                htmlFor="flagName" 
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                깃발 이름
              </label>
              <input
                id="flagName"
                type="text"
                value={flagName}
                onChange={(e) => setFlagName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                placeholder="깃발 이름을 입력하세요"
              />
            </div>

            <div>
              <label 
                htmlFor="description" 
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                설명
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                placeholder="깃발에 대한 설명을 입력하세요"
                rows={3}
              />
            </div>

            <div>
              <label 
                htmlFor="imageUpload" 
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                이미지 업로드
              </label>
              <div className="relative border border-gray-300 rounded-md">
                <input
                  id="imageUpload"
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="px-3 py-2 text-gray-500">
                  {imageFile ? imageFile.name : '파일 선택 선택된 파일 없음'}
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                허용된 형식: JPEG, PNG, GIF, WebP (최대 5MB)
              </p>
            </div>

            {uploadError && (
              <div className="text-red-500 text-sm">
                {uploadError}
              </div>
            )}

            {uploadSuccess && (
              <div className="text-green-500 text-sm">
                깃발이 성공적으로 업로드되었습니다!
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              깃발 업로드
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
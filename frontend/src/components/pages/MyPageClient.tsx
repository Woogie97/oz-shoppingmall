'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { authApi, User, UpdateUserRequest } from '../../lib/api';
import { tokenUtils, getErrorMessage, validation } from '../../lib/helpers';

// 마이페이지 클라이언트 컴포넌트
const MyPageClient = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  
  // 수정 폼 상태
  const [formData, setFormData] = useState<UpdateUserRequest>({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [formErrors, setFormErrors] = useState<Partial<UpdateUserRequest>>({});
  
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      if (!tokenUtils.exists()) {
        router.push('/login');
        return;
      }

      try {
        const data = await authApi.getProfile();
        setUser(data);
        setFormData({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          address: data.address || '',
        });
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const validateForm = (): boolean => {
    const errors: Partial<UpdateUserRequest> = {};
    
    if (!validation.required(formData.name)) {
      errors.name = '이름을 입력해주세요.';
    }
    
    if (formData.email && !validation.email(formData.email)) {
      errors.email = '올바른 이메일 형식을 입력해주세요.';
    }
    
    if (formData.phone && !validation.phone(formData.phone)) {
      errors.phone = '올바른 전화번호 형식을 입력해주세요. (예: 010-1234-5678)';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: keyof UpdateUserRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // 입력 시 해당 필드의 에러 메시지 제거
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleUpdateProfile = async () => {
    if (!validateForm()) return;
    
    setUpdateLoading(true);
    setError(null);
    
    try {
      const response = await authApi.updateProfile(formData);
      if (response.data) {
        setUser(response.data);
        setIsEditing(false);
        alert('프로필이 성공적으로 업데이트되었습니다!');
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleCancelEdit = () => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
      });
    }
    setFormErrors({});
    setIsEditing(false);
  };

  const handleLogout = () => {
    tokenUtils.remove();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="mt-2">사용자 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <p className="text-red-500 mb-4">오류: {error}</p>
          <Button onClick={() => router.push('/login')} variant="primary">
            로그인 페이지로 이동
          </Button>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">마이페이지</h1>
            {!isEditing && (
              <Button 
                onClick={() => setIsEditing(true)}
                variant="primary"
              >
                정보 수정
              </Button>
            )}
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <div className="space-y-6">
            {/* 기본 정보 */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">기본 정보</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">이름</label>
                  {isEditing ? (
                    <Input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('name', e.target.value)}
                      error={formErrors.name}
                      placeholder="이름을 입력하세요"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">{user.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">이메일</label>
                  {isEditing ? (
                    <Input
                      type="email"
                      value={formData.email || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('email', e.target.value)}
                      error={formErrors.email}
                      placeholder="이메일을 입력하세요"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">{user.email || '제공되지 않음'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">전화번호</label>
                  {isEditing ? (
                    <Input
                      type="tel"
                      value={formData.phone || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('phone', e.target.value)}
                      error={formErrors.phone}
                      placeholder="010-1234-5678"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">{user.phone || '등록되지 않음'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">로그인 방식</label>
                  <p className="text-gray-900 py-2 capitalize">{user.provider}</p>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">주소</label>
                {isEditing ? (
                  <Input
                    type="text"
                    value={formData.address || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('address', e.target.value)}
                    error={formErrors.address}
                    placeholder="주소를 입력하세요"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{user.address || '등록되지 않음'}</p>
                )}
              </div>
            </div>

            {/* 계정 정보 */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">계정 정보</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">가입일</label>
                  <p className="text-gray-900 py-2">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString('ko-KR') : '정보 없음'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">마지막 수정일</label>
                  <p className="text-gray-900 py-2">
                    {user.updated_at ? new Date(user.updated_at).toLocaleDateString('ko-KR') : '정보 없음'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 액션 버튼들 */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            {isEditing ? (
              <>
                <Button 
                  onClick={handleUpdateProfile}
                  variant="primary"
                  className="flex-1"
                  disabled={updateLoading}
                >
                  {updateLoading ? '저장 중...' : '저장하기'}
                </Button>
                <Button 
                  onClick={handleCancelEdit}
                  variant="secondary"
                  className="flex-1"
                  disabled={updateLoading}
                >
                  취소
                </Button>
              </>
            ) : (
              <>
                <Button 
                  onClick={() => router.push('/products')}
                  variant="secondary"
                  className="flex-1"
                >
                  쇼핑 계속하기
                </Button>
                <Button 
                  onClick={handleLogout}
                  variant="danger"
                  className="flex-1"
                >
                  로그아웃
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPageClient;

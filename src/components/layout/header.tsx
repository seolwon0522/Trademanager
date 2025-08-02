'use client';

import React from 'react';
import { Menu, User, Bell } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Sidebar } from './sidebar';

interface HeaderProps {
  onMobileMenuClick?: () => void;
}

// 헤더 컴포넌트
export function Header({ onMobileMenuClick: _onMobileMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        {/* 왼쪽: 로고 및 모바일 메뉴 */}
        <div className="flex items-center gap-4">
          {/* 모바일 메뉴 버튼 */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">메뉴 열기</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
              <SheetHeader className="sr-only">
                <SheetTitle>네비게이션 메뉴</SheetTitle>
                <SheetDescription>사이드바 메뉴입니다.</SheetDescription>
              </SheetHeader>
              <Sidebar />
            </SheetContent>
          </Sheet>

          {/* 로고 */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
              CT
            </div>
            <h1 className="font-semibold text-lg hidden sm:block">코인 트레이딩 저널</h1>
          </div>
        </div>

        {/* 오른쪽: 액션 버튼들 */}
        <div className="flex items-center gap-2">
          {/* 알림 버튼 */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {/* 알림 뱃지 */}
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white">
              3
            </span>
            <span className="sr-only">알림</span>
          </Button>

          {/* 다크 모드 토글 */}
          <ThemeToggle />

          {/* 사용자 메뉴 */}
          <div className="flex items-center gap-2">
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium">사용자명</p>
              <p className="text-xs text-muted-foreground">user@example.com</p>
            </div>
            <Button variant="ghost" size="icon" className="rounded-full">
              <User className="h-5 w-5" />
              <span className="sr-only">사용자 메뉴</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

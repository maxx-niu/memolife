"use client";

import { User } from "@supabase/supabase-js";
import { LogOut, Settings, User as UserIcon } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function getInitials(email: string): string {
  return email.slice(0, 2).toUpperCase();
}

export default function Navbar({ user }: { user: User }) {
  return (
    <nav className="flex h-14 items-center justify-between border-b border-border px-6">
      <span className="text-base font-semibold tracking-tight">MemoLife</span>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <button className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <Avatar className="size-8 cursor-pointer">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
                  {getInitials(user.email ?? "U")}
                </AvatarFallback>
              </Avatar>
            </button>
          }
        />

        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="font-normal">
            <p className="text-sm font-medium">{user.email}</p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <UserIcon className="mr-2 size-4" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 size-4" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              const form = document.createElement("form");
              form.method = "POST";
              form.action = "/api/auth/logout";
              document.body.appendChild(form);
              form.submit();
            }}
          >
            <LogOut className="mr-2 size-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
}

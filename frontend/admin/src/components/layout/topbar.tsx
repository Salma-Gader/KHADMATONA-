import { UserMenu } from "./user-menu";

export function Topbar() {
  return (
    <header className="flex h-16 items-center justify-end border-b border-border bg-surface px-6">
      <UserMenu />
    </header>
  );
}

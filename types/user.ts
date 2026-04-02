 export interface UserDropdownProps {
  user: { email: string; name?: string };
  onLogout: () => void;
}

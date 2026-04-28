import Button from '../ui/Button.jsx'

export default function LogoutButton({ onLogout }) {
  return (
    <Button variant="ghost" size="sm" onClick={onLogout}>
      Cerrar sesion
    </Button>
  )
}

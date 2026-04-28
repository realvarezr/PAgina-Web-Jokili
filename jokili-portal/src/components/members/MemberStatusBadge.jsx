import { getMemberStatus } from '../../logic/memberLogic.js'

export default function MemberStatusBadge({ member }) {
  const status = getMemberStatus(member)
  const map = {
    activo:    { label: 'Activo',    cls: 'badge badge--green' },
    honorario: { label: 'Honorario', cls: 'badge badge--yellow' },
    inactivo:  { label: 'Inactivo',  cls: 'badge badge--gray' },
  }
  const { label, cls } = map[status] ?? { label: status, cls: 'badge' }
  return <span className={cls}>{label}</span>
}

type RolePillProps = {
    roles: string[]
    className?: string
}

const roleColor = (role: string) => {
    switch (role) {
        case "super_admin":
            return "border-blue-900 bg-blue-700 text-slate-200"
        case "level_1":
            return "border-red-700 bg-red-100 text-red-700"
        case "level_2":
            return "border-blue-700 bg-blue-100 text-blue-700"
        case "level_3":
            return "border-green-700 bg-green-100 text-green-700"
        case "admin_opd":
            return "border-yellow-700 bg-yellow-100 text-yellow-700"
        case "admin_kecamatan":
            return "border-yellow-700 bg-yellow-100 text-yellow-700"
        default:
            return "border-slate-700 bg-slate-100 text-slate-700"
    }
}


export const RolePill = ({ roles = [], className = "" }: RolePillProps) => {
    const items =
        roles.length > 0
            ? roles.map((role, i) => (
                <span
                    key={`${role}-${i}`}
                    className={`px-3 py-1 text-xs rounded-full border ${roleColor(role)}`}
                >
                    {role}
                </span>
            ))
            : [
                <span
                    key="empty"
                    className="px-2 py-0.5 text-xs rounded-full bg-purple-100 text-purple-700"
                >
                    ⚠ no roles
                </span>,
            ]

    return (
        <div className={`flex flex-wrap items-center gap-2 ${className}`}>
            {items}
        </div>
    )
}

function WarningBadge({ warnings, compact = false }) {
    if (warnings === 0) {
        return compact ? (
            <span className="text-green-600 font-semibold">✓</span>
        ) : (
            <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg">
                <p className="text-lg font-semibold">✓ Sin amonestaciones</p>
            </div>
        );
    }

    if (warnings === 1) {
        return compact ? (
            <span className="text-yellow-600 font-semibold">⚠️</span>
        ) : (
            <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg">
                <p className="text-lg font-semibold">⚠️ 1 Amonestación</p>
                <p className="text-sm">¡Cuidado! La próxima es crítica</p>
            </div>
        );
    }

    return compact ? (
        <span className="text-red-600 font-semibold">🔴</span>
    ) : (
        <div className="bg-red-100 text-red-800 px-4 py-2 rounded-lg">
            <p className="text-lg font-semibold">🔴 {warnings} Amonestaciones</p>
            <p className="text-sm">¡Situación crítica!</p>
        </div>
    );
}

export default WarningBadge;
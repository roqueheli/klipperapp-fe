export const isBeforeTwoPM = (): boolean => {
    const now = new Date();
    const hour = now.getHours();
    return hour < 20;
};

export const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

export function getWeeksOfMonth(
    year: number,
    month: number,
    weekStartDay: number = 0, // domingo por defecto
    weekEndDay: number = 6    // sábado por defecto
) {
    const weeks = [];

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    // Mover al primer día de la semana que contenga el primer día del mes
    let current = new Date(firstDayOfMonth);
    const shiftBack = (current.getDay() - weekStartDay + 7) % 7;
    current.setDate(current.getDate() - shiftBack);

    while (current <= lastDayOfMonth) {
        const from = new Date(current);
        const to = new Date(current);
        const shiftForward = (weekEndDay - weekStartDay + 7) % 7;
        to.setDate(to.getDate() + shiftForward);

        // Validaciones como antes
        if (to < firstDayOfMonth || from.getMonth() !== month) {
            current.setDate(current.getDate() + 7);
            continue;
        }

        weeks.push({
            from: from.toISOString().split('T')[0],
            to: to.toISOString().split('T')[0],
            label: `Del ${dayNames[from.getDay()]} ${from.getDate()} de ${monthNames[from.getMonth()]} de ${from.getFullYear()} al ${dayNames[to.getDay()]} ${to.getDate()} de ${monthNames[to.getMonth()]} de ${to.getFullYear()}`
        });

        current.setDate(current.getDate() + 7);
    }

    return weeks;
}


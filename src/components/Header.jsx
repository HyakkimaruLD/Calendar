import React from 'react'

export default function Header({ year, month, onPrev, onNext, onToday }) {
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
    ]

    return (
        <div className="header">
            <div className="title">{monthNames[month]} {year}</div>
            <button onClick={onToday}>Today</button>
            <button onClick={onPrev}>◀</button>
            <button onClick={onNext}>▶</button>
        </div>
    )
}



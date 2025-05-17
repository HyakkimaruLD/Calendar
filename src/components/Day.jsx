import React from 'react';

export default function Day({ date, isCurrentMonth, isToday, isInRange, hasNotes, onClick }) {
    let className = 'day';
    if (!isCurrentMonth) className += ' blur';
    if (isToday) className += ' today';
    if (isInRange) className += ' in-range';
    if (hasNotes) className += ' has-notes';

    return (
        <div className={className} onClick={onClick}>
            {date.getDate()}
            {hasNotes && <span className="note-indicator"></span>}
        </div>
    );
}
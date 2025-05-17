import React, { useState, useEffect } from 'react';
import Day from './Day';
import Header from './Header';
import NoteList from './NoteList';
import NoteForm from './NoteForm';

export default function Calendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [notes, setNotes] = useState(() => {
        const savedNotes = localStorage.getItem('calendarNotes');
        return savedNotes ? JSON.parse(savedNotes) : {};
    });
    const [selectedDate, setSelectedDate] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const today = new Date();

    useEffect(() => {
        localStorage.setItem('calendarNotes', JSON.stringify(notes));
    }, [notes]);

    const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();

    const getFirstDayIndex = (year, month) => {
        const firstDayOfMonth = new Date(year, month, 1);
        const dayOfWeek = firstDayOfMonth.getDay();
        return dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    };

    const totalCells = 42;
    const daysInCurrentMonth = getDaysInMonth(year, month);
    const firstDayIndex = getFirstDayIndex(year, month);

    const prevMonthDays = [];
    const lastMonth = month === 0 ? 11 : month - 1;
    const lastMonthYear = month === 0 ? year - 1 : year;
    const daysInLastMonth = getDaysInMonth(lastMonthYear, lastMonth);

    for (let i = firstDayIndex - 1; i >= 0; i--) {
        const day = daysInLastMonth - i;
        prevMonthDays.push({
            date: new Date(lastMonthYear, lastMonth, day),
            isCurrentMonth: false,
        });
    }

    const currentMonthDays = [];
    for (let i = 1; i <= daysInCurrentMonth; i++) {
        currentMonthDays.push({
            date: new Date(year, month, i),
            isCurrentMonth: true,
        });
    }

    const nextMonthDays = [];
    const remaining = totalCells - (prevMonthDays.length + currentMonthDays.length);
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextMonthYear = month === 11 ? year + 1 : year;

    for (let i = 1; i <= remaining; i++) {
        nextMonthDays.push({
            date: new Date(nextMonthYear, nextMonth, i),
            isCurrentMonth: false,
        });
    }

    const allDays = [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];

    const handlePrev = () => {
        const prev = new Date(year, month - 1, 1);
        setCurrentDate(prev);
    };

    const handleNext = () => {
        const next = new Date(year, month + 1, 1);
        setCurrentDate(next);
    };

    const handleToday = () => {
        setCurrentDate(new Date());
    };

    const handleDayClick = (date) => {
        if (!startDate || endDate) {
            setStartDate(date);
            setEndDate(null);
        } else {
            if (date >= startDate) {
                setEndDate(date);
            } else {
                setStartDate(date);
                setEndDate(null);
            }
        }
        setSelectedDate(date);
        setIsModalOpen(true);
    };

    // const isInRange = (date) => {
    //     if (!startDate || !endDate) return false;
    //     return date >= startDate && date <= endDate;
    // };

    const hasNotes = (date) => {
        const dateKey = date.toISOString().split('T')[0]; // Формат YYYY-MM-DD
        return notes[dateKey] && notes[dateKey].length > 0;
    };

    const addNote = (text) => {
        if (!text.trim()) {
            alert('Note cannot be empty!');
            return;
        }
        const dateKey = selectedDate.toISOString().split('T')[0];
        const newNote = {
            id: Date.now(),
            text,
            createdAt: new Date().toISOString(),
        };
        setNotes((prev) => ({
            ...prev,
            [dateKey]: [...(prev[dateKey] || []), newNote],
        }));
    };

    const editNote = (noteId, newText) => {
        if (!newText.trim()) {
            alert('Note cannot be empty!');
            return;
        }
        const dateKey = selectedDate.toISOString().split('T')[0];
        setNotes((prev) => ({
            ...prev, [dateKey]: prev[dateKey].map((note) =>
                note.id === noteId ? { ...note, text: newText } : note
            ),
        }));
    };

    const deleteNote = (noteId) => {
        const dateKey = selectedDate.toISOString().split('T')[0];
        setNotes((prev) => ({
            ...prev,
            [dateKey]: prev[dateKey].filter((note) => note.id !== noteId),
        }));
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedDate(null);
    };

    return (
        <div className="calendar">
            <Header
                year={year}
                month={month}
                onPrev={handlePrev}
                onNext={handleNext}
                onToday={handleToday}
            />
            <div className="weekdays">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
                    <div key={d} className="weekday">{d}</div>
                ))}
            </div>
            <div className="grid">
                {allDays.map((d, index) => (
                    <Day
                        key={index}
                        date={d.date}
                        isCurrentMonth={d.isCurrentMonth}
                        isToday={
                            d.date.getDate() === today.getDate() &&
                            d.date.getMonth() === today.getMonth() &&
                            d.date.getFullYear() === today.getFullYear()
                        }
                       // isInRange={isInRange(d.date)}
                        hasNotes={hasNotes(d.date)}
                        onClick={() => handleDayClick(d.date)}
                    />
                ))}
            </div>
            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <button className="close-button" onClick={closeModal}>
                            ×
                        </button>
                        <h3>
                            Notes for {selectedDate.toLocaleDateString()}
                        </h3>
                        <NoteForm onSubmit={addNote} />
                        <NoteList
                            notes={notes[selectedDate.toISOString().split('T')[0]] || []}
                            onEdit={editNote}
                            onDelete={deleteNote}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
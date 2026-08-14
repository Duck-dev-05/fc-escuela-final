"use client";

import React, { useState, useRef, useEffect } from 'react';
import { 
  format, addMonths, subMonths, startOfMonth, startOfWeek, 
  addDays, isSameMonth, isSameDay, isValid, parseISO 
} from 'date-fns';
import { FaCalendarAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  placeholder?: string;
}

export default function DatePicker({ value, onChange, placeholder = "Select date..." }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(value && isValid(parseISO(value)) ? parseISO(value) : new Date());
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const selectedDate = value && isValid(parseISO(value)) ? parseISO(value) : null;

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const onDateClick = (day: Date) => {
    onChange(format(day, 'yyyy-MM-dd'));
    setIsOpen(false);
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={prevMonth} 
          type="button" 
          className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
        >
          <FaChevronLeft className="text-xs" />
        </button>
        <span className="text-sm font-bold text-slate-900 tracking-tight">
          {format(currentMonth, 'MMMM yyyy')}
        </span>
        <button 
          onClick={nextMonth} 
          type="button" 
          className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
        >
          <FaChevronRight className="text-xs" />
        </button>
      </div>
    );
  };

  const renderDays = () => {
    const days = [];
    let startDate = startOfWeek(currentMonth);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest w-full py-2">
          {format(addDays(startDate, i), 'EEE')}
        </div>
      );
    }

    return <div className="grid grid-cols-7 mb-2">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart);

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    for (let i = 0; i < 42; i++) {
        formattedDate = format(day, 'd');
        const cloneDay = day;

        const isCurrentMonth = isSameMonth(day, monthStart);
        const isSelected = selectedDate && isSameDay(day, selectedDate);
        const isToday = isSameDay(day, new Date());

        days.push(
          <button
            type="button"
            key={day.toISOString()}
            onClick={() => onDateClick(cloneDay)}
            className={`
              w-10 h-10 flex items-center justify-center rounded-xl text-sm font-medium transition-all mx-auto
              ${!isCurrentMonth ? 'text-slate-300 pointer-events-none' : 'text-slate-700 hover:bg-slate-100'}
              ${isSelected ? '!bg-slate-900 !text-white shadow-md' : ''}
              ${isToday && !isSelected ? 'border border-slate-200 text-slate-900' : ''}
            `}
          >
            <span className={isSelected ? 'font-bold' : ''}>{formattedDate}</span>
          </button>
        );

        if ((i + 1) % 7 === 0) {
          rows.push(<div className="grid grid-cols-7 gap-y-1" key={day.toISOString()}>{days}</div>);
          days = [];
        }
        day = addDays(day, 1);
    }
    return <div>{rows}</div>;
  };

  return (
    <div className="relative w-full" ref={popupRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 flex justify-between items-center cursor-pointer shadow-sm hover:border-slate-300 transition-all focus-within:ring-2 focus-within:ring-slate-900 focus-within:border-transparent"
      >
        <span className={value ? "text-slate-900 font-medium" : "text-slate-400"}>
          {value ? format(parseISO(value), 'MMMM d, yyyy') : placeholder}
        </span>
        <FaCalendarAlt className="text-slate-400" />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute z-50 mt-2 p-5 bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-100 w-full sm:w-[320px] left-0 origin-top-left"
          >
            {renderHeader()}
            {renderDays()}
            {renderCells()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

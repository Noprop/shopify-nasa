import { useState, useCallback } from 'react';
import { DatePicker as PolarisDatePicker } from '@shopify/polaris';

interface props {
  day: number,
  month: number,
  year: number,
  setDate: React.Dispatch<React.SetStateAction<{
    day: number;
    month: number;
    year: number;
  }>>
}

const DatePicker = ({ day, month, year, setDate }: props) => {
  const [selectedDates, setSelectedDates] = useState({
    start: new Date('Mon Sep 13 2021 00:00:00 GMT-0500 (EST)'),
    end: new Date('Mon Sep 13 2021 00:00:00 GMT-0500 (EST)'),
  });
  console.log(selectedDates.start.getDate());

  const handleMonthChange = useCallback((month, year) => {
    setDate({ day, month, year })
  }, [])

  return (
    <PolarisDatePicker
      allowRange
      month={month}
      year={year}
      onChange={setSelectedDates}
      onMonthChange={handleMonthChange}
      selected={selectedDates}
      disableDatesAfter={new Date('Mon Sep 21 2021 00:00:00 GMT-0500 (EST)')}
    />
  )
}

export default DatePicker;
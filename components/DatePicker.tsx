import { useState, useCallback } from 'react';
import { DatePicker as PolarisDatePicker } from '@shopify/polaris';

const DatePicker = () => {
  const [{ month, year }, setDate] = useState({ month: 8, year: 2021 });
  const [selectedDates, setSelectedDates] = useState({
    start: new Date('Mon Sep 13 2021 00:00:00 GMT-0500 (EST)'),
    end: new Date('Mon Sep 13 2021 00:00:00 GMT-0500 (EST)'),
  });

  const handleMonthChange = useCallback((month, year) => {
    setDate({ month, year })
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
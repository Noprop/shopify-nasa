import { useState, useCallback, useEffect, useRef } from 'react';
import { DatePicker as PolarisDatePicker } from '@shopify/polaris';
import dayjs from 'dayjs';

interface props {
  parentSelectedDates: {
    start: Date,
    end: Date
  }
  setParentSelectedDates: React.Dispatch<React.SetStateAction<{
    start: Date;
    end: Date;
  }>>
}

const DatePicker = ({ parentSelectedDates, setParentSelectedDates }: props) => {
  const [{ day, month, year }, setDate] = useState({ 
    day: dayjs().date(),
    month: dayjs().month(),
    year: dayjs().year() 
  });

  const [selectedDates, setSelectedDates] = useState({
    start: parentSelectedDates.start,
    end: parentSelectedDates.end,
  });

  const handleMonthChange = useCallback((month, year) => {
    setDate({ day, month, year })
  }, [])

  useEffect(() => {
    setParentSelectedDates(selectedDates);
  }, [selectedDates])

  return (
    <PolarisDatePicker
      allowRange
      month={month}
      year={year}
      onChange={setSelectedDates}
      onMonthChange={handleMonthChange}
      selected={selectedDates}
      disableDatesAfter={new Date()}
    />
  )
}

export default DatePicker;
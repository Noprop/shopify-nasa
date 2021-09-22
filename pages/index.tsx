import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  Layout,
  Page,
  FooterHelp,
  MediaCard,
  Link,
  Button,
  Thumbnail,
  Modal,
} from '@shopify/polaris';
import 'tailwindcss/tailwind.css';
import dayjs from 'dayjs';
import DatePicker from '../components/DatePicker';

interface Apod {
  copyright: string
  date: string
  explanation: string
  hdurl: string
  media_type: string
  service_version: string
  title: string
  url: string
}
type Apods = Apod[];

export default function App() {
  const API_KEY = useRef(process.env.NASA);
  const [currentLastDay, setCurrentLastDay] = useState(dayjs().subtract(7, 'day'))
  const [apods, setApods] = useState<Apods>([]);
  const handleApodsChange = useCallback((val) => setApods(val), []);

  useEffect(() => {
    if (apods.length < 5) {
      const toDate = dayjs().format('YYYY-MM-DD');
      const fromDate = currentLastDay.format('YYYY-MM-DD');

      const params = 'start_date=' + fromDate + '&end_date=' + toDate + '&api_key=' + API_KEY.current;
      fetch('https://api.nasa.gov/planetary/apod?' + params)
        .then(response => response.json())
        .then(data => {
          const reverseData = data.reverse();
          handleApodsChange(reverseData);
        });
    }
  }, [])

  const getMoreApods = (days = 7) => {
    const toDate = currentLastDay.subtract(1, 'day').format('YYYY-MM-DD');
    const newLastDay = currentLastDay.subtract(8, 'day');
    setCurrentLastDay(newLastDay);
    const fromDate = newLastDay.format('YYYY-MM-DD');

    const params = 'start_date=' + fromDate + '&end_date=' + toDate + '&api_key=' + API_KEY.current;
    fetch('https://api.nasa.gov/planetary/apod?' + params)
      .then(response => response.json())
      .then(data => {
        if (data.length > 0) {
          const reverseData = data.reverse();
          handleApodsChange([...apods, ...reverseData]);
        }
      });
  }
  const getMoreApodsWithDate = (start: Date, end: Date) => {
    const fromDate = dayjs(start).format('YYYY-MM-DD');
    const toDate = dayjs(end).format('YYYY-MM-DD');
    // const fromDate = dayjs(`${String(year)}-${String(month + 1)}-${String(day)}`);
    // console.log(fromDate);
    // console.log(fromDate.format('YYYY-MM-DD'));
    // const toDate = currentLastDay.subtract(1, 'day').format('YYYY-MM-DD');
    // const newLastDay = currentLastDay.subtract(8, 'day');
    // setCurrentLastDay(newLastDay);
    // const fromDate = newLastDay.format('YYYY-MM-DD');

    const params = 'start_date=' + fromDate + '&end_date=' + toDate + '&api_key=' + API_KEY.current;
    console.log(params);
    fetch('https://api.nasa.gov/planetary/apod?' + params)
      .then(response => response.json())
      .then(data => {
        if (data.length > 0) {
          const reverseData = data.reverse();
          handleApodsChange(reverseData);
        }
      });
  }

  const handleModalCloseAndUpdateApods = () => {
    setModalStatus(false);
    getMoreApodsWithDate(selectedDates.start, selectedDates.end);
  }
  const [selectedDates, setSelectedDates] = useState({
    start: new Date(),
    end: new Date()
  });
  const [modalStatus, setModalStatus] = useState(false);
  const handleModalOpen = useCallback(() => setModalStatus(true), []);
  const handleModalClose = useCallback(() => {
    setModalStatus(false);
  }, []);
  const modalButtonRef = useRef(null);
  const modalActivator = (
    <div 
      ref={modalButtonRef}
      style={{marginBottom: '10px'}}>
      <Button onClick={handleModalOpen}>Change date</Button>
    </div>
  );

  return (
    <Page
      fullWidth
      title="Spacestagram"
      // primaryAction={primaryAction}
      thumbnail={
        <Thumbnail 
          source="/nasa-logo.png"
          alt="NASA Logo"
        />
      }
    >
      <Layout>
        <Layout.Section>
          {modalActivator}
          {apods.map((apod, idx) => {
            return (
              <MediaCard 
                title={apod.title}
                description={apod.explanation}
                key={idx}
                primaryAction={{
                  content: 'Like',
                  onAction: () => {}
                }}
              >
                {apod.media_type === 'video' 
                  ? <iframe src={apod.url} height='100%' width='100%'></iframe>
                  : <img
                      alt=""
                      style={{
                        objectFit: 'cover',
                        objectPosition: 'center',
                      }}
                      src={apod.hdurl ? apod.hdurl : apod.url}
                    />
                }
              </MediaCard>
            )
          })}
        </Layout.Section>
        <Layout.Section>
          <FooterHelp>
            Images and descriptions are from NASA's Astronomy Picture of the Day. Click <Button onClick={() => getMoreApods()}plain>here</Button> to load more.
          </FooterHelp>
        </Layout.Section>
      </Layout>
      <div style={{height: '500px'}}>
        <Modal
          activator={modalButtonRef}
          open={modalStatus}
          onClose={handleModalClose}
          title="View more photos by selecting a date below"
          primaryAction={{
            content: 'Select',
            onAction: handleModalCloseAndUpdateApods,
          }}
        >
          <Modal.Section>
            <DatePicker setParentSelectedDates={setSelectedDates} />
          </Modal.Section>
        </Modal>
      </div>
    </Page>
  );
}
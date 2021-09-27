import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  Layout,
  Page,
  FooterHelp,
  MediaCard,
  Button,
  Thumbnail,
  Modal,
  TextStyle,
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
interface likedApods {
  [key: string]: boolean
}

export default function App() {
  const API_KEY = useRef(process.env.NASA);
  const [currentLastDay, setCurrentLastDay] = useState(dayjs().subtract(7, 'day'))
  const [apods, setApods] = useState<Apods>([]);
  const handleApodsChange = useCallback((val) => setApods(val), []);
  const [likedApods, setLikedApods] = useState({
    [currentLastDay.format('YYYY-MM-DD')]: false
  });

  useEffect(() => {
    if (apods.length < 5) {
      const toDate = dayjs().format('YYYY-MM-DD');
      const fromDate = currentLastDay.format('YYYY-MM-DD');

      const params = 'start_date=' + fromDate + '&end_date=' + toDate + '&api_key=' + API_KEY.current;
      fetch('https://api.nasa.gov/planetary/apod?' + params)
        .then(response => response.json())
        .then(data => {
          if (data.length > 0) {
            const reverseData = data.reverse();
            handleApodsChange(reverseData);
          }
        });
    }
  }, [])

  const getMoreApods = (start: string, end: string) => {
    const fromDate = dayjs(start).format('YYYY-MM-DD');
    const toDate = dayjs(end).format('YYYY-MM-DD');

    const params = 'start_date=' + fromDate + '&end_date=' + toDate + '&api_key=' + API_KEY.current;
    fetch('https://api.nasa.gov/planetary/apod?' + params)
      .then(response => response.json())
      .then(data => {
        if (data.length > 0) {
          const reverseData = data.reverse();
          handleApodsChange([...apods, ...reverseData]);
          setSelectedDates({
            start: new Date(fromDate),
            end: selectedDates.end
          })
        }
      });
  }

  const getMoreApodsWithDate = (start: Date, end: Date) => {
    const fromDate = dayjs(start).format('YYYY-MM-DD');
    const toDate = dayjs(end).format('YYYY-MM-DD');

    const params = 'start_date=' + fromDate + '&end_date=' + toDate + '&api_key=' + API_KEY.current;
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
    start: new Date(currentLastDay.format('YYYY-MM-DD')),
    end: new Date(currentLastDay.add(7, 'day').format('YYYY-MM-DD'))
  });
  const [modalStatus, setModalStatus] = useState(false);
  const handleModalOpen = useCallback(() => setModalStatus(true), []);
  const handleModalClose = useCallback(() => {
    setModalStatus(false);
  }, []);
  const modalButtonRef = useRef(null);

  const handleLikedApods = (date: string) => {
    if (date in likedApods) {
      setLikedApods({
        ...likedApods,
        [date]: !likedApods[date]
      })
    } else {
      setLikedApods({
        ...likedApods,
        [date]: true
      })
    }
  };

  return (
    <Page
      narrowWidth
      primaryAction={{
        content: 'Change Date',
        onAction: () => handleModalOpen()
      }}
      title="Spacestagram"
      thumbnail={
        <Thumbnail 
          source="/nasa-logo.png"
          alt="NASA Logo"
        />
      }
    >
      <Layout>
        <Layout.Section>
          {apods.map((apod, idx) => {
            return (
              <MediaCard
                title={apod.title}
                description={apod.explanation}
                key={idx}
                primaryAction={{
                  content: likedApods[apod.date] ? 'Liked' : 'Like',
                  onAction: () => handleLikedApods(apod.date)
                }}
                portrait
              >
                {apod.media_type === 'video' 
                  ? <iframe src={apod.url} height='400px' width='100%'></iframe>
                  : <img
                      alt=""
                      style={{
                        objectFit: 'cover',
                        objectPosition: 'center',
                      }}
                      src={apod.hdurl ? apod.hdurl : apod.url}
                    />
                }
                <div className="media-card-date">
                  <TextStyle variation="subdued">{apod.date}</TextStyle>
                </div>
              </MediaCard>
            )
          })}
        </Layout.Section>
        <Layout.Section>
          <FooterHelp>
            Images and descriptions are from NASA's Astronomy Picture of the Day. Click{' '}
            <Button 
              onClick={() => {
                getMoreApods(dayjs(selectedDates.start).subtract(7, 'day').toString(), 
                             dayjs(selectedDates.start).toString());
              }}
              plain
            >here</Button> to load more.
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
            <DatePicker parentSelectedDates={selectedDates} setParentSelectedDates={setSelectedDates} />
          </Modal.Section>
        </Modal>
      </div>
    </Page>
  );
}
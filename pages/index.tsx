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
  const [apods, setApods] = useState<Apods>([]);
  const handleApodsChange = useCallback((val) => setApods(val), []);

  useEffect(() => {
    if (apods.length < 5) {
      const todayDate = dayjs().format('YYYY-MM-DD');
      const lastWeekDate = dayjs().subtract(7, 'day').format('YYYY-MM-DD');

      const params = 'start_date=' + lastWeekDate + '&end_date=' + todayDate + '&api_key=' + API_KEY.current;
      fetch('https://api.nasa.gov/planetary/apod?' + params)
        .then(response => response.json())
        .then(data => {
          const reverseData = data.reverse();
          handleApodsChange(reverseData)
        });
    }
  }, [])

  const [modalStatus, setModalStatus] = useState(true);
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
        {/* <Layout.Section>
          <FooterHelp>
            For more details on Polaris, visit our{' '}
            <Link url="https://polaris.shopify.com">style guide</Link>.
          </FooterHelp>
        </Layout.Section> */}
      </Layout>
      <div style={{height: '500px'}}>
        <Modal
          activator={modalButtonRef}
          open={modalStatus}
          onClose={handleModalClose}
          title="View more photos by selecting a date below"
          primaryAction={{
            content: 'Select',
            onAction: handleModalClose,
          }}
        >
          <Modal.Section>
            <DatePicker />
          </Modal.Section>
        </Modal>
      </div>
    </Page>
  );
}
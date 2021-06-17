import React from 'react';

export default function useGeolocationInfos() {
  const [data, setData] = React.useState<any>();

  React.useEffect(() => {
    fetch('https://extreme-ip-lookup.com/json/')
      .then((res) => res.json())
      .then((res) => setData(res))
      .catch((err) => {
        console.log('Request failed:', err);
      });
  }, []);

  return data;
}

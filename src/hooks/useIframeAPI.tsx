import React from 'react';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export default function useIframeAPI(id: string) {
  const player: any = React.useRef();

  React.useEffect(() => {
    const loadVideo = () => {
      player.current = new window.YT.Player(id);
    };

    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];

      if (firstScriptTag.parentNode) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      }

      window.onYouTubeIframeAPIReady = loadVideo;
    } else {
      loadVideo();
    }
    //eslint-disable-next-line
  }, []);

  return { player: player.current };
}

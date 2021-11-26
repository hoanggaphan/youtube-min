import { Player } from '@lottiefiles/react-lottie-player';
import React from 'react';
import src from './anime.json';

export default function Anime(): JSX.Element {
  return (
    <Player
      autoplay
      loop
      src={src}
      style={{ height: '200px', width: '200px' }}
    ></Player>
  );
}

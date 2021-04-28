import React from 'react';
import { useParams } from 'react-router';

export default function Video(): JSX.Element {
  const { id } = useParams<{ id: string }>();

  return <div>{id}</div>;
}

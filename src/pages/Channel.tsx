import React from 'react';
import { useParams } from 'react-router';

export default function Channel(): JSX.Element {
  const { id } = useParams<{ id: string }>();

  return <div>Channel - {id}</div>;
}

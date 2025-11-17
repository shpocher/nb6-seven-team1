'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import RecordForm from '../components/RecordForm';
import Timer from './components/Timer';

const GroupRecordsCreatePage = () => {
  const router = useRouter();
  const params = useParams();
  const groupId = Number(params.groupId);
  const [time, setTime] = useState<number>(0);

  const handleTimerSubmit = (time: number) => setTime(time);

  const handleTimerCancle = () =>
    router.push(`/groups/${params.groupId}/records`);

  const handleRecordSubmit = () => {
    router.push(`/groups/${params.groupId}/records`);
  };

  if (!time) {
    return <Timer onSubmit={handleTimerSubmit} onCancle={handleTimerCancle} />;
  }

  return <RecordForm groupId={groupId} time={time} onSubmit={handleRecordSubmit} />;
};

export default GroupRecordsCreatePage;

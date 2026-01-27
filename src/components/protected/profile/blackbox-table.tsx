import ResponsiveTable, { TableColumn } from '@/components/ui/responsive-table';
import { useUserBlackboxProgress } from '@/hooks/blackbox';
import renderTextWithLinks from '@/util/renderLinks';
import { Box, Typography } from '@mui/material';
import Image from 'next/image';
import { ReactNode } from 'react';

interface RewardInfo {
  id: string;
  index: number;
  task: string;
  solution: string;
  reward: string;
  status: 'completed' | 'not_found';
}

export default function BlackboxTable() {
  const { data: blackboxProgress } = useUserBlackboxProgress();

  const formattedData: RewardInfo[] = blackboxProgress?.data.answeredQuestions
    ? blackboxProgress.data.answeredQuestions.map((item, index) => ({
        id: item._id,
        index: index + 1,
        task: item.question,
        solution: item.userAnswer?.userAnswer || '',
        reward: item.secret,
        status: item.userAnswer?.isCorrect ? 'completed' : 'not_found',
      }))
    : [];

  const pendingData: RewardInfo[] = blackboxProgress?.data.nextQuestion
    ? [
        {
          id: blackboxProgress.data.nextQuestion._id,
          index: blackboxProgress.data.answeredCount + 1,
          task: blackboxProgress.data.nextQuestion.question,
          solution: '',
          reward: '',
          status: 'not_found',
        },
      ]
    : [];

  const renderStatus = (status: 'completed' | 'not_found') => (
    <Box
      sx={{
        display: 'inline-flex',
        padding: '0.25rem 0.75rem',
        alignItems: 'center',
        gap: '0.25rem',
        borderRadius: '1rem',
        background: status === 'completed' ? '#2AC318' : '#FFD700',
      }}
    >
      <Typography sx={{ color: '#000', fontSize: '0.75rem', fontWeight: 500 }}>
        {status === 'completed' ? '✓ Completed' : '⚠ Pending'}
      </Typography>
    </Box>
  );

  const mobileRow = (
    name: string,
    value: string | ReactNode,
    icon: string,
    hideBottomBorder?: boolean
  ) => {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.94rem',
          borderBottom: hideBottomBorder ? 'none' : '1px solid #202020',
          padding: '0.81rem 0.75rem',
        }}
      >
        <Image src={icon} alt={name} width={24} height={24} />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <Typography
            sx={{ color: '#FFF', fontFamily: 'Satoshi', fontSize: '0.875rem', opacity: 0.7 }}
          >
            {name}
          </Typography>
          {typeof value === 'string' ? (
            <Typography
              sx={{
                color: '#FFF',
                fontFamily: 'Satoshi',
                fontSize: '1.25rem',
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
                whiteSpace: 'normal',
              }}
            >
              {renderTextWithLinks(value)}
            </Typography>
          ) : (
            value
          )}
        </Box>
      </Box>
    );
  };

  const columns: TableColumn<RewardInfo>[] = [
    {
      header: '#',
      field: 'index',
      mobileField: (item) => (item.index + 1).toString(),
      maxWidth: '3rem',
    },
    {
      header: 'Reward',
      field: (item) => (
        <Typography
          sx={{
            color: '#FFF',
            fontFamily: 'Satoshi',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
            whiteSpace: 'normal',
          }}
        >
          {renderTextWithLinks(item.reward || '-')}
        </Typography>
      ),
      maxWidth: '200px',
    },
    {
      header: 'Task',
      field: (item) => (
        <Typography
          sx={{
            color: '#FFF',
            fontFamily: 'Satoshi',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
            whiteSpace: 'normal',
          }}
        >
          {renderTextWithLinks(item.task || '-')}
        </Typography>
      ),
      hideOnMobile: true,
      maxWidth: '200px',
    },
    {
      header: 'Solution',
      field: (item) => (
        <Typography
          sx={{
            color: '#FFF',
            fontFamily: 'Satoshi',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
            whiteSpace: 'normal',
          }}
        >
          {renderTextWithLinks(item.solution || '-')}
        </Typography>
      ),
      hideOnMobile: true,
      maxWidth: '400px',
    },
    {
      header: 'Status',
      field: (item) => renderStatus(item.status),
      maxWidth: '150px',
    },
  ];

  const renderMobileItem = (item: RewardInfo) => {
    return (
      <Box
        key={item.id}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          padding: '1rem',
          borderRadius: '0.5rem',
          backgroundColor: '#151515',
          border: '1px solid #2AC318',
        }}
      >
        {mobileRow('Reward', item.reward || '-', '/assets/file.svg')}
        {mobileRow('Task', item.task || '-', '/assets/track.svg')}
        {mobileRow('Solution', item.solution || '-', '/assets/track.svg')}
        {mobileRow('Status', renderStatus(item.status), '/assets/calendar.svg', true)}
      </Box>
    );
  };

  return (
    <ResponsiveTable
      columns={columns}
      data={[...formattedData, ...pendingData]}
      emptyMessage="No rewards found"
      mobileLayout={renderMobileItem}
      rowsPerPage={10}
      showPagination={true}
    />
  );
}

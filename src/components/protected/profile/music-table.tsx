import ResponsiveTable, { TableColumn } from '@/components/ui/responsive-table';
import { useGetUserOrders } from '@/hooks/order';
import { getSavedMediaUrl, useDownloadMedia } from '@/hooks/products';
import { Product, ProductType } from '@/lib/api/products';
import { Box, CircularProgress, Typography } from '@mui/material';
import Image from 'next/image';
import { usePlayer } from '@/context/player-context';
import { useState } from 'react';

interface ProductInfo {
  name: string;
  duration: string;
  price: string;
  downloadUrl: string | null;
  id: string;
  createdAt: string;
  index?: number;
  image?: string;
}

export default function MusicTable({ userId }: { userId: string }) {
  const { data: orders, isLoading } = useGetUserOrders(userId, {
    page: 1,
    type: ProductType.DIGITAL,
  });
  const { mutate: downloadMedia } = useDownloadMedia();
  const [downloadingTracks, setDownloadingTracks] = useState<Record<string, boolean>>({});
  const { playTrack } = usePlayer();

  const getProductInfo = (
    product: Product | string,
    createdAt: string | undefined,
    index: number
  ): ProductInfo | null => {
    if (!product || !createdAt) return null;
    if (typeof product === 'string') {
      return {
        name: 'N/A',
        duration: 'N/A',
        price: 'N/A',
        downloadUrl: null,
        id: product,
        createdAt,
        index,
      };
    }
    return {
      name: product.name,
      duration: product.duration || 'N/A',
      price: product.price ? `₦${product.price.toFixed(2)}` : 'N/A',
      downloadUrl: product.digitalDeliveryInfo?.downloadUrl || null,
      id: product._id,
      createdAt,
      index,
      image: product.albumId?.imageUrl || product.albumImage || product.images?.[0] || undefined,
    };
  };

  const handleDownload = (id: string) => {
    if (id) {
      setDownloadingTracks((prev) => ({ ...prev, [id]: true }));
      downloadMedia(
        { id, isDownloaded: true },
        {
          onSuccess: () => {
            setDownloadingTracks((prev) => ({ ...prev, [id]: false }));
          },
          onError: () => {
            setDownloadingTracks((prev) => ({ ...prev, [id]: false }));
          },
        }
      );
    }
  };

  const handlePlay = (item: ProductInfo) => {
    const savedMediaUrl = getSavedMediaUrl(item.id);
    if (savedMediaUrl) {
      playTrack({
        id: item.id,
        title: item.name,
        artist: 'DuGod',
        image: item.image || '/assets/album1.png',
        audioUrl: savedMediaUrl,
      });
    } else {
      downloadMedia(
        { id: item.id, isDownloaded: false },
        {
          onSuccess: (data) => {
            playTrack({
              id: item.id,
              title: item.name,
              artist: 'DuGod',
              image: item.image || '/assets/album1.png',
              audioUrl: data.data.url,
            });
          },
        }
      );
    }
  };

  if (isLoading) {
    return null;
  }

  const tableData: ProductInfo[] =
    orders?.data
      ?.flatMap((order, orderIndex) =>
        order.items
          .filter((item) => item.product)
          .map((item, itemIndex) => {
            const createdDate = order.createdAt ? new Date(order.createdAt) : new Date();
            const index = itemIndex ? 0 : orderIndex + 1;
            return getProductInfo(item.product, createdDate.toISOString(), index);
          })
      )
      .filter((item): item is ProductInfo => item !== null) || [];

  const columns: TableColumn<ProductInfo>[] = [
    {
      header: '#',
      field: 'index',
      mobileField: (item: ProductInfo) => ((item.index || 0) + 1).toString(),
    },
    { header: 'Track', field: 'name' },
    { header: 'Duration', field: 'duration', hideOnMobile: true },
    { header: 'Price', field: 'price', hideOnMobile: true },
    {
      header: 'Date Purchased',
      field: (item) => new Date(item.createdAt).toLocaleDateString(),
      hideOnMobile: true,
    },
    {
      header: 'Action',
      field: (item) => {
        return (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0,
              height: 'auto',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                height: '1.875rem',
                padding: '0.25rem 0.75rem',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '0.625rem',
                borderRadius: '1.25rem',
                background: '#2AC318',
              }}
            >
              <Box
                component="button"
                onClick={() => handleDownload(item.id)}
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '32px',
                  height: '100%',
                  border: 'none',
                  cursor: 'pointer',
                  background: '#2AC318',
                  borderTopLeftRadius: '4px',
                  borderBottomLeftRadius: '4px',
                  '&:hover': {
                    opacity: 0.2,
                  },
                }}
              >
                {downloadingTracks[item.id] ? (
                  <CircularProgress size={24} />
                ) : (
                  <Image src="/assets/download.svg" alt="Download" width={24} height={24} />
                )}
              </Box>
              {item.downloadUrl ? (
                <Box
                  component="button"
                  onClick={() => handlePlay(item)}
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '32px',
                    height: '100%',
                    border: 'none',
                    borderLeft: '1px solid 3F3F3F',
                    cursor: 'pointer',
                    background: '#2AC318',
                    borderTopRightRadius: '4px',
                    borderBottomRightRadius: '4px',
                    '&:hover': {
                      opacity: 0.2,
                    },
                  }}
                >
                  <Image src="/assets/play-dark.svg" alt="Play" width={24} height={24} />
                </Box>
              ) : null}
            </Box>
          </Box>
        );
      },
    },
  ];

  const mobileRow = (name: string, icon: string, hideBottomBorder?: boolean) => {
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
        <Typography sx={{ color: '#FFF', fontFamily: 'Satoshi', fontSize: '1.25rem' }}>
          {name}
        </Typography>
      </Box>
    );
  };

  const mobileAction = (item: ProductInfo) => {
    return (
      <Box
        sx={{
          display: 'flex',
          height: '1.875rem',
          padding: '0.25rem 0.75rem',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '0.625rem',
          borderRadius: '1.25rem',
          background: '#2AC318',
        }}
      >
        <Box
          component="button"
          onClick={() => handleDownload(item.id)}
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            paddingInline: '1rem',
            border: 'none',
            cursor: 'pointer',
            background: '#2AC318',
            borderRight: '1px solid #3F3F3F',
            borderTopLeftRadius: '4px',
            borderBottomLeftRadius: '4px',
            '&:hover': {
              opacity: 0.2,
            },
          }}
        >
          {downloadingTracks[item.id] ? (
            <CircularProgress size={24} />
          ) : (
            <>
              <Image src="/assets/download.svg" alt="Download" width={24} height={24} />
              <Typography
                sx={{
                  color: '#0C0C0C',
                  fontFamily: 'Satoshi',
                  fontSize: '0.75rem',
                  fontWeight: 400,
                }}
              >
                Download
              </Typography>
            </>
          )}
        </Box>
        <Box
          component="button"
          onClick={() => handlePlay(item)}
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            paddingInline: '1rem',
            height: '100%',
            border: 'none',
            cursor: 'pointer',
            background: '#2AC318',
            borderTopRightRadius: '4px',
            borderBottomRightRadius: '4px',
            '&:hover': {
              opacity: 0.2,
            },
          }}
        >
          <Image src="/assets/play-dark.svg" alt="Play" width={24} height={24} />
          <Typography sx={{ color: '#0C0C0C', fontFamily: 'Satoshi', fontSize: '0.75rem' }}>
            Play
          </Typography>
        </Box>
      </Box>
    );
  };

  const renderMobileItem = (item: ProductInfo) => {
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
        {mobileRow(item.name, '/assets/track.svg')}
        {mobileRow(new Date(item.createdAt).toLocaleDateString(), '/assets/calendar.svg')}
        {mobileAction(item)}
      </Box>
    );
  };

  return (
    <ResponsiveTable
      columns={columns}
      data={tableData}
      emptyMessage="No music purchases found"
      mobileLayout={renderMobileItem}
      rowsPerPage={10}
      showPagination={true}
    />
  );
}

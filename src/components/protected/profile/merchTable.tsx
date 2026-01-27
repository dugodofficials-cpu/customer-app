import { Box, Typography, CircularProgress } from '@mui/material';
import { useGetUserOrders } from '@/hooks/order';
import { ProductType, Product } from '@/lib/api/products';
import { Order } from '@/lib/api/order';
import Image from 'next/image';
import ResponsiveTable, { TableColumn } from '@/components/ui/responsive-table';
import { ReactNode, useState } from 'react';
import { useDownloadMedia } from '@/hooks/products';

interface MerchInfo {
  name: string;
  type: string;
  orderId: string;
  eta: string;
  status: string;
  index?: number;
  productType?: ProductType;
  downloadUrl?: string | null;
  productId?: string;
}

export default function MerchTable({ userId }: { userId: string }) {
  const { data: orders, isLoading } = useGetUserOrders(userId, {
    page: 1,
    type: ProductType.PHYSICAL,
    includeBundleItems: true,
  });
  const { mutate: downloadMedia } = useDownloadMedia();
  const [downloadingItems, setDownloadingItems] = useState<Record<string, boolean>>({});

  const getProductInfo = (
    product: Product | string,
    order: Order,
    index: number
  ): MerchInfo | null => {
    if (!product) return null;
    const productObj = typeof product === 'string' ? null : product;
    return {
      name: productObj ? productObj.name : 'N/A',
      type:
        productObj?.type === ProductType.BUNDLE
          ? 'Bundle'
          : productObj?.type !== ProductType.PHYSICAL
            ? 'Digital'
            : 'Merch',
      orderId: order.orderNumber || 'N/A',
      eta: order.shippingDetails?.estimatedDeliveryDate
        ? new Date(order.shippingDetails.estimatedDeliveryDate).toLocaleDateString()
        : 'N/A',
      status: order.status || 'N/A',
      index,
      productType: productObj?.type,
      downloadUrl: productObj?.digitalDeliveryInfo?.downloadUrl || null,
      productId: productObj?._id,
    };
  };

  const handleDownload = (productId: string) => {
    if (productId) {
      setDownloadingItems((prev) => ({ ...prev, [productId]: true }));
      downloadMedia(
        { id: productId, isDownloaded: true },
        {
          onSuccess: () => {
            setDownloadingItems((prev) => ({ ...prev, [productId]: false }));
          },
          onError: () => {
            setDownloadingItems((prev) => ({ ...prev, [productId]: false }));
          },
        }
      );
    }
  };

  if (isLoading) {
    return null;
  }

  const tableData: MerchInfo[] =
    orders?.data
      ?.flatMap((order, orderIndex) =>
        order.items
          .filter((item) => item.product)
          .map((item, itemIndex) => {
            const index = itemIndex ? 0 : orderIndex + 1;
            return getProductInfo(item.product, order, index);
          })
      )
      .filter((item): item is MerchInfo => item !== null) || [];

  const renderStatus = (status: string) => (
    <Box
      sx={{
        display: 'inline-flex',
        padding: '0.25rem 0.75rem',
        alignItems: 'center',
        gap: '0.25rem',
        borderRadius: '1rem',
        background: status === 'DELIVERED' ? '#2AC318' : '#FFD700',
      }}
    >
      <Typography sx={{ color: '#000', fontSize: '0.75rem', fontWeight: 500 }}>
        {status === 'DELIVERED' ? '✓ Delivered' : status}
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
            <Typography sx={{ color: '#FFF', fontFamily: 'Satoshi', fontSize: '1.25rem' }}>
              {value}
            </Typography>
          ) : (
            value
          )}
        </Box>
      </Box>
    );
  };

  const columns: TableColumn<MerchInfo>[] = [
    {
      header: '#',
      field: 'index',
      mobileField: (item: MerchInfo) => ((item.index || 0) + 1).toString(),
    },
    { header: 'Item', field: 'name' },
    { header: 'Type', field: 'type', hideOnMobile: true },
    { header: 'Order ID', field: 'orderId' },
    { header: 'ETA', field: 'eta', hideOnMobile: true },
    {
      header: 'Status',
      field: (item) => renderStatus(item.status),
    },
    {
      header: 'Action',
      field: (item) => {
        if (
          !item.productId ||
          [ProductType.PHYSICAL, ProductType.BUNDLE].includes(item.productType as ProductType)
        ) {
          return null;
        }
        return (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box
              component="button"
              onClick={() => handleDownload(item.productId!)}
              disabled={downloadingItems[item.productId!]}
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '1.875rem',
                padding: '0.25rem 0.75rem',
                borderRadius: '1.25rem',
                background: '#2AC318',
                border: 'none',
                cursor: downloadingItems[item.productId!] ? 'not-allowed' : 'pointer',
                opacity: downloadingItems[item.productId!] ? 0.7 : 1,
                '&:hover': {
                  opacity: downloadingItems[item.productId!] ? 0.7 : 0.8,
                },
              }}
            >
              {downloadingItems[item.productId!] ? (
                <CircularProgress size={16} sx={{ color: '#000' }} />
              ) : (
                <Image src="/assets/download.svg" alt="Download" width={16} height={16} />
              )}
            </Box>
          </Box>
        );
      },
      hideOnMobile: false,
    },
  ];

  const renderMobileItem = (item: MerchInfo) => {
    return (
      <Box
        key={item.orderId}
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
        {mobileRow('Item', item.name, '/assets/shirt.svg')}
        {mobileRow('Order ID', item.orderId, '/assets/tag.svg')}
        {mobileRow('Status', renderStatus(item.status), '/assets/hourglass.svg')}
        {item.productId && item.productType !== ProductType.PHYSICAL && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.94rem',
              padding: '0.81rem 0.75rem',
            }}
          >
            <Image src="/assets/download.svg" alt="Download" width={24} height={24} />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
              <Typography
                sx={{ color: '#FFF', fontFamily: 'Satoshi', fontSize: '0.875rem', opacity: 0.7 }}
              >
                Download
              </Typography>
              <Box
                component="button"
                onClick={() => handleDownload(item.productId!)}
                disabled={downloadingItems[item.productId!]}
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '1.875rem',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '1.25rem',
                  background: '#2AC318',
                  border: 'none',
                  cursor: downloadingItems[item.productId!] ? 'not-allowed' : 'pointer',
                  opacity: downloadingItems[item.productId!] ? 0.7 : 1,
                  width: 'fit-content',
                  '&:hover': {
                    opacity: downloadingItems[item.productId!] ? 0.7 : 0.8,
                  },
                }}
              >
                {downloadingItems[item.productId!] ? (
                  <CircularProgress size={16} sx={{ color: '#000' }} />
                ) : (
                  <Typography
                    sx={{
                      color: '#000',
                      fontFamily: 'Manrope',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                    }}
                  >
                    Download
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    );
  };

  return (
    <ResponsiveTable
      columns={columns}
      data={tableData}
      emptyMessage="No orders found"
      mobileLayout={renderMobileItem}
      rowsPerPage={10}
      showPagination={true}
    />
  );
}

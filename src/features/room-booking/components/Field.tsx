import { css } from '@emotion/react';
import { Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { ComponentProps, ReactNode } from 'react';

const Field = ({
  children,
  label,
  containerProps,
}: {
  children: ReactNode;
  label: string;
  containerProps?: ComponentProps<'div'>;
}) => {
  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        gap: 6px;
      `}
      {...containerProps}
    >
      <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>
        {label}
      </Text>
      {children}
    </div>
  );
};

export default Field;

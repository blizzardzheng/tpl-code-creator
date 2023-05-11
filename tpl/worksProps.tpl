import { useMemo } from 'react';

export const propsConfig = {
  default: () => (__BLOCK__),
};

function useComponentProps<T extends keyof typeof propsConfig>(name: T) {
  const createProps = propsConfig[name] as typeof propsConfig[T];
  return useMemo(() => createProps(), []);
}
export default useComponentProps;
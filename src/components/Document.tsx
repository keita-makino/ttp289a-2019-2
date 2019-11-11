import React from 'react';
import One from '../document/1.mdx';
import Two from '../document/2.mdx';
import Three from '../document/3.mdx';

type PropsBase = {};
export const defaultValue = {};
const PropsDefault: Required<Pick<
  PropsBase,
  { [Key in keyof PropsBase]-?: Key }[keyof PropsBase]
>> = defaultValue;
type Props = PropsBase & typeof PropsDefault;

export { defaultValue as documentDefaultValue };
export type documentProps = Props;

const Document: React.FC<Props> = (_props: PropsBase) => {
  const props = _props as Props;

  return (
    <>
      <One />
      <Two />
      <Three />
    </>
  );
};
Document.defaultProps = defaultValue;

export default Document;

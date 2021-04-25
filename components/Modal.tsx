import { ExitIcon } from '@tastiest-io/tastiest-icons';
import classNames from 'classnames';
import React, { ReactNode, useRef } from 'react';
import { useClickAway, useKey } from 'react-use';
import { UI } from '../constants';

interface Props {
  isOpen: boolean;
  children: ReactNode;
  // size: 'small' | 'regular' | 'large';
  className?: string;
  close?: () => void;
}

export function Modal(props: Props) {
  const { isOpen, close, className, children } = props;

  const ref = useRef(null);
  const boxRef = useRef(null);
  useKey('Escape', close);
  useClickAway(boxRef, close);
  // useLockBodyScroll(isOpen);

  const padding = UI.PAGE_CONTAINED_PADDING_VW;

  if (!isOpen) {
    return null;
  }

  return (
    <div
      ref={ref}
      style={{
        zIndex: UI.Z_INDEX_MODAL_OVERLAY,
        paddingLeft: `${padding}vw`,
        paddingRight: `${padding}vw`,
      }}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-25"
    >
      <div
        ref={boxRef}
        className={classNames(
          'relative whitespace-normal border-2 border-gray px-6 pb-4 pt-12 bg-white',
          className,
        )}
      >
        <div className="absolute top-0 right-0 z-0 flex justify-end pt-3 pr-3">
          <ExitIcon
            onClick={close}
            className="h-8 cursor-pointer fill-current text-primary"
          />
        </div>
        {children}
      </div>
    </div>
  );
}

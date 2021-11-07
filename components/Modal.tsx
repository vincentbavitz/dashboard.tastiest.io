import { ExitIcon } from '@tastiest-io/tastiest-icons';
import classNames from 'classnames';
import clsx from 'clsx';
import { useScreenSize } from 'hooks/useScreen';
import React, {
  BaseSyntheticEvent,
  CSSProperties,
  ReactNode,
  useRef,
} from 'react';
import ReactDOM from 'react-dom';
import { Transition, TransitionStatus } from 'react-transition-group';
import { useKey } from 'react-use';
import { UI } from '../constants';

interface Props {
  id: string;
  isOpen: boolean;
  children: ReactNode;
  // size: 'small' | 'regular' | 'large';
  title?: string;
  preload?: boolean; // should we load it in the DOM before isOpen?
  className?: string;
  onMobileFullscreen?: boolean;
  noPadding?: boolean;
  close?: () => void;
}

type TransitionStatusMap = { [K in TransitionStatus]: CSSProperties };

export function Modal(props: Props) {
  const { id, isOpen, preload = false, onMobileFullscreen, close } = props;
  const { isMobile } = useScreenSize();

  const ref = useRef(null);
  const padding =
    onMobileFullscreen && isMobile ? 0 : UI.PAGE_CONTAINED_PADDING_VW;

  const duration = 300;
  const defaultStyle = {
    transition: `opacity ${duration}ms ease-in-out`,
    opacity: 0,
    zIndex: UI.Z_INDEX_MODAL_OVERLAY,
    display: 'none',
    paddingLeft: `${padding}vw`,
    paddingRight: `${padding}vw`,
  };

  const transitionStyles: Partial<TransitionStatusMap> = {
    entering: { opacity: 0, display: 'flex' },
    entered: { opacity: 1, display: 'flex' },
    exiting: { opacity: 0, display: 'flex' },
    exited: { opacity: 0, display: 'none' },
  };

  // Close when the user clicks outside the modal.
  const containerId = `modal-container-${id}`;
  const onClickedAway = (e: BaseSyntheticEvent) => {
    if (e.target.id === containerId) {
      close();
    }
  };

  if (
    typeof document === 'undefined' ||
    !document.getElementById('modal-root')
  ) {
    return null;
  }

  return ReactDOM.createPortal(
    <Transition
      in={isOpen}
      timeout={{
        appear: 100,
        enter: duration,
        exit: duration,
      }}
      unmountOnExit={!preload}
    >
      {state => (
        <div
          id={containerId}
          ref={ref}
          style={{
            ...defaultStyle,
            ...transitionStyles[state],
          }}
          className={clsx(
            'fixed inset-0 flex items-center justify-center bg-black bg-opacity-25',
          )}
          onClick={e => onClickedAway(e)}
        >
          <ModalInner {...props} />
        </div>
      )}
    </Transition>,
    document.getElementById('modal-root'),
  );
}

const ModalInner = (props: Props) => {
  const {
    id,
    title,
    isOpen,
    close,
    className,
    children,
    noPadding,
    onMobileFullscreen,
  } = props;

  const { isMobile } = useScreenSize();
  const boxRef = useRef(null);

  useKey('Escape', () => {
    close();
  });

  return (
    <div
      ref={boxRef}
      style={{
        height: onMobileFullscreen && isMobile ? '100%' : 'unset',
        width: onMobileFullscreen && isMobile ? '100vw' : 'unset',
      }}
      className={classNames(
        'relative border-2 border-gray pt-12 bg-white',
        !noPadding && 'px-6 pb-4',
        className,
      )}
    >
      <div className="absolute top-0 left-0 right-0 z-0 flex items-center justify-between px-3 pt-3">
        <div className="w-6"></div>
        <div className="text-xl font-medium">{title}</div>
        <ExitIcon
          onClick={close}
          className="w-6 cursor-pointer fill-current text-primary"
        />
      </div>
      {children}
    </div>
  );
};

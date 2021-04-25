import { Button, Input } from '@tastiest-io/tastiest-components';
import { CheckFilledIcon } from '@tastiest-io/tastiest-icons';
import clsx from 'clsx';
import { Modal } from 'components/Modal';
import React, { useState } from 'react';

export const HasArrivedCell = ({
  value: initialValue,
  row: { index, original: booking },
  column: { id },
  updateData,
}: {
  value: number | null;
  row: any;
  column: any;
  updateData: any;
}) => {
  const code = booking.confirmationCode;
  const [typedCode, setTypedCode] = useState<string>();
  const [codeError, setCodeError] = useState<string>();

  const [modalIsOpen, setModalIsOpen] = useState(false);

  // We need to keep and update the state of the cell normally
  const [arrived, setArrived] = React.useState(initialValue ?? false);

  // Update locally and on server side on change
  const onClickIcon = () => {
    // Open confirmation modal if not confirmed
    if (!arrived && !modalIsOpen) {
      setModalIsOpen(true);
      return;
    }

    if (arrived) {
      setTypedCode(null);
      setArrived(false);
      updateData(false, index, id);
    }
  };

  const submitCode = () => {
    setCodeError(null);

    if (typedCode?.length && typedCode !== code) {
      setCodeError('Invalid confirmation code');
      return;
    }

    // Code success!
    setModalIsOpen(false);
    setArrived(true);
    updateData(true, index, id);
  };

  // If the initialValue is changed external, sync it up with our state
  React.useEffect(() => {
    setArrived(initialValue ?? false);
  }, [initialValue]);

  return (
    <div className="flex items-center justify-center">
      <Modal isOpen={modalIsOpen} close={() => setModalIsOpen(false)}>
        <div
          style={{ maxWidth: '25rem' }}
          className="flex flex-col mt-4 space-y-6"
        >
          <div>
            <p className="text-xl font-medium text-gray-700">
              Confirmation Code
              <br />
            </p>
            <p className="text-sm text-gray-600">
              The user should quote this code from <br /> their email
              confirmation.
            </p>

            {codeError && (
              <div className="pt-3">
                <p className="text-sm text-danger">{codeError}</p>
              </div>
            )}
          </div>

          <div className="flex justify-center space-x-2">
            <div className="flex-1">
              <Input
                center
                value={typedCode}
                onValueChange={setTypedCode}
                placeholder={'0000'}
                maxLength={4}
                size="large"
              />
            </div>
            <Button color="primary" onClick={submitCode}>
              OK
            </Button>
          </div>
        </div>
      </Modal>

      <CheckFilledIcon
        onClick={onClickIcon}
        className={clsx(
          'fill-current w-8 cursor-pointer',
          arrived ? 'text-primary' : 'text-gray-300',
        )}
      />
    </div>
  );
};

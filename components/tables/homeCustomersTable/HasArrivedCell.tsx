import { CheckFilledIcon } from '@tastiest-io/tastiest-icons';
import { Button, Input, Modal, Tooltip } from '@tastiest-io/tastiest-ui';
import clsx from 'clsx';
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

    if (!typedCode?.length) {
      return;
    }

    if (typedCode !== code) {
      setCodeError('Incorrect confirmation code');
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

  const buttonDisabled = booking.hasCancelled || arrived;

  return (
    <div className="flex items-center justify-center">
      <Modal
        title="Confirmation Code"
        show={modalIsOpen}
        close={() => setModalIsOpen(false)}
      >
        <div style={{ maxWidth: '25rem' }} className="flex flex-col space-y-6">
          <p className="text-base text-gray-600 pt-4">
            Please ask the customer for the code they got in <br />
            their confirmation email
          </p>

          <div className="flex justify-center">
            <div className="w-20">
              <Input
                center
                value={typedCode}
                onValueChange={setTypedCode}
                onChange={() => setCodeError(null)}
                placeholder={'0000'}
                maxLength={4}
                size="large"
                inputClassName="text-lg"
                formatter={value => (isNaN(value as any) ? '' : value)}
                error={codeError}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <Button color="primary" onClick={submitCode}>
              Confirm
            </Button>

            <Button color="light" onClick={() => setModalIsOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>

      <Tooltip
        show={buttonDisabled ? undefined : false}
        content="You can't modify a booking after the customer has arrived or cancelled."
      >
        <CheckFilledIcon
          onClick={buttonDisabled ? null : onClickIcon}
          className={clsx(
            'fill-current w-8',
            arrived ? 'text-primary' : 'text-gray-300',
            buttonDisabled ? '' : 'cursor-pointer',
          )}
        />
      </Tooltip>
    </div>
  );
};

import { PlusOutlined } from '@ant-design/icons';
import { Button, Input } from '@tastiest-io/tastiest-components';
import { Modal } from 'components/Modal';
import React, { useState } from 'react';

interface Props {
  str?: string;
}

export default function PaymentCard(props: Props) {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const onClickAdd = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setAddModalOpen(false);
    }, 2000);
  };

  return (
    <>
      <div
        onClick={() => setAddModalOpen(true)}
        className="relative w-full cursor-pointer"
      >
        <div className="">
          <div
            style={{ borderRadius: '1rem' }}
            className="aspect-w-8 aspect-h-5 bg-gray-300 filter duration-300 hover:brightness-95"
          >
            <div className="flex justify-center items-center">
              <PlusOutlined className="text-7xl text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      <Modal
        title="New Payment Card"
        isOpen={addModalOpen}
        close={() => setAddModalOpen(false)}
      >
        <div className="pt-6 flex flex-col space-y-4">
          <Input label="Card Number" className="bg-gray-200" value="" />
          <Input label="Cardholder's Name" className="bg-gray-200" value="" />

          <div className="flex space-x-8">
            <div className="w-20">
              <Input
                label="Expiry"
                style={{ background: 'rgb(229, 231, 235)' }}
                placeholder="12/33"
                value=""
              />
            </div>

            <div className="w-16">
              <Input
                label="BSB"
                style={{ background: 'rgb(229, 231, 235)' }}
                placeholder="123"
                value=""
              />
            </div>
          </div>
        </div>

        <div className="flex pt-8 justify-end space-x-4">
          <Button onClick={onClickAdd} loading={loading}>
            Add
          </Button>
          <Button onClick={() => setAddModalOpen(false)} color="light">
            Cancel
          </Button>
        </div>
      </Modal>
    </>
  );
}

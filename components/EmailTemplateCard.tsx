import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { EmailTemplate } from '@tastiest-io/tastiest-utils';
import clsx from 'clsx';
import Link from 'next/link';
import React, { useState } from 'react';
import { ConfirmationModal } from './ConfirmationModal';
import IconButton from './IconButton';

interface EmailTemplateCardProps {
  id: string;
  restaurantId: string;
  template: EmailTemplate;
  description?: string;
  imageSrc?: string;
  onClick?: () => void;
  onClickDelete?: (id: string) => void;
}

export const EmailTemplateCard = (props: EmailTemplateCardProps) => {
  const { id, onClickDelete, template, description, onClick } = props;
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  return (
    <>
      <div onClick={onClick} className="relative w-full">
        <div
          style={{ minHeight: '12rem' }}
          className="flex justify-center items-center relative bg-light shadow-lg filter duration-300 hover:brightness-105 rounded-lg"
        >
          <div className="relative">{template.name}</div>

          <div className="absolute inset-0 flex items-end">
            <div className="flex items-center justify-center h-10 px-6 mb-3 w-full">
              <p className="italic text-sm text-center opacity-50">
                {description}
              </p>
            </div>
          </div>
        </div>

        <div
          className={clsx(
            'absolute inset-0 flex items-end pb-2 pl-4 pr-2',
            template.isApproved ? 'justify-end' : 'justify-between',
          )}
        >
          {template.isApproved ? null : (
            <div className="flex items-center space-x-2 mb-2 leading-none text-sm">
              <div className="inline-block w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="opacity-50">Awaiting approval</span>
            </div>
          )}

          <div className="flex space-x-2">
            <Link href={`/followers/templates/${id}`}>
              <a>
                <IconButton theme="secondary" icon={EditOutlined} />
              </a>
            </Link>

            <IconButton
              theme="danger"
              icon={DeleteOutlined}
              onClick={() => setIsDeleteModalOpen(true)}
            />
          </div>
        </div>
      </div>

      {/* Confirmation modal to delete */}
      <ConfirmationModal
        title="Delete Template?"
        onAccept={() => {
          onClickDelete(id);
          setIsDeleteModalOpen(false);
        }}
        onReject={() => setIsDeleteModalOpen(false)}
        acceptText="Yes"
        rejectText="No"
        isOpen={isDeleteModalOpen}
        close={() => setIsDeleteModalOpen(false)}
      >
        <div className="pt-4 pb-2 text-center">
          Are you sure you want to delete <br />
          <span className="font-medium">{template.name}</span>?
        </div>
      </ConfirmationModal>
    </>
  );
};

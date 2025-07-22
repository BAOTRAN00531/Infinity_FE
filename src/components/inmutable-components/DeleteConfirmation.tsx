import React from 'react';
import { Button_admin } from '@/components/reusable-components/button_admin';

interface DeleteConfirmationProps {
    userName: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({ userName, onConfirm, onCancel }) => {
    return (
        <div className="space-y-4">
            <p className="text-sm text-gray-600">
                Are you sure you want to delete <span className="font-semibold text-gray-900">{userName}</span>?
                This action cannot be undone.
            </p>

            <div className="flex justify-end space-x-2">
                <Button_admin variant="outline" onClick={onCancel}>
                    Cancel
                </Button_admin>
                <Button_admin
                    variant="destructive"
                    onClick={onConfirm}
                >
                    Delete
                </Button_admin>
            </div>
        </div>
    );
};

export default DeleteConfirmation;
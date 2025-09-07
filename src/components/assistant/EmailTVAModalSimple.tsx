import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Mail, X } from 'lucide-react';

interface EmailTVAModalSimpleProps {
  isOpen: boolean;
  onClose: () => void;
}

const EmailTVAModalSimple: React.FC<EmailTVAModalSimpleProps> = ({ isOpen, onClose }) => {
  console.log("EmailTVAModalSimple rendered with isOpen:", isOpen);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Mail className="w-5 h-5" />
            <span>Préparer Emails TVA</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          <p>Modal de test pour préparer les emails TVA.</p>
          <p>Si vous voyez cette fenêtre, les boutons d'action fonctionnent !</p>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              <X className="w-4 h-4 mr-2" />
              Fermer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmailTVAModalSimple;

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { X, Plus, Edit3, Trash2, MessageSquare, AlertTriangle } from 'lucide-react';

export interface Annotation {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  comment: string;
  type: 'highlight' | 'outline'; // surlignage jaune ou contour rouge
}

interface ImageAnnotatorProps {
  imageUrl: string;
  annotations: Annotation[];
  onAnnotationsChange: (annotations: Annotation[]) => void;
  readonly?: boolean;
}

const ImageAnnotator: React.FC<ImageAnnotatorProps> = ({
  imageUrl,
  annotations,
  onAnnotationsChange,
  readonly = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentAnnotation, setCurrentAnnotation] = useState<Partial<Annotation> | null>(null);
  const [selectedAnnotation, setSelectedAnnotation] = useState<Annotation | null>(null);
  const [showCommentDialog, setShowCommentDialog] = useState(false);
  const [tempComment, setTempComment] = useState('');
  const [tempAnnotationType, setTempAnnotationType] = useState<'highlight' | 'outline'>('highlight');
  const [imageLoaded, setImageLoaded] = useState(false);

  const annotationStyles = {
    'highlight': {
      fillColor: '#fef08a', // jaune clair
      strokeColor: '#eab308', // jaune foncé
      alpha: '80' // transparence pour le remplissage
    },
    'outline': {
      fillColor: 'transparent',
      strokeColor: '#ef4444', // rouge
      alpha: '00' // pas de remplissage
    }
  };

  useEffect(() => {
    if (imageLoaded) {
      drawCanvas();
    }
  }, [annotations, imageLoaded]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!canvas || !image) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Ajuster la taille du canvas à l'image
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;

    // Nettoyer le canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dessiner les annotations
    annotations.forEach((annotation, index) => {
      const style = annotationStyles[annotation.type];
      
      // Style selon le type
      ctx.strokeStyle = style.strokeColor;
      ctx.lineWidth = annotation.type === 'outline' ? 4 : 2;
      
      // Rectangle de contour
      ctx.strokeRect(annotation.x, annotation.y, annotation.width, annotation.height);
      
      // Remplissage pour surlignage
      if (annotation.type === 'highlight') {
        ctx.fillStyle = style.fillColor + style.alpha;
        ctx.fillRect(annotation.x, annotation.y, annotation.width, annotation.height);
      }
      
      // Numéro
      ctx.fillStyle = annotation.type === 'highlight' ? '#92400e' : '#dc2626'; // brun pour jaune, rouge foncé pour rouge
      ctx.font = 'bold 16px Arial';
      ctx.fillText((index + 1).toString(), annotation.x + 5, annotation.y + 20);
    });
  };

  const getRelativeCoordinates = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!canvas || !image) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = image.naturalWidth / rect.width;
    const scaleY = image.naturalHeight / rect.height;
    
    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY
    };
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (readonly) return;
    
    const coords = getRelativeCoordinates(event);
    setIsDrawing(true);
    setCurrentAnnotation({
      id: `ann_${Date.now()}`,
      x: coords.x,
      y: coords.y,
      width: 0,
      height: 0
    });
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentAnnotation || readonly) return;
    
    const coords = getRelativeCoordinates(event);
    setCurrentAnnotation(prev => ({
      ...prev,
      width: coords.x - (prev?.x || 0),
      height: coords.y - (prev?.y || 0)
    }));
    
    // Redessiner avec l'annotation temporaire
    drawCanvas();
    if (currentAnnotation.x !== undefined && currentAnnotation.y !== undefined) {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(
          currentAnnotation.x,
          currentAnnotation.y,
          coords.x - currentAnnotation.x,
          coords.y - currentAnnotation.y
        );
        ctx.setLineDash([]);
      }
    }
  };

  const handleMouseUp = () => {
    if (!isDrawing || !currentAnnotation || readonly) return;
    
    if (Math.abs(currentAnnotation.width || 0) > 10 && Math.abs(currentAnnotation.height || 0) > 10) {
      setTempComment('');
      setTempErrorType('Erreur');
      setShowCommentDialog(true);
    }
    
    setIsDrawing(false);
  };

  const saveAnnotation = () => {
    if (!currentAnnotation) return;
    
    const newAnnotation: Annotation = {
      id: currentAnnotation.id || `ann_${Date.now()}`,
      x: currentAnnotation.x || 0,
      y: currentAnnotation.y || 0,
      width: currentAnnotation.width || 0,
      height: currentAnnotation.height || 0,
      comment: tempComment,
      type: tempAnnotationType
    };
    
    onAnnotationsChange([...annotations, newAnnotation]);
    setCurrentAnnotation(null);
    setShowCommentDialog(false);
  };

  const deleteAnnotation = (annotationId: string) => {
    onAnnotationsChange(annotations.filter(ann => ann.id !== annotationId));
    setSelectedAnnotation(null);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <div className="space-y-4">
      <div className="relative border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
        <img
          ref={imageRef}
          src={imageUrl}
          alt="Image à annoter"
          className="w-full h-auto max-h-64 object-contain"
          onLoad={handleImageLoad}
          style={{ display: 'block' }}
        />
        
        {imageLoaded && (
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full cursor-crosshair"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            style={{ 
              maxHeight: '256px',
              objectFit: 'contain'
            }}
          />
        )}
        
        {!readonly && (
          <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
            Cliquez et glissez pour annoter
          </div>
        )}
      </div>

      {/* Liste des annotations */}
      {annotations.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h4 className="font-semibold mb-3 flex items-center">
              <MessageSquare className="w-4 h-4 mr-2" />
              Annotations ({annotations.length})
            </h4>
            <div className="space-y-2">
              {annotations.map((annotation, index) => (
                <div
                  key={annotation.id}
                  className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50"
                >
                  <Badge 
                    className={`min-w-[24px] h-6 flex items-center justify-center text-white ${
                      annotation.type === 'highlight' 
                        ? 'bg-yellow-500' 
                        : 'bg-red-500'
                    }`}
                  >
                    {index + 1}
                  </Badge>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <Badge 
                        variant="outline"
                        className={`text-xs ${
                          annotation.type === 'highlight' 
                            ? 'border-yellow-200 text-yellow-700 bg-yellow-50' 
                            : 'border-red-200 text-red-700 bg-red-50'
                        }`}
                      >
                        {annotation.type === 'highlight' ? '🟡 Surligné' : '🔴 Entouré'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700">{annotation.comment}</p>
                  </div>
                  
                  {!readonly && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteAnnotation(annotation.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dialog pour ajouter un commentaire */}
      <Dialog open={showCommentDialog} onOpenChange={setShowCommentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Annoter la zone sélectionnée</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Type d'annotation</label>
              <div className="flex space-x-2 mt-2">
                <Button
                  size="sm"
                  variant={tempAnnotationType === 'highlight' ? 'default' : 'outline'}
                  onClick={() => setTempAnnotationType('highlight')}
                  className={tempAnnotationType === 'highlight' ? 'bg-yellow-500 hover:bg-yellow-600 border-yellow-500' : 'border-yellow-300 text-yellow-700 hover:bg-yellow-50'}
                >
                  🟡 Surligner
                </Button>
                <Button
                  size="sm"
                  variant={tempAnnotationType === 'outline' ? 'default' : 'outline'}
                  onClick={() => setTempAnnotationType('outline')}
                  className={tempAnnotationType === 'outline' ? 'bg-red-500 hover:bg-red-600 border-red-500' : 'border-red-300 text-red-700 hover:bg-red-50'}
                >
                  🔴 Entourer
                </Button>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Commentaire</label>
              <Textarea
                value={tempComment}
                onChange={(e) => setTempComment(e.target.value)}
                placeholder="Décrivez l'erreur ou le point d'attention..."
                className="mt-1"
                rows={3}
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowCommentDialog(false)}>
                Annuler
              </Button>
              <Button onClick={saveAnnotation} disabled={!tempComment.trim()}>
                Ajouter annotation
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImageAnnotator;

import { useState, useCallback } from 'react';

export const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen(prev => !prev), []);

  return {
    isOpen,
    open,
    close,
    toggle
  };
};

export const useBudgetModal = () => {
  const modal = useModal();
  const [currentStep, setCurrentStep] = useState(1);

  const nextStep = useCallback(() => {
    setCurrentStep(prev => Math.min(4, prev + 1));
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  }, []);

  const resetStep = useCallback(() => {
    setCurrentStep(1);
  }, []);

  const goToStep = useCallback((step: number) => {
    if (step >= 1 && step <= 4) {
      setCurrentStep(step);
    }
  }, []);

  return {
    ...modal,
    currentStep,
    nextStep,
    prevStep,
    resetStep,
    goToStep,
    isFirstStep: currentStep === 1,
    isLastStep: currentStep === 4
  };
};

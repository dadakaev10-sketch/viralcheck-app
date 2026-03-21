'use client';
import React, { useState, Children, useRef, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import './Stepper.css';

const stepVariants = {
  enter: dir => ({ x: dir >= 0 ? '-60%' : '60%', opacity: 0 }),
  center: { x: '0%', opacity: 1 },
  exit: dir => ({ x: dir >= 0 ? '40%' : '-40%', opacity: 0 }),
};

function SlideTransition({ children, direction, onHeightReady }) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    if (ref.current) onHeightReady(ref.current.offsetHeight);
  }, [children, onHeightReady]);
  return (
    <motion.div
      ref={ref}
      custom={direction}
      variants={stepVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.35 }}
      style={{ position: 'absolute', left: 0, right: 0, top: 0 }}
    >
      {children}
    </motion.div>
  );
}

function StepContentWrapper({ currentStep, direction, children, isCompleted }) {
  const [height, setHeight] = useState(0);
  return (
    <motion.div
      className="vc-step-content-wrapper"
      animate={{ height: isCompleted ? 0 : height }}
      transition={{ type: 'spring', duration: 0.4 }}
    >
      <AnimatePresence initial={false} mode="sync" custom={direction}>
        {!isCompleted && (
          <SlideTransition key={currentStep} direction={direction} onHeightReady={setHeight}>
            {children}
          </SlideTransition>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}

export function Step({ children }) {
  return <div className="vc-step-inner">{children}</div>;
}

export default function Stepper({
  children,
  initialStep = 1,
  onStepChange = () => {},
  onFinalStepCompleted = () => {},
  backButtonText = 'Zurück',
  nextButtonText = 'Weiter',
  nextDisabled = false,
  stepLabels = [],
}) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [direction, setDirection] = useState(1);
  const stepsArray = Children.toArray(children);
  const total = stepsArray.length;
  const isCompleted = currentStep > total;
  const isLast = currentStep === total;

  const go = (next) => {
    setCurrentStep(next);
    if (next > total) onFinalStepCompleted();
    else onStepChange(next);
  };

  const back = () => {
    if (currentStep > 1) { setDirection(-1); go(currentStep - 1); }
  };
  const next = () => {
    if (!isLast) { setDirection(1); go(currentStep + 1); }
  };
  const complete = () => { setDirection(1); go(total + 1); };

  return (
    <div className="vc-stepper-outer">
      {/* Step indicators */}
      <div className="vc-step-indicator-row">
        {stepsArray.map((_, i) => {
          const n = i + 1;
          const status = currentStep === n ? 'active' : currentStep > n ? 'complete' : 'inactive';
          return (
            <React.Fragment key={n}>
              <div className="flex flex-col items-center gap-1">
                <div className={`vc-step-indicator-inner ${status}`}>
                  {status === 'complete' ? <CheckIcon /> : <span>{n}</span>}
                </div>
                {stepLabels[i] && (
                  <span className={`vc-step-label ${status === 'inactive' ? 'text-[#9896ab]' : 'text-[#3d3a52]'}`}>
                    {stepLabels[i]}
                  </span>
                )}
              </div>
              {i < stepsArray.length - 1 && (
                <div className="vc-step-connector">
                  <div className="vc-step-connector-fill" style={{ width: currentStep > n ? '100%' : '0%' }} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Content */}
      <StepContentWrapper currentStep={currentStep} direction={direction} isCompleted={isCompleted}>
        {stepsArray[currentStep - 1]}
      </StepContentWrapper>

      {/* Footer */}
      {!isCompleted && (
        <div className="vc-footer">
          <div className={`vc-footer-nav ${currentStep > 1 ? 'spread' : ''}`}>
            {currentStep > 1 && (
              <button className="vc-back-btn" onClick={back}>{backButtonText}</button>
            )}
            <button
              className="vc-next-btn"
              onClick={isLast ? complete : next}
              disabled={nextDisabled}
            >
              {isLast ? '✨ Analysieren' : nextButtonText} →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

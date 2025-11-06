import React from 'react'

const Stepper = ({ steps, currentStep, onStepClick, completedSteps = [] }) => {
  return (
    <div className="stepper-container">
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => {
          const stepNumber = index + 1
          const isActive = currentStep === index
          const isCompleted = completedSteps.includes(index)
          const isClickable = onStepClick && (isCompleted || index < currentStep || index === currentStep)
          const isIncomplete = index > currentStep && !isCompleted

          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center">
                <div
                  className={`
                    stepper-step
                    ${isActive ? 'stepper-step-active' : ''}
                    ${isCompleted ? 'stepper-step-completed' : ''}
                    ${isClickable ? 'stepper-step-clickable cursor-pointer' : ''}
                    ${isIncomplete ? 'stepper-step-incomplete opacity-50' : ''}
                  `}
                  onClick={isClickable ? () => onStepClick(index) : undefined}
                >
                  {isCompleted ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <span className="stepper-step-number">{stepNumber}</span>
                  )}
                </div>
                <div className="stepper-label-container">
                  <div
                    className={`
                      stepper-label
                      ${isActive ? 'stepper-label-active' : ''}
                      ${isCompleted ? 'stepper-label-completed' : ''}
                    `}
                  >
                    {step.title}
                  </div>
                  <div className="stepper-description text-xs text-gray-500 mt-1">
                    {step.description}
                  </div>
                </div>
              </div>

              {index < steps.length - 1 && (
                <div
                  className={`
                    stepper-connector
                    ${isCompleted || (index < currentStep) ? 'stepper-connector-active' : ''}
                  `}
                />
              )}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}

export default Stepper

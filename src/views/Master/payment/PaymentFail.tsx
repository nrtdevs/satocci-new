import { useState, useEffect } from 'react'
import { XCircle, RefreshCw, MessageCircle, ArrowLeft, AlertCircle } from 'react-feather'

const PaymentFailed = () => {
  const [showAnimation, setShowAnimation] = useState(false)
  const [showContent, setShowContent] = useState(false)
  const [isRetrying, setIsRetrying] = useState(false)

  useEffect(() => {
    setTimeout(() => setShowAnimation(true), 200)
    setTimeout(() => setShowContent(true), 800)
  }, [])

  const handleRetryPayment = () => {
    setIsRetrying(true)
    setTimeout(() => {
      setIsRetrying(false)
      console.log('Retry payment logic executed.')
    }, 2000)
  }

  const handleContactSupport = () => {
    console.log('Opening support contact...')
  }

  const handleGoBack = () => {
    console.log('Going back to checkout...')
  }

  return (
    <>
      <link
        href='https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css'
        rel='stylesheet'
      />
      <style>
        {`
          .payment-failed-container {
            font-family: 'Inter', sans-serif;
            background-color: #f9fafb;
            min-height: 100vh;
            position: relative;
            overflow: hidden;
          }

          .error-card {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 24px;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
            position: relative;
            z-index: 1;
            transform: translateY(20px);
            opacity: 0;
            transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
          }

          .error-card.animate {
            transform: translateY(0);
            opacity: 1;
          }

          .error-icon {
            width: 120px;
            height: 120px;
            background: linear-gradient(135deg, #f87171, #ef4444);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto;
            position: relative;
            transform: scale(0);
            transition: transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          }

          .error-icon.animate {
            transform: scale(1);
          }

          .error-icon::before {
            content: '';
            position: absolute;
            width: 140px;
            height: 140px;
            border: 3px solid rgba(239, 68, 68, 0.3);
            border-radius: 50%;
            animation: pulse 2s infinite;
          }

          @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            100% { transform: scale(1.2); opacity: 0; }
          }

          .content-fade {
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.6s ease-out;
          }

          .content-fade.show {
            opacity: 1;
            transform: translateY(0);
          }

          .btn-gradient-red {
            background: linear-gradient(135deg, #f87171, #ef4444);
            border: none;
            border-radius: 12px;
            padding: 12px 32px;
            font-weight: 600;
            font-size: 1rem;
            color: white;
            transition: all 0.3s ease;
          }

          .btn-gradient-red:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(239, 68, 68, 0.3);
            color: white;
          }

          .btn-outline-custom {
            border: 2px solid #e5e7eb;
            background: transparent;
            color: #6b7280;
            border-radius: 12px;
            padding: 10px 24px;
            font-weight: 500;
            transition: all 0.3s ease;
          }

          .btn-outline-custom:hover {
            border-color: #ef4444;
            color: #ef4444;
            background: rgba(239, 68, 68, 0.05);
          }
        `}
      </style>

      <div className='payment-failed-container d-flex justify-content-center align-items-center'>
        <div className='container'>
          <div className='row justify-content-center'>
            <div className='col-lg-6 col-md-8 col-sm-10'>
              <div className={`error-card p-5 ${showAnimation ? 'animate' : ''}`}>
                <div className={`error-icon ${showAnimation ? 'animate' : ''} mb-4`}>
                  <XCircle color='white' size={56} />
                </div>

                <div className={`text-center content-fade ${showContent ? 'show' : ''}`}>
                  <h1 className='fw-bold mb-3'>Payment Failed</h1>
                  <p className='text-muted mb-4'>
                    We couldn't process your payment. Don't worry, your order is safe and no charges
                    were made.
                  </p>

                  <div className='bg-light border border-danger-subtle rounded-3 p-3 mb-4 text-start'>
                    <h6 className='mb-2 text-danger'>Common reasons:</h6>
                    <ul className='mb-0 text-danger'>
                      <li>Insufficient funds</li>
                      <li>Expired card information</li>
                      <li>Network connectivity issues</li>
                    </ul>
                  </div>

                  {/* <div className='d-flex flex-column flex-sm-row gap-3 justify-content-center mt-4'>
                    <button
                      className='btn btn-gradient-red d-flex align-items-center justify-content-center gap-2'
                      onClick={handleRetryPayment}
                      disabled={isRetrying}
                    >
                      {isRetrying ? (
                        <>
                          <RefreshCw className='spin' size={18} />
                          Retrying...
                        </>
                      ) : (
                        <>
                          <RefreshCw size={18} /> Retry Payment
                        </>
                      )}
                    </button>

                    <button
                      className='btn btn-outline-custom d-flex align-items-center justify-content-center gap-2'
                      onClick={handleContactSupport}
                    >
                      <MessageCircle size={18} /> Contact Support
                    </button>
                  </div>

                  <div className='mt-4'>
                    <button
                      className='btn btn-link text-muted text-decoration-none'
                      onClick={handleGoBack}
                    >
                      <ArrowLeft size={14} className='me-1' /> Go Back to Checkout
                    </button>
                  </div> */}
                  {/* 
                  <div className='mt-4 pt-4 border-top'>
                    <small className='text-muted'>
                      Need immediate help? Call our support team at{' '}
                      <span className='text-danger fw-semibold'>1-800-SUPPORT</span>
                    </small>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default PaymentFailed
